import { Injectable } from '@angular/core';
import { registerPlugin } from '@capacitor/core';
import { GemmaLLMPlugin } from './gemma-llm.interface';

const GemmaLLM = registerPlugin<GemmaLLMPlugin>('GemmaLLM');

@Injectable({
  providedIn: 'root',
})
export class LlmService {
  private modelReady = false;

  constructor() {}

  async initializeModel(): Promise<boolean> {
    try {
      const result = await GemmaLLM.initializeModel();
      this.modelReady = result.success;
      return result.success;
    } catch (error) {
      alert(JSON.stringify(error, null, 2));
      console.error('Failed to initialize model:', error);
      return false;
    }
  }

  async generateText(prompt: string): Promise<string | null> {
    if (!this.modelReady) {
      throw new Error('Model not initialized. Call initializeModel() first.');
    }

    try {
      const result = await GemmaLLM.generateText({ prompt });
      if (result.success) {
        return result.response || null;
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      alert(JSON.stringify(error, null, 2));
      console.error('Failed to generate text:', error);
      throw error;
    }
  }

  async isModelReady(): Promise<boolean> {
    try {
      const result = await GemmaLLM.isModelReady();
      this.modelReady = result.ready;
      return result.ready;
    } catch (error) {
      alert(JSON.stringify(error, null, 2));
      console.error('Failed to check model status:', error);
      return false;
    }
  }
}
