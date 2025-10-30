export interface AIRequest {
  provider: 'openai' | 'anthropic' | 'google' | 'stability';
  model: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIStreamChunk {
  text: string;
  done?: boolean;
}

export interface AIProvider {
  stream(request: AIRequest, onChunk: (chunk: AIStreamChunk) => void): Promise<void>;
}
