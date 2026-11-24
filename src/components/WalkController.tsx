import React from 'react';
import { TreePine, Waves, ArrowLeft, Home, Sparkles } from 'lucide-react';
import { WalkPath, WalkScene } from '../lib/mindStore';

interface WalkControllerProps {
  walkStep: 'choosing_path' | 'seeking_object' | 'viewing_scene';
  activePath: WalkPath | null;
  activeScene: WalkScene | null;
  onSelectPath: (path: WalkPath) => void;
  onExitWalk: () => void;
}

export const WalkController: React.FC<WalkControllerProps> = ({
  walkStep,
  activeScene,
  onSelectPath,
  onExitWalk,
}) => {
  return (
    <section className="px-4 py-3 animate-fade-in">
      <div className="p-4 bg-white border border-island-border/80 rounded-3xl shadow-sm max-w-sm mx-auto">
        {/* Step 1: Choose Path */}
        {walkStep === 'choosing_path' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-island-text">어느 길을 걸어볼까요?</p>
                <p className="text-[11px] text-island-text-muted">마음에 닿는 풍경을 따라 걸어보세요</p>
              </div>
              <button
                type="button"
                onClick={onExitWalk}
                className="text-xs text-island-text-muted hover:text-island-text flex items-center gap-1"
              >
                <span>산책 종료</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSelectPath('forest')}
                className="p-3 rounded-2xl bg-island-moss-subtle hover:bg-island-moss hover:text-white text-island-moss border border-island-moss/20 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all active:scale-[0.98] group"
              >
                <TreePine className="w-5 h-5 text-island-moss group-hover:text-white transition-colors" />
                <span>숲길로</span>
                <span className="text-[10px] text-island-text-muted group-hover:text-white/80 font-normal">
                  나뭇잎 사이로
                </span>
              </button>

              <button
                type="button"
                onClick={() => onSelectPath('water')}
                className="p-3 rounded-2xl bg-island-pond-subtle hover:bg-island-pond hover:text-white text-island-pond border border-island-pond/20 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all active:scale-[0.98] group"
              >
                <Waves className="w-5 h-5 text-island-pond group-hover:text-white transition-colors" />
                <span>물가로</span>
                <span className="text-[10px] text-island-text-muted group-hover:text-white/80 font-normal">
                  연못 가장자리로
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Seeking Object */}
        {walkStep === 'seeking_object' && activeScene && (
          <div className="text-center py-1">
            <div className="flex items-center justify-center gap-1.5 text-island-moss font-bold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>섬 안의 반짝이는 사물을 찾아보세요</span>
            </div>
            <p className="text-sm font-extrabold text-island-text my-2 leading-relaxed">
              {activeScene.hint}
            </p>
            <button
              type="button"
              onClick={onExitWalk}
              className="mt-2 text-xs font-semibold text-island-text-muted hover:text-island-text flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>다른 길 걷기</span>
            </button>
          </div>
        )}

        {/* Step 3: Viewing Scene Completed */}
        {walkStep === 'viewing_scene' && activeScene && (
          <div className="text-center py-1 animate-fade-in">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-island-moss-subtle text-island-moss">
              {activeScene.title}
            </span>
            <p className="text-sm font-bold text-island-text my-3 leading-relaxed break-keep">
              “{activeScene.sentence}”
            </p>
            <button
              type="button"
              onClick={onExitWalk}
              className="w-full py-2.5 bg-island-moss text-white rounded-xl text-xs font-bold hover:bg-island-tree transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>내 섬으로 돌아가기</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
