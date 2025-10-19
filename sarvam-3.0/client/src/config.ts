import { DEFAULT_LANGUAGES } from './utils/languages';

// Default configuration
const defaultConfig = {
  position: 'bottom-right' as const,
  theme: {
    primaryColor: '#4F46E5',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
  },
  agent: {
    name: 'HelperBot',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzRGNDZFNSIvPgogIDx0ZXh0IHg9IjIwIiB5PSIyNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfpbY8L3RleHQ+Cjwvc3ZnPg==',
  },
  enableVoice: true,
  context: 'You are a helpful assistant',
  supportedLanguages: DEFAULT_LANGUAGES,
  defaultLanguage: 'en',
};

// Merge user config with defaults
export function getWidgetConfig() {
  const userConfig = window.AgentWidgetConfig || {};
  
  return {
    position: userConfig.position || defaultConfig.position,
    theme: {
      primaryColor: userConfig.theme?.primaryColor || defaultConfig.theme.primaryColor,
      backgroundColor: userConfig.theme?.backgroundColor || defaultConfig.theme.backgroundColor,
      textColor: userConfig.theme?.textColor || defaultConfig.theme.textColor,
    },
    agent: {
      name: userConfig.agent?.name || defaultConfig.agent.name,
      avatar: userConfig.agent?.avatar || defaultConfig.agent.avatar,
    },
    enableVoice: userConfig.enableVoice !== undefined ? userConfig.enableVoice : defaultConfig.enableVoice,
    context: userConfig.context || defaultConfig.context,
    supportedLanguages: userConfig.supportedLanguages || defaultConfig.supportedLanguages,
    defaultLanguage: userConfig.defaultLanguage || defaultConfig.defaultLanguage,
  };
}

// Get position styles based on config
export function getPositionStyles(position: string) {
  const baseStyles = {
    position: 'fixed' as const,
    zIndex: 999999,
  };

  switch (position) {
    case 'bottom-left':
      return { ...baseStyles, bottom: '20px', left: '20px' };
    case 'top-right':
      return { ...baseStyles, top: '20px', right: '20px' };
    case 'top-left':
      return { ...baseStyles, top: '20px', left: '20px' };
    case 'bottom-right':
    default:
      return { ...baseStyles, bottom: '20px', right: '20px' };
  }
}
