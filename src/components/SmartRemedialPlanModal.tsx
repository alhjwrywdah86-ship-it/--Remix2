import React, { useState } from "react";
import { RemedialPlanData, Language } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import {
  Sparkles,
  X,
  Target,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Clock,
  Printer,
  RefreshCw,
  FileText,
  AlertCircle
} from "lucide-react";

interface SmartRemedialPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialStudentName?: string;
  initialGrade?: string;
  initialSubject?: string;
  initialWeakSkill?: string;
}

export default function SmartRemedialPlanModal({
  isOpen,
  onClose,
  lang,
  initialStudentName = "",
  initialGrade = "الصف التاسع الأساسي",
  initialSubject = "اللغة العربية",
  initialWeakSkill = "التمريات الإملائية والإعراب السبوري"
}: SmartRemedialPlanModalProps) {
  if (!isOpen) return null;

  const isAr = lang === "ar";

  const [studentOrGroupName, setStudentOrGroupName] = useState(initialStudentName);
  const [grade, setGrade] = useState(initialGrade);
  const [subject, setSubject] = useState(initialSubject);
  const [weakSkill, setWeakSkill] = useState(initialWeakSkill);
  const [severityLevel, setSeverityLevel] = useState<"خفيف" | "متوسط" | "شديد">("متوسط");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<RemedialPlanData | null>(null);

  const handleGeneratePlan = async () => {
    if (!weakSkill.trim()) return;

    setLoading(true);
    try {
      const data = await fetchWithRetry<RemedialPlanData>("/api/ai/remedial-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentOrGroupName,
          grade,
          subject,
          weakSkill,
          severityLevel,
          notes
        })
      });

      setPlan(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "حدث خطأ أثناء توليد الخطة العلاجية.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#1A365D] p-5 text-white flex items-center justify-between border-b border-[#C5A021]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white">
                مولد الخطط العلاجية الذكية للطلاب المتعثرين
              </h2>
              <p className="text-xs text-slate-300">
                توليد خطط بيداغوجية مخصصة لعلاج المهارات الضعيفة بخطوات وتدريبات عملية.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                اسم الطالب أو المجموعة:
              </label>
              <input
                type="text"
                value={studentOrGroupName}
                onChange={(e) => setStudentOrGroupName(e.target.value)}
                placeholder="مثال: عمر التفسير / مجموعة الفرسان"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-sans outline-none focus:border-[#C5A021]"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-slate-700 block mb-1">الصف الدراسي:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-sans outline-none focus:border-[#C5A021]"
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
              <label className="text-xs font-mono font-bold text-slate-700 block mb-1">المادة الدراسية:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="مثال: اللغة العربية / الفيزياء"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-sans outline-none focus:border-[#C5A021]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                المهارة المنهجية الضعيفة المحددة:
              </label>
              <input
                type="text"
                value={weakSkill}
                onChange={(e) => setWeakSkill(e.target.value)}
                placeholder="مثال: التميز بين المرفوع والمجرور / الإملائي بالهمزة المتوسطة"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-sans outline-none focus:border-[#C5A021]"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-slate-700 block mb-1">درجة الصعوبة والضعف:</label>
              <select
                value={severityLevel}
                onChange={(e) => setSeverityLevel(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-sans outline-none focus:border-[#C5A021]"
              >
                <option value="خفيف">تعثر خفيف (يحتاج تدريب بسيط)</option>
                <option value="متوسط">تعثر متوسط (تشتت واستيعاب جزئي)</option>
                <option value="شديد">تعثر شديد (تدخل علاج كامل)</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGeneratePlan}
            disabled={loading || !weakSkill.trim()}
            className="w-full py-3 bg-[#1A365D] hover:bg-[#122846] disabled:opacity-40 text-white font-bold rounded-xl text-xs font-serif flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#C5A021]" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#C5A021]" />
            )}
            <span>{loading ? "جاري صياغة الخطة العلاجية بالذكاء الاصطناعي..." : "توليد الخطة العلاجية الذكية الآن"}</span>
          </button>

          {/* Result Display */}
          {plan && (
            <div className="bg-white p-6 rounded-2xl border-2 border-[#C5A021] shadow-lg space-y-5 animate-fade-in print:p-0 print:border-none">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-2">
                <div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 bg-amber-100 text-[#1A365D] rounded-md inline-block mb-1">
                    خطة علاجية مخصصة • {plan.severityLevel}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#1A365D]">
                    {plan.studentOrGroupName || "الطالب متعثر"} - {plan.subject} ({plan.grade})
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    المهارة المستهدفة بالعلاج: <strong className="text-slate-800">{plan.weakSkill}</strong>
                  </p>
                </div>

                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#1A365D] rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer self-start print:hidden"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C5A021]" />
                  <span>طباعة الخطة</span>
                </button>
              </div>

              {/* Goal */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-1">
                <h4 className="text-xs font-serif font-bold text-[#1A365D] flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#C5A021]" />
                  <span>الهدف العلاجي المباشر:</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">{plan.remedialGoal}</p>
              </div>

              {/* Remedial Steps */}
              <div className="space-y-2">
                <h4 className="text-xs font-serif font-bold text-[#1A365D] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>خطوات التنفيذ البيداغوجية:</span>
                </h4>
                <ol className="space-y-1.5 pr-4 text-xs text-slate-700 list-decimal font-sans">
                  {plan.remedialSteps?.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Suggested Activities */}
              <div className="space-y-2">
                <h4 className="text-xs font-serif font-bold text-[#1A365D] flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>الأنشطة والتدريبات الصفية المقترحة:</span>
                </h4>
                <ul className="space-y-1 pr-4 text-xs text-slate-700 list-disc font-sans">
                  {plan.suggestedActivities?.map((act, idx) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>

              {/* Practice Exercises */}
              {plan.practiceExercises && plan.practiceExercises.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-serif font-bold text-[#1A365D] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>تمارين تطبيقية جاهزة للتدريب والقياس:</span>
                  </h4>
                  <div className="space-y-2">
                    {plan.practiceExercises.map((ex, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                        <p className="font-bold text-slate-800">
                          {idx + 1}. {ex.question}
                        </p>
                        <p className="text-emerald-700 mt-1 text-[11px] font-mono">
                          ✔ مفتاح الحل: {ex.answerKey}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress Metric & Days */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 font-mono gap-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#C5A021]" />
                  <span>المدة المقدرة للتنفيذ: {plan.estimatedDays || 7} أيام</span>
                </div>
                <div>
                  معيار التحسن: <span className="text-[#1A365D] font-bold">{plan.progressMetrics}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
