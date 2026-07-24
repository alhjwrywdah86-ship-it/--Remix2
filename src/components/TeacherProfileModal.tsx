import React, { useState, useEffect } from "react";
import { TeacherProfile } from "../types";
import { User, Save, CheckCircle, Award, BookOpen, Layers, Sparkles, X } from "lucide-react";

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAr: boolean;
  profile: TeacherProfile;
  onSaveProfile: (profile: TeacherProfile) => void;
}

export const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  name: "أستاذ المادة القدير",
  specialization: "اللغة العربية والتربية الإسلامية",
  stage: "جميع المراحل",
  grades: ["الصف السابع الأساسي", "الصف الثامن الأساسي", "الصف التاسع الأساسي", "الصف الأول الثانوي"],
  subjects: ["اللغة العربية", "التربية الإسلامية والقرآن الكريم", "الاجتماعيات والتاريخ العربي"],
  preferredStrategies: ["التعلم التعاوني وعمل المجموعات", "العصف الذهني والخرائط الذهنية", "الكرسي الساخن وفكر-شارك-زميل"],
  prepStyle: "ورقي حسي تفاعلي",
};

export default function TeacherProfileModal({
  isOpen,
  onClose,
  isAr,
  profile,
  onSaveProfile,
}: TeacherProfileModalProps) {
  const [formData, setFormData] = useState<TeacherProfile>(profile || DEFAULT_TEACHER_PROFILE);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleGradeToggle = (grade: string) => {
    setFormData((prev) => {
      const exists = prev.grades.includes(grade);
      return {
        ...prev,
        grades: exists ? prev.grades.filter((g) => g !== grade) : [...prev.grades, grade],
      };
    });
  };

  const ALL_GRADES = [
    "الصف السابع الأساسي",
    "الصف الثامن الأساسي",
    "الصف التاسع الأساسي",
    "الصف الأول الثانوي",
    "الصف الثاني الثانوي",
    "الصف الثالث الثانوي",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-[#C5A021]/40 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#1A365D] text-white p-5 flex items-center justify-between border-b-2 border-[#C5A021]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C5A021] rounded-lg flex items-center justify-center text-[#1A365D]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#C5A021] font-serif">
                {isAr ? "ملف المعلم الذكي (AI Profile)" : "AI Teacher Profile"}
              </h3>
              <p className="text-xs text-slate-300">
                {isAr
                  ? "تخصيص الذكاء الاصطناعي ليلائم تخصصك واستراتيجياتك الصفية"
                  : "Customize AI outputs to align with your teaching subject and strategy"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm">
          {savedSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-lg flex items-center gap-2 text-xs font-bold animate-pulse">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>{isAr ? "تم حفظ ملف المعلم بنجاح! سيقوم الذكاء الاصطناعي بتخصيص كافة النتائج لك." : "Profile saved! AI outputs will now be customized for you."}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-[#1A365D] mb-1">
                {isAr ? "اسم المعلم / المعلمة:" : "Teacher Name:"}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D] focus:outline-none focus:ring-2 focus:ring-[#C5A021]"
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-xs font-bold text-[#1A365D] mb-1">
                {isAr ? "التخصص الأكاديمي:" : "Specialization:"}
              </label>
              <input
                type="text"
                required
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D] focus:outline-none focus:ring-2 focus:ring-[#C5A021]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stage */}
            <div>
              <label className="block text-xs font-bold text-[#1A365D] mb-1">
                {isAr ? "المرحلة التعليمية الرئيسية:" : "Educational Stage:"}
              </label>
              <select
                value={formData.stage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stage: e.target.value as any,
                  })
                }
                className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D] focus:outline-none focus:ring-2 focus:ring-[#C5A021]"
              >
                <option value="المرحلة الأساسية">{isAr ? "المرحلة الأساسية (7-9)" : "Basic Stage (7-9)"}</option>
                <option value="المرحلة الثانوية">{isAr ? "المرحلة الثانوية (10-12)" : "Secondary Stage (10-12)"}</option>
                <option value="جميع المراحل">{isAr ? "جميع المراحل (أساسي + ثانوي)" : "All Stages"}</option>
              </select>
            </div>

            {/* Preparation Style */}
            <div>
              <label className="block text-xs font-bold text-[#1A365D] mb-1">
                {isAr ? "نمط التحضير المفضل:" : "Preparation Style:"}
              </label>
              <select
                value={formData.prepStyle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    prepStyle: e.target.value as any,
                  })
                }
                className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D] focus:outline-none focus:ring-2 focus:ring-[#C5A021]"
              >
                <option value="ورقي حسي تفاعلي">{isAr ? "ورقي حسي تفاعلي (أسلوب وضاح الزليل)" : "Interactive Unplugged Paper"}</option>
                <option value="مختصر مركز">{isAr ? "مختصر ومباشر للنقاط" : "Concise & Direct"}</option>
                <option value="تفصيلي شامل">{isAr ? "تفصيلي وأكاديمي شامل" : "Comprehensive Academic"}</option>
              </select>
            </div>
          </div>

          {/* Grades Taught */}
          <div>
            <label className="block text-xs font-bold text-[#1A365D] mb-2">
              {isAr ? "الصفوف التي تدرسها (يمكن اختيار أكثر من صف):" : "Grades Taught:"}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_GRADES.map((g) => {
                const selected = formData.grades.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGradeToggle(g)}
                    className={`p-2 rounded-lg text-xs font-medium border text-start flex items-center justify-between cursor-pointer transition-all ${
                      selected
                        ? "bg-[#1A365D] text-white border-[#C5A021]"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{g}</span>
                    {selected && <CheckCircle className="w-3.5 h-3.5 text-[#C5A021]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Strategies */}
          <div>
            <label className="block text-xs font-bold text-[#1A365D] mb-1">
              {isAr ? "استراتيجيات التدريس المفضلة في حصصك:" : "Preferred Teaching Strategies:"}
            </label>
            <textarea
              rows={2}
              value={formData.preferredStrategies.join("، ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preferredStrategies: e.target.value.split("،").map((s) => s.trim()),
                })
              }
              placeholder={isAr ? "مثال: التعلم التعاوني، العصف الذهني، الخرائط الذهنية" : "e.g. Cooperative, Brainstorming, Mind Maps"}
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D] focus:outline-none focus:ring-2 focus:ring-[#C5A021]"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              {isAr ? "افصل بين الاستراتيجيات بفاصلة (،) وسيستخدمها الذكاء الاصطناعي تلقائياً." : "Separate strategies with commas."}
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#1A365D] hover:bg-[#122846] border border-[#C5A021] flex items-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <Save className="w-4 h-4 text-[#C5A021]" />
              <span>{isAr ? "حفظ ملف المعلم" : "Save Profile"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
