import React, { useState } from "react";
import { WorksheetData, TeacherProfile } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import { printContent, exportToWord } from "../utils/exportUtils";
import {
  FileCode,
  Sparkles,
  Download,
  Printer,
  BookOpen,
  CheckCircle2,
  FileText,
  AlertCircle
} from "lucide-react";

import { getCurriculumByCode } from "../data/regionalCurricula";

interface WorksheetGeneratorProps {
  isAr: boolean;
  teacherProfile?: TeacherProfile;
  activeCountryCode?: string;
}

export default function WorksheetGenerator({
  isAr,
  teacherProfile,
  activeCountryCode = "YE",
}: WorksheetGeneratorProps) {
  const activeCurr = getCurriculumByCode(activeCountryCode);
  const [grade, setGrade] = useState("الصف الثامن الأساسي");
  const [subject, setSubject] = useState("اللغة العربية");
  const [lesson, setLesson] = useState("المفعول به وأنواعه");
  const [difficulty, setDifficulty] = useState("متوسط");
  const [loading, setLoading] = useState(false);
  const [worksheetResult, setWorksheetResult] = useState<WorksheetData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenerateWorksheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lesson.trim()) {
      alert(isAr ? "يرجى كتابة عنوان الدرس." : "Please enter lesson name.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setWorksheetResult(null);

    try {
      const payload = {
        grade,
        subject,
        lesson,
        difficulty,
        teacherProfile,
        country: activeCurr.countryNameAr,
        curriculumGuidelines: activeCurr.aiPromptGuidelines,
        language: isAr ? "ar" : "en",
      };

      const data = await fetchWithRetry<WorksheetData>("/api/gemini/worksheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setWorksheetResult(data);
    } catch (err: any) {
      console.error("Worksheet generation error:", err);
      setErrorMessage(
        err.message ||
          (isAr
            ? "تعذر إنشاء ورقة العمل. يرجى المحاولة مرة أخرى."
            : "Failed to generate worksheet. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const getWorksheetHtml = () => {
    if (!worksheetResult) return "";
    let html = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <div style="border: 2px solid #1A365D; padding: 12px; margin-bottom: 15px; border-radius: 8px; background: #F8FAFC;">
          <table style="width: 100%; border: none;">
            <tr>
              <td style="border: none;"><strong>ورقة عمل تعليمية - المنهج المعتمد</strong></td>
              <td style="border: none;"><strong>الصف:</strong> ${worksheetResult.metadata.grade}</td>
              <td style="border: none;"><strong>المادة:</strong> ${worksheetResult.metadata.subject}</td>
            </tr>
            <tr>
              <td style="border: none;" colspan="2"><strong>الدرس:</strong> ${worksheetResult.metadata.lesson}</td>
              <td style="border: none;"><strong>اسم الطالب:</strong> ....................</td>
            </tr>
          </table>
        </div>

        <div style="background: #FFFBEB; border-right: 4px solid #C5A021; padding: 10px; margin-bottom: 15px;">
          <h3 style="color: #1A365D; margin-top: 0;">📌 مقدمة وموجز الدرس:</h3>
          <p>${worksheetResult.introduction}</p>
          <p><strong>المفهوم الرئيسي:</strong> ${worksheetResult.conceptSummary}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #1A365D; border-bottom: 2px solid #C5A021; padding-bottom: 4px;">💡 أمثلة شارحة ومحلولة:</h3>
          ${worksheetResult.workedExamples
            .map(
              (ex) => `
            <div style="background: #F1F5F9; padding: 8px; margin-bottom: 8px; border-radius: 4px;">
              <p style="margin: 0;"><strong>المثال:</strong> ${ex.problem}</p>
              <p style="margin: 4px 0 0 0; color: #166534;"><strong>الشرح والحل:</strong> ${ex.solution}</p>
            </div>
          `
            )
            .join("")}
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #1A365D; border-bottom: 2px solid #C5A021; padding-bottom: 4px;">✏️ التدريبات والأنشطة التطبيقية:</h3>
          ${worksheetResult.exercises
            .map(
              (ex, idx) => `
            <div style="margin-bottom: 15px; padding: 10px; border: 1px dashed #cbd5e1; border-radius: 6px;">
              <p style="font-weight: bold; margin-bottom: 6px;">تدريب ${idx + 1}: ${ex.question}</p>
              <div style="color: #94A3B8; font-style: italic; min-height: 40px; margin-top: 8px;">
                مساحة الإجابة: ............................................................................................................................
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <div style="background: #F8FAFC; border: 1px solid #1A365D; padding: 10px; border-radius: 6px;">
          <h4 style="color: #1A365D; margin-top: 0;">🏠 النشاط والواجب المنزلي (بدون شاشات):</h4>
          <p style="margin-bottom: 0;">${worksheetResult.homeworkTask}</p>
        </div>
      </div>
    `;
    return html;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1A365D] text-white p-6 rounded-xl border-b-4 border-[#C5A021] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] rounded-xl flex items-center justify-center text-[#1A365D] shadow-md">
            <FileCode className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-[#C5A021]">
              {isAr ? "مولد أوراق العمل التعليمية (Worksheet Generator)" : "Smart Worksheet Generator"}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {isAr
                ? "إنشاء أوراق عمل حركية وورقية تحتوي على موجز، أمثلة شارحة، تدريبات ومساحات إجابة جاهزة للطباعة"
                : "Create printable educational worksheets with worked examples and exercises"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleGenerateWorksheet} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
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
            <label className="block text-xs font-bold text-[#1A365D] mb-1">{isAr ? "عنوان الدرس أو المفهوم:" : "Lesson / Concept:"}</label>
            <input
              type="text"
              required
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              placeholder={isAr ? "مثال: المفعول به وأنواعه" : "e.g. Objects"}
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D]"
            />
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
                <span>{isAr ? "جاري تصميم ورقة العمل بالذكاء الاصطناعي..." : "Designing Worksheet..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#C5A021]" />
                <span>{isAr ? "مولد ورقة العمل الآن" : "Generate Worksheet"}</span>
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
      {worksheetResult && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6 space-y-6">
          {/* Action Bar */}
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-bold text-base text-[#1A365D] font-serif flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C5A021]" />
              <span>{worksheetResult.title}</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  exportToWord(`ورقة_عمل_${lesson}`, worksheetResult.title, getWorksheetHtml())
                }
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Word</span>
              </button>
              <button
                onClick={() => printContent(worksheetResult.title, getWorksheetHtml())}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isAr ? "طباعة / PDF" : "Print"}</span>
              </button>
            </div>
          </div>

          {/* Intro Box */}
          <div className="bg-amber-50/70 border-s-4 border-[#C5A021] p-4 rounded-r-lg space-y-2">
            <h4 className="font-bold text-xs text-[#1A365D] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C5A021]" />
              <span>{isAr ? "مقدمة وموجز الدرس الأساسي:" : "Introduction & Concept Summary:"}</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">{worksheetResult.introduction}</p>
            <div className="bg-white/80 p-2 rounded text-xs font-bold text-[#1A365D] border border-amber-200">
              💡 {isAr ? "المفهوم المحوري:" : "Key Concept:"} {worksheetResult.conceptSummary}
            </div>
          </div>

          {/* Worked Examples */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-[#1A365D] border-b pb-1">
              {isAr ? "💡 أمثلة شارحة ومحلولة:" : "Worked Examples:"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {worksheetResult.workedExamples.map((ex, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                  <p className="font-bold text-[#1A365D]">المثال: {ex.problem}</p>
                  <p className="text-emerald-700 font-bold">✔ الشرح والحل: {ex.solution}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Exercises */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-[#1A365D] border-b pb-1">
              {isAr ? "✏️ التدريبات والأنشطة التطبيقية:" : "Exercises & Tasks:"}
            </h4>
            {worksheetResult.exercises.map((ex, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-dashed border-slate-300 bg-slate-50/40 space-y-3">
                <p className="font-bold text-xs text-[#1A365D]">
                  تدريب {idx + 1}: {ex.question}
                </p>
                <div className="bg-white border border-slate-200 p-4 rounded-lg text-xs text-slate-400 italic">
                  {isAr ? "مساحة إجابة الطالب (يكتب القلم على الورق)..." : "Student Answer Space..."}
                </div>
              </div>
            ))}
          </div>

          {/* Homework */}
          <div className="bg-[#1A365D] text-white p-4 rounded-xl space-y-1 border-b-2 border-[#C5A021]">
            <h4 className="font-bold text-xs text-[#C5A021]">
              🏠 {isAr ? "الواجب والتطبيق المنزلي الواقعي:" : "Homework Task:"}
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">{worksheetResult.homeworkTask}</p>
          </div>
        </div>
      )}
    </div>
  );
}
