import React, { useState } from "react";
import { CurriculumTipResult, Language } from "../types";
import { Book, Send, Sparkles, Compass, HelpCircle, Heart, Quote } from "lucide-react";

interface CurriculumGuideProps {
  lang: Language;
}

const YEMEN_GRADES_AR = [
  "الصف الأول الأساسي",
  "الصف الثاني الأساسي",
  "الصف الثالث الأساسي",
  "الصف الرابع الأساسي",
  "الصف الخامس الأساسي",
  "الصف السادس الأساسي",
  "الصف السابع الأساسي",
  "الصف الثامن الأساسي",
  "الصف التاسع الأساسي",
  "الصف الأول الثانوي",
  "الصف الثاني الثانوي - علمي",
  "الصف الثاني الثانوي - أدبي",
  "الصف الثالث الثانوي - علمي",
  "الصف الثالث الثانوي - أدبي",
];

const YEMEN_GRADES_EN = [
  "Grade 1 Primary",
  "Grade 2 Primary",
  "Grade 3 Primary",
  "Grade 4 Primary",
  "Grade 5 Primary",
  "Grade 6 Primary",
  "Grade 7 Primary",
  "Grade 8 Primary",
  "Grade 9 Primary",
  "Grade 10 Secondary",
  "Grade 11 - Scientific",
  "Grade 11 - Literary",
  "Grade 12 - Scientific",
  "Grade 12 - Literary",
];

