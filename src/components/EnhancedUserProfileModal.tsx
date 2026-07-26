import React, { useState } from "react";
import { UserRole, TeacherProfile } from "../types";
import {
  User,
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle,
  Save,
  X,
  Building,
  Briefcase,
  Star,
  Sparkles
} from "lucide-react";

interface EnhancedUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  teacherProfile: TeacherProfile;
  onSaveTeacherProfile: (profile: TeacherProfile) => void;
  isAr: boolean;
}

export default function EnhancedUserProfileModal({
  isOpen,
  onClose,
  userRole,
  teacherProfile,
  onSaveTeacherProfile,
  isAr,
}: EnhancedUserProfileModalProps) {
  if (!isOpen) return null;

  const [name, setName] = useState(teacherProfile.name || "أ. وضاح زليل");
  const [specialization, setSpecialization] = useState(teacherProfile.specialization || "اللغة العربية والدراسات الإسلامية");
  const [school, setSchool] = useState(teacherProfile.school || "مدرسة الميثاق النموذجية - صنعاء");
  const [experienceYears, setExperienceYears] = useState(teacherProfile.experienceYears || 12);
  const [stage, setStage] = useState(teacherProfile.stage || "جميع المراحل");
  const [prepStyle, setPrepStyle] = useState(teacherProfile.prepStyle || "تفصيلي شامل");
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTeacherProfile({
      ...teacherProfile,
      name,
      specialization,
      school,
      experienceYears,
      stage,
      prepStyle,
    });
    setSavedSuccessMsg(true);
    setTimeout(() => {
      setSavedSuccessMsg(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-[#C5A021] w-full max-w-xl overflow-hidden my-8 animate-fade-in">
        {/* Header */}
        <div className="bg-[#1A365D] text-white p-6 border-b-4 border-[#C5A021] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#C5A021] text-[#1A365D] rounded-2xl flex items-center justify-center font-bold text-xl shadow-md">
              {userRole === "teacher" ? "م" : userRole === "student" ? "ط" : "ش"}
            </div>
            <div>
              <h3 className="font-bold text-lg font-serif text-[#C5A021]">
                {isAr ? "الملف الشخصي والإنجازات" : "My User Profile"}
              </h3>
              <p className="text-xs text-slate-300 font-serif">
                {userRole === "teacher"
                  ? (isAr ? "حساب المعلم المحترف والمهارات التربوية" : "Teacher Account")
                  : userRole === "student"
                  ? (isAr ? "حساب الطالب ومتابعة التقدم والدرجات" : "Student Account")
                  : (isAr ? "حساب المشرف والإدارة التعليمية" : "Supervisor Account")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {savedSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? "تم حفظ بيانات الملف الشخصي بنجاح!" : "Profile updated!"}</span>
            </div>
          )}

          {userRole === "teacher" ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs font-serif">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "الاسم الكامل واللقب التربوي:" : "Full Name:"}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-[#1A365D] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "التخصص الأكاديمي:" : "Specialization:"}</label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-[#1A365D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "المدرسة / المؤسسة التعليمية:" : "School:"}</label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-[#1A365D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "سنوات الخبرة التدريسية:" : "Experience Years:"}</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-[#1A365D] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "نمط التحضير المفضل:" : "Prep Style:"}</label>
                <select
                  value={prepStyle}
                  onChange={(e: any) => setPrepStyle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-[#1A365D]"
                >
                  <option value="تفصيلي شامل">تفصيلي شامل (تحضير كامل مع إستراتيجيات وسيناريو)</option>
                  <option value="ورقي حسي تفاعلي">ورقي حسي تفاعلي (أنشطة ورقية ومجموعات)</option>
                  <option value="مختصر مركز">مختصر مركز (جدول العناصر الرئيسية فقط)</option>
                </select>
              </div>

              {/* Achievements Badge */}
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                <h4 className="font-bold text-[#1A365D] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#C5A021]" />
                  <span>{isAr ? "الأوسمة والشارات المكتسبة:" : "Achievements & Badges:"}</span>
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="bg-[#1A365D] text-amber-300 px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#C5A021]" />
                    <span>{isAr ? "وسام المعلم المحترف 2026" : "Master Teacher"}</span>
                  </span>
                  <span className="bg-emerald-700 text-white px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{isAr ? "خبير التحضير الذكي RAG" : "Curriculum Expert"}</span>
                  </span>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold"
                >
                  {isAr ? "إغلاق" : "Close"}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-[#1A365D] bg-[#C5A021] hover:bg-amber-400 font-bold flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isAr ? "حفظ التغييرات" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-xs font-serif">
              <div className="p-4 bg-slate-50 rounded-2xl border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1A365D] text-sm">محمد علي الخولاني</span>
                  <span className="bg-[#1A365D] text-white px-2.5 py-0.5 rounded font-mono text-[10px]">
                    الصف التاسع الأساسي
                  </span>
                </div>
                <p className="text-slate-600">المدرسة: مدرسة الميثاق النموذجية</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="text-2xl font-bold font-mono text-emerald-800">100%</div>
                  <div className="text-[11px] text-emerald-700 font-bold mt-1">نسبة النجاح الإجمالية</div>
                </div>

                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                  <div className="text-2xl font-bold font-mono text-purple-800">1</div>
                  <div className="text-[11px] text-purple-700 font-bold mt-1">الاختبارات الإلكترونية المستكملة</div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl bg-[#1A365D] text-white font-bold"
                >
                  {isAr ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
