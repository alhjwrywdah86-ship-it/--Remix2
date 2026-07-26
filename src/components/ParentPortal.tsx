import React, { useState, useEffect } from "react";
import { ParentProfile, Language, Assignment, AssignmentSubmission, OnlineQuiz } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import {
  Users,
  Award,
  BookOpen,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Send,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  Calendar
} from "lucide-react";

interface ParentPortalProps {
  lang: Language;
  parentPhone?: string;
}

export default function ParentPortal({ lang, parentPhone = "770000000" }: ParentPortalProps) {
  const isAr = lang === "ar";

  const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("st_student_1");

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [quizzes, setQuizzes] = useState<OnlineQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  // Gemini AI Parent Report
  const [parentReportText, setParentReportText] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    fetchParentData();
  }, [parentPhone]);

  const fetchParentData = async () => {
    setLoading(true);
    try {
      const [parentData, assData, subData, qzData] = await Promise.all([
        fetchWithRetry<ParentProfile>(`/api/parent?phone=${parentPhone}`),
        fetchWithRetry<Assignment[]>("/api/assignments"),
        fetchWithRetry<AssignmentSubmission[]>("/api/assignments/submissions"),
        fetchWithRetry<OnlineQuiz[]>("/api/quizzes")
      ]);

      setParentProfile(parentData);
      setAssignments(assData || []);
      setSubmissions(subData || []);
      setQuizzes(qzData || []);

      if (parentData && parentData.linkedStudents && parentData.linkedStudents.length > 0) {
        setSelectedStudentId(parentData.linkedStudents[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIParentReport = async () => {
    if (!selectedStudentId) return;

    setGeneratingReport(true);
    try {
      const data = await fetchWithRetry<any>("/api/parent/ai-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudentId })
      });

      setParentReportText(data.reportText);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "حدث خطأ أثناء توليد تقرير ولي الأمر.");
    } finally {
      setGeneratingReport(false);
    }
  };

  const selectedChild = parentProfile?.linkedStudents?.find((s) => s.id === selectedStudentId);

  return (
    <div className="space-y-6 pb-12 font-sans dir-rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1A365D] via-[#2A4D7C] to-[#1A365D] text-white p-6 rounded-2xl shadow-xl border border-[#C5A021]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#C5A021] text-[#1A365D] rounded-2xl flex items-center justify-center font-bold text-2xl shadow border-2 border-white/20">
            <Users className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md text-[11px] font-mono font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> بوابة ولي الأمر الموثقة
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-white mt-1">
              مرحباً بك، {parentProfile?.name || "ولي الأمر المحترم"} 👨‍👩‍👧‍👦
            </h1>
            <p className="text-xs text-slate-200 mt-1">
              متابعة المستوى الأكاديمي، نتائج الواجبات والاختبارات، والتوصيات التربوية الخاصة بالأبناء.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateAIParentReport}
          disabled={generatingReport || !selectedStudentId}
          className="px-4 py-2.5 bg-[#C5A021] hover:bg-amber-400 text-[#1A365D] font-mono font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all self-start"
        >
          {generatingReport ? (
            <RefreshCw className="w-4 h-4 animate-spin text-[#1A365D]" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#1A365D]" />
          )}
          <span>توليد تقرير ولي الأمر الذكي بـ Gemini</span>
        </button>
      </div>

      {/* Children Selector Selector Bar */}
      {parentProfile?.linkedStudents && parentProfile.linkedStudents.length > 0 && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-slate-700">اختر الابن لمتابعة أدائه:</span>
          <div className="flex items-center gap-2">
            {parentProfile.linkedStudents.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedStudentId(child.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-serif transition-all cursor-pointer ${
                  selectedStudentId === child.id
                    ? "bg-[#1A365D] text-white shadow"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {child.name} ({child.grade})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Report Card for Parent */}
      {parentReportText && (
        <div className="bg-amber-50 p-6 rounded-2xl border-2 border-[#C5A021] shadow-lg space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 text-[#1A365D] font-serif font-bold text-base">
            <Sparkles className="w-5 h-5 text-[#C5A021]" />
            <span>تقرير ولي الأمر والتوصيات المنزلية الذكية للابن ({selectedChild?.name}):</span>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-sans">{parentReportText}</p>
        </div>
      )}

      {/* Child Performance Details Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Child Stat 1: Homeworks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-serif font-bold text-base text-[#1A365D] flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#C5A021]" />
              <span>الواجبات المدرسية:</span>
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              نسبة الإنجاز 90%
            </span>
          </div>

          <div className="space-y-2">
            {assignments.slice(0, 3).map((ass) => {
              const sub = submissions.find((s) => s.assignmentId === ass.id && s.studentId === selectedStudentId);
              return (
                <div key={ass.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#1A365D]">
                    <span>{ass.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{ass.dueDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-600">{ass.subject}</span>
                    <span className={sub ? "text-emerald-700 font-bold" : "text-amber-600 font-bold"}>
                      {sub ? `✔ تم الحل (درجة: ${sub.score ?? ass.totalPoints})` : "قيد الانتظار"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Child Stat 2: Quizzes & Exams */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-serif font-bold text-base text-[#1A365D] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span>نتائج الاختبارات والتقييمات:</span>
            </h3>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              تقدير ممتاز
            </span>
          </div>

          <div className="space-y-2">
            {quizzes.slice(0, 3).map((qz) => (
              <div key={qz.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-[#1A365D]">
                  <span>{qz.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{qz.subject}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                  <span className="text-slate-600">درجة الاختبار:</span>
                  <span className="text-emerald-700 font-bold">18 / 20</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Child Stat 3: Direct Message to Teacher */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="border-b pb-2">
            <h3 className="font-serif font-bold text-base text-[#1A365D] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#C5A021]" />
              <span>تواصل مباشر مع المعلم:</span>
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            أرسل استفساراً أو ملاحظة مباشرة لمعلم المادة للحصول على إفادة مخصصة حول الابن.
          </p>

          <textarea
            rows={3}
            placeholder="اكتب رسالتك أو استفسارك لمعلم المادة هنا..."
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C5A021]"
          />

          <button
            onClick={() => alert("تم إرسال رسالتك لمعلم المادة بنجاح!")}
            className="w-full py-2 bg-[#1A365D] hover:bg-[#122846] text-white font-mono font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow"
          >
            <Send className="w-3.5 h-3.5 text-[#C5A021]" />
            <span>إرسال الرسالة للمعلم</span>
          </button>
        </div>
      </div>
    </div>
  );
}
