import React from 'react';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  primaryColor: string;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ isOpen, onClick, primaryColor }) => {
  return (
    <button
      className="chat-button"
      onClick={onClick}
      style={{ '--primary-color': primaryColor } as React.CSSProperties}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      {isOpen ? (
        // Close icon (X)
        <svg className="chat-button-icon" viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      ) : (
        // Chat icon
        <svg className="chat-button-icon" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      )}
    </button>
  );
};
