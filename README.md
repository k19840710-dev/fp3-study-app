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
