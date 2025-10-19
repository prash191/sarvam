import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { sendMessageToGemini, initGeminiChat, resetChatSession } from '../api/gemini';
import { 
  saveChatHistory, 
  loadChatHistory, 
  clearChatHistory
} from '../utils/storage';
import { getVoiceRecorder } from '../utils/voiceRecording';
import { 
  getLanguagePrompt, 
  getVoiceCode, 
  saveLanguagePreference, 
  loadLanguagePreference 
} from '../utils/languages';
import { Language } from '../types';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  agentAvatar: string;
  primaryColor: string;
  enableVoice: boolean;
  context: string;
  supportedLanguages: Language[];
  defaultLanguage: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  agentName,
  agentAvatar,
  primaryColor,
  enableVoice,
  context,
  supportedLanguages,
  defaultLanguage
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasContextMemory, setHasContextMemory] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>(defaultLanguage);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat session and load history on mount
  useEffect(() => {
    if (!isInitialized) {
      // Load saved language preference
      const savedLang = loadLanguagePreference();
      if (savedLang && supportedLanguages.find(l => l.code === savedLang)) {
        setCurrentLanguage(savedLang);
      }
      
      initializeChat();
      setIsInitialized(true);
      
      // Check voice support
      const voiceRecorder = getVoiceRecorder();
      setIsVoiceSupported(voiceRecorder.isVoiceSupported());
      
      // Set initial voice recognition language
      const voiceCode = getVoiceCode(currentLanguage, supportedLanguages);
      voiceRecorder.setLanguage(voiceCode);
    }
  }, [isInitialized]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const initializeChat = () => {
    const storedHistory = loadChatHistory();
    
    if (storedHistory && storedHistory.messages.length > 0 && storedHistory.context === context) {
      // Load existing conversation
      const uiMessages: Message[] = storedHistory.messages.map(msg => ({
        id: msg.id,
        type: msg.role === 'user' ? 'user' : 'agent',
        content: msg.content,
        timestamp: new Date(msg.timestamp)
      }));
      
      setMessages(uiMessages);
      setHasContextMemory(true);
      
      // Initialize Gemini with context - let Gemini handle the conversation memory
      initGeminiChat(context);
    } else {
      // Start fresh conversation
      const welcomeMessage: Message = {
        id: '1',
        type: 'agent',
        content: `Hi! I'm ${agentName}. How can I help you today?`,
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
      setHasContextMemory(false);
      
      // Initialize Gemini with context
      initGeminiChat(context);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const saveMessagesToStorage = (allMessages: Message[]) => {
    // Convert UI messages to storage format (skip welcome message if it's the only one)
    const messagesToSave = allMessages.length === 1 && allMessages[0].id === '1' 
      ? [] 
      : allMessages.filter(msg => msg.id !== '1').map(msg => ({
          id: msg.id,
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content,
          timestamp: msg.timestamp
        }));
    
    saveChatHistory(messagesToSave, context);
    setHasContextMemory(messagesToSave.length > 0);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // Add language prompt to the message
      const languagePrompt = getLanguagePrompt(currentLanguage);
      const messageWithLanguage = `${languagePrompt}\n\n${inputValue}`;
      
      // Send message to Gemini
      const response = await sendMessageToGemini(messageWithLanguage);
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: response,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, agentMessage];
      setMessages(finalMessages);
      
      // Save to localStorage
      saveMessagesToStorage(finalMessages);
      
    } catch (error) {
      console.error('Error getting response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearMemory = () => {
    if (window.confirm('Clear chat history and start fresh? This cannot be undone.')) {
      clearChatHistory();
      resetChatSession();
      
      const welcomeMessage: Message = {
        id: '1',
        type: 'agent',
        content: `Hi! I'm ${agentName}. How can I help you today?`,
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
      setHasContextMemory(false);
      
      // Reinitialize with fresh session
      initGeminiChat(context);
    }
  };

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    saveLanguagePreference(languageCode);
    
    // Update voice recognition language
    const voiceCode = getVoiceCode(languageCode, supportedLanguages);
    const voiceRecorder = getVoiceRecorder();
    voiceRecorder.setLanguage(voiceCode);
    
    // Show confirmation message
    const langName = supportedLanguages.find(l => l.code === languageCode)?.nativeName || 'English';
    console.log(`🌐 Language changed to: ${langName}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper function to send voice-transcribed text through existing chat pipeline
  const sendVoiceMessage = async (transcribedText: string) => {
    if (!transcribedText.trim()) return;

    console.log('🎤 Processing voice message:', transcribedText);

    // Use the same message creation logic as handleSendMessage
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: transcribedText,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Add language prompt to the message
      const languagePrompt = getLanguagePrompt(currentLanguage);
      const messageWithLanguage = `${languagePrompt}\n\n${transcribedText}`;
      
      // Send to Gemini using existing pipeline
      const response = await sendMessageToGemini(messageWithLanguage);
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: response,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, agentMessage];
      setMessages(finalMessages);
      
      // Save to localStorage using existing logic
      saveMessagesToStorage(finalMessages);
      
    } catch (error) {
      console.error('Error processing voice message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: 'Sorry, I encountered an error processing your voice message.',
        timestamp: new Date()
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (!enableVoice || !isVoiceSupported) {
      if (!isVoiceSupported) {
        setVoiceError('Voice recording is not supported in this browser');
      }
      return;
    }
    
    const voiceRecorder = getVoiceRecorder();
    
    if (isRecording) {
      // Stop recording
      console.log('🎤 Stopping voice recording...');
      voiceRecorder.stopRecording();
      setIsRecording(false);
      setVoiceError(null);
    } else {
      // Start recording
      console.log('🎤 Starting voice recording...');
      setVoiceError(null);
      
      voiceRecorder.startRecording(
        // onResult: speech was successfully transcribed
        (transcribedText: string) => {
          console.log('🎤 Voice transcribed:', transcribedText);
          setIsRecording(false);
          setVoiceError(null);
          
          // Send transcribed text through existing chat pipeline
          sendVoiceMessage(transcribedText);
        },
        // onError: something went wrong
        (error: string) => {
          console.error('🎤 Voice error:', error);
          setIsRecording(false);
          setVoiceError(error);
        },
        // onStart: recording started successfully  
        () => {
          setIsRecording(true);
          setVoiceError(null);
          console.log('🎤 Voice recording active');
        },
        // onEnd: recording ended
        () => {
          setIsRecording(false);
          console.log('🎤 Voice recording stopped');
        }
      );
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="chat-window opening" style={{ '--primary-color': primaryColor } as React.CSSProperties}>
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <img src={agentAvatar} alt={agentName} className="chat-avatar" />
          <div className="chat-agent-details">
            <div className="chat-agent-name">{agentName}</div>
            {hasContextMemory && (
              <div className="context-indicator">
                <span className="context-dot">●</span>
                <span className="context-text">Context Active</span>
              </div>
            )}
          </div>
        </div>
        <div className="chat-header-actions">
          {/* Language Selector */}
          <select 
            className="language-selector"
            value={currentLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            aria-label="Select language"
            title="Choose language"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName}
              </option>
            ))}
          </select>
          
          {hasContextMemory && (
            <button 
              className="clear-memory-button" 
              onClick={handleClearMemory}
              aria-label="Clear chat memory"
              title="Clear chat history"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </button>
          )}
          <button className="chat-close-button" onClick={onClose} aria-label="Close chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6L18 18" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-bubble">
              {message.content}
            </div>
            <div className="message-time">
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message agent">
            <div className="message-bubble">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Error Display */}
      {voiceError && (
        <div className="voice-error">
          <span className="voice-error-text">{voiceError}</span>
          <button 
            className="voice-error-close"
            onClick={() => setVoiceError(null)}
            aria-label="Close error"
          >
            ×
          </button>
        </div>
      )}

      {/* Input */}
      <div className="chat-input-container">
        {enableVoice && (
          <button 
            className={`voice-button ${isRecording ? 'recording' : ''} ${!isVoiceSupported ? 'disabled' : ''}`}
            onClick={handleVoiceToggle}
            disabled={!isVoiceSupported || isLoading}
            aria-label={
              !isVoiceSupported 
                ? 'Voice recording not supported' 
                : isRecording 
                  ? 'Stop voice recording' 
                  : 'Start voice recording'
            }
            title={
              !isVoiceSupported 
                ? 'Voice recording is not supported in this browser' 
                : isRecording 
                  ? 'Click to stop recording' 
                  : 'Click and speak your message'
            }
          >
            <svg className="voice-icon" viewBox="0 0 24 24">
              {isRecording ? (
                // Recording icon (square)
                <rect x="9" y="9" width="6" height="6" fill="currentColor"/>
              ) : (
                // Microphone icon
                <>
                  <path d="M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </>
              )}
            </svg>
            {isRecording && (
              <span className="recording-pulse"></span>
            )}
          </button>
        )}
        
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        
        <button 
          className="chat-send-button"
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          aria-label="Send message"
        >
          <svg className="send-icon" viewBox="0 0 24 24">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
      </div>
    </div>
  );
};