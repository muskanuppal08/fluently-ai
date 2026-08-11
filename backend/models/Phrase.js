const mongoose = require('mongoose');

const PhraseSchema = new mongoose.Schema({
  originalText: { type: String, required: true },
  translatedText: { type: String, required: true },
  correction: { type: String, default: '' },
  explanation: { type: String, default: '' },
  targetLanguage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Phrase', PhraseSchema);
