import type { SubsectionAnalytics } from '../../lib/quizEngine';
import { buildRequestIssueUrl } from '../../lib/requestQuestions';

export function HomeView({
  totalAnswers,
  correctAnswers,
  overallRate,
  totalQuestions,
  weakSubsections,
  onGoToCategory,
  onGoToRandom,
  onGoToReview,
  onGoToWeakSubsection,
}: {
  totalAnswers: number;
  correctAnswers: number;
  overallRate: number;
  totalQuestions: number;
  weakSubsections: SubsectionAnalytics[];
  onGoToCategory: () => void;
  onGoToRandom: () => void;
  onGoToReview: () => void;
  onGoToWeakSubsection: (s: SubsectionAnalytics) => void;
}) {
  const topWeak = weakSubsections[0];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-brand-700 to-emerald-600 p-6 text-white shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider opacity-90">学習データ</h2>
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold">
            この端末に保存
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
            <div className="text-2xl font-black">{totalAnswers}</div>
            <div className="mt-0.5 text-[11px] opacity-80">総回答数</div>
          </div>
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
            <div className="text-2xl font-black">{correctAnswers}</div>
            <div className="mt-0.5 text-[11px] opacity-80">正解数</div>
          </div>
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
            <div className="text-2xl font-black">{overallRate}%</div>
            <div className="mt-0.5 text-[11px] opacity-80">通算正答率</div>
          </div>
        </div>
      </div>

      {topWeak && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1 rounded-md bg-amber-200/60 px-2.5 py-0.5 text-xs font-bold text-amber-800">
              ⚠️ 優先復習おすすめ単元
            </span>
            <span className="text-xs text-amber-700">正答率が低い単元</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-amber-800">{topWeak.sectionName}</div>
              <h3 className="text-sm font-bold text-slate-800">{topWeak.subName}</h3>
              <p className="mt-1 text-xs text-slate-600">
                正答率: <span className="font-bold text-amber-700">{topWeak.rate}%</span> (
                {topWeak.total}回演習)
              </p>
            </div>
            <button
              onClick={() => onGoToWeakSubsection(topWeak)}
              className="rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700"
            >
              直接復習する
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div
          onClick={onGoToCategory}
          className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-600 transition group-hover:scale-110">
              📚
            </div>
            <h3 className="mb-1 font-bold text-slate-800">① 分野・単元別演習</h3>
            <p className="text-xs text-slate-500">本試験過去問論点ベースで単元を絞って演習</p>
          </div>
          <span className="mt-4 flex items-center text-xs font-bold text-blue-600">
            単元を選択する →
          </span>
        </div>

        <div
          onClick={onGoToRandom}
          className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-xl text-emerald-600 transition group-hover:scale-110">
              🎲
            </div>
            <h3 className="mb-1 font-bold text-slate-800">② 全分野ランダム演習</h3>
            <p className="text-xs text-slate-500">
              登録全問題（{totalQuestions}問）から重複を避けて出題
            </p>
          </div>
          <span className="mt-4 flex items-center text-xs font-bold text-emerald-600">
            出題設定へ →
          </span>
        </div>

        <div
          onClick={onGoToReview}
          className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-xl text-rose-600 transition group-hover:scale-110">
              🔄
            </div>
            <h3 className="mb-1 font-bold text-slate-800">③ 苦手問題の復習</h3>
            <p className="text-xs text-slate-500">過去に間違えた問題やミス率の高い問を解き直し</p>
          </div>
          <span className="mt-4 flex items-center text-xs font-bold text-rose-600">
            間違えた問題を復習 →
          </span>
        </div>
      </div>

      <a
        href={buildRequestIssueUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between rounded-2xl border border-purple-200 bg-purple-50 p-4 text-purple-900 transition hover:bg-purple-100"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🔄</span>
          <div>
            <div className="text-sm font-bold">問題を追加リクエスト</div>
            <p className="text-xs text-purple-700">
              GitHubでIssueを作成すると、1時間以内に新しい問題を自動生成してPRを作ります
            </p>
          </div>
        </div>
        <span className="text-xs font-bold">開く →</span>
      </a>
    </div>
  );
}
