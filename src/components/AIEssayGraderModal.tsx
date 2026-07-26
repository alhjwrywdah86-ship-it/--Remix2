import React, { useState } from "react";
import { EssayGradingResult, Language } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import {
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  Award,
  RefreshCw,
  Check,
  Edit3,
  HelpCircle,
  FileText
} from "lucide-react";

interface AIEssayGraderModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialQuestionText?: string;
  initialModelAnswer?: string;
  initialStudentAnswer?: string;
  maxPoints?: number;
  onGradeApproved?: (grading: EssayGradingResult) => void;
}

export default function AIEssayGraderModal({
  isOpen,
  onClose,
  lang,
  initialQuestionText = "اذكر أهمية القراءة الواعية في صقل الشخصية وتنمية التفكير الناقد.",
  initialModelAnswer = "توسع القراءة الواعية مدارك الفرد، وتنمي الحصيلة اللغوية، وتكسبه قدرة على تحليل الأفكار ونقد الشبهات والموازنة بين الأدلة.",
  initialStudentAnswer = "تساعد القراءة الفرد على التفكير والتعلم وزيادة مفرداته اللغوية ومعرفة العلوم المختلفة.",
  maxPoints = 5,
  onGradeApproved
}: AIEssayGraderModalProps) {
  if (!isOpen) return null;

  const isAr = lang === "ar";

  const [questionText, setQuestionText] = useState(initialQuestionText);
  const [modelAnswer, setModelAnswer] = useState(initialModelAnswer);
  const [studentAnswer, setStudentAnswer] = useState(initialStudentAnswer);
  const [points, setPoints] = useState(maxPoints);

  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState<EssayGradingResult | null>(null);
  const [teacherScoreOverride, setTeacherScoreOverride] = useState<number | null>(null);

  const handleGrade = async () => {
    if (!studentAnswer.trim() || !questionText.trim()) return;

    setLoading(true);
    setGrading(null);
    setTeacherScoreOverride(null);

    try {
      const data = await fetchWithRetry<EssayGradingResult>("/api/ai/grade-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText,
          modelAnswer,
          studentAnswer,
          maxPoints: points
        })
      });

      setGrading(data);
      setTeacherScoreOverride(data.suggestedScore);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "حدث خطأ أثناء تصحيح الإجابة بالذكاء الاصطناعي.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    if (!grading) return;
    const finalResult: EssayGradingResult = {
      ...grading,
      suggestedScore: teacherScoreOverride !== null ? teacherScoreOverride : grading.suggestedScore
    };

    if (onGradeApproved) {
      onGradeApproved(finalResult);
    }
    alert("تم تدوين واعتمد درجة وملاحظة التصحيح بنجاح!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#1A365D] p-5 text-white flex items-center justify-between border-b border-[#C5A021]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white">
                المصحح الذكي للإجابات النصية والمقالية
              </h2>
              <p className="text-xs text-slate-300">
                تقييم موضوعي نير بقيم المعنى والأفكار مع ملاحظات تربوية مشجعة للطالب.
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
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Form Controls */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="text-xs font-mono font-bold text-slate-700 block mb-1">نص السؤال المقالي:</label>
              <textarea
                rows={2}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="أدخل نص السؤال..."
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-sans outline-none focus:border-[#C5A021]"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                الإجابة النموذجية أو عناصر التصحيح الأساسية:
              </label>
              <textarea
                rows={2}
                value={modelAnswer}
                onChange={(e) => setModelAnswer(e.target.value)}
                placeholder="أدخل المعايير أو الحل النموذجي المتوقع..."
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-sans outline-none focus:border-[#C5A021]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-3">
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">
                  إجابة الطالب النصية المكتوبة:
                </label>
                <textarea
                  rows={3}
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder="ضع نص إجابة الطالب هنا..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-sans outline-none focus:border-[#C5A021]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">الدرجة الكلية:</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-[#C5A021]"
                />
              </div>
            </div>
          </div>

          {/* Evaluate Button */}
          <button
            onClick={handleGrade}
            disabled={loading || !studentAnswer.trim()}
            className="w-full py-3 bg-[#1A365D] hover:bg-[#122846] disabled:opacity-40 text-white font-bold rounded-xl text-xs font-serif flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#C5A021]" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#C5A021]" />
            )}
            <span>{loading ? "جاري تصحيح وتقييم الإجابة بالذكاء الاصطناعي..." : "تصحيح إجابة الطالب الآن"}</span>
          </button>

          {/* Grading Result Display */}
          {grading && (
            <div className="bg-white p-5 rounded-2xl border-2 border-[#C5A021] shadow-lg space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#C5A021]" />
                  <h3 className="font-serif font-bold text-base text-[#1A365D]">نتيجة المصحح الذكي المقترحة:</h3>
                </div>

                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                  <span className="text-xs font-mono text-slate-600 font-bold">الدرجة المقترحة:</span>
                  <input
                    type="number"
                    min={0}
                    max={grading.maxPoints}
                    value={teacherScoreOverride !== null ? teacherScoreOverride : grading.suggestedScore}
                    onChange={(e) => setTeacherScoreOverride(Number(e.target.value))}
                    className="w-14 p-1 bg-white border border-amber-300 rounded font-mono font-bold text-sm text-[#1A365D] text-center"
                  />
                  <span className="text-xs font-mono font-bold text-slate-600">/ {grading.maxPoints}</span>
                </div>
              </div>

              {/* Feedback Note */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <span className="font-bold font-serif text-[#1A365D] block">📝 التغذية الراجعة والملاحظات:</span>
                <p className="text-slate-700 leading-relaxed font-sans">{grading.feedback}</p>
              </div>

              {/* Mistake Reason */}
              {grading.mistakeReason && (
                <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs text-rose-800 space-y-1">
                  <span className="font-bold font-mono flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> سبب خصم الدرجة الكلية:
                  </span>
                  <p className="font-sans">{grading.mistakeReason}</p>
                </div>
              )}

              {/* Strengths */}
              {grading.strengths && grading.strengths.length > 0 && (
                <div className="space-y-1 text-xs">
                  <span className="font-bold font-mono text-emerald-800">✔ نقاط القوة برسالته:</span>
                  <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                    {grading.strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Keywords Found */}
              {grading.keywordsFound && grading.keywordsFound.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="text-slate-500 font-bold">المفاهيم الصحيحة المكتشفة:</span>
                  <div className="flex flex-wrap gap-1">
                    {grading.keywordsFound.map((kw, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Teacher Confirmation Action */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleApprove}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Check className="w-4 h-4" />
                  <span>اعتماد الدرجة والملاحظة في سجل الطالب</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
