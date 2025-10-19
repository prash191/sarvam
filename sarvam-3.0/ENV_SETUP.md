# Environment Variables Setup

This document explains how to set up environment variables for both development and production.

## Server Environment Variables

Create a `.env` file in the `server/` directory:

```bash
# server/.env

# Google Gemini API Key (REQUIRED)
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port (optional, defaults to 3001)
PORT=3001
```

### Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it into your `.env` file

## Client Environment Variables

Create environment files in the `client/` directory:

### Development (client/.env.development)
```bash
# Backend API URL for development
VITE_API_URL=http://localhost:3001/api
```

### Production (client/.env.production)
```bash
# Backend API URL for production
# Update this with your actual Vercel deployment URL
VITE_API_URL=https://your-vercel-domain.vercel.app/api
```

## Vercel Environment Variables

When deploying to Vercel, you need to add environment variables in the Vercel dashboard:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `GEMINI_API_KEY` | Your Gemini API key | Production, Preview, Development |
| `VITE_API_URL` | Your Vercel API URL | Production |

### Steps to Add in Vercel Dashboard:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Click "Add New"
5. Enter variable name and value
6. Select which environments to apply (Production, Preview, Development)
7. Click "Save"

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` files to Git
- The `.env` files are included in `.gitignore` for security
- Always use environment variables for sensitive data
- Rotate API keys regularly
- Use different API keys for development and production if possible

## Verification

After setting up environment variables:

1. **Development:**
   ```bash
   cd server
   node index.js
   # Should see: "🚀 Server running on port 3001"
   ```

2. **Client:**
   ```bash
   cd client
   npm run dev
   # Should connect to backend without errors
   ```

3. **Vercel:**
   - After deployment, check the deployment logs
   - Test the API endpoint: `https://your-domain.vercel.app/api/health`

