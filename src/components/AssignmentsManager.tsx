import React, { useState, useEffect } from "react";
import { Assignment, AssignmentSubmission, Language, Classroom } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import {
  FileCheck,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  FileText,
  UserCheck,
  RefreshCw,
  Award
} from "lucide-react";

interface AssignmentsManagerProps {
  lang: Language;
  userRole?: string;
  teacherName?: string;
  currentTeacherName?: string;
}

export default function AssignmentsManager({
  lang,
  userRole = "teacher",
  teacherName = "أستاذ اللغة العربية",
  currentTeacherName
}: AssignmentsManagerProps) {
  const isAr = lang === "ar";

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  // New Assignment Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newGrade, setNewGrade] = useState("الصف التاسع الأساسي");
  const [newSubject, setNewSubject] = useState("اللغة العربية");
  const [newDueDate, setNewDueDate] = useState("2026-08-10");
  const [newPoints, setNewPoints] = useState(10);
  const [creating, setCreating] = useState(false);

  // Active assignment view submissions
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [analyzingSubmissions, setAnalyzingSubmissions] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assData, subData, classData] = await Promise.all([
        fetchWithRetry<Assignment[]>("/api/assignments"),
        fetchWithRetry<AssignmentSubmission[]>("/api/assignments/submissions"),
        fetchWithRetry<Classroom[]>("/api/classrooms")
      ]);

      setAssignments(assData || []);
      setSubmissions(subData || []);
      setClassrooms(classData || []);
      if (assData && assData.length > 0) {
        setSelectedAssignmentId(assData[0].id);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!newTitle.trim() || !newDescription.trim()) return;

    setCreating(true);
    try {
      const created = await fetchWithRetry<Assignment>("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          grade: newGrade,
          subject: newSubject,
          classroomId: "class_1",
          classroomName: "الصف التاسع (أ)",
          teacherId: "teacher_default_1",
          teacherName,
          dueDate: newDueDate,
          totalPoints: newPoints
        })
      });

      alert("تم إسناد ونشر الواجب بنجاح للطلاب!");
      setShowCreateModal(false);
      setNewTitle("");
      setNewDescription("");
      fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "حدث خطأ أثناء إسناد الواجب.");
    } finally {
      setCreating(false);
    }
  };

  const handleAIAnalyzeSubmissions = async (assignmentId: string) => {
    setAnalyzingSubmissions(true);
    try {
      const res = await fetchWithRetry<any>("/api/assignments/ai-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId })
      });

      alert("تم تحليل إجابات الطلاب واستخراج التغذية الراجعة بالذكاء الاصطناعي بنجاح!");
      fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "حدث خطأ أثناء تحليل إجابات الطلاب.");
    } finally {
      setAnalyzingSubmissions(false);
    }
  };

  const activeAssignment = assignments.find((a) => a.id === selectedAssignmentId);
  const activeSubmissions = submissions.filter((s) => s.assignmentId === selectedAssignmentId);

  return (
    <div className="space-y-6 pb-12 font-sans dir-rtl">
      {/* Header Banner */}
      <div className="bg-[#1A365D] text-white p-6 rounded-2xl shadow-xl border border-[#C5A021]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold text-xl shadow">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white">نظام الواجبات والتكليفات الذكية</h1>
            <p className="text-xs text-slate-300">
              إسناد الواجبات المدرسية، متابعة تسليمات الطلاب، والتصحيح التلقائي بالذكاء الاصطناعي.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-[#C5A021] hover:bg-amber-400 text-[#1A365D] font-mono font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إسناد واجب مدرسي جديد</span>
        </button>
      </div>

      {/* Main Grid: Assignment Selector & Submissions Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: List of Assignments */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-sm text-[#1A365D]">الواجبات المسندة:</h3>

          <div className="space-y-2">
            {assignments.map((ass) => {
              const count = submissions.filter((s) => s.assignmentId === ass.id).length;
              const isSelected = ass.id === selectedAssignmentId;

              return (
                <div
                  key={ass.id}
                  onClick={() => setSelectedAssignmentId(ass.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-amber-50/80 border-[#C5A021] shadow-md"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-mono text-[10px] font-bold rounded">
                      {ass.subject} - {ass.grade}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{ass.dueDate}</span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-[#1A365D]">{ass.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">{ass.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 mt-2 text-[11px] font-mono">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" /> التسليمات: {count} طلاب
                    </span>
                    <span className="text-slate-500 font-bold">{ass.totalPoints} درجات</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Submissions & AI Analysis */}
        <div className="lg:col-span-2 space-y-4">
          {activeAssignment ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-[#C5A021] bg-amber-50 px-2.5 py-1 rounded-md">
                    تفاصيل الواجب المحدد
                  </span>
                  <h2 className="text-lg font-serif font-bold text-[#1A365D] mt-1">
                    {activeAssignment.title}
                  </h2>
                  <p className="text-xs text-slate-600 font-sans mt-0.5">{activeAssignment.description}</p>
                </div>

                <button
                  onClick={() => handleAIAnalyzeSubmissions(activeAssignment.id)}
                  disabled={analyzingSubmissions || activeSubmissions.length === 0}
                  className="px-4 py-2 bg-[#1A365D] hover:bg-[#122846] disabled:opacity-40 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow transition-all self-start"
                >
                  {analyzingSubmissions ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C5A021]" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-[#C5A021]" />
                  )}
                  <span>تحليل إجابات الطلاب بـ Gemini</span>
                </button>
              </div>

              {/* Submissions List */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-sm text-[#1A365D]">
                  حلول وتسليمات الطلاب ({activeSubmissions.length}):
                </h3>

                {activeSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs font-sans"
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1A365D]">{sub.studentName}</span>
                        <span className="text-[10px] font-mono text-slate-500">{sub.submittedAt}</span>
                      </div>

                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold text-[11px]">
                        الدرجة: {sub.score ?? activeAssignment.totalPoints} / {activeAssignment.totalPoints}
                      </span>
                    </div>

                    <p className="text-slate-800 leading-relaxed font-sans bg-white p-3 rounded-lg border border-slate-200">
                      "{sub.submissionText}"
                    </p>

                    {sub.aiAnalysis && (
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 space-y-1">
                        <span className="font-serif font-bold text-[#1A365D] text-xs flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#C5A021]" /> التغذية الراجعة الذكية للحل:
                        </span>
                        <p className="text-slate-700 leading-relaxed">{sub.aiAnalysis.suggestedFeedback}</p>
                      </div>
                    )}
                  </div>
                ))}

                {activeSubmissions.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-xs font-sans">
                    لم يقم أي طالب بتسليم هذا الواجب بعد.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 font-sans text-xs bg-white rounded-2xl border border-slate-200 p-6">
              حدد واجباً من القائمة لعرض وتسليم إجابات الطلاب.
            </div>
          )}
        </div>
      </div>

      {/* CREATE ASSIGNMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="font-serif font-bold text-lg text-[#1A365D] border-b pb-2">
              إسناد واجب مدرسي جديد
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">عنوان الواجب:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: واجب الإعراب والتعبير الإبداعي"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-[#C5A021]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">وصف الواجب والتعليمات:</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="أدخل نص السؤال والتوجيهات للطلاب..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-[#C5A021]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-700 block mb-1">الصف الدراسي:</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-[#C5A021]"
                  >
                    <option value="الصف السابع الأساسي">الصف السابع الأساسي</option>
                    <option value="الصف الثامن الأساسي">الصف الثامن الأساسي</option>
                    <option value="الصف التاسع الأساسي">الصف التاسع الأساسي</option>
                    <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-700 block mb-1">المادة الدراسية:</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-[#C5A021]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-700 block mb-1">موعد التسليم النهائي:</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-[#C5A021]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-700 block mb-1">الدرجة الكلية:</label>
                  <input
                    type="number"
                    min={1}
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-[#C5A021]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-mono font-bold"
              >
                إلغاء
              </button>

              <button
                onClick={handleCreateAssignment}
                disabled={creating || !newTitle.trim()}
                className="px-5 py-2 bg-[#1A365D] hover:bg-[#122846] text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow"
              >
                <Plus className="w-4 h-4 text-[#C5A021]" />
                <span>{creating ? "جاري الإسناد..." : "إسناد الواجب للطلاب"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
