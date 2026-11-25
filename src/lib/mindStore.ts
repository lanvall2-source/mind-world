export type MindType = 'peaceful' | 'flutter' | 'tired' | 'complex';
export type WalkPath = 'forest' | 'water';

export interface MindRecord {
  date: string; // 'YYYY-MM-DD' (Asia/Seoul)
  mind: MindType;
  memo?: string;
  diaryText?: string;
  walkPath?: WalkPath;
  walkCompleted?: boolean;
  illustration?: any;
  createdAt: string;
  updatedAt: string;
}

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
    title: '물결에 반짝이는 햇살',
    sentence: '맑은 물결이 반짝이며 작은 물방울이 햇살 속으로 튀어 오릅니다.',
    targetObject: 'pond_sparkle',
    hint: '햇살이 비치는 물결을 살포시 눌러보세요.',
  },
  'peaceful-forest': {
    mind: 'peaceful',
    path: 'forest',
    title: '바람에 흔들리는 잎사귀',
    sentence: '초록빛 나무 위로 부드러운 바람이 지나며 나뭇잎들이 살랑입니다.',
    targetObject: 'tree',
    hint: '언덕 위의 푸른 나무를 살포시 눌러보세요.',
  },
  'peaceful-water': {
    mind: 'peaceful',
    path: 'water',
    title: '피어나는 연꽃',
    sentence: '연잎 사이로 분홍빛 연꽃이 조용히 피어나며 물결을 가라앉힙니다.',
    targetObject: 'lotus',
    hint: '연못 중앙의 연잎과 꽃봉오리를 살포시 눌러보세요.',
  },
  'complex-forest': {
    mind: 'complex',
    path: 'forest',
    title: '낙엽 덮인 오솔길',
    sentence: '구불구불한 흙길 위에 흩어진 마른 잎들이 길섶으로 조용히 물러납니다.',
    targetObject: 'trail',
    hint: '풀밭 사이로 굽이치는 길을 살포시 눌러보세요.',
  },
  'complex-water': {
    mind: 'complex',
    path: 'water',
    title: '흔들리지 않는 징검돌',
    sentence: '물결이 동심원을 그리며 흐르는 물속에서도 단단한 징검다리 돌들이 든든하게 길을 지켜줍니다.',
    targetObject: 'stone',
    hint: '연못 가장자리에 놓인 돌을 살포시 눌러보세요.',
  },
};

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

export function loadMindRecords(): MindRecord[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem('mind_world_records_v1');
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
    localStorage.setItem('mind_world_records_v1', JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save mind records', e);
  }
}

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

export interface MindMeta {
  type: MindType;
  label: string;
  emoji: string;
  color: string;
  placeName: string;
  comfortMessage: string;
  stages: [string, string, string];
}

export const MIND_METAS: Record<MindType, MindMeta> = {
  peaceful: {
    type: 'peaceful',
    label: '평온',
    emoji: '🍃',
    color: '#5B7B4B',
    placeName: '연못과 연꽃',
    comfortMessage: '물결처럼 고요하고 편안한 하루를 보내셨군요.',
    stages: ['연못에 연잎 한 장', '작은 연꽃 봉오리', '연꽃이 핀 연못'],
  },
  flutter: {
    type: 'flutter',
    label: '설렘',
    emoji: '🌸',
    color: '#E07A5F',
    placeName: '길가 화단',
    comfortMessage: '기분 좋은 두근거림이 섬 전체를 따뜻하게 물들여요.',
    stages: ['길가의 꽃봉오리', '첫 꽃이 핀 화단', '나비가 찾는 꽃밭'],
  },
  tired: {
    type: 'tired',
    label: '지침',
    emoji: '🪵',
    color: '#718096',
    placeName: '나무 그늘 쉼터',
    comfortMessage: '오늘은 이 그늘에서 편안히 쉬어가요.',
    stages: ['나무 그늘에 벤치', '벤치 옆 작은 등', '불이 켜진 아늑한 쉼터'],
  },
  complex: {
    type: 'complex',
    label: '복잡',
    emoji: '🪨',
    color: '#6B46C1',
    placeName: '물가 징검다리',
    comfortMessage: '어지러운 마음들을 여기에 잠시 내려놓아도 괜찮아요.',
    stages: ['물가의 납작한 돌', '나란히 놓인 돌 두 개', '연못을 건너는 징검다리'],
  },
};

