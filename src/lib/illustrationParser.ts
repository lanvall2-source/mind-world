import {
  BackgroundId,
  DiaryIllustrationData,
  MindType,
  SceneCandidate,
} from './mindStore';

interface ParsedClause {
  text: string;
  isNegatedOrAbandoned: boolean;
  background?: BackgroundId;
  primaryObject?: string;
  primaryState?: string;
  secondaryObject?: string;
  label?: string;
}

/**
 * Hash string to positive 32-bit integer for stable rendering seed
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Check if clause represents an untaken intention or negation
 * e.g. "버스를 타려다가", "우산을 가져가지 않았다"
 */
function isClauseNegatedOrAbandoned(clause: string): boolean {
  // Abandoned intention patterns (~려다가, ~려 했으나, ~려 했는데, ~려다 등)
  const abandonedPatterns = [
    /려다가/,
    /려\s*했으나/,
    /려\s*했는데/,
    /하려다/,
    /하려\s*했/,
    /탈까\s*하다가/,
    /갈까\s*하다가/,
    /할까\s*하다가/,
  ];
  for (const pat of abandonedPatterns) {
    if (pat.test(clause)) return true;
  }

  // Explicit negation of objects/actions (~지 않았다, ~않고, ~안, ~못, ~말고)
  const negationPatterns = [
    /지\s*않았/,
    /지\s*않고/,
    /가져가지\s*않/,
    /타지\s*않/,
    /안\s*탔/,
    /안\s*갔/,
    /못\s*탔/,
    /사지\s*않/,
    /없었/,
  ];
  for (const pat of negationPatterns) {
    if (pat.test(clause)) return true;
  }

  return false;
}

/**
 * Detect Weather Fact from raw text
 */
function detectWeather(text: string): 'sunny' | 'rainy' | 'night' | 'day' {
  if (/햇살|햇빛|맑은|따스한|볕|화창/.test(text)) return 'sunny';
  if (/비가|빗소리|비오는|우산|소나기|빗물/.test(text)) return 'rainy';
  if (/밤|퇴근|저녁|새벽|어두운|달빛|야간/.test(text)) return 'night';
  return 'day';
}

/**
 * Analyze a single clause to see if it matches one of our 5 backgrounds and 15 objects
 */
