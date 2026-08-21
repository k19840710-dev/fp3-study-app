# FP3級 学習アプリ

FP（ファイナンシャル・プランニング）技能検定3級の学科試験対策クイズアプリです。
分野・単元別演習、全分野ランダム出題、間違えた問題の復習に対応しています。

## 技術スタック

- [Vite](https://vite.dev/) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- データ永続化: ブラウザの `localStorage`（クラウド同期なし。「学習分析」画面からJSONでエクスポート／インポート可能）
- テスト: [Vitest](https://vitest.dev/)

## セットアップ

```bash
npm install
npm run dev
```

## Web公開（GitHub Pages）

`main` ブランチにpushすると、`.github/workflows/deploy.yml` が自動でビルドしてGitHub Pagesに公開します。

- 公開URL: https://k19840710-dev.github.io/fp3-study-app/
- 初回のみ、リポジトリの Settings → Pages → Build and deployment → Source を「GitHub Actions」に設定してください。
- GitHub PagesをFreeプランで無料公開するにはリポジトリを Public にする必要があります（Settings → General → Danger Zone → Change visibility）。

## 問題バンクの自動拡充

問題数を手間なく増やすための自動化を組んでいます（GitHub Actionsではなく、Claude Codeのスケジュール実行によるもの）。

- **毎日自動追加**: 出題数が少ない単元を優先して、毎日15問前後を自動生成し、Pull Requestとして提案します（マージは人が判断）。
- **手動リクエスト**: アプリのホーム画面の「🔄 問題を追加リクエスト」から、タイトル・本文が入力済みのGitHub Issue作成画面が開きます。「Submit new issue」を押すだけでリクエスト完了です。1時間以内にIssueが処理され、PRが作成されて自動でクローズされます。
- 生成された問題は、実際の過去問（日本FP協会・きんざいの著作物）を複製せず、論点を参考にオリジナルの文章で作成されます。税制・法令の数値は生成のたびにWeb検索で最新情報を確認します。

## スクリプト

| コマンド               | 内容                               |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | 開発サーバーを起動                 |
| `npm run build`        | 型チェック＋本番ビルド             |
| `npm run lint`         | oxlintによる静的解析               |
| `npm run typecheck`    | TypeScriptの型チェックのみ         |
| `npm run test`         | Vitestでユニットテストを実行       |
| `npm run test:watch`   | Vitestをウォッチモードで実行       |
| `npm run format`       | Prettierでコード整形               |
| `npm run format:check` | フォーマット崩れのチェック（CI用） |
| `npm run preview`      | ビルド成果物をローカルでプレビュー |

## ディレクトリ構成

```
src/
  data/           問題バンク・分野/単元マスタ
  lib/            出題ロジック・localStorage永続化
  hooks/          学習統計の状態管理フック
  components/     共通UIコンポーネント（Header, Modal, ErrorBoundary）
  features/       画面単位のコンポーネント（home, category, setup, quiz, result, history）
  types.ts        共通の型定義
```

## 今後のロードマップ（案）

- [ ] アカウント同期（Firebase/Supabase等、永続ログインでの複数端末同期）
- [ ] AIによる問題生成（APIキーをサーバーサイドで保持する構成で再設計）
- [ ] 問題の個別編集・削除機能
- [ ] E2Eテストの追加
- [ ] PWA対応（オフライン利用）
- [ ] 問題データへの法令基準日メタ情報の付与
