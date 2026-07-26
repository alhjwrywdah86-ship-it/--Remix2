import React, { useState, useEffect } from "react";
import { OnlineQuiz, StudentQuizSubmission, UserRole } from "../types";
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  Send,
  Sparkles,
  HelpCircle,
  Play,
  RotateCcw,
  Check
} from "lucide-react";

interface StudentQuizPortalProps {
  isAr: boolean;
  userRole: UserRole;
  studentName?: string;
}

export default function StudentQuizPortal({
  isAr,
  userRole,
  studentName = "محمد علي الخولاني",
}: StudentQuizPortalProps) {
  const [quizzes, setQuizzes] = useState<OnlineQuiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<OnlineQuiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submissionResult, setSubmissionResult] = useState<StudentQuizSubmission | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionsList, setSubmissionsList] = useState<StudentQuizSubmission[]>([]);

  const loadQuizzes = () => {
    fetch("/api/quizzes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setQuizzes(data);
      })
      .catch((err) => console.error("Error loading quizzes:", err));
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  // Timer Countdown Effect
  useEffect(() => {
    if (!activeQuiz || timeLeft <= 0 || submissionResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, timeLeft, submissionResult]);

  const handleStartQuiz = (quiz: OnlineQuiz) => {
    setActiveQuiz(quiz);
    setUserAnswers({});
    setSubmissionResult(null);
    setTimeLeft(quiz.durationMinutes * 60);
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz || isSubmitting) return;
    setIsSubmitting(true);

    fetch("/api/quizzes/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quizId: activeQuiz.id,
        studentId: "st-1",
        studentName,
        answers: userAnswers,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        setIsSubmitting(false);
        if (resData.success) {
          setSubmissionResult(resData.submission);
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        alert("فشل تسليم الاختبار");
      });
  };

  const handleSelectOption = (qIdx: number, option: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIdx]: option,
    }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1A365D] to-[#122846] text-white p-6 rounded-2xl border-b-4 border-[#C5A021] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold shadow-md">
            <FileCheck2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-[#C5A021]">
              {isAr ? "بوابة الاختبارات الإلكترونية والتصحيح الآلي" : "Online Student Quizzes"}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {isAr
                ? "حل الاختبارات المحددة بزمن، التصحيح الفوري التلقائي، وعرض النتيجة والتقييم الوجداني"
                : "Take timed online quizzes with automated instant scoring & feedback"}
            </p>
          </div>
        </div>

        {activeQuiz && !submissionResult && (
          <div className="bg-[#122846] px-4 py-2 rounded-xl border border-amber-400 flex items-center gap-2 font-mono text-amber-300 font-bold text-sm">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{isAr ? "الوقت المتبقي:" : "Time Left:"}</span>
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Mode 1: Quiz In-Progress Screen */}
      {activeQuiz && !submissionResult && (
        <div className="bg-white rounded-2xl border-2 border-[#C5A021] p-6 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <span className="bg-[#1A365D] text-white text-[10px] px-2.5 py-1 rounded font-bold font-mono">
                {activeQuiz.grade} | {activeQuiz.subject}
              </span>
              <h3 className="text-lg font-bold font-serif text-[#1A365D] mt-2">
                {activeQuiz.title}
              </h3>
            </div>

            <div className="text-end">
              <span className="text-xs text-slate-500 font-mono">
                {isAr ? "عدد الأسئلة:" : "Questions:"} {activeQuiz.questions.length}
              </span>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {activeQuiz.questions.map((q, idx) => {
              const selectedAns = userAnswers[idx];
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-start gap-2">
                    <span className="bg-[#1A365D] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 font-mono">
                      {idx + 1}
                    </span>
                    <p className="font-bold text-sm text-[#1A365D] font-serif leading-relaxed">
                      {q.questionText}
                    </p>
                  </div>

                  {/* MCQ Options */}
                  {q.type === "mcq" && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {q.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelectOption(idx, opt)}
                          className={`p-3 rounded-lg text-xs font-serif text-start border transition-all cursor-pointer flex items-center justify-between ${
                            selectedAns === opt
                              ? "bg-[#1A365D] text-white border-[#1A365D] font-bold shadow-sm"
                              : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                          }`}
                        >
                          <span>{opt}</span>
                          {selectedAns === opt && <Check className="w-4 h-4 text-[#C5A021]" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* True / False Options */}
                  {q.type === "true_false" && (
                    <div className="flex items-center gap-3 pt-2">
                      {["صحيح", "خطأ"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectOption(idx, opt)}
                          className={`px-6 py-2.5 rounded-lg text-xs font-bold font-serif border transition-all cursor-pointer flex items-center gap-2 ${
                            selectedAns === opt
                              ? "bg-[#1A365D] text-white border-[#1A365D] shadow-sm"
                              : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                          }`}
                        >
                          <span>{opt}</span>
                          {selectedAns === opt && <Check className="w-4 h-4 text-[#C5A021]" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Essay or Short Answer */}
                  {q.type === "essay" && (
                    <div className="pt-2">
                      <textarea
                        rows={2}
                        value={userAnswers[idx] || ""}
                        onChange={(e) => handleSelectOption(idx, e.target.value)}
                        placeholder={isAr ? "اكتب إجابتك هنا بدقة..." : "Write answer here..."}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-[#1A365D]"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t flex justify-between items-center">
            <button
              onClick={() => setActiveQuiz(null)}
              className="px-4 py-2 rounded-lg text-xs text-slate-600 bg-slate-100 hover:bg-slate-200"
            >
              {isAr ? "إلغاء والعودة" : "Cancel"}
            </button>

            <button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg text-xs font-bold text-[#1A365D] bg-[#C5A021] hover:bg-amber-400 flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isAr ? "تسليم الاختبار وتأكيد الإجابات" : "Submit Quiz"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Submission Result View */}
      {submissionResult && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500 p-8 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-md">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold font-serif text-[#1A365D]">
              {isAr ? "تم تسليم الاختبار وتصحيحه بنجاح!" : "Quiz Submitted Successfully!"}
            </h3>
            <p className="text-xs text-slate-600 font-serif">
              {isAr ? "النتيجة الإجمالية للطالب:" : "Student Score:"} <span className="font-bold text-[#1A365D]">{submissionResult.studentName}</span>
            </p>
          </div>

          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 inline-block min-w-[280px]">
            <div className="text-4xl font-extrabold font-mono text-emerald-800">
              {submissionResult.score} / {submissionResult.totalPoints}
            </div>
            <div className="text-sm font-bold font-mono text-emerald-600 mt-1">
              النسبة المئوية: {submissionResult.percentage}%
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-start space-y-2">
            <h4 className="font-bold text-xs text-[#1A365D] flex items-center gap-1.5 font-serif">
              <Sparkles className="w-4 h-4 text-[#C5A021]" />
              <span>{isAr ? "تقييم وتوجيه الذكاء الاصطناعي والمعلم:" : "Feedback:"}</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-serif">
              {submissionResult.teacherFeedback}
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                setActiveQuiz(null);
                setSubmissionResult(null);
              }}
              className="px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-[#1A365D] hover:bg-[#122846] cursor-pointer"
            >
              {isAr ? "العودة لقائمة الاختبارات المتاحة" : "Back to Quizzes"}
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: Published Quizzes List */}
      {!activeQuiz && !submissionResult && (
        <div className="space-y-4">
          <h3 className="text-base font-bold font-serif text-[#1A365D] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#C5A021]" />
            <span>{isAr ? "الاختبارات النشطة المتاحة للحل:" : "Available Quizzes:"}</span>
          </h3>

          {quizzes.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
              <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-sm text-[#1A365D]">
                {isAr ? "لا توجد اختبارات إلكترونية منشورة حالياً." : "No active quizzes."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map((q) => (
                <div
                  key={q.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#C5A021] shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-[#1A365D] text-white text-[10px] px-2 py-0.5 rounded font-bold font-mono">
                        {q.grade}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {q.durationMinutes} {isAr ? "دقيقة" : "mins"}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-[#1A365D] font-serif leading-snug">
                      {q.title}
                    </h4>

                    <p className="text-xs text-slate-600">
                      {isAr ? "الفصل المستهدف:" : "Target Class:"} <span className="font-bold">{q.classroomName}</span> | {isAr ? "عدد الأسئلة:" : "Questions:"} {q.questions.length}
                    </p>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(q)}
                    className="w-full py-2.5 bg-[#1A365D] hover:bg-[#122846] text-[#C5A021] font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isAr ? "بدء الاختبار الآن" : "Start Quiz"}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
