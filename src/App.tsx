import React, { useState } from "react";
import { Language } from "./types";
import { motion, AnimatePresence } from "motion/react";
import WaddahAvatarSymbol from "./components/WaddahAvatarSymbol";
import {
  BookOpen,
  Calendar,
  Compass,
  FileText,
  Globe,
  Heart,
  Mail,
  UserCheck,
  Award,
  Sparkles,
  Info,
  ExternalLink,
  Users,
  Layers,
  Presentation,
  CheckCircle,
  Headphones,
  Smartphone,
} from "lucide-react";

// Modular Imports
import Gradebook from "./components/Gradebook";
import LessonPlanner from "./components/LessonPlanner";
import DocumentSummarizer from "./components/DocumentSummarizer";
import ParentMessageTab from "./components/ParentMessageTab";
import CurriculumGuide from "./components/CurriculumGuide";
import AboutWaddah from "./components/AboutWaddah";
import VoiceAssistant from "./components/VoiceAssistant";
import MobilePortal from "./components/MobilePortal";

export default function App() {
  const [lang, setLang] = useState<Language>("ar");
  const [activeTab, setActiveTab] = useState<
    "planner" | "gradebook" | "summarizer" | "parent" | "curriculum" | "voice" | "mobile" | "about"
  >("planner");

  const isAr = lang === "ar";

  const handleLanguageToggle = () => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  };

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-[#1A365D] flex flex-col md:flex-row selection:bg-[#C5A021] selection:text-white"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* 1. PROFESSIONAL ACADEMIC SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#1A365D] text-white flex flex-col border-e border-[#C5A021]/30 flex-shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#C5A021]/20 flex items-center gap-3 bg-[#122846]">
          <div className="w-10 h-10 bg-[#C5A021] rounded-lg flex items-center justify-center shadow-md shadow-[#122846]/50">
            <Award className="w-6 h-6 text-[#1A365D]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-serif font-bold tracking-tight text-[#C5A021]">
              {isAr ? "المعلم المحترف" : "The Pro Teacher"}
            </span>
            <span className="text-[9px] font-mono tracking-wider text-white/50 uppercase">
              {isAr ? "وضاح للنشر الرقمي" : "Waddah Publishing"}
            </span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1.5">
          <p className="text-[10px] font-mono text-white/40 px-3 pb-2 uppercase tracking-widest">
            {isAr ? "أدوات التدريس والمتابعة" : "Pedagogical Core"}
          </p>

          {/* Tab buttons */}
          <button
            onClick={() => setActiveTab("planner")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
              activeTab === "planner"
                ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span>{isAr ? "تحضير الدروس وPPTX" : "Lesson Planner & PPTX"}</span>
          </button>

          <button
            onClick={() => setActiveTab("gradebook")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
              activeTab === "gradebook"
                ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <UserCheck className="w-4 h-4 flex-shrink-0" />
            <span>{isAr ? "سجل درجات الطلاب" : "Gradebook Engine"}</span>
          </button>

          <button
            onClick={() => setActiveTab("summarizer")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
              activeTab === "summarizer"
                ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span>{isAr ? "البحث والتلخيص الذكي" : "Book Summarizer"}</span>
          </button>

          <button
            onClick={() => setActiveTab("parent")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
              activeTab === "parent"
                ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span>{isAr ? "مراسلة أولياء الأمور" : "Parent Messages"}</span>
          </button>

          <button
            onClick={() => setActiveTab("curriculum")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
              activeTab === "curriculum"
                ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Compass className="w-4 h-4 flex-shrink-0" />
            <span>{isAr ? "مواءمة المناهج واليمن" : "Curriculum Help"}</span>
          </button>

          <button
            onClick={() => setActiveTab("voice")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
              activeTab === "voice"
                ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Headphones className="w-4 h-4 flex-shrink-0" />
            <span>{isAr ? "مساعد المعلم الصوتي" : "Teacher Voice Assistant"}</span>
          </button>

          <button
            onClick={() => setActiveTab("mobile")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
              activeTab === "mobile"
                ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Smartphone className="w-4 h-4 flex-shrink-0" />
            <span>{isAr ? "تطبيق أندرويد وآيفون" : "Mobile App Portal"}</span>
          </button>

          <p className="text-[10px] font-mono text-white/40 px-3 pt-4 pb-2 uppercase tracking-widest">
            {isAr ? "المؤسس والرؤية" : "FOUNDER & PHILOSOPHY"}
          </p>

          <button
            onClick={() => setActiveTab("about")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
              activeTab === "about"
                ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>{isAr ? "فلسفة وضاح الزليل" : "Philosophy & Bio"}</span>
          </button>
        </nav>

        {/* Profile Card at bottom of Sidebar */}
        <div className="p-4 border-t border-[#C5A021]/20 bg-[#122846] text-xs font-mono">
          <div className="flex items-center gap-3 mb-3">
            <WaddahAvatarSymbol className="w-10 h-10" />
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate text-[#C5A021] font-serif">
                {isAr ? "أ. وضاح الزليل" : "Waddah Al-Zulil"}
              </p>
              <p className="text-[10px] text-slate-400 truncate uppercase tracking-tight">
                {isAr ? "وضاح للنشر الرقمي" : "Waddah Pub © 2026"}
              </p>
            </div>
          </div>
          <p className="text-[9px] leading-relaxed text-slate-400/90 text-center border-t border-slate-700/50 pt-3 italic">
            {isAr
              ? "العودة للحضور الملموس والواقعية في التربية والتدريس"
              : "Return to real tangible presence in education"}
          </p>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Ticker - Editorial Notice */}
        <div className="bg-[#122846] text-slate-100 text-[11px] py-2 px-6 border-b border-[#C5A021]/20 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C5A021] animate-pulse"></span>
            <span className="text-[#C5A021] font-bold">
              {isAr ? "مبادرة التعليم الهادئ:" : "Mindful Pedagogy Initiative:"}
            </span>
            <span className="text-slate-300">
              {isAr
                ? "بادر بتبني الديتوكس الرقمي والحد من الأجهزة داخل صفك الدراسي اليوم."
                : "Implement home-school digital detox for deep and focused reading."}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span>{isAr ? "الملكية الفكرية: وضاح أحمد الزليل" : "Proprietorship: Waddah Al-Zulil"}</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">2026</span>
          </div>
        </div>

        {/* Workspace Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-5 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#C5A021]" />
              <span className="font-mono text-[10px] font-bold text-[#C5A021] bg-[#C5A021]/10 px-2 py-0.5 rounded border border-[#C5A021]/20">
                {isAr ? "بوابة المعلم العربي المحترف • وضاح للنشر" : "Professional Arab Teacher Portal"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1A365D] tracking-tight">
              {isAr ? "المعلم العربي المحترف" : "The Professional Arab Teacher"}
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl font-serif">
              {isAr
                ? "أدوات متكاملة متوافقة مع توجيهات وزارة التربية ومبادئ وضاح الزليل لتبسيط المناهج والتحضير الفعّال."
                : "Advanced AI curriculum planner, book summarizer, and offline gradebook designed for elite educators."}
            </p>
          </div>

          {/* Action Row & Language Switcher */}
          <div className="flex items-center gap-3 self-start md:self-center">
            <button
              onClick={handleLanguageToggle}
              className="paper-btn px-3 py-1.5 flex items-center gap-1.5 font-mono text-xs cursor-pointer shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-[#C5A021]" />
              <span>{isAr ? "English Edition" : "النسخة العربية"}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Metric Statistics Grid (Extracted from Polish Theme) */}
        <section className="px-6 pt-6 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-24 hover:border-[#C5A021]/30 transition-colors">
            <p className="text-[11px] font-mono font-bold text-slate-500">
              {isAr ? "إجمالي الطلاب بالمنصة" : "Active Students Registered"}
            </p>
            <h3 className="text-2xl font-serif font-bold text-[#1A365D]">142</h3>
            <div className="text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded self-start">
              {isAr ? "نمو +12% هذا الشهر" : "+12% growth"}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-24 hover:border-[#C5A021]/30 transition-colors">
            <p className="text-[11px] font-mono font-bold text-slate-500">
              {isAr ? "الدروس وخطط التحضير" : "Lessons Generated"}
            </p>
            <h3 className="text-2xl font-serif font-bold text-[#1A365D]">48</h3>
            <div className="text-[9px] font-mono text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded self-start">
              {isAr ? "توفير 15 ساعة عمل" : "Saved 15 hours"}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-24 hover:border-[#C5A021]/30 transition-colors">
            <p className="text-[11px] font-mono font-bold text-slate-500">
              {isAr ? "عروض PPTX والشرائح" : "Completed PPTX Slides"}
            </p>
            <h3 className="text-2xl font-serif font-bold text-[#1A365D]">12</h3>
            <div className="text-[9px] font-mono text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded self-start">
              {isAr ? "جاهزة للاستعمال الصفي" : "Ready for use"}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-24 hover:border-[#C5A021]/30 transition-colors">
            <p className="text-[11px] font-mono font-bold text-slate-500">
              {isAr ? "التركيز وتجنب الشاشات" : "Sensory Focus Score"}
            </p>
            <h3 className="text-2xl font-serif font-bold text-[#1A365D]">88%</h3>
            <div className="text-[9px] font-mono text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded self-start">
              {isAr ? "الحد من الهواتف نشط" : "High screen-free score"}
            </div>
          </div>
        </section>

        {/* Main Component Render Tab Slot */}
        <main className="flex-1 px-6 py-6 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + "_" + lang}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "planner" && <LessonPlanner lang={lang} />}
              {activeTab === "gradebook" && <Gradebook lang={lang} />}
              {activeTab === "summarizer" && <DocumentSummarizer lang={lang} />}
              {activeTab === "parent" && <ParentMessageTab lang={lang} />}
              {activeTab === "curriculum" && <CurriculumGuide lang={lang} />}
              {activeTab === "voice" && <VoiceAssistant lang={lang} />}
              {activeTab === "mobile" && <MobilePortal lang={lang} />}
              {activeTab === "about" && <AboutWaddah lang={lang} />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Premium Professional Publishing Footer */}
        <footer className="bg-[#122846] text-slate-100 border-t border-[#C5A021]/30 py-10 px-6 md:px-8 mt-auto">
          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
            {/* Column 1: Editorial Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C5A021]" />
                <h3 className="text-base font-serif font-bold text-[#C5A021]">
                  {isAr ? "وضاح للنشر الرقمي" : "Waddah Digital Publishing"}
                </h3>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                {isAr
                  ? "دار نشر رائدة تسعى لإعادة التوازن المعرفي من خلال تمكين المعلمين، وصناعة مناهج دراسية متوازنة تشجع القراءة العميقة والحد من ضوضاء الأجهزة."
                  : "A premier regional publishing institution dedicated to teacher empowerment and promoting unplugged educational strategies."}
              </p>
              <p className="text-[10px] font-mono text-[#C5A021] bg-[#C5A021]/10 py-1 px-2.5 rounded border border-[#C5A021]/20 inline-block">
                {isAr
                  ? "تأسيس وملكية: وضاح أحمد حسن الزليل"
                  : "Founder & Proprietor: Waddah Ahmed Hassan Al-Zulil"}
              </p>
            </div>

            {/* Column 2: Educational Detox Guidance */}
            <div className="space-y-3 border-t md:border-t-0 md:border-x border-slate-700/50 md:px-8 pt-5 md:pt-0">
              <h4 className="font-serif font-bold text-sm text-[#C5A021] flex items-center gap-2">
                <Heart className="w-4 h-4 fill-[#C5A021] text-[#C5A021]" />
                <span>{isAr ? "مبادئ المعلم الرقمي الهادئ" : "The Mindful Educator's Manifesto"}</span>
              </h4>
              <ul className="space-y-2 text-slate-300 font-serif">
                {isAr ? (
                  <>
                    <li>• تفضيل الدفاتر الورقية والأنشطة اليدوية داخل الصف.</li>
                    <li>• تشجيع الطلاب على القراءة من كتب مطبوعة للتركيز الكامل.</li>
                    <li>• شراكة حقيقية مع أولياء الأمور للسيطرة على تشتت الشاشات.</li>
                  </>
                ) : (
                  <>
                    <li>• Prioritizing physical tasks, real paper books, and writing tools.</li>
                    <li>• Nurturing student reading habits without digital interruptions.</li>
                    <li>• Aligning with families for a healthier home-screen balance.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Column 3: Contact & Legal Status */}
            <div className="space-y-3 pt-5 md:pt-0">
              <h4 className="font-serif font-bold text-sm text-[#C5A021]">
                {isAr ? "الملكية الفكرية ورخص الاستخدام" : "Licensing & Support"}
              </h4>
              <div className="space-y-1.5 text-slate-400">
                <p className="leading-relaxed">
                  {isAr
                    ? "جميع الحقوق الفكرية والملكية محفوظة © 2026 للأستاذ وضاح أحمد حسن الزليل."
                    : "All intellectual rights reserved © 2026 under Waddah Ahmed Hassan Al-Zulil."}
                </p>
                <p className="text-[10px] font-mono text-slate-500">
                  {isAr
                    ? "مسجل رسمياً لدعم التطوير البيداغوجي والديتوكس الرقمي."
                    : "Official platform supporting academic excellence & screen wellness."}
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[9px] bg-[#C5A021]/20 text-[#C5A021] px-2 py-0.5 rounded border border-[#C5A021]/30">
                    {isAr ? "البريد الإلكتروني" : "Contact Mail"}
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono">alhjwrywdah86@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer bottom Copyright tag */}
          <div className="max-w-7xl w-full mx-auto border-t border-slate-800 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-500">
            <div>
              © 2026 {isAr ? "المعلم العربي المحترف" : "Arab Professional Teacher"} | {isAr ? "وضاح للنشر الرقمي" : "Waddah Digital Publishing"}
            </div>
            <div className="flex items-center gap-2">
              <span>{isAr ? "الجمهورية اليمنية" : "Republic of Yemen"}</span>
              <span>•</span>
              <span>{isAr ? "صنعاء / ريف اليمن المعطاء" : "Sanaa / Rural Yemen"}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
