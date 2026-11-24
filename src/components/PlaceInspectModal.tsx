import React from 'react';
import { X, Trash2, Calendar } from 'lucide-react';
import { MindType, MIND_METAS, MindRecord } from '../lib/mindStore';

interface PlaceInspectModalProps {
  mind: MindType | null;
  stage: number;
  records: MindRecord[];
  onClose: () => void;
  onDeleteRecord: (dateStr: string) => void;
}

export const PlaceInspectModal: React.FC<PlaceInspectModalProps> = ({
  mind,
  stage,
  records,
  onClose,
  onDeleteRecord,
}) => {
  if (!mind) return null;

  const meta = MIND_METAS[mind];
  const placeRecords = records
    .filter((r) => r.mind === mind)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-island-border/80 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{meta.emoji}</span>
            <div>
              <h3 className="text-sm font-bold text-island-text">{meta.placeName}</h3>
              <p className="text-[11px] text-island-text-muted">
                {stage > 0 ? `${stage}단계: ${meta.stages[stage - 1]}` : '아직 자라지 않은 장소'}
              </p>
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

        {/* Growth Progress Indicator */}
        <div className="p-3 bg-island-bg rounded-2xl mb-3 shrink-0">
          <div className="flex items-center justify-between text-xs font-semibold text-island-text-secondary mb-1.5">
            <span>성장 단계</span>
            <span>{placeRecords.length}일 기록됨</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  stage >= s ? 'bg-island-moss' : 'bg-island-border/80'
                }`}
              />
            ))}
          </div>
          <p className="text-[10px] text-island-text-muted mt-2 leading-relaxed">
            {stage === 0 && '이 마음을 기록하면 새로운 사물이 나타납니다.'}
            {stage === 1 && `다음 기록 시: 2단계 '${meta.stages[1]}'로 자라납니다.`}
            {stage === 2 && `다음 기록 시: 3단계 '${meta.stages[2]}'로 완성됩니다.`}
            {stage >= 3 && '최고 단계에 도달했습니다. 계속해서 마음을 심을 수 있습니다.'}
          </p>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <p className="text-[11px] font-bold text-island-text-secondary mb-1">
            이곳에 남긴 마음 기록 ({placeRecords.length}개)
          </p>
          {placeRecords.length === 0 ? (
            <p className="text-xs text-island-text-muted py-6 text-center">
              아직 남겨진 기록이 없습니다.
            </p>
          ) : (
            placeRecords.map((rec) => (
              <div
                key={rec.date}
                className="p-3 bg-island-bg-card border border-island-border/70 rounded-2xl flex items-start justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-island-text">
                    <Calendar className="w-3.5 h-3.5 text-island-moss shrink-0" />
                    <span>{rec.date}</span>
                  </div>
                  {rec.memo ? (
                    <p className="text-xs text-island-text-secondary mt-1 break-keep">
                      “{rec.memo}”
                    </p>
                  ) : (
                    <p className="text-[11px] text-island-text-muted mt-0.5">남긴 메모 없음</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteRecord(rec.date)}
                  title="이 날의 기록 삭제"
                  className="p-1 text-island-text-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Close Button */}
        <div className="mt-3 pt-2 border-t border-island-border/60 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-island-bg text-island-text font-bold rounded-xl text-xs hover:bg-island-border/40 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
