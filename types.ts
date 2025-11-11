export enum GenerationStatus {
  PENDING = 'PENDING',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  IMAGE_READY = 'IMAGE_READY',
  GENERATING_VIDEO = 'GENERATING_VIDEO',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface Scene {
  id: number;
  title: string;
  description: string;
  image: string; // base64 data URL
  script: string;
  videoUrl?: string; // blob URL
  status: GenerationStatus;
  errorMessage?: string;
  videoPrompt: string;
}

export interface PromptStyle {
  id: string;
  name: string;
  description: string;
  background: string;
  visualTone: string;
  videoMood: string;
  promptSuffix?: string;
  negativePrompt?: string;
}

export interface SceneStructure {
    id: string;
    name: string;
    description: string;
    scenes: {
        title: string;
        description: string;
        imagePrompt: (
          promptStyle: PromptStyle,
          productName: string,
          additionalBrief: string
        ) => string;
        videoPromptSuggestion: (
          productName: string,
          additionalBrief: string,
          promptStyle: PromptStyle
        ) => string;
        requiredParts: ('product' | 'model')[];
    }[];
}