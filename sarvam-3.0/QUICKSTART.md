# Quick Start Guide

Get your Sarvam Widget up and running in 5 minutes!

## Prerequisites

- Node.js 18+ ([Download here](https://nodejs.org/))
- Google Gemini API Key ([Get one free](https://makersuite.google.com/app/apikey))
- Git (optional, for deployment)

## Setup (5 minutes)

### Option 1: Automated Setup (Recommended)

#### On Windows:
```bash
setup.bat
```

#### On Mac/Linux:
```bash
chmod +x setup.sh
./setup.sh
```

This will:
- ✅ Install all dependencies
- ✅ Create environment files
- ✅ Set up project structure

### Option 2: Manual Setup

```bash
# 1. Install dependencies
npm install
cd client && npm install
cd ../server && npm install
cd ..

# 2. Create server/.env
echo "GEMINI_API_KEY=your_key_here" > server/.env

# 3. Create client/.env.development
echo "VITE_API_URL=http://localhost:3001/api" > client/.env.development
```

## Add Your API Key

1. Open `server/.env`
2. Replace `your_gemini_api_key_here` with your actual key
3. Save the file

**Get your key:** https://makersuite.google.com/app/apikey

## Start Development

```bash
npm run dev
```

This starts:
- 🖥️ Backend server on http://localhost:3001
- 🎨 Frontend on http://localhost:5173

## Test It

1. Open http://localhost:5173 in your browser
2. Click the chat button (bottom-right corner)
3. Type a message and hit enter
4. You should get a response from the AI!

## What's Next?

### Customize the Widget

Edit the configuration in `client/index.html` or `client/demo.html`:

```javascript
window.AgentWidgetConfig = {
  agent: {
    name: 'MyBot',  // Change the bot name
    avatar: 'url_to_your_avatar.png'
  },
  theme: {
    primaryColor: '#FF0000'  // Change the color
  },
  context: 'You are a helpful assistant for my company.'
};
```

### Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment instructions.

Quick deploy:
1. Push to GitHub
2. Import in Vercel
3. Add `GEMINI_API_KEY` environment variable
4. Deploy!

### Embed in Your Website

After deployment, add to any website:

```html
<link rel="stylesheet" href="https://your-domain.vercel.app/widget.css">
<script src="https://your-domain.vercel.app/widget.js"></script>

<script>
  window.AgentWidgetConfig = {
    agent: { name: 'Support Bot' },
    context: 'You are customer support for XYZ company.'
  };
</script>
```

## Troubleshooting

### "Port 3001 already in use"
```bash
# On Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# On Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### "Failed to fetch" errors
- Check if backend is running on port 3001
- Verify `VITE_API_URL` in `client/.env.development`
- Check browser console for errors

### "Invalid API key"
- Verify your key in `server/.env`
- Make sure there are no spaces or quotes around the key
- Get a new key from Google AI Studio if needed

### Widget not appearing
- Check browser console for errors
- Verify the widget script is loaded
- Make sure `window.AgentWidgetConfig` is set before loading the script

## Need Help?

- 📖 [Full Documentation](./README.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
- 🔧 [Environment Setup](./ENV_SETUP.md)
- 🐛 [Open an Issue](https://github.com/your-username/sarvam-3.0/issues)

## Common Commands

```bash
# Install all dependencies
npm run install:all

# Start both servers (dev mode)
npm run dev

# Start only backend
npm run dev:server

# Start only frontend
npm run dev:client

# Build client for production
npm run build:client

# Build everything
npm run build
```

## Project Structure

```
sarvam-3.0/
├── client/          # Frontend widget (React)
│   ├── src/        # Source code
│   └── dist/       # Built files (after build)
│
├── server/         # Backend API (Express)
│   └── index.js   # Main server file
│
├── vercel.json    # Deployment config
└── README.md      # Full documentation
```

## Success! 🎉

You now have:
- ✅ A working AI chat widget
- ✅ Secure backend API
- ✅ Voice input support
- ✅ Multi-language capability
- ✅ Ready to deploy

Happy building! 🚀

