import React from 'react';
import { Sparkles, History } from 'lucide-react';

interface HeaderProps {
  todayDateStr: string;
  totalVisits: number;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  todayDateStr,
  totalVisits,
  onOpenHistory,
}) => {
  return (
    <header className="safe-top px-4 pt-3 pb-2 flex items-center justify-between border-b border-island-border/60 bg-island-bg">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-island-moss/10 flex items-center justify-center text-island-moss">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-island-text tracking-tight">마음이 자라는 세계</h1>
          <p className="text-[10px] text-island-text-muted">{todayDateStr} (한국시간)</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-island-sand-subtle text-island-text-secondary border border-island-sand/40">
          기록 {totalVisits}일째
        </span>
        <button
          type="button"
          onClick={onOpenHistory}
          title="기록 모아보기 및 관리"
          className="p-1.5 rounded-full text-island-text-secondary hover:text-island-text hover:bg-island-border/50 transition-colors"
        >
          <History className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
