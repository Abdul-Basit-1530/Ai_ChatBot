@echo off
echo 🚀 MERN ChatBot Deployment Script
echo =================================
echo.

REM Check if required tools are installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git is required but not installed. Aborting.
    pause
    exit /b 1
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is required but not installed. Aborting.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is required but not installed. Aborting.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed
echo.

REM Backend deployment preparation
echo 📦 Preparing backend for deployment...
cd backend

if not exist ".env" (
    echo ⚠️  .env file not found. Please create it from .env.example
    echo    copy .env.example .env
    echo    Then edit .env with your actual values
)

echo ✅ Backend ready
echo.

REM Frontend deployment preparation
echo 🎨 Preparing frontend for deployment...
cd ../frontend

if not exist ".env.local" (
    echo ⚠️  .env.local file not found. Please create it from .env.example
    echo    copy .env.example .env.local
    echo    Then edit .env.local with your production API URL
)

echo ✅ Frontend ready
echo.

cd ..

echo.
echo 🎯 Deployment Instructions:
echo ===========================
echo.
echo 1. BACKEND (Railway):
echo    - Go to https://railway.app
echo    - Connect your GitHub repo
echo    - Railway will auto-detect Node.js app
echo    - Set environment variables:
echo      * MONGO_URI
echo      * GROQ_API_KEY
echo      * NODE_ENV=production
echo.
echo 2. FRONTEND (Vercel):
echo    - Go to https://vercel.com
echo    - Connect your GitHub repo
echo    - Set root directory to 'frontend'
echo    - Set environment variable:
echo      * VITE_API_URL=https://aichatbot-production-50b3.up.railway.app
echo.
echo 3. Update CORS in backend/app.js:
echo    - Replace 'https://ai-chat-bot-six-iota.vercel.app' with your actual Vercel URL
echo.
echo 4. Update vercel.json:
echo    - Replace 'https://mern-chat-backend.onrender.com' with your actual Render URL
echo.
echo ✨ Happy deploying!

pause