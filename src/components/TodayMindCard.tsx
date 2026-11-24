import React, { useState } from 'react';
import { Compass, Check, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';
import { MindType, MIND_METAS } from '../lib/mindStore';

interface TodayMindCardProps {
  mind: MindType;
  currentMemo: string;
  isFinishedToday: boolean;
  onUpdateMemo: (memo: string) => void;
  onStartWalk: () => void;
  onFinishToday: () => void;
  onChangeMind: () => void;
}

export const TodayMindCard: React.FC<TodayMindCardProps> = ({
  mind,
  currentMemo,
  isFinishedToday,
  onUpdateMemo,
  onStartWalk,
  onFinishToday,
  onChangeMind,
}) => {
  const meta = MIND_METAS[mind];
  const [isMemoOpen, setIsMemoOpen] = useState(Boolean(currentMemo));
  const [memoText, setMemoText] = useState(currentMemo);

  const handleSaveMemo = () => {
    onUpdateMemo(memoText.trim());
  };

  return (
    <section className="px-4 py-3 animate-fade-in">
      <div className="p-4 bg-white border border-island-border/80 rounded-3xl shadow-sm max-w-sm mx-auto">
        {/* Feeling badge and supportive message */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-island-moss-subtle border border-island-moss/20 rounded-full">
            <span className="text-sm">{meta.emoji}</span>
            <span className="text-xs font-bold text-island-moss">{meta.label}</span>
          </div>
          <button
            type="button"
            onClick={onChangeMind}
            className="text-[11px] font-medium text-island-text-muted hover:text-island-text transition-colors"
          >
            마음 바꾸기
          </button>
        </div>

        <p className="text-sm font-bold text-island-text leading-snug my-2 break-keep">
          “{meta.comfortMessage}”
        </p>

        {/* Optional Memo Toggle */}
        <div className="mt-3 pt-3 border-t border-island-border/50">
          <button
            type="button"
            onClick={() => setIsMemoOpen(!isMemoOpen)}
            className="flex items-center justify-between w-full text-xs text-island-text-secondary font-semibold hover:text-island-text transition-colors"
          >
            <span className="flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5" />
              {currentMemo ? '남긴 한 줄 메모' : '한 줄 메모 남기기 (선택)'}
            </span>
            {isMemoOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isMemoOpen && (
            <div className="mt-2 space-y-2 animate-fade-in">
              <input
                type="text"
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                onBlur={handleSaveMemo}
                placeholder="오늘 하루 있었던 일이나 생각 (선택사항)"
                maxLength={80}
                className="w-full px-3 py-2 text-xs bg-island-bg border border-island-border rounded-xl font-medium text-island-text focus:outline-none focus:border-island-moss"
              />
            </div>
          )}
        </div>

        {/* Action Choices: 산책하기 vs 오늘은 여기까지 */}
        <div className="mt-4 pt-3 border-t border-island-border/60">
          {isFinishedToday ? (
            <div className="p-3 bg-island-moss-subtle/70 rounded-2xl text-center">
              <p className="text-xs font-bold text-island-moss flex items-center justify-center gap-1">
                <Check className="w-4 h-4" />
                오늘의 마음이 섬에 소중히 심어졌어요
              </p>
              <button
                type="button"
                onClick={onStartWalk}
                className="mt-2 text-xs font-semibold text-island-text-secondary hover:text-island-moss underline underline-offset-2 transition-colors"
              >
                섬 산책 한번 더 하기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onStartWalk}
                className="py-2.5 px-3 bg-island-moss text-white rounded-xl text-xs font-bold hover:bg-island-tree transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
              >
                <Compass className="w-4 h-4" />
                <span>마음 산책하기</span>
              </button>

              <button
                type="button"
                onClick={onFinishToday}
                className="py-2.5 px-3 bg-island-bg text-island-text-secondary border border-island-border hover:bg-island-border/40 rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
              >
                <span>오늘은 여기까지</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