export interface DiaryEntry {
  id: string;
  date: string; // 'YYYY-MM-DD' (Asia/Seoul)
  title?: string;
  content: string; // 일기 본문
  mind: MindType;
  extractedElements: string[]; // ['책', '커피', '창가'] 등 본문에서 추출된 사물/테마
  createdAt: string;
  updatedAt: string;
}

export interface WorldStageInfo {
  stage: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  description: string;
  requiredCount: number; // minimum count to reach this stage
  nextStageGoal: number; // count needed for next stage
  imagePath: string;
}

export const WORLD_STAGES: Record<number, WorldStageInfo> = {
  1: {
    stage: 1,
    title: '기억의 시작',
    subtitle: '고요한 빈 들판과 어린 새싹',
    description: '작은 일기 조각들이 모여 세상의 첫 씨앗을 품었습니다.',
    requiredCount: 0,
    nextStageGoal: 3,
    imagePath: '/worlds/stage1.jpg',
  },
  2: {
    stage: 2,
    title: '길과 시냇물',
    subtitle: '오솔길과 맑은 개울, 자라난 나무',
    description: '하루하루의 이야기가 흘러 시냇물이 되고, 튼튼한 나무 한 그루가 그늘을 만듭니다.',
    requiredCount: 3,
    nextStageGoal: 7,
    imagePath: '/worlds/stage2.jpg',
  },
  3: {
    stage: 3,
    title: '온기의 마을',
    subtitle: '아늑한 오두막과 등불, 꽃밭',
    description: '나의 소중한 발자국들이 모여 불이 켜진 쉼터와 꽃밭이 가득한 마을이 되었습니다.',
    requiredCount: 7,
    nextStageGoal: 15,
    imagePath: '/worlds/stage3.jpg',
  },
  4: {
    stage: 4,
    title: '별빛의 영원한 세계',
    subtitle: '은하수와 숲이 어우러진 대세계',
    description: '수많은 날들의 기쁨과 고단함이 켜켜이 쌓여, 깊고 찬란한 하나의 소우주가 완성되었습니다.',
    requiredCount: 15,
    nextStageGoal: 15,
    imagePath: '/worlds/stage4.jpg',
  },
};

export interface PlantedElement {
  tag: string;
  emoji: string;
  count: number;
}

export interface CumulativeWorldState {
  totalCount: number;
  stageInfo: WorldStageInfo;
  progressPercent: number;
  diariesToNextStage: number;
  plantedElements: PlantedElement[];
}

/**
 * Known element dictionaries to extract memories from diary text
 */
const ELEMENT_DICT: Array<{ keywords: RegExp; tag: string; emoji: string }> = [
  { keywords: /집|오두막|방|문턱|현관|내 방/, tag: '아늑한 쉼터', emoji: '🏡' },
  { keywords: /강아지|반려견|댕댕이|개/, tag: '반려견', emoji: '🐶' },
  { keywords: /고양이|야옹|냥이/, tag: '고양이', emoji: '🐱' },
  { keywords: /책|독서|책장|소설|도서관/, tag: '책', emoji: '📚' },
  { keywords: /커피|카페|차|찻잔|머그/, tag: '따뜻한 차', emoji: '☕' },
  { keywords: /버스|지하철|전철|퇴근길|출근길/, tag: '오솔길 여정', emoji: '🚌' },
  { keywords: /공원|산책|걸었|걷다|길/, tag: '산책길', emoji: '🌿' },
  { keywords: /나무|숲|나뭇잎|풀밭/, tag: '푸른 나무', emoji: '🌲' },
  { keywords: /꽃|꽃밭|화단|꽃봉오리/, tag: '꽃밭', emoji: '🌸' },
  { keywords: /비|빗소리|우산|소나기/, tag: '맑은 빗방울', emoji: '💧' },
  { keywords: /햇살|햇빛|맑은|따스한|볕/, tag: '따뜻한 햇살', emoji: '☀️' },
  { keywords: /별|밤하늘|새벽|저녁|달빛/, tag: '밤하늘 별빛', emoji: '✨' },
  { keywords: /바람|살랑|시원/, tag: '숲 바람', emoji: '🍃' },
  { keywords: /음악|노래|이어폰/, tag: '멜로디', emoji: '🎵' },
  { keywords: /노트북|컴퓨터|작업|일|공부/, tag: '기록과 작업', emoji: '💻' },
  { keywords: /벤치|의자|쉼|휴식/, tag: '휴식의 벤치', emoji: '🪑' },
];

