import React, { useState, useEffect } from "react";
import { UserRole, AppNotification, TeacherProfile } from "../types";
import {
  UserCheck,
  GraduationCap,
  ShieldCheck,
  Bell,
  Sparkles,
  Globe,
  User,
  X,
  CheckCircle2,
  BookOpen
} from "lucide-react";

import RegionalCurriculumSelector from "./RegionalCurriculumSelector";

interface RoleHeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  lang: "ar" | "en";
  onToggleLang: () => void;
  teacherProfile?: TeacherProfile;
  onOpenProfile: () => void;
  activeCountryCode?: string;
  onSelectCountry?: (code: string) => void;
}

export default function RoleHeader({
  currentRole,
  onRoleChange,
  lang,
  onToggleLang,
  teacherProfile,
  onOpenProfile,
  activeCountryCode = "YE",
  onSelectCountry = () => {},
}: RoleHeaderProps) {
  const isAr = lang === "ar";
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch((err) => console.error("Error loading notifications:", err));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    fetch("/api/notifications/mark-read", { method: "POST" })
      .then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="bg-[#1A365D] text-white border-b border-[#C5A021]/30 px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Role Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-[#122846] p-1 rounded-xl border border-white/10 w-full md:w-auto justify-center">
          <span className="text-[11px] font-bold text-amber-300 px-2 font-serif hidden sm:inline">
            {isAr ? "نوع الحساب:" : "Role:"}
          </span>

          <button
            onClick={() => onRoleChange("teacher")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif transition-all flex items-center gap-1.5 cursor-pointer ${
              currentRole === "teacher"
                ? "bg-[#C5A021] text-[#1A365D] shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isAr ? "حساب المعلم" : "Teacher"}</span>
          </button>

          <button
            onClick={() => onRoleChange("student")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif transition-all flex items-center gap-1.5 cursor-pointer ${
              currentRole === "student"
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{isAr ? "مساحة الطالب" : "Student Portal"}</span>
          </button>

          <button
            onClick={() => onRoleChange("parent")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif transition-all flex items-center gap-1.5 cursor-pointer ${
              currentRole === "parent"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{isAr ? "بوابة ولي الأمر" : "Parent Portal"}</span>
          </button>

          <button
            onClick={() => onRoleChange("supervisor")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif transition-all flex items-center gap-1.5 cursor-pointer ${
              currentRole === "supervisor" || currentRole === "admin"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAr ? "الإدارة التعليمية" : "Educational Admin"}</span>
          </button>
        </div>

        {/* Right Utility Bar: Profile, Notifications, Language */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 rounded-lg bg-[#122846] hover:bg-white/10 text-amber-300 relative cursor-pointer border border-white/10 transition-colors"
              title={isAr ? "التنبيهات والإشعارات" : "Notifications"}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Menu */}
            {showNotifMenu && (
              <div className="absolute right-0 md:left-0 md:right-auto mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border-2 border-[#C5A021] z-50 overflow-hidden">
                <div className="bg-[#1A365D] text-white p-3 flex items-center justify-between border-b border-[#C5A021]">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#C5A021]" />
                    <span className="font-bold text-xs font-serif">
                      {isAr ? "الإشعارات والتنبيهات" : "Notifications"}
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] text-amber-300 hover:underline font-mono cursor-pointer"
                    >
                      {isAr ? "تحديد الكل كقروء" : "Mark read"}
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      {isAr ? "لا توجد إشعارات جديدة" : "No new notifications"}
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs space-y-1 transition-colors ${
                          !n.read ? "bg-amber-50/70 font-semibold" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[#1A365D]">
                          <span className="font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#C5A021]" />
                            {n.title}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-tight text-[11px] font-serif">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge Button */}
          <button
            onClick={onOpenProfile}
            className="px-3 py-1.5 rounded-lg bg-[#122846] hover:bg-[#1a3860] border border-[#C5A021]/50 text-xs font-serif font-bold text-white flex items-center gap-2 cursor-pointer transition-all"
          >
            <div className="w-5 h-5 bg-[#C5A021] text-[#1A365D] rounded-full flex items-center justify-center font-bold text-[10px]">
              {currentRole === "teacher" ? "م" : currentRole === "student" ? "ط" : "ش"}
            </div>
            <span className="truncate max-w-[120px]">
              {currentRole === "teacher"
                ? teacherProfile?.name || (isAr ? "أ. وضاح زليل" : "Teacher")
                : currentRole === "student"
                ? (isAr ? "طالب منتسب" : "Student")
                : (isAr ? "المشرف الإداري" : "Admin")}
            </span>
          </button>

          {/* Regional Curriculum Selector */}
          <RegionalCurriculumSelector
            lang={lang}
            activeCountryCode={activeCountryCode}
            onSelectCountry={onSelectCountry}
            variant="header"
          />

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-1.5 bg-[#122846] hover:bg-white/10 text-amber-300 rounded-lg text-xs font-mono font-bold border border-white/10 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "EN" : "عربي"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
