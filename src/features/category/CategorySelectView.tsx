import { SECTIONS } from '../../data/sections';
import type { Question, Section, Subsection } from '../../types';

export function CategorySelectView({
  questions,
  onSelectSection,
  onSelectSub,
  onCancel,
}: {
  questions: Question[];
  onSelectSection: (section: Section) => void;
  onSelectSub: (section: Section, sub: Subsection) => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">分野・単元の選択</h2>
          <p className="text-xs text-slate-500">単元ごとの登録問題数を表示しています</p>
        </div>
        <button
          onClick={onCancel}
          className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800"
        >
          キャンセル
        </button>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((sec) => {
          const secQCount = questions.filter((q) => q.sectionId === sec.id).length;
          return (
            <div key={sec.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{sec.icon}</span>
                  <div>
                    <span className="text-sm font-bold text-slate-800">{sec.name}</span>
                    <span className="ml-2 text-[11px] font-bold text-slate-500">
                      ({secQCount}問)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onSelectSection(sec)}
                  className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-brand-700"
                >
                  分野全体演習
                </button>
              </div>

              <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {sec.subsections.map((sub) => {
                  const subQCount = questions.filter((q) => q.subId === sub.id).length;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => onSelectSub(sec, sub)}
                      className="rounded-lg border border-slate-200 bg-white p-2.5 text-left transition hover:border-brand-300"
                    >
                      <div className="text-xs font-bold text-slate-800 hover:text-brand-700">
                        {sub.name}
                      </div>
                      <div className="mt-0.5 text-[10px] font-semibold text-slate-500">
                        登録数: <span className="font-bold text-brand-700">{subQCount}問</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
