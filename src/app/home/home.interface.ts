export interface TextClassificationResult {
  label: string;
  score: number;
}

export interface MediapipeTextBridgePlugin {
  classifyText(options: {
    text: string;
  }): Promise<TextClassificationResult>;
}