function analyzeClause(clause: string): Omit<ParsedClause, 'text' | 'isNegatedOrAbandoned'> | null {
  const c = clause.trim();

  // 1. Entrance (현관) - 열린 문과 문턱 / 강아지, 신발, 우산
  if (/현관|집에\s*오니|집에\s*도착|문턱|현관문|신발|문앞/.test(c) || (/강아지|반려견|댕댕이/.test(c) && !/공원|산책로/.test(c))) {
    let primaryObject = 'shoes';
    let primaryState = 'placed';
    let label = '현관과 문턱';

    if (/강아지|반려견|댕댕이/.test(c)) {
      primaryObject = 'dog';
      if (/뛰어|달려|반기|마중|꼬리|일어나/.test(c)) {
        primaryState = 'running';
        label = '마중 나온 강아지';
      } else {
        primaryState = 'sleeping';
        label = '문턱의 강아지';
      }
    } else if (/우산/.test(c)) {
      primaryObject = 'umbrella';
      primaryState = /접|털|세워|두었|꽂/.test(c) ? 'folded' : 'held';
      label = primaryState === 'folded' ? '현관에 접어둔 우산' : '우산';
    } else if (/신발|구두|운동화/.test(c)) {
      primaryObject = 'shoes';
      primaryState = 'placed';
      label = '현관에 놓인 신발';
    }

    return {
      background: 'entrance',
      primaryObject,
      primaryState,
      secondaryObject: primaryObject !== 'shoes' ? 'shoes' : undefined,
      label,
    };
  }

  // 2. Transit (대중교통) - 큰 차창과 좌석 / 손잡이, 가방, 이어폰
  if (/버스|지하철|전철|차창|좌석|손잡이|차안|대중교통|퇴근\s*버스|출근\s*버스/.test(c)) {
    let primaryObject = 'seat_window';
    let primaryState = 'leaning';
    let label = '버스 창가';

    if (/손잡이/.test(c)) {
      primaryObject = 'strap';
      primaryState = 'hanging';
      label = '차창과 손잡이';
    } else if (/가방/.test(c)) {
      primaryObject = 'bag';
      primaryState = 'resting';
      label = '좌석 위의 가방';
    } else if (/이어폰|음악|노래/.test(c)) {
      primaryObject = 'earphone';
      primaryState = 'listening';
      label = '차창과 이어폰';
    } else if (/기대|기댔|눈을|바라보|앉아|앉았/.test(c)) {
      primaryObject = 'seat_window';
      primaryState = 'leaning';
      label = '차창과 좌석';
    }

    return {
      background: 'transit',
      primaryObject,
      primaryState,
      secondaryObject: 'strap',
      label,
    };
  }

  // 3. Street / Park (거리·공원) - 굽은 길 / 벤치, 가로등, 나무
  if (/공원|거리|길|산책|걸었|걷다|걸어가|집까지\s*걸|집으로\s*걸|벤치|가로등|길가/.test(c)) {
    let primaryObject = 'bench';
    let primaryState = 'passing';
    let label = '집으로 걷는 길';

    if (/공원/.test(c)) {
      label = '공원 산책로';
    }

    if (/벤치/.test(c)) {
      primaryObject = 'bench';
      if (/앉았|앉아|쉬었|쉬어/.test(c)) {
        primaryState = 'seated';
        label = '공원 벤치에서의 휴식';
      } else {
        primaryState = 'passing';
        label = '길가의 벤치';
      }
    } else if (/가로등|불빛/.test(c)) {
      primaryObject = 'streetlight';
      primaryState = 'glowing';
      label = '가로등 켜진 길';
    } else if (/나무|숲|바람/.test(c)) {
      primaryObject = 'tree';
      primaryState = 'swaying';
      label = '나무가 있는 길';
    } else {
      primaryObject = 'bench';
      primaryState = 'passing';
    }

    return {
      background: 'street_park',
      primaryObject,
      primaryState,
      secondaryObject: 'tree',
      label,
    };
  }

  // 4. Room (방 안) - 창가와 작은 테이블 / 책, 머그잔, 스탠드
  if (/방|창가|테이블|책|머그잔|커피|차를\s*마|스탠드|조명|침대|거실/.test(c)) {
    let primaryObject = 'book';
    let primaryState = 'open';
    let label = '창가와 테이블';

    if (/책/.test(c)) {
      primaryObject = 'book';
      if (/덮었|덮고|마쳤|끝냈|내려놓/.test(c)) {
        primaryState = 'closed';
        label = '창가에서 덮은 책';
      } else {
        primaryState = 'open';
        label = '창가에서 펼친 책';
      }
    } else if (/머그잔|커피|차|찻잔/.test(c)) {
      primaryObject = 'mug';
      primaryState = 'steaming';
      label = '테이블 위 따뜻한 잔';
    } else if (/스탠드|조명|불을\s*켜/.test(c)) {
      primaryObject = 'lamp';
      primaryState = 'lit';
      label = '스탠드가 켜진 방';
    }

    return {
      background: 'room',
      primaryObject,
      primaryState,
      secondaryObject: 'mug',
      label,
    };
  }

  // 5. Workplace / Desk (일터·책상) - 비스듬히 내려다본 작업대 / 노트북, 노트, 펜
  if (/책상|작업대|노트북|사무실|일터|회사|모니터|노트|펜|다이어리|작업|공부/.test(c)) {
    let primaryObject = 'laptop';
    let primaryState = 'open';
    let label = '작업대와 책상';

    if (/노트북|컴퓨터/.test(c)) {
      primaryObject = 'laptop';
      primaryState = /닫았|덮었|껐/.test(c) ? 'closed' : 'open';
      label = primaryState === 'closed' ? '닫힌 노트북' : '작업 중인 노트북';
    } else if (/노트|펜|다이어리|필기|썼다|적었/.test(c)) {
      primaryObject = 'notebook';
      primaryState = 'writing';
      label = '노트와 펜';
    }

    return {
      background: 'desk',
      primaryObject,
      primaryState,
      secondaryObject: 'pen',
      label,
    };
  }

  return null;
}

