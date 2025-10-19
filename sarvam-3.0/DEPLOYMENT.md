# Deployment Guide for Vercel

This guide will help you deploy your Sarvam widget to Vercel with proper server-client architecture.

## Prerequisites

1. Git repository (GitHub, GitLab, or Bitbucket)
2. Vercel account ([sign up here](https://vercel.com/signup))
3. Google Gemini API key ([get one here](https://makersuite.google.com/app/apikey))

## Step-by-Step Deployment

### 1. Prepare Your Repository

First, make sure your code is committed to Git:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit with server-client architecture"

# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/your-username/your-repo.git

# Push to GitHub
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Select the repository you just pushed

### 3. Configure Build Settings

Vercel should auto-detect the configuration from `vercel.json`, but verify:

- **Framework Preset:** Other
- **Root Directory:** `./` (project root)
- **Build Command:** `npm run vercel-build`
- **Output Directory:** `client/dist`

### 4. Add Environment Variables

**CRITICAL STEP:** Add these environment variables in Vercel:

1. Click "Environment Variables" during setup (or go to Settings → Environment Variables)
2. Add the following:

| Name | Value | Environments |
|------|-------|--------------|
| `GEMINI_API_KEY` | Your actual Gemini API key | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

### 5. Deploy

1. Click "Deploy"
2. Wait for the build to complete (2-5 minutes)
3. You'll get a deployment URL like: `https://your-project-name.vercel.app`

### 6. Update Client Environment Variable

After first deployment, you need to update the API URL:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add a new variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-project-name.vercel.app/api`
   - **Environments:** Production, Preview

3. Redeploy the project (Settings → Deployments → Redeploy)

## Verify Deployment

### Test Backend API

Open your browser and navigate to:
```
https://your-project-name.vercel.app/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Test Widget

1. Open: `https://your-project-name.vercel.app/`
2. You should see the demo page
3. Click the chat button (bottom-right)
4. Try sending a message
5. The bot should respond

## Project Structure on Vercel

```
your-project/
├── server/           # Backend API (serverless functions)
│   ├── index.js     # Main API handler
│   └── package.json
├── client/          # Frontend widget
│   ├── dist/        # Built files (served as static)
│   └── src/
├── vercel.json      # Vercel configuration
└── package.json     # Root package.json
```

## How It Works on Vercel

1. **Static Files:** Client files in `client/dist/` are served as static assets
2. **API Routes:** All `/api/*` requests are routed to `server/index.js` (serverless function)
3. **Serverless Backend:** The Express server runs as a Vercel serverless function
4. **Environment Variables:** Loaded from Vercel's environment settings

## Embedding the Widget

After deployment, you can embed the widget on any website:

```html
<!-- Add to your HTML -->
<link rel="stylesheet" href="https://your-project-name.vercel.app/widget.css">
<script src="https://your-project-name.vercel.app/widget.js"></script>

<script>
  window.AgentWidgetConfig = {
    position: 'bottom-right',
    theme: {
      primaryColor: '#4F46E5',
    },
    agent: {
      name: 'MyBot',
      avatar: 'https://example.com/avatar.png'
    },
    context: 'You are a helpful customer support assistant.',
    enableVoice: true
  };
</script>
```

## Continuous Deployment

Vercel automatically deploys when you push to your Git repository:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel will automatically deploy the changes
```

## Monitoring and Logs

1. Go to Vercel Dashboard → Your Project
2. Click on "Deployments" to see all deployments
3. Click on a deployment to see logs
4. Check "Functions" tab to see serverless function logs

## Troubleshooting

### Build Failed

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify `vercel.json` configuration

### API Not Working

1. Check environment variables are set correctly
2. Verify `GEMINI_API_KEY` is valid
3. Check function logs in Vercel dashboard
4. Ensure `VITE_API_URL` points to correct domain

### Widget Not Loading

1. Check browser console for errors
2. Verify static files are accessible
3. Check if CORS is properly configured
4. Ensure `client/dist/` was built correctly

## Custom Domain (Optional)

To use a custom domain:

1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Update `VITE_API_URL` to use your custom domain

## Security Best Practices

1. ✅ API keys are stored in environment variables (not in code)
2. ✅ `.env` files are git-ignored
3. ✅ Backend handles all Gemini API calls (not exposed to client)
4. ✅ CORS is enabled for cross-origin requests
5. ✅ Use HTTPS (automatic with Vercel)

## Cost Considerations

- **Vercel Free Tier:**
  - 100GB bandwidth/month
  - 100GB-hours serverless function execution
  - Usually sufficient for small to medium projects

- **Google Gemini:**
  - Check current pricing at [Google AI Pricing](https://ai.google.dev/pricing)
  - Free tier available for testing

## Support

If you encounter issues:

1. Check Vercel documentation: https://vercel.com/docs
2. Check function logs in Vercel dashboard
3. Review this guide's troubleshooting section
4. Check GitHub issues or create a new one

## Next Steps

- Set up monitoring and analytics
- Configure custom domain
- Set up CI/CD testing
- Add rate limiting for production
- Implement user authentication if needed

