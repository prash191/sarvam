# Sarvam Widget 3.0 🤖

A modern, embeddable chat widget with voice capabilities, powered by Google Gemini AI. Built with React, TypeScript, and Express.js with a proper server-client architecture for secure deployment on Vercel.

## ✨ Features

- 🎯 **Embeddable Widget**: Easy to integrate into any website
- 💬 **AI-Powered Chat**: Uses Google Gemini 2.0 for intelligent responses
- 🎤 **Voice Input**: Speak your messages instead of typing
- 🌍 **Multi-Language Support**: Supports multiple languages out of the box
- 💾 **Context Memory**: Remembers conversation history
- 🎨 **Customizable**: Fully configurable colors, position, and behavior
- 🔒 **Secure**: API keys safely stored on server-side
- ⚡ **Fast**: Optimized for performance
- 📱 **Responsive**: Works on desktop and mobile

## 🏗️ Architecture

```
┌─────────────────┐
│   Client Side   │
│  (React Widget) │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────┐
│   Backend API   │
│ (Express Server)│
└────────┬────────┘
         │
         │ API Key
         │
┌────────▼────────┐
│  Google Gemini  │
│      AI API     │
└─────────────────┘
```

### Why This Architecture?

- ✅ **Security**: API keys never exposed to the client
- ✅ **Scalability**: Backend can be scaled independently
- ✅ **Control**: Centralized control over API usage
- ✅ **Monitoring**: Easy to add logging and analytics
- ✅ **Cost Management**: Better control over API usage

## 📁 Project Structure

```
sarvam-3.0/
├── client/                 # Frontend widget (React + TypeScript)
│   ├── src/
│   │   ├── api/           # API client for backend
│   │   ├── components/    # React components
│   │   ├── utils/         # Utility functions
│   │   └── main.ts        # Entry point
│   ├── dist/              # Built files (after npm run build)
│   └── package.json
│
├── server/                # Backend API (Express.js)
│   ├── index.js          # Main server file
│   └── package.json
│
├── vercel.json           # Vercel deployment configuration
├── package.json          # Root package.json for monorepo
├── ENV_SETUP.md          # Environment variables guide
└── DEPLOYMENT.md         # Deployment instructions
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sarvam-3.0.git
cd sarvam-3.0
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Or use the convenience script from root
npm run install:all
```

### 3. Set Up Environment Variables

#### Server Environment

Create `server/.env`:

```bash
# server/.env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

#### Client Environment

Create `client/.env.development`:

```bash
# client/.env.development
VITE_API_URL=http://localhost:3001/api
```

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions.

### 4. Run Development Servers

#### Option A: Run Both Servers Concurrently (Recommended)

```bash
# From root directory
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend dev server on `http://localhost:5173`

#### Option B: Run Separately

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

### 5. Test the Widget

Open your browser to `http://localhost:5173` and you should see the widget demo page.

## 🎨 Widget Configuration

You can customize the widget by setting `window.AgentWidgetConfig` before loading the widget:

```html
<script>
  window.AgentWidgetConfig = {
    // Position: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    position: 'bottom-right',
    
    // Theme colors
    theme: {
      primaryColor: '#4F46E5',      // Main accent color
      backgroundColor: '#ffffff',   // Chat window background
      textColor: '#1f2937'          // Text color
    },
    
    // Agent configuration
    agent: {
      name: 'HelperBot',
      avatar: 'https://example.com/avatar.png'  // Or base64 image
    },
    
    // Features
    enableVoice: true,  // Enable voice input
    
    // AI Context/Instructions
    context: 'You are a helpful customer support assistant for XYZ company.',
    
    // Language support
    supportedLanguages: [
      { code: 'en', name: 'English', nativeName: 'English', voiceCode: 'en-US' },
      { code: 'es', name: 'Spanish', nativeName: 'Español', voiceCode: 'es-ES' },
      // Add more languages as needed
    ],
    defaultLanguage: 'en'
  };
</script>
```

## 📦 Build for Production

### Build Client

```bash
cd client
npm run build
```

This creates optimized files in `client/dist/`:
- `widget.js` - Main widget script
- `widget.css` - Widget styles
- `avatar.svg` - Default avatar
- `favicon.svg` - Favicon

### Build Server

The server doesn't need building as it uses plain Node.js:

```bash
cd server
npm install --production
```

## 🌐 Deployment to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `GEMINI_API_KEY`
   - `VITE_API_URL` (your Vercel domain + /api)
4. Deploy!

## 🔧 API Endpoints

The backend provides the following endpoints:

### Health Check
```
GET /api/health
Response: { "status": "ok", "message": "Server is running" }
```

### Initialize Chat Session
```
POST /api/chat/init
Body: { "sessionId": "string", "context": "string" }
Response: { "success": true, "sessionId": "string" }
```

### Send Message
```
POST /api/chat/message
Body: { "sessionId": "string", "message": "string", "context": "string" }
Response: { "success": true, "response": "string", "sessionId": "string" }
```

### Reset Chat Session
```
POST /api/chat/reset
Body: { "sessionId": "string" }
Response: { "success": true, "sessionId": "string" }
```

## 🛡️ Security

- ✅ API keys stored in environment variables
- ✅ Backend handles all external API calls
- ✅ CORS enabled for cross-origin requests
- ✅ No sensitive data exposed to client
- ✅ Session-based chat management
- ✅ `.env` files in `.gitignore`

## 🧪 Testing

### Test Backend Locally

```bash
cd server
npm start

# Test health endpoint
curl http://localhost:3001/api/health
```

### Test Client Locally

```bash
cd client
npm run dev
# Open http://localhost:5173
```

## 📝 Development Workflow

1. **Make Changes**: Edit files in `client/src/` or `server/`
2. **Test Locally**: Run `npm run dev` from root
3. **Commit**: `git add . && git commit -m "Your message"`
4. **Push**: `git push origin main`
5. **Auto-Deploy**: Vercel automatically deploys on push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

## 📚 Documentation

- [ENV_SETUP.md](./ENV_SETUP.md) - Environment variables setup
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [client/README.md](./client/README.md) - Client documentation

## 🐛 Troubleshooting

### Backend not starting
- Check if port 3001 is available
- Verify `GEMINI_API_KEY` is set in `server/.env`
- Check server logs for errors

### Widget not connecting to backend
- Verify `VITE_API_URL` in client environment
- Check if backend is running
- Check browser console for errors
- Verify CORS is enabled on backend

### Voice not working
- Check browser permissions for microphone
- Voice requires HTTPS in production
- Some browsers don't support Web Speech API

### Build errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)
- Clear build cache: `rm -rf dist/`

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Credits

- Built with [React](https://react.dev/)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Deployed on [Vercel](https://vercel.com/)
- Voice input using Web Speech API

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

---

**Built with ❤️ for better user engagement**

