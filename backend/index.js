const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Mistral } = require('@mistralai/mistralai');

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Mistral Client
const apiKey = process.env.MISTRAL_API_KEY;
const mistral = new Mistral({ apiKey });

app.use(cors());
app.use(express.json());

// Endpoint to handle real-time streaming translation and grammar analysis
app.post('/api/chat', async (req, res) => {
  const { message, targetLanguage } = req.body;

  if (!message || !targetLanguage) {
    return res.status(400).json({ error: 'Message and targetLanguage are required.' });
  }

  // Set headers for Server-Sent Events (SSE) streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

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
`;

  try {
    const responseStream = await mistral.chat.stream({
      model: 'mistral-tiny',
      messages: [
        { role: 'system', content: systemInstructions },
        { role: 'user', content: message }
      ],
    });

    for await (const chunk of responseStream) {
      const text = chunk.data.choices[0]?.delta?.content || '';
      if (text) {
        // Send streamed chunk to frontend client
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error during Mistral AI Stream:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to process AI response stream.' })}\n\n`);
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`Fluently Backend listening on port ${PORT}`);
});