export default function CurriculumGuide({ lang }: CurriculumGuideProps) {
  const isAr = lang === "ar";

  const [grade, setGrade] = useState(isAr ? YEMEN_GRADES_AR[8] : YEMEN_GRADES_EN[8]);
  const [subject, setSubject] = useState(isAr ? "اللغة العربية والإنشاء" : "Arabic Language & Grammar");
  const [query, setQuery] = useState(
    isAr
      ? "كيف يمكنني تبسيط شرح النحو العربي وجعل الطلاب يستمتعون بالكتاب المدرسي الورقي دون اللجوء للمحفزات الرقمية؟"
      : "How can I simplify teaching complex rules while fostering deep reading habits using textbooks?"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CurriculumTipResult | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/gemini/curriculum-tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          subject,
          query,
          language: lang,
        }),
      });

      if (!response.ok) {
        let errMsg = isAr ? "فشل استرجاع نصائح المنهج." : "Failed to query curriculum tips";
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
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to retrieve tips.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="curriculum-guide-tab-content">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-charcoal">
          {isAr ? "دليل مواءمة المناهج والمستشار التربوي" : "Yemeni & Arab Curriculum Alignment Hub"}
        </h2>
        <p className="text-xs text-charcoal/70">
          {isAr
            ? "مرشد تربوي ذكي متوافق بالكامل مع مناهج الجمهورية اليمنية والوطن العربي لتقديم المشورة والنصائح الصفية الفعّالة."
            : "Fully compatible with Yemeni standard guidelines and regional curricula to provide actionable classroom advice."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Settings Form (5 cols) */}
        <form onSubmit={handleAsk} className="paper-card p-6 bg-white space-y-4 lg:col-span-5 text-xs font-mono">
          <div className="flex items-center gap-2 border-b pb-2">
            <Book className="w-4 h-4 text-amber-gold" />
            <h3 className="font-serif font-bold text-sm text-charcoal">
              {isAr ? "تخصيص المشورة التربوية" : "Consultation Settings"}
            </h3>
          </div>

          {/* Grade selection */}
          <div className="space-y-1">
            <label className="block font-bold text-charcoal">{isAr ? "الصف والمرحلة الدراسية (مناهج اليمن):" : "Grade / Stage (Yemen guidelines):"}</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 focus:outline-none"
            >
              {(isAr ? YEMEN_GRADES_AR : YEMEN_GRADES_EN).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Subject selection */}
          <div className="space-y-1">
            <label className="block font-bold text-charcoal">{isAr ? "المادة التعليمية:" : "Academic Subject:"}</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 focus:outline-none"
            />
          </div>

          {/* Question Query */}
          <div className="space-y-1">
            <label className="block font-bold text-charcoal">
              {isAr ? "سؤالك التربوي أو التحدي الصفي:" : "Your Pedagogical Question or Challenge:"}
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              required
              className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 focus:outline-none font-sans text-xs leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full paper-btn-primary py-3 flex items-center justify-center gap-2 font-bold cursor-pointer"
          >
            <Compass className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? (isAr ? "جاري استشارة الحكمة التربوية..." : "Querying advisor...") : (isAr ? "استشارة المرشد الذكي" : "Ask Educational Guide")}
          </button>
        </form>

        {/* Display Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="paper-card p-4 bg-red-50 border-red-900 text-red-900 text-xs font-mono">
              <strong>Error:</strong> {error}
            </div>
          )}

          {!result && !loading && (
            <div className="paper-card p-12 bg-white text-center space-y-4">
              <Compass className="w-16 h-16 text-charcoal/30 mx-auto" />
              <h4 className="text-xl font-serif font-bold text-charcoal">
                {isAr ? "المستشار التربوي بانتظارك" : "Advisor Ready"}
              </h4>
              <p className="text-sm text-charcoal/70 max-w-md mx-auto">
                {isAr
                  ? "اختر الصف الدراسي وموضوع الدرس، واطرح تحدياً بيداغوجياً للحصول على توجيهات عملية متوافقة مع كتب اليمن وتطلعات وضاح الزليل."
                  : "Pick your grade guidelines, state your lesson topic, and ask any classroom challenge to receive rich offline tactics."}
              </p>
            </div>
          )}

          {loading && (
            <div className="paper-card p-12 bg-white text-center space-y-6 animate-pulse">
              <Sparkles className="w-12 h-12 text-amber-gold animate-spin mx-auto" />
              <div className="space-y-2">
                <h4 className="text-lg font-serif font-bold text-charcoal">
                  {isAr ? "جاري مواءمة كتب المنهج وبناء المشورة..." : "Aligning schoolbooks & formulating tips..."}
                </h4>
                <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
                  {isAr
                    ? "يقوم الذكاء الاصطناعي بربط دليل المعلم اليمني مع استراتيجيات التفكير والتركيز والتعليم اليدوي الملموس."
                    : "Connecting official school registers and physical activities designed to restore focus."}
                </p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in">
              {/* Main Guidance Card */}
              <div className="paper-card p-6 bg-white space-y-4 border-t-8 border-t-charcoal">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Compass className="w-5 h-5 text-amber-gold" />
                  <h4 className="font-serif font-bold text-lg text-charcoal">
                    {result.title}
                  </h4>
                </div>

                <div className="space-y-3">
                  <h5 className="font-serif font-bold text-amber-gold text-sm">
                    {isAr ? "الإرشادات البيداغوجية والخطوات المنهجية:" : "Actionable Pedagogical Advice:"}
                  </h5>
                  <ul className="space-y-2.5 list-none text-xs text-charcoal/90">
                    {result.keyPedagogicalAdvice.map((advice, i) => (
                      <li key={i} className="flex items-start gap-2 bg-[#FAF8F5] p-3 border border-charcoal/10 rounded">
                        <span className="font-mono text-amber-gold font-bold">[{i+1}]</span>
                        <span className="leading-relaxed font-sans">{advice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Classroom Activity Grid */}
              <div className="paper-card p-5 bg-[#FAF8F5] border-l-4 border-l-amber-gold space-y-2.5">
                <div className="flex items-center gap-2 text-amber-gold font-bold text-sm">
                  <Heart className="w-4 h-4 fill-amber-gold" />
                  <span>{isAr ? "نشاط صفي تفاعلي خالي من الشاشات:" : "Physical Unplugged Classroom Activity:"}</span>
                </div>
                <p className="text-xs text-charcoal/80 leading-relaxed font-sans font-medium">
                  {result.unpluggedClassroomActivity}
                </p>
              </div>

              {/* Quote Card */}
              <div className="paper-card p-6 bg-white border-2 border-charcoal rounded shadow-[4px_4px_0px_rgba(0,0,0,1)] text-center space-y-3">
                <Quote className="w-6 h-6 text-autumn-yellow mx-auto" />
                <blockquote className="text-base font-serif italic text-charcoal font-semibold leading-relaxed">
                  "{result.motivationalQuote}"
                </blockquote>
                <div className="text-[10px] font-mono text-charcoal/50">
                  {isAr ? "منصة المعلم العربي المحترف • وضاح للنشر الرقمي" : "Arab Professional Teacher Platform • Waddah Digital Publishing"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
