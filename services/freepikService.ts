import { PromptStyle, SceneStructure } from "../types";

const DIRECT_FREEPIK_API_BASE_URL = "https://api.freepik.com/v1";

const sanitizeBaseUrl = (value: string) => value.replace(/\/+$/, "");

const resolveInitialBaseUrl = () => {
  const explicitBase = import.meta.env.VITE_FREEPIK_API_BASE_URL;
  if (explicitBase) {
    return sanitizeBaseUrl(explicitBase);
  }

  if (import.meta.env.DEV) {
    return "/api/freepik";
  }

  return DIRECT_FREEPIK_API_BASE_URL;
};

let activeApiBaseUrl = resolveInitialBaseUrl();

const getBaseUrlCandidates = () => {
  const candidates = [activeApiBaseUrl];

  if (!activeApiBaseUrl.startsWith("http")) {
    candidates.push(DIRECT_FREEPIK_API_BASE_URL);
  }

  return [...new Set(candidates)].map((candidate) => sanitizeBaseUrl(candidate));
};

const joinUrl = (baseUrl: string, path: string) => {
  const normalizedBase = sanitizeBaseUrl(baseUrl);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

const performFreepikRequest = async (
  path: string,
  init: RequestInit,
  context: string
) => {
  const candidates = getBaseUrlCandidates();
  let lastNetworkError: unknown = null;

  for (const base of candidates) {
    const url = joinUrl(base, path);
    try {
      const response = await fetch(url, init);
      if (base !== activeApiBaseUrl) {
        console.info(
          `[Freepik] Switching API base URL to "${base}" after successful fallback for ${context}.`
        );
        activeApiBaseUrl = base;
      }
      return response;
    } catch (error: any) {
      const isNetworkError =
        error instanceof TypeError || error?.name === "TypeError";

      if (!isNetworkError) {
        throw error;
      }

      lastNetworkError = error;
      console.warn(
        `[Freepik] Network error when calling ${url} (${context}). Trying next base URL...`,
        error
      );
    }
  }

  console.error(
    `[Freepik] Exhausted all API base URL attempts for ${context}.`,
    lastNetworkError
  );
  throw new Error(
    "Tidak dapat terhubung ke Freepik API. Periksa koneksi internet atau konfigurasi proxy Anda."
  );
};

const FREEPIK_TEXT_TO_IMAGE_PATH =
  "/text-to-image/google/gemini-2.5-flash-image-preview";
const FREEPIK_SEEDANCE_PATH = "/image-to-video/seedance-pro-1080p";

const DEFAULT_NEGATIVE_PROMPT = "text, watermark, logo, words";

const fileToGenerativePart = async (file: File): Promise<string> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
  return base64EncodedDataPromise;
};

const extractBase64Data = (dataUrl?: string) => {
  if (!dataUrl) return undefined;
  const [, base64] = dataUrl.split(",");
  return base64;
};

const getFreepikApiKey = () => {
  const apiKey = import.meta.env.VITE_FREEPIK_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Freepik API key is required. Please set VITE_FREEPIK_API_KEY in your .env file."
    );
  }

  return apiKey;
};

const freepikHeaders = (apiKey: string) => ({
  "Content-Type": "application/json",
  "x-freepik-api-key": apiKey,
});

interface SceneImageConfig {
  prompt: string;
  requiresProduct: boolean;
  requiresModel: boolean;
}

const getSceneImageConfigs = (
  sceneStructure: SceneStructure,
  promptStyle: PromptStyle,
  productName: string,
  additionalBrief: string
): SceneImageConfig[] => {
  return sceneStructure.scenes.map((sceneConfig) => ({
    prompt: sceneConfig.imagePrompt(promptStyle, productName, additionalBrief),
    requiresProduct: sceneConfig.requiredParts.includes("product"),
    requiresModel: sceneConfig.requiredParts.includes("model"),
  }));
};

