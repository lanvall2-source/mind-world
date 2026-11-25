import React, { useState, useEffect } from 'react';
import { Feather, Check, Edit2, Sparkles, CheckCircle2 } from 'lucide-react';
import {
  DiaryEntry,
  MindType,
  MIND_METAS,
  extractWorldElements,
} from '../lib/mindStore';

interface DiaryEditorProps {
  todayDateStr: string;
  existingEntry: DiaryEntry | null;
  onSaveDiary: (content: string, mind: MindType) => void;
}

export const DiaryEditor: React.FC<DiaryEditorProps> = ({
  todayDateStr,
  existingEntry,
  onSaveDiary,
}) => {
  const [content, setContent] = useState(existingEntry?.content || '');
  const [mind, setMind] = useState<MindType>(existingEntry?.mind || 'peaceful');
  const [isEditing, setIsEditing] = useState(!existingEntry);

  useEffect(() => {
    if (existingEntry) {
      setContent(existingEntry.content);
      setMind(existingEntry.mind);
      setIsEditing(false);
    } else {
      setContent('');
      setIsEditing(true);
    }
  }, [existingEntry]);

  const liveElements = extractWorldElements(content);

  const handleSave = () => {
    if (!content.trim()) return;
    onSaveDiary(content.trim(), mind);
    setIsEditing(false);
  };

  const mindKeys: MindType[] = ['peaceful', 'flutter', 'tired', 'complex'];

  return (
    <section className="bg-white border border-island-border/80 rounded-3xl p-4 sm:p-5 shadow-xs transition-all">
      {/* Header: Date & Mood title */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Feather className="w-4 h-4 text-island-moss shrink-0" />
          <h2 className="text-sm font-bold text-island-text truncate">오늘의 일기 쓰기</h2>
        </div>
        <span className="text-[11px] font-semibold text-island-text-muted whitespace-nowrap shrink-0">
          {todayDateStr}
        </span>
      </div>

      {isEditing ? (
        <div className="space-y-3.5">
          {/* Quick Mood Selector */}
          <div>
            <label className="text-[11px] font-bold text-island-text-secondary block mb-1.5">
              오늘 하루 마음에 머문 색채
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {mindKeys.map((key) => {
                const meta = MIND_METAS[key];
                const isSelected = mind === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMind(key)}
                    className={`h-9 px-1 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 border whitespace-nowrap min-w-0 ${
                      isSelected
                        ? 'bg-island-moss text-white border-island-moss shadow-xs'
                        : 'bg-island-bg text-island-text-secondary border-island-border hover:bg-island-border/40'
                    }`}
                  >
                    <span className="shrink-0">{meta.emoji}</span>
                    <span className="truncate">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Diary Text Area */}
          <div>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="오늘 하루 어떤 시간과 장소를 지나오셨나요? 사소한 행동, 나눈 대화, 느꼈던 생각을 자유롭게 적어보세요. 이 글의 기억들이 모여 당신만의 세계를 이룹니다."
              maxLength={1000}
              className="w-full p-3.5 text-xs bg-island-bg border border-island-border/90 focus:border-island-moss rounded-2xl font-medium text-island-text focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Live Extracted Memory Seeds */}
          {liveElements.length > 0 && (
            <div className="p-2.5 bg-island-moss-subtle/60 rounded-xl space-y-1.5">
              <span className="text-[10px] font-bold text-island-moss flex items-center gap-1">
                <Sparkles className="w-3 h-3 shrink-0" />
                세계에 심어질 기억 조각 ({liveElements.length}개)
              </span>
              <div className="flex flex-wrap gap-1">
                {liveElements.map((elem) => (
                  <span
                    key={elem}
                    className="px-2 py-0.5 bg-white text-island-text text-[10px] font-semibold rounded-md border border-island-border/60 whitespace-nowrap shadow-2xs"
                  >
                    {elem}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          <button
            type="button"
            disabled={!content.trim()}
            onClick={handleSave}
            className="w-full py-3 bg-island-moss text-white rounded-2xl text-xs font-bold hover:bg-island-tree transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none"
          >
            <Check className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">오늘의 일기 저장하고 세계에 심기</span>
          </button>
        </div>
      ) : (
        /* Saved View (Clean, structured, no text clipping) */
        <div className="space-y-3">
          {/* Status Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-island-border/60 gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs px-2.5 py-0.5 bg-island-moss-subtle text-island-moss font-bold rounded-full border border-island-moss/20 shrink-0">
                {MIND_METAS[mind]?.emoji} {MIND_METAS[mind]?.label}
              </span>
              <span className="text-[11px] font-semibold text-island-text-secondary truncate">
                오늘 남긴 마음
              </span>
            </div>
            <span className="text-[10px] text-island-moss font-bold shrink-0 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>기록 완료</span>
            </span>
          </div>

          {/* Diary Body Content */}
          <div className="p-4 bg-island-bg rounded-2xl border border-island-border/60">
            <p className="text-xs text-island-text font-medium leading-relaxed whitespace-pre-line break-keep">
              {content}
            </p>

            {existingEntry?.extractedElements && existingEntry.extractedElements.length > 0 && (
              <div className="mt-3.5 pt-2.5 border-t border-island-border/50">
                <p className="text-[10px] font-bold text-island-text-muted mb-1.5">
                  세계에 남긴 기억의 조각들:
                </p>
                <div className="flex flex-wrap gap-1">
                  {existingEntry.extractedElements.map((el) => (
                    <span
                      key={el}
                      className="text-[10px] px-2 py-0.5 bg-white rounded-md text-island-text-secondary border border-island-border/60 shadow-2xs"
                    >
                      {el}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full py-2.5 bg-island-bg hover:bg-island-border/40 text-island-text-secondary rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 active:scale-[0.99]"
          >
            <Edit2 className="w-3.5 h-3.5 shrink-0" />
            <span>일기 수정하기</span>
          </button>
        </div>
      )}
    </section>
  );
};
