# FP3級 学習アプリ

FP（ファイナンシャル・プランニング）技能検定3級の学科試験対策クイズアプリです。
分野・単元別演習、全分野ランダム出題、間違えた問題の復習に対応しています。

## 技術スタック

- [Vite](https://vite.dev/) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- データ永続化: ブラウザの `localStorage`（現時点ではクラウド同期なし）

## セットアップ

```bash
npm install
npm run dev
```

## スクリプト

| コマンド               | 内容                               |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | 開発サーバーを起動                 |
| `npm run build`        | 型チェック＋本番ビルド             |
| `npm run lint`         | oxlintによる静的解析               |
| `npm run typecheck`    | TypeScriptの型チェックのみ         |
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
- [ ] E2E/ユニットテストの追加
- [ ] PWA対応（オフライン利用）
