import type { AIProvider, AIRequest, AIStreamChunk } from './types';

export class OpenAIProvider implements AIProvider {
  async stream(request: AIRequest, onChunk: (chunk: AIStreamChunk) => void): Promise<void> {
    // Placeholder streaming to simulate provider
    const text = `OpenAI(${request.model}): ${request.prompt}`;
    for (const part of chunkText(text, 12)) {
      await delay(50);
      onChunk({ text: part });
    }
    onChunk({ text: '', done: true });
  }
}

export class AnthropicProvider implements AIProvider {
  async stream(request: AIRequest, onChunk: (chunk: AIStreamChunk) => void): Promise<void> {
    const text = `Anthropic(${request.model}): ${request.prompt}`;
    for (const part of chunkText(text, 12)) {
      await delay(50);
      onChunk({ text: part });
    }
    onChunk({ text: '', done: true });
  }
}

export class GoogleAIProvider implements AIProvider {
  async stream(request: AIRequest, onChunk: (chunk: AIStreamChunk) => void): Promise<void> {
    const text = `GoogleAI(${request.model}): ${request.prompt}`;
    for (const part of chunkText(text, 12)) {
      await delay(50);
      onChunk({ text: part });
    }
    onChunk({ text: '', done: true });
  }
}

export class StabilityAIProvider implements AIProvider {
  async stream(request: AIRequest, onChunk: (chunk: AIStreamChunk) => void): Promise<void> {
    const text = `StabilityAI(${request.model}): ${request.prompt}`;
    for (const part of chunkText(text, 12)) {
      await delay(50);
      onChunk({ text: part });
    }
    onChunk({ text: '', done: true });
  }
}

export function providerFactory(name: AIRequest['provider']): AIProvider {
  switch (name) {
    case 'openai':
      return new OpenAIProvider();
    case 'anthropic':
      return new AnthropicProvider();
    case 'google':
      return new GoogleAIProvider();
    case 'stability':
      return new StabilityAIProvider();
  }
}

function chunkText(text: string, size: number) {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
