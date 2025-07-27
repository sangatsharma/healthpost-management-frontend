'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
}

export default function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState(false);

  useEffect(() => {
    // Initialize online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setPendingSync(true);

      // Trigger sync after coming online
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'FORCE_SYNC' });
      }

      // Hide sync indicator after 3 seconds
      setTimeout(() => setPendingSync(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setPendingSync(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't show anything if online and no pending sync
  if (isOnline && !pendingSync) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg px-3 py-2 shadow-lg transition-all duration-300',
        isOnline ? 'bg-blue-500 text-white' : 'bg-red-500 text-white',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {pendingSync ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}

        <span className="text-sm font-medium">
          {pendingSync ? 'Syncing...' : isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {!isOnline && (
        <div className="group relative">
          <button
            className="rounded p-1 transition-colors hover:bg-red-600"
            aria-label="Toggle offline details"
          >
            <AlertCircle className="h-4 w-4" />
          </button>

          <div className="absolute top-full right-0 mt-2 hidden w-64 flex-col rounded-lg border border-gray-200 bg-white p-3 text-gray-700 shadow-lg group-hover:flex">
            <h4 className="mb-2 text-sm font-semibold">Offline Mode</h4>
            <p className="mb-2 text-xs">
              You&apos;re currently offline. Your changes will be saved locally
              and synced when you reconnect.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

//  const getCacheSize = async () => {
//     try {
//       if ("storage" in navigator && "estimate" in navigator.storage) {
//         const estimate = await navigator.storage.estimate()
//         setCacheSize(estimate.usage || 0)
//       }
//     } catch (error) {
//       console.error("Failed to get cache size:", error)
//     }
//   }

//   const clearCache = async () => {
//     try {
//       const persistenceManager = new DataPersistenceManager(queryClient)
//       await persistenceManager.init()
//       await persistenceManager.clearAllData()
//       queryClient.clear()
//       setCacheSize(0)
//     } catch (error) {
//       console.error("Failed to clear cache:", error)
//     }
//   }

//   const formatBytes = (bytes: number) => {
//     if (bytes === 0) return "0 Bytes"
//     const k = 1024
//     const sizes = ["Bytes", "KB", "MB", "GB"]
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//   }
