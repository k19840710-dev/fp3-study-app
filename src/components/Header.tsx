import type { ViewName } from '../types';

export function Header({
  view,
  totalQuestions,
  onNavigate,
}: {
  view: ViewName;
  totalQuestions: number;
  onNavigate: (view: ViewName) => void;
}) {
  return (
    <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className="flex cursor-pointer items-center space-x-3"
          onClick={() => onNavigate('home')}
        >
          <div className="rounded-xl bg-brand-600 p-2.5 text-xl font-black text-white shadow-sm">
            FP3
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 md:text-lg">FP3級 学習アプリ</h1>
            <p className="text-xs text-slate-500">本試験論点厳選問題（ローカル保存版）</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onNavigate('home')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition md:text-sm ${
              view === 'home' ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ホーム
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition md:text-sm ${
              view === 'history'
                ? 'bg-brand-100 text-brand-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            学習分析
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px]">
        <span className="font-bold text-slate-600">💾 データはこの端末に保存されます</span>
        <span className="font-semibold text-slate-500">
          全登録問題数: <span className="font-bold text-purple-700">{totalQuestions}問</span>
        </span>
      </div>
    </header>
  );
}
