export interface UserAccount {
  id: string;
  email: string;
  nickname: string;
  passwordHash: string;
  createdAt: string;
}

export interface AuthSession {
  id: string;
  email: string;
  nickname: string;
}

const USERS_KEY = 'mind_world_users_v1';
const SESSION_KEY = 'mind_world_session_v1';

async function hashPassword(password: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoded = new TextEncoder().encode(password);
    const buffer = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Fallback deterministic encoding for non-HTTPS test environments
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `fb_${hash.toString(16)}`;
}

function loadUsers(): UserAccount[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users: UserAccount[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentSession(): AuthSession | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.id === 'string' && typeof parsed.email === 'string') {
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export function logoutUser(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

export async function registerUser(input: {
  email: string;
  password: string;
  nickname: string;
}): Promise<{ ok: true; session: AuthSession } | { ok: false; error: string }> {
  const email = input.email.trim().toLowerCase();
  const nickname = input.nickname.trim();
  const password = input.password;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: '올바른 이메일 주소를 입력해 주세요.' };
  }
  if (nickname.length < 2) {
    return { ok: false, error: '닉네임은 2자 이상 입력해 주세요.' };
  }
  if (password.length < 6) {
    return { ok: false, error: '비밀번호는 6자 이상으로 설정해 주세요.' };
  }

  const users = loadUsers();
  if (users.some((u) => u.email === email)) {
    return { ok: false, error: '이미 가입된 이메일 주소입니다.' };
  }

  const passwordHash = await hashPassword(password);
  const newUser: UserAccount = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    email,
    nickname,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);

  const session: AuthSession = {
    id: newUser.id,
    email: newUser.email,
    nickname: newUser.nickname,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ ok: true; session: AuthSession } | { ok: false; error: string }> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!email || !password) {
    return { ok: false, error: '이메일과 비밀번호를 모두 입력해 주세요.' };
  }

  const users = loadUsers();
  const found = users.find((u) => u.email === email);
  if (!found) {
    return { ok: false, error: '가입되지 않은 이메일이거나 비밀번호가 올바르지 않습니다.' };
  }

  const passwordHash = await hashPassword(password);
  if (found.passwordHash !== passwordHash) {
    return { ok: false, error: '가입되지 않은 이메일이거나 비밀번호가 올바르지 않습니다.' };
  }

  const session: AuthSession = {
    id: found.id,
    email: found.email,
    nickname: found.nickname,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}
