import React, { useState, useEffect } from "react";
import { Language } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Apple, 
  Star, 
  Compass, 
  UserCheck, 
  BookOpen, 
  ArrowLeft, 
  Shield, 
  Terminal, 
  Cpu, 
  Package, 
  FileCode2, 
  Play,
  QrCode
} from "lucide-react";
import WaddahAvatarSymbol from "./WaddahAvatarSymbol";

interface MobilePortalProps {
  lang: Language;
}

export default function MobilePortal({ lang }: MobilePortalProps) {
  const isAr = lang === "ar";
  const [deviceType, setDeviceType] = useState<"android" | "ios">("android");
  const [guideTab, setGuideTab] = useState<"pwa" | "apk">("pwa");
  const [simulatedScreen, setSimulatedScreen] = useState<"home" | "planner" | "gradebook">("home");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  // Monitor and capture browser PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("'beforeinstallprompt' event was captured.");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if app is launched in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback alerts if prompt is unavailable inside an iframe
      alert(
        isAr
          ? "تنبيه: لتثبيت التطبيق مباشرة، يرجى فتح المنصة في علامة تبويب جديدة خارج إطار المعاينة (بواسطة متصفح الهاتف الأصلي كـ Chrome أو Safari) ثم النقر على 'تثبيت' من قائمة المتصفح."
          : "Note: To install directly, please open this app in a new tab outside the preview frame using Chrome/Safari, then click 'Install' from your browser's menu."
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="mobile-portal-tab">
      {/* Title */}
      <div className="border-b border-charcoal/15 pb-4">
        <h2 className="text-2xl font-serif font-bold text-charcoal flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-amber-gold" />
          <span>{isAr ? "تحويل التطبيق لجهاز الأندرويد والآيفون" : "Convert & Install Mobile App (Android & iOS)"}</span>
        </h2>
        <p className="text-xs text-charcoal/70 mt-1">
          {isAr
            ? "حوّل المنصة الآن إلى تطبيق هاتف متكامل ومستقل يعمل على جهازك كـ APK أو تطبيق PWA ذكي بلمح البصر."
            : "Convert the platform into a standalone mobile package or install it as an instant, smart PWA application."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Device Switcher & Interactive Phone Simulator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center space-y-4">
          
          {/* OS Switcher Tab */}
          <div className="flex border-4 border-charcoal rounded-lg overflow-hidden bg-white p-1 gap-1 shadow-[2px_2px_0px_0px_#1A1A1A]">
            <button
              onClick={() => setDeviceType("android")}
              className={`px-4 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                deviceType === "android" ? "bg-charcoal text-[#C5A021]" : "hover:bg-[#FAF8F5] text-slate-500"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android App</span>
            </button>
            <button
              onClick={() => setDeviceType("ios")}
              className={`px-4 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                deviceType === "ios" ? "bg-charcoal text-[#C5A021]" : "hover:bg-[#FAF8F5] text-slate-500"
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>iPhone App</span>
            </button>
          </div>

          {/* Interactive Mobile Device Simulator Frame */}
          <div className={`w-[290px] h-[550px] bg-white border-[6px] border-charcoal overflow-hidden relative shadow-[8px_8px_0px_0px_#1A1A1A] flex flex-col ${deviceType === "ios" ? "rounded-[40px]" : "rounded-[24px]"}`}>
            
            {/* Phone Top Notch / Camera Grille */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-charcoal rounded-b-xl z-30 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></span>
              <span className="w-10 h-1 bg-slate-900 rounded-full ml-2"></span>
            </div>

            {/* Mobile Status Bar */}
            <div className="bg-[#122846] text-white pt-6 pb-2 px-6 flex items-center justify-between text-[10px] font-mono z-20 select-none">
              <span>9:41 AM</span>
              <div className="flex items-center gap-1.5">
                <span>{deviceType === "android" ? "5G" : "LTE"}</span>
                <span className="w-4 h-2 border border-white rounded-sm inline-block relative bg-white/40">
                  <span className="absolute top-0 left-0 bottom-0 right-0.5 bg-white"></span>
                </span>
              </div>
            </div>

            {/* Simulated App Frame content */}
            <div className="flex-1 overflow-y-auto bg-[#FAF8F5] flex flex-col justify-between" dir={isAr ? "rtl" : "ltr"}>
              
              {/* App Internal Header */}
              <div className="bg-[#122846] text-white p-4 border-b border-[#C5A021]/30 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-[#C5A021] rounded flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-[#122846]" />
                  </div>
                  <span className="text-[11px] font-serif font-bold text-[#C5A021]">
                    {isAr ? "المعلم المحترف" : "The Pro Teacher"}
                  </span>
                </div>
                <span className="text-[8px] font-mono bg-[#C5A021]/20 px-1 py-0.5 rounded text-[#C5A021] uppercase font-bold">
                  {deviceType === "android" ? "APK-PWA" : "iOS-PWA"}
                </span>
              </div>

              {/* Dynamic simulated pages inside phone */}
              <div className="p-4 flex-1 space-y-4">
                
                {simulatedScreen === "home" && (
                  <div className="space-y-3 animate-fade-in">
                    {/* Welcome card */}
                    <div className="bg-white p-3 border-2 border-charcoal rounded-lg space-y-1">
                      <div className="flex items-center gap-2">
                        <WaddahAvatarSymbol className="w-7 h-7" borderColor="border-amber-gold" />
                        <div>
                          <h6 className="text-[10px] font-bold text-charcoal leading-none">الأستاذ وضاح زليل</h6>
                          <span className="text-[7px] font-mono text-slate-500">مؤسس المنصة ورئيس النشر</span>
                        </div>
                      </div>
                      <p className="text-[9px] font-serif leading-relaxed pt-1.5 border-t italic text-charcoal/80">
                        {isAr
                          ? "\"أهلاً بك يا زميلي المعلم في نسختك للجوال. أدوات هادئة تدعم حضورك الصفي والحد من تشتيت الشاشات.\""
                          : "\"Welcome to your phone layout. Tools designed to minimize screen clutter and maximize classroom presence.\""}
                      </p>
                    </div>

                    {/* Navigation shortcut simulator */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <button
                        onClick={() => setSimulatedScreen("planner")}
                        className="p-2 border-2 border-charcoal bg-white text-charcoal rounded-lg hover:bg-[#FAF8F5] text-start flex flex-col justify-between h-14 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-gold" />
                        <span className="font-bold leading-tight">{isAr ? "تحضير المناهج" : "Curriculums"}</span>
                      </button>
                      <button
                        onClick={() => setSimulatedScreen("gradebook")}
                        className="p-2 border-2 border-charcoal bg-white text-charcoal rounded-lg hover:bg-[#FAF8F5] text-start flex flex-col justify-between h-14 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-amber-gold" />
                        <span className="font-bold leading-tight">{isAr ? "سجل الدرجات" : "Gradebook"}</span>
                      </button>
                    </div>

                    {/* Screen-free warning block */}
                    <div className="p-2.5 bg-[#FAF8F5] border-2 border-dashed border-[#C5A021] text-center space-y-1 rounded-lg">
                      <p className="text-[9px] font-serif text-[#C5A021] font-bold">
                        {isAr ? "وضع التركيز وتقليل الشاشات مفعّل" : "Screen Detox Mode: Active"}
                      </p>
                      <p className="text-[7px] leading-tight text-slate-500">
                        {isAr 
                          ? "استخدم التطبيق كأداة مرجعية للدفاتر الورقية وحضور الطلاب الحسي."
                          : "Reference classroom tasks on-the-go without digital strain."}
                      </p>
                    </div>
                  </div>
                )}

                {simulatedScreen === "planner" && (
                  <div className="space-y-3 animate-fade-in">
                    <button
                      onClick={() => setSimulatedScreen("home")}
                      className="text-[9px] font-mono flex items-center gap-1 text-slate-600 hover:text-charcoal cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>{isAr ? "الرجوع للرئيسية" : "Home"}</span>
                    </button>
                    <div className="bg-white p-3 border-2 border-charcoal rounded-lg space-y-2">
                      <h5 className="text-[11px] font-serif font-bold text-charcoal border-b pb-1">
                        {isAr ? "تحضير دروس أندرويد" : "Smart Lesson Planner"}
                      </h5>
                      <div className="space-y-1 text-[9px] font-mono">
                        <p className="text-[8px] text-slate-600 leading-relaxed">
                          {isAr ? "• خطط وخطوات التدريس المنهجي لليمن والوطن العربي مباشرة في جيبك." : "• Educational curriculum roadmaps at your fingertips."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {simulatedScreen === "gradebook" && (
                  <div className="space-y-3 animate-fade-in">
                    <button
                      onClick={() => setSimulatedScreen("home")}
                      className="text-[9px] font-mono flex items-center gap-1 text-slate-600 hover:text-charcoal cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>{isAr ? "الرجوع" : "Home"}</span>
                    </button>
                    <div className="bg-white p-3 border-2 border-charcoal rounded-lg space-y-1.5">
                      <h5 className="text-[11px] font-serif font-bold text-charcoal border-b pb-1">
                        {isAr ? "سجل الدرجات والتحضير" : "Mobile Gradebook"}
                      </h5>
                      <div className="space-y-1 font-mono text-[8px]">
                        <div className="flex justify-between border-b py-1 font-bold">
                          <span>{isAr ? "اسم الطالب" : "Student"}</span>
                          <span>{isAr ? "الحالة" : "Status"}</span>
                        </div>
                        <div className="flex justify-between border-b py-1">
                          <span>{isAr ? "أحمد اليماني" : "Ahmed"}</span>
                          <span className="text-green-600 font-bold">{isAr ? "حاضر" : "Present"}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>{isAr ? "رغد يحيى" : "Raghad"}</span>
                          <span className="text-green-600 font-bold">{isAr ? "حاضر" : "Present"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* App Internal Footer inside phone */}
              <div className="bg-[#122846] text-white p-2.5 text-center text-[7px] font-mono border-t border-[#C5A021]/20">
                {isAr ? "وضاح للنشر الرقمي © 2026" : "Waddah Publishing © 2026"}
              </div>

            </div>

            {/* Hardware Home Indicator Button / Notch at bottom */}
            <div className="h-4 bg-charcoal flex items-center justify-center relative select-none">
              {deviceType === "ios" ? (
                <span className="w-24 h-1 bg-slate-700 rounded-full"></span>
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-700 bg-transparent"></span>
              )}
            </div>

          </div>
        </div>

        {/* Action and Guides Columns (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Sub-Guide Selection Tab */}
          <div className="flex border-2 border-charcoal bg-[#FAF8F5] p-1 rounded-lg gap-1">
            <button
              onClick={() => setGuideTab("pwa")}
              className={`flex-1 py-2 text-xs font-serif font-bold rounded-md transition-all cursor-pointer text-center ${
                guideTab === "pwa" ? "bg-charcoal text-white" : "text-charcoal hover:bg-charcoal/5"
              }`}
            >
              {isAr ? "تثبيت تطبيق PWA الفوري" : "Instant PWA Installer"}
            </button>
            <button
              onClick={() => setGuideTab("apk")}
              className={`flex-1 py-2 text-xs font-serif font-bold rounded-md transition-all cursor-pointer text-center ${
                guideTab === "apk" ? "bg-charcoal text-white" : "text-charcoal hover:bg-charcoal/5"
              }`}
            >
              {isAr ? "بناء ملف حزمة أندرويد APK" : "Build Native Android APK"}
            </button>
          </div>

          {guideTab === "pwa" ? (
            /* PWA INSTALLER TAB */
            <div className="paper-card p-6 bg-white space-y-6">
              <div className="border-b border-charcoal/15 pb-3">
                <h3 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
                  <Download className="w-5 h-5 text-[#C5A021]" />
                  <span>
                    {isAr 
                      ? `التثبيت التلقائي الفوري على أجهزة ${deviceType === "android" ? "أندرويد" : "آيفون"}`
                      : `Instant installation on ${deviceType === "android" ? "Android" : "iOS"}`}
                  </span>
                </h3>
                <p className="text-xs text-charcoal/60 mt-1">
                  {isAr 
                    ? "بفضل معايير الويب التقدمية الحديثة، يمكنك تحويل الموقع لبرنامج متكامل بنقرة زر دون استهلاك ذاكرة وبأعلى أداء صفي ملموس."
                    : "Using modern Web standards, you can install this application on your phone home screen immediately with full offline support."}
                </p>
              </div>

              {/* Direct Instant Action Button */}
              {deviceType === "android" && (
                <div className="bg-[#FAF8F5] p-4 border-2 border-dashed border-charcoal rounded-lg text-center space-y-3">
                  <div className="flex justify-center">
                    <Smartphone className="w-10 h-10 text-charcoal animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-charcoal">
                      {isAr ? "هل تود تثبيت التطبيق فوراً؟" : "Install 'The Pro Teacher' App?"}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-sans mt-1">
                      {isAr 
                        ? "سيعمل هذا الزر على تفعيل ميزة التثبيت التلقائي لمتصفح الأندرويد ليتواجد كأيقونة على شاشتك." 
                        : "Click below to trigger Chrome's standalone installation and launch natively."}
                    </p>
                  </div>
                  <button
                    onClick={handleInstallClick}
                    className="w-full sm:w-auto px-6 py-2.5 bg-charcoal text-[#C5A021] font-mono font-bold text-xs border-2 border-charcoal rounded-lg hover:bg-charcoal/90 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isAr ? "ثبت التطبيق على هاتفك الآن" : "INSTALL MOBILE APP NOW"}</span>
                  </button>
                </div>
              )}

              {/* Benefits checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="flex items-start gap-2 bg-[#FAF8F5] p-3 border border-charcoal/10 rounded">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-charcoal">
                    <strong>{isAr ? "ذاكرة صفرية" : "Zero Storage Cost"}:</strong> {isAr ? "مساحة تكاد لا تذكر وبسرعة تشغيل فائقة." : "Lightweight shell that opens instantly."}
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-[#FAF8F5] p-3 border border-charcoal/10 rounded">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-charcoal">
                    <strong>{isAr ? "أيقونة فاخرة" : "Premium Launcher"}:</strong> {isAr ? "أيقونة مخصصة مستوحاة من الهوية الوطنية اليمنية." : "Elegant badge showing the Yemen national flag layout."}
                  </p>
                </div>
              </div>

              {/* Steps according to OS */}
              {deviceType === "android" ? (
                <div className="space-y-4 text-xs font-sans">
                  <h4 className="font-serif font-bold text-sm text-charcoal">
                    {isAr ? "خطوات التثبيت اليدوي عبر أندرويد (Google Chrome):" : "Manual installation guide for Android (Chrome):"}
                  </h4>
                  <ol className="space-y-2 list-decimal list-inside text-slate-700 pl-2">
                    <li>{isAr ? "افتح الموقع الحالي في متصفح كروم على هاتفك." : "Open this URL in Google Chrome on your Android."}</li>
                    <li>{isAr ? "اضغط على زر الخيارات المكون من ثلاث نقاط (⋮) في الأعلى." : "Tap the three dots (⋮) menu in the top-right corner."}</li>
                    <li>{isAr ? "اضغط على خيار 'تثبيت التطبيق' (Install App) أو 'إضافة للشاشة الرئيسية'." : "Select 'Install app' or 'Add to Home screen'."}</li>
                    <li>{isAr ? "سيتم تنزيل الحزمة تلقائياً وحفظها كأيقونة على هاتفك." : "Confirm the dialog. The app is installed as a direct launcher app."}</li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-4 text-xs font-sans">
                  <h4 className="font-serif font-bold text-sm text-charcoal">
                    {isAr ? "خطوات التثبيت اليدوي عبر آيفون (Safari):" : "Manual installation guide for iPhone (Safari):"}
                  </h4>
                  <ol className="space-y-2 list-decimal list-inside text-slate-700 pl-2">
                    <li>{isAr ? "افتح الموقع عبر متصفح Safari الأصلي للآيفون." : "Launch Safari and go to this web address."}</li>
                    <li>{isAr ? "اضغط على زر المشاركة (أيقونة السهم الصاعد من المربع) في الأسفل." : "Tap the Share button (square icon with upward arrow) in the toolbar."}</li>
                    <li>{isAr ? "اسحب القائمة لأسفل ثم اضغط 'إضافة إلى الشاشة الرئيسية' (Add to Home Screen)." : "Scroll down and tap 'Add to Home Screen'."}</li>
                    <li>{isAr ? "اضغط 'إضافة' في أعلى اليسار ليتم تثبيته في شاشة جهازك." : "Tap 'Add' in the top corner. Standalone app with high fidelity is ready."}</li>
                  </ol>
                </div>
              )}
            </div>
          ) : (
            /* APK NATIVE BUILD TAB */
            <div className="paper-card p-6 bg-white space-y-6">
              <div className="border-b border-charcoal/15 pb-3">
                <h3 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-[#C5A021]" />
                  <span>{isAr ? "بناء ملف حزمة أندرويد APK مخصص" : "Generate Custom Android APK Code"}</span>
                </h3>
                <p className="text-xs text-charcoal/60 mt-1">
                  {isAr 
                    ? "إذا كنت ترغب برفع التطبيق على متجر Google Play أو الحصول على ملف .APK مستقل لتثبيته محلياً، يمكنك دمج محرك CapacitorJS مع هذا المشروع وبناء الحزمة بخطوات بسيطة."
                    : "Compile this Vite/React project directly into a native Android APK using Capacitor. Follow the precise commands below."}
                </p>
              </div>

              {/* Developer Pipeline Steps */}
              <div className="space-y-4 text-xs font-mono">
                <h4 className="font-serif font-bold text-sm text-charcoal flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-amber-gold" />
                  <span>{isAr ? "خطوات بناء الحزمة البرمجية (APK Compiler Pipeline):" : "APK Compilation Terminal Commands:"}</span>
                </h4>

                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-sans text-slate-600 font-bold">
                      {isAr ? "1. قم بتثبيت حزم كاباسيتور (Capacitor) في مجلد المشروع:" : "1. Install Capacitor core packages:"}
                    </p>
                    <div className="bg-[#1A1A1A] text-emerald-400 p-2.5 rounded border border-charcoal/30 font-mono text-[11px] select-all">
                      npm i @capacitor/core @capacitor/cli
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-sans text-slate-600 font-bold">
                      {isAr ? "2. قم بتهيئة إعدادات التطبيق ورقم الهوية الخاص به:" : "2. Initialize app configuration and pack identifier:"}
                    </p>
                    <div className="bg-[#1A1A1A] text-emerald-400 p-2.5 rounded border border-charcoal/30 font-mono text-[11px] select-all">
                      npx cap init "المعلم العربي" "com.waddah.arabteacher" --web-dir=dist
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-sans text-slate-600 font-bold">
                      {isAr ? "3. قم بتثبيت حزمة الأندرويد وإضافتها لمشروعك:" : "3. Install & add the Android build target:"}
                    </p>
                    <div className="bg-[#1A1A1A] text-emerald-400 p-2.5 rounded border border-charcoal/30 font-mono text-[11px] select-all">
                      npm i @capacitor/android && npx cap add android
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-sans text-slate-600 font-bold">
                      {isAr ? "4. قم ببناء نسخة الويب ومزامنتها بملف الأندرويد:" : "4. Compile build files and sync into Android folder:"}
                    </p>
                    <div className="bg-[#1A1A1A] text-emerald-400 p-2.5 rounded border border-charcoal/30 font-mono text-[11px] select-all">
                      npm run build && npx cap sync
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-sans text-slate-600 font-bold">
                      {isAr ? "5. افتح مشروع الأندرويد ببرنامج Android Studio لاستخراج الـ APK:" : "5. Open in Android Studio to build the signed APK:"}
                    </p>
                    <div className="bg-[#1A1A1A] text-emerald-400 p-2.5 rounded border border-charcoal/30 font-mono text-[11px] select-all">
                      npx cap open android
                    </div>
                    <p className="text-[10px] font-sans text-slate-500 italic mt-1 leading-relaxed">
                      {isAr 
                        ? "من داخل Android Studio، اختر Build > Build Bundle(s) / APK(s) > Build APK(s) للحصول على الملف الجاهز للتثبيت على أي هاتف فوراً!"
                        : "Inside Android Studio, choose Build > Build Bundle(s) / APK(s) > Build APKs to produce a highly optimized, single .apk file."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Golden/Bronze Advisory Note in Waddah's style */}
          <div className="paper-card p-5 bg-[#FAF8F5] border-2 border-charcoal text-xs space-y-2">
            <h4 className="font-serif font-bold text-charcoal flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-gold" />
              <span>{isAr ? "رؤية الأستاذ وضاح زليل حول تطبيقات الجوال" : "Waddah Al-Zulail's Vision of Mobile Tools"}</span>
            </h4>
            <p className="font-sans leading-relaxed text-slate-700 italic">
              {isAr
                ? "«إننا لا نريد من تطبيق الجوال أن يكون شاشة تشتيتٍ إضافية تسلبك وعيك بالواقع، بل أردناه دفتراً رقمياً صامتاً في جيبك؛ يخدم حضورك الإنساني، ويحدّ من ضجيج التنبيهات المربكة داخل حجرة الصف.»"
                : "«We did not design the mobile app to be another screen of distraction. We crafted it to be a silent digital notebook in your pocket—supporting your physical, mindful human connection with your students in the real world.»"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
