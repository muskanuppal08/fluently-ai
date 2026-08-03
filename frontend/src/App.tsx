import { useState, useEffect } from 'react';
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

export interface PracticeScenario {
  id: string;
  name: string;
  emoji: string;
  description: string;
  systemPromptAddition: string;
}

export const SCENARIOS: PracticeScenario[] = [
  {
    id: 'none',
    name: 'Free Chat & Translation',
    emoji: '💬',
    description: 'Simple casual conversation and quick translation assistance.',
    systemPromptAddition: ''
  },
  {
    id: 'cafe',
    name: 'Ordering in a Cafe',
    emoji: '☕',
    description: 'Practice ordering coffee and pastries, interacting with the barista.',
    systemPromptAddition: 'Act strictly as a busy but polite barista at a local cafe. Greet the user in the target language and wait for their order. Introduce minor complications like being out of certain milks or asking if they want it for here or to go.'
  },
  {
    id: 'hotel',
    name: 'Hotel Check-in',
    emoji: '🏨',
    description: 'Manage booking details, check-in questions, and request amenities.',
    systemPromptAddition: 'Act strictly as a helpful hotel front desk receptionist. Ask the user for their booking name, explain room amenities, ask for passport details, and hand over the virtual room keys.'
  },
  {
    id: 'directions',
    name: 'Asking for Directions',
    emoji: '🗺️',
    description: 'Practice asking local citizens for navigation help in a new city.',
    systemPromptAddition: 'Act strictly as a local pedestrian whom the user has stopped to ask for directions. Give simple, structured spatial directions using landmarks in the target language. Confirm if they understood.'
  }
];

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
  const [activeScenario, setActiveScenario] = useState<string>('none');

  const [theme, setTheme] = useState<ThemeConfig>({
    mode: 'dark',
    colorTheme: 'violet',
    chatBackground: 'bg-mesh-dark'
  });

  // Track system theme preferences or update dark mode class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme.mode]);

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
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessageText, 
          targetLanguage,
          scenarioId: activeScenario 
        })
      });

      if (!response.ok) throw new Error('Network response issues');

      setIsTyping(false);

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

        const lines = rawBuffer.split('\n');
        rawBuffer = lines.pop() || '';

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
            // Split boundaries
          }
        }
      }

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
                text: responseTranslation || rawText,
                originalText: parsedMetadata.originalText || undefined,
                correction: parsedMetadata.correction || undefined,
                explanation: parsedMetadata.explanation || undefined
              };
            } catch (err) {
              console.error('Failed to parse response JSON metadata:', err);
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

  const handleScenarioChange = (scenarioId: string) => {
    setActiveScenario(scenarioId);
    const selected = SCENARIOS.find(s => s.id === scenarioId);
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: selected?.id === 'none' 
          ? `Welcome to Free Chat mode. You can write in English or practice directly in ${targetLanguage}.`
          : `Entering practice room: **${selected?.name}** ${selected?.emoji}.\nLet's start our conversation roleplay in ${targetLanguage}!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
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
        activeScenario={activeScenario}
        onScenarioChange={handleScenarioChange}
      />
    </div>
  );
}

export default App;
