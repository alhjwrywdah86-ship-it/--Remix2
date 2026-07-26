import React, { useState } from "react";
import { ClassroomActivityData, TeacherProfile } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import { printContent, exportToWord } from "../utils/exportUtils";
import {
  Sparkles,
  Download,
  Printer,
  Users,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Clock,
  Layers,
  Wrench
} from "lucide-react";

import { getCurriculumByCode } from "../data/regionalCurricula";

interface ActivityDesignerProps {
  isAr: boolean;
  teacherProfile?: TeacherProfile;
  activeCountryCode?: string;
}

export default function ActivityDesigner({
  isAr,
  teacherProfile,
  activeCountryCode = "YE",
}: ActivityDesignerProps) {
  const activeCurr = getCurriculumByCode(activeCountryCode);
  const [grade, setGrade] = useState("الصف التاسع الأساسي");
  const [subject, setSubject] = useState("اللغة العربية");
  const [lesson, setLesson] = useState("أنواع البدل وأحكامه النحوية");
  const [objective, setObjective] = useState("أن يميّز الطالب بين البدل والمبدل منه في الجمل الفصيحة");
  const [strategy, setStrategy] = useState("فكر - زاوج - شارك");
  const [loading, setLoading] = useState(false);
  const [activityResult, setActivityResult] = useState<ClassroomActivityData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenerateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lesson.trim() || !objective.trim()) {
      alert(isAr ? "يرجى تعبئة اسم الدرس والهدف التعليمي." : "Please fill lesson name and objective.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setActivityResult(null);

    try {
      const payload = {
        grade,
        subject,
        lesson,
        objective,
        strategy,
        teacherProfile,
        country: activeCurr.countryNameAr,
        language: isAr ? "ar" : "en",
      };

      const data = await fetchWithRetry<ClassroomActivityData>("/api/gemini/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setActivityResult(data);
    } catch (err: any) {
      console.error("Activity design error:", err);
      setErrorMessage(
        err.message ||
          (isAr
            ? "تعذر تصميم النشاط الصفي. يرجى إعادة المحاولة."
            : "Failed to design activity. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const getActivityHtml = () => {
    if (!activityResult) return "";
    return `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2 style="color: #1A365D; border-bottom: 2px solid #C5A021; pb-2;">${activityResult.title}</h2>
        <p><strong>الصف:</strong> ${activityResult.metadata.grade} | <strong>المادة:</strong> ${activityResult.metadata.subject} | <strong>الدرس:</strong> ${activityResult.metadata.lesson}</p>
        <p><strong>الهدف التربوي:</strong> ${activityResult.metadata.objective}</p>

        <div style="background: #F8FAFC; border: 1px solid #1A365D; padding: 10px; margin-bottom: 12px; border-radius: 6px;">
          <h3 style="color: #1A365D; margin-top: 0;">🚀 النشاط الافتتاحي (${activityResult.openingActivity.duration}):</h3>
          <h4>${activityResult.openingActivity.title}</h4>
          <p>${activityResult.openingActivity.description}</p>
        </div>

        <div style="background: #FFFBEB; border: 1px solid #C5A021; padding: 10px; margin-bottom: 12px; border-radius: 6px;">
          <h3 style="color: #1A365D; margin-top: 0;">👥 النشاط الجماعي الرئيسي (${activityResult.groupActivity.duration}):</h3>
          <h4>${activityResult.groupActivity.title} (الإستراتيجية: ${activityResult.groupActivity.strategy})</h4>
          <p>${activityResult.groupActivity.description}</p>
        </div>

        <div style="margin-bottom: 12px;">
          <p><strong>👨‍🏫 دور المعلم (الميسر):</strong> ${activityResult.teacherRole}</p>
          <p><strong>👨‍🎓 دور الطالب (المشارك):</strong> ${activityResult.studentRole}</p>
        </div>

        <div style="background: #F1F5F9; padding: 10px; border-radius: 6px;">
          <p><strong>🛠️ الوسائل والأدوات الملموسة:</strong> ${activityResult.requiredTools.join("، ")}</p>
          <p><strong>📊 طريقة التقويم والملاحظة:</strong> ${activityResult.assessmentMethod}</p>
        </div>
      </div>
    `;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1A365D] text-white p-6 rounded-xl border-b-4 border-[#C5A021] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] rounded-xl flex items-center justify-center text-[#1A365D] shadow-md">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-[#C5A021]">
              {isAr ? "مصمم النشاط الصفي الذكي (Classroom Activity Designer)" : "Classroom Activity Designer"}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {isAr
                ? "توليد أنشطة افتتاحية وجماعية تفاعلية غير شاشية تضمن مشاركة كافة الطلاب وتحدد دور المعلم والطالب"
                : "Design interactive classroom activities with teacher/student roles and unplugged tools"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleGenerateActivity} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#1A365D] mb-1">{isAr ? "الصف الدراسي:" : "Grade:"}</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D]"
            >
              <option value="الصف السابع الأساسي">الصف السابع الأساسي</option>
              <option value="الصف الثامن الأساسي">الصف الثامن الأساسي</option>
              <option value="الصف التاسع الأساسي">الصف التاسع الأساسي</option>
              <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
              <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
              <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A365D] mb-1">{isAr ? "المادة الدراسية:" : "Subject:"}</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A365D] mb-1">{isAr ? "عنوان الدرس:" : "Lesson:"}</label>
            <input
              type="text"
              required
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#1A365D] mb-1">{isAr ? "الهدف التعليمي المستهدف:" : "Learning Objective:"}</label>
            <input
              type="text"
              required
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="مثال: أن يميز الطالب بين أنواع البدل"
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A365D] mb-1">{isAr ? "إستراتيجية التدريس المفضلة:" : "Teaching Strategy:"}</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D]"
            >
              <option value="فكر - زاوج - شارك">فكر - زاوج - شارك (Think-Pair-Share)</option>
              <option value="التعلم التعاوني وعمل المجموعات">التعلم التعاوني وعمل المجموعات</option>
              <option value="العصف الذهني والخرائط الذهنية">العصف الذهني والخرائط الذهنية</option>
              <option value="الكرسي الساخن وطرح الأسئلة">الكرسي الساخن وطرح الأسئلة</option>
              <option value="لعب الأدوار والمحاكاة">لعب الأدوار والمحاكاة</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg text-xs font-bold text-white bg-[#1A365D] hover:bg-[#122846] border border-[#C5A021] flex items-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{isAr ? "جاري تصميم النشاط الصفي..." : "Designing Activity..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#C5A021]" />
                <span>{isAr ? "تصميم النشاط الصفي الآن" : "Design Activity"}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 p-4 rounded-xl flex items-center gap-3 text-xs font-bold">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Output Display */}
      {activityResult && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-bold text-base text-[#1A365D] font-serif flex items-center gap-2">
              <Users className="w-5 h-5 text-[#C5A021]" />
              <span>{activityResult.title}</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  exportToWord(`نشاط_${lesson}`, activityResult.title, getActivityHtml())
                }
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Word</span>
              </button>
              <button
                onClick={() => printContent(activityResult.title, getActivityHtml())}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isAr ? "طباعة / PDF" : "Print"}</span>
              </button>
            </div>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opening Activity */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-xs text-[#1A365D] flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-[#C5A021]" />
                  <span>🚀 {isAr ? "النشاط الافتتاحي (التمهيد):" : "Opening Activity:"}</span>
                </span>
                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {activityResult.openingActivity.duration}
                </span>
              </div>
              <h5 className="font-bold text-xs text-[#1A365D]">{activityResult.openingActivity.title}</h5>
              <p className="text-xs text-slate-600 leading-relaxed">{activityResult.openingActivity.description}</p>
            </div>

            {/* Group Activity */}
            <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <span className="font-bold text-xs text-[#1A365D] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#C5A021]" />
                  <span>👥 {isAr ? "النشاط الجماعي والتفاعلي الرئيسي:" : "Main Group Activity:"}</span>
                </span>
                <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded text-amber-900 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {activityResult.groupActivity.duration}
                </span>
              </div>
              <h5 className="font-bold text-xs text-[#1A365D]">
                {activityResult.groupActivity.title} ({activityResult.groupActivity.strategy})
              </h5>
              <p className="text-xs text-slate-700 leading-relaxed">{activityResult.groupActivity.description}</p>
            </div>
          </div>

          {/* Roles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <h5 className="font-bold text-emerald-900">👨‍🏫 {isAr ? "دور المعلم (الميسر والموجه):" : "Teacher Role:"}</h5>
              <p className="text-emerald-800 leading-relaxed">{activityResult.teacherRole}</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
              <h5 className="font-bold text-blue-900">👨‍🎓 {isAr ? "دور الطالب (المشارك والمكتشف):" : "Student Role:"}</h5>
              <p className="text-blue-800 leading-relaxed">{activityResult.studentRole}</p>
            </div>
          </div>

          {/* Tools & Assessment */}
          <div className="p-4 bg-[#1A365D] text-white rounded-xl space-y-3 border-b-2 border-[#C5A021]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C5A021]">
              <Wrench className="w-4 h-4" />
              <span>🛠️ {isAr ? "الأدوات والوسائل التعليمية الملموسة:" : "Required Tools:"}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {activityResult.requiredTools.map((tool, idx) => (
                <span key={idx} className="bg-white/10 px-2.5 py-1 rounded text-slate-200 border border-white/20">
                  • {tool}
                </span>
              ))}
            </div>

            <div className="border-t border-white/10 pt-2 text-xs">
              <span className="font-bold text-[#C5A021]">📊 {isAr ? "طريقة التقويم والملاحظة الصفية:" : "Assessment Method:"} </span>
              <span className="text-slate-200">{activityResult.assessmentMethod}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
