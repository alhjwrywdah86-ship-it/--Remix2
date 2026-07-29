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
      className="min-h-screen bg-[#F8FAFC] text-[#1A365D] flex flex-col selection:bg-[#C5A021] selection:text-white"
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
                  {isAr ? "منصة التعليم الذكية" : "EdTech Platform Phase 4"}
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
          <nav className="flex-1 py-6 px-4 space-y-1.5">
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
                    {isAr ? "المنصة التعليمية المتكاملة (LMS Platform)" : "LMS Platform"}
                  </p>

                  <button
                    onClick={() => navigateToTab("student_portal")}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                      activeTab === "student_portal"
                        ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                    <span className="font-bold text-emerald-300">{isAr ? "مساحة الطالب الذكية" : "Student Portal"}</span>
                  </button>

                  <button
                    onClick={() => navigateToTab("assignments_manager")}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                      activeTab === "assignments_manager"
                        ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4 flex-shrink-0 text-purple-400" />
                    <span>{isAr ? "نظام الواجبات الذكي" : "Assignments Manager"}</span>
                  </button>

                  <button
                    onClick={() => navigateToTab("student_tracking")}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                      activeTab === "student_tracking"
                        ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Users className="w-4 h-4 flex-shrink-0 text-amber-300" />
                    <span>{isAr ? "لوحة المتابعة اليومية" : "Daily Tracking Board"}</span>
                  </button>

                  <button
                    onClick={() => navigateToTab("parent_portal")}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                      activeTab === "parent_portal"
                        ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Users className="w-4 h-4 flex-shrink-0 text-[#C5A021]" />
                    <span className="font-bold text-amber-200">{isAr ? "بوابة ولي الأمر" : "Parent Portal"}</span>
                  </button>

                  <button
                    onClick={() => navigateToTab("messaging")}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                      activeTab === "messaging"
                        ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 flex-shrink-0 text-blue-300" />
                    <span>{isAr ? "التواصل والإعلانات" : "Messaging Center"}</span>
                  </button>

                  <button
                    onClick={() => navigateToTab("virtual_classroom")}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                      activeTab === "virtual_classroom"
                        ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <BookOpen className="w-4 h-4 flex-shrink-0 text-emerald-300" />
                    <span>{isAr ? "الفصل الافتراضي" : "Virtual Classroom"}</span>
                  </button>

                  <button
                    onClick={() => navigateToTab("gamification")}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                      activeTab === "gamification"
                        ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <AwardIcon className="w-4 h-4 flex-shrink-0 text-amber-300" />
                    <span>{isAr ? "الإنجازات والأوسمة" : "Achievements & Badges"}</span>
                  </button>

                  <button
                    onClick={() => navigateToTab("admin_dashboard")}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                      activeTab === "admin_dashboard"
                        ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Shield className="w-4 h-4 flex-shrink-0 text-purple-300" />
                    <span className="font-bold text-purple-200">{isAr ? "لوحة الإدارة التعليمية" : "Admin Dashboard"}</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-1">
                  <p className="text-[9px] font-mono text-[#C5A021] px-3 pb-1 uppercase tracking-wider font-bold">
                    {isAr ? "المنظومة العالمية والمجتمع (المرحلة 8)" : "Global Platform & Community"}
                  </p>

                  <button
                    onClick={() => navigateToTab("teacher_marketplace")}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                      activeTab === "teacher_marketplace"
                        ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Zap className="w-4 h-4 flex-shrink-0 text-amber-300" />
                    <span>{isAr ? "متجر المعلم للموارد" : "Teacher Marketplace"}</span>
                  </button>

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
                    {isAr ? "أدوات الذكاء الاصطناعي المتقدمة (Phase 6)" : "AI Advanced Tools"}
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
                  onClick={() => navigateToTab("online_quizzes")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                    activeTab === "online_quizzes"
                      ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <FileCheck2 className="w-4 h-4 flex-shrink-0 text-[#C5A021]" />
                  <span>{isAr ? "الاختبارات الإلكترونية والتصحيح" : "Online Quizzes"}</span>
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
                  <span>{isAr ? "دليلي للتفوق والمراجعة" : "My Study Guide"}</span>
                </button>
              </>
            )}

            {currentRole === "supervisor" && (
              <>
                <button
                  onClick={() => navigateToTab("smart_analytics")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                    activeTab === "smart_analytics"
                      ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <BarChart3 className="w-4 h-4 flex-shrink-0 text-purple-300" />
                  <span>{isAr ? "تقارير المنصة والمتابعة" : "Platform Analytics"}</span>
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
                  <span>{isAr ? "الإشراف على الفصول" : "Classrooms Oversight"}</span>
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
                  <span>{isAr ? "المكتبة المنهجية" : "Curriculum Library"}</span>
                </button>

                <button
                  onClick={() => navigateToTab("admin")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer ${
                    activeTab === "admin"
                      ? "bg-[#C5A021]/15 text-[#C5A021] border-s-4 border-[#C5A021] font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Database className="w-4 h-4 flex-shrink-0" />
                  <span>{isAr ? "إدارة المناهج والملفات" : "Admin Panel"}</span>
                </button>
              </>
            )}

            <p className="text-[10px] font-mono text-white/40 px-3 pt-4 pb-2 uppercase tracking-widest">
              {isAr ? "نظام SaaS والخدمات" : "COMMERCIAL SAAS"}
            </p>

            <button
              onClick={() => {
                setShowSubscriptionModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-[#C5A021]/30 text-amber-200 hover:text-white hover:border-[#C5A021]"
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-[#C5A021]" />
                <span className="font-bold">{isAr ? "الاشتراكات والترقية" : "SaaS Plans"}</span>
              </div>
              <span className="text-[9px] bg-[#C5A021] text-[#1A365D] font-bold px-1.5 py-0.2 rounded uppercase">
                {userSubscription.tier === "pro_teacher" ? (isAr ? "معلم محترف" : "Pro Teacher") : userSubscription.tier}
              </span>
            </button>

            <button
              onClick={() => {
                setShowBackupModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <HardDrive className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{isAr ? "النسخ الاحتياطي للأرقام" : "Data Backup"}</span>
            </button>

            <button
              onClick={() => {
                setLegalTab("about");
                setShowLegalModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <Shield className="w-4 h-4 flex-shrink-0 text-blue-300" />
              <span>{isAr ? "الشروط والخصوصية" : "Privacy & Terms"}</span>
            </button>

            <button
              onClick={() => {
                setShowLanding(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-xs font-mono transition-all text-start cursor-pointer text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <Home className="w-4 h-4 flex-shrink-0 text-purple-300" />
              <span>{isAr ? "الصفحة التعريفية" : "Landing Page"}</span>
            </button>

            <p className="text-[10px] font-mono text-white/40 px-3 pt-4 pb-2 uppercase tracking-widest">
              {isAr ? "المؤسس والرؤية" : "FOUNDER & PHILOSOPHY"}
            </p>

            <button
              onClick={() => navigateToTab("about")}
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
        <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
          
          {/* Top Ticker - Editorial Notice */}
          <div className="bg-[#122846] text-slate-100 text-[11px] py-2 px-6 border-b border-[#C5A021]/20 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono shadow-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#C5A021] animate-pulse"></span>
              <span className="text-[#C5A021] font-bold">
                {isAr ? "منصة التعليم الرقمية الذكية (المرحلة 4):" : "EdTech Platform (Phase 4):"}
              </span>
              <span className="text-slate-300">
                {isAr
                  ? "تفعيل أنظمة الفصول الدراسية، الاختبارات والتصحيح الآلي، والتوصيات البيداغوجية بنجاح."
                  : "Classroom rosters, online timed quizzes, and AI remedial plans fully active."}
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
                  ? "منصة تعليمية متكاملة تدعم المعلم والطالب والإدارة مع المناهج الدراسية الجاهزة والتحليل الذكي."
                  : "Integrated EdTech platform supporting teachers, students, and admin with preloaded curricula."}
              </p>
            </div>

            {/* Action Row & Profile Button */}
            <div className="flex items-center gap-3 self-start md:self-center flex-wrap">
              <button
                onClick={() => setShowAssistantModal(true)}
                className="px-3.5 py-2 bg-[#C5A021] text-[#1A365D] hover:bg-amber-400 font-bold rounded-xl flex items-center gap-1.5 font-mono text-xs cursor-pointer shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#1A365D]" />
                <span>{isAr ? "مساعد المعلم الذكي" : "Teacher Assistant"}</span>
              </button>

              <button
                onClick={() => setShowProfileModal(true)}
                className="px-3.5 py-2 bg-[#1A365D] text-white hover:bg-[#122846] border border-[#C5A021] rounded-xl flex items-center gap-1.5 font-mono text-xs cursor-pointer shadow-sm transition-all"
              >
                <Award className="w-3.5 h-3.5 text-[#C5A021]" />
                <span>
                  {teacherProfile?.name
                    ? `${isAr ? "الملف:" : "Profile:"} ${teacherProfile.name}`
                    : isAr
                    ? "الملف الشخصي"
                    : "User Profile"}
                </span>
              </button>
            </div>
          </header>

          {/* Dynamic Metric Statistics Grid */}
          <section className="px-6 pt-6 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setActiveTab("classrooms")}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-24 hover:border-[#C5A021]/50 hover:shadow-md cursor-pointer transition-all active:scale-95 group"
            >
              <p className="text-[11px] font-mono font-bold text-slate-500 group-hover:text-[#C5A021] transition-colors">
                {isAr ? "إجمالي الطلاب بالفصول" : "Registered Students"}
              </p>
              <h3 className="text-2xl font-serif font-bold text-[#1A365D]">142</h3>
              <div className="text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded self-start">
                {isAr ? "فصول نشطة بالكامل" : "Active Roster"}
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
              onClick={() => setActiveTab("online_quizzes")}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-24 hover:border-[#C5A021]/50 hover:shadow-md cursor-pointer transition-all active:scale-95 group"
            >
              <p className="text-[11px] font-mono font-bold text-slate-500 group-hover:text-[#C5A021] transition-colors">
                {isAr ? "الاختبارات الإلكترونية" : "Online Quizzes"}
              </p>
              <h3 className="text-2xl font-serif font-bold text-[#1A365D]">12</h3>
              <div className="text-[9px] font-mono text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded self-start">
                {isAr ? "تصحيح فوري تلقائي" : "Auto-Graded"}
              </div>
            </div>

            <div
              onClick={() => setActiveTab("smart_analytics")}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-24 hover:border-[#C5A021]/50 hover:shadow-md cursor-pointer transition-all active:scale-95 group"
            >
              <p className="text-[11px] font-mono font-bold text-slate-500 group-hover:text-[#C5A021] transition-colors">
                {isAr ? "نسبة النجاح العامة" : "Pass Percentage"}
              </p>
              <h3 className="text-2xl font-serif font-bold text-emerald-700">88%</h3>
              <div className="text-[9px] font-mono text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded self-start">
                {isAr ? "خطط علاجية متاحة" : "Remedial plans ready"}
              </div>
            </div>
          </section>

          {/* Main Component Render Tab Slot */}
          <main
            ref={contentRef}
            className="flex-1 px-6 py-6 md:px-8 scroll-mt-6 space-y-4"
          >
            <OfflineStatusBanner lang={lang} />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + "_" + lang + "_" + currentRole}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === "dashboard" && (
                  <div className="space-y-8 animate-fade-in" id="dashboard-tab-content">
                    {/* Welcome Hero Card */}
                    <div className="bg-gradient-to-br from-[#1A365D] to-[#122846] text-white p-6 md:p-8 rounded-2xl border-2 border-[#C5A021]/30 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A021]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                      <div className="relative z-10 space-y-4">
                        <span className="font-mono text-[10px] font-bold text-[#C5A021] bg-[#C5A021]/15 px-2.5 py-1 rounded border border-[#C5A021]/30 uppercase tracking-widest inline-block">
                          {isAr ? "منصة التعليم الرقمية متكاملة (المرحلة 4)" : "Integrated Platform (Phase 4)"}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#C5A021]">
                          {isAr ? "أهلاً بك في بوابة المعلم العربي المحترف" : "Welcome to Arab Pro Teacher Portal"}
                        </h2>
                        <p className="text-xs md:text-sm text-slate-200 max-w-3xl leading-relaxed font-serif">
                          {isAr
                            ? "منصة تعليمية متكاملة تجمع بين المكتبة المنهجية الجاهزة، أدوات التحضير الذكي للدروس والعروض، إدارة الفصول والحضور، الاختبارات الإلكترونية بالتصحيح الفوري، والتحليل البيداغوجي الذكي."
                            : "A complete EdTech platform integrating preloaded curricula, smart lesson planning, classroom management, timed online exams, and AI pedagogical analytics."}
                        </p>
                        <div className="pt-2 flex flex-wrap gap-3">
                          <button
                            onClick={() => setActiveTab("classrooms")}
                            className="bg-[#C5A021] text-[#1A365D] hover:bg-[#D9B430] font-sans font-bold text-xs px-4 py-2 rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
                          >
                            {isAr ? "إدارة الفصول والحضور 👥" : "Classroom Management 👥"}
                          </button>
                          <button
                            onClick={() => setActiveTab("curriculum_library")}
                            className="bg-white/10 text-white hover:bg-white/15 font-sans font-medium text-xs px-4 py-2 rounded-lg border border-white/20 transition-all active:scale-95 cursor-pointer"
                          >
                            {isAr ? "تصفح المكتبة المنهجية 📚" : "Browse Curriculum 📚"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Section Title */}
                    <div className="space-y-1">
                      <h3 className="text-lg font-serif font-bold text-[#1A365D]">
                        {isAr ? "الأقسام والأدوات الرئيسية في المنصة" : "Platform Main Sections"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isAr
                          ? "اختر الأداة أو القسم المطلوب للانتقال الفوري إليه."
                          : "Select any tool to navigate directly."}
                      </p>
                    </div>

                    {/* Features Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Phase 4: Classrooms Card */}
                      <div
                        onClick={() => setActiveTab("classrooms")}
                        className="group bg-gradient-to-br from-[#1A365D]/5 to-white p-6 rounded-2xl border-2 border-[#1A365D]/30 hover:border-[#C5A021] hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="w-10 h-10 bg-[#1A365D] text-[#C5A021] rounded-xl flex items-center justify-center font-bold shadow-md">
                            <Users className="w-5 h-5" />
                          </div>
                          <h4 className="text-base font-serif font-bold text-[#1A365D] group-hover:text-[#C5A021] transition-colors flex items-center gap-2">
                            <span>{isAr ? "إدارة الفصول والحضور" : "Classroom Management"}</span>
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-mono px-2 py-0.5 rounded-full">المرحلة 4</span>
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-serif">
                            {isAr
                              ? "تنظيم قوائم الطلاب حسب الصفوف والشعب، تسجيل الحضور والغياب اليومي، ورصد درجات الواجبات والمشاركة والاختبار."
                              : "Roster management, daily attendance logs, homework and exam score tracking for each class."}
                          </p>
                        </div>
                        <div className="pt-2 text-xs font-mono font-bold text-[#1A365D] flex items-center gap-1">
                          <span>{isAr ? "دخول إدارة الفصول ←" : "Open Classrooms ←"}</span>
                        </div>
                      </div>

                      {/* Phase 4: Online Quizzes Card */}
                      <div
                        onClick={() => setActiveTab("online_quizzes")}
                        className="group bg-gradient-to-br from-amber-50 to-white p-6 rounded-2xl border-2 border-[#C5A021]/60 hover:border-[#C5A021] hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="w-10 h-10 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold shadow-md">
                            <FileCheck2 className="w-5 h-5" />
                          </div>
                          <h4 className="text-base font-serif font-bold text-[#1A365D] group-hover:text-[#C5A021] transition-colors flex items-center gap-2">
                            <span>{isAr ? "الاختبارات والتصحيح الآلي" : "Online Timed Quizzes"}</span>
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-mono px-2 py-0.5 rounded-full">المرحلة 4</span>
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-serif">
                            {isAr
                              ? "نشر اختبارات إلكترونية محددة بزمن للطلاب مع التصحيح الفوري الآلي وعرض التقييم والتغذية الراجعة."
                              : "Publish timed quizzes for students with instant automated grading and personalized AI guidance."}
                          </p>
                        </div>
                        <div className="pt-2 text-xs font-mono font-bold text-[#C5A021] flex items-center gap-1">
                          <span>{isAr ? "دخول بوابة الاختبارات ←" : "Open Quizzes ←"}</span>
                        </div>
                      </div>

                      {/* Phase 4: Smart Analytics Card */}
                      <div
                        onClick={() => setActiveTab("smart_analytics")}
                        className="group bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border-2 border-purple-200 hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="w-10 h-10 bg-purple-700 text-white rounded-xl flex items-center justify-center font-bold shadow-md">
                            <BarChart3 className="w-5 h-5" />
                          </div>
                          <h4 className="text-base font-serif font-bold text-[#1A365D] group-hover:text-purple-700 transition-colors flex items-center gap-2">
                            <span>{isAr ? "التقارير والتحليلات الذكية" : "Smart Reports"}</span>
                            <span className="bg-purple-100 text-purple-800 text-[9px] font-mono px-2 py-0.5 rounded-full">المرحلة 4</span>
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-serif">
                            {isAr
                              ? "تقارير شاملة عن أداء الطلاب، تحليل الفجوات والمهارات الضعيفة، وتوليد الخطط العلاجية بالذكاء الاصطناعي."
                              : "Performance analytics, skill gap identification, and AI remedial plan generator for teachers and admin."}
                          </p>
                        </div>
                        <div className="pt-2 text-xs font-mono font-bold text-purple-800 flex items-center gap-1">
                          <span>{isAr ? "عرض التقارير والتحليل ←" : "View Analytics ←"}</span>
                        </div>
                      </div>

                      {/* Ready Curriculum Library Card */}
                      <div
                        onClick={() => setActiveTab("curriculum_library")}
                        className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#C5A021] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="w-10 h-10 bg-[#C5A021]/10 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-[#C5A021]" />
                          </div>
                          <h4 className="text-base font-serif font-bold text-[#1A365D] group-hover:text-[#C5A021] transition-colors">
                            {isAr ? "المكتبة المنهجية الجاهزة" : "Curriculum Library"}
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-serif">
                            {isAr
                              ? "قاعدة بيانات الكتب والمناهج المعتمدة مع خاصية البحث الـ RAG الذكي."
                              : "Preloaded structured textbooks with AI RAG curriculum search."}
                          </p>
                        </div>
                        <div className="pt-2 text-xs font-mono font-bold text-[#C5A021] flex items-center gap-1">
                          <span>{isAr ? "تصفح المكتبة ←" : "Browse Library ←"}</span>
                        </div>
                      </div>

                      {/* Presentation Generator Card */}
                      <div
                        onClick={() => setActiveTab("presentation")}
                        className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#C5A021] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="w-10 h-10 bg-[#C5A021]/10 rounded-xl flex items-center justify-center">
                            <Presentation className="w-5 h-5 text-[#C5A021]" />
                          </div>
                          <h4 className="text-base font-serif font-bold text-[#1A365D] group-hover:text-[#C5A021] transition-colors">
                            {isAr ? "مولد العروض التقديمية (PPTX)" : "Presentation Generator"}
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-serif">
                            {isAr
                              ? "توليد شرائح تفاعلية قابلة للتنزيل بصيغة PowerPoint."
                              : "Generate PowerPoint presentation slides instantly."}
                          </p>
                        </div>
                        <div className="pt-2 text-xs font-mono font-bold text-[#C5A021] flex items-center gap-1">
                          <span>{isAr ? "إنشاء عرض ←" : "Create Slides ←"}</span>
                        </div>
                      </div>

                      {/* Question Bank Card */}
                      <div
                        onClick={() => setActiveTab("qbank")}
                        className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#C5A021] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="w-10 h-10 bg-[#C5A021]/10 rounded-xl flex items-center justify-center">
                            <Database className="w-5 h-5 text-[#C5A021]" />
                          </div>
                          <h4 className="text-base font-serif font-bold text-[#1A365D] group-hover:text-[#C5A021] transition-colors">
                            {isAr ? "بنك الأسئلة الذكي" : "Smart Question Bank"}
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-serif">
                            {isAr
                              ? "حفظ وتنظيم وتدوير الأسئلة ونشرها كاختبارات للطلاب."
                              : "Store, search, and publish question bank items as online quizzes."}
                          </p>
                        </div>
                        <div className="pt-2 text-xs font-mono font-bold text-[#C5A021] flex items-center gap-1">
                          <span>{isAr ? "دخول بنك الأسئلة ←" : "Open Question Bank ←"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Views */}
                {activeTab === "student_portal" && (
                  <StudentPortal lang={lang} currentUserName="عمر حسن التعزي" />
                )}
                {activeTab === "assignments_manager" && (
                  <AssignmentsManager
                    lang={lang}
                    currentTeacherName={teacherProfile?.name || "أستاذ اللغة العربية"}
                  />
                )}
                {activeTab === "student_tracking" && (
                  <StudentTrackingBoard lang={lang} />
                )}
                {activeTab === "parent_portal" && <ParentPortal lang={lang} />}
                {activeTab === "messaging" && (
                  <EducationalMessaging
                    lang={lang}
                    currentUserId="teacher_1"
                    currentUserName={teacherProfile?.name || "أستاذ اللغة العربية"}
                    currentUserRole={currentRole}
                  />
                )}
                {activeTab === "gamification" && (
                  <GamificationAchievements lang={lang} studentId="st_student_1" />
                )}
                {activeTab === "virtual_classroom" && (
                  <VirtualClassroom
                    lang={lang}
                    currentUserName={teacherProfile?.name || "أستاذ اللغة العربية"}
                    currentUserRole={currentRole}
                  />
                )}
                {activeTab === "admin_dashboard" && (
                  <AdminManagementDashboard lang={lang} />
                )}
                {activeTab === "teacher_marketplace" && (
                  <TeacherMarketplace lang={lang} />
                )}
                {activeTab === "teachers_community" && (
                  <TeachersCommunity lang={lang} />
                )}
                {activeTab === "digital_certificates" && (
                  <DigitalCertificates lang={lang} />
                )}
                {activeTab === "global_search" && (
                  <GlobalSmartSearch lang={lang} onNavigateTab={(tab) => setActiveTab(tab)} />
                )}

                {activeTab === "classrooms" && <ClassroomManager isAr={isAr} />}
                {activeTab === "online_quizzes" && (
                  <StudentQuizPortal isAr={isAr} userRole={currentRole} />
                )}
                {activeTab === "smart_analytics" && (
                  <SmartAnalytics isAr={isAr} userRole={currentRole} />
                )}
                {activeTab === "ai_recommendations" && (
                  <AIRecommendationsView isAr={isAr} userRole={currentRole} />
                )}
                {activeTab === "curriculum_library" && (
                  <CurriculumLibrary
                    lang={lang}
                    onNavigateToTool={(tool) => setActiveTab(tool)}
                  />
                )}
                {activeTab === "planner" && (
                  <LessonPlanner lang={lang} teacherProfile={teacherProfile} activeCountryCode={activeCountryCode} />
                )}
                {activeTab === "presentation" && (
                  <PresentationGenerator lang={lang} teacherProfile={teacherProfile} activeCountryCode={activeCountryCode} />
                )}
                {activeTab === "qbank" && <QuestionBank isAr={isAr} />}
                {activeTab === "worksheet" && (
                  <WorksheetGenerator isAr={isAr} teacherProfile={teacherProfile} activeCountryCode={activeCountryCode} />
                )}
                {activeTab === "activity" && (
                  <ActivityDesigner isAr={isAr} teacherProfile={teacherProfile} activeCountryCode={activeCountryCode} />
                )}
                {activeTab === "teacher_library" && (
                  <TeacherLibrary
                    lang={lang}
                    onNavigateToTool={(tool) => setActiveTab(tool)}
                  />
                )}
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

            {/* Teacher Assistant Modal */}
            {showAssistantModal && (
              <TeacherAssistantModal
                isOpen={showAssistantModal}
                onClose={() => setShowAssistantModal(false)}
                lang={lang}
                teacherProfile={teacherProfile}
                activeCountryCode={activeCountryCode}
              />
            )}

            {/* Enhanced Profile Modal */}
            {showProfileModal && (
              <EnhancedUserProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                userRole={currentRole}
                teacherProfile={teacherProfile || DEFAULT_TEACHER_PROFILE}
                onSaveTeacherProfile={(profile) => {
                  setTeacherProfile(profile);
                  localStorage.setItem("ai_teacher_profile", JSON.stringify(profile));
                }}
                isAr={isAr}
              />
            )}
          </main>

          {/* Premium Professional Publishing Footer */}
          <footer className="bg-[#122846] text-slate-100 border-t border-[#C5A021]/30 py-10 px-6 md:px-8 mt-auto">
            <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#C5A021]" />
                  <h3 className="text-base font-serif font-bold text-[#C5A021]">
                    {isAr ? "وضاح للنشر الرقمي" : "Waddah Digital Publishing"}
                  </h3>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {isAr
                    ? "منصة تعليمية متكاملة لتمكين المعلمين والطلاب والإدارة وإعادة التوازن المعرفي بالعودة إلى التعليم الأصيل."
                    : "Integrated EdTech platform for teachers, students, and administration."}
                </p>
                <p className="text-[10px] font-mono text-[#C5A021] bg-[#C5A021]/10 py-1 px-2.5 rounded border border-[#C5A021]/20 inline-block">
                  {isAr
                    ? "تأسيس وملكية: وضاح أحمد حسن الزليل"
                    : "Founder & Proprietor: Waddah Ahmed Hassan Al-Zulil"}
                </p>
              </div>

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
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-[9px] bg-[#C5A021]/20 text-[#C5A021] px-2 py-0.5 rounded border border-[#C5A021]/30">
                      {isAr ? "البريد الإلكتروني" : "Contact Mail"}
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono">alhjwrywdah86@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

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

      {/* PHASE 5 SAAS MODALS */}
      {showSubscriptionModal && (
        <SubscriptionModal
          lang={lang}
          currentSubscription={userSubscription}
          onClose={() => setShowSubscriptionModal(false)}
          onUpgradeSuccess={(updatedSub) => {
            setUserSubscription(updatedSub);
            localStorage.setItem("pro_teacher_subscription", JSON.stringify(updatedSub));
          }}
        />
      )}

      {showLegalModal && (
        <LegalPagesModal
          lang={lang}
          initialTab={legalTab}
          onClose={() => setShowLegalModal(false)}
        />
      )}

      {showBackupModal && (
        <DataBackupModal
          lang={lang}
          onClose={() => setShowBackupModal(false)}
        />
      )}

      {showProfileModal && (
        <EnhancedUserProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userRole={currentRole}
          teacherProfile={teacherProfile || {
            name: "أ. وضاح أحمد حسن الزليل",
            title: "خبير ومصمم مناهج رقمية",
            subject: "اللغة العربية والتربية الإسلامية",
            school: "مدرسة المتفوقين النموذجية",
            bio: "مؤسس منصة المعلم العربي المحترف لتمكين المعلمين بالأدوات الذكية."
          }}
          onSaveTeacherProfile={(profile) => {
            setTeacherProfile(profile);
            localStorage.setItem("ai_teacher_profile", JSON.stringify(profile));
          }}
          isAr={isAr}
        />
      )}

      {/* PHASE 6 MODALS */}
      <SmartSearchModal
        isOpen={showSmartSearchModal}
        onClose={() => setShowSmartSearchModal(false)}
        lang={lang}
      />

      <AIEssayGraderModal
        isOpen={showEssayGraderModal}
        onClose={() => setShowEssayGraderModal(false)}
        lang={lang}
      />

      {/* Mobile Bottom Quick Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#122846] border-t border-[#C5A021]/30 py-2 px-3 flex justify-around items-center text-slate-300 text-[10px] font-mono shadow-2xl backdrop-blur-md bg-opacity-95">
        <button
          onClick={() => navigateToTab("dashboard")}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all min-w-[50px] min-h-[44px] justify-center ${
            activeTab === "dashboard" ? "text-[#C5A021] font-bold" : "hover:text-white"
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>{isAr ? "الرئيسية" : "Home"}</span>
        </button>

        <button
          onClick={() => navigateToTab("planner")}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all min-w-[50px] min-h-[44px] justify-center ${
            activeTab === "planner" ? "text-[#C5A021] font-bold" : "hover:text-white"
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>{isAr ? "التحضير" : "Planner"}</span>
        </button>

        <button
          onClick={() => navigateToTab("student_portal")}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all min-w-[50px] min-h-[44px] justify-center ${
            activeTab === "student_portal" ? "text-[#C5A021] font-bold" : "hover:text-white"
          }`}
        >
          <GraduationCap className="w-5 h-5 text-emerald-400" />
          <span>{isAr ? "الطالب" : "Student"}</span>
        </button>

        <button
          onClick={() => navigateToTab("global_search")}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all min-w-[50px] min-h-[44px] justify-center ${
            activeTab === "global_search" ? "text-[#C5A021] font-bold" : "hover:text-white"
          }`}
        >
          <Search className="w-5 h-5 text-amber-300" />
          <span>{isAr ? "البحث" : "Search"}</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all min-w-[50px] min-h-[44px] justify-center ${
            mobileMenuOpen ? "text-[#C5A021] font-bold" : "hover:text-white"
          }`}
        >
          <Menu className="w-5 h-5" />
          <span>{isAr ? "القائمة" : "Menu"}</span>
        </button>
      </nav>
    </div>
  );
}