const extractImageFromPayload = (payload: any): string | null => {
  if (!payload) return null;

  const candidates = [
    payload?.data?.[0]?.b64_json,
    payload?.data?.[0]?.images?.[0]?.b64_json,
    payload?.data?.[0]?.images?.[0]?.base64,
    payload?.images?.[0]?.b64_json,
    payload?.result?.[0]?.image_base64,
  ];

  return candidates.find((item) => typeof item === "string" && item.length > 0) || null;
};

export const generateUgcImages = async (
  sceneStructure: SceneStructure,
  promptStyle: PromptStyle,
  productName: string,
  additionalBrief: string,
  imageParts: { product: string; model?: string }
): Promise<string[]> => {
  const apiKey = getFreepikApiKey();
  const sceneConfigs = getSceneImageConfigs(
    sceneStructure,
    promptStyle,
    productName,
    additionalBrief
  );

  const imagePromises = sceneConfigs.map(async (config, index) => {
    const referenceImages: string[] = [];

    if (config.requiresProduct) {
      if (!imageParts.product) {
        throw new Error("Product image is required for this scene.");
      }
      const productBase64 = extractBase64Data(imageParts.product);
      if (!productBase64) {
        throw new Error("Product image is invalid or missing.");
      }
      referenceImages.push(productBase64);
    }

    if (config.requiresModel) {
      if (!imageParts.model) {
        throw new Error("Model image is required for this scene.");
      }
      const modelBase64 = extractBase64Data(imageParts.model);
      if (!modelBase64) {
        throw new Error("Model image is invalid or missing.");
      }
      referenceImages.push(modelBase64);
    }

    const body: Record<string, any> = {
      prompt: config.prompt.trim(),
      aspect_ratio: "9:16",
      guidance_scale: 7,
      num_images: 1,
      safety_filter: true,
      negative_prompt: [
        DEFAULT_NEGATIVE_PROMPT,
        promptStyle.negativePrompt || "",
      ]
        .filter(Boolean)
        .join(", "),
    };

    if (referenceImages.length > 0) {
      body.reference_images = referenceImages;
    }

    const response = await performFreepikRequest(
      FREEPIK_TEXT_TO_IMAGE_PATH,
      {
        method: "POST",
        headers: freepikHeaders(apiKey),
        body: JSON.stringify(body),
      },
      `scene ${index + 1} image generation`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Freepik image generation failed for scene ${index + 1}:`, errorText);
      throw new Error("Gagal membuat gambar dengan Freepik API.");
    }

    const payload = await response.json();
    const imageBase64 = extractImageFromPayload(payload);

    if (!imageBase64) {
      console.error("Unexpected Freepik response payload:", payload);
      throw new Error(`Image generation failed for scene ${index + 1}.`);
    }

    return `data:image/png;base64,${imageBase64}`;
  });

  return Promise.all(imagePromises);
};

export const regenerateSingleImage = async (
  sceneId: number,
  sceneStructure: SceneStructure,
  promptStyle: PromptStyle,
  productName: string,
  additionalBrief: string,
  imageParts: { product: string; model?: string }
): Promise<string> => {
  const apiKey = getFreepikApiKey();
  const sceneConfigs = getSceneImageConfigs(
    sceneStructure,
    promptStyle,
    productName,
    additionalBrief
  );
  const config = sceneConfigs[sceneId - 1];

  if (!config) {
    throw new Error(`Invalid sceneId: ${sceneId}`);
  }

  const referenceImages: string[] = [];

  if (config.requiresProduct) {
    if (!imageParts.product) {
      throw new Error("Product image is required for this scene.");
    }
    const productBase64 = extractBase64Data(imageParts.product);
    if (!productBase64) {
      throw new Error("Product image is invalid or missing.");
    }
    referenceImages.push(productBase64);
  }

  if (config.requiresModel) {
    if (!imageParts.model) {
      throw new Error("Model image is required for this scene.");
    }
    const modelBase64 = extractBase64Data(imageParts.model);
    if (!modelBase64) {
      throw new Error("Model image is invalid or missing.");
    }
    referenceImages.push(modelBase64);
  }

  const body: Record<string, any> = {
    prompt: config.prompt.trim(),
    aspect_ratio: "9:16",
    guidance_scale: 7,
    num_images: 1,
    safety_filter: true,
    negative_prompt: [DEFAULT_NEGATIVE_PROMPT, promptStyle.negativePrompt || ""]
      .filter(Boolean)
      .join(", "),
  };

  if (referenceImages.length > 0) {
    body.reference_images = referenceImages;
  }

  const response = await performFreepikRequest(
    FREEPIK_TEXT_TO_IMAGE_PATH,
    {
      method: "POST",
      headers: freepikHeaders(apiKey),
      body: JSON.stringify(body),
    },
    `scene ${sceneId} image regeneration`
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Freepik image regeneration failed for scene ${sceneId}:`, errorText);
    throw new Error("Gagal membuat ulang gambar dengan Freepik API.");
  }

  const payload = await response.json();
  const imageBase64 = extractImageFromPayload(payload);

  if (!imageBase64) {
    console.error("Unexpected Freepik response payload:", payload);
    throw new Error("Image regeneration failed.");
  }

  return `data:image/png;base64,${imageBase64}`;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateVideoFromImage = async (
  imageBase64: string,
  animationPrompt: string,
  script: string,
  withBackgroundMusic: boolean
): Promise<string> => {
  const apiKey = getFreepikApiKey();

  const imageData = extractBase64Data(imageBase64);
  if (!imageData) {
    throw new Error("Invalid image data.");
  }

  const baseInstructions =
    "IMPORTANT INSTRUCTIONS: Ensure the video fills the entire 9:16 aspect ratio frame without any black bars or letterboxing. " +
    "Keep the motion natural, smooth, and focused on highlighting the product. Avoid cinematic transitions or heavy VFX." +
    (withBackgroundMusic
      ? " Add subtle, modern background music that complements the UGC style."
      : " Do not add background music or sound effects.");

  const fullPrompt = `Based on the provided image, create a short video clip. The voice-over script for this specific scene is: "${script}". The desired animation is: "${animationPrompt}". ${baseInstructions}`;

  const createResponse = await performFreepikRequest(
    FREEPIK_SEEDANCE_PATH,
    {
      method: "POST",
      headers: freepikHeaders(apiKey),
      body: JSON.stringify({
        prompt: fullPrompt,
        image_base64: imageData,
        aspect_ratio: "9:16",
        resolution: "1080p",
        background_music: withBackgroundMusic ? "cinematic" : "none",
      }),
    },
    "Seedance job creation"
  );

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    console.error("Seedance job creation failed:", errorText);
    throw new Error("Gagal membuat video dengan Freepik Seedance API.");
  }

  const createPayload = await createResponse.json();
  const taskId = createPayload?.data?.id || createPayload?.id || createPayload?.task_id;
  if (!taskId) {
    console.error("Unexpected Seedance create payload:", createPayload);
    throw new Error("Video generation failed to start.");
  }

  const maxAttempts = 60; // ~5 minutes polling window
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await wait(5000);

    const statusResponse = await performFreepikRequest(
      `${FREEPIK_SEEDANCE_PATH}/${taskId}`,
      {
        method: "GET",
        headers: freepikHeaders(apiKey),
      },
      "Seedance status polling"
    );

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      console.error("Seedance status check failed:", errorText);
      throw new Error("Gagal memeriksa status pembuatan video Freepik.");
    }

    const statusPayload = await statusResponse.json();
    const status =
      statusPayload?.data?.status ||
      statusPayload?.status ||
      statusPayload?.data?.state ||
      "";

    if (["succeeded", "finished", "completed"].includes(status)) {
      const videoUrl =
        statusPayload?.data?.video_url ||
        statusPayload?.data?.result?.video_url ||
        statusPayload?.video_url;
      if (!videoUrl) {
        console.error("Seedance success payload missing video URL:", statusPayload);
        throw new Error("Video generation succeeded but no URL was returned.");
      }
      return videoUrl;
    }

    if (["failed", "error", "cancelled"].includes(status)) {
      console.error("Seedance job failed:", statusPayload);
      throw new Error("Video generation failed.");
    }
  }

  throw new Error("Video generation timed out.");
};

export { fileToGenerativePart };
