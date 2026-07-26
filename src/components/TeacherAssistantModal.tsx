import React, { useState } from "react";
import { Language, TeacherProfile } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import {
  Sparkles,
  Bot,
  X,
  Send,
  BookOpen,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  MessageSquare
} from "lucide-react";

import { getCurriculumByCode } from "../data/regionalCurricula";

interface AdvisorResult {
  answer: string;
  practicalTips: string[];
  suggestedActivities: string[];
  assessmentIdeas: string[];
  citations?: string[];
}

interface TeacherAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  teacherProfile?: TeacherProfile;
  activeCountryCode?: string;
}

export default function TeacherAssistantModal({
  isOpen,
  onClose,
  lang,
  teacherProfile,
  activeCountryCode = "YE"
}: TeacherAssistantModalProps) {
  if (!isOpen) return null;

  const isAr = lang === "ar";
  const activeCurr = getCurriculumByCode(activeCountryCode);

  const [subject, setSubject] = useState("اللغة العربية");
  const [grade, setGrade] = useState("الصف التاسع الأساسي");
  const [lesson, setLesson] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdvisorResult | null>(null);

  const quickQuestions = [
    "كيف أشرح هذا الدرس بأسلوب حركي ممتع؟",
    "اقترح نشاطاً صفياً للتعلم التعاوني بدون شاشات.",
    "كيف أعالج ضعف استيعاب الطلاب في هذا المفهوم؟",
    "اعطني 3 أسئلة تقويم تكويني للتفكير العالي.",
    "كيف أربط أهداف هذا الدرس بحياة الطلاب اليومية؟"
  ];

  const handleConsult = async (qText?: string) => {
    const queryToUse = qText || question;
    if (!queryToUse.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await fetchWithRetry<any>("/api/ai/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryToUse,
          grade,
          subject,
          teacherProfile,
          country: activeCurr.countryNameAr,
          curriculumGuidelines: activeCurr.aiPromptGuidelines
        })
      });

      setResult({
        answer: data.text || data.answer || "تمت استجابة وكيل المعلم الذكي بنجاح.",
        practicalTips: data.practicalTips || [],
        suggestedActivities: data.suggestedActivities || [],
        assessmentIdeas: data.assessmentIdeas || []
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || "حدث خطأ في استشارة المساعد التربوي.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#1A365D] p-5 text-white flex items-center justify-between border-b border-[#C5A021]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold">مساعد المعلم الذكي والتربوي</h2>
              <p className="text-xs text-slate-300">
                استشارات تربوية وبيداغوجية فورية مرابطة بالنص المنهجي واستراتيجيات التدريس الحديثة.
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
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="text-[11px] font-mono text-slate-600 block mb-1">المادة:</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-[#C5A021]"
              >
                <option value="اللغة العربية">اللغة العربية</option>
                <option value="التربية الإسلامية">التربية الإسلامية والقرآن الكريم</option>
                <option value="العلوم">العلوم والفيزياء والكيمياء</option>
                <option value="الرياضيات">الرياضيات</option>
                <option value="الاجتماعيات">الاجتماعيات والتاريخ</option>
                <option value="الحاسوب">الحاسوب وتكنولوجيا المعلومات</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-600 block mb-1">الصف:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-[#C5A021]"
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
              <label className="text-[11px] font-mono text-slate-600 block mb-1">الدرس (اختياري):</label>
              <input
                type="text"
                value={lesson}
                onChange={(e) => setLesson(e.target.value)}
                placeholder="عنوان الدرس..."
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-[#C5A021]"
              />
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono text-slate-500 block font-semibold">أسئلة شائعة وسريعة:</span>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuestion(q);
                    handleConsult(q);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-amber-50 hover:text-[#1A365D] hover:border-[#C5A021] text-slate-700 border border-slate-200 rounded-lg text-xs font-sans transition-all cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Question Input */}
          <div className="relative">
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="اطرح استفسارك التربوي هنا... (مثال: كيف أنظم أنشطة تفاعلية للدرس؟ أو كيف أقوم أداء الطلاب؟)"
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-[#C5A021] focus:bg-white transition-all resize-none"
            />
            <button
              onClick={() => handleConsult()}
              disabled={loading || !question.trim()}
              className="absolute bottom-3 left-3 px-4 py-2 bg-[#1A365D] hover:bg-[#122846] disabled:opacity-40 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5A021]" />
              ) : (
                <Send className="w-3.5 h-3.5 text-[#C5A021]" />
              )}
              <span>إرسال الاستفسار</span>
            </button>
          </div>

          {/* Consultation Result Display */}
          {result && (
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 font-sans text-slate-800">
              <div className="border-b border-slate-200 pb-3 flex items-center gap-2 text-[#1A365D]">
                <Lightbulb className="w-5 h-5 text-[#C5A021]" />
                <h3 className="font-serif font-bold text-base">التوجيه التربوي والبيداغوجي:</h3>
              </div>

              <div className="text-xs md:text-sm leading-relaxed whitespace-pre-line text-slate-700 bg-white p-4 rounded-lg border border-slate-200">
                {result.answer}
              </div>

              {/* Practical Tips */}
              {result.practicalTips && result.practicalTips.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[#1A365D] font-mono">💡 نصائح تطبيقية للمعلم:</h4>
                  <ul className="space-y-1 text-xs text-slate-600 pr-4 list-disc">
                    {result.practicalTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggested Activities */}
              {result.suggestedActivities && result.suggestedActivities.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-amber-700 font-mono">🎲 أنشطة صفية تفاعلية مقترحة:</h4>
                  <ul className="space-y-1 text-xs text-slate-600 pr-4 list-disc">
                    {result.suggestedActivities.map((act, idx) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Assessment Ideas */}
              {result.assessmentIdeas && result.assessmentIdeas.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-emerald-700 font-mono">📝 أفكار وأساليب تقويم:</h4>
                  <ul className="space-y-1 text-xs text-slate-600 pr-4 list-disc">
                    {result.assessmentIdeas.map((idea, idx) => (
                      <li key={idx}>{idea}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
