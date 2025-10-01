export interface GeneratedHTML {
  id: string;
  name: string;
  html: string;
  description: string;
  features: string[];
  createdAt: Date;
  metadata?: {
    inputType: 'figma' | 'image' | 'text';
    originalInput: any;
    aiModel: string;
    generationTime: number;
  };
}

export interface HTMLInput {
  type: 'figma' | 'image' | 'text';
  description: string;
  url?: string;
  file?: File;
  requirements?: string[];
}

export interface HTMLRequirements {
  name: string;
  framework: 'vanilla' | 'bootstrap' | 'tailwind';
  responsive: boolean;
  animations: boolean;
  interactive: boolean;
}

export interface HTMLGeneratorConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  framework: 'vanilla' | 'bootstrap' | 'tailwind';
  onProgress?: (phase: string, message: string, progress: number) => void;
}

export interface GenerationProgress {
  phase?: any;
  stage?: 'analyzing' | 'generating' | 'validating' | 'complete' | 'error';
  message: string;
  progress: number;
}