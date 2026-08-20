import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onReset: () => void;
}

interface State {
  hasError: boolean;
}

/**
 * 画面のどこかで例外が起きても白画面のまま固まらないようにする安全網。
 * 「ホームに戻る」を押すと親から渡された onReset で状態をリセットして復帰する。
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
          <div className="text-3xl">⚠️</div>
          <h2 className="text-base font-bold text-rose-900">予期しないエラーが発生しました</h2>
          <p className="text-xs text-rose-700">
            画面の表示中に問題が発生しました。ホームに戻ってやり直してください。
          </p>
          <button
            onClick={this.handleReset}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700"
          >
            ホームに戻る
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
