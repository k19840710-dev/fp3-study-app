import { SECTIONS } from '../../data/sections';
import type { Question, UserStats } from '../../types';

export function HistoryView({
  questions,
  userStats,
  onReset,
}: {
  questions: Question[];
  userStats: UserStats;
  onReset: () => void;
}) {
  const total = userStats.totalAnswers;
  const correct = userStats.correctAnswers;
  const overallRate = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">学習分析</h2>
          <p className="text-xs text-slate-500">学習実績とデータ管理</p>
        </div>
        <button
          onClick={onReset}
          className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
        >
          全データを初期化
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-center">
        <div>
          <div className="text-[10px] text-slate-500">通算解答</div>
          <div className="mt-0.5 text-base font-black text-slate-800">{total}問</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500">正解</div>
          <div className="mt-0.5 text-base font-black text-emerald-600">{correct}問</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500">正答率</div>
          <div className="mt-0.5 text-base font-black text-brand-600">{overallRate}%</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500">全登録問題</div>
          <div className="mt-0.5 text-base font-black text-purple-700">{questions.length}問</div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h3 className="flex items-center space-x-1 text-sm font-bold text-slate-800">
          <span>📊</span>
          <span>分野別通算正答率</span>
        </h3>

        <div className="space-y-3">
          {SECTIONS.map((sec) => {
            const secQs = questions.filter((q) => q.sectionId === sec.id);
            let secTotal = 0;
            let secCorrect = 0;
            secQs.forEach((q) => {
              const stat = userStats.questionStats[q.id];
              if (stat) {
                secTotal += stat.timesAnswered;
                secCorrect += stat.timesCorrect;
              }
            });
            const rate = secTotal > 0 ? Math.round((secCorrect / secTotal) * 100) : 0;

            return (
              <div key={sec.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    {sec.icon} {sec.name}
                  </span>
                  <span className="font-semibold text-slate-500">
                    {secTotal > 0 ? `${rate}% (${secCorrect}/${secTotal}回)` : '未実施'}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full transition-all duration-300 ${
                      rate >= 70 ? 'bg-emerald-500' : rate >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
