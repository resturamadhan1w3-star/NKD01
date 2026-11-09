import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-950/90 border border-amber-600/50 px-3.5 py-2 text-xs font-medium text-amber-200 shadow-xl backdrop-blur-md animate-bounce">
      <WifiOff className="h-4 w-4 text-amber-400" />
      <span>Mode Offline — Menampilkan konten yang tersimpan di memori perangkat.</span>
    </div>
  );
};
