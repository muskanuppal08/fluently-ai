import React from 'react';
import { GraduationCap } from 'lucide-react';

interface GrammarCardProps {
  originalText: string;
  correction: string;
  explanation: string;
}

export const GrammarCard: React.FC<GrammarCardProps> = ({ originalText, correction, explanation }) => {
  return (
    <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-4 space-y-2 backdrop-blur shadow-lg shadow-emerald-500/5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
        <GraduationCap className="w-4.5 h-4.5" />
        <span>Suggested Grammar Correction</span>
      </div>
      <p className="text-xs text-slate-300">
        Instead of: <span className="line-through text-slate-400">"{originalText}"</span>
      </p>
      <p className="text-sm font-semibold text-emerald-400">
        Use: "{correction}"
      </p>
      <p className="text-xs text-slate-400 leading-normal bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
        {explanation}
      </p>
    </div>
  );
};