/**
 * Split text into clauses while retaining delimiter context
 */
function splitIntoClauses(text: string): string[] {
  // Split on periods, newlines, commas, and major Korean conjunctive suffixes
  const rawSegments = text.split(/(?<=[.!?\n,])|(?<=[고며])\s+|(?<=다가)\s+|(?<=내려)\s+|(?<=나와)\s+/);
  const result: string[] = [];
  for (const s of rawSegments) {
    const trimmed = s.trim();
    if (trimmed.length > 0) {
      result.push(trimmed);
    }
  }
  return result;
}

/**
 * Main Illustration Parser:
 * Analyzes diary text and emotion to generate DiaryIllustrationData
 */
export function parseDiaryToIllustration(
  rawText: string,
  emotion: MindType,
  existingIllustration?: DiaryIllustrationData
): DiaryIllustrationData {
  const seed = hashString(rawText || 'empty');
  const weather = detectWeather(rawText || '');

  if (!rawText || rawText.trim().length === 0) {
    return {
      backgroundId: 'abstract',
      primaryObject: 'abstract_wash',
      primaryState: 'serene',
      lighting: emotion,
      weather: 'day',
      candidateScenes: [],
      selectedSceneIndex: 0,
      caption: '감정의 색으로 그린 그림',
      version: 1,
      seed,
    };
  }

  const clauses = splitIntoClauses(rawText);
  const candidates: SceneCandidate[] = [];

  for (const clause of clauses) {
    const isNegated = isClauseNegatedOrAbandoned(clause);
    if (isNegated) {
      // Intentionally skipped! e.g. "버스를 타려다가"
      continue;
    }

    const match = analyzeClause(clause);
    if (match && match.background && match.primaryObject) {
      // Check for duplicate candidate of the same background & primaryObject
      const exists = candidates.some(
        (c) => c.backgroundId === match.background && c.primaryObject === match.primaryObject && c.primaryState === match.primaryState
      );
      if (!exists) {
        // Excerpt: shorten clause for caption
        const excerpt = clause.replace(/[.!?]+$/, '').trim();
        candidates.push({
          label: match.label || '기억하고 싶은 장면',
          backgroundId: match.background,
          primaryObject: match.primaryObject,
          primaryState: match.primaryState || 'default',
          secondaryObject: match.secondaryObject,
          excerptSentence: excerpt,
        });
      }
    }
  }

  // Case 6: Abstract Fallback (No concrete place/object/action found)
  // e.g. "오늘은 그냥 생각이 많았다", "마음이 무거웠다"
  if (candidates.length === 0) {
    return {
      backgroundId: 'abstract',
      primaryObject: 'abstract_wash',
      primaryState: 'gentle',
      lighting: emotion,
      weather,
      candidateScenes: [],
      selectedSceneIndex: 0,
      caption: '감정의 색으로 그린 그림',
      version: 1,
      seed,
    };
  }

  // If multiple candidates exist, default is the LAST concrete action!
  // e.g. "퇴근 버스에서 내려 집까지 걸었다" -> Candidate 0: 버스, Candidate 1: 집까지 걸었다 -> default is Candidate 1
  let selectedIndex = candidates.length - 1;

  // If existingIllustration had a valid user-selected index within candidates bounds, keep it
  if (
    existingIllustration &&
    existingIllustration.selectedSceneIndex >= 0 &&
    existingIllustration.selectedSceneIndex < candidates.length
  ) {
    // Check if the candidate at that index is compatible
    selectedIndex = existingIllustration.selectedSceneIndex;
  }

  const chosen = candidates[selectedIndex];
  const captionText = chosen.excerptSentence || clauses[clauses.length - 1].replace(/[.!?]+$/, '').trim();

  return {
    backgroundId: chosen.backgroundId,
    primaryObject: chosen.primaryObject,
    primaryState: chosen.primaryState,
    secondaryObject: chosen.secondaryObject,
    lighting: emotion,
    weather,
    candidateScenes: candidates,
    selectedSceneIndex: selectedIndex,
    caption: captionText,
    version: 1,
    seed,
  };
}
