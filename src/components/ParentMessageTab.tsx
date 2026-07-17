import React, { useState } from "react";
import { ParentMessage, Language } from "../types";
import { Send, Copy, Check, Download, RefreshCw, Mail, HelpCircle, Heart } from "lucide-react";

interface ParentMessageTabProps {
  lang: Language;
}

export default function ParentMessageTab({ lang }: ParentMessageTabProps) {
  const isAr = lang === "ar";

  const [studentName, setStudentName] = useState(isAr ? "سليم علي محمد" : "Selim Ali Mohamed");
  const [parentRelation, setParentRelation] = useState(isAr ? "ولي أمر الطالب العزيز" : "Respected Parent / Guardian");
  const [statusType, setStatusType] = useState(isAr ? "ممتاز ومتفوق دراسياً" : "Outstanding academic excellence");
  const [subject, setSubject] = useState(isAr ? "اللغة العربية والإنتاج الأدبي" : "Arabic Language & Literature");
  const [focusPoints, setFocusPoints] = useState(
    isAr
      ? "توجيه الطالب للقراءة الحرة من الكتب الورقية والحد من استهلاك الهواتف والأجهزة الرقمية بالمنزل."
      : "Encouraging standard reading of books and practicing a digital detox at home."
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<ParentMessage | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setCopied(false);

    try {
      const response = await fetch("/api/gemini/parent-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          parentRelation,
          statusType,
          subject,
          focusPoints,
          language: lang,
        }),
      });

      if (!response.ok) {
        let errMsg = isAr ? "فشل توليد رسالة ولي الأمر." : "Failed to generate parent message";
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errData = await response.json();
            errMsg = errData.error || errMsg;
          } else {
            const txt = await response.text();
            errMsg = txt.substring(0, 300) || errMsg;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      setMessage(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate correspondence.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!message) return;
    const fullText = `الموضوع: ${message.letterSubject}\n\n${message.letterBody}\n\nنصيحة الشراكة المنزلية:\n${message.schoolHomeCooperationTip}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="parent-message-tab-content">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-charcoal">
          {isAr ? "مولد الرسائل التربوية لأولياء الأمور" : "AI Parent-School Correspondence Generator"}
        </h2>
        <p className="text-xs text-charcoal/70">
          {isAr
            ? "صغ خطابات وخطابات تواصل رسمية مع الآباء لتعزيز الشراكة بين المدرسة والبيت، والتركيز على سلوكيات الحد من تشتت الأجهزة."
            : "Draft wise, polished, professional letters to parents, encouraging standard home-school reading cooperation and offline habits."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Settings (5 cols) */}
        <form onSubmit={handleGenerateMessage} className="paper-card p-6 bg-white space-y-4 lg:col-span-5 text-xs font-mono">
          <div className="flex items-center gap-2 border-b pb-2">
            <Mail className="w-4 h-4 text-amber-gold" />
            <h3 className="font-serif font-bold text-sm text-charcoal">
              {isAr ? "تخصيص الرسالة" : "Letter Parameters"}
            </h3>
          </div>

          {/* Student Name */}
          <div className="space-y-1">
            <label className="block font-bold text-charcoal">{isAr ? "اسم الطالب الكامل:" : "Full Student Name:"}</label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 focus:outline-none"
            />
          </div>

          {/* Relation Heading */}
          <div className="space-y-1">
            <label className="block font-bold text-charcoal">{isAr ? "صيغة مناداة ولي الأمر:" : "Addressing Parent:"}</label>
            <input
              type="text"
              required
              value={parentRelation}
              onChange={(e) => setParentRelation(e.target.value)}
              placeholder={isAr ? "مثال: والد الطالب العزيز / والدي الطالب الفاضل" : "e.g. Respected Father of Selim"}
              className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 focus:outline-none"
            />
          </div>

          {/* Status type selection */}
          <div className="space-y-1">
            <label className="block font-bold text-charcoal">{isAr ? "حالة أداء أو سلوك الطالب:" : "Student Performance/Status:"}</label>
            <select
              value={statusType}
              onChange={(e) => setStatusType(e.target.value)}
              className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 focus:outline-none"
            >
              {isAr ? (
                <>
                  <option value="ممتاز ومتفوق دراسياً">ممتاز ومتفوق دراسياً</option>
                  <option value="يحتاج لتطوير مهارات القراءة الصامتة والمثابرة">يحتاج لتطوير مهارات القراءة الصامتة والمثابرة</option>
                  <option value="سلوك تشتت بسب الأجهزة وتأثير ذلك على المشاركة">سلوك تشتت بسب الأجهزة وتأثير ذلك على المشاركة</option>
                  <option value="إبداع وموهبة كتابية استثنائية تستحق الدعم">إبداع وموهبة كتابية استثنائية تستحق الدعم</option>
                  <option value="غياب متكرر وتأخر عن الطابور الصباحي">غياب متكرر وتأخر عن الطابور الصباحي</option>
                </>
              ) : (
                <>
                  <option value="Outstanding academic excellence">Outstanding academic excellence</option>
                  <option value="Needs improvement in classroom reading & focus">Needs improvement in classroom reading & focus</option>
                  <option value="Digital screen distraction impacting homework">Digital screen distraction impacting homework</option>
                  <option value="Exceptional literary creativity & writing skill">Exceptional literary creativity & writing skill</option>
                  <option value="Frequent absences impacting score progression">Frequent absences impacting score progression</option>
                </>
              )}
            </select>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <label className="block font-bold text-charcoal">{isAr ? "المادة / السياق التعليمي:" : "Subject / Academic Context:"}</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 focus:outline-none"
            />
          </div>

          {/* Focus Points */}
          <div className="space-y-1">
            <label className="block font-bold text-charcoal">{isAr ? "نقاط التركيز والتوجيه المنزلي:" : "Developmental Points & Goals:"}</label>
            <textarea
              value={focusPoints}
              onChange={(e) => setFocusPoints(e.target.value)}
              rows={4}
              className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 focus:outline-none font-sans text-xs leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full paper-btn-primary py-3 flex items-center justify-center gap-2 font-bold cursor-pointer"
          >
            <Send className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? (isAr ? "جاري صياغة الخطاب..." : "Formulating letter...") : (isAr ? "إنشاء وصياغة الخطاب" : "Draft Parent Letter")}
          </button>
        </form>

        {/* Display Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="paper-card p-4 bg-red-50 border-red-900 text-red-900 text-xs font-mono">
              <strong>Error:</strong> {error}
            </div>
          )}

          {!message && !loading && (
            <div className="paper-card p-12 bg-white text-center space-y-4">
              <Mail className="w-16 h-16 text-charcoal/30 mx-auto" />
              <h4 className="text-xl font-serif font-bold text-charcoal">
                {isAr ? "الظرف مغلق" : "Envelope Awaiting Input"}
              </h4>
              <p className="text-sm text-charcoal/70 max-w-md mx-auto">
                {isAr
                  ? "املأ بيانات الطالب وتخصيص الرسالة في اللوحة الجانبية، ثم انقر توليد للحصول على صياغة راقية وبليغة."
                  : "Customize parameters on the left and submit. The platform will output professional, respectful Arabic/English letters."}
              </p>
            </div>
          )}

          {loading && (
            <div className="paper-card p-12 bg-white text-center space-y-6 animate-pulse">
              <RefreshCw className="w-12 h-12 text-amber-gold animate-spin mx-auto" />
              <div className="space-y-2">
                <h4 className="text-lg font-serif font-bold text-charcoal">
                  {isAr ? "جاري نسج كلمات من المودة والتقدير..." : "Weaving words of respect & growth..."}
                </h4>
                <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
                  {isAr
                    ? "يقوم النظام بكتابة خطاب رسمي تربوي خالي من التعابير الآلية ومخصص بالكامل لتشجيع التواصل الإنساني والحد من الشاشات."
                    : "Formulating organic, mindful correspondence to establish high-cooperation partnerships."}
                </p>
              </div>
            </div>
          )}

          {message && (
            <div className="space-y-6 animate-fade-in">
              {/* Actual Letter Box */}
              <div className="paper-card p-8 bg-white space-y-6 border-t-8 border-t-amber-gold relative">
                {/* Visual Stamp */}
                <div className="absolute top-4 left-4 border-2 border-charcoal text-charcoal px-3 py-1 text-[10px] font-mono rounded uppercase rotate-6">
                  {isAr ? "وضاح للنشر" : "Waddah Pub"}
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono text-charcoal/50 uppercase tracking-wider">{isAr ? "الموضوع:" : "Subject:"}</span>
                  <h4 className="text-xl font-serif font-bold text-charcoal">
                    {message.letterSubject}
                  </h4>
                </div>

                <div className="h-[2px] bg-charcoal/10"></div>

                {/* Letter Body */}
                <div className="text-sm text-charcoal/90 leading-relaxed font-serif whitespace-pre-line">
                  {message.letterBody}
                </div>

                <div className="h-[2px] bg-charcoal/10"></div>

                {/* Cooperation Tip */}
                <div className="bg-[#FAF8F5] p-5 border border-charcoal/20 rounded space-y-2">
                  <div className="flex items-center gap-2 text-amber-gold font-bold text-xs font-mono">
                    <Heart className="w-4 h-4 fill-amber-gold" />
                    <span>{isAr ? "مبادرة التعاون الرقمي المنزلي والتربية الملموسة:" : "At-Home Offline Collaboration Initiative:"}</span>
                  </div>
                  <p className="text-xs text-charcoal/80 leading-relaxed italic font-serif">
                    {message.schoolHomeCooperationTip}
                  </p>
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={handleCopy}
                    className="paper-btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-800" /> : <Copy className="w-4 h-4" />}
                    {copied ? (isAr ? "تم نسخ الخطاب!" : "Copied!") : (isAr ? "نسخ الخطاب بالكامل" : "Copy Complete Letter")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
