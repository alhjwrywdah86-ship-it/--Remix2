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
  Database,
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
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [lang, setLang] = useState<Language>("ar");
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "planner" | "gradebook" | "summarizer" | "parent" | "curriculum" | "voice" | "mobile" | "about" | "admin"
  >("dashboard");

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

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4 flex-shrink-0" />
            <span>{isAr ? "لوحة التحكم الرئيسية" : "Main Dashboard"}</span>
          </button>

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

          <button
            onClick={() => setActiveTab("admin")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
              activeTab === "admin"
                ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Database className="w-4 h-4 flex-shrink-0" />
            <span>{isAr ? "لوحة التحكم للمسؤول (الأدمن)" : "Admin Dashboard"}</span>
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
          <div
            onClick={() => setActiveTab("gradebook")}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-24 hover:border-[#C5A021]/50 hover:shadow-md cursor-pointer transition-all active:scale-95 group"
          >
            <p className="text-[11px] font-mono font-bold text-slate-500 group-hover:text-[#C5A021] transition-colors">
              {isAr ? "إجمالي الطلاب بالمنصة" : "Active Students Registered"}
            </p>
            <h3 className="text-2xl font-serif font-bold text-[#1A365D]">142</h3>
            <div className="text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded self-start">
              {isAr ? "نمو +12% هذا الشهر" : "+12% growth"}
            </div>
          </div>

          <div
            onClick={() => setActiveTab("planner")}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-24 hover:border-[#C5A021]/50 hover:shadow-md cursor-pointer transition-all active:scale-95 group"
          >
            <p className="text-[11px] font-mono font-bold text-slate-500 group-hover:text-[#C5A021] transition-colors">
              {isAr ? "الدروس وخطط التحضير" : "Lessons Generated"}
            </p>
            <h3 className="text-2xl font-serif font-bold text-[#1A365D]">48</h3>
            <div className="text-[9px] font-mono text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded self-start">
              {isAr ? "توفير 15 ساعة عمل" : "Saved 15 hours"}
            </div>
          </div>

          <div
            onClick={() => setActiveTab("planner")}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-24 hover:border-[#C5A021]/50 hover:shadow-md cursor-pointer transition-all active:scale-95 group"
          >
            <p className="text-[11px] font-mono font-bold text-slate-500 group-hover:text-[#C5A021] transition-colors">
              {isAr ? "عروض PPTX والشرائح" : "Completed PPTX Slides"}
            </p>
            <h3 className="text-2xl font-serif font-bold text-[#1A365D]">12</h3>
            <div className="text-[9px] font-mono text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded self-start">
              {isAr ? "جاهزة للاستعمال الصفي" : "Ready for use"}
            </div>
          </div>

          <div
            onClick={() => setActiveTab("about")}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-24 hover:border-[#C5A021]/50 hover:shadow-md cursor-pointer transition-all active:scale-95 group"
          >
            <p className="text-[11px] font-mono font-bold text-slate-500 group-hover:text-[#C5A021] transition-colors">
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
              {activeTab === "dashboard" && (
                <div className="space-y-8 animate-fade-in" id="dashboard-tab-content">
                  {/* Welcome Hero Card */}
                  <div className="bg-gradient-to-br from-[#1A365D] to-[#122846] text-white p-6 md:p-8 rounded-2xl border-2 border-[#C5A021]/30 shadow-lg relative overflow-hidden">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A021]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10 space-y-4">
                      <span className="font-mono text-[10px] font-bold text-[#C5A021] bg-[#C5A021]/15 px-2.5 py-1 rounded border border-[#C5A021]/30 uppercase tracking-widest inline-block">
                        {isAr ? "الرؤية البيداغوجية المتكاملة" : "Integrated Pedagogical Vision"}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#C5A021]">
                        {isAr ? "أهلاً بك في بوابة المعلم العربي المحترف" : "Welcome to the Arab Pro Teacher Portal"}
                      </h2>
                      <p className="text-xs md:text-sm text-slate-200 max-w-3xl leading-relaxed font-serif">
                        {isAr
                          ? "منصة مهنية متطورة صممت خصيصاً لتمكين المعلم المتميز من تحضير دروسه وتسيير أعماله الصفية بكفاءة عالية وفق فلسفة وضاح الزليل الداعية للحد من استهلاك الشاشات والعودة إلى الجوهر التعليمي الملموس."
                          : "An advanced professional platform built to empower outstanding educators with lesson prep, student management, and deep learning strategies in line with Waddah Al-Zulil's mindful pedagogy."}
                      </p>
                      <div className="pt-2 flex flex-wrap gap-3">
                        <button
                          onClick={() => setActiveTab("planner")}
                          className="bg-[#C5A021] text-[#1A365D] hover:bg-[#D9B430] font-sans font-bold text-xs px-4 py-2 rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          {isAr ? "بدء التحضير الفوري 🚀" : "Start Preparing Now 🚀"}
                        </button>
                        <button
                          onClick={() => setActiveTab("about")}
                          className="bg-white/10 text-white hover:bg-white/15 font-sans font-medium text-xs px-4 py-2 rounded-lg border border-white/20 transition-all active:scale-95 cursor-pointer"
                        >
                          {isAr ? "قراءة فلسفة المنصة 📖" : "Read Platform Philosophy 📖"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section Title */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-serif font-bold text-[#1A365D]">
                      {isAr ? "ميزات وأدوات التطبيق الأساسية" : "Core Features & Pedagogical Tools"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isAr
                        ? "اضغط على أي بطاقة للانتقال المباشر وتفعيل الأداة التعليمية المحددة."
                        : "Click on any card to navigate directly to that specific module."}
                    </p>
                  </div>

                  {/* Features Bento Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* 1. Planner Card */}
                    <div
                      onClick={() => setActiveTab("planner")}
                      className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#C5A021]/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
                      id="card-planner"
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 bg-[#C5A021]/10 rounded-xl flex items-center justify-center group-hover:bg-[#C5A021]/20 transition-colors">
                          <BookOpen className="w-5 h-5 text-[#C5A021]" />
                        </div>
                        <h4 className="text-base font-serif font-bold text-[#1A365D] group-hover:text-[#C5A021] transition-colors">
                          {isAr ? "تحضير الدروس و PPTX" : "Lesson Planner & PPTX"}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-serif">
                          {isAr
                            ? "توليد خطط بيداغوجية وعروض شرائح متكاملة مخصصة وفق مناهج الدول العربية واليمن بضغطة زر."
                            : "Generate fully mapped lesson plans and polished PPTX slideshows for regional and Yemeni classrooms."}
                        </p>
                      </div>
                      <div className="pt-2 text-xs font-mono font-bold text-[#C5A021] flex items-center gap-1">
                        <span>{isAr ? "دخول الأداة ←" : "Enter Tool ←"}</span>
                      </div>
                    </div>

                    {/* 2. Gradebook Card */}
                    <div
                      onClick={() => setActiveTab("gradebook")}
                      className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#C5A021]/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
                      id="card-gradebook"
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 bg-[#C5A021]/10 rounded-xl flex items-center justify-center group-hover:bg-[#C5A021]/20 transition-colors">
                          <UserCheck className="w-5 h-5 text-[#C5A021]" />
                        </div>
                        <h4 className="text-base font-serif font-bold text-[#1A365D] group-hover:text-[#C5A021] transition-colors">
                          {isAr ? "سجل درجات الطلاب" : "Gradebook Engine"}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-serif">
                          {isAr
                            ? "نظام تفاعلي متقدم لرصد درجات الطلاب وحفظها محلياً مع احتساب المتوسطات وإدارة الغياب دون اتصال بالإنترنت."
                            : "An interactive gradebook to track records, manage attendance, and compute class statistics offline."}
                        </p>
                      </div>
                      <div className="pt-2 text-xs font-mono font-bold text-[#C5A021] flex items-center gap-1">
                        <span>{isAr ? "دخول الأداة ←" : "Enter Tool ←"}</span>
                      </div>
                    </div>

                    {/* 3. Summarizer Card */}
                    <div
                      onClick={() => setActiveTab("summarizer")}
                      className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#C5A021]/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
                      id="card-summarizer"
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 bg-[#C5A021]/10 rounded-xl flex items-center justify-center group-hover:bg-[#C5A021]/20 transition-colors">
                          <FileText className="w-5 h-5 text-[#C5A021]" />
                        </div>
                        <h4 className="text-base font-serif font-bold text-[#1A365D] group-hover:text-[#C5A021] transition-colors">
                          {isAr ? "البحث والتلخيص الذكي" : "Book Summarizer"}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-serif">
                          {isAr
                            ? "تحليل وتلخيص الكتب المدرسية والملفات وتقديم أهم المحاور والأسئلة والتلخيص البصري في ثوانٍ."
                            : "Upload and analyze PDFs or textbooks to extract key concepts, study questions, and summaries."}
                        </p>
                      </div>
                      <div className="pt-2 text-xs font-mono font-bold text-[#C5A021] flex items-center gap-1">
                        <span>{isAr ? "دخول الأداة ←" : "Enter Tool ←"}</span>
                      </div>
                    </div>

                    {/* 4. Parent Messages Card */}
                    <div
                      onClick={() => setActiveTab("parent")}
                      className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#C5A021]/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
                      id="card-parent"
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 bg-[#C5A021]/10 rounded-xl flex items-center justify-center group-hover:bg-[#C5A021]/20 transition-colors">
                          <Mail className="w-5 h-5 text-[#C5A021]" />
                        </div>
                        <h4 className="text-base font-serif font-bold text-[#1A365D] group-hover:text-[#C5A021] transition-colors">
                          {isAr ? "مراسلة أولياء الأمور" : "Parent Messages"}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-serif">
                          {isAr
                            ? "تأطير خطابات وقصص تواصل راقية لحث الآباء على تطبيق الديتوكس الرقمي وتفعيل التآزر التربوي."
                            : "Draft elegant and constructive letters to parents encouraging off-screen reading and home partnership."}
                        </p>
                      </div>
                      <div className="pt-2 text-xs font-mono font-bold text-[#C5A021] flex items-center gap-1">
                        <span>{isAr ? "دخول الأداة ←" : "Enter Tool ←"}</span>
                      </div>
                    </div>

                    {/* 5. Curriculum Alignment Card */}
                    <div
                      onClick={() => setActiveTab("curriculum")}
                      className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#C5A021]/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
                      id="card-curriculum"
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 bg-[#C5A021]/10 rounded-xl flex items-center justify-center group-hover:bg-[#C5A021]/20 transition-colors">
                          <Compass className="w-5 h-5 text-[#C5A021]" />
                        </div>
                        <h4 className="text-base font-serif font-bold text-[#1A365D] group-hover:text-[#C5A021] transition-colors">
                          {isAr ? "مواءمة المناهج واليمن" : "Curriculum Help"}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-serif">
                          {isAr
                            ? "الوصول لدراسات ومقترحات مواءمة مع مناهج الجمهورية اليمنية لتبسيط المحتوى وتحقيق كفاءة التدريس."
                            : "Explore professional guidelines and consultation to map and simplify standard school curricula."}
                        </p>
                      </div>
                      <div className="pt-2 text-xs font-mono font-bold text-[#C5A021] flex items-center gap-1">
                        <span>{isAr ? "دخول الأداة ←" : "Enter Tool ←"}</span>
                      </div>
                    </div>

                    {/* 6. Voice Assistant Card */}
                    <div
                      onClick={() => setActiveTab("voice")}
                      className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#C5A021]/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
                      id="card-voice"
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 bg-[#C5A021]/10 rounded-xl flex items-center justify-center group-hover:bg-[#C5A021]/20 transition-colors">
                          <Headphones className="w-5 h-5 text-[#C5A021]" />
                        </div>
                        <h4 className="text-base font-serif font-bold text-[#1A365D] group-hover:text-[#C5A021] transition-colors">
                          {isAr ? "مساعد المعلم الصوتي" : "Teacher Voice Assistant"}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-serif">
                          {isAr
                            ? "المستشار الصوتي الذكي للتوجيه السمعي، والمساعدة في التغلب على عقبات الإدارة الصفية بنبرة هادئة."
                            : "Interact with our audio tutor to receive spoken advice on lesson planning and classroom management."}
                        </p>
                      </div>
                      <div className="pt-2 text-xs font-mono font-bold text-[#C5A021] flex items-center gap-1">
                        <span>{isAr ? "دخول الأداة ←" : "Enter Tool ←"}</span>
                      </div>
                    </div>

                    {/* 7. Mobile App Portal Card */}
                    <div
                      onClick={() => setActiveTab("mobile")}
                      className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#C5A021]/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
                      id="card-mobile"
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 bg-[#C5A021]/10 rounded-xl flex items-center justify-center group-hover:bg-[#C5A021]/20 transition-colors">
                          <Smartphone className="w-5 h-5 text-[#C5A021]" />
                        </div>
                        <h4 className="text-base font-serif font-bold text-[#1A365D] group-hover:text-[#C5A021] transition-colors">
                          {isAr ? "تطبيق أندرويد وآيفون" : "Mobile App Portal"}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-serif">
                          {isAr
                            ? "إرشادات تثبيت المنصة كتطبيق ويب تقدمي (PWA) على الهواتف الذكية للوصول المباشر في أي وقت."
                            : "Instructions to install the web portal as a progressive app (PWA) on iOS & Android devices."}
                        </p>
                      </div>
                      <div className="pt-2 text-xs font-mono font-bold text-[#C5A021] flex items-center gap-1">
                        <span>{isAr ? "دخول الأداة ←" : "Enter Tool ←"}</span>
                      </div>
                    </div>

                    {/* 8. Admin Dashboard Card */}
                    <div
                      onClick={() => setActiveTab("admin")}
                      className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#C5A021]/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
                      id="card-admin"
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 bg-[#C5A021]/10 rounded-xl flex items-center justify-center group-hover:bg-[#C5A021]/20 transition-colors">
                          <Database className="w-5 h-5 text-[#C5A021]" />
                        </div>
                        <h4 className="text-base font-serif font-bold text-[#1A365D] group-hover:text-[#C5A021] transition-colors">
                          {isAr ? "لوحة التحكم للمسؤول (الأدمن)" : "Admin Dashboard"}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-serif">
                          {isAr
                            ? "لوحة خاصة برفع الكتب المنهجية وإدارة مستودع مناهج الوزارة والاطلاع على إحصاءات تشغيل الخوادم."
                            : "Administrative workspace to upload textbooks, manage state curriculum data, and inspect platform health."}
                        </p>
                      </div>
                      <div className="pt-2 text-xs font-mono font-bold text-[#C5A021] flex items-center gap-1">
                        <span>{isAr ? "دخول الأداة ←" : "Enter Tool ←"}</span>
                      </div>
                    </div>

                    {/* 9. Waddah Philosophy Card */}
                    <div
                      onClick={() => setActiveTab("about")}
                      className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#C5A021]/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
                      id="card-about"
                    >
                      <div className="space-y-3">
                        <div className="w-10 h-10 bg-[#C5A021]/10 rounded-xl flex items-center justify-center group-hover:bg-[#C5A021]/20 transition-colors">
                          <Info className="w-5 h-5 text-[#C5A021]" />
                        </div>
                        <h4 className="text-base font-serif font-bold text-[#1A365D] group-hover:text-[#C5A021] transition-colors">
                          {isAr ? "فلسفة وضاح الزليل" : "Philosophy & Bio"}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-serif">
                          {isAr
                            ? "نبذة عن الكاتب وضاح الزليل، وفهم فلسفته البيداغوجية العميقة الداعية للتعليم الهادئ والتجذير القيمي."
                            : "Read the pedagogical background and bio of founder Waddah Al-Zulil promoting mindful education."}
                        </p>
                      </div>
                      <div className="pt-2 text-xs font-mono font-bold text-[#C5A021] flex items-center gap-1">
                        <span>{isAr ? "دخول الأداة ←" : "Enter Tool ←"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "planner" && <LessonPlanner lang={lang} />}
              {activeTab === "gradebook" && <Gradebook lang={lang} />}
              {activeTab === "summarizer" && <DocumentSummarizer lang={lang} />}
              {activeTab === "parent" && <ParentMessageTab lang={lang} />}
              {activeTab === "curriculum" && <CurriculumGuide lang={lang} />}
              {activeTab === "voice" && <VoiceAssistant lang={lang} />}
              {activeTab === "mobile" && <MobilePortal lang={lang} />}
              {activeTab === "admin" && <AdminPanel lang={lang} />}
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
