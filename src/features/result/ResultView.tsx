import type { QuizSessionResult } from '../../types';

export function ResultView({
  results,
  onHome,
  onRetry,
}: {
  results: QuizSessionResult[];
  onHome: () => void;
  onRetry: () => void;
}) {
  const correctCount = results.filter((r) => r.isCorrect).length;
  const rate = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div className="space-y-2">
        <span className="text-4xl">🎉</span>
        <h2 className="text-xl font-bold text-slate-800">演習完了！</h2>
        <p className="text-xs text-slate-500">
          お疲れ様でした。学習結果はこの端末に保存されました。
        </p>
      </div>

      <div className="mx-auto inline-block w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
          今回の正答率
        </div>
        <div className="mb-2 text-5xl font-black text-brand-600">
          {rate}
          <span className="text-2xl font-bold">%</span>
        </div>
        <div className="text-sm font-bold text-slate-700">
          {results.length} 問中 <span className="text-brand-700">{correctCount} 問</span> 正解
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
        <button
          onClick={onHome}
          className="w-full rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
        >
          ホームへ戻る
        </button>
        <button
          onClick={onRetry}
          className="w-full rounded-xl bg-brand-600 py-3 text-xs font-bold text-white shadow-md transition hover:bg-brand-700"
        >
          もう一度挑戦する
        </button>
      </div>
    </div>
  );
}
