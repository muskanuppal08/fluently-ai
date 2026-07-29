import { useState } from 'react';
import { 
  Languages, 
  MessageSquare, 
  Settings, 
  History, 
  Send, 
  Volume2, 
  Sparkles, 
  User,
  GraduationCap,
  Globe,
  Trash2
} from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  targetLanguage: string;
  lastUpdated: string;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  originalText?: string;
  correction?: string;
  explanation?: string;
  timestamp: string;
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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* Sidebar Workspace */}
      <aside className="w-80 bg-slate-900/60 border-r border-slate-800 flex flex-col backdrop-blur-xl">
        {/* Header Branding */}
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="bg-purple-600/20 p-2.5 rounded-xl border border-purple-500/30">
            <Languages className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Langleo
            </h1>
            <p className="text-xs text-slate-400 font-medium">AI Translation Chatbot</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-4 py-4">
          <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition duration-200 shadow-lg shadow-purple-500/20 active:scale-95">
            <Sparkles className="w-4 h-4" />
            <span>New Immersive Room</span>
          </button>
        </div>

        {/* Session History */}
        <div className="flex-1 overflow-y-auto px-4 space-y-1.5 py-2">
          <div className="flex items-center text-xs font-semibold text-slate-500 px-3 py-2 space-x-1.5 uppercase tracking-wider">
            <History className="w-3.5 h-3.5" />
            <span>Learning Sessions</span>
          </div>
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setActiveSession(session.id)}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition group text-left ${
                activeSession === session.id
                  ? 'bg-slate-800/80 border border-slate-700/60 shadow-inner'
                  : 'hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <div className="flex items-start space-x-3 min-w-0">
                <MessageSquare className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  activeSession === session.id ? 'text-purple-400' : 'text-slate-400'
                }`} />
                <div className="min-w-0">
                  <p className="font-medium text-sm text-slate-200 truncate">{session.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-700/50 text-slate-300 rounded font-medium">
                      {session.targetLanguage}
                    </span>
                    <span className="text-[10px] text-slate-500">{session.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* User Workspace Info Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-purple-400">
              U
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Practice Learner</p>
              <p className="text-xs text-slate-500">Free Tier Account</p>
            </div>
          </div>
          <button className="p-2 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-slate-200 transition">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Workspace Chat Window */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Workspace Top Header */}
        <header className="h-20 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-xl flex items-center justify-between px-8 z-10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="font-semibold text-slate-100 text-base">Translation AI Room</h2>
            </div>
            <div className="h-4 w-[1px] bg-slate-800"></div>
            <div className="flex items-center space-x-2 text-sm text-slate-400 bg-slate-800/40 py-1.5 px-3 rounded-lg border border-slate-700/50">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>Target:</span>
              <select 
                value={targetLanguage} 
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none font-medium cursor-pointer"
              >
                <option value="Spanish">Spanish</option>
                <option value="Japanese">Japanese</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
          <button className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-rose-400 transition bg-slate-800/20 py-1.5 px-3 rounded-lg border border-slate-700/30">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </header>

        {/* Conversation Feed */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start max-w-2xl space-x-4 ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
              }`}
            >
              {/* Profile Icon */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                msg.sender === 'user'
                  ? 'bg-purple-600/10 border-purple-500/30 text-purple-400'
                  : 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400'
              }`}>
                {msg.sender === 'user' ? <User className="w-4.5 h-4.5" /> : <Languages className="w-4.5 h-4.5" />}
              </div>

              {/* Message Bubble Container */}
              <div className="space-y-2 max-w-xl">
                <div className={`px-5 py-3.5 rounded-2xl relative shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                  
                  <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-slate-100/10 text-[10px] text-slate-300">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'bot' && (
                      <button className="hover:text-white transition">
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Grammar Correction Card */}
                {msg.correction && (
                  <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-4 space-y-2 backdrop-blur shadow-lg shadow-emerald-500/5">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                      <GraduationCap className="w-4.5 h-4.5" />
                      <span>Suggested Grammar Correction</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Instead of: <span className="line-through text-slate-400">"{msg.originalText}"</span>
                    </p>
                    <p className="text-sm font-semibold text-emerald-400">
                      Use: "{msg.correction}"
                    </p>
                    <p className="text-xs text-slate-400 leading-normal bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                      {msg.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Interactive Area */}
        <div className="p-6 border-t border-slate-800/80 bg-slate-900/30 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto flex items-center space-x-4 bg-slate-950 border border-slate-800 focus-within:border-purple-500/50 rounded-2xl p-2 transition shadow-inner">
            <input
              type="text"
              placeholder={`Send message to practice or translate to ${targetLanguage}...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl transition duration-150 active:scale-95 flex-shrink-0 shadow-lg shadow-purple-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
