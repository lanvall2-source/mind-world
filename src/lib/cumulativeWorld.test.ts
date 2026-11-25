import { describe, it, expect } from 'vitest';
import {
  extractWorldElements,
  calculateCumulativeWorld,
  DiaryEntry,
} from './mindStore';

describe('Cumulative World & Memory Extraction', () => {
  it('extracts world memory elements from Korean diary text', () => {
    const text1 = '오늘 아침 카페에서 따뜻한 커피 한 잔을 마시며 책을 읽었다. 반려견 뭉치와 공원 산책도 다녀왔다.';
    const elements1 = extractWorldElements(text1);
    expect(elements1).toContain('따뜻한 차');
    expect(elements1).toContain('책');
    expect(elements1).toContain('반려견');
    expect(elements1).toContain('산책길');

    const text2 = '창밖으로 빗소리가 들렸다. 우산을 챙겨 버스를 타고 퇴근했다.';
    const elements2 = extractWorldElements(text2);
    expect(elements2).toContain('맑은 빗방울');
    expect(elements2).toContain('오솔길 여정');
  });

  it('calculates Stage 1 for 0 to 2 accumulated diaries', () => {
    const emptyEntries: DiaryEntry[] = [];
    const state0 = calculateCumulativeWorld(emptyEntries);
    expect(state0.stageInfo.stage).toBe(1);
    expect(state0.stageInfo.title).toBe('기억의 시작');
    expect(state0.totalCount).toBe(0);
    expect(state0.diariesToNextStage).toBe(3);
    expect(state0.progressPercent).toBe(0);

    const twoEntries: DiaryEntry[] = [
      {
        id: '1',
        date: '2026-11-20',
        content: '첫날 일기',
        mind: 'peaceful',
        extractedElements: ['책'],
        createdAt: '',
        updatedAt: '',
      },
      {
        id: '2',
        date: '2026-11-21',
        content: '둘째날 일기',
        mind: 'flutter',
        extractedElements: ['산책길'],
        createdAt: '',
        updatedAt: '',
      },
    ];
    const state2 = calculateCumulativeWorld(twoEntries);
    expect(state2.stageInfo.stage).toBe(1);
    expect(state2.totalCount).toBe(2);
    expect(state2.diariesToNextStage).toBe(1);
    expect(state2.progressPercent).toBe(67);
  });

  it('calculates Stage 2 for 3 to 6 accumulated diaries', () => {
    const entries: DiaryEntry[] = Array.from({ length: 4 }).map((_, i) => ({
      id: `${i}`,
      date: `2026-11-1${i}`,
      content: `일기 ${i}`,
      mind: 'peaceful',
      extractedElements: ['꽃밭'],
      createdAt: '',
      updatedAt: '',
    }));

    const state = calculateCumulativeWorld(entries);
    expect(state.stageInfo.stage).toBe(2);
    expect(state.stageInfo.title).toBe('길과 시냇물');
    expect(state.totalCount).toBe(4);
    expect(state.diariesToNextStage).toBe(3); // Goal is 7, 7 - 4 = 3
  });

  it('calculates Stage 3 for 7 to 14 accumulated diaries', () => {
    const entries: DiaryEntry[] = Array.from({ length: 8 }).map((_, i) => ({
      id: `${i}`,
      date: `2026-11-${String(i + 1).padStart(2, '0')}`,
      content: `일기 ${i}`,
      mind: 'peaceful',
      extractedElements: ['아늑한 쉼터'],
      createdAt: '',
      updatedAt: '',
    }));

    const state = calculateCumulativeWorld(entries);
    expect(state.stageInfo.stage).toBe(3);
    expect(state.stageInfo.title).toBe('온기의 마을');
    expect(state.totalCount).toBe(8);
    expect(state.diariesToNextStage).toBe(7); // Goal is 15, 15 - 8 = 7
  });

  it('calculates Stage 4 for 15+ accumulated diaries', () => {
    const entries: DiaryEntry[] = Array.from({ length: 18 }).map((_, i) => ({
      id: `${i}`,
      date: `2026-10-${String(i + 1).padStart(2, '0')}`,
      content: `일기 ${i}`,
      mind: 'complex',
      extractedElements: ['밤하늘 별빛', '숲 바람'],
      createdAt: '',
      updatedAt: '',
    }));

    const state = calculateCumulativeWorld(entries);
    expect(state.stageInfo.stage).toBe(4);
    expect(state.stageInfo.title).toBe('별빛의 영원한 세계');
    expect(state.totalCount).toBe(18);
    expect(state.diariesToNextStage).toBe(0);
    expect(state.progressPercent).toBe(100);
    expect(state.plantedElements.some((e) => e.tag === '밤하늘 별빛')).toBe(true);
  });

  it('counts distinct dates even if multiple diaries exist on same date', () => {
    const entries: DiaryEntry[] = [
      {
        id: '1',
        date: '2026-11-24',
        content: '아침 일기',
        mind: 'peaceful',
        extractedElements: ['따뜻한 차'],
        createdAt: '',
        updatedAt: '',
      },
      {
        id: '2',
        date: '2026-11-24',
        content: '저녁 일기',
        mind: 'tired',
        extractedElements: ['아늑한 쉼터'],
        createdAt: '',
        updatedAt: '',
      },
    ];
    const state = calculateCumulativeWorld(entries);
    expect(state.totalCount).toBe(1);
    expect(state.plantedElements.length).toBe(2);
  });
});
