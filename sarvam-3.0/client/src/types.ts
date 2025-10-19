export interface AgentWidgetConfig {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  agent?: {
    name?: string;
    avatar?: string;
  };
  enableVoice?: boolean;
  context?: string;
  supportedLanguages?: Language[];
  defaultLanguage?: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  voiceCode: string; // For speech recognition
}

export interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

// For storage compatibility
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface WidgetState {
  isOpen: boolean;
  isMinimized: boolean;
  messages: Message[];
  isLoading: boolean;
}

// Extend the Window interface to include our config
declare global {
  interface Window {
    AgentWidgetConfig?: AgentWidgetConfig;
  }
}