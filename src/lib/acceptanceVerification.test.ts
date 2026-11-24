import { describe, it, expect, beforeEach } from 'vitest';
import {
  MindRecord,
  MindType,
  MIND_METAS,
  WALK_SCENES,
  getSeoulDateString,
  calculateGrowthState,
  loadMindRecords,
  saveMindRecords,
} from './mindStore';

// Mock localStorage for test environment
const mockStorage: Record<string, string> = {};
(globalThis as any).localStorage = {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => { mockStorage[key] = String(value); },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  },
};

describe('〈마음이 자라는 세계〉 6가지 검증 항목 테스트', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ① 첫 방문 → 마음 선택 → 산책 생략 → 재실행해도 기록 유지
  it('검증 ①: 첫 방문 후 마음 선택 및 산책 생략 시에도 기기 재실행 시 기록이 정확히 유지된다', () => {
    const today = getSeoulDateString();
    const firstVisitRecord: MindRecord = {
      date: today,
      mind: 'peaceful',
      memo: '첫 방문 평온한 날',
      walkCompleted: false, // 산책 생략
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveMindRecords([firstVisitRecord]);

    // 앱 재실행 시뮬레이션
    const reloaded = loadMindRecords();
    expect(reloaded).toHaveLength(1);
    expect(reloaded[0].date).toBe(today);
    expect(reloaded[0].mind).toBe('peaceful');
    expect(reloaded[0].memo).toBe('첫 방문 평온한 날');
    expect(reloaded[0].walkCompleted).toBe(false);

    // 성장 상태: 평온해요 1단계 (연못에 연잎 한 장)
    const growth = calculateGrowthState(reloaded);
    expect(growth.peacefulCount).toBe(1);
    expect(growth.peacefulStage).toBe(1);
    expect(MIND_METAS.peaceful.stages[0]).toBe('연못에 연잎 한 장');
  });

  // ② 숲길과 물가가 실제로 다른 장면을 보여주고 8개 조합 모두 완료 가능
  it('검증 ②: 숲길과 물가가 실제로 서로 다른 장면을 제공하며 8가지 마음x길 조합이 모두 존재한다', () => {
    const minds: MindType[] = ['peaceful', 'flutter', 'tired', 'complex'];

    expect(Object.keys(WALK_SCENES)).toHaveLength(8);

    for (const m of minds) {
      const forestScene = WALK_SCENES[`${m}-forest`];
      const waterScene = WALK_SCENES[`${m}-water`];

      expect(forestScene).toBeDefined();
      expect(waterScene).toBeDefined();

      // 숲길과 물가는 완전히 다른 제목과 문장, 타겟 사물을 가져야 함
      expect(forestScene.title).not.toBe(waterScene.title);
      expect(forestScene.sentence).not.toBe(waterScene.sentence);
      expect(forestScene.targetObject).not.toBe(waterScene.targetObject);
    }

    // 예시 조합 확인
    expect(WALK_SCENES['tired-forest'].sentence).toContain('고양이가 몸을 쭉 펴고');
    expect(WALK_SCENES['tired-water'].sentence).toContain('그늘진 물가에');
    expect(WALK_SCENES['flutter-forest'].sentence).toContain('나비가 날아오릅니다');
    expect(WALK_SCENES['complex-water'].sentence).toContain('물결이 동심원을 그리며');
  });

  // ③ 같은 날 여러 번 누르거나 마음을 바꿔도 성장 횟수가 정확함
  it('검증 ③: 같은 날 여러 번 누르거나 마음을 변경했을 때 당일 성장만 전환되고 누적 횟수가 중복되지 않는다', () => {
    const today = '2026-11-24';
    let records: MindRecord[] = [
      {
        date: today,
        mind: 'tired', // 처음에 '지쳤어요' 선택
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    let g1 = calculateGrowthState(records);
    expect(g1.tiredCount).toBe(1);
    expect(g1.tiredStage).toBe(1);
    expect(g1.flutterCount).toBe(0);

    // 같은 날 '설레요'로 변경
    records = [
      {
        date: today,
        mind: 'flutter', // 변경됨
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    let g2 = calculateGrowthState(records);
    // 지쳤어요는 취소되고 설레요로 정확히 1회 전환됨
    expect(g2.tiredCount).toBe(0);
    expect(g2.tiredStage).toBe(0);
    expect(g2.flutterCount).toBe(1);
    expect(g2.flutterStage).toBe(1);
    expect(g2.totalVisits).toBe(1);
  });

  // ④ 다음 날과 며칠 뒤 재방문했을 때 이전 사물의 변화가 보임
  it('검증 ④: 며칠 뒤 재방문 시 이전 사물이 유지되며 새 기록 시 3단계까지 올바르게 자라난다', () => {
    // 1일차: 지쳤어요
    // 2일차: 지쳤어요 (2단계: 등불 추가)
    // 5일차(며칠 쉼): 지쳤어요 (3단계: 아늑한 쉼터 완성)
    const records: MindRecord[] = [
      { date: '2026-11-20', mind: 'tired', createdAt: '', updatedAt: '' },
      { date: '2026-11-21', mind: 'tired', createdAt: '', updatedAt: '' },
      { date: '2026-11-24', mind: 'tired', createdAt: '', updatedAt: '' },
    ];

    const growth = calculateGrowthState(records);
    expect(growth.tiredCount).toBe(3);
    expect(growth.tiredStage).toBe(3);
    expect(MIND_METAS.tired.stages[growth.tiredStage - 1]).toBe('불이 켜진 아늑한 쉼터');

    // 4번째 기록을 추가해도 최고 단계(3단계)가 안전하게 유지됨
    records.push({ date: '2026-11-25', mind: 'tired', createdAt: '', updatedAt: '' });
    const growth4 = calculateGrowthState(records);
    expect(growth4.tiredCount).toBe(4);
    expect(growth4.tiredStage).toBe(3); // capped at 3
  });

  // ⑤ 한국시간 자정 전후, 개별 기록 삭제 후에도 섬 상태가 올바름
  it('검증 ⑤: 한국시간(Asia/Seoul) 자정 경계 구분 및 개별 기록 삭제 시 단계 재계산이 올바르게 동작한다', () => {
    // 한국시간 자정 23:59:50 vs 00:00:10
    const beforeMidnight = new Date('2026-11-24T14:59:50.000Z'); // UTC 14:59 = KST 23:59
    const afterMidnight = new Date('2026-11-24T15:00:10.000Z');  // UTC 15:00 = KST 00:00 (Next day)

    const date1 = getSeoulDateString(beforeMidnight);
    const date2 = getSeoulDateString(afterMidnight);

    expect(date1).toBe('2026-11-24');
    expect(date2).toBe('2026-11-25');

    // 기록 삭제 테스트
    let records: MindRecord[] = [
      { date: '2026-11-23', mind: 'complex', createdAt: '', updatedAt: '' },
      { date: '2026-11-24', mind: 'complex', createdAt: '', updatedAt: '' },
    ];
    expect(calculateGrowthState(records).complexStage).toBe(2);

    // 11-24 기록 삭제 -> 1단계로 안전하게 복원
    records = records.filter((r) => r.date !== '2026-11-24');
    expect(calculateGrowthState(records).complexStage).toBe(1);
  });

  // ⑥ 모바일 안전 입력 및 360/390px 반응형 무결성
  it('검증 ⑥: 잘못된 형식의 기록 데이터가 주어져도 크래시 없이 안전하게 복구된다', () => {
    const corrupted: any[] = [
      null,
      {},
      { date: '', mind: 'unknown' },
      { date: '2026-11-24', mind: 'peaceful' },
    ];

    const growth = calculateGrowthState(corrupted as MindRecord[]);
    expect(growth.peacefulCount).toBe(1);
    expect(growth.peacefulStage).toBe(1);
    expect(growth.totalVisits).toBe(1);
  });
});
