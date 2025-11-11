import { GoogleGenAI, Part, Type, Modality, GenerateContentResponse } from "@google/genai";
import { SceneStructure } from "../types";

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSceneImageConfigs = (
    sceneStructure: SceneStructure, 
    productName: string,
    additionalBrief: string,
    parts: { product?: Part, model?: Part }
) => {
    // A fixed background for consistency in the new design.
    const background = "modern, clean studio background";
    return sceneStructure.scenes.map(sceneConfig => {
        const requiredParts = sceneConfig.requiredParts.map(partName => {
            if (!parts[partName]) {
                throw new Error(`Missing required image part: ${partName} for scene "${sceneConfig.title}"`);
            }
            return parts[partName]!;
        });
        return { 
            prompt: sceneConfig.imagePrompt(background, productName, additionalBrief),
            parts: requiredParts
        };
    });
};

export const generateUgcImages = async (
  sceneStructure: SceneStructure,
  productName: string,
  additionalBrief: string,
  imageParts: { product: Part, model?: Part }
): Promise<string[]> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash-image';
    const sceneConfigs = getSceneImageConfigs(sceneStructure, productName, additionalBrief, imageParts);

    const imagePromises = sceneConfigs.map(config => 
        ai.models.generateContent({
            model,
            contents: { parts: [...config.parts, { text: config.prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        }).catch(err => {
            console.error("Image generation failed for a scene:", err);
            // Return a specific error object to handle in Promise.all
            return { error: true, message: err.message, details: err.details };
        })
    );

    const responses = await Promise.all(imagePromises);

    return responses.map((response, index) => {
        // FIX: Use a type guard (`'error' in response`) to check for the custom error object.
        // This resolves the TypeScript error because `response.error` is not a property of `GenerateContentResponse`.
        if ('error' in response) {
           throw new Error(`Image generation failed for scene ${index + 1}.`);
        }
        const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
        if (!imagePart?.inlineData) {
            console.error("Image generation response was missing inlineData:", JSON.stringify(response, null, 2));
            throw new Error(`Image generation failed for scene ${index + 1}.`);
        }
        return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    });
};

export const regenerateSingleImage = async (
    sceneId: number,
    sceneStructure: SceneStructure,
    productName: string,
    additionalBrief: string,
    imageParts: { product: Part, model?: Part }
): Promise<string> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash-image';
    const sceneConfigs = getSceneImageConfigs(sceneStructure, productName, additionalBrief, imageParts);
    const config = sceneConfigs[sceneId - 1];

    if (!config) {
        throw new Error(`Invalid sceneId: ${sceneId}`);
    }

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [...config.parts, { text: config.prompt }] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
    if (!imagePart?.inlineData) {
        console.error("Image regeneration response was missing inlineData:", JSON.stringify(response, null, 2));
        throw new Error('Image regeneration failed.');
    }
    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
};

export const generateScript = async (
  sceneStructure: SceneStructure,
  productName: string,
  additionalBrief: string,
): Promise<Record<string, string>> => {
  const ai = getAiClient();
  const model = 'gemini-2.5-pro';
  
  const prompt = sceneStructure.scriptPrompt(productName, additionalBrief);

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                scene1: { type: Type.STRING },
                scene2: { type: Type.STRING },
                scene3: { type: Type.STRING },
                scene4: { type: Type.STRING },
            }
        }
    }
  });

  return JSON.parse(response.text);
};


export const generateVoiceOver = async (fullScript: string): Promise<string> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash-preview-tts';

    const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: `Dengan nada yang ceria dan ramah, bacakan naskah berikut: ${fullScript}` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' }, // A friendly, consistent voice
                },
            },
        },
    });

    const audioPart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (!audioPart?.inlineData?.data) {
        throw new Error('Voice over generation failed.');
    }
    return `data:audio/mpeg;base64,${audioPart.inlineData.data}`;
};

export const generateVideoFromImage = async (
  imageBase64: string,
  animationPrompt: string,
  script: string,
  withBackgroundMusic: boolean
): Promise<string> => {
    const ai = getAiClient();
    const mimeType = imageBase64.split(';')[0].split(':')[1];
    const imageData = imageBase64.split(',')[1];
    
    const baseInstructions = `IMPORTANT INSTRUCTIONS: Ensure the video fills the entire 9:16 aspect ratio frame without any black bars or letterboxing. The style should be simple and authentic, like a real user-generated content (UGC) video. Avoid overly cinematic transitions, dramatic zooms, or complex effects. ${withBackgroundMusic ? 'Add subtle, cinematic background music that fits the mood.' : 'Do not add any background music or sound effects.'}`;

    const fullPrompt = `Based on the provided image, create a short video clip. The voice-over script for this specific scene is: "${script}". The desired animation is: "${animationPrompt}". ${baseInstructions}`;

    if (!window.aistudio || !(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
        if (!(await window.aistudio.hasSelectedApiKey())) {
            throw new Error("API Key not selected. Please select an API key in the settings panel.");
        }
    }

    let operation;
    try {
        operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: fullPrompt,
            image: {
                imageBytes: imageData,
                mimeType: mimeType,
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '9:16'
            }
        });
    } catch(e: any) {
        if (e.message.includes("API key not valid")) {
             throw new Error("API Key not valid. Please select a valid API key.");
        }
        throw e;
    }


    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error('Video generation failed or returned no link.');
    }
    
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        const errorText = await videoResponse.text();
        console.error("Video download failed:", errorText);
        if (errorText.includes("Requested entity was not found.")) {
            throw new Error("Requested entity was not found. Your API Key may be invalid.");
        }
        throw new Error(`Failed to download the generated video. Status: ${videoResponse.status}`);
    }

    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};

export { fileToGenerativePart };