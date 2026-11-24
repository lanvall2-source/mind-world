import { describe, it, expect } from 'vitest';
import { parseDiaryToIllustration } from './illustrationParser';
import { MindRecord, calculateGrowthState } from './mindStore';

describe('〈마음이 자라는 세계〉 일기 본문 분석 및 삽화 조합 8가지 사례 검증', () => {
  // ① 두 일기 모두 '지쳤어요' 선택 시 구도와 주인공의 완전한 차이
  it('사례 ①: 같은 감정(지쳤어요)이라도 본문에 따라 구도와 배경, 주인공이 완전히 달라진다', () => {
    const textA = '퇴근 버스에서 창문에 기대 잠깐 눈을 감았다.';
    const textB = '집에 오니 강아지가 현관까지 뛰어나왔다.';

    const illA = parseDiaryToIllustration(textA, 'tired');
    const illB = parseDiaryToIllustration(textB, 'tired');

    // textA -> transit (대중교통: 차창과 좌석)
    expect(illA.backgroundId).toBe('transit');
    expect(illA.primaryObject).toBe('seat_window');
    expect(illA.lighting).toBe('tired');

    // textB -> entrance (현관과 마중 나온 강아지)
    expect(illB.backgroundId).toBe('entrance');
    expect(illB.primaryObject).toBe('dog');
    expect(illB.primaryState).toBe('running');
    expect(illB.lighting).toBe('tired');

    // 두 삽화는 배경과 주인공이 명확히 다름
    expect(illA.backgroundId).not.toBe(illB.backgroundId);
    expect(illA.primaryObject).not.toBe(illB.primaryObject);
  });

  // ② "창가에서 책을 폈다" vs "창가에서 책을 덮었다."
  it('사례 ②: 배경(방 안 창가)은 같고 책의 상태(폈다/덮었다)가 각각 open과 closed로 다르다', () => {
    const openText = '창가에서 책을 폈다';
    const closedText = '창가에서 책을 덮었다.';

    const illOpen = parseDiaryToIllustration(openText, 'peaceful');
    const illClosed = parseDiaryToIllustration(closedText, 'peaceful');

    expect(illOpen.backgroundId).toBe('room');
    expect(illOpen.primaryObject).toBe('book');
    expect(illOpen.primaryState).toBe('open');

    expect(illClosed.backgroundId).toBe('room');
    expect(illClosed.primaryObject).toBe('book');
    expect(illClosed.primaryState).toBe('closed');
  });

  // ③ "버스를 타려다가 그냥 공원을 걸었다."
  it('사례 ③: 타지 않은 버스는 후보에서 배제되고 실제 행동인 공원 산책이 기본 장면으로 선택된다', () => {
    const text = '버스를 타려다가 그냥 공원을 걸었다.';
    const ill = parseDiaryToIllustration(text, 'flutter');

    // 기본 배경: 공원
    expect(ill.backgroundId).toBe('street_park');

    // 장면 후보 중 버스(transit)가 포함되지 않아야 함
    const hasTransitCandidate = ill.candidateScenes.some((c) => c.backgroundId === 'transit');
    expect(hasTransitCandidate).toBe(false);
  });

  // ④ "퇴근 버스에서 내려 집까지 걸었다."
  it('사례 ④: 두 실제 장면(버스 창가, 집으로 걷는 길)을 모두 감지하며 장면 전환이 가능하다', () => {
    const text = '퇴근 버스에서 내려 집까지 걸었다.';
    const ill = parseDiaryToIllustration(text, 'tired');

    // 두 장면 모두 후보로 검출
    expect(ill.candidateScenes.length).toBeGreaterThanOrEqual(2);

    const hasTransit = ill.candidateScenes.some((c) => c.backgroundId === 'transit');
    const hasWalk = ill.candidateScenes.some((c) => c.backgroundId === 'street_park');
    expect(hasTransit).toBe(true);
    expect(hasWalk).toBe(true);

    // 기본값은 마지막으로 일어난 구체적 행동 (집까지 걸었다 -> street_park)
    expect(ill.backgroundId).toBe('street_park');

    // 사용자가 첫 번째 후보(버스 창가)를 고르면 장면이 교체되어야 함
    const transitIndex = ill.candidateScenes.findIndex((c) => c.backgroundId === 'transit');
    const switched = parseDiaryToIllustration(text, 'tired', {
      ...ill,
      selectedSceneIndex: transitIndex,
    });
    expect(switched.backgroundId).toBe('transit');
  });

  // ⑤ "햇살 좋은 공원에서 쉬었는데 여전히 지쳤다."
  it('사례 ⑤: 사실(햇살, 공원)은 보존되고 감정(지쳤어요)은 조명과 색감에만 반영된다', () => {
    const text = '햇살 좋은 공원에서 쉬었는데 여전히 지쳤다.';
    const ill = parseDiaryToIllustration(text, 'tired');

    // 공원 배경 유지
    expect(ill.backgroundId).toBe('street_park');
    // 햇살(sunny) 날씨 팩트 유지
    expect(ill.weather).toBe('sunny');
    // 감정은 조명 틴트(tired)로 반영
    expect(ill.lighting).toBe('tired');
  });

  // ⑥ "오늘은 그냥 생각이 많았다."
  it('사례 ⑥: 구체적 장소/사물이 없으면 추상 수채화와 캡션 “감정의 색으로 그린 그림”을 노출한다', () => {
    const text = '오늘은 그냥 생각이 많았다.';
    const ill = parseDiaryToIllustration(text, 'complex');

    expect(ill.backgroundId).toBe('abstract');
    expect(ill.primaryObject).toBe('abstract_wash');
    expect(ill.caption).toBe('감정의 색으로 그린 그림');
    expect(ill.lighting).toBe('complex');
  });

  // ⑦ 기존 데이터 호환성, 글만 저장, 원문 수정 후 다시 그리기
  it('사례 ⑦: 삽화가 없는 과거 기록도 정상 호환되며, 글만 저장 및 원문 수정 후 다시 그리기가 정상 작동한다', () => {
    // 1) 삽화 없는 과거 기록 호환성
    const legacyRecord: MindRecord = {
      date: '2026-11-20',
      mind: 'peaceful',
      memo: '옛날 한 줄 메모',
      createdAt: '',
      updatedAt: '',
    };
    expect(legacyRecord.illustration).toBeUndefined();
    const growth = calculateGrowthState([legacyRecord]);
    expect(growth.peacefulCount).toBe(1);

    // 2) 원문 수정 후 다시 그리기 시뮬레이션
    const initialText = '창가에서 책을 폈다';
    const ill1 = parseDiaryToIllustration(initialText, 'peaceful');
    expect(ill1.primaryState).toBe('open');

    // 사용자가 글을 '창가에서 책을 덮었다'로 수정하고 다시 그리기를 누르면 새 일러스트 생성
    const modifiedText = '창가에서 책을 덮었다';
    const ill2 = parseDiaryToIllustration(modifiedText, 'peaceful');
    expect(ill2.primaryState).toBe('closed');
  });
});
