const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "ai"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ConversationSchema = new mongoose.Schema({
  title: { type: String, default: "New Conversation" },
  messages: [MessageSchema],
  updatedAt: { type: Date, default: Date.now }
});

ConversationSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model("Conversation", ConversationSchema);
