import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Globe,
  PenTool,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import {
  DiaryEntry,
  MindType,
  getSeoulDateString,
  loadDiaryEntries,
  saveDiaryEntries,
  calculateCumulativeWorld,
  extractWorldElements,
} from './lib/mindStore';
import { isTossApp } from './lib/env';
import { getCurrentSession, logoutUser, type AuthSession } from './lib/authStore';
import { AuthGate } from './components/AuthGate';
import { DiaryEditor } from './components/DiaryEditor';
import { CumulativeWorldView } from './components/CumulativeWorldView';
import { DiaryHistoryList } from './components/DiaryHistoryList';

type TabType = 'write' | 'world' | 'history';

export const App: React.FC = () => {
  const inToss = useMemo(() => isTossApp(), []);
  const [session, setSession] = useState<AuthSession | null>(() =>
    inToss ? null : getCurrentSession()
  );

  // Current Seoul date string
  const [todayStr, setTodayStr] = useState<string>(() => getSeoulDateString());

  // Periodically synchronize date on focus
  useEffect(() => {
    const checkDate = () => {
      const nowSeoul = getSeoulDateString();
      if (nowSeoul !== todayStr) {
        setTodayStr(nowSeoul);
      }
    };
    const timer = setInterval(checkDate, 10000);
    const onFocus = () => checkDate();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [todayStr]);

  // All diary entries (per-user isolated on Web)
  const [diaries, setDiaries] = useState<DiaryEntry[]>(() =>
    loadDiaryEntries(session?.id)
  );

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<TabType>('write');

  // Filter tag for diary history list
  const [historyFilterTag, setHistoryFilterTag] = useState<string | null>(null);

  // Success notification toast after diary saved
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Today's diary entry
  const todayEntry = useMemo(() => {
    return diaries.find((d) => d.date === todayStr) || null;
  }, [diaries, todayStr]);

  // Cumulative world state derived from all diaries
  const worldState = useMemo(() => {
    return calculateCumulativeWorld(diaries);
  }, [diaries]);

  // Handle saving today's (or edited) diary
  const handleSaveDiary = useCallback(
    (content: string, mind: MindType) => {
      const nowIso = new Date().toISOString();
      const extracted = extractWorldElements(content);

      setDiaries((prev) => {
        const existingIdx = prev.findIndex((d) => d.date === todayStr);
        let updated: DiaryEntry[];

        if (existingIdx >= 0) {
          const old = prev[existingIdx];
          updated = [...prev];
          updated[existingIdx] = {
            ...old,
            content,
            mind,
            extractedElements: extracted,
            updatedAt: nowIso,
          };
        } else {
          const newEntry: DiaryEntry = {
            id: `diary-${todayStr}-${Date.now()}`,
            date: todayStr,
            content,
            mind,
            extractedElements: extracted,
            createdAt: nowIso,
            updatedAt: nowIso,
          };
          updated = [newEntry, ...prev];
        }

        saveDiaryEntries(updated, session?.id);
        return updated;
      });

      setSaveSuccessMsg('오늘의 기억이 세계에 더해졌습니다!');
      setTimeout(() => setSaveSuccessMsg(null), 4500);
    },
    [todayStr, session?.id]
  );

  // Handle deleting an entry
  const handleDeleteEntry = useCallback(
    (dateStr: string) => {
      setDiaries((prev) => {
        const updated = prev.filter((d) => d.date !== dateStr);
        saveDiaryEntries(updated, session?.id);
        return updated;
      });
    },
    [session?.id]
  );

  // Web 회원가입/로그인 게이트 (토스 앱 내부에서는 즉시 진입)
  if (!inToss && !session) {
    return (
      <AuthGate
        onAuthSuccess={(newSession) => {
          setSession(newSession);
          setDiaries(loadDiaryEntries(newSession.id));
        }}
      />
    );
  }

  // Jump to history tab filtered by memory tag
  const handleFilterByElement = useCallback((tag: string) => {
    setHistoryFilterTag(tag);
    setActiveTab('history');
  }, []);

  // Edit an existing entry from history
  const handleSelectEntryForEdit = useCallback((_entry: DiaryEntry) => {
    setActiveTab('write');
  }, []);

  return (
    <div className="min-h-screen bg-island-bg text-island-text font-sans flex flex-col justify-between selection:bg-island-moss/20">
      {/* Top Header (Zero clipping on 360px) */}
      <header className="safe-top px-4 pt-3 pb-2.5 flex items-center justify-between border-b border-island-border/70 bg-white/80 backdrop-blur-md sticky top-0 z-30 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-2xl bg-island-moss/10 flex items-center justify-center text-island-moss border border-island-moss/20 shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-extrabold text-island-text tracking-tight truncate leading-tight">
              마음이 자라는 세계
            </h1>
            <p className="text-[10px] text-island-text-muted truncate leading-tight mt-0.5">
              {todayStr} · {worldState.stageInfo.stage}단계 ({worldState.stageInfo.title})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!inToss && session && (
            <button
              type="button"
              onClick={() => {
                logoutUser();
                setSession(null);
                setDiaries([]);
              }}
              title="로그아웃"
              className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-stone-600 hover:text-stone-900 border border-stone-200 flex items-center gap-1 cursor-pointer"
            >
              <span>{session.nickname}</span>
              <LogOut className="w-3 h-3" />
            </button>
          )}
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-island-sand-subtle text-island-moss border border-island-border/80 whitespace-nowrap">
            누적 일기 {worldState.totalCount}편
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-3.5 space-y-3.5">
        {/* Toast Alert when diary saved */}
        {saveSuccessMsg && (
          <div className="bg-emerald-700 text-white px-3.5 py-2.5 rounded-2xl flex items-center justify-between shadow-sm animate-fade-in text-xs font-semibold gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
              <span className="truncate">{saveSuccessMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('world')}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-[11px] font-bold flex items-center gap-0.5 shrink-0 whitespace-nowrap"
            >
              <span>세계 보기</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Tab 1: Today Diary Writing */}
        {activeTab === 'write' && (
          <div className="space-y-3.5 animate-fade-in">
            <DiaryEditor
              todayDateStr={todayStr}
              existingEntry={todayEntry}
              onSaveDiary={handleSaveDiary}
            />

            {/* Quick World Peek Card */}
            <div
              onClick={() => setActiveTab('world')}
              className="bg-white/90 hover:bg-white border border-island-border/70 rounded-2xl p-3 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] shadow-xs gap-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-island-border/80 shrink-0 bg-island-bg">
                  <img
                    src={worldState.stageInfo.imagePath}
                    alt={worldState.stageInfo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-island-moss truncate">
                    현재 세계 · {worldState.stageInfo.stage}단계 {worldState.stageInfo.title}
                  </p>
                  <p className="text-xs font-extrabold text-island-text truncate">
                    기록이 모여 만들어진 풍경 확인하기
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-island-text-muted shrink-0" />
            </div>
          </div>
        )}

        {/* Tab 2: Cumulative World Visualization */}
        {activeTab === 'world' && (
          <div className="space-y-3.5 animate-fade-in">
            <CumulativeWorldView
              worldState={worldState}
              onFilterByElement={handleFilterByElement}
            />

            {/* Link back to journaling */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-island-moss text-white rounded-full text-xs font-bold shadow-xs hover:bg-island-moss/90 active:scale-95 transition-all whitespace-nowrap"
              >
                <PenTool className="w-3.5 h-3.5 shrink-0" />
                <span>오늘의 일기 남기기</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: History Timeline */}
        {activeTab === 'history' && (
          <div className="space-y-3.5 animate-fade-in">
            <DiaryHistoryList
              entries={diaries}
              filterTag={historyFilterTag}
              onClearFilter={() => setHistoryFilterTag(null)}
              onSelectEntryForEdit={handleSelectEntryForEdit}
              onDeleteEntry={handleDeleteEntry}
            />
          </div>
        )}
      </main>

      {/* Bottom Sticky Navigation Bar */}
      <nav className="safe-bottom sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-island-border/80 px-4 sm:px-6 py-2 flex items-center justify-around z-30 shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('write')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'write'
              ? 'text-island-moss font-bold scale-105'
              : 'text-island-text-muted font-medium hover:text-island-text'
          }`}
        >
          <PenTool className="w-5 h-5" />
          <span className="text-[11px] whitespace-nowrap">오늘 일기</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('world')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'world'
              ? 'text-island-moss font-bold scale-105'
              : 'text-island-text-muted font-medium hover:text-island-text'
          }`}
        >
          <div className="relative">
            <Globe className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 text-[9px] font-extrabold px-1.5 py-0.2 bg-island-moss text-white rounded-full">
              {worldState.stageInfo.stage}
            </span>
          </div>
          <span className="text-[11px] whitespace-nowrap">자라난 세계</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'history'
              ? 'text-island-moss font-bold scale-105'
              : 'text-island-text-muted font-medium hover:text-island-text'
          }`}
        >
          <div className="relative">
            <BookOpen className="w-5 h-5" />
            {diaries.length > 0 && (
              <span className="absolute -top-1 -right-2 text-[9px] font-bold px-1.5 py-0.2 bg-island-border text-island-text rounded-full">
                {diaries.length}
              </span>
            )}
          </div>
          <span className="text-[11px] whitespace-nowrap">일기 보관함</span>
        </button>
      </nav>
    </div>
  );
};
export default App;
