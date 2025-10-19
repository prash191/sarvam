import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// Store chat sessions in memory (in production, use Redis or database)
const chatSessions = new Map();

// Helper function to get or create chat session
function getChatSession(sessionId, context) {
  if (!chatSessions.has(sessionId)) {
    console.log(`🤖 Creating new chat session: ${sessionId}`);
    const chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: context || "You are a helpful assistant." }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.7,
      },
    });
    chatSessions.set(sessionId, chatSession);
  }
  return chatSessions.get(sessionId);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Initialize chat session endpoint
app.post('/api/chat/init', (req, res) => {
  try {
    const { sessionId, context } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    console.log(`🤖 Initializing chat session: ${sessionId}`);
    getChatSession(sessionId, context);
    
    res.json({ 
      success: true, 
      message: 'Chat session initialized',
      sessionId 
    });
  } catch (error) {
    console.error('❌ Error initializing chat:', error);
    res.status(500).json({ 
      error: 'Failed to initialize chat session',
      message: error.message 
    });
  }
});

// Send message endpoint
app.post('/api/chat/message', async (req, res) => {
  try {
    const { sessionId, message, context } = req.body;
    
    if (!sessionId || !message) {
      return res.status(400).json({ 
        error: 'Session ID and message are required' 
      });
    }

    console.log(`📤 Sending message for session ${sessionId}:`, message);
    
    // Get or create chat session
    const chatSession = getChatSession(sessionId, context);
    
    // Send message to Gemini
    const result = await chatSession.sendMessage(message);
    const response = result.response.text();
    
    console.log(`📥 Response received for session ${sessionId}`);
    
    res.json({ 
      success: true, 
      response: response || "(No response)",
      sessionId 
    });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ 
      error: 'Failed to send message',
      message: error.message 
    });
  }
});

// Reset chat session endpoint
app.post('/api/chat/reset', (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    console.log(`🔄 Resetting chat session: ${sessionId}`);
    chatSessions.delete(sessionId);
    
    res.json({ 
      success: true, 
      message: 'Chat session reset',
      sessionId 
    });
  } catch (error) {
    console.error('❌ Error resetting chat:', error);
    res.status(500).json({ 
      error: 'Failed to reset chat session',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

export default app;

