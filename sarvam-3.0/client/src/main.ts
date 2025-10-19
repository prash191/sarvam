import React from 'react';
import { createRoot } from 'react-dom/client';
import { Widget } from './components/Widget';
import './styles.css';

// Import CSS as text for Shadow DOM
const styleText = `
/* Reset and base styles for the widget */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.widget-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

/* Chat Button Styles */
.chat-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  background: linear-gradient(135deg, var(--primary-color, #4F46E5) 0%, #7C3AED 100%);
}

.chat-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.chat-button-icon {
  width: 24px;
  height: 24px;
  fill: white;
}

/* Chat Window Styles */
.chat-window {
  width: 380px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  transform-origin: bottom right;
}

.chat-window.opening {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Chat Header */
.chat-header {
  background: var(--primary-color, #4F46E5);
  color: white;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.chat-agent-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chat-agent-name {
  font-weight: 600;
  font-size: 16px;
}

.context-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  opacity: 0.9;
}

.context-dot {
  color: #10b981;
  font-size: 8px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.context-text {
  font-size: 11px;
  font-weight: 500;
}

.chat-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.language-selector {
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 13px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
}

.language-selector:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.language-selector:focus {
  background-color: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.6);
}

.language-selector option {
  background-color: #1f2937;
  color: white;
}

.clear-memory-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: background-color 0.2s;
  opacity: 0.8;
}

.clear-memory-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  opacity: 1;
}

.chat-close-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.chat-close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Chat Messages */
.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 8px;
  max-width: 80%;
}

.message.user {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
}

.message.agent .message-bubble {
  background-color: #f3f4f6;
  color: #1f2937;
}

.message.user .message-bubble {
  background-color: var(--primary-color, #4F46E5);
  color: white;
}

.message-time {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
  text-align: right;
}

.message.user .message-time {
  text-align: left;
}

/* Chat Input */
.chat-input-container {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 8px;
  align-items: center;
}

.chat-input {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input:focus {
  border-color: var(--primary-color, #4F46E5);
}

.chat-send-button {
  background: var(--primary-color, #4F46E5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-send-button:hover {
  background: #3730a3;
}

.chat-send-button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.send-icon {
  width: 16px;
  height: 16px;
  fill: white;
}

/* Voice Button */
.voice-button {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.voice-button:hover {
  border-color: var(--primary-color, #4F46E5);
}

.voice-button.recording {
  background: #ef4444;
  border-color: #ef4444;
  animation: recordingPulse 1.5s infinite;
}

.voice-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.voice-button.disabled:hover {
  border-color: #d1d5db;
}

.voice-icon {
  width: 16px;
  height: 16px;
  fill: #6b7280;
  stroke: #6b7280;
  stroke-width: 1;
}

.voice-button.recording .voice-icon {
  fill: white;
  stroke: white;
}

.recording-pulse {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  border: 2px solid #ef4444;
  animation: pulseRing 1.5s infinite;
}

@keyframes recordingPulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
  }
}

@keyframes pulseRing {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

/* Voice Error Display */
.voice-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 8px 12px;
  margin: 8px 16px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  animation: slideDown 0.3s ease-out;
}

.voice-error-text {
  flex: 1;
  margin-right: 8px;
}

.voice-error-close {
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  font-size: 16px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  transition: background-color 0.2s;
}

.voice-error-close:hover {
  background-color: rgba(220, 38, 38, 0.1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading Animation */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  background-color: #9ca3af;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) { animation-delay: -0.32s; }
.typing-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Scrollbar Styling */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
`;

class SarvamWidget {
  private shadowHost: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private root: any = null;

  constructor() {
    // Initialize the widget when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  private init(): void {
    try {
      this.createShadowDOM();
      this.injectStyles();
      this.renderWidget();
      console.log('Sarvam Widget initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Sarvam Widget:', error);
    }
  }

  private createShadowDOM(): void {
    // Create the host element
    this.shadowHost = document.createElement('div');
    this.shadowHost.id = 'sarvam-widget-host';
    
    // Attach shadow DOM for CSS isolation
    this.shadowRoot = this.shadowHost.attachShadow({ mode: 'closed' });
    
    // Add to DOM
    document.body.appendChild(this.shadowHost);
  }

  private injectStyles(): void {
    if (!this.shadowRoot) return;

    // Create style element
    const styleElement = document.createElement('style');
    styleElement.textContent = styleText;
    this.shadowRoot.appendChild(styleElement);
  }

  private renderWidget(): void {
    if (!this.shadowRoot) return;

    // Create container for React app
    const container = document.createElement('div');
    container.id = 'widget-root';
    this.shadowRoot.appendChild(container);

    // Render React component
    this.root = createRoot(container);
    this.root.render(React.createElement(Widget));
  }

  // Public API methods
  public destroy(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    
    if (this.shadowHost && this.shadowHost.parentNode) {
      this.shadowHost.parentNode.removeChild(this.shadowHost);
      this.shadowHost = null;
      this.shadowRoot = null;
    }
  }

  public show(): void {
    if (this.shadowHost) {
      this.shadowHost.style.display = 'block';
    }
  }

  public hide(): void {
    if (this.shadowHost) {
      this.shadowHost.style.display = 'none';
    }
  }
}

// Auto-initialize when script loads
let widgetInstance: SarvamWidget | null = null;

// Initialize widget
function initWidget() {
  if (widgetInstance) {
    console.warn('Sarvam Widget is already initialized');
    return widgetInstance;
  }
  
  widgetInstance = new SarvamWidget();
  return widgetInstance;
}

// Expose global API
const SarvamWidgetAPI = {
  init: initWidget,
  destroy: () => {
    if (widgetInstance) {
      widgetInstance.destroy();
      widgetInstance = null;
    }
  },
  show: () => widgetInstance?.show(),
  hide: () => widgetInstance?.hide(),
  getInstance: () => widgetInstance
};

// Attach to window for global access
(window as any).SarvamWidget = SarvamWidgetAPI;

// Auto-initialize
initWidget();

// Export for module usage
export { SarvamWidget, SarvamWidgetAPI };
export default SarvamWidgetAPI;
