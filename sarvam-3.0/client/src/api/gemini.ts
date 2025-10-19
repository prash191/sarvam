// API client for backend server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

let sessionId: string | null = null;

// Generate a unique session ID for this browser session
function getSessionId(): string {
  if (!sessionId) {
    // Check if we have a stored session ID
    const stored = localStorage.getItem('sarvam_session_id');
    if (stored) {
      sessionId = stored;
    } else {
      // Generate new session ID
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('sarvam_session_id', sessionId);
    }
  }
  return sessionId;
}

export function initGeminiChat(context: string) {
  console.log("🤖 Initializing Gemini chat with context:", context);
  
  const sid = getSessionId();
  
  // Call backend to initialize chat session
  fetch(`${API_BASE_URL}/chat/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId: sid,
      context: context || "You are a helpful assistant."
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("✅ Gemini chat session initialized:", data);
  })
  .catch(error => {
    console.error("❌ Error initializing chat:", error);
  });
}

export async function sendMessageToGemini(message: string): Promise<string> {
  console.log("📤 Sending message to backend:", message);
  
  const sid = getSessionId();

  try {
    console.log("🔄 Calling backend API...");
    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sid,
        message: message,
        context: "You are a helpful assistant."
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("📥 Backend response received:", data);
    
    return data.response || "(No response)";
  } catch (error: any) {
    console.error("❌ Backend API error:", error);
    console.error("Error details:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    return `Sorry, I encountered an error: ${error?.message || "Could not reach the server"}`;
  }
}

// Additional helper functions for compatibility
export function resetChatSession() {
  console.log("🔄 Resetting chat session");
  const sid = getSessionId();
  
  // Call backend to reset session
  fetch(`${API_BASE_URL}/chat/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId: sid
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("✅ Chat session reset:", data);
  })
  .catch(error => {
    console.error("❌ Error resetting chat:", error);
  });
  
  // Clear local session ID to generate a new one
  localStorage.removeItem('sarvam_session_id');
  sessionId = null;
}

export function getChatSession() {
  return getSessionId();
}
