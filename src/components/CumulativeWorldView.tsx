import React, { useState } from 'react';
import { Sparkles, Globe, ChevronRight } from 'lucide-react';
import { CumulativeWorldState } from '../lib/mindStore';

interface CumulativeWorldViewProps {
  worldState: CumulativeWorldState;
  onFilterByElement?: (tag: string) => void;
}

export const CumulativeWorldView: React.FC<CumulativeWorldViewProps> = ({
  worldState,
  onFilterByElement,
}) => {
  const { totalCount, stageInfo, progressPercent, diariesToNextStage, plantedElements } = worldState;
  const [imgError, setImgError] = useState(false);

  return (
    <section className="bg-white border border-island-border/80 rounded-3xl p-4 sm:p-5 shadow-xs">
      {/* Title & Stage Header (Zero overlap) */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Globe className="w-4 h-4 text-island-moss shrink-0" />
          <h3 className="text-sm font-bold text-island-text truncate">일기들이 모여 만든 세계</h3>
        </div>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-island-moss text-white font-bold whitespace-nowrap shrink-0">
          {stageInfo.stage}단계 · {stageInfo.title}
        </span>
      </div>

      {/* Main Cumulative World Artwork */}
      <div className="relative aspect-[16/11] rounded-2xl overflow-hidden border border-island-border/70 shadow-inner bg-island-bg">
        {!imgError ? (
          <img
            src={stageInfo.imagePath}
            alt={stageInfo.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          /* High quality fallback */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-green-50 to-blue-50">
            <span className="text-4xl mb-2">🌿</span>
            <p className="text-xs font-bold text-island-text">{stageInfo.title}</p>
            <p className="text-[11px] text-island-text-muted mt-1">{stageInfo.subtitle}</p>
          </div>
        )}

        {/* Floating Counter Badge */}
        <div className="absolute bottom-2.5 right-2.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-[11px] font-bold flex items-center gap-1 shadow-md whitespace-nowrap">
          <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
          <span>기록 {totalCount}일째 누적</span>
        </div>
      </div>

      {/* World Story Caption */}
      <div className="mt-3.5">
        <h4 className="text-sm font-extrabold text-island-text break-keep leading-snug">
          {stageInfo.subtitle}
        </h4>
        <p className="text-xs text-island-text-secondary mt-1 leading-relaxed break-keep">
          “{stageInfo.description}”
        </p>
      </div>

      {/* Evolution Progress Bar */}
      {stageInfo.stage < 4 && (
        <div className="mt-4 p-3 bg-island-bg rounded-2xl border border-island-border/60">
          <div className="flex items-center justify-between text-[11px] font-bold text-island-text-secondary mb-1.5 gap-2">
            <span className="shrink-0">다음 세계 진화</span>
            <span className="text-island-moss truncate">
              {diariesToNextStage > 0 ? `일기 ${diariesToNextStage}편 남음` : '진화 준비 완료'}
            </span>
          </div>
          <div className="w-full h-2 bg-island-border/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-island-moss transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-island-text-muted mt-1.5 break-keep">
            하루 한 편의 일기가 더해질 때마다 세계는 조금씩 더 넓어집니다.
          </p>
        </div>
      )}

      {/* Planted Elements from All Diaries */}
      {plantedElements.length > 0 && (
        <div className="mt-4 pt-3.5 border-t border-island-border/60">
          <p className="text-[11px] font-bold text-island-text-secondary mb-2 flex items-center justify-between gap-2">
            <span className="truncate">모든 일기에서 모인 기억의 조각들</span>
            <span className="text-[10px] text-island-text-muted shrink-0 whitespace-nowrap">
              {plantedElements.length}가지 기억
            </span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {plantedElements.map((elem) => (
              <button
                key={elem.tag}
                type="button"
                onClick={() => onFilterByElement?.(elem.tag)}
                className="px-2.5 py-1 bg-island-bg hover:bg-island-moss-subtle border border-island-border/70 rounded-xl text-xs font-semibold text-island-text flex items-center gap-1 transition-all active:scale-[0.98] whitespace-nowrap shadow-2xs"
              >
                <span>{elem.emoji}</span>
                <span>{elem.tag}</span>
                <span className="text-[10px] text-island-text-muted font-normal">
                  ({elem.count})
                </span>
                <ChevronRight className="w-2.5 h-2.5 text-island-text-muted ml-0.5 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
