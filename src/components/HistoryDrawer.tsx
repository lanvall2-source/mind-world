import React, { useState } from 'react';
import { X, Trash2, Calendar, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { MindRecord, MIND_METAS } from '../lib/mindStore';
import { DiaryIllustrationSvg } from './DiaryIllustrationSvg';
import { DiaryDetailModal } from './DiaryDetailModal';

interface HistoryDrawerProps {
  isOpen: boolean;
  records: MindRecord[];
  onClose: () => void;
  onDeleteRecord: (dateStr: string) => void;
  onResetAll: () => void;
  onSwitchScene: (dateStr: string, sceneIndex: number) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  records,
  onClose,
  onDeleteRecord,
  onResetAll,
  onSwitchScene,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<MindRecord | null>(null);

  if (!isOpen) return null;

  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-island-border/80 max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div>
              <h3 className="text-sm font-bold text-island-text">내 마음 기록 보관함</h3>
              <p className="text-[11px] text-island-text-muted">지금까지 남긴 모든 일기와 삽화</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-island-text-muted hover:text-island-text hover:bg-island-bg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List of records */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {sorted.length === 0 ? (
              <p className="text-xs text-island-text-muted py-8 text-center">
                아직 남겨진 기록이 없습니다.
              </p>
            ) : (
              sorted.map((rec) => {
                const meta = MIND_METAS[rec.mind];
                const text = rec.memo || rec.diaryText || '';

                return (
                  <div
                    key={rec.date}
                    onClick={() => setSelectedRecordForDetail(rec)}
                    className="p-3 bg-island-bg border border-island-border/70 hover:border-island-moss/60 rounded-2xl flex items-start gap-3 cursor-pointer transition-all active:scale-[0.99] group shadow-xs"
                  >
                    {/* Thumbnail if illustration present */}
                    {rec.illustration ? (
                      <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 border border-island-border/80">
                        <DiaryIllustrationSvg
                          illustration={rec.illustration}
                          className="w-full h-full pointer-events-none"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-island-moss-subtle/80 flex items-center justify-center text-island-moss shrink-0">
                        <span className="text-base">{meta.emoji}</span>
                      </div>
                    )}

                    {/* Content Preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-island-text">{meta.label}</span>
                          <span className="text-[10px] text-island-text-muted flex items-center gap-0.5">
                            <Calendar className="w-2.5 h-2.5" />
                            {rec.date}
                          </span>
                        </div>
                        {rec.illustration && (
                          <span className="text-[10px] text-island-moss font-bold flex items-center gap-0.5">
                            <ImageIcon className="w-2.5 h-2.5" />
                            삽화
                          </span>
                        )}
                      </div>

                      {text ? (
                        <p className="text-xs text-island-text-secondary mt-1 line-clamp-2 leading-relaxed break-keep">
                          {text}
                        </p>
                      ) : (
                        <p className="text-[11px] text-island-text-muted mt-1 italic">
                          기록된 글 없음
                        </p>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRecord(rec.date);
                      }}
                      title="이 날의 기록 삭제"
                      className="p-1 text-island-text-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Danger zone / Reset button */}
          <div className="mt-3 pt-3 border-t border-island-border/60 shrink-0 space-y-2">
            {showConfirmReset ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-center">
                <p className="text-xs font-bold text-red-600 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  모든 기록과 섬의 성장을 초기화할까요?
                </p>
                <p className="text-[10px] text-red-500 mt-1">삭제된 데이터는 복구할 수 없습니다.</p>
                <div className="flex items-center gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-1.5 bg-white border border-red-200 rounded-xl text-xs font-semibold text-island-text"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onResetAll();
                      setShowConfirmReset(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
                  >
                    네, 초기화합니다
                  </button>
                </div>
              </div>
            ) : (
              sorted.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(true)}
                  className="w-full py-2 text-[11px] font-semibold text-island-text-muted hover:text-red-600 transition-colors"
                >
                  전체 기록 초기화
                </button>
              )
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-island-bg text-island-text font-bold rounded-xl text-xs hover:bg-island-border/40 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>

      {/* Diary Detail Modal when tapping a history entry */}
      <DiaryDetailModal
        record={selectedRecordForDetail}
        onClose={() => setSelectedRecordForDetail(null)}
        onSwitchScene={onSwitchScene}
        onDeleteRecord={onDeleteRecord}
      />
    </>
  );
};
