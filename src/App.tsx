import React, { useState, useEffect, useRef } from "react";
import { Language, UserRole, TeacherProfile } from "./types";
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
  BarChart3,
  FileCheck2,
  GraduationCap,
  ShieldCheck,
  User
} from "lucide-react";

// Modular Imports
import Gradebook from "./components/Gradebook";
import LessonPlanner from "./components/LessonPlanner";
import DocumentSummarizer from "./components/DocumentSummarizer";
import ParentMessageTab from "./components/ParentMessageTab";
import CurriculumGuide from "./components/CurriculumGuide";
import CurriculumLibrary from "./components/CurriculumLibrary";
import PresentationGenerator from "./components/PresentationGenerator";
import TeacherLibrary from "./components/TeacherLibrary";
import TeacherAssistantModal from "./components/TeacherAssistantModal";
import AboutWaddah from "./components/AboutWaddah";
import VoiceAssistant from "./components/VoiceAssistant";
import MobilePortal from "./components/MobilePortal";
import AdminPanel from "./components/AdminPanel";
import QuestionBank from "./components/QuestionBank";
import WorksheetGenerator from "./components/WorksheetGenerator";
import ActivityDesigner from "./components/ActivityDesigner";
import TeacherProfileModal, { DEFAULT_TEACHER_PROFILE } from "./components/TeacherProfileModal";

// Phase 4 Imports
import RoleHeader from "./components/RoleHeader";
import ClassroomManager from "./components/ClassroomManager";
import StudentQuizPortal from "./components/StudentQuizPortal";
import SmartAnalytics from "./components/SmartAnalytics";
import EnhancedUserProfileModal from "./components/EnhancedUserProfileModal";
import AIRecommendationsView from "./components/AIRecommendationsView";

// Phase 5 SaaS Imports
import LandingPage from "./components/LandingPage";
import SubscriptionModal from "./components/SubscriptionModal";
import LegalPagesModal from "./components/LegalPagesModal";
import DataBackupModal from "./components/DataBackupModal";
import { UserSubscription } from "./types";
import { Zap, HardDrive, HelpCircle, CreditCard, Shield, Home, Search, Award as AwardIcon, Menu, X } from "lucide-react";

// Phase 6 Modals
import SmartSearchModal from "./components/SmartSearchModal";
import AIEssayGraderModal from "./components/AIEssayGraderModal";

// Phase 7 LMS Platform Imports
import StudentPortal from "./components/StudentPortal";
import AssignmentsManager from "./components/AssignmentsManager";
import StudentTrackingBoard from "./components/StudentTrackingBoard";
import ParentPortal from "./components/ParentPortal";
import EducationalMessaging from "./components/EducationalMessaging";
import GamificationAchievements from "./components/GamificationAchievements";
import VirtualClassroom from "./components/VirtualClassroom";
import AdminManagementDashboard from "./components/AdminManagementDashboard";
import OfflineStatusBanner from "./components/OfflineStatusBanner";

// Phase 8 Global EdTech Components
import TeacherMarketplace from "./components/TeacherMarketplace";
import TeachersCommunity from "./components/TeachersCommunity";
import DigitalCertificates from "./components/DigitalCertificates";
import GlobalSmartSearch from "./components/GlobalSmartSearch";

// Regional Curriculum Engine
import { getDefaultCountryCode, getCurriculumByCode } from "./data/regionalCurricula";

