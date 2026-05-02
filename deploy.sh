#!/bin/bash

echo "🚀 MERN ChatBot Deployment Script"
echo "================================="

# Check if required tools are installed
command -v git >/dev/null 2>&1 || { echo "❌ Git is required but not installed. Aborting."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting."; exit 1; }

echo "✅ Prerequisites check passed"

# Backend deployment preparation
echo ""
echo "📦 Preparing backend for deployment..."
cd backend

if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Please create it from .env.example"
    echo "   cp .env.example .env"
    echo "   Then edit .env with your actual values"
fi

echo "✅ Backend ready"

# Frontend deployment preparation
echo ""
echo "🎨 Preparing frontend for deployment..."
cd ../frontend

if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found. Please create it from .env.example"
    echo "   cp .env.example .env.local"
    echo "   Then edit .env.local with your production API URL"
fi

echo "✅ Frontend ready"

cd ..

echo ""
echo "🎯 Deployment Instructions:"
echo "=========================="
echo ""
echo "1. BACKEND (Render):"
echo "   - Go to https://render.com"
echo "   - Connect your GitHub repo"
echo "   - Choose 'Web Service'"
echo "   - Set environment variables in Render dashboard:"
echo "     * MONGO_URI"
echo "     * GROQ_API_KEY"
echo "     * NODE_ENV=production"
echo ""
echo "2. FRONTEND (Vercel):"
echo "   - Go to https://vercel.com"
echo "   - Connect your GitHub repo"
echo "   - Set root directory to 'frontend'"
echo "   - Set environment variable:"
echo "     * VITE_API_URL=https://your-render-backend.onrender.com"
echo ""
echo "3. Update CORS in backend/app.js:"
echo "   - Replace 'https://ai-chat-bot-six-iota.vercel.app' with your actual Vercel URL"
echo ""
echo "4. Update vercel.json:"
echo "   - Replace 'https://mern-chat-backend.onrender.com' with your actual Render URL"
echo ""
echo "✨ Happy deploying!"