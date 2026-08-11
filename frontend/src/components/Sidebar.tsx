import React from 'react';
import { 
  Languages, 
  MessageSquare, 
  Settings, 
  History, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import type { ThemeConfig } from '../App';

export interface ChatSession {
  _id?: string;
  id?: string;
  title: string;
  targetLanguage: string;
  lastUpdated?: string;
  updatedAt?: string;
}

interface SidebarProps {
  sessions: ChatSession[];
  activeSession: string;
  setActiveSession: (id: string) => void;
  theme: ThemeConfig;
  onCreateSession: () => void;
  vocabNotebook: any[];
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, 
  activeSession, 
  setActiveSession, 
  theme, 
  onCreateSession,
  vocabNotebook
}) => {
  const isDark = theme.mode === 'dark';

  return (
    <aside className={`w-80 border-r flex flex-col backdrop-blur-xl shrink-0 transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-900/40 border-slate-800/80 text-slate-200' 
        : 'bg-white/60 border-slate-200 text-slate-800'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b flex items-center space-x-3 ${isDark ? 'border-slate-800/60' : 'border-slate-100'}`}>
        <div className={`p-2.5 rounded-xl border ${
          isDark 
            ? 'bg-purple-950/20 border-purple-500/20 text-purple-400' 
            : 'bg-purple-50 border-purple-200 text-purple-600'
        }`}>
          <Languages className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent m-0 leading-none">
            Fluently
          </h1>
          <p className={`text-xs font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>AI Practice Partner</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-4 py-4">
        <button 
          onClick={onCreateSession}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-purple-500/10 active:scale-95 cursor-pointer text-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Immersive Room</span>
        </button>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1.5 py-2">
        <div className="flex items-center text-xs font-semibold text-slate-400 px-3 py-2 space-x-1.5 uppercase tracking-wider">
          <History className="w-3.5 h-3.5" />
          <span>Learning Sessions</span>
        </div>
        {sessions.map((session) => {
          const sessionId = session._id || session.id || '';
          return (
            <button
              key={sessionId}
              onClick={() => setActiveSession(sessionId)}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition group text-left cursor-pointer ${
                activeSession === sessionId
                  ? isDark 
                    ? 'bg-slate-800/60 border border-slate-700/30' 
                    : 'bg-slate-100 border border-slate-200/50 shadow-sm'
                  : isDark 
                    ? 'hover:bg-slate-800/30 border border-transparent' 
                    : 'hover:bg-slate-100/50 border border-transparent'
              }`}
            >
              <div className="flex items-start space-x-3 min-w-0">
                <MessageSquare className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  activeSession === sessionId ? 'text-purple-550' : 'text-slate-400'
                }`} />
                <div className="min-w-0">
                  <p className={`font-semibold text-sm truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{session.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      isDark ? 'bg-slate-800/90 text-slate-400' : 'bg-slate-200/60 text-slate-600'
                    }`}>
                      {session.targetLanguage}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Vocabulary Saved Notebook Stats Panel */}
      {vocabNotebook.length > 0 && (
        <div className={`mx-4 my-2 p-3.5 rounded-xl border flex items-center space-x-3 transition ${
          isDark ? 'bg-slate-900/20 border-slate-800/60' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <p className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Saved Vocabulary</p>
            <p className="text-[11px] text-slate-400">{vocabNotebook.length} phrases bookmarked</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={`p-4 border-t flex items-center justify-between ${isDark ? 'border-slate-800/60 bg-slate-950/20' : 'border-slate-100 bg-slate-50/50'}`}>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold ${
            isDark ? 'bg-slate-800 border-slate-700 text-purple-400' : 'bg-slate-100 border-slate-200 text-purple-600'
          }`}>
            U
          </div>
          <div>
            <p className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Practice Learner</p>
            <p className="text-xs text-slate-400">Free Tier Account</p>
          </div>
        </div>
        <button className={`p-2 rounded-lg transition cursor-pointer ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-700'}`}>
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
