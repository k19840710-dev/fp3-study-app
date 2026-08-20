import { useState } from 'react';
import { SECTIONS } from '../../data/sections';
import type { Question } from '../../types';

export function QuizView({
  questions,
  onFinish,
  onAnswer,
}: {
  questions: Question[];
  onFinish: () => void;
  onAnswer: (question: Question, choice: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQ = questions[currentIndex];
  const sectionName = SECTIONS.find((s) => s.id === currentQ.sectionId)?.name ?? '';

  const handleSubmit = (choice: number) => {
    if (isSubmitted) return;
    setSelectedAnswer(choice);
    setIsSubmitted(true);
    onAnswer(currentQ, choice);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      onFinish();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="rounded-md bg-brand-50 px-2.5 py-1 font-bold text-brand-700">
            {sectionName}
          </span>
          <span className="font-bold text-slate-600">
            問題 <span className="text-base text-brand-600">{currentIndex + 1}</span> /{' '}
            {questions.length}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-brand-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            QUESTION
          </span>
          <h3 className="text-base font-bold leading-relaxed text-slate-800 md:text-lg">
            {currentQ.question}
          </h3>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let btnStyle =
              'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/50 text-slate-700';

            if (isSubmitted) {
              if (idx === currentQ.answer) {
                btnStyle =
                  'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-400';
              } else if (idx === selectedAnswer) {
                btnStyle = 'border-rose-400 bg-rose-50 text-rose-900 line-through opacity-80';
              } else {
                btnStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleSubmit(idx)}
                className={`w-full rounded-xl border-2 p-4 text-left text-sm leading-relaxed transition-all duration-150 md:text-base ${btnStyle}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="animate-fadeIn space-y-4 border-t border-slate-100 pt-4">
            <div
              className={`flex items-center space-x-3 rounded-xl p-4 ${
                selectedAnswer === currentQ.answer
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'bg-rose-100 text-rose-900'
              }`}
            >
              <span className="text-2xl">{selectedAnswer === currentQ.answer ? '⭕' : '❌'}</span>
              <div>
                <div className="text-base font-bold">
                  {selectedAnswer === currentQ.answer ? '正解です！' : '不正解です'}
                </div>
                <p className="mt-0.5 text-xs opacity-90">正解：選択肢 {currentQ.answer + 1}</p>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-800">
                <span>💡</span>
                <span>各選択肢の詳細解説</span>
              </div>
              <div className="space-y-2 text-xs leading-relaxed text-slate-700 md:text-sm">
                {currentQ.explanations.map((exp, eIdx) => (
                  <p
                    key={eIdx}
                    className={`rounded-lg border p-2.5 ${
                      eIdx === currentQ.answer
                        ? 'border-emerald-200 bg-emerald-50 font-medium'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    {exp}
                  </p>
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-brand-600 py-4 text-sm font-bold text-white shadow-md transition hover:bg-brand-700 md:text-base"
            >
              <span>{currentIndex + 1 < questions.length ? '次の問題へ' : '結果を確認する'}</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
