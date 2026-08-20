import { useCallback, useState } from 'react';
import type { Question, UserStats } from '../types';
import { EMPTY_STATS, loadUserStats, saveUserStats } from '../lib/storage';

export function useUserStats() {
  const [userStats, setUserStats] = useState<UserStats>(() => loadUserStats());

  const recordAnswer = useCallback((question: Question, choice: number) => {
    setUserStats((prev) => {
      const isCorrect = choice === question.answer;
      const prevStat = prev.questionStats[question.id] ?? {
        timesAnswered: 0,
        timesCorrect: 0,
        timesWrong: 0,
        lastResult: null,
        lastAnsweredAt: 0,
      };

      const next: UserStats = {
        totalAnswers: prev.totalAnswers + 1,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        questionStats: {
          ...prev.questionStats,
          [question.id]: {
            timesAnswered: prevStat.timesAnswered + 1,
            timesCorrect: isCorrect ? prevStat.timesCorrect + 1 : prevStat.timesCorrect,
            timesWrong: !isCorrect ? prevStat.timesWrong + 1 : prevStat.timesWrong,
            lastResult: isCorrect,
            lastAnsweredAt: Date.now(),
          },
        },
      };

      saveUserStats(next);
      return next;
    });
  }, []);

  const resetStats = useCallback(() => {
    setUserStats(EMPTY_STATS);
    saveUserStats(EMPTY_STATS);
  }, []);

  /** インポートなどで学習データを丸ごと置き換える。 */
  const replaceStats = useCallback((next: UserStats) => {
    setUserStats(next);
    saveUserStats(next);
  }, []);

  return { userStats, recordAnswer, resetStats, replaceStats };
}
