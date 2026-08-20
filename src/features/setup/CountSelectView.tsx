import type { ReviewFilter } from '../../types';

const COUNT_OPTIONS = [5, 10, 20];

export function CountSelectView({
  label,
  labelClassName,
  isReview,
  reviewFilter,
  onReviewFilterChange,
  questionCount,
  onQuestionCountChange,
  onBack,
  onStart,
}: {
  label: string;
  labelClassName: string;
  isReview: boolean;
  reviewFilter: ReviewFilter;
  onReviewFilterChange: (f: ReviewFilter) => void;
  questionCount: number;
  onQuestionCountChange: (n: number) => void;
  onBack: () => void;
  onStart: () => void;
}) {
  return (
    <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-center">
        <h2 className="text-lg font-bold text-slate-800">演習設定</h2>
        <p className={`mt-1 text-xs font-bold ${labelClassName}`}>{label}</p>
      </div>

      {isReview && (
        <div className="space-y-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5">
          <label className="block text-xs font-bold text-rose-900">復習対象の選択</label>
          <div className="grid grid-cols-3 gap-1">
            {(
              [
                ['all', 'ミス全般'],
                ['weak', '苦手優先'],
                ['recent', '直近ミスのみ'],
              ] as [ReviewFilter, string][]
            ).map(([value, text]) => (
              <button
                key={value}
                onClick={() => onReviewFilterChange(value)}
                className={`rounded-lg py-1.5 text-xs font-bold transition ${
                  reviewFilter === value ? 'bg-rose-600 text-white' : 'bg-white text-slate-600'
                }`}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <label className="block text-center text-xs font-bold text-slate-700">
          出題する問題数を選択
        </label>
        <div className="grid grid-cols-3 gap-2">
          {COUNT_OPTIONS.map((count) => (
            <button
              key={count}
              onClick={() => onQuestionCountChange(count)}
              className={`rounded-xl border py-3 text-sm font-extrabold transition ${
                questionCount === count
                  ? 'border-brand-600 bg-brand-600 text-white shadow-md'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {count} 問
            </button>
          ))}
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          onClick={onBack}
          className="w-1/3 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
        >
          戻る
        </button>
        <button
          onClick={onStart}
          className="w-2/3 rounded-xl bg-brand-600 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-700"
        >
          演習を開始する
        </button>
      </div>
    </div>
  );
}
