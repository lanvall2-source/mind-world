export type MindType = 'peaceful' | 'flutter' | 'tired' | 'complex';
export type WalkPath = 'forest' | 'water';

export type BackgroundId = 'room' | 'entrance' | 'transit' | 'street_park' | 'desk' | 'abstract';

export interface SceneCandidate {
  label: string;
  backgroundId: BackgroundId;
  primaryObject: string;
  primaryState: string;
  secondaryObject?: string;
  secondaryState?: string;
  excerptSentence?: string;
}

export interface DiaryIllustrationData {
  backgroundId: BackgroundId;
  primaryObject: string;
  primaryState: string;
  secondaryObject?: string;
  secondaryState?: string;
  lighting: MindType | 'relieved' | 'neutral';
  weather?: 'sunny' | 'rainy' | 'night' | 'day';
  candidateScenes: SceneCandidate[];
  selectedSceneIndex: number;
  caption: string;
  version: number;
  seed: number;
}

export interface MindRecord {
  date: string; // 'YYYY-MM-DD' (Asia/Seoul)
  mind: MindType;
  memo?: string; // 일기 본문 (기존 메모와 호환)
  diaryText?: string;
  illustration?: DiaryIllustrationData;
  walkPath?: WalkPath;
  walkCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MindMeta {
  type: MindType;
  label: string;
  emoji: string;
  color: string;
  placeName: string;
  comfortMessage: string;
  stages: [string, string, string]; // Stage 1, Stage 2, Stage 3 description
}

export const MIND_METAS: Record<MindType, MindMeta> = {
  peaceful: {
    type: 'peaceful',
    label: '평온해요',
    emoji: '🍃',
    color: '#568784',
    placeName: '연못과 연꽃',
    comfortMessage: '물결처럼 고요하고 편안한 하루를 보내셨군요.',
    stages: ['연못에 연잎 한 장', '작은 연꽃 봉오리', '연꽃이 핀 연못'],
  },
  flutter: {
    type: 'flutter',
    label: '설레요',
    emoji: '🌸',
    color: '#E89882',
    placeName: '길가 화단',
    comfortMessage: '기분 좋은 두근거림이 섬 전체를 따뜻하게 물들여요.',
    stages: ['길가의 꽃봉오리', '첫 꽃이 핀 화단', '나비가 찾는 꽃밭'],
  },
  tired: {
    type: 'tired',
    label: '지쳤어요',
    emoji: '🪵',
    color: '#8C7456',
    placeName: '나무 그늘 쉼터',
    comfortMessage: '오늘은 이 그늘에서 편안히 쉬어가요.',
    stages: ['나무 그늘에 벤치', '벤치 옆 작은 등', '불이 켜진 아늑한 쉼터'],
  },
  complex: {
    type: 'complex',
    label: '복잡해요',
    emoji: '🪨',
    color: '#768594',
    placeName: '물가 징검다리',
    comfortMessage: '어지러운 마음들을 여기에 잠시 내려놓아도 괜찮아요.',
    stages: ['물가의 납작한 돌', '나란히 놓인 돌 두 개', '연못을 건너는 징검다리'],
  },
};

export interface WalkScene {
  mind: MindType;
  path: WalkPath;
  title: string;
  sentence: string;
  targetObject: 'bench' | 'pond_leaf' | 'flower' | 'pond_sparkle' | 'tree' | 'lotus' | 'trail' | 'stone';
  hint: string;
}

export const WALK_SCENES: Record<string, WalkScene> = {
  'tired-forest': {
    mind: 'tired',
    path: 'forest',
    title: '벤치 아래 고양이',
    sentence: '벤치 아래에서 쉬던 고양이가 몸을 쭉 펴고 다시 편안히 눕습니다.',
    targetObject: 'bench',
    hint: '나무 그늘 아래 벤치를 살포시 눌러보세요.',
  },
  'tired-water': {
    mind: 'tired',
    path: 'water',
    title: '그늘에 닿은 나뭇잎',
    sentence: '물 위에 뜬 잎 하나가 천천히 나아가 그늘진 물가에 닿습니다.',
    targetObject: 'pond_leaf',
    hint: '물가 위에 조용히 떠 있는 잎을 눌러보세요.',
  },
  'flutter-forest': {
    mind: 'flutter',
    path: 'forest',
    title: '피어나는 꽃과 나비',
    sentence: '꽃봉오리를 누르면 꽃이 활짝 열리고 노란 나비가 날아오릅니다.',
    targetObject: 'flower',
    hint: '길가에 맺힌 꽃봉오리를 살포시 눌러보세요.',
  },
  'flutter-water': {
    mind: 'flutter',
    path: 'water',
    title: '반짝이는 물방울',
    sentence: '맑은 햇살이 물결에 부서지며 투명한 물방울이 통통 튑니다.',
    targetObject: 'pond_sparkle',
    hint: '햇살이 비치는 잔잔한 물가를 눌러보세요.',
  },
  'peaceful-forest': {
    mind: 'peaceful',
    path: 'forest',
    title: '살랑이는 숲 바람',
    sentence: '나뭇가지 사이로 부드러운 바람이 불어와 푸른 잎들이 살랑입니다.',
    targetObject: 'tree',
    hint: '초록빛 커다란 나무를 살포시 눌러보세요.',
  },
  'peaceful-water': {
    mind: 'peaceful',
    path: 'water',
    title: '연잎의 이슬방울',
    sentence: '연못의 연잎 위에 맺힌 맑은 이슬방울이 또르르 굴러 떨어집니다.',
    targetObject: 'lotus',
    hint: '연못 가운데 둥근 연잎을 눌러보세요.',
  },
  'complex-forest': {
    mind: 'complex',
    path: 'forest',
    title: '흩어지는 나뭇가지 그림자',
    sentence: '흙길 위로 드리운 나뭇가지 그림자가 바람에 천천히 흩어집니다.',
    targetObject: 'trail',
    hint: '구불구불 이어진 숲길 위를 살포시 눌러보세요.',
  },
  'complex-water': {
    mind: 'complex',
    path: 'water',
    title: '퍼져나가는 물결',
    sentence: '돌을 누르면 겹치던 물결이 동심원을 그리며 바깥으로 맑게 퍼집니다.',
    targetObject: 'stone',
    hint: '물가에 놓인 잔잔한 돌을 눌러보세요.',
  },
};

/**
 * Returns YYYY-MM-DD in Asia/Seoul timezone
 */
export function getSeoulDateString(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch {
    // Fallback if timezone not supported in environment
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const seoul = new Date(utc + 9 * 3600000);
    const y = seoul.getFullYear();
    const m = String(seoul.getMonth() + 1).padStart(2, '0');
    const d = String(seoul.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

export interface IslandGrowthState {
  peacefulCount: number;
  flutterCount: number;
  tiredCount: number;
  complexCount: number;
  peacefulStage: number; // 0..3
  flutterStage: number; // 0..3
  tiredStage: number; // 0..3
  complexStage: number; // 0..3
  totalVisits: number;
}

/**
 * Calculate island growth stages from distinct date records
 */
export function calculateGrowthState(records: MindRecord[]): IslandGrowthState {
  const distinctByDate = new Map<string, MindType>();
  for (const r of records || []) {
    if (r && r.date && r.mind) {
      distinctByDate.set(r.date, r.mind);
    }
  }

  let peacefulCount = 0;
  let flutterCount = 0;
  let tiredCount = 0;
  let complexCount = 0;

  for (const mind of distinctByDate.values()) {
    if (mind === 'peaceful') peacefulCount++;
    else if (mind === 'flutter') flutterCount++;
    else if (mind === 'tired') tiredCount++;
    else if (mind === 'complex') complexCount++;
  }

  return {
    peacefulCount,
    flutterCount,
    tiredCount,
    complexCount,
    peacefulStage: Math.min(3, peacefulCount),
    flutterStage: Math.min(3, flutterCount),
    tiredStage: Math.min(3, tiredCount),
    complexStage: Math.min(3, complexCount),
    totalVisits: distinctByDate.size,
  };
}

const STORAGE_KEY = 'mind_world_records_v1';

export function loadMindRecords(): MindRecord[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load mind records', e);
  }
  return [];
}

export function saveMindRecords(records: MindRecord[]): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save mind records', e);
  }
}