/**
 * Extract memorable story elements from diary content
 */
export function extractWorldElements(content: string): string[] {
  if (!content) return [];
  const found: string[] = [];
  for (const item of ELEMENT_DICT) {
    if (item.keywords.test(content)) {
      found.push(item.tag);
    }
  }
  return found;
}

/**
 * Calculate the cumulative world state from all diary entries
 */
export function calculateCumulativeWorld(entries: DiaryEntry[]): CumulativeWorldState {
  // Count entries by distinct calendar date
  const distinctDates = new Set<string>();
  for (const e of entries) {
    if (e.date) distinctDates.add(e.date);
  }
  const totalCount = distinctDates.size;

  let currentStage: 1 | 2 | 3 | 4 = 1;
  if (totalCount >= 15) currentStage = 4;
  else if (totalCount >= 7) currentStage = 3;
  else if (totalCount >= 3) currentStage = 2;
  else currentStage = 1;

  const stageInfo = WORLD_STAGES[currentStage];

  // Calculate progress to next stage
  let progressPercent = 100;
  let diariesToNextStage = 0;

  if (currentStage < 4) {
    const currentBase = stageInfo.requiredCount;
    const nextGoal = stageInfo.nextStageGoal;
    const diff = nextGoal - currentBase;
    const currentProgress = totalCount - currentBase;
    progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / diff) * 100)));
    diariesToNextStage = Math.max(0, nextGoal - totalCount);
  }

  // Aggregate planted elements across all diaries
  const tagCountMap = new Map<string, { emoji: string; count: number }>();
  for (const e of entries) {
    for (const tag of e.extractedElements || []) {
      const match = ELEMENT_DICT.find((d) => d.tag === tag);
      const emoji = match?.emoji || '🌱';
      const existing = tagCountMap.get(tag);
      if (existing) {
        existing.count += 1;
      } else {
        tagCountMap.set(tag, { emoji, count: 1 });
      }
    }
  }

  const plantedElements: PlantedElement[] = Array.from(tagCountMap.entries()).map(([tag, val]) => ({
    tag,
    emoji: val.emoji,
    count: val.count,
  }));

  return {
    totalCount,
    stageInfo,
    progressPercent,
    diariesToNextStage,
    plantedElements,
  };
}

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
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const seoul = new Date(utc + 9 * 3600000);
    const y = seoul.getFullYear();
    const m = String(seoul.getMonth() + 1).padStart(2, '0');
    const d = String(seoul.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

const STORAGE_KEY = 'mind_world_diaries_v2';
const LEGACY_KEY = 'mind_world_records_v1';

function getStorageKey(userId?: string): string {
  return userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
}

export function loadDiaryEntries(userId?: string): DiaryEntry[] {
  if (typeof localStorage === 'undefined') return [];
  const key = getStorageKey(userId);
  try {
    // 1. Try v2 diary format
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }

    // 2. Fallback / Migrate from legacy v1 format (only when no userId namespace)
    if (!userId) {
      const legacyRaw = localStorage.getItem(LEGACY_KEY);
      if (legacyRaw) {
        const legacyParsed = JSON.parse(legacyRaw);
        if (Array.isArray(legacyParsed) && legacyParsed.length > 0) {
          const migrated: DiaryEntry[] = legacyParsed.map((r) => {
            const content = r.memo || r.diaryText || '이 날의 마음 기록';
            return {
              id: `diary-${r.date}`,
              date: r.date,
              content,
              mind: r.mind || 'peaceful',
              extractedElements: extractWorldElements(content),
              createdAt: r.createdAt || new Date().toISOString(),
              updatedAt: r.updatedAt || new Date().toISOString(),
            };
          });
          saveDiaryEntries(migrated, userId);
          return migrated;
        }
      }
    }
  } catch (e) {
    console.error('Failed to load diary entries', e);
  }
  return [];
}

export function saveDiaryEntries(entries: DiaryEntry[], userId?: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save diary entries', e);
  }
}
