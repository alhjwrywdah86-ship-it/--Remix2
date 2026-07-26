import React, { useState, useEffect } from "react";
import {
  Student,
  Assignment,
  AssignmentSubmission,
  OnlineQuiz,
  StudentGamificationState,
  Language
} from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import {
  BookOpen,
  Award,
  FileCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  TrendingUp,
  User,
  GraduationCap,
  Calendar,
  AlertCircle,
  FileText,
  Send,
  Star,
  Check
} from "lucide-react";

interface StudentPortalProps {
  lang: Language;
  studentId?: string;
  studentName?: string;
  currentUserName?: string;
  grade?: string;
}

export default function StudentPortal({
  lang,
  studentId = "st_student_1",
  studentName = "عمر حسن التعزي",
  currentUserName,
  grade = "الصف التاسع الأساسي"
}: StudentPortalProps) {
  const isAr = lang === "ar";
  const [activeTab, setActiveTab] = useState<"overview" | "assignments" | "quizzes" | "results" | "gamification">("overview");

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [quizzes, setQuizzes] = useState<OnlineQuiz[]>([]);
  const [gamification, setGamification] = useState<StudentGamificationState | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal for submitting assignment
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [studentId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assData, subData, qzData, gamData] = await Promise.all([
        fetchWithRetry<Assignment[]>("/api/assignments"),
        fetchWithRetry<AssignmentSubmission[]>(`/api/assignments/submissions?studentId=${studentId}`),
        fetchWithRetry<OnlineQuiz[]>("/api/quizzes"),
        fetchWithRetry<StudentGamificationState>(`/api/achievements/student?studentId=${studentId}`)
      ]);

      setAssignments(assData || []);
      setSubmissions(subData || []);
      setQuizzes(qzData || []);
      setGamification(gamData || null);
    } catch (err: any) {
      console.error("Error loading student portal data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmissionModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    const existing = submissions.find((s) => s.assignmentId === assignment.id);
    setSubmissionText(existing?.submissionText || "");
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment || !submissionText.trim()) return;

    setSubmitting(true);
    try {
      const result = await fetchWithRetry<AssignmentSubmission>("/api/assignments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: selectedAssignment.id,
          studentId,
          studentName,
          submissionText
        })
      });

      alert("تم تسليم الواجب بنجاح وتحليله بواسطة الذكاء الاصطناعي!");
      setSelectedAssignment(null);
      setSubmissionText("");
      fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "حدث خطأ أثناء تسليم الواجب.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans dir-rtl">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1A365D] via-[#2A4D7C] to-[#1A365D] text-white p-6 rounded-2xl shadow-xl border border-[#C5A021]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#C5A021] text-[#1A365D] rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg border-2 border-white/20">
            <GraduationCap className="w-10 h-10" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md text-[11px] font-mono font-bold">
                حساب طالب نشط
              </span>
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md text-[11px] font-mono font-bold">
                {grade}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-white mt-1">
              مرحباً بك يا {studentName} 🌟
            </h1>
            <p className="text-xs text-slate-200 mt-1">
              مساحتك التعليمية الشخصية لمتابعة الواجبات، الدروس، الاختبارات وشارات التميز.
            </p>
          </div>
        </div>

        {/* Gamification Stats Snippet */}
        {gamification && (
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/15 flex items-center gap-4 text-xs font-mono">
            <div className="text-center">
              <span className="text-amber-300 block text-lg font-bold">Lvl {gamification.level}</span>
              <span className="text-[10px] text-slate-300">المستوى الحالي</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <span className="text-amber-300 block text-lg font-bold">{gamification.points} pts</span>
              <span className="text-[10px] text-slate-300">مجموع النقاط</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center">
              <span className="text-amber-300 block text-lg font-bold">{gamification.badges.length}</span>
              <span className="text-[10px] text-slate-300">الأوسمة والشارات</span>
            </div>
          </div>
        )}
      </div>

      {/* Portal Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "overview"
              ? "bg-[#1A365D] text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#C5A021]" />
          <span>المواد والدروس</span>
        </button>

        <button
          onClick={() => setActiveTab("assignments")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "assignments"
              ? "bg-[#1A365D] text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <FileCheck className="w-4 h-4 text-purple-400" />
          <span>الواجبات والتسليمات ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("quizzes")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "quizzes"
              ? "bg-[#1A365D] text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>الاختبارات الإلكترونية ({quizzes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("results")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "results"
              ? "bg-[#1A365D] text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>سجل النتائج والتقدم</span>
        </button>

        <button
          onClick={() => setActiveTab("gamification")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "gamification"
              ? "bg-[#1A365D] text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Award className="w-4 h-4 text-amber-300" />
          <span>شجرتي وإنجازاتي</span>
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW & SUBJECTS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-mono text-slate-500 font-bold block">اللغة العربية والدروس:</span>
              <h3 className="font-serif font-bold text-base text-[#1A365D]">الوحدة الثالثة: النصوص الأدبية والقواعد</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                دروس المفعول به المطلق، الرسم القرآني، والتعبير الإبداعي مع تدريبات شاملة.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 8 دروس مكتملة من أصل 10
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-mono text-slate-500 font-bold block">العلوم العامة والفيزياء:</span>
              <h3 className="font-serif font-bold text-base text-[#1A365D]">الوحدة الثانية: الحركة والقوة والكهرباء</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                تجارب افتراضية في التوصيل على التوالي والتوازي وقوانين نيوتن.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 5 دروس مكتملة من أصل 6
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-mono text-slate-500 font-bold block">التربية الإسلامية والقرآن:</span>
              <h3 className="font-serif font-bold text-base text-[#1A365D]">سورة الفتح وتفسير الآيات الكريمة</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                أحكام التجويد (المدود والإدغام) مع نماذج تلاوة صوتية بالذكاء الاصطناعي.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 10 دروس مكتملة بالكامل
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ASSIGNMENTS */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#1A365D]">
              قائمة الواجبات المدرسية المطلوبة:
            </h3>
            <span className="text-xs font-mono text-slate-500">
              إجمالي الواجبات المتاحة: {assignments.length}
            </span>
          </div>

          <div className="space-y-3">
            {assignments.map((ass) => {
              const submission = submissions.find((s) => s.assignmentId === ass.id);
              return (
                <div
                  key={ass.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[#C5A021] transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber-100 text-[#1A365D] font-mono text-[10px] font-bold rounded">
                        {ass.subject} - {ass.grade}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        المعلم: {ass.teacherName}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#1A365D]">{ass.title}</h4>
                    <p className="text-xs text-slate-600 font-sans">{ass.description}</p>

                    <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A021]" /> تاريخ التسليم: {ass.dueDate}
                      </span>
                      <span>الدرجة الكلية: {ass.totalPoints} نقطة</span>
                    </div>
                  </div>

                  {/* Submission Status */}
                  <div className="flex flex-col items-end gap-2 self-stretch md:self-auto justify-between">
                    {submission ? (
                      <div className="text-end space-y-1">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-mono font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> تم التسليم (درجة: {submission.score ?? "تحت التصحيح"} / {ass.totalPoints})
                        </span>

                        {submission.aiAnalysis && (
                          <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-[11px] text-slate-700 max-w-sm mt-1">
                            <span className="font-bold text-[#1A365D] block font-serif">
                              ✨ التغذية الراجعة الذكية للحل:
                            </span>
                            <p>{submission.aiAnalysis.suggestedFeedback}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenSubmissionModal(ass)}
                        className="px-4 py-2 bg-[#1A365D] hover:bg-[#122846] text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <Send className="w-3.5 h-3.5 text-[#C5A021]" />
                        <span>رفع وتسليم الحل الآن</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: QUIZZES */}
      {activeTab === "quizzes" && (
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#1A365D]">الاختبارات الإلكترونية المتاحة:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((qz) => (
              <div key={qz.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-mono text-xs font-bold rounded-lg">
                    {qz.subject} - {qz.classroomName}
                  </span>
                  <span className="text-xs font-mono text-slate-500">المدة: {qz.durationMinutes} دقيقة</span>
                </div>

                <h4 className="font-serif font-bold text-base text-[#1A365D]">{qz.title}</h4>
                <p className="text-xs text-slate-600">عدد الأسئلة: {qz.questions?.length || 0} أسئلة متنوعة.</p>

                <button
                  onClick={() => alert(`بدء الاختبار الإلكتروني: ${qz.title}`)}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold font-mono rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>دخول الاختبار الإلكتروني الآن</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: GAMIFICATION */}
      {activeTab === "gamification" && gamification && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1A365D] flex items-center gap-2">
              <Award className="w-6 h-6 text-[#C5A021]" />
              <span>شارات الإنجاز والتميز المكتسبة:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {gamification.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 flex items-start gap-3"
                >
                  <div className="w-10 h-10 bg-[#C5A021] text-white rounded-xl flex items-center justify-center font-bold text-xl shadow">
                    {badge.icon || "🏆"}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1A365D]">{badge.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{badge.description}</p>
                    <span className="text-[10px] font-mono text-amber-700 font-bold block mt-1">
                      +{badge.pointsValue} نقطة إنجاز
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="font-serif font-bold text-lg text-[#1A365D] border-b pb-2">
              تسليم واجب: {selectedAssignment.title}
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-700 block">نص إجابة وحل الواجب:</label>
              <textarea
                rows={5}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="اكتب إجابتك هنا بدقة..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-[#C5A021] focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedAssignment(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-mono font-bold"
              >
                إلغاء
              </button>

              <button
                onClick={handleSubmitAssignment}
                disabled={submitting || !submissionText.trim()}
                className="px-5 py-2 bg-[#1A365D] hover:bg-[#122846] text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow"
              >
                <Send className="w-3.5 h-3.5 text-[#C5A021]" />
                <span>{submitting ? "جاري الحفظ والتسليم..." : "إرسال الحل الآن"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
