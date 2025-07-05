export interface InitializeModelResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface GenerateTextResult {
  success: boolean;
  response?: string;
  error?: string;
}

export interface IsModelReadyResult {
  ready: boolean;
}

export interface GemmaLLMPlugin {
  initializeModel(): Promise<InitializeModelResult>;
  generateText(options: { prompt: string }): Promise<GenerateTextResult>;
  isModelReady(): Promise<IsModelReadyResult>;
}
