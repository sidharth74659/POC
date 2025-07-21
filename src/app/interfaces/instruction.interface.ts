export interface Instruction {
  instruction: string;
  action: string;
  route: string;
  parameters: Record<string, any>;
  success: boolean;
}

export interface ApiResponse {
  data: Instruction;
  message?: string;
  error?: string;
}

export interface UserInput {
  text: string;
  timestamp: Date;
  inputType: 'voice' | 'text';
} 