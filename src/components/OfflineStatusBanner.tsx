import React, { useState, useEffect } from "react";
import { WifiOff, Download, CheckCircle2, RefreshCw, Smartphone, Database } from "lucide-react";
import { getOfflineResources, syncOfflineResourcesWithServer } from "../utils/offlineStorage";

interface OfflineStatusBannerProps {
  lang?: string;
}

export default function OfflineStatusBanner({ lang = "ar" }: OfflineStatusBannerProps) {
  const isAr = lang === "ar";
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [offlineCount, setOfflineCount] = useState(0);
  const [syncedMessage, setSyncedMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    setOfflineCount(getOfflineResources().length);

    const handleOnline = async () => {
      setIsOnline(true);
      const count = await syncOfflineResourcesWithServer();
      if (count > 0) {
        setSyncedMessage(isAr ? `تمت مزامنة ${count} عنصر بنجاح مع الخادم!` : `Successfully synced ${count} items!`);
        setTimeout(() => setSyncedMessage(null), 4000);
      }
      setOfflineCount(getOfflineResources().length);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOfflineCount(getOfflineResources().length);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // PWA BeforeInstallPrompt Event Listener
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if app is already running in standalone/installed mode
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [isAr]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert(
        isAr
          ? "لتثبيت التطبيق على أجهزة iOS/Android: اضغط خيارات المتصفح (مشاركة/Share) ثم اختار 'إضافة إلى الشاشة الرئيسية'."
          : "To install on iOS/Android: Tap browser options and select 'Add to Home Screen'."
      );
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="dir-rtl font-sans space-y-2">
      {/* Synced Notification Banner */}
      {syncedMessage && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 flex-shrink-0" />
          <span className="font-bold font-serif">{syncedMessage}</span>
        </div>
      )}

      {/* Offline Status Alert */}
      {!isOnline && (
        <div className="bg-amber-600 text-white px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-200" />
            <span className="font-bold font-serif">
              {isAr
                ? "أنت الآن تتصفح المنصة في وضع عدم الاتصال بالإنترنت (Offline Mode)."
                : "You are browsing in Offline Mode."}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono flex items-center gap-1">
              <Database className="w-3 h-3" />
              <span>{isAr ? `${offlineCount} عنصر محفوظ محلياً` : `${offlineCount} items cached`}</span>
            </span>
            <button
              onClick={() => window.location.reload()}
              className="p-1 hover:bg-white/10 rounded cursor-pointer"
              title="إعادة التحديث"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* PWA Mobile Install Banner (If prompt available & not installed) */}
      {deferredPrompt && !isInstalled && (
        <div className="bg-[#1A365D] text-white p-3 rounded-xl border border-[#C5A021]/40 shadow-md flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#C5A021] text-[#1A365D] rounded-lg flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <p className="font-serif font-bold text-amber-300">
                {isAr ? "تثبيت تطبيق المعلم العربي على الهاتف" : "Install Arab Teacher App"}
              </p>
              <p className="text-[10px] text-slate-300">
                {isAr ? "وصول سريع من الشاشة الرئيسية بدون إنترنت" : "Fast access from home screen offline"}
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-[#C5A021] hover:bg-amber-400 text-[#1A365D] font-mono font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isAr ? "تثبيت الآن" : "Install"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
