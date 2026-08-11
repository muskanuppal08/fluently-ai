const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const { Mistral } = require('@mistralai/mistralai');

// Models
const Conversation = require('./models/Conversation');
const Phrase = require('./models/Phrase');

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Mistral Client
const apiKey = process.env.MISTRAL_API_KEY;
const mistral = new Mistral({ apiKey });

app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fluently';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

const SCENARIOS = {
  cafe: 'Act strictly as a busy but polite barista at a local cafe. Greet the user in the target language and wait for their order. Introduce minor complications like being out of certain milks or asking if they want it for here or to go.',
  hotel: 'Act strictly as a helpful hotel front desk receptionist. Ask the user for their booking name, explain room amenities, ask for passport details, and hand over the virtual room keys.',
  directions: 'Act strictly as a local pedestrian whom the user has stopped to ask for directions. Give simple, structured spatial directions using landmarks in the target language. Confirm if they understood.'
};

// Endpoint to fetch all active sessions
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await Conversation.find({}, 'title targetLanguage scenarioId updatedAt').sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve conversation sessions.' });
  }
});

// Endpoint to fetch specific session messages
app.get('/api/sessions/:id', async (req, res) => {
  try {
    const session = await Conversation.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve session conversation history.' });
  }
});

// Endpoint to create a new session
app.post('/api/sessions', async (req, res) => {
  const { title, targetLanguage, scenarioId } = req.body;
  try {
    const newSession = new Conversation({
      title: title || 'New Learning Room',
      targetLanguage,
      scenarioId: scenarioId || 'none',
      messages: []
    });
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create conversation session.' });
  }
});

// Endpoint to handle real-time streaming translation and grammar analysis
app.post('/api/chat', async (req, res) => {
  const { message, targetLanguage, scenarioId, sessionId } = req.body;

  if (!message || !targetLanguage) {
    return res.status(400).json({ error: 'Message and targetLanguage are required.' });
  }

  // Save user's message locally to the active database session if provided
  let activeSession = null;
  if (sessionId) {
    try {
      activeSession = await Conversation.findById(sessionId);
      if (activeSession) {
        activeSession.messages.push({
          sender: 'user',
          text: message,
          timestamp: new Date()
        });
        await activeSession.save();
      }
    } catch (e) {
      console.error('Error saving user message to database:', e);
    }
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const scenarioContext = SCENARIOS[scenarioId] || '';

  const systemInstructions = `
You are a world-class translation tutor and language practice companion.
The user wants to translate or write a message targeting the language: "${targetLanguage}".
First, detect the language of the user's message.

Please output your response exactly in the following structured format, including JSON markers:

---START_STRUCTURED_JSON---
{
  "detectedLanguage": "[Detected source language here]",
  "originalText": "${message.replace(/"/g, '\\"')}",
  "correction": "[If user typed in target language with grammar mistakes, provide corrected target language sentence here. Otherwise, leave empty string]",
  "explanation": "[Brief correction detail explanation in English. Leave empty string if no grammar mistakes]"
}
---END_STRUCTURED_JSON---

Response translation:
[Provide the fluent translated sentence in ${targetLanguage} inside this section if the input was in another language. If the input was already in ${targetLanguage}, continue the conversation naturally in ${targetLanguage} while keeping the grammar corrections inside the JSON block above].

${scenarioContext ? `Roleplay Context: ${scenarioContext}` : ''}
`;

  try {
    const responseStream = await mistral.chat.stream({
      model: 'mistral-tiny',
      messages: [
        { role: 'system', content: systemInstructions },
        { role: 'user', content: message }
      ],
    });

    let botResponseFullText = '';

    for await (const chunk of responseStream) {
      const text = chunk.data.choices[0]?.delta?.content || '';
      if (text) {
        botResponseFullText += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    // Post-stream metadata parsing and database persistence
    if (activeSession) {
      const jsonStartTag = '---START_STRUCTURED_JSON---';
      const jsonEndTag = '---END_STRUCTURED_JSON---';
      const startIndex = botResponseFullText.indexOf(jsonStartTag);
      const endIndex = botResponseFullText.indexOf(jsonEndTag);

      let textContent = botResponseFullText;
      let originalText = '';
      let correction = '';
      let explanation = '';

      if (startIndex !== -1 && endIndex !== -1) {
        const jsonText = botResponseFullText.substring(startIndex + jsonStartTag.length, endIndex).trim();
        textContent = botResponseFullText.substring(endIndex + jsonEndTag.length).trim();
        try {
          const parsed = JSON.parse(jsonText);
          originalText = parsed.originalText || '';
          correction = parsed.correction || '';
          explanation = parsed.explanation || '';
        } catch (e) {
          // Fallback parser catch
        }
      }

      activeSession.messages.push({
        sender: 'bot',
        text: textContent,
        originalText,
        correction,
        explanation,
        timestamp: new Date()
      });
      await activeSession.save();
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error during Mistral AI Stream:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to process AI response stream.' })}\n\n`);
    res.end();
  }
});

// Endpoint to handle bookmarked vocabulary notebook phrases
app.post('/api/phrases', async (req, res) => {
  const { originalText, translatedText, correction, explanation, targetLanguage } = req.body;
  try {
    const newPhrase = new Phrase({
      originalText,
      translatedText,
      correction: correction || '',
      explanation: explanation || '',
      targetLanguage
    });
    await newPhrase.save();
    res.status(201).json(newPhrase);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save phrase to notebook.' });
  }
});

// Endpoint to fetch bookmarked phrases
app.get('/api/phrases', async (req, res) => {
  try {
    const phrases = await Phrase.find().sort({ createdAt: -1 });
    res.json(phrases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve vocabulary phrases.' });
  }
});

app.listen(PORT, () => {
  console.log(`Fluently Backend listening on port ${PORT}`);
});
