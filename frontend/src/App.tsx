import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import type { ChatSession } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import type { Message } from './components/ChatWindow';

export type ColorTheme = 'violet' | 'emerald' | 'slate' | 'amber';

export interface ThemeConfig {
  mode: 'light' | 'dark';
  colorTheme: ColorTheme;
  chatBackground: string;
}

function App() {
  const [sessions] = useState<ChatSession[]>([
    { id: '1', title: 'Cafe ordering practice', targetLanguage: 'Spanish', lastUpdated: 'Just now' },
    { id: '2', title: 'Directions in Tokyo', targetLanguage: 'Japanese', lastUpdated: 'Yesterday' }
  ]);
  const [activeSession, setActiveSession] = useState<string>('1');
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'm1', 
      sender: 'bot', 
      text: '¡Hola! ¿Cómo estás hoy? ¿En qué te puedo ayudar? (Hello! How are you today? How can I help you?)', 
      timestamp: '10:10 AM' 
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [isTyping, setIsTyping] = useState(false);

  const [theme, setTheme] = useState<ThemeConfig>({
    mode: 'dark',
    colorTheme: 'violet',
    chatBackground: 'bg-mesh-dark'
  });

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessageText = inputValue;
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Initiate request to local backend Server-Sent Events (SSE) chat streaming endpoint
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessageText, targetLanguage })
      });

      if (!response.ok) throw new Error('Network response issues');

      setIsTyping(false);

      // Create a bot placeholder message to stream tokens into
      const botMessageId = (Date.now() + 1).toString();
      const botPlaceholder: Message = {
        id: botMessageId,
        sender: 'bot',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botPlaceholder]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let rawBuffer = '';
      let streamFinished = false;

      if (!reader) return;

      while (!streamFinished) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        rawBuffer += chunk;

        // Split SSE data chunks
        const lines = rawBuffer.split('\n');
        rawBuffer = lines.pop() || ''; // Keep the last incomplete line in buffer

        for (const line of lines) {
          const cleanedLine = line.trim();
          if (!cleanedLine.startsWith('data: ')) continue;
          const dataContent = cleanedLine.replace('data: ', '');

          if (dataContent === '[DONE]') {
            streamFinished = true;
            break;
          }

          try {
            const parsed = JSON.parse(dataContent);
            if (parsed.text) {
              setMessages((prev) => 
                prev.map((msg) => 
                  msg.id === botMessageId 
                    ? { ...msg, text: msg.text + parsed.text } 
                    : msg
                )
              );
            }
          } catch (e) {
            // Quietly catch json parse boundaries
          }
        }
      }

      // Final pass: Parse structured JSON elements (corrections, translations, originalText) from the complete response stream text
      setMessages((prev) => 
        prev.map((msg) => {
          if (msg.id !== botMessageId) return msg;

          const rawText = msg.text;
          const jsonStartTag = '---START_STRUCTURED_JSON---';
          const jsonEndTag = '---END_STRUCTURED_JSON---';
          
          const startIndex = rawText.indexOf(jsonStartTag);
          const endIndex = rawText.indexOf(jsonEndTag);

          if (startIndex !== -1 && endIndex !== -1) {
            const jsonText = rawText.substring(startIndex + jsonStartTag.length, endIndex).trim();
            const responseTranslation = rawText.substring(endIndex + jsonEndTag.length).trim();
            
            try {
              const parsedMetadata = JSON.parse(jsonText);
              return {
                ...msg,
                text: responseTranslation || rawText, // Use fallback raw text if empty
                originalText: parsedMetadata.originalText || undefined,
                correction: parsedMetadata.correction || undefined,
                explanation: parsedMetadata.explanation || undefined
              };
            } catch (err) {
              console.error('Failed to parse response JSON schema metadata:', err);
            }
          }
          return msg;
        })
      );

    } catch (error) {
      console.error('Error connecting to translation streaming backend API:', error);
      setIsTyping(false);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        sender: 'bot',
        text: 'Sorry, I encountered an error connecting to the translation parser. Please make sure the backend is running.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const toggleThemeMode = () => {
    setTheme((prev) => ({
      ...prev,
      mode: prev.mode === 'dark' ? 'light' : 'dark'
    }));
  };

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${
      theme.mode === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Sidebar 
        sessions={sessions} 
        activeSession={activeSession} 
        setActiveSession={setActiveSession}
        theme={theme}
      />
      <ChatWindow 
        messages={messages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
        targetLanguage={targetLanguage}
        setTargetLanguage={setTargetLanguage}
        isTyping={isTyping}
        theme={theme}
        setTheme={setTheme}
        toggleThemeMode={toggleThemeMode}
      />
    </div>
  );
}

export default App;
