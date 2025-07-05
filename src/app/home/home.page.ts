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
} from '@ionic/angular/standalone';
import {
  MediapipeTextBridgePlugin,
  TextClassificationResult,
} from './home.interface';
import { JsonPipe } from '@angular/common';

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
  ],
})
export class HomePage {
  constructor() {}

  inputText = '';
  result: TextClassificationResult | null = null;

  async onClassify() {
    if (!this.inputText) return;
    try {
      this.result = await classifyText(this.inputText);
      console.warn(this.result);
    } catch (error) {
      console.error(error);
    }
  }
}
