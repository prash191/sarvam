import React, { useState } from 'react';
import { ChatButton } from './ChatButton';
import { ChatWindow } from './ChatWindow';
import { getWidgetConfig, getPositionStyles } from '../config';

export const Widget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const config = getWidgetConfig() as Required<import('../types').AgentWidgetConfig>;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const positionStyles = getPositionStyles(config.position);

  return (
    <div className="widget-container" style={positionStyles}>
      {!isOpen && (
        <ChatButton 
          isOpen={isOpen}
          onClick={handleToggle}
          primaryColor={config.theme.primaryColor!}
        />
      )}
      
      {isOpen && (
        <ChatWindow
          isOpen={isOpen}
          onClose={handleClose}
          agentName={config.agent.name!}
          agentAvatar={config.agent.avatar!}
          primaryColor={config.theme.primaryColor!}
          enableVoice={config.enableVoice}
          context={config.context!}
          supportedLanguages={config.supportedLanguages!}
          defaultLanguage={config.defaultLanguage!}
        />
      )}
    </div>
  );
};
