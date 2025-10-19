export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface StoredChatHistory {
  messages: ChatMessage[];
  lastUpdated: string;
  context: string;
}

const STORAGE_KEY = 'sarvam-widget-chat-history';
const MAX_MESSAGES = 50; // Limit stored messages to prevent localStorage bloat

// Save chat history to localStorage
export function saveChatHistory(messages: ChatMessage[], context: string): void {
  try {
    const history: StoredChatHistory = {
      messages: messages.slice(-MAX_MESSAGES), // Keep only recent messages
      lastUpdated: new Date().toISOString(),
      context
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.warn('Failed to save chat history to localStorage:', error);
  }
}

// Load chat history from localStorage
export function loadChatHistory(): StoredChatHistory | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const history: StoredChatHistory = JSON.parse(stored);
    
    // Convert timestamp strings back to Date objects
    history.messages = history.messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
    
    return history;
  } catch (error) {
    console.warn('Failed to load chat history from localStorage:', error);
    return null;
  }
}

// Clear chat history from localStorage
export function clearChatHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear chat history from localStorage:', error);
  }
}

// Check if chat history exists
export function hasChatHistory(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

// Convert our ChatMessage format to simple format for Gemini API
export function convertToGeminiHistory(messages: ChatMessage[]): Array<{role: string, content: string}> {
  return messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    content: msg.content
  }));
}
