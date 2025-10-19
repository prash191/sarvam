#!/bin/bash

echo "🚀 Setting up Sarvam Widget 3.0..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Check for environment files
echo "🔍 Checking environment variables..."

if [ ! -f "server/.env" ]; then
    echo "⚠️  server/.env not found. Creating from example..."
    if [ -f "server/.env.example" ]; then
        cp server/.env.example server/.env
        echo "📝 Created server/.env - Please add your GEMINI_API_KEY"
    else
        cat > server/.env << EOF
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port (optional, defaults to 3001)
PORT=3001
EOF
        echo "📝 Created server/.env - Please add your GEMINI_API_KEY"
    fi
else
    echo "✅ server/.env exists"
fi

if [ ! -f "client/.env.development" ]; then
    echo "⚠️  client/.env.development not found. Creating..."
    cat > client/.env.development << EOF
# Backend API URL for development
VITE_API_URL=http://localhost:3001/api
EOF
    echo "✅ Created client/.env.development"
else
    echo "✅ client/.env.development exists"
fi

if [ ! -f "client/.env.production" ]; then
    echo "⚠️  client/.env.production not found. Creating..."
    cat > client/.env.production << EOF
# Backend API URL for production
# Update this with your actual Vercel deployment URL
VITE_API_URL=https://your-vercel-domain.vercel.app/api
EOF
    echo "✅ Created client/.env.production"
else
    echo "✅ client/.env.production exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Add your Gemini API key to server/.env"
echo "     Get one here: https://makersuite.google.com/app/apikey"
echo ""
echo "  2. Start development servers:"
echo "     npm run dev"
echo ""
echo "  3. Open your browser to: http://localhost:5173"
echo ""
echo "  4. See DEPLOYMENT.md for deployment instructions"
echo ""
echo "Happy coding! 🎉"

