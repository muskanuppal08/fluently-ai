import React, { useState } from 'react';
import { 
  Languages, 
  Send, 
  Volume2, 
  User, 
  Globe, 
  Trash2,
  Sun,
  Moon,
  Palette,
  LayoutGrid,
  Gamepad2,
  Bookmark
} from 'lucide-react';
import { GrammarCard } from './GrammarCard';
import type { ThemeConfig, ColorTheme } from '../App';
import { SCENARIOS } from '../App';

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  originalText?: string;
  correction?: string;
  explanation?: string;
  timestamp: string;
}

interface ChatWindowProps {
  messages: Message[];
  inputValue: string;
  setInputValue: (val: string) => void;
  handleSendMessage: () => void;
  targetLanguage: string;
  setTargetLanguage: (val: string) => void;
  isTyping?: boolean;
  theme: ThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<ThemeConfig>>;
  toggleThemeMode: () => void;
  activeScenario: string;
  onScenarioChange: (id: string) => void;
  onSavePhrase: (msg: Message) => void;
}

const BACKGROUNDS = [
  { id: 'bg-mesh-dark', name: 'Classic Dark', class: 'bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900' },
  { id: 'bg-nebula', name: 'Cosmic Nebula', class: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/60 via-slate-950 to-slate-950' },
  { id: 'bg-minimal', name: 'Clean Minimalist', class: 'bg-slate-950' }
];

const LIGHT_BACKGROUNDS = [
  { id: 'bg-mesh-light', name: 'Classic Light', class: 'bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30' },
  { id: 'bg-warm', name: 'Soft Warm', class: 'bg-gradient-to-br from-orange-50/20 via-slate-50 to-amber-50/10' },
  { id: 'bg-minimal-light', name: 'Clean Minimalist', class: 'bg-slate-50' }
];

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  inputValue,
  setInputValue,
  handleSendMessage,
  targetLanguage,
  setTargetLanguage,
  isTyping = false,
  theme,
  setTheme,
  toggleThemeMode,
  activeScenario,
  onScenarioChange,
  onSavePhrase
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const isDark = theme.mode === 'dark';

  const themeClasses = {
    violet: {
      accent: 'text-indigo-400',
      border: 'focus-within:border-indigo-500/40',
      btn: 'bg-indigo-600/90 hover:bg-indigo-500 text-white',
      accentBg: 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400'
    },
    emerald: {
      accent: 'text-emerald-500',
      border: 'focus-within:border-emerald-500/40',
      btn: 'bg-emerald-600/95 hover:bg-emerald-500 text-white',
      accentBg: 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400'
    },
    slate: {
      accent: 'text-slate-400',
      border: 'focus-within:border-slate-500/40',
      btn: 'bg-slate-700 hover:bg-slate-600 text-white',
      accentBg: 'bg-slate-700/10 border-slate-600/30 text-slate-400'
    },
    amber: {
      accent: 'text-amber-500',
      border: 'focus-within:border-amber-500/40',
      btn: 'bg-amber-600/95 hover:bg-amber-500 text-white',
      accentBg: 'bg-amber-600/10 border-amber-500/30 text-amber-550'
    }
  };

  const currentTheme = themeClasses[theme.colorTheme];

  const getChatBgClass = () => {
    const list = isDark ? BACKGROUNDS : LIGHT_BACKGROUNDS;
    const match = list.find(bg => bg.id === theme.chatBackground);
    return match ? match.class : list[0].class;
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 relative">
      {/* Header */}
      <header className={`h-20 border-b flex items-center justify-between px-8 z-10 transition-colors duration-300 ${
        isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className={`font-semibold text-base ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Practice Room</h2>
          </div>
          
          <div className={`h-4 w-[1px] ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>

          {/* Scenario Selector */}
          <div className={`flex items-center space-x-2 text-sm py-1.5 px-3 rounded-lg border transition ${
            isDark ? 'text-slate-400 bg-slate-800/40 border-slate-700/50' : 'text-slate-600 bg-slate-100 border-slate-200'
          }`}>
            <Gamepad2 className="w-4 h-4 text-indigo-400" />
            <select
              value={activeScenario}
              onChange={(e) => onScenarioChange(e.target.value)}
              className={`bg-transparent focus:outline-none font-medium cursor-pointer ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
            >
              {SCENARIOS.map(s => (
                <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>
              ))}
            </select>
          </div>

          <div className={`h-4 w-[1px] ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
          
          <div className={`flex items-center space-x-2 text-sm py-1.5 px-3 rounded-lg border transition ${
            isDark ? 'text-slate-400 bg-slate-800/40 border-slate-700/50' : 'text-slate-600 bg-slate-100 border-slate-200'
          }`}>
            <Globe className="w-4 h-4 text-purple-500" />
            <span>Target:</span>
            <select 
              value={targetLanguage} 
              onChange={(e) => setTargetLanguage(e.target.value)}
              className={`bg-transparent focus:outline-none font-medium cursor-pointer ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
            >
              <option value="Spanish">Spanish</option>
              <option value="Japanese">Japanese</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Customizer */}
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className={`p-2 rounded-lg transition cursor-pointer border ${
              isDark 
                ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-850' 
                : 'hover:bg-slate-100 text-slate-600 hover:text-slate-800 border-slate-200'
            }`}
            title="Room Aesthetics"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Toggle */}
          <button 
            onClick={toggleThemeMode}
            className={`p-2 rounded-lg transition cursor-pointer border ${
              isDark 
                ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-850' 
                : 'hover:bg-slate-100 text-slate-600 hover:text-slate-800 border-slate-200'
            }`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button className={`flex items-center space-x-1.5 text-xs transition py-1.5 px-3 rounded-lg border cursor-pointer ${
            isDark 
              ? 'text-slate-400 hover:text-rose-400 bg-slate-800/20 border-slate-700/30' 
              : 'text-slate-500 hover:text-rose-600 bg-slate-100 border-slate-200'
          }`}>
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </header>

      {/* Customizer Panel */}
      {showConfig && (
        <div className={`absolute top-22 right-8 p-5 rounded-2xl border shadow-xl z-20 w-80 backdrop-blur-xl transition duration-200 ${
          isDark ? 'bg-slate-900/95 border-slate-800 text-slate-200' : 'bg-white/95 border-slate-200 text-slate-800'
        }`}>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Classy Accent Colors</h4>
              <div className="grid grid-cols-4 gap-2">
                {(['violet', 'emerald', 'slate', 'amber'] as ColorTheme[]).map((col) => (
                  <button
                    key={col}
                    onClick={() => setTheme(prev => ({ ...prev, colorTheme: col }))}
                    className={`h-8 rounded-lg border capitalize text-[11px] font-semibold transition cursor-pointer ${
                      theme.colorTheme === col 
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400' 
                        : 'border-transparent hover:bg-slate-800/30'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Room Wallpaper</h4>
              <div className="space-y-1.5">
                {(isDark ? BACKGROUNDS : LIGHT_BACKGROUNDS).map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setTheme(prev => ({ ...prev, chatBackground: bg.id }))}
                    className={`w-full flex items-center space-x-2 p-2 rounded-lg border text-left text-xs transition cursor-pointer ${
                      theme.chatBackground === bg.id 
                        ? 'border-purple-500 bg-purple-500/5' 
                        : 'border-transparent hover:bg-slate-800/20'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-purple-400" />
                    <span>{bg.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message list */}
      <div className={`flex-1 overflow-y-auto p-8 space-y-6 transition-all duration-300 ${getChatBgClass()}`}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start max-w-2xl space-x-4 ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border transition ${
              msg.sender === 'user'
                ? isDark 
                  ? 'bg-purple-950/20 border-purple-500/20 text-purple-400' 
                  : 'bg-purple-50 border-purple-200 text-purple-600'
                : currentTheme.accentBg
            }`}>
              {msg.sender === 'user' ? <User className="w-4.5 h-4.5" /> : <Languages className="w-4.5 h-4.5" />}
            </div>

            <div className="space-y-2 max-w-xl">
              <div className={`px-5 py-3.5 rounded-2xl relative shadow-sm transition ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-br from-purple-600/90 to-indigo-600/90 text-white rounded-tr-none'
                  : isDark 
                    ? 'bg-slate-900/90 border border-slate-800/80 text-slate-100 rounded-tl-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                
                <div className={`flex items-center justify-between mt-2.5 pt-1.5 border-t text-[10px] space-x-4 ${
                  msg.sender === 'user' 
                    ? 'border-white/10 text-purple-200' 
                    : isDark ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'
                }`}>
                  <span>{msg.timestamp}</span>
                  <div className="flex items-center space-x-2">
                    {msg.sender === 'bot' && (
                      <>
                        <button 
                          onClick={() => onSavePhrase(msg)}
                          className="hover:text-purple-400 transition cursor-pointer"
                          title="Save to Notebook"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                        <button className="hover:text-purple-400 transition cursor-pointer">
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {msg.correction && msg.originalText && msg.explanation && (
                <GrammarCard 
                  originalText={msg.originalText} 
                  correction={msg.correction} 
                  explanation={msg.explanation} 
                />
              )}
            </div>
          </div>
        ))}

        {/* Typing */}
        {isTyping && (
          <div className="flex items-start max-w-2xl space-x-4 mr-auto">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${currentTheme.accentBg}`}>
              <Languages className="w-4.5 h-4.5" />
            </div>
            <div className={`px-5 py-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1 ${
              isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'
            }`}>
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce delay-225"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className={`p-6 border-t transition-colors duration-300 ${
        isDark ? 'border-slate-800/80 bg-slate-900/20' : 'border-slate-200/60 bg-slate-50/50'
      }`}>
        <div className={`max-w-4xl mx-auto flex items-center space-x-4 border rounded-2xl p-2 transition shadow-inner ${
          isDark 
            ? 'bg-slate-950 border-slate-850 focus-within:border-purple-500/30' 
            : 'bg-white border-slate-200 focus-within:border-purple-500/40'
        }`}>
          <input
            type="text"
            placeholder={
              activeScenario === 'none' 
                ? `Send message to practice or translate to ${targetLanguage}...` 
                : `Say something in context of the scenario...`
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className={`flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none ${
              isDark ? 'text-slate-200 placeholder-slate-500' : 'text-slate-700 placeholder-slate-400'
            }`}
          />
          <button
            onClick={handleSendMessage}
            className={`p-3 rounded-xl transition duration-150 active:scale-95 flex-shrink-0 shadow-sm cursor-pointer ${
              isDark 
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/10' 
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/10'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  );
};
