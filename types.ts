export enum ViewMode {
  CONCEPTS = 'CONCEPTS',
  PLAYGROUND = 'PLAYGROUND',
  CHAT = 'CHAT'
}

export interface FractalConfig {
  maxIterations: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
  colorScheme: 'fire' | 'ice' | 'neon';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ConceptCard {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  promptSuggestions: string[];
}