import React, { useEffect, useState } from 'react';

type ToastMessage = { id: number; message: string; type?: 'success' | 'error' | 'info' };

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { message: string; type?: ToastMessage['type'] };
      const id = Date.now();
      setToasts(t => [...t, { id, message: detail.message, type: detail.type }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
    };
    window.addEventListener('secureshield:toast', handler as EventListener);
    return () => window.removeEventListener('secureshield:toast', handler as EventListener);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 space-y-3">
      {toasts.map(t => (
        <div key={t.id} className={`max-w-xs px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white transition-all ${
          t.type === 'error' ? 'bg-red-600' : t.type === 'info' ? 'bg-indigo-600' : 'bg-green-600'
        }`}>
          {t.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
