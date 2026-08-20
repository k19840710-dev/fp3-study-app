import type { Question, UserStats } from '../types';

/**
 * 過去の正誤履歴に基づいて出題候補に重み付けする。
 * - 未回答の問題を優先
 * - 直近で間違えた問題を優先
 * - 直近30分以内に出題した問題は出にくくする（連続する同じ問題を避ける）
 */
export function generateSmartQuestions(
  pool: Question[],
  count: number,
  userStats: UserStats,
): Question[] {
  if (!pool || pool.length === 0) return [];
  const now = Date.now();

  const weighted = pool.map((q) => {
    const stat = userStats.questionStats[q.id];
    let weight = 10;

    if (!stat || stat.timesAnswered === 0) {
      weight += 30;
    } else {
      if (stat.lastResult === false) weight += 35;
      if (stat.timesWrong > stat.timesCorrect) weight += 20;
      if (stat.timesCorrect > 0) weight -= Math.min(8, stat.timesCorrect * 2);
    }

    if (stat?.lastAnsweredAt && now - stat.lastAnsweredAt < 1000 * 60 * 30) {
      weight *= 0.1;
    }

    return { question: q, weight: Math.max(0.1, weight) };
  });

  const selected: Question[] = [];
  const poolCopy = [...weighted];
  const targetCount = Math.min(count, poolCopy.length);

  while (selected.length < targetCount && poolCopy.length > 0) {
    const totalWeight = poolCopy.reduce((sum, item) => sum + item.weight, 0);
    const rand = Math.random() * totalWeight;
    let accumulated = 0;
    let chosenIndex = 0;

    for (let i = 0; i < poolCopy.length; i++) {
      accumulated += poolCopy[i].weight;
      if (rand <= accumulated) {
        chosenIndex = i;
        break;
      }
    }

    selected.push(poolCopy[chosenIndex].question);
    poolCopy.splice(chosenIndex, 1);
  }

  return selected;
}

export interface SubsectionAnalytics {
  subId: string;
  subName: string;
  sectionName: string;
  total: number;
  correct: number;
  rate: number;
}

export function computeWeakSubsections(
  questions: Question[],
  userStats: UserStats,
  sections: { id: string; name: string; subsections: { id: string; name: string }[] }[],
): SubsectionAnalytics[] {
  const result: SubsectionAnalytics[] = [];

  for (const sec of sections) {
    for (const sub of sec.subsections) {
      const qList = questions.filter((q) => q.subId === sub.id);
      let total = 0;
      let correct = 0;
      for (const q of qList) {
        const stat = userStats.questionStats[q.id];
        if (stat) {
          total += stat.timesAnswered;
          correct += stat.timesCorrect;
        }
      }
      if (total > 0) {
        result.push({
          subId: sub.id,
          subName: sub.name,
          sectionName: sec.name,
          total,
          correct,
          rate: Math.round((correct / total) * 100),
        });
      }
    }
  }

  return result.sort((a, b) => a.rate - b.rate);
}
