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
} from '@ionic/angular/standalone';
import {
  MediapipeTextBridgePlugin,
  TextClassificationResult,
} from './home.interface';

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
  ],
})
export class HomePage {
  constructor() {}

  inputText = '';
  result: TextClassificationResult | null = null;

  async onClassify() {
    if (!this.inputText) return;
    this.result = await classifyText(this.inputText);
  }
}
