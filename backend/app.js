const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const Conversation = require("./models/Conversation");

dotenv.config();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ["https://ai-chat-bot-six-iota.vercel.app", "http://localhost:5173"]
    : "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.post("/api/ai", async (req, res) => {
  try {
    const { prompt, conversationId } = req.body;
    console.log(`AI Request - Prompt: "${prompt}", ID: ${conversationId}`);

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let chatHistory = [];
    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (conversation) {
        chatHistory = conversation.messages.map(m => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.content
        }));
      }
    }

    const apiMessages = [
      {
        role: "system",
        content: `You are a friendly and conversational AI assistant. Keep responses short and natural for simple messages like greetings.
When explaining technical concepts, provide accurate and clear explanations using correct technical terms and definitions. Always include a simple, illustrative example to help the user understand the concept.
Maintain conversation context, provide structured answers, and assist with MERN application development and software engineering questions with expert-level precision.`
      },
      ...chatHistory,
      { role: "user", content: prompt }
    ];

    let groqResponse;
    try {
      groqResponse = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          messages: apiMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (groqErr) {
      console.error("GROQ API ERROR:", groqErr.response?.data || groqErr.message);
      throw new Error(`Groq failed: ${groqErr.response?.data?.error?.message || groqErr.message}`);
    }

    const aiReply = groqResponse.data.choices[0].message.content;

    if (!conversation) {
      const chatTitle = prompt.trim();
      const title = chatTitle.length > 25 ? chatTitle.substring(0, 25) + "..." : chatTitle;
      conversation = new Conversation({ title });
    }

    conversation.messages.push({ role: "user", content: prompt });
    conversation.messages.push({ role: "ai", content: aiReply });
    await conversation.save();

    res.json({ reply: aiReply, conversationId: conversation._id });

  } catch (error) {
    console.error("DEBUG - Error in /api/ai:", error.response?.data || error.message || error);
    res.status(500).json({
      error: "Operation failed",
      details: error.response?.data?.error?.message || error.message
    });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const history = await Conversation.find({}, "title updatedAt")
      .sort({ updatedAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.get("/api/history/:id", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ error: "Not found" });
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

app.delete("/api/history/:id", async (req, res) => {
  try {
    await Conversation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// Start the server
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
})();

app.delete("/api/history/:id", async (req, res) => {
  try {
    await Conversation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

// 6. PORT CONFIGURATION
// Binding to 0.0.0.0 is critical for Railway's network to find your app.
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});