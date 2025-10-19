@echo off
echo 🚀 Setting up Sarvam Widget 3.0...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

node --version
echo.

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Install client dependencies
echo 📦 Installing client dependencies...
cd client
call npm install
cd ..

REM Install server dependencies
echo 📦 Installing server dependencies...
cd server
call npm install
cd ..

echo.
echo ✅ Dependencies installed successfully!
echo.

REM Check for environment files
echo 🔍 Checking environment variables...

if not exist "server\.env" (
    echo ⚠️  server\.env not found. Creating...
    (
        echo # Google Gemini API Key
        echo GEMINI_API_KEY=your_gemini_api_key_here
        echo.
        echo # Server Port (optional, defaults to 3001^)
        echo PORT=3001
    ) > server\.env
    echo 📝 Created server\.env - Please add your GEMINI_API_KEY
) else (
    echo ✅ server\.env exists
)

if not exist "client\.env.development" (
    echo ⚠️  client\.env.development not found. Creating...
    (
        echo # Backend API URL for development
        echo VITE_API_URL=http://localhost:3001/api
    ) > client\.env.development
    echo ✅ Created client\.env.development
) else (
    echo ✅ client\.env.development exists
)

if not exist "client\.env.production" (
    echo ⚠️  client\.env.production not found. Creating...
    (
        echo # Backend API URL for production
        echo # Update this with your actual Vercel deployment URL
        echo VITE_API_URL=https://your-vercel-domain.vercel.app/api
    ) > client\.env.production
    echo ✅ Created client\.env.production
) else (
    echo ✅ client\.env.production exists
)

echo.
echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo   1. Add your Gemini API key to server\.env
echo      Get one here: https://makersuite.google.com/app/apikey
echo.
echo   2. Start development servers:
echo      npm run dev
echo.
echo   3. Open your browser to: http://localhost:5173
echo.
echo   4. See DEPLOYMENT.md for deployment instructions
echo.
echo Happy coding! 🎉
pause

