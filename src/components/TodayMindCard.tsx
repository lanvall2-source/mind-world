import React, { useState, useEffect } from 'react';
import {
  Compass,
  Check,
  Palette,
  FileText,
  Edit2,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import {
  MindType,
  MIND_METAS,
  DiaryIllustrationData,
} from '../lib/mindStore';
import { DiaryIllustrationSvg } from './DiaryIllustrationSvg';

interface TodayMindCardProps {
  todayDateStr: string;
  mind: MindType;
  currentText: string;
  illustration?: DiaryIllustrationData;
  isFinishedToday: boolean;
  onSaveWithIllustration: (text: string) => void;
  onSaveTextOnly: (text: string) => void;
  onSwitchScene: (sceneIndex: number) => void;
  onStartWalk: () => void;
  onFinishToday: () => void;
  onChangeMind: () => void;
}

export const TodayMindCard: React.FC<TodayMindCardProps> = ({
  todayDateStr,
  mind,
  currentText,
  illustration,
  isFinishedToday,
  onSaveWithIllustration,
  onSaveTextOnly,
  onSwitchScene,
  onStartWalk,
  onFinishToday,
  onChangeMind,
}) => {
  const meta = MIND_METAS[mind];
  const [textInput, setTextInput] = useState(currentText);
  const [isEditing, setIsEditing] = useState(!currentText);
  const [showScenePicker, setShowScenePicker] = useState(false);

  useEffect(() => {
    setTextInput(currentText);
    if (!currentText) {
      setIsEditing(true);
    }
  }, [currentText]);

  const hasIllustration = Boolean(illustration);
  const candidates = illustration?.candidateScenes || [];
  const hasMultipleCandidates = candidates.length > 1;

  const handleSaveIllustration = () => {
    onSaveWithIllustration(textInput.trim());
    setIsEditing(false);
  };

  const handleSaveOnlyText = () => {
    onSaveTextOnly(textInput.trim());
    setIsEditing(false);
  };

  return (
    <section className="px-4 py-3 animate-fade-in">
      <div className="p-4 bg-white border border-island-border/80 rounded-3xl shadow-sm max-w-sm mx-auto">
        {/* Top Header: Emotion badge & Date */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-island-moss-subtle border border-island-moss/20 rounded-full">
            <span className="text-sm">{meta.emoji}</span>
            <span className="text-xs font-bold text-island-moss">{meta.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-island-text-muted">{todayDateStr}</span>
            <button
              type="button"
              onClick={onChangeMind}
              className="text-[11px] font-medium text-island-text-muted hover:text-island-text transition-colors"
            >
              마음 바꾸기
            </button>
          </div>
        </div>

        {/* Emotion supportive message */}
        <p className="text-xs font-bold text-island-text leading-snug my-1.5 break-keep">
          “{meta.comfortMessage}”
        </p>

        {/* ======================================================== */}
        {/* VIEW 1: EDITING MODE (일기 작성) */}
        {/* ======================================================== */}
        {isEditing ? (
          <div className="mt-3 pt-3 border-t border-island-border/60">
            <label className="text-[11px] font-bold text-island-text-secondary block mb-1.5">
              오늘의 일기 남기기
            </label>
            <textarea
              rows={3}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="오늘 어디서 어떤 일과 생각을 마주했나요? (장소, 행동을 함께 적으면 삽화가 그려집니다)"
              maxLength={250}
              className="w-full p-3 text-xs bg-island-bg border border-island-border rounded-2xl font-medium text-island-text focus:outline-none focus:border-island-moss resize-none leading-relaxed"
            />

            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={handleSaveIllustration}
                className="flex-1 py-2.5 px-3 bg-island-moss text-white rounded-xl text-xs font-bold hover:bg-island-tree transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>오늘을 그림으로 남기기</span>
              </button>

              <button
                type="button"
                onClick={handleSaveOnlyText}
                className="py-2.5 px-3 bg-island-bg text-island-text-secondary border border-island-border hover:bg-island-border/50 rounded-xl text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>글만 저장</span>
              </button>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* VIEW 2: SAVED DIARY CARD (삽화 + 원문 + 장면 선택) */
          /* ======================================================== */
          <div className="mt-3 pt-3 border-t border-island-border/60 space-y-3">
            {/* Illustration if generated */}
            {hasIllustration && illustration && (
              <div>
                <DiaryIllustrationSvg illustration={illustration} />

                {/* Excerpt Caption under Illustration */}
                {illustration.caption && (
                  <p className="text-[11px] font-medium text-island-text-muted mt-1.5 text-center italic break-keep px-2">
                    “{illustration.caption}”
                  </p>
                )}

                {/* Scene Switcher if multiple candidate scenes were detected */}
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
                        {candidates.map((c: any, idx: number) => {
                          const isSelected = illustration.selectedSceneIndex === idx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                onSwitchScene(idx);
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

            {/* Original diary text */}
            <div className="p-3 bg-island-bg rounded-2xl relative group">
              <p className="text-xs text-island-text font-medium leading-relaxed break-keep">
                {currentText || '기록된 글이 없습니다.'}
              </p>
              <div className="flex items-center justify-end gap-2 mt-2 pt-1 border-t border-island-border/40">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-[10px] font-bold text-island-text-muted hover:text-island-text flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>글 수정하기</span>
                </button>
                {hasIllustration && (
                  <button
                    type="button"
                    onClick={() => onSaveWithIllustration(currentText)}
                    className="text-[10px] font-bold text-island-moss hover:text-island-tree flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>수정한 글로 다시 그리기</span>
                  </button>
                )}
              </div>
            </div>

            {/* Action Choices: 산책하기 vs 오늘은 여기까지 */}
            <div className="pt-2 border-t border-island-border/60">
              {isFinishedToday ? (
                <div className="p-2.5 bg-island-moss-subtle/70 rounded-xl text-center">
                  <p className="text-xs font-bold text-island-moss flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    오늘의 마음과 그림이 소중히 보존되었어요
                  </p>
                  <button
                    type="button"
                    onClick={onStartWalk}
                    className="mt-1 text-[11px] font-semibold text-island-text-secondary hover:text-island-moss underline underline-offset-2 transition-colors"
                  >
                    섬 산책하기
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
        )}
      </div>
    </section>
  );
};
