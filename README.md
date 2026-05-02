# AI ChatBot - MERN Stack

A modern AI chatbot built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a beautiful UI and Groq AI integration.

## 🚀 Deployment Guide

### Backend Deployment (Railway)

1. **Create a Railway Account**
   - Go to [railway.app](https://railway.app) and sign up

2. **Deploy Backend**
   - Connect your GitHub repository
   - Railway will auto-detect it as a Node.js app
   - Set environment variables:
     ```
     MONGO_URI=your_mongodb_atlas_connection_string
     GROQ_API_KEY=your_groq_api_key
     NODE_ENV=production
     ```

3. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your backend will be live at: `https://aichatbot-production-50b3.up.railway.app`

### Frontend Deployment (Vercel)

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com) and sign up

2. **Deploy Frontend**
   - Connect your GitHub repository
   - Vercel will auto-detect it as a Vite React app
   - Set build settings:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Environment Variables**
   Set in Vercel dashboard:
   ```
   VITE_API_URL=https://aichatbot-production-50b3.up.railway.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-app.vercel.app`

## 🔧 Local Development

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Groq API Key

### Setup

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd MERN

   # Backend
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your values

   # Frontend
   cd ../frontend
   npm install
   cp .env.example .env.local
   ```

2. **Environment Variables**
   - Backend: Update `backend/.env`
   - Frontend: Update `frontend/.env.local`

3. **Start Development Servers**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev

   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

4. **Access**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 📁 Project Structure

```
MERN/
├── backend/
│   ├── app.js
│   ├── package.json
│   ├── .env.example
│   └── render.yaml
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vercel.json
│   └── .env.example
└── README.md
```

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **AI**: Groq API (Llama 3.1)
- **Deployment**: Vercel (Frontend), Render (Backend)

## 📝 API Endpoints

- `POST /api/ai` - Send message to AI
- `GET /api/history` - Get chat history
- `GET /api/history/:id` - Get specific conversation
- `DELETE /api/history/:id` - Delete conversation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request