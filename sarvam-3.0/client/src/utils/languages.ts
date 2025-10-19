import { Language } from '../types';

// Default supported languages
export const DEFAULT_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    voiceCode: 'en-US'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    voiceCode: 'hi-IN'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    voiceCode: 'es-ES'
  }
];

// Language-specific prompts
export const LANGUAGE_PROMPTS = {
  en: 'Please respond in English.',
  hi: 'कृपया हिंदी में जवाब दें। (Please respond in Hindi)',
  es: 'Por favor responde en español. (Please respond in Spanish)'
};

// Get language prompt for Gemini
export function getLanguagePrompt(languageCode: string): string {
  return LANGUAGE_PROMPTS[languageCode as keyof typeof LANGUAGE_PROMPTS] || LANGUAGE_PROMPTS.en;
}

// Get language name
export function getLanguageName(languageCode: string, languages: Language[]): string {
  const lang = languages.find(l => l.code === languageCode);
  return lang ? lang.nativeName : 'English';
}

// Get voice code for speech recognition
export function getVoiceCode(languageCode: string, languages: Language[]): string {
  const lang = languages.find(l => l.code === languageCode);
  return lang ? lang.voiceCode : 'en-US';
}

// Store language preference
const LANGUAGE_STORAGE_KEY = 'sarvam-widget-language';

export function saveLanguagePreference(languageCode: string): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
  } catch (error) {
    console.warn('Failed to save language preference:', error);
  }
}

export function loadLanguagePreference(): string | null {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to load language preference:', error);
    return null;
  }
}
