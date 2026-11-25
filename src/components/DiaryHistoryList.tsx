import React, { useState } from 'react';
import { BookOpen, Calendar, Trash2, Edit2, X, Filter } from 'lucide-react';
import { DiaryEntry, MIND_METAS } from '../lib/mindStore';

interface DiaryHistoryListProps {
  entries: DiaryEntry[];
  filterTag: string | null;
  onClearFilter: () => void;
  onSelectEntryForEdit: (entry: DiaryEntry) => void;
  onDeleteEntry: (dateStr: string) => void;
}

export const DiaryHistoryList: React.FC<DiaryHistoryListProps> = ({
  entries,
  filterTag,
  onClearFilter,
  onSelectEntryForEdit,
  onDeleteEntry,
}) => {
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  const filtered = filterTag
    ? entries.filter((e) => e.extractedElements?.includes(filterTag))
    : entries;

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="bg-white border border-island-border/80 rounded-3xl p-4 sm:p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <BookOpen className="w-4 h-4 text-island-moss shrink-0" />
          <h3 className="text-sm font-bold text-island-text truncate">일기 보관함</h3>
        </div>
        <span className="text-xs text-island-text-muted whitespace-nowrap shrink-0">
          총 {entries.length}편의 일기
        </span>
      </div>

      {/* Filter Chip if active */}
      {filterTag && (
        <div className="mb-3 p-2 bg-island-moss-subtle/70 rounded-xl flex items-center justify-between gap-2 animate-fade-in">
          <div className="flex items-center gap-1 text-xs font-bold text-island-moss min-w-0 truncate">
            <Filter className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">'{filterTag}' 조각 일기 ({sorted.length}편)</span>
          </div>
          <button
            type="button"
            onClick={onClearFilter}
            className="p-1 text-island-text-muted hover:text-island-text rounded-md shrink-0"
            title="필터 해제"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {sorted.length === 0 ? (
          <p className="text-xs text-island-text-muted py-8 text-center break-keep">
            {filterTag ? `'${filterTag}' 조각이 담긴 일기가 없습니다.` : '아직 작성된 일기가 없습니다.'}
          </p>
        ) : (
          sorted.map((entry) => {
            const meta = MIND_METAS[entry.mind] || MIND_METAS['peaceful'];
            return (
              <div
                key={entry.date}
                onClick={() => setSelectedEntry(entry)}
                className="p-3.5 bg-island-bg hover:bg-island-bg-card border border-island-border/70 hover:border-island-moss/50 rounded-2xl cursor-pointer transition-all active:scale-[0.99] group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs shrink-0">{meta.emoji}</span>
                    <span className="text-xs font-bold text-island-text shrink-0">{meta.label}</span>
                    <span className="text-[10px] text-island-text-muted flex items-center gap-0.5 ml-1 truncate">
                      <Calendar className="w-2.5 h-2.5 shrink-0" />
                      {entry.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEntryForEdit(entry);
                      }}
                      title="수정"
                      className="p-1 text-island-text-muted hover:text-island-moss rounded-md hover:bg-white transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`${entry.date} 일기를 삭제하시겠습니까?`)) {
                          onDeleteEntry(entry.date);
                        }
                      }}
                      title="삭제"
                      className="p-1 text-island-text-muted hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-island-text font-medium line-clamp-2 leading-relaxed break-keep">
                  {entry.content}
                </p>

                {entry.extractedElements && entry.extractedElements.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {entry.extractedElements.map((elem) => (
                      <span
                        key={elem}
                        className="text-[9px] px-1.5 py-0.5 bg-white text-island-text-secondary rounded border border-island-border/60 shadow-2xs"
                      >
                        {elem}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Detail Read Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-island-border/80 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between mb-3 shrink-0 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base shrink-0">{MIND_METAS[selectedEntry.mind]?.emoji}</span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-island-text truncate">
                    {selectedEntry.date}의 기록
                  </h4>
                  <p className="text-[10px] text-island-text-muted truncate">
                    {MIND_METAS[selectedEntry.mind]?.label}의 마음으로 쓴 일기
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="p-1 text-island-text-muted hover:text-island-text rounded-full hover:bg-island-bg shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 bg-island-bg rounded-2xl border border-island-border/60">
              <p className="text-xs text-island-text font-medium leading-relaxed whitespace-pre-line break-keep">
                {selectedEntry.content}
              </p>
            </div>

            {selectedEntry.extractedElements && selectedEntry.extractedElements.length > 0 && (
              <div className="mt-3 pt-2 border-t border-island-border/50 shrink-0">
                <span className="text-[10px] font-bold text-island-text-muted block mb-1">
                  세계에 남긴 조각들:
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedEntry.extractedElements.map((el) => (
                    <span
                      key={el}
                      className="text-[10px] px-2 py-0.5 bg-island-bg text-island-text-secondary rounded-md border border-island-border/60"
                    >
                      {el}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3.5 pt-2 border-t border-island-border/60 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const entryToEdit = selectedEntry;
                  setSelectedEntry(null);
                  onSelectEntryForEdit(entryToEdit);
                }}
                className="px-3 py-1.5 bg-island-bg hover:bg-island-border/40 text-island-text text-xs font-bold rounded-xl flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>수정하기</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-1.5 bg-island-moss text-white text-xs font-bold rounded-xl hover:bg-island-tree"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
