import React, { useState } from "react";
import { Student } from "../types";
import {
  MessageSquare,
  X,
  Send,
  Copy,
  Check,
  Sparkles,
  Smartphone,
  Eye,
  FileText,
  User,
  BookOpen,
  Award,
  CheckCircle2,
  RefreshCw,
  Share2,
  ArrowRight
} from "lucide-react";

interface ParentMessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  classroomSubject?: string;
  isAr?: boolean;
}

export default function ParentMessagingModal({
  isOpen,
  onClose,
  student,
  classroomSubject = "اللغة العربية",
  isAr = true,
}: ParentMessagingModalProps) {
  if (!isOpen || !student) return null;

  const [step, setStep] = useState<"form" | "preview">("form");
  const [subject, setSubject] = useState(classroomSubject || "اللغة العربية");
  const [period, setPeriod] = useState("التقييم المستمر - الفصل الدراسي الأول");
  
  // Ratings & Assessment
  const [generalGrade, setGeneralGrade] = useState("ممتاز (أ)");
  const [attendance, setAttendance] = useState("مواظب ومستمر بالكامل دون غياب");
  const [participation, setParticipation] = useState("تفاعل متميز وإجابات نموذجية");
  const [homework, setHomework] = useState("مؤدى بدقة وإتقان في الموعد المحدد");
  
  // Narrative Fields
  const [strengths, setStrengths] = useState(
    "التفوق في الاستيعاب القرائي والمشاركة الصفية الفعالة والالتزام بالسلوك القويم والهدوء."
  );
  const [areasForImprovement, setAreasForImprovement] = useState(
    "العناية بتطبيق قواعد الإملاء والنحو والتعبير الكتابي بانتظام."
  );
  const [recommendations, setRecommendations] = useState(
    "تخصيص 15-20 دقيقة يومياً للقراءة الجهرية ومراجعة الدروس اليومية بالمنزل مع الأهل."
  );
  const [teacherNotes, setTeacherNotes] = useState(
    student.notes || "طالب مجتهد ومتميز، ونأمل الاستمرار على هذا المستوى العالي."
  );

  // States for feedback & AI
  const [copied, setCopied] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Formatted Report Text
  const formattedReport = `📋 تقرير متابعة مستوى الطالب
════════════════════════════
👤 اسم الطالب: ${student.name}
📚 المادة: ${subject}
📅 الفترة الدراسية: ${period}
⭐ المستوى العام: ${generalGrade}

📊 عناصر التقييم والمتابعة:
• الحضور والالتزام: ${attendance}
• المشاركة الصفية: ${participation}
• أداء الواجبات: ${homework}

🌟 نقاط القوة والتميز:
${strengths}

🎯 الجوانب التي تحتاج إلى تحسين:
${areasForImprovement}

💡 توصيات للمتابعة المنزلية:
${recommendations}

📝 ملاحظات المعلم:
${teacherNotes}

════════════════════════════
مع خالص التحية والتقدير،
إدارة المدرسة والمعلم الفاضل 🌸`;

  const handleCopyText = () => {
    try {
      navigator.clipboard.writeText(formattedReport);
      setCopied(true);
      setStatusMsg("تم نسخ نص التقرير الشامل بنجاح إلى الحافظة!");
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      setStatusMsg("تعذر النسخ التلقائي، يمكنك اختيار النص ونسخه يدوياً.");
    }
  };

  const handleSendWhatsApp = () => {
    try {
      navigator.clipboard.writeText(formattedReport);
      setCopied(true);
    } catch (e) {
      console.error(e);
    }

    const encoded = encodeURIComponent(formattedReport);
    const waUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, "_blank");

    setStatusMsg("تم فتح WhatsApp ونسخ التقرير! اختر ولي الأمر من جهات الاتصال وأرسل الرسالة.");
  };

  const handleSendSMS = () => {
    try {
      navigator.clipboard.writeText(formattedReport);
      setCopied(true);
    } catch (e) {
      console.error(e);
    }

    const encoded = encodeURIComponent(formattedReport);
    const smsUrl = `sms:?body=${encoded}`;
    window.location.href = smsUrl;

    setStatusMsg("تم فتح تطبيق الرسائل النصية (SMS) ونسخ التقرير بنجاح.");
  };

  const handleAIEnhance = async () => {
    setGeneratingAI(true);
    try {
      const res = await fetch("/api/gemini/parent-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: student.name,
          statusType: generalGrade,
          subject: subject,
          focusPoints: `${strengths} | ${areasForImprovement} | ${recommendations}`,
          language: isAr ? "ar" : "en",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.letterBody) {
          setTeacherNotes(data.letterBody);
          setStatusMsg("تم صياغة الملاحظات بنجاح بواسطة الذكاء الاصطناعي Gemini!");
        }
      }
    } catch (err) {
      console.error("AI enhancement failed", err);
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto dir-rtl font-sans">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#1A365D] text-white p-5 flex items-center justify-between border-b border-[#C5A021]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold shadow">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                <span>مراسلة ولي أمر الطالب:</span>
                <span className="text-[#C5A021] font-sans font-bold">{student.name}</span>
              </h3>
              <p className="text-[11px] text-slate-300">
                إعداد تقرير شامل عن المستوى الأكاديمي والسلوكي وإرساله مباشرة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification Banner */}
        {statusMsg && (
          <div className="bg-emerald-600 text-white p-3 px-5 text-xs font-bold flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{statusMsg}</span>
            </div>
            <button onClick={() => setStatusMsg(null)} className="text-white hover:text-emerald-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step Indicator Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs font-mono font-bold">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStep("form")}
              className={`flex items-center gap-1.5 pb-1 border-b-2 transition-all cursor-pointer ${
                step === "form"
                  ? "border-[#1A365D] text-[#1A365D]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>1. إعداد تفاصيل التقرير</span>
            </button>

            <button
              onClick={() => setStep("preview")}
              className={`flex items-center gap-1.5 pb-1 border-b-2 transition-all cursor-pointer ${
                step === "preview"
                  ? "border-[#1A365D] text-[#1A365D]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>2. معاينة وخيارات الإرسال</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-500">
            {step === "form" ? "خطوة 1 من 2" : "خطوة 2 من 2"}
          </span>
        </div>

        {/* STEP 1: FORM INPUTS */}
        {step === "form" && (
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subject */}
              <div>
                <label className="block font-bold text-[#1A365D] mb-1">المادة الدراسية</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                />
              </div>

              {/* Period */}
              <div>
                <label className="block font-bold text-[#1A365D] mb-1">الفترة الدراسية</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                >
                  <option value="التقييم المستمر - الفصل الدراسي الأول">التقييم المستمر - الفصل الدراسي الأول</option>
                  <option value="الشهر الأول - الفصل الأول">الشهر الأول - الفصل الأول</option>
                  <option value="الشهر الثاني - الفصل الأول">الشهر الثاني - الفصل الأول</option>
                  <option value="الفصل الدراسي الأول">الفصل الدراسي الأول كامل</option>
                  <option value="التقرير الأسبوعي للمتابعة">التقرير الأسبوعي للمتابعة</option>
                </select>
              </div>
            </div>

            {/* Assessment Ratings */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#1A365D] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#C5A021]" />
                <span>المستوى العام وعناصر التقييم</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المستوى العام للطالب</label>
                  <select
                    value={generalGrade}
                    onChange={(e) => setGeneralGrade(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="ممتاز (أ)">ممتاز (أ)</option>
                    <option value="جيد جداً (ب)">جيد جداً (ب)</option>
                    <option value="جيد (ج)">جيد (ج)</option>
                    <option value="يحتاج إلى دعم ومتابعة (د)">يحتاج إلى دعم ومتابعة (د)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الحضور والالتزام</label>
                  <select
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="مواظب ومستمر بالكامل دون غياب">مواظب ومستمر بالكامل دون غياب</option>
                    <option value="حضور منتظم مع تأخير بسيط أحياناً">حضور منتظم مع تأخير بسيط أحياناً</option>
                    <option value="غياب متكرر يدعو للمتابعة">غياب متكرر يدعو للمتابعة</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">المشاركة الصفية</label>
                  <select
                    value={participation}
                    onChange={(e) => setParticipation(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="تفاعل متميز وإجابات نموذجية">تفاعل متميز وإجابات نموذجية</option>
                    <option value="مشاركة متوسطة ومقبولة">مشاركة متوسطة ومقبولة</option>
                    <option value="خجول ويحتاج للتشجيع المستمر">خجول ويحتاج للتشجيع المستمر</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">أداء الواجبات المنزلية</label>
                  <select
                    value={homework}
                    onChange={(e) => setHomework(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="مؤدى بدقة وإتقان في الموعد المحدد">مؤدى بدقة وإتقان في الموعد المحدد</option>
                    <option value="تسليم منتظم مع بعض الأخطاء البسيطة">تسليم منتظم مع بعض الأخطاء البسيطة</option>
                    <option value="تأخر أو تقصير في بعض الواجبات">تأخر أو تقصير في بعض الواجبات</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Qualitative Narrative Textareas */}
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-emerald-800 mb-1">🌟 نقاط القوة والتميز</label>
                <textarea
                  rows={2}
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-amber-800 mb-1">🎯 الجوانب التي تحتاج إلى تحسين</label>
                <textarea
                  rows={2}
                  value={areasForImprovement}
                  onChange={(e) => setAreasForImprovement(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-blue-800 mb-1">💡 توصيات للمتابعة المنزلية</label>
                <textarea
                  rows={2}
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-800">📝 ملاحظات المعلم التخصيصية</label>
                  <button
                    type="button"
                    onClick={handleAIEnhance}
                    disabled={generatingAI}
                    className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {generatingAI ? (
                      <RefreshCw className="w-3 h-3 animate-spin text-purple-700" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-purple-700" />
                    )}
                    <span>صياغة راقية بـ Gemini</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Next Button */}
            <div className="pt-4 border-t flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={() => setStep("preview")}
                className="px-6 py-2.5 bg-[#1A365D] hover:bg-[#2A4A7F] text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>معاينة التقرير واختيار طريقة الإرسال</span>
                <ArrowRight className="w-4 h-4 text-[#C5A021] rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PREVIEW & SENDING */}
        {step === "preview" && (
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs font-sans">
            {/* Visual Report Card Preview */}
            <div className="bg-[#FAF8F5] border-2 border-[#1A365D]/20 rounded-2xl p-5 space-y-3 font-serif relative shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-300 pb-3 font-mono">
                <span className="text-[10px] bg-[#1A365D] text-white px-2.5 py-0.5 rounded-md font-bold">
                  تقرير رسمي لولي الأمر
                </span>
                <span className="text-[11px] text-slate-500 font-bold">
                  التاريخ: {new Date().toLocaleDateString("ar-YE")}
                </span>
              </div>

              <div className="whitespace-pre-line text-slate-800 leading-relaxed font-serif text-xs bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                {formattedReport}
              </div>
            </div>

            {/* Direct Send Actions */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 font-sans">
              <h4 className="font-serif font-bold text-sm text-[#1A365D] flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#C5A021]" />
                <span>اختر طريقة الإرسال لولي أمر الطالب:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* WhatsApp Button */}
                <button
                  onClick={handleSendWhatsApp}
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex flex-col items-center justify-center gap-1.5 shadow transition-all cursor-pointer group active:scale-95"
                >
                  <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>إرسال عبر WhatsApp</span>
                  <span className="text-[10px] text-emerald-200 font-normal">فتح واتساب جهات الاتصال</span>
                </button>

                {/* SMS Button */}
                <button
                  onClick={handleSendSMS}
                  className="p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold flex flex-col items-center justify-center gap-1.5 shadow transition-all cursor-pointer group active:scale-95"
                >
                  <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>رسالة نصية SMS</span>
                  <span className="text-[10px] text-blue-200 font-normal">تطبيق الرسائل بالهاتف</span>
                </button>

                {/* Copy Text Only */}
                <button
                  onClick={handleCopyText}
                  className="p-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold flex flex-col items-center justify-center gap-1.5 shadow transition-all cursor-pointer group active:scale-95"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  <span>{copied ? "تم نسخ التقرير!" : "نسخ نص التقرير"}</span>
                  <span className="text-[10px] text-slate-300 font-normal">للحافظة بدون إرسال مباشر</span>
                </button>
              </div>
            </div>

            {/* Back to Edit Button */}
            <div className="pt-2 border-t flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowRight className="w-4 h-4" />
                <span>تعديل التقرير</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
