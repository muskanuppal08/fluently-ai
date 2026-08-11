const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  targetLanguage: { type: String, required: true },
  scenarioId: { type: String, default: 'none' },
  messages: [
    {
      sender: { type: String, enum: ['user', 'bot'], required: true },
      text: { type: String, required: true },
      originalText: { type: String },
      correction: { type: String },
      explanation: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversation', ConversationSchema);
