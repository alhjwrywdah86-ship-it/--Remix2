import React, { useState } from "react";
import { ExamProposal, TeacherProfile, QuestionBankItem, ExamQuestion } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import { printContent, exportToWord } from "../utils/exportUtils";
import {
  FileCheck2,
  Sparkles,
  Download,
  Printer,
  BookmarkPlus,
  CheckCircle2,
  ListChecks,
  Table,
  HelpCircle,
  FileText,
  AlertCircle
} from "lucide-react";

import { getCurriculumByCode } from "../data/regionalCurricula";

interface SmartQuizGeneratorProps {
  isAr: boolean;
  teacherProfile?: TeacherProfile;
  onSaveToQuestionBank?: (item: QuestionBankItem) => void;
  activeCountryCode?: string;
}

export default function SmartQuizGenerator({
  isAr,
  teacherProfile,
  onSaveToQuestionBank,
  activeCountryCode = "YE",
}: SmartQuizGeneratorProps) {
  const activeCurr = getCurriculumByCode(activeCountryCode);
  const [country, setCountry] = useState(activeCurr.countryNameAr);
  const [grade, setGrade] = useState("الصف التاسع الأساسي");
  const [subject, setSubject] = useState("اللغة العربية");
  const [unit, setUnit] = useState("الوحدة الأولى");
  const [lessonTitle, setLessonTitle] = useState("سورة الفرقان صفات عباد الرحمن");
  const [questionsCount, setQuestionsCount] = useState("10");
  const [questionType, setQuestionType] = useState("mixed");
  const [difficulty, setDifficulty] = useState("متوسط");
  const [loading, setLoading] = useState(false);
  const [quizResult, setQuizResult] = useState<ExamProposal | null>(null);
  const [activeTab, setActiveTab] = useState<"exam" | "answers" | "specifications">("exam");
  const [savedSuccessMessage, setSavedSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) {
      alert(isAr ? "يرجى تحديد عنوان الدرس أو الموضوع." : "Please enter a lesson title.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setQuizResult(null);

    try {
      const payload = {
        country,
        grade,
        subject,
        unit,
        lessonTitle,
        questionsCount,
        questionType,
        difficulty,
        teacherProfile,
        language: isAr ? "ar" : "en",
      };

      const data = await fetchWithRetry<ExamProposal>("/api/gemini/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setQuizResult(data);
    } catch (err: any) {
      console.error("Quiz generation error:", err);
      setErrorMessage(
        err.message ||
          (isAr
            ? "تعذر توليد الاختبار. يرجى محاولة التوليد مجدداً."
            : "Failed to generate quiz. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAllToQuestionBank = () => {
    if (!quizResult || !quizResult.questions || quizResult.questions.length === 0) return;

    let savedCount = 0;
    quizResult.questions.forEach((q, idx) => {
      const item: QuestionBankItem = {
        id: `qb-${Date.now()}-${idx}`,
        grade,
        subject,
        unit,
        topic: lessonTitle,
        question: q,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      const existingStr = localStorage.getItem("ai_teacher_question_bank") || "[]";
      try {
        const existing: QuestionBankItem[] = JSON.parse(existingStr);
        existing.push(item);
        localStorage.setItem("ai_teacher_question_bank", JSON.stringify(existing));
      } catch (e) {
        console.error("Error saving to localStorage", e);
      }

      if (onSaveToQuestionBank) {
        onSaveToQuestionBank(item);
      }
      savedCount++;
    });

    setSavedSuccessMessage(
      isAr
        ? `تم حفظ جميع أسئلة الاختبار (${savedCount} سؤالاً) في بنك الأسئلة الذكي بنجاح!`
        : `Successfully saved ${savedCount} questions to Question Bank!`
    );
    setTimeout(() => setSavedSuccessMessage(""), 4000);
  };

  const getExamHtmlForExport = () => {
    if (!quizResult) return "";
    let html = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <div style="border: 2px solid #1A365D; padding: 15px; margin-bottom: 20px; border-radius: 8px; background: #F8FAFC;">
          <table style="width: 100%; border: none;">
            <tr>
              <td style="border: none;"><strong>الصف:</strong> ${grade}</td>
              <td style="border: none;"><strong>المادة:</strong> ${subject}</td>
              <td style="border: none;"><strong>الوقت:</strong> 45 دقيقة</td>
            </tr>
            <tr>
              <td style="border: none;"><strong>الوحدة:</strong> ${unit}</td>
              <td style="border: none;"><strong>الموضوع:</strong> ${lessonTitle}</td>
              <td style="border: none;"><strong>اسم الطالب:</strong> ....................</td>
            </tr>
          </table>
        </div>
        <h2 style="color: #1A365D; border-bottom: 2px solid #C5A021; padding-bottom: 5px;">${quizResult.title}</h2>
    `;

    quizResult.questions.forEach((q, idx) => {
      html += `
        <div style="margin-bottom: 18px; padding: 10px; border-bottom: 1px dashed #cbd5e1;">
          <p style="font-weight: bold; color: #1A365D; margin-bottom: 6px;">
            السؤال ${idx + 1}: ${q.questionText} (${q.points || 2} درجات)
          </p>
      `;

      if (q.type === "mcq" && q.options) {
        html += `<ul style="list-style-type: none; padding-right: 15px;">`;
        q.options.forEach((opt) => {
          html += `<li style="margin-bottom: 4px;">[  ] ${opt}</li>`;
        });
        html += `</ul>`;
      } else if (q.type === "true_false") {
        html += `<p style="margin-right: 15px; color: #475569;">(   ) صواب   /   (   ) خطأ</p>`;
      } else if (q.type === "matching" && q.matchingPairs) {
        html += `<table style="width: 100%; margin-top: 8px;"><tr><th>العمود (أ)</th><th>العمود (ب)</th></tr>`;
        q.matchingPairs.forEach((pair) => {
          html += `<tr><td>${pair.item}</td><td>${pair.match}</td></tr>`;
        });
        html += `</table>`;
      } else {
        html += `<p style="color: #94A3B8; font-style: italic;">الإجابة: ........................................................................................................</p>`;
      }

      html += `</div>`;
    });

    html += `</div>`;
    return html;
  };

  const getAnswersHtmlForExport = () => {
    if (!quizResult) return "";
    let html = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2 style="color: #1A365D; border-bottom: 2px solid #C5A021; padding-bottom: 5px;">نموذج الإجابة المعتمد - ${quizResult.title}</h2>
        <p style="color: #64748B;">المادة: ${subject} | الصف: ${grade} | الموضوع: ${lessonTitle}</p>
    `;

    quizResult.questions.forEach((q, idx) => {
      html += `
        <div style="margin-bottom: 15px; padding: 10px; background: #F8FAFC; border-right: 4px solid #C5A021;">
          <p style="font-weight: bold; color: #1A365D; margin: 0 0 4px 0;">السؤال ${idx + 1}: ${q.questionText}</p>
          <p style="color: #166534; font-weight: bold; margin: 0 0 4px 0;">✔ الإجابة النموذجية: ${q.correctAnswer}</p>
          ${q.explanation ? `<p style="color: #475569; font-size: 12px; margin: 0;">توضيح: ${q.explanation}</p>` : ""}
        </div>
      `;
    });

    if (quizResult.answerKeyNotes) {
      html += `<div style="margin-top: 20px; padding: 10px; background: #FFFBEB; border: 1px solid #FCD34D;"><p><strong>ملاحظات التصحيح:</strong> ${quizResult.answerKeyNotes}</p></div>`;
    }

    html += `</div>`;
    return html;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#1A365D] text-white p-6 rounded-xl border-b-4 border-[#C5A021] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] rounded-xl flex items-center justify-center text-[#1A365D] shadow-md">
            <FileCheck2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-[#C5A021]">
              {isAr ? "بناء الاختبارات الذكي (Smart Quiz Generator)" : "Smart Quiz Generator"}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {isAr
                ? "صياغة اختبارات معيارية كاملة مع نموذج الإجابة وجدول المواصفات وفق المناهج الرسمية"
                : "Create standardized exams with answer keys and specification tables"}
            </p>
          </div>
        </div>
      </div>

      {/* Generator Form */}
      <form onSubmit={handleGenerateQuiz} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-[#1A365D] border-b pb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C5A021]" />
          <span>{isAr ? "محددات الاختبار والمنهج المستهدف" : "Exam Parameters"}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#1A365D] mb-1">{isAr ? "الدولة والمنهج:" : "Country:"}</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D] focus:ring-2 focus:ring-[#C5A021]"
            >
              <option value="اليمن">🇾🇪 الجمهورية اليمنية</option>
              <option value="السعودية">🇸🇦 المملكة العربية السعودية</option>
              <option value="مصر">🇪🇬 جمهورية مصر العربية</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A365D] mb-1">{isAr ? "الصف الدراسي:" : "Grade Level:"}</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D] focus:ring-2 focus:ring-[#C5A021]"
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
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D] focus:ring-2 focus:ring-[#C5A021]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#1A365D] mb-1">{isAr ? "الوحدة الدراسية:" : "Unit:"}</label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder={isAr ? "مثال: الوحدة الأولى" : "e.g. Unit 1"}
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D] focus:ring-2 focus:ring-[#C5A021]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A365D] mb-1">{isAr ? "عنوان الدرس أو الموضوع:" : "Lesson / Topic:"}</label>
            <input
              type="text"
              required
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder={isAr ? "أدخل عنوان الدرس أو الموضوع" : "Enter topic name"}
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D] focus:ring-2 focus:ring-[#C5A021]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#1A365D] mb-1">{isAr ? "نوع الأسئلة المطلوب:" : "Question Types:"}</label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D] focus:ring-2 focus:ring-[#C5A021]"
            >
              <option value="mixed">{isAr ? "مزيج شامل متوازن (MCQ، صح وخطأ، مقالي، توصيل)" : "Mixed Types"}</option>
              <option value="mcq">{isAr ? "اختيار من متعدد (MCQ)" : "Multiple Choice Only"}</option>
              <option value="true_false">{isAr ? "صح وخطأ فقط" : "True / False Only"}</option>
              <option value="essay">{isAr ? "أسئلة مقالية وقصيرة" : "Essay / Short Answer"}</option>
              <option value="matching">{isAr ? "أسئلة توصيل ومطابقة" : "Matching Items"}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A365D] mb-1">{isAr ? "عدد الأسئلة:" : "Questions Count:"}</label>
            <select
              value={questionsCount}
              onChange={(e) => setQuestionsCount(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D] focus:ring-2 focus:ring-[#C5A021]"
            >
              <option value="5">5 {isAr ? "أسئلة" : "Questions"}</option>
              <option value="10">10 {isAr ? "أسئلة" : "Questions"}</option>
              <option value="15">15 {isAr ? "سؤالاً" : "Questions"}</option>
              <option value="20">20 {isAr ? "سؤالاً" : "Questions"}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A365D] mb-1">{isAr ? "مستوى الصعوبة:" : "Difficulty Level:"}</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D] focus:ring-2 focus:ring-[#C5A021]"
            >
              <option value="متوسط">{isAr ? "متوسط (يناسب كافة المستويات)" : "Average"}</option>
              <option value="سهل">{isAr ? "مبسط ومباشر" : "Easy"}</option>
              <option value="متقدم">{isAr ? "متقدم وقياس تفكير عليا" : "Advanced"}</option>
            </select>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg text-xs font-bold text-white bg-[#1A365D] hover:bg-[#122846] border border-[#C5A021] flex items-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{isAr ? "جاري توليد الاختبار بالذكاء الاصطناعي..." : "Generating Quiz..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#C5A021]" />
                <span>{isAr ? "بناء الاختبار الشامل الآن" : "Generate Smart Exam"}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Messages */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 p-4 rounded-xl flex items-center gap-3 text-xs font-bold">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {savedSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-xs font-bold animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{savedSuccessMessage}</span>
        </div>
      )}

      {/* Generated Result Output */}
      {quizResult && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
          {/* Result Tabs */}
          <div className="bg-[#1A365D] p-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#C5A021]">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("exam")}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  activeTab === "exam"
                    ? "bg-[#C5A021] text-[#1A365D] shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{isAr ? "ورقة الاختبار (للطلاب)" : "Exam Paper"}</span>
              </button>

              <button
                onClick={() => setActiveTab("answers")}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  activeTab === "answers"
                    ? "bg-[#C5A021] text-[#1A365D] shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <ListChecks className="w-4 h-4" />
                <span>{isAr ? "نموذج الإجابة المعتمد" : "Answer Key"}</span>
              </button>

              <button
                onClick={() => setActiveTab("specifications")}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  activeTab === "specifications"
                    ? "bg-[#C5A021] text-[#1A365D] shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Table className="w-4 h-4" />
                <span>{isAr ? "جدول المواصفات" : "Specification Table"}</span>
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
              <button
                onClick={handleSaveAllToQuestionBank}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 flex items-center gap-1.5 cursor-pointer"
                title={isAr ? "حفظ كافة الأسئلة في بنك الأسئلة" : "Save to Question Bank"}
              >
                <BookmarkPlus className="w-4 h-4 text-amber-700" />
                <span>{isAr ? "حفظ ببنك الأسئلة" : "Save to Q-Bank"}</span>
              </button>

              <button
                onClick={() =>
                  exportToWord(
                    `اختبار_${lessonTitle}`,
                    quizResult.title,
                    activeTab === "answers" ? getAnswersHtmlForExport() : getExamHtmlForExport()
                  )
                }
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Word</span>
              </button>

              <button
                onClick={() =>
                  printContent(
                    quizResult.title,
                    activeTab === "answers" ? getAnswersHtmlForExport() : getExamHtmlForExport()
                  )
                }
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isAr ? "طباعة / PDF" : "Print / PDF"}</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Exam Paper */}
          {activeTab === "exam" && (
            <div className="p-6 space-y-6">
              {/* Exam School Header */}
              <div className="border-2 border-[#1A365D] p-4 rounded-xl bg-[#F8FAFC]">
                <div className="flex justify-between items-center text-xs text-[#1A365D] font-bold border-b pb-2 mb-3">
                  <div>الجمهورية اليمنية - وزارة التربية والتعليم</div>
                  <div className="text-[#C5A021] font-serif text-sm">اختبار تقويمي مائي معتمد</div>
                  <div>العام الدراسي: 2026م</div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-700">
                  <div><strong>الصف:</strong> {grade}</div>
                  <div><strong>المادة:</strong> {subject}</div>
                  <div><strong>الوحدة:</strong> {unit}</div>
                  <div><strong>الزمن:</strong> 45 دقيقة</div>
                  <div className="col-span-2"><strong>الموضوع:</strong> {lessonTitle}</div>
                  <div className="col-span-2"><strong>اسم الطالب/الطالبة:</strong> ................................................</div>
                </div>
              </div>

              <h3 className="text-center font-bold text-base text-[#1A365D] font-serif border-b-2 border-[#C5A021] pb-2">
                {quizResult.title}
              </h3>

              {/* Questions List */}
              <div className="space-y-6">
                {quizResult.questions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-xs text-[#1A365D] leading-relaxed">
                        س {idx + 1}: {q.questionText}
                      </p>
                      <span className="text-[10px] bg-[#1A365D]/10 text-[#1A365D] px-2 py-0.5 rounded font-bold flex-shrink-0">
                        {q.points || 2} {isAr ? "درجات" : "pts"}
                      </span>
                    </div>

                    {q.type === "mcq" && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-4 text-xs text-slate-700">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <div className="w-4 h-4 border border-slate-400 rounded-full flex-shrink-0"></div>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {q.type === "true_false" && (
                      <div className="flex items-center gap-6 pr-4 text-xs text-slate-700 font-bold">
                        <span>(   ) صواب</span>
                        <span>(   ) خطأ</span>
                      </div>
                    )}

                    {q.type === "matching" && q.matchingPairs && (
                      <div className="overflow-x-auto pr-2">
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="bg-[#1A365D] text-white">
                              <th className="p-2 text-start">العمود الأول (أ)</th>
                              <th className="p-2 text-start">العمود الثاني (ب)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {q.matchingPairs.map((pair, pIdx) => (
                              <tr key={pIdx} className="border-b border-slate-200">
                                <td className="p-2 font-medium">{pair.item}</td>
                                <td className="p-2 text-slate-600">[  ] {pair.match}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {(q.type === "essay" || q.type === "fill_in" || q.type === "ordering") && (
                      <div className="pt-2 text-slate-300 text-xs border-b border-dashed border-slate-300 leading-loose">
                        ........................................................................................................................................................................
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Answer Key */}
          {activeTab === "answers" && (
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-[#1A365D] border-b pb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{isAr ? "نموذج الإجابات والحلول المعتمدة من المنهج" : "Standard Model Answers"}</span>
              </h3>

              <div className="space-y-4">
                {quizResult.questions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-lg border-s-4 border-emerald-600 bg-emerald-50/40 border border-slate-200 space-y-2">
                    <p className="font-bold text-xs text-[#1A365D]">
                      س {idx + 1}: {q.questionText}
                    </p>
                    <p className="text-xs font-bold text-emerald-800 bg-emerald-100/80 p-2 rounded">
                      ✔ {isAr ? "الإجابة النموذجية:" : "Model Answer:"} {q.correctAnswer}
                    </p>
                    {q.explanation && (
                      <p className="text-xs text-slate-600 italic">
                        💡 {isAr ? "توضيح وتوجيه المعلم:" : "Teacher Note:"} {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {quizResult.answerKeyNotes && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                  <span className="font-bold">ملاحظات وقواعد سلم التوزيع: </span>
                  {quizResult.answerKeyNotes}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Table of Specifications */}
          {activeTab === "specifications" && (
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-[#1A365D] border-b pb-2 flex items-center gap-2">
                <Table className="w-5 h-5 text-[#C5A021]" />
                <span>{isAr ? "جدول مواصفات الاختبار والوزن النسبي" : "Table of Specifications"}</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start border-collapse">
                  <thead>
                    <tr className="bg-[#1A365D] text-white">
                      <th className="p-3 border border-slate-300">الوحدة / الموضوع</th>
                      <th className="p-3 border border-slate-300">الوزن النسبي %</th>
                      <th className="p-3 border border-slate-300">المستوى المعرفي</th>
                      <th className="p-3 border border-slate-300">أرقام الأسئلة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizResult.tableOfSpecifications && quizResult.tableOfSpecifications.length > 0 ? (
                      quizResult.tableOfSpecifications.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50 border-b border-slate-200">
                          <td className="p-3 border border-slate-200 font-bold">{row.topic}</td>
                          <td className="p-3 border border-slate-200 text-center">{row.weight}</td>
                          <td className="p-3 border border-slate-200 text-center">{row.cognitiveLevel}</td>
                          <td className="p-3 border border-slate-200 text-center">{row.questionNumbers}</td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr className="hover:bg-slate-50 border-b border-slate-200">
                          <td className="p-3 border border-slate-200 font-bold">{lessonTitle}</td>
                          <td className="p-3 border border-slate-200 text-center">100%</td>
                          <td className="p-3 border border-slate-200 text-center">تذكر، فهم، تطبيق، تحليل</td>
                          <td className="p-3 border border-slate-200 text-center">1 - {quizResult.questions.length}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
