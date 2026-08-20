import { describe, expect, it } from 'vitest';
import { computeWeakSubsections, generateSmartQuestions } from './quizEngine';
import type { Question, UserStats } from '../types';

function makeQuestion(id: string, overrides: Partial<Question> = {}): Question {
  return {
    id,
    sectionId: 'life_planning',
    subId: 'keisu',
    question: `question ${id}`,
    options: ['1. a', '2. b', '3. c'],
    answer: 0,
    explanations: ['exp1', 'exp2', 'exp3'],
    ...overrides,
  };
}

function emptyStats(): UserStats {
  return { totalAnswers: 0, correctAnswers: 0, questionStats: {} };
}

describe('generateSmartQuestions', () => {
  it('returns an empty array for an empty pool', () => {
    expect(generateSmartQuestions([], 10, emptyStats())).toEqual([]);
  });

  it('never returns more questions than requested', () => {
    const pool = [makeQuestion('q1'), makeQuestion('q2'), makeQuestion('q3')];
    const result = generateSmartQuestions(pool, 2, emptyStats());
    expect(result).toHaveLength(2);
  });

  it('returns all pool questions (no more, no less) when count exceeds pool size', () => {
    const pool = [makeQuestion('q1'), makeQuestion('q2')];
    const result = generateSmartQuestions(pool, 10, emptyStats());
    expect(result).toHaveLength(2);
    expect(result.map((q) => q.id).sort()).toEqual(['q1', 'q2']);
  });

  it('never picks the same question twice within one selection', () => {
    const pool = Array.from({ length: 20 }, (_, i) => makeQuestion(`q${i}`));
    const result = generateSmartQuestions(pool, 10, emptyStats());
    const ids = result.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only returns questions that came from the given pool', () => {
    const pool = [makeQuestion('q1'), makeQuestion('q2'), makeQuestion('q3')];
    const result = generateSmartQuestions(pool, 3, emptyStats());
    const poolIds = new Set(pool.map((q) => q.id));
    for (const q of result) {
      expect(poolIds.has(q.id)).toBe(true);
    }
  });

  it('strongly favors an unanswered question over a well-mastered one', () => {
    // "mastered" は正解を重ねて重みが下がっている状態、
    // "fresh" は一度も回答したことがない状態（重みが最も高い）。
    const mastered = makeQuestion('mastered');
    const fresh = makeQuestion('fresh');
    const stats: UserStats = {
      totalAnswers: 5,
      correctAnswers: 5,
      questionStats: {
        mastered: {
          timesAnswered: 5,
          timesCorrect: 5,
          timesWrong: 0,
          lastResult: true,
          // 30分以上前なので直近ペナルティは効かない
          lastAnsweredAt: Date.now() - 1000 * 60 * 60,
        },
      },
    };

    let freshPicked = 0;
    const trials = 300;
    for (let i = 0; i < trials; i++) {
      const [picked] = generateSmartQuestions([mastered, fresh], 1, stats);
      if (picked.id === 'fresh') freshPicked++;
    }

    // 重み比はおよそ 40:2 (=20倍) なので、統計的なブレを考慮しても
    // 十分に高い割合でfreshが選ばれるはず。
    expect(freshPicked / trials).toBeGreaterThan(0.75);
  });

  it('strongly favors a recently-wrong question over a stable one', () => {
    const recentlyWrong = makeQuestion('wrong');
    const stable = makeQuestion('stable');
    const stats: UserStats = {
      totalAnswers: 10,
      correctAnswers: 8,
      questionStats: {
        wrong: {
          timesAnswered: 3,
          timesCorrect: 1,
          timesWrong: 2,
          lastResult: false,
          lastAnsweredAt: Date.now() - 1000 * 60 * 60,
        },
        stable: {
          timesAnswered: 3,
          timesCorrect: 3,
          timesWrong: 0,
          lastResult: true,
          lastAnsweredAt: Date.now() - 1000 * 60 * 60,
        },
      },
    };

    let wrongPicked = 0;
    const trials = 300;
    for (let i = 0; i < trials; i++) {
      const [picked] = generateSmartQuestions([recentlyWrong, stable], 1, stats);
      if (picked.id === 'wrong') wrongPicked++;
    }

    expect(wrongPicked / trials).toBeGreaterThan(0.75);
  });

  it('heavily suppresses a question answered within the last 30 minutes', () => {
    const justAnswered = makeQuestion('recent');
    const neverAnswered = makeQuestion('never');
    const stats: UserStats = {
      totalAnswers: 1,
      correctAnswers: 0,
      questionStats: {
        recent: {
          timesAnswered: 1,
          timesCorrect: 0,
          timesWrong: 1,
          lastResult: false,
          lastAnsweredAt: Date.now() - 1000 * 60 * 5, // 5分前
        },
      },
    };

    let recentPicked = 0;
    const trials = 300;
    for (let i = 0; i < trials; i++) {
      const [picked] = generateSmartQuestions([justAnswered, neverAnswered], 1, stats);
      if (picked.id === 'recent') recentPicked++;
    }

    // 直近30分以内の出題は重みが1/10になるため、たとえ「不正解」でも
    // 未回答の問題より選ばれにくくなるはず。
    expect(recentPicked / trials).toBeLessThan(0.25);
  });
});

describe('computeWeakSubsections', () => {
  const sections = [
    {
      id: 'sec1',
      name: 'セクション1',
      subsections: [
        { id: 'sub1', name: 'サブ1' },
        { id: 'sub2', name: 'サブ2' },
      ],
    },
  ];

  it('excludes subsections with no answered questions', () => {
    const questions = [
      makeQuestion('q1', { sectionId: 'sec1', subId: 'sub1' }),
      makeQuestion('q2', { sectionId: 'sec1', subId: 'sub2' }),
    ];
    const stats = emptyStats();
    const result = computeWeakSubsections(questions, stats, sections);
    expect(result).toEqual([]);
  });

  it('computes the correct rate per subsection and sorts ascending by rate', () => {
    const questions = [
      makeQuestion('q1', { sectionId: 'sec1', subId: 'sub1' }),
      makeQuestion('q2', { sectionId: 'sec1', subId: 'sub2' }),
    ];
    const stats: UserStats = {
      totalAnswers: 6,
      correctAnswers: 3,
      questionStats: {
        q1: {
          timesAnswered: 4,
          timesCorrect: 1,
          timesWrong: 3,
          lastResult: false,
          lastAnsweredAt: Date.now(),
        },
        q2: {
          timesAnswered: 2,
          timesCorrect: 2,
          timesWrong: 0,
          lastResult: true,
          lastAnsweredAt: Date.now(),
        },
      },
    };

    const result = computeWeakSubsections(questions, stats, sections);
    expect(result).toHaveLength(2);
    // sub1: 1/4 = 25%, sub2: 2/2 = 100% → 正答率が低い順（sub1が先頭）
    expect(result[0]).toMatchObject({ subId: 'sub1', total: 4, correct: 1, rate: 25 });
    expect(result[1]).toMatchObject({ subId: 'sub2', total: 2, correct: 2, rate: 100 });
  });
});
