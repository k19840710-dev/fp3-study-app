import { beforeEach, describe, expect, it } from 'vitest';
import { EMPTY_STATS, loadUserStats, saveUserStats } from './storage';
import type { UserStats } from '../types';

const STORAGE_KEY = 'fp3.userStats.v1';

beforeEach(() => {
  localStorage.clear();
});

describe('loadUserStats', () => {
  it('returns EMPTY_STATS when nothing is stored', () => {
    expect(loadUserStats()).toEqual(EMPTY_STATS);
  });

  it('returns EMPTY_STATS when the stored value is not valid JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(loadUserStats()).toEqual(EMPTY_STATS);
  });

  it('returns EMPTY_STATS when the stored value has the wrong shape', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 'bar' }));
    expect(loadUserStats()).toEqual(EMPTY_STATS);
  });

  it('returns EMPTY_STATS when questionStats is missing', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ totalAnswers: 3, correctAnswers: 2 }));
    expect(loadUserStats()).toEqual(EMPTY_STATS);
  });
});

describe('saveUserStats / loadUserStats round-trip', () => {
  it('persists and reloads a valid UserStats object', () => {
    const stats: UserStats = {
      totalAnswers: 5,
      correctAnswers: 3,
      questionStats: {
        q1: {
          timesAnswered: 5,
          timesCorrect: 3,
          timesWrong: 2,
          lastResult: true,
          lastAnsweredAt: 1234567890,
        },
      },
    };

    saveUserStats(stats);
    expect(loadUserStats()).toEqual(stats);
  });
});
