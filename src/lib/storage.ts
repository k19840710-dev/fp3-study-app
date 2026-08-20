import type { UserStats } from '../types';

const STATS_KEY = 'fp3.userStats.v1';

export const EMPTY_STATS: UserStats = {
  totalAnswers: 0,
  correctAnswers: 0,
  questionStats: {},
};

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return EMPTY_STATS;
    const parsed = JSON.parse(raw);
    // 最低限の形状チェック。壊れたデータで落ちないようにする。
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof parsed.totalAnswers !== 'number' ||
      typeof parsed.correctAnswers !== 'number' ||
      typeof parsed.questionStats !== 'object'
    ) {
      return EMPTY_STATS;
    }
    return parsed as UserStats;
  } catch {
    return EMPTY_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    // 保存領域が一杯、プライベートモードなどで失敗する場合がある。
    console.error('学習データの保存に失敗しました:', err);
  }
}
