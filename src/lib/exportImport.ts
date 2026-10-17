import type { UserStats } from '../types';

const EXPORT_FORMAT_VERSION = 1;

export interface ExportPayload {
  app: 'fp3-study-app';
  version: number;
  exportedAt: string;
  stats: UserStats;
}

function isValidUserStats(value: unknown): value is UserStats {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.totalAnswers === 'number' &&
    typeof v.correctAnswers === 'number' &&
    typeof v.questionStats === 'object' &&
    v.questionStats !== null
  );
}

/** エクスポート用のJSONペイロードを組み立てる（純粋関数、DOM操作なし）。 */
export function buildExportPayload(stats: UserStats): ExportPayload {
  return {
    app: 'fp3-study-app',
    version: EXPORT_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    stats,
  };
}

export function exportPayloadToJson(stats: UserStats): string {
  return JSON.stringify(buildExportPayload(stats), null, 2);
}

export type ImportResult =
  { ok: true; stats: UserStats; exportedAt: string | null } | { ok: false; error: string };

/**
 * インポートされたJSONテキストを検証する（純粋関数、DOM操作なし）。
 * 新形式（{ app, version, stats }）と、後方互換のため
 * 生の UserStats オブジェクトそのままの2パターンを受け付ける。
 */
export function parseImportPayload(jsonText: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return { ok: false, error: 'ファイルの形式が正しくありません（JSONとして読み込めません）。' };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { ok: false, error: 'ファイルの内容が想定と異なります。' };
  }

  const obj = parsed as Record<string, unknown>;

  // 新形式: { app, version, exportedAt, stats }
  if ('stats' in obj) {
    if (!isValidUserStats(obj.stats)) {
      return { ok: false, error: '学習データの形式が正しくありません。' };
    }
    const exportedAt = typeof obj.exportedAt === 'string' ? obj.exportedAt : null;
    return { ok: true, stats: obj.stats, exportedAt };
  }

  // 後方互換: 生のUserStatsオブジェクト
  if (isValidUserStats(obj)) {
    return { ok: true, stats: obj, exportedAt: null };
  }

  return { ok: false, error: '学習データの形式が正しくありません。' };
}

/** ブラウザにJSONファイルのダウンロードを開始させる（DOM操作あり、テスト対象外）。 */
export function downloadJson(filename: string, jsonText: string): void {
  const blob = new Blob([jsonText], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function exportUserStatsFile(stats: UserStats): void {
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadJson(`fp3-study-app_backup_${dateStr}.json`, exportPayloadToJson(stats));
}
