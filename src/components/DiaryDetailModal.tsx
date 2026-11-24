import React, { useState } from 'react';
import { X, Calendar, SlidersHorizontal, Trash2 } from 'lucide-react';
import { MindRecord, MIND_METAS } from '../lib/mindStore';
import { DiaryIllustrationSvg } from './DiaryIllustrationSvg';

interface DiaryDetailModalProps {
  record: MindRecord | null;
  onClose: () => void;
  onSwitchScene: (dateStr: string, sceneIndex: number) => void;
  onDeleteRecord: (dateStr: string) => void;
}

export const DiaryDetailModal: React.FC<DiaryDetailModalProps> = ({
  record,
  onClose,
  onSwitchScene,
  onDeleteRecord,
}) => {
  const [showScenePicker, setShowScenePicker] = useState(false);

  if (!record) return null;

  const meta = MIND_METAS[record.mind];
  const illustration = record.illustration;
  const candidates = illustration?.candidateScenes || [];
  const hasMultipleCandidates = candidates.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-island-border/80 max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base">{meta.emoji}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-island-text">{meta.label}</span>
                <span className="text-[10px] text-island-text-muted flex items-center gap-0.5">
                  <Calendar className="w-3 h-3" />
                  {record.date}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-island-text-muted hover:text-island-text hover:bg-island-bg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* Illustration if present */}
          {illustration && (
            <div>
              <DiaryIllustrationSvg illustration={illustration} />

              {/* Caption */}
              {illustration.caption && (
                <p className="text-[11px] font-medium text-island-text-muted mt-1.5 text-center italic break-keep px-2">
                  “{illustration.caption}”
                </p>
              )}

              {/* Scene Switcher if multiple candidates */}
              {hasMultipleCandidates && (
                <div className="mt-2 pt-2 border-t border-dashed border-island-border/60">
                  <button
                    type="button"
                    onClick={() => setShowScenePicker(!showScenePicker)}
                    className="flex items-center justify-center gap-1 text-[11px] font-bold text-island-moss hover:text-island-tree mx-auto py-1"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>장면 바꾸기 ({candidates.length}개 후보)</span>
                  </button>

                  {showScenePicker && (
                    <div className="flex flex-wrap gap-1.5 justify-center mt-2 animate-fade-in">
                      {candidates.map((c, idx) => {
                        const isSelected = illustration.selectedSceneIndex === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              onSwitchScene(record.date, idx);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              isSelected
                                ? 'bg-island-moss text-white shadow-sm'
                                : 'bg-island-bg text-island-text-secondary border border-island-border hover:bg-island-border/50'
                            }`}
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Original Text */}
          <div className="p-3.5 bg-island-bg rounded-2xl">
            <p className="text-xs text-island-text font-medium leading-relaxed break-keep whitespace-pre-line">
              {record.memo || record.diaryText || '기록된 글이 없습니다.'}
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-3 pt-3 border-t border-island-border/60 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              onDeleteRecord(record.date);
              onClose();
            }}
            className="text-[11px] font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>이 일기 삭제</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 bg-island-bg text-island-text font-bold rounded-xl text-xs hover:bg-island-border/40 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
