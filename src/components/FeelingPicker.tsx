import React from 'react';
import { MindType, MIND_METAS } from '../lib/mindStore';

interface FeelingPickerProps {
  selectedMind: MindType | null;
  onSelectMind: (mind: MindType) => void;
}

export const FeelingPicker: React.FC<FeelingPickerProps> = ({
  selectedMind,
  onSelectMind,
}) => {
  const mindKeys: MindType[] = ['peaceful', 'flutter', 'tired', 'complex'];

  return (
    <section className="px-4 py-4 animate-fade-in">
      <div className="text-center mb-3">
        <h2 className="text-base font-extrabold text-island-text tracking-tight">
          오늘 마음은 어때요?
        </h2>
        <p className="text-xs text-island-text-muted mt-0.5">
          가장 마음에 와닿는 단어 하나를 골라주세요
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 max-w-sm mx-auto">
        {mindKeys.map((key) => {
          const meta = MIND_METAS[key];
          const isSelected = selectedMind === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectMind(key)}
              className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all duration-150 active:scale-[0.98] border shadow-sm ${
                isSelected
                  ? 'bg-island-moss text-white border-island-moss shadow-md'
                  : 'bg-white text-island-text border-island-border hover:border-island-moss/60 hover:bg-island-bg-card'
              }`}
            >
              <span className="text-base">{meta.emoji}</span>
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
