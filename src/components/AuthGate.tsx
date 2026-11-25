import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { loginUser, registerUser, type AuthSession } from '../lib/authStore';

interface AuthGateProps {
  onAuthSuccess: (session: AuthSession) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await registerUser({ email, password, nickname });
        if (res.ok) {
          onAuthSuccess(res.session);
        } else {
          setError(res.error);
        }
      } else {
        const res = await loginUser({ email, password });
        if (res.ok) {
          onAuthSuccess(res.session);
        } else {
          setError(res.error);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFECE3] text-stone-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#3d5a45] text-white shadow-sm mb-1">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            마음이 자라는 세계
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            오늘의 마음 일기를 기록하고, 나만의 작은 세계가 자라나는 과정을 만나보세요.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/95 backdrop-blur rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-md space-y-5">
          {/* Tabs */}
          <div className="grid grid-cols-2 bg-stone-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#3d5a45] shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#3d5a45] shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              회원가입
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  닉네임
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="세계에서 불릴 이름 (2자 이상)"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/70 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d5a45]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                이메일
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/70 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d5a45]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자 이상 입력"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/70 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d5a45]"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#3d5a45] hover:bg-[#314a38] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>{mode === 'signup' ? '회원가입하고 내 세계 시작하기' : '내 세계로 들어가기'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-stone-100 flex items-start gap-2 text-[11px] text-stone-500 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#3d5a45] shrink-0 mt-0.5" />
            <span>
              계정별로 일기와 세계 데이터가 완전히 분리되어 보관되며, 로그인한 사용자 본인만 열람할 수 있습니다.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
