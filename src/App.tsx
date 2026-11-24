import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { MindIslandSvg } from './components/MindIslandSvg';
import { FeelingPicker } from './components/FeelingPicker';
import { TodayMindCard } from './components/TodayMindCard';
import { WalkController } from './components/WalkController';
import { PlaceInspectModal } from './components/PlaceInspectModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import {
  MindRecord,
  MindType,
  WalkPath,
  WalkScene,
  WALK_SCENES,
  getSeoulDateString,
  calculateGrowthState,
  loadMindRecords,
  saveMindRecords,
} from './lib/mindStore';

export const App: React.FC = () => {
  // Current Seoul date (rechecked periodically or on focus)
  const [todayStr, setTodayStr] = useState<string>(() => getSeoulDateString());

  useEffect(() => {
    const checkDate = () => {
      const nowSeoul = getSeoulDateString();
      if (nowSeoul !== todayStr) {
        setTodayStr(nowSeoul);
      }
    };
    const timer = setInterval(checkDate, 5000);
    const onFocus = () => checkDate();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [todayStr]);

  // All mind records
  const [records, setRecords] = useState<MindRecord[]>(() => loadMindRecords());

  // Today's record
  const todayRecord = useMemo(() => {
    return records.find((r) => r.date === todayStr) || null;
  }, [records, todayStr]);

  // Growth state calculated from distinct dates
  const growth = useMemo(() => {
    return calculateGrowthState(records);
  }, [records]);

  // Walk mode states
  const [walkMode, setWalkMode] = useState<boolean>(false);
  const [walkStep, setWalkStep] = useState<'choosing_path' | 'seeking_object' | 'viewing_scene'>('choosing_path');
  const [activePath, setActivePath] = useState<WalkPath | null>(null);
  const [activeScene, setActiveScene] = useState<WalkScene | null>(null);

  // Finishing today state
  const [isFinishedToday, setIsFinishedToday] = useState<boolean>(false);

  // Inspection & Modals
  const [inspectingMind, setInspectingMind] = useState<MindType | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Handlers
  const handleSelectMind = useCallback((newMind: MindType) => {
    const nowIso = new Date().toISOString();
    setRecords((prev) => {
      const existingIdx = prev.findIndex((r) => r.date === todayStr);
      let updated: MindRecord[];
      if (existingIdx >= 0) {
        // Update today's existing record
        updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          mind: newMind,
          updatedAt: nowIso,
        };
      } else {
        // Add new record for today
        const newRecord: MindRecord = {
          date: todayStr,
          mind: newMind,
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        updated = [newRecord, ...prev];
      }
      saveMindRecords(updated);
      return updated;
    });
    setIsFinishedToday(false);
  }, [todayStr]);

  const handleUpdateMemo = useCallback((memoText: string) => {
    if (!todayRecord) return;
    const nowIso = new Date().toISOString();
    setRecords((prev) => {
      const updated = prev.map((r) =>
        r.date === todayStr ? { ...r, memo: memoText, updatedAt: nowIso } : r
      );
      saveMindRecords(updated);
      return updated;
    });
  }, [todayRecord, todayStr]);

  // Walk Handlers
  const handleStartWalk = useCallback(() => {
    setWalkMode(true);
    setWalkStep('choosing_path');
    setActivePath(null);
    setActiveScene(null);
  }, []);

  const handleSelectPath = useCallback((path: WalkPath) => {
    const currentMind = todayRecord?.mind || 'peaceful';
    const sceneKey = `${currentMind}-${path}`;
    const scene = WALK_SCENES[sceneKey] || WALK_SCENES['peaceful-forest'];

    setActivePath(path);
    setActiveScene(scene);
    setWalkStep('seeking_object');
  }, [todayRecord]);

  const handleObjectClick = useCallback((objectKey: string) => {
    if (walkMode && walkStep === 'seeking_object' && activeScene?.targetObject === objectKey) {
      setWalkStep('viewing_scene');
      // Mark walk completed for today
      setRecords((prev) => {
        const updated = prev.map((r) =>
          r.date === todayStr ? { ...r, walkPath: activePath || undefined, walkCompleted: true } : r
        );
        saveMindRecords(updated);
        return updated;
      });
    }
  }, [walkMode, walkStep, activeScene, todayStr, activePath]);

  const handleExitWalk = useCallback(() => {
    setWalkMode(false);
    setWalkStep('choosing_path');
    setActivePath(null);
    setActiveScene(null);
  }, []);

  const handleDeleteRecord = useCallback((dateStr: string) => {
    setRecords((prev) => {
      const updated = prev.filter((r) => r.date !== dateStr);
      saveMindRecords(updated);
      return updated;
    });
  }, []);

  const handleResetAll = useCallback(() => {
    setRecords([]);
    saveMindRecords([]);
    setWalkMode(false);
    setIsFinishedToday(false);
  }, []);

  // Inspect place stage
  const inspectStage = useMemo(() => {
    if (!inspectingMind) return 0;
    if (inspectingMind === 'peaceful') return growth.peacefulStage;
    if (inspectingMind === 'flutter') return growth.flutterStage;
    if (inspectingMind === 'tired') return growth.tiredStage;
    return growth.complexStage;
  }, [inspectingMind, growth]);

  return (
    <div className="flex-1 flex flex-col justify-between pb-6">
      {/* 1. Header */}
      <Header
        todayDateStr={todayStr}
        totalVisits={growth.totalVisits}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* 2. Storybook SVG Island Visual (Center of screen) */}
      <main className="flex-1 flex flex-col justify-center px-4 py-2">
        <MindIslandSvg
          growth={growth}
          walkMode={walkMode}
          activeScene={activeScene}
          walkStep={walkStep}
          onObjectClick={handleObjectClick}
          onInspectPlace={(mind) => setInspectingMind(mind)}
        />
        <p className="text-[11px] text-center text-island-text-muted mt-2">
          {walkMode
            ? '산책 중입니다. 반짝이는 사물을 눌러보세요.'
            : '섬의 사물(연못, 꽃밭, 쉼터, 돌)을 누르면 기록을 볼 수 있어요.'}
        </p>
      </main>

      {/* 3. Bottom Interactive Control Panel */}
      <footer className="safe-bottom shrink-0">
        {walkMode ? (
          <WalkController
            walkStep={walkStep}
            activePath={activePath}
            activeScene={activeScene}
            onSelectPath={handleSelectPath}
            onExitWalk={handleExitWalk}
          />
        ) : todayRecord ? (
          <TodayMindCard
            mind={todayRecord.mind}
            currentMemo={todayRecord.memo || ''}
            isFinishedToday={isFinishedToday}
            onUpdateMemo={handleUpdateMemo}
            onStartWalk={handleStartWalk}
            onFinishToday={() => setIsFinishedToday(true)}
            onChangeMind={() => {
              // Allows user to re-open feeling picker by temporary local state if needed
              setRecords((prev) => {
                const updated = prev.filter((r) => r.date !== todayStr);
                saveMindRecords(updated);
                return updated;
              });
            }}
          />
        ) : (
          <FeelingPicker
            selectedMind={null}
            onSelectMind={handleSelectMind}
          />
        )}
      </footer>

      {/* 4. Place Inspect Modal */}
      <PlaceInspectModal
        mind={inspectingMind}
        stage={inspectStage}
        records={records}
        onClose={() => setInspectingMind(null)}
        onDeleteRecord={handleDeleteRecord}
      />

      {/* 5. History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        records={records}
        onClose={() => setIsHistoryOpen(false)}
        onDeleteRecord={handleDeleteRecord}
        onResetAll={handleResetAll}
      />
    </div>
  );
};

export default App;
