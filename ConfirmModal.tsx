import React from 'react';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDangerous = false
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in scale-95 duration-200">
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-gray-300 text-sm leading-relaxed">{message}</p>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium text-sm transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                isDangerous
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
