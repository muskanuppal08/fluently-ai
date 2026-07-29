import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import type { ChatSession } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import type { Message } from './components/ChatWindow';

// Color themes with classy, desaturated palettes
export type ColorTheme = 'violet' | 'emerald' | 'slate' | 'amber';

export interface ThemeConfig {
  mode: 'light' | 'dark';
  colorTheme: ColorTheme;
  chatBackground: string;
}

function App() {
  const [sessions] = useState<ChatSession[]>([
    { id: '1', title: 'Cafe ordering practice', targetLanguage: 'Spanish', lastUpdated: '10 mins ago' },
    { id: '2', title: 'Directions in Tokyo', targetLanguage: 'Japanese', lastUpdated: 'Yesterday' }
  ]);
  const [activeSession, setActiveSession] = useState<string>('1');
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'm1', 
      sender: 'bot', 
      text: '¡Hola! ¿Cómo estás hoy? ¿En qué te puedo ayudar? (Hello! How are you today? How can I help you?)', 
      timestamp: '10:10 AM' 
    },
    { 
      id: 'm2', 
      sender: 'user', 
      text: 'Yo querer un cafe por favor.', 
      originalText: 'Yo querer un cafe por favor.',
      correction: 'Quiero un café, por favor.', 
      explanation: 'In Spanish, we use the conjugated verb "Quiero" (I want) instead of the infinitive "querer" (to want) when ordering.',
      timestamp: '10:12 AM' 
    },
    { 
      id: 'm3', 
      sender: 'bot', 
      text: '¡Excelente! Un café con leche o café solo? (Excellent! Coffee with milk or black coffee?)', 
      timestamp: '10:12 AM' 
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [isTyping, setIsTyping] = useState(false);

  // Classy customization theme state
  const [theme, setTheme] = useState<ThemeConfig>({
    mode: 'dark',
    colorTheme: 'violet',
    chatBackground: 'bg-mesh-dark' // custom gradient background
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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');

    // Trigger typing indicator mock response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `Translation analysis processed successfully.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1500);
  };

  const toggleThemeMode = () => {
    setTheme(prev => ({
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
