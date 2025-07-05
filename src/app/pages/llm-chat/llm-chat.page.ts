import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonTextarea,
  IonButton,
  IonIcon,
  IonSpinner,
  IonChip,
  IonLabel,
  IonFooter,
} from '@ionic/angular/standalone';
import { LlmService } from '../../services/llm.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgFor, NgIf } from '@angular/common';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-llm-chat',
  templateUrl: './llm-chat.page.html',
  styleUrls: ['./llm-chat.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonItem,
    IonTextarea,
    IonButton,
    IonIcon,
    IonChip,
    IonLabel,
    IonSpinner,
    IonFooter,
    FormsModule,
    DatePipe,
    NgFor,
    NgIf
  ],
})
export class LlmChatPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  messages: ChatMessage[] = [];
  currentMessage = '';
  isModelReady = false;
  isGenerating = false;

  constructor(
    private llmService: LlmService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) {}

  async ngOnInit() {
    await this.initializeModel();
  }

  async initializeModel() {
    const loading = await this.loadingCtrl.create({
      message: 'Initializing Gemma 3n model...',
      spinner: 'dots',
    });
    await loading.present();

    try {
      const success = await this.llmService.initializeModel();
      if (success) {
        this.isModelReady = true;
        this.addMessage('Model initialized! You can start chatting.', false);
      } else {
        await this.showError('Failed to initialize model');
      }
    } catch (error) {
      await this.showError('Error initializing model: ' + error);
    } finally {
      await loading.dismiss();
    }
  }

  async sendMessage() {
    if (
      !this.currentMessage.trim() ||
      !this.isModelReady ||
      this.isGenerating
    ) {
      return;
    }

    const userMessage = this.currentMessage.trim();
    this.addMessage(userMessage, true);
    this.currentMessage = '';
    this.isGenerating = true;

    try {
      const response = await this.llmService.generateText(userMessage);
      if (response) {
        this.addMessage(response, false);
      } else {
        this.addMessage("Sorry, I couldn't generate a response.", false);
      }
    } catch (error) {
      this.addMessage('Error: ' + error, false);
    } finally {
      this.isGenerating = false;
    }

    this.scrollToBottom();
  }

  private addMessage(text: string, isUser: boolean) {
    this.messages.push({
      text,
      isUser,
      timestamp: new Date(),
    });
    setTimeout(() => this.scrollToBottom(), 100);
  }

  private scrollToBottom() {
    this.content.scrollToBottom(300);
  }

  private async showError(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
