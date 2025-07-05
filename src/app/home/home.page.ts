import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { registerPlugin } from '@capacitor/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonTitle,
  IonToolbar,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';
import {
  MediapipeTextBridgePlugin,
  TextClassificationResult,
} from './home.interface';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LlmService } from '../services/llm.service';

const MediapipeTextBridge = registerPlugin<MediapipeTextBridgePlugin>(
  'MediapipeTextBridge',
);

async function classifyText(text: string): Promise<TextClassificationResult> {
  return MediapipeTextBridge.classifyText({ text });
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonButton,
    FormsModule,
    JsonPipe,
    IonText,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    RouterLink,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
  ],
})
export class HomePage {
  constructor(
    private llmService: LlmService,
  ) {}

  isModelReady = false;
  modelReadyMessage = '';

  async initializeModel() {
    try {
      const result = await this.llmService.initializeModel();
      this.isModelReady = result;
      this.modelReadyMessage = result ? 'Model initialized successfully' : 'Model initialization failed';
    } catch (error) {
      this.isModelReady = false;
      this.modelReadyMessage = (error as any).message || 'Model initialization failed from catch block';
      alert(JSON.stringify(error, null, 2));
    }
  }

  inputText = '';
  result: TextClassificationResult | null = null;

  async onClassify() {
    if (!this.inputText) return;
    try {
      this.result = await classifyText(this.inputText);
      console.warn(this.result);
    } catch (error) {
      console.error(error);
      this.result = error as TextClassificationResult;
      alert(JSON.stringify(error, null, 2));
    }
  }
}