export default function App() {
  const [lang, setLang] = useState<Language>("ar");
  const [activeCountryCode, setActiveCountryCode] = useState<string>(getDefaultCountryCode());
  const [currentRole, setCurrentRole] = useState<UserRole>("teacher");
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "curriculum_library"
    | "planner"
    | "presentation"
    | "qbank"
    | "worksheet"
    | "activity"
    | "teacher_library"
    | "gradebook"
    | "summarizer"
    | "parent"
    | "curriculum"
    | "voice"
    | "mobile"
    | "about"
    | "admin"
    | "classrooms"
    | "online_quizzes"
    | "smart_analytics"
    | "ai_recommendations"
    | "student_portal"
    | "assignments_manager"
    | "student_tracking"
    | "parent_portal"
    | "messaging"
    | "gamification"
    | "virtual_classroom"
    | "admin_dashboard"
    | "teacher_marketplace"
    | "teachers_community"
    | "digital_certificates"
    | "global_search"
  >("dashboard");

  // Mobile UX State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateToTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Phase 5 SaaS Modals & Subscriptions State
  const [showLanding, setShowLanding] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalTab, setLegalTab] = useState<"about" | "privacy" | "terms" | "contact">("about");
  const [showBackupModal, setShowBackupModal] = useState(false);

  // Phase 6 AI Layer Modals State
  const [showSmartSearchModal, setShowSmartSearchModal] = useState(false);
  const [showEssayGraderModal, setShowEssayGraderModal] = useState(false);

  const [userSubscription, setUserSubscription] = useState<UserSubscription>(() => {
    const saved = localStorage.getItem("pro_teacher_subscription");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      userId: "teacher_1",
      tier: "pro_teacher",
      status: "active",
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
      aiCreditsUsedThisMonth: 12,
      maxMonthlyCredits: -1,
      autoRenew: true
    };
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAssistantModal, setShowAssistantModal] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | undefined>(() => {
    const saved = localStorage.getItem("ai_teacher_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  });

  const isAr = lang === "ar";

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeTab]);

  const handleLanguageToggle = () => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  };

  if (showLanding) {
    return (
      <LandingPage
        lang={lang}
        onExplorePlatform={() => setShowLanding(false)}
        onUpgradeClick={() => {
          setShowLanding(false);
          setShowSubscriptionModal(true);
        }}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-[#1A365D] flex flex-col selection:bg-[#C5A021] selection:text-white pb-16 md:pb-0"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* PHASE 4: GLOBAL ROLE & NOTIFICATION HEADER */}
      <RoleHeader
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          if (role === "student") {
            setActiveTab("student_portal");
          } else if (role === "parent") {
            setActiveTab("parent_portal");
          } else if (role === "supervisor" || role === "admin") {
            setActiveTab("admin_dashboard");
          } else if (role === "teacher") {
            setActiveTab("dashboard");
          }
        }}
        lang={lang}
        onToggleLang={handleLanguageToggle}
        teacherProfile={teacherProfile}
        onOpenProfile={() => setShowProfileModal(true)}
        activeCountryCode={activeCountryCode}
        onSelectCountry={setActiveCountryCode}
      />

      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden bg-[#122846] text-white px-4 py-3 border-b border-[#C5A021]/30 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-[#1A365D] hover:bg-[#C5A021]/20 rounded-lg text-[#C5A021] border border-[#C5A021]/30 flex items-center justify-center cursor-pointer transition-all active:scale-95 min-h-[44px] min-w-[44px]"
            aria-label="القائمة الشاملة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#C5A021]" />
            <span className="font-serif font-bold text-sm text-[#C5A021]">
              {isAr ? "المعلم المحترف" : "The Pro Teacher"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateToTab("global_search")}
            className="p-2 bg-[#1A365D] text-amber-300 hover:text-white rounded-lg border border-white/10 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            title={isAr ? "البحث الشامل" : "Search"}
          >
            <Search className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => setShowAssistantModal(true)}
            className="px-3 py-2 bg-[#C5A021] hover:bg-amber-400 text-[#1A365D] font-bold rounded-lg text-xs font-mono flex items-center gap-1 shadow cursor-pointer min-h-[44px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? "المساعد" : "AI Assistant"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      <div className="flex-1 flex flex-col md:flex-row min-w-0">
        {/* 1. PROFESSIONAL ACADEMIC SIDEBAR */}
        <aside
          className={`bg-[#1A365D] text-white flex flex-col border-e border-[#C5A021]/30 flex-shrink-0 transition-all duration-300 ${
            mobileMenuOpen
              ? "fixed inset-y-0 start-0 z-50 w-72 shadow-2xl overflow-y-auto"
              : "hidden md:flex md:w-64"
          }`}
        >
          {/* Brand Header */}
          <div className="p-5 border-b border-[#C5A021]/20 flex items-center justify-between bg-[#122846]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#C5A021] rounded-lg flex items-center justify-center shadow-md shadow-[#122846]/50">
                <Award className="w-6 h-6 text-[#1A365D]" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-serif font-bold tracking-tight text-[#C5A021]">
                  {isAr ? "المعلم المحترف" : "The Pro Teacher"}
                </span>
                <span className="text-[9px] font-mono tracking-wider text-white/50 uppercase">
                  {isAr ? "منصة التعليم الذكية" : "EdTech Platform"}
                </span>
              </div>
            </div>
            {mobileMenuOpen && (
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg md:hidden cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Sidebar Navigation - Role Aware */}
          <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
            <p className="text-[10px] font-mono text-white/40 px-3 pb-2 uppercase tracking-widest">
              {currentRole === "teacher"
                ? (isAr ? "أدوات المعلم والمتابعة" : "Teacher Tools")
                : currentRole === "student"
                ? (isAr ? "بوابة الطالب والتفوق" : "Student Portal")
                : (isAr ? "لوحة المشرف والإدارة" : "Supervisor Hub")}
            </p>

            {currentRole === "teacher" && (
              <>
                <button
                  onClick={() => navigateToTab("dashboard")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                    activeTab === "dashboard"
                      ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Layers className="w-4 h-4 flex-shrink-0" />
                  <span>{isAr ? "لوحة التحكم الرئيسية" : "Dashboard"}</span>
                </button>

                <button
                  onClick={() => navigateToTab("classrooms")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                    activeTab === "classrooms"
                      ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Users className="w-4 h-4 flex-shrink-0 text-amber-300" />
                  <span className="font-semibold text-amber-200">{isAr ? "إدارة الفصول والحضور" : "Classrooms & Attendance"}</span>
                </button>

                <button
                  onClick={() => navigateToTab("curriculum_library")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                    activeTab === "curriculum_library"
                      ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <BookOpen className="w-4 h-4 flex-shrink-0 text-[#C5A021]" />
                  <span className="font-semibold text-amber-200">{isAr ? "المكتبة المنهجية الجاهزة" : "Curriculum Library"}</span>
                </button>

                <button
                  onClick={() => navigateToTab("planner")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                    activeTab === "planner"
                      ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                  <span>{isAr ? "مخطط الدرس الذكي" : "Lesson Planner"}</span>
                </button>

                <button
                  onClick={() => navigateToTab("presentation")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                    activeTab === "presentation"
                      ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Presentation className="w-4 h-4 flex-shrink-0 text-amber-300" />
                  <span className="font-semibold text-amber-200">{isAr ? "مولد العروض التقديمية" : "Presentation Generator"}</span>
                </button>

                <button
                  onClick={() => navigateToTab("qbank")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                    activeTab === "qbank"
                      ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Database className="w-4 h-4 flex-shrink-0" />
                  <span>{isAr ? "بنك الأسئلة الذكي" : "Question Bank"}</span>
                </button>

                <button
                  onClick={() => navigateToTab("online_quizzes")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                    activeTab === "online_quizzes"
                      ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <FileCheck2 className="w-4 h-4 flex-shrink-0 text-[#C5A021]" />
                  <span>{isAr ? "الاختبارات الإلكترونية" : "Online Quizzes"}</span>
                </button>

                <button
                  onClick={() => navigateToTab("smart_analytics")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                    activeTab === "smart_analytics"
                      ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <BarChart3 className="w-4 h-4 flex-shrink-0 text-purple-300" />
                  <span className="font-semibold text-purple-200">{isAr ? "التقارير والتحليلات الذكية" : "Smart Analytics"}</span>
                </button>

                <button
                  onClick={() => navigateToTab("ai_recommendations")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                    activeTab === "ai_recommendations"
                      ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-300" />
                  <span>{isAr ? "التوصيات والخطط العلاجية" : "AI Recommendations"}</span>
                </button>

                <button
                  onClick={() => navigateToTab("teacher_library")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                    activeTab === "teacher_library"
                      ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0 text-[#C5A021]" />
                  <span className="font-semibold text-emerald-300">{isAr ? "مكتبتي الشخصية الحافظة" : "My Personal Library"}</span>
                </button>

                <div className="pt-2 border-t border-white/10 space-y-1">
                  <p className="text-[9px] font-mono text-[#C5A021] px-3 pb-1 uppercase tracking-wider font-bold">
                    {isAr ? "المنظومة العالمية والمجتمع" : "Global Platform & Community"}
                  </p>

                  <button
                    onClick={() => navigateToTab("teachers_community")}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                      activeTab === "teachers_community"
                        ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Home className="w-4 h-4 flex-shrink-0 text-blue-300" />
                    <span>{isAr ? "مجتمع المعلمين" : "Teachers Community"}</span>
                  </button>

                  <button
                    onClick={() => navigateToTab("digital_certificates")}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                      activeTab === "digital_certificates"
                        ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <AwardIcon className="w-4 h-4 flex-shrink-0 text-emerald-300" />
                    <span>{isAr ? "الشهادات الرقمية" : "Digital Certificates"}</span>
                  </button>

                  <button
                    onClick={() => navigateToTab("global_search")}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                      activeTab === "global_search"
                        ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Search className="w-4 h-4 flex-shrink-0 text-amber-300" />
                    <span>{isAr ? "البحث الشامل والذكي" : "Global Smart Search"}</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-1">
                  <p className="text-[9px] font-mono text-[#C5A021] px-3 pb-1 uppercase tracking-wider font-bold">
                    {isAr ? "أدوات الذكاء الاصطناعي المتقدمة (PHASE 6)" : "AI Advanced Tools"}
                  </p>

                  <button
                    onClick={() => {
                      setShowSmartSearchModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-mono text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all text-start cursor-pointer font-bold"
                  >
                    <Search className="w-4 h-4 flex-shrink-0 text-[#C5A021]" />
                    <span>{isAr ? "البحث التعليمي الذكي" : "Smart AI Search"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowEssayGraderModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-mono text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all text-start cursor-pointer font-bold"
                  >
                    <AwardIcon className="w-4 h-4 flex-shrink-0 text-purple-300" />
                    <span>{isAr ? "المصحح المقالي الذكي" : "AI Essay Grader"}</span>
                  </button>
                </div>
              </>
            )}

            {currentRole === "student" && (
              <>
                <button
                  onClick={() => navigateToTab("student_portal")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                    activeTab === "student_portal"
                      ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <GraduationCap className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  <span>{isAr ? "بوابة الطالب الرئيسية" : "Student Portal"}</span>
                </button>

                <button
                  onClick={() => navigateToTab("online_quizzes")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                    activeTab === "online_quizzes"
                      ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <FileCheck2 className="w-4 h-4 flex-shrink-0 text-[#C5A021]" />
                  <span>{isAr ? "الاختبارات والتصحيح" : "Online Quizzes"}</span>
                </button>
              </>
            )}

            {(currentRole === "supervisor" || currentRole === "admin") && (
              <>
                <button
                  onClick={() => navigateToTab("admin_dashboard")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                    activeTab === "admin_dashboard"
                      ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Shield className="w-4 h-4 flex-shrink-0 text-purple-300" />
                  <span>{isAr ? "لوحة الإدارة والمتابعة" : "Admin Dashboard"}</span>
                </button>
              </>
            )}
          </nav>

          {/* SIDEBAR FOOTER - FULLY RESTORED (الصورة الأولى) */}
          <div className="p-4 border-t border-white/10 bg-[#122846]/80 space-y-2.5">
            {/* الاشتراكات والترقية */}
            <button
              onClick={() => {
                setShowSubscriptionModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 bg-[#1A365D] hover:bg-[#C5A021]/20 border border-[#C5A021]/40 rounded-xl text-xs font-mono text-[#C5A021] font-bold transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{isAr ? "الاشتراكات والترقية" : "Subscriptions & Upgrades"}</span>
              </div>
              <span className="text-[10px] bg-[#C5A021] text-[#1A365D] px-2 py-0.5 rounded-full font-bold">
                {isAr ? "معلم محترف" : "Pro"}
              </span>
            </button>

            {/* النسخ الاحتياطي للأرقام */}
            <button
              onClick={() => {
                setShowBackupModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <HardDrive className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{isAr ? "النسخ الاحتياطي للأرقام" : "Data Backup"}</span>
            </button>

            {/* الشروط والخصوصية */}
            <button
              onClick={() => {
                setShowLegalModal(true);
                setLegalTab("privacy");
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>{isAr ? "الشروط والخصوصية" : "Privacy & Terms"}</span>
            </button>

            {/* الصفحة التعريفية */}
            <button
              onClick={() => {
                setShowLanding(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>{isAr ? "الصفحة التعريفية" : "Landing Page"}</span>
            </button>

            {/* المؤسس والرؤية */}
            <div className="pt-2 border-t border-white/10 space-y-1">
              <p className="text-[10px] font-mono text-slate-400 px-1 uppercase tracking-wider">
                {isAr ? "المؤسس والرؤية" : "Founder & Vision"}
              </p>

              <button
                onClick={() => {
                  navigateToTab("about");
                }}
                className="w-full flex items-center gap-3 p-2 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Info className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span>{isAr ? "فلسفة وضاح الزليل" : "Waddah's Philosophy"}</span>
              </button>
            </div>

            {/* بطاقة وضاح الزليل والنشر الرقمي */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-amber-300">
                  {isAr ? "أ. وضاح الزليل" : "Waddah Al-Zulail"}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {isAr ? "وضاح للنشر الرقمي" : "Waddah Digital Publishing"}
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-[#C5A021] flex items-center justify-center overflow-hidden">
                <WaddahAvatarSymbol className="w-full h-full object-cover" />
              </div>
            </div>

            <p className="text-[9px] text-slate-400 text-center font-mono italic pt-1">
              {isAr ? "العودة للحضور الملموس والواقعية في التربية والتدريس" : "Realism in modern education"}
            </p>
          </div>
        </aside>

        {/* 2. MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
          {/* Offline Status Banner */}
          <OfflineStatusBanner lang={lang} />

          <div ref={contentRef} className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* TAB CONTENT SWITCHER */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-[#1A365D] to-[#122846] rounded-2xl p-6 text-white border border-[#C5A021]/30 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 end-0 transform translate-x-8 -translate-y-8 w-48 h-48 bg-[#C5A021]/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative z-10 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A021]/20 border border-[#C5A021]/40 rounded-full text-xs font-mono text-[#C5A021]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAr ? "منصة المعلم العربي المحترف" : "Pro Teacher AI Engine"}</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">
                      {isAr
                        ? `مرحباً بك، ${teacherProfile?.fullName || "المعلم الفاضل"}`
                        : `Welcome, ${teacherProfile?.fullName || "Distinguished Teacher"}`}
                    </h1>
                    <p className="text-sm text-slate-300 max-w-2xl font-mono leading-relaxed">
                      {isAr
                        ? "منظومتك الشاملة للتحضير التربوي، إدارة الفصول، إنشاء الاختبارات العادية والإلكترونية، وتحليل نتائج الطلاب بدقة متناهية."
                        : "Your all-in-one smart system for lesson planning, classroom management, online quizzes, and intelligent analytics."}
                    </p>
                  </div>
                </div>

                {/* Quick Access Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => navigateToTab("curriculum_library")}
                    className="p-5 bg-white border border-slate-200 hover:border-[#C5A021] rounded-xl shadow-xs hover:shadow-md transition-all text-start group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-amber-500/10 text-[#C5A021] rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-[#1A365D] text-base mb-1">
                      {isAr ? "المكتبة المنهجية" : "Curriculum Library"}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {isAr ? "المناهج الجاهزة ومخرجات التعلم" : "Ready-made regional curricula"}
                    </p>
                  </button>

                  <button
                    onClick={() => navigateToTab("planner")}
                    className="p-5 bg-white border border-slate-200 hover:border-[#C5A021] rounded-xl shadow-xs hover:shadow-md transition-all text-start group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-blue-500/10 text-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-[#1A365D] text-base mb-1">
                      {isAr ? "تخطيط الدروس" : "Lesson Planner"}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {isAr ? "إعداد خطط الدروس بالذكاء الاصطناعي" : "AI-driven lesson plan creation"}
                    </p>
                  </button>

                  <button
                    onClick={() => navigateToTab("presentation")}
                    className="p-5 bg-white border border-slate-200 hover:border-[#C5A021] rounded-xl shadow-xs hover:shadow-md transition-all text-start group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Presentation className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-[#1A365D] text-base mb-1">
                      {isAr ? "عروض شريحية" : "Presentations"}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {isAr ? "توليد عرض شرائح تفاعلي فوراً" : "Instant interactive slides"}
                    </p>
                  </button>

                  <button
                    onClick={() => navigateToTab("qbank")}
                    className="p-5 bg-white border border-slate-200 hover:border-[#C5A021] rounded-xl shadow-xs hover:shadow-md transition-all text-start group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Database className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-[#1A365D] text-base mb-1">
                      {isAr ? "بنك الأسئلة" : "Question Bank"}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {isAr ? "توليد ونماذج التقييم الشاملة" : "Generate & export quiz banks"}
                    </p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "classrooms" && <ClassroomManager lang={lang} />}
            {activeTab === "curriculum_library" && (
              <CurriculumLibrary lang={lang} activeCountryCode={activeCountryCode} />
            )}
            {activeTab === "planner" && (
              <LessonPlanner lang={lang} activeCountryCode={activeCountryCode} />
            )}
            {activeTab === "presentation" && <PresentationGenerator lang={lang} />}
            {activeTab === "qbank" && <QuestionBank lang={lang} />}
            {activeTab === "worksheet" && <WorksheetGenerator lang={lang} />}
            {activeTab === "activity" && <ActivityDesigner lang={lang} />}
            {activeTab === "teacher_library" && <TeacherLibrary lang={lang} />}
            {activeTab === "gradebook" && <Gradebook lang={lang} />}
            {activeTab === "summarizer" && <DocumentSummarizer lang={lang} />}
            {activeTab === "parent" && <ParentMessageTab lang={lang} />}
            {activeTab === "curriculum" && (
              <CurriculumGuide lang={lang} activeCountryCode={activeCountryCode} />
            )}
            {activeTab === "voice" && <VoiceAssistant lang={lang} />}
            {activeTab === "mobile" && <MobilePortal lang={lang} />}
            {activeTab === "about" && <AboutWaddah lang={lang} />}
            {activeTab === "admin" && <AdminPanel lang={lang} />}
            {activeTab === "online_quizzes" && <StudentQuizPortal lang={lang} />}
            {activeTab === "smart_analytics" && <SmartAnalytics lang={lang} />}
            {activeTab === "ai_recommendations" && <AIRecommendationsView lang={lang} />}

            {/* Phase 7 LMS Components */}
            {activeTab === "student_portal" && <StudentPortal lang={lang} />}
            {activeTab === "assignments_manager" && <AssignmentsManager lang={lang} />}
            {activeTab === "student_tracking" && <StudentTrackingBoard lang={lang} />}
            {activeTab === "parent_portal" && <ParentPortal lang={lang} />}
            {activeTab === "messaging" && <EducationalMessaging lang={lang} />}
            {activeTab === "gamification" && <GamificationAchievements lang={lang} />}
            {activeTab === "virtual_classroom" && <VirtualClassroom lang={lang} />}
            {activeTab === "admin_dashboard" && <AdminManagementDashboard lang={lang} />}

            {/* Phase 8 Global EdTech Components */}
            {activeTab === "teacher_marketplace" && <TeacherMarketplace lang={lang} />}
            {activeTab === "teachers_community" && <TeachersCommunity lang={lang} />}
            {activeTab === "digital_certificates" && <DigitalCertificates lang={lang} />}
            {activeTab === "global_search" && <GlobalSmartSearch lang={lang} />}
          </div>

          {/* Platform Global Footer */}
          <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-6 text-center text-xs font-mono text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
              <p>
                © {new Date().getFullYear()} {isAr ? "المعلم العربي المحترف" : "The Pro Teacher"}. {isAr ? "جميع الحقوق محفوظة لوضاح للنشر الرقمي" : "All rights reserved by Waddah Digital Publishing"}.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setShowLegalModal(true);
                    setLegalTab("privacy");
                  }}
                  className="hover:text-[#1A365D] underline cursor-pointer"
                >
                  {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
                </button>
                <button
                  onClick={() => {
                    setShowLegalModal(true);
                    setLegalTab("terms");
                  }}
                  className="hover:text-[#1A365D] underline cursor-pointer"
                >
                  {isAr ? "الشروط والأحكام" : "Terms of Service"}
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* MOBILE FIXED BOTTOM NAVIGATION BAR - RESTORED (الصورة الثانية) */}
      <div className="md:hidden fixed bottom-0 start-0 end-0 z-40 bg-[#122846] text-white border-t border-[#C5A021]/30 flex items-center justify-around py-1.5 px-1 shadow-2xl backdrop-blur-md">
        <button
          onClick={() => navigateToTab("dashboard")}
          className={`flex flex-col items-center gap-1 p-1 min-w-[56px] transition-all cursor-pointer ${
            activeTab === "dashboard" ? "text-[#C5A021] font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-mono">{isAr ? "الرئيسية" : "Home"}</span>
        </button>

        <button
          onClick={() => navigateToTab("planner")}
          className={`flex flex-col items-center gap-1 p-1 min-w-[56px] transition-all cursor-pointer ${
            activeTab === "planner" ? "text-[#C5A021] font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-mono">{isAr ? "التحضير" : "Planner"}</span>
        </button>

        <button
          onClick={() => navigateToTab("student_portal")}
          className={`flex flex-col items-center gap-1 p-1 min-w-[56px] transition-all cursor-pointer ${
            activeTab === "student_portal" ? "text-[#C5A021] font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          <span className="text-[10px] font-mono">{isAr ? "الطالب" : "Student"}</span>
        </button>

        <button
          onClick={() => {
            setShowSmartSearchModal(true);
          }}
          className="flex flex-col items-center gap-1 p-1 min-w-[56px] text-slate-400 hover:text-[#C5A021] transition-all cursor-pointer"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-mono">{isAr ? "البحث" : "Search"}</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex flex-col items-center gap-1 p-1 min-w-[56px] transition-all cursor-pointer ${
            mobileMenuOpen ? "text-[#C5A021] font-bold" : "text-slate-400 hover:text-white"
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-mono">{isAr ? "القائمة" : "Menu"}</span>
        </button>
      </div>

      {/* GLOBAL MODALS CONTAINER */}
      {showProfileModal && (
        <EnhancedUserProfileModal
          lang={lang}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profile={teacherProfile || DEFAULT_TEACHER_PROFILE}
          onSave={(updated) => {
            setTeacherProfile(updated);
            localStorage.setItem("ai_teacher_profile", JSON.stringify(updated));
            setShowProfileModal(false);
          }}
        />
      )}

      {showAssistantModal && (
        <TeacherAssistantModal
          lang={lang}
          isOpen={showAssistantModal}
          onClose={() => setShowAssistantModal(false)}
        />
      )}

      {showSubscriptionModal && (
        <SubscriptionModal
          lang={lang}
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          currentSubscription={userSubscription}
          onUpgradeSuccess={(newSub) => {
            setUserSubscription(newSub);
            localStorage.setItem("pro_teacher_subscription", JSON.stringify(newSub));
          }}
        />
      )}

      {showLegalModal && (
        <LegalPagesModal
          lang={lang}
          isOpen={showLegalModal}
          initialTab={legalTab}
          onClose={() => setShowLegalModal(false)}
        />
      )}

      {showBackupModal && (
        <DataBackupModal
          lang={lang}
          isOpen={showBackupModal}
          onClose={() => setShowBackupModal(false)}
        />
      )}

      {showSmartSearchModal && (
        <SmartSearchModal
          lang={lang}
          isOpen={showSmartSearchModal}
          onClose={() => setShowSmartSearchModal(false)}
        />
      )}

      {showEssayGraderModal && (
        <AIEssayGraderModal
          lang={lang}
          isOpen={showEssayGraderModal}
          onClose={() => setShowEssayGraderModal(false)}
        />
      )}
    </div>
  );
                }
