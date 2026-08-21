const REPO = 'k19840710-dev/fp3-study-app';

// この文字列で始まるIssueだけを「問題追加リクエスト」として扱う（ポーリング側の目印）。
export const REQUEST_ISSUE_TITLE_PREFIX = '[問題追加リクエスト]';

/**
 * GitHubの「新規Issue作成」画面をタイトル・本文入力済みで開くためのURLを組み立てる。
 * ユーザーは開いた画面で「Submit new issue」を押すだけでよい。
 */
export function buildRequestIssueUrl(): string {
  const title = `${REQUEST_ISSUE_TITLE_PREFIX} ${new Date().toISOString().slice(0, 10)}`;
  const body = [
    '特定の分野・単元を優先してほしい場合はここに書いてください（空欄のままでもOKです）。',
    '',
    '例: 「相続税の計算をもっと増やして」「NISA関連を重点的に」など',
  ].join('\n');

  const params = new URLSearchParams({ title, body });
  return `https://github.com/${REPO}/issues/new?${params.toString()}`;
}
