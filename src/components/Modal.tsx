export interface ModalConfig {
  title: string;
  message: string;
  type: 'alert' | 'confirm';
  onConfirm: () => void;
  onCancel?: () => void;
}

export function Modal({ config }: { config: ModalConfig }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 className="text-base font-bold text-slate-800">{config.title}</h3>
        <p className="whitespace-pre-line text-xs leading-relaxed text-slate-600">
          {config.message}
        </p>
        <div className="flex justify-end space-x-2 pt-2">
          {config.type === 'confirm' && (
            <button
              onClick={config.onCancel}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              キャンセル
            </button>
          )}
          <button
            onClick={config.onConfirm}
            className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-brand-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
