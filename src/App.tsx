import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Modal, type ModalConfig } from './components/Modal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HomeView } from './features/home/HomeView';
import { CategorySelectView } from './features/category/CategorySelectView';
import { CountSelectView } from './features/setup/CountSelectView';
import { QuizView } from './features/quiz/QuizView';
import { ResultView } from './features/result/ResultView';
import { HistoryView } from './features/history/HistoryView';
import { INITIAL_QUESTION_BANK } from './data/questions';
import { SECTIONS } from './data/sections';
import { computeWeakSubsections, generateSmartQuestions } from './lib/quizEngine';
import { exportUserStatsFile, parseImportPayload } from './lib/exportImport';
import { useUserStats } from './hooks/useUserStats';
import type {
  Question,
  QuizSessionResult,
  ReviewFilter,
  Section,
  Subsection,
  ViewName,
} from './types';

type Selection =
  | { kind: 'random' }
  | { kind: 'review' }
  | { kind: 'section'; section: Section }
  | { kind: 'sub'; section: Section; sub: Subsection };

const QUESTIONS = INITIAL_QUESTION_BANK;

function App() {
  const [view, setView] = useState<ViewName>('home');
  const [selection, setSelection] = useState<Selection>({ kind: 'random' });
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');
  const [questionCount, setQuestionCount] = useState(10);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [quizSessionResults, setQuizSessionResults] = useState<QuizSessionResult[]>([]);

  const { userStats, recordAnswer, resetStats, replaceStats } = useUserStats();

  const weakSubsections = useMemo(
    () => computeWeakSubsections(QUESTIONS, userStats, SECTIONS),
    [userStats],
  );

  const overallRate =
    userStats.totalAnswers > 0
      ? Math.round((userStats.correctAnswers / userStats.totalAnswers) * 100)
      : 0;

  const showAlert = (message: string, title = 'お知らせ') => {
    setModalConfig({ title, message, type: 'alert', onConfirm: () => setModalConfig(null) });
  };

  const showConfirm = (message: string, onConfirm: () => void, title = '確認') => {
    setModalConfig({
      title,
      message,
      type: 'confirm',
      onConfirm: () => {
        setModalConfig(null);
        onConfirm();
      },
      onCancel: () => setModalConfig(null),
    });
  };

  const goHome = () => setView('home');

  const startCountSelect = (sel: Selection) => {
    setSelection(sel);
    setView('select_count');
  };

  const handleStartQuiz = () => {
    let candidatePool: Question[];

    if (selection.kind === 'review') {
      candidatePool = QUESTIONS.filter((q) => {
        const stat = userStats.questionStats[q.id];
        if (!stat) return false;
        if (reviewFilter === 'weak')
          return stat.timesWrong > stat.timesCorrect || stat.lastResult === false;
        if (reviewFilter === 'recent') return stat.lastResult === false;
        return stat.timesWrong > 0;
      });
    } else if (selection.kind === 'sub') {
      candidatePool = QUESTIONS.filter((q) => q.subId === selection.sub.id);
    } else if (selection.kind === 'section') {
      candidatePool = QUESTIONS.filter((q) => q.sectionId === selection.section.id);
    } else {
      candidatePool = QUESTIONS;
    }

    if (candidatePool.length === 0) {
      showAlert('該当する問題がありません。');
      return;
    }

    const selected = generateSmartQuestions(candidatePool, questionCount, userStats);
    setCurrentQuestions(selected);
    setQuizSessionResults([]);
    setView('quiz');
  };

  const handleAnswer = (question: Question, choice: number) => {
    recordAnswer(question, choice);
    setQuizSessionResults((prev) => [
      ...prev,
      { qId: question.id, isCorrect: choice === question.answer, userChoice: choice },
    ]);
  };

  const handleResetData = () => {
    showConfirm('学習データを初期化しますか？', () => {
      resetStats();
      showAlert('初期化が完了しました。');
    });
  };

  const handleExportData = () => {
    exportUserStatsFile(userStats);
  };

  const handleImportFile = async (file: File) => {
    const text = await file.text();
    const result = parseImportPayload(text);

    if (!result.ok) {
      showAlert(result.error, 'インポートエラー');
      return;
    }

    const { stats, exportedAt } = result;
    const dateLabel = exportedAt ? new Date(exportedAt).toLocaleString('ja-JP') : '不明';
    showConfirm(
      `書き出し日時: ${dateLabel}\n総回答数: ${stats.totalAnswers}件\n\nこの内容で現在の学習データを上書きします。よろしいですか？`,
      () => {
        replaceStats(stats);
        showAlert('学習データをインポートしました。');
      },
      'データのインポート',
    );
  };

  const selectionLabel = (() => {
    if (selection.kind === 'review') return '【弱点・復習モード】';
    if (selection.kind === 'sub') return `${selection.section.name} → ${selection.sub.name}`;
    if (selection.kind === 'section') return `${selection.section.name}（全単元）`;
    return '【全分野ランダム演習】';
  })();

  const selectionLabelClass =
    selection.kind === 'review'
      ? 'text-rose-600'
      : selection.kind === 'random'
        ? 'text-emerald-600'
        : 'text-brand-700';

  return (
    <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-between p-4 md:p-6">
      <Header view={view} totalQuestions={QUESTIONS.length} onNavigate={setView} />

      <main className="flex-grow">
        <ErrorBoundary onReset={goHome}>
          {view === 'home' && (
            <HomeView
              totalAnswers={userStats.totalAnswers}
              correctAnswers={userStats.correctAnswers}
              overallRate={overallRate}
              totalQuestions={QUESTIONS.length}
              weakSubsections={weakSubsections}
              onGoToCategory={() => setView('select_category')}
              onGoToRandom={() => startCountSelect({ kind: 'random' })}
              onGoToReview={() => startCountSelect({ kind: 'review' })}
              onGoToWeakSubsection={(s) => {
                const section = SECTIONS.find((sec) => sec.name === s.sectionName);
                const sub = section?.subsections.find((item) => item.id === s.subId);
                if (section && sub) {
                  startCountSelect({ kind: 'sub', section, sub });
                }
              }}
            />
          )}

          {view === 'select_category' && (
            <CategorySelectView
              questions={QUESTIONS}
              onSelectSection={(section) => startCountSelect({ kind: 'section', section })}
              onSelectSub={(section, sub) => startCountSelect({ kind: 'sub', section, sub })}
              onCancel={goHome}
            />
          )}

          {view === 'select_count' && (
            <CountSelectView
              label={selectionLabel}
              labelClassName={selectionLabelClass}
              isReview={selection.kind === 'review'}
              reviewFilter={reviewFilter}
              onReviewFilterChange={setReviewFilter}
              questionCount={questionCount}
              onQuestionCountChange={setQuestionCount}
              onBack={goHome}
              onStart={handleStartQuiz}
            />
          )}

          {view === 'quiz' && currentQuestions.length > 0 && (
            <QuizView
              questions={currentQuestions}
              onAnswer={handleAnswer}
              onFinish={() => setView('result')}
            />
          )}

          {view === 'result' && (
            <ResultView results={quizSessionResults} onHome={goHome} onRetry={handleStartQuiz} />
          )}

          {view === 'history' && (
            <HistoryView
              questions={QUESTIONS}
              userStats={userStats}
              onReset={handleResetData}
              onExport={handleExportData}
              onImportFile={handleImportFile}
            />
          )}
        </ErrorBoundary>
      </main>

      {modalConfig && <Modal config={modalConfig} />}

      <footer className="mt-8 flex items-center justify-between border-t border-slate-200 px-2 py-4 text-center text-xs text-slate-400">
        <p>FP3級 学習アプリ</p>
        <button
          onClick={handleResetData}
          className="text-[11px] text-slate-400 underline hover:text-rose-500"
        >
          全データを初期化
        </button>
      </footer>
    </div>
  );
}

export default App;
