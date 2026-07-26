import React, { useState } from "react";
import { Language, TeacherProfile } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import { printContent } from "../utils/exportUtils";
import pptxgen from "pptxgenjs";
import {
  Presentation,
  Sparkles,
  Download,
  Printer,
  Copy,
  CheckCircle,
  RefreshCw,
  Layers,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText
} from "lucide-react";

interface PresentationSlide {
  slideNumber: number;
  title: string;
  subtitle?: string;
  mainPoints: string[];
  example?: string;
  interactiveQuestion?: string;
}

interface PresentationData {
  id: string;
  title: string;
  metadata: {
    grade: string;
    subject: string;
    lesson: string;
    teacherName: string;
  };
  slides: PresentationSlide[];
  createdAt: string;
}

import { getCurriculumByCode } from "../data/regionalCurricula";

interface PresentationGeneratorProps {
  lang: Language;
  teacherProfile?: TeacherProfile;
  activeCountryCode?: string;
}

export default function PresentationGenerator({ lang, teacherProfile, activeCountryCode = "YE" }: PresentationGeneratorProps) {
  const isAr = lang === "ar";

  const activeCurr = getCurriculumByCode(activeCountryCode);
  const [country, setCountry] = useState(activeCurr.countryNameAr);
  const [grade, setGrade] = useState("الصف التاسع الأساسي");
  const [subject, setSubject] = useState("اللغة العربية");
  const [lesson, setLesson] = useState("عباد الرحمن (الآيات 63-70 سورة الفرقان)");
  const [slidesCount, setSlidesCount] = useState("8");
  const [loading, setLoading] = useState(false);
  const [presentation, setPresentation] = useState<PresentationData | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGeneratePresentation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lesson.trim()) {
      alert("يرجى إدخال عنوان الدرس.");
      return;
    }

    setLoading(true);
    setPresentation(null);
    setCurrentSlideIndex(0);

    try {
      const data = await fetchWithRetry<PresentationData>("/api/gemini/presentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country,
          grade,
          subject,
          lesson,
          slidesCount: parseInt(slidesCount, 10),
          teacherProfile
        })
      });

      setPresentation(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "حدث خطأ أثناء توليد العرض التقديمي.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPowerPoint = () => {
    if (!presentation || !presentation.slides) return;

    try {
      const ppt = new pptxgen();
      ppt.layout = "LAYOUT_16x9";
      ppt.title = presentation.title;

      // Define color theme
      const navyColor = "1A365D";
      const goldColor = "C5A021";
      const bgLight = "F8FAFC";

      presentation.slides.forEach((slide) => {
        const pptSlide = ppt.addSlide();
        pptSlide.background = { color: bgLight };

        // Header Accent Bar
        pptSlide.addShape(ppt.ShapeType.rect, {
          x: 0,
          y: 0,
          w: "100%",
          h: 0.8,
          fill: { color: navyColor }
        });

        // Header Title
        pptSlide.addText(slide.title, {
          x: 0.5,
          y: 0.15,
          w: "90%",
          h: 0.5,
          fontSize: 22,
          fontFace: "Arial",
          color: goldColor,
          bold: true,
          align: "right"
        });

        // Subtitle if available
        if (slide.subtitle) {
          pptSlide.addText(slide.subtitle, {
            x: 0.5,
            y: 0.9,
            w: "90%",
            h: 0.4,
            fontSize: 16,
            fontFace: "Arial",
            color: navyColor,
            italic: true,
            align: "right"
          });
        }

        // Main Points
        if (slide.mainPoints && slide.mainPoints.length > 0) {
          const bulletText = slide.mainPoints.map(p => `• ${p}`).join("\n\n");
          pptSlide.addText(bulletText, {
            x: 0.5,
            y: slide.subtitle ? 1.4 : 1.1,
            w: "90%",
            h: 3.5,
            fontSize: 16,
            fontFace: "Arial",
            color: "334155",
            align: "right",
            lineSpacing: 24
          });
        }

        // Example box
        if (slide.example) {
          pptSlide.addText(`💡 مثال توضيحي: ${slide.example}`, {
            x: 0.5,
            y: 4.8,
            w: "90%",
            h: 0.8,
            fontSize: 14,
            fontFace: "Arial",
            color: "065F46",
            fill: { color: "D1FAE5" },
            align: "right"
          });
        }

        // Footer
        pptSlide.addText(`المعلم العربي المحترف - ${presentation.metadata.lesson}`, {
          x: 0.5,
          y: 5.8,
          w: "90%",
          h: 0.3,
          fontSize: 10,
          fontFace: "Arial",
          color: "94A3B8",
          align: "center"
        });
      });

      ppt.writeFile({ fileName: `${presentation.title}.pptx` });
    } catch (err) {
      console.error(err);
      alert("فشل تصدير ملف PowerPoint. يرجى إعادة المحاولة.");
    }
  };

  const handleSaveToPersonalLibrary = async () => {
    if (!presentation) return;
    try {
      const res = await fetch("/api/teacher-library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: presentation.id,
          type: "presentation",
          title: presentation.title,
          grade: presentation.metadata.grade,
          subject: presentation.metadata.subject,
          data: presentation
        })
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyText = () => {
    if (!presentation) return;
    const text = presentation.slides.map(s => `الشريحة ${s.slideNumber}: ${s.title}\n` + s.mainPoints.map(p => `- ${p}`).join("\n")).join("\n\n---\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1A365D] to-[#2B4C7E] p-6 rounded-2xl text-white shadow-md border border-[#C5A021]/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] rounded-xl flex items-center justify-center text-[#1A365D] font-bold shadow-md">
            <Presentation className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold">مولد العروض التقديمية الذكي (PowerPoint)</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              أنشئ شرائح دروس تفاعلية احترافية متوافقة مع المنهج الدراسي وقابلة للتصدير الفوري بصيغة PPTX.
            </p>
          </div>
        </div>
      </div>

      {/* Generator Form */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleGeneratePresentation} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-mono text-slate-600 mb-1 block">الدولة / المنهج:</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-[#C5A021]"
              >
                <option value="اليمن">الجمهورية اليمنية</option>
                <option value="عام">منهج عربي عام</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-600 mb-1 block">الصف الدراسي:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-[#C5A021]"
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
              <label className="text-xs font-mono text-slate-600 mb-1 block">المادة الدراسية:</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-[#C5A021]"
              >
                <option value="اللغة العربية">اللغة العربية</option>
                <option value="القرآن الكريم والعلوم الإسلامية">القرآن الكريم والعلوم الإسلامية</option>
                <option value="العلوم">العلوم العامة / الكيمياء والفيزياء</option>
                <option value="الرياضيات">الرياضيات</option>
                <option value="الاجتماعيات">الاجتماعيات والتربية الوطنية</option>
                <option value="الحاسوب">الحاسوب وتكنولوجيا المعلومات</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-600 mb-1 block">عدد الشرائح:</label>
              <select
                value={slidesCount}
                onChange={(e) => setSlidesCount(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-[#C5A021]"
              >
                <option value="6">6 شرائح (عرض سريع)</option>
                <option value="8">8 شرائح (حصة قياسية)</option>
                <option value="10">10 شرائح (عرض شامل)</option>
                <option value="12">12 شريحة (درس موسع)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-600 mb-1 block">عنوان الدرس المستهدف:</label>
            <input
              type="text"
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              placeholder="مثال: البن اليمني المجيد، سورة الفرقان، التركيب الضوئي..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-[#C5A021]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1A365D] hover:bg-[#122846] text-white rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#C5A021]" />
                <span>جاري استخراج المنهج وصياغة شرائح العرض...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#C5A021]" />
                <span>توليد العرض التقديمي بالذكاء الاصطناعي</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Generated Presentation Display */}
      {presentation && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-serif font-bold text-[#1A365D]">{presentation.title}</h3>
              <p className="text-[11px] font-mono text-slate-500">
                {presentation.metadata.grade} | {presentation.metadata.subject} | {presentation.slides.length} شرائح
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <button
                onClick={handleExportPowerPoint}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير PowerPoint (.pptx)</span>
              </button>

              <button
                onClick={handleSaveToPersonalLibrary}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{saveSuccess ? "تم الحفظ بمكتبتك!" : "حفظ بمكتبتي الشخصية"}</span>
              </button>

              <button
                onClick={handleCopyText}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#1A365D] rounded-lg font-medium flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "تم النسخ" : "نسخ النصوص"}</span>
              </button>

              <button
                onClick={() => printContent("presentation-slides-print-area", presentation.title)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#1A365D] rounded-lg font-medium flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة</span>
              </button>
            </div>
          </div>

          {/* Interactive Slide Viewer */}
          <div className="bg-slate-900 rounded-2xl p-6 md:p-10 text-white shadow-xl relative min-h-[380px] flex flex-col justify-between border-2 border-[#C5A021]/40">
            {/* Top Bar inside viewer */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="px-3 py-1 bg-[#C5A021] text-[#1A365D] font-mono text-xs font-bold rounded-full">
                الشريحة {currentSlideIndex + 1} من {presentation.slides.length}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {presentation.metadata.lesson}
              </span>
            </div>

            {/* Current Slide Content */}
            {presentation.slides[currentSlideIndex] && (
              <div className="my-6 space-y-5" dir="rtl">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#C5A021] border-s-4 border-[#C5A021] ps-4">
                  {presentation.slides[currentSlideIndex].title}
                </h2>

                {presentation.slides[currentSlideIndex].subtitle && (
                  <p className="text-sm font-sans text-slate-300 italic">
                    {presentation.slides[currentSlideIndex].subtitle}
                  </p>
                )}

                <div className="space-y-3 pt-2">
                  {presentation.slides[currentSlideIndex].mainPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-[#C5A021] mt-2 flex-shrink-0" />
                      <p className="text-sm md:text-base font-sans text-slate-100 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>

                {presentation.slides[currentSlideIndex].example && (
                  <div className="mt-4 p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs font-sans text-emerald-200">
                    <strong className="text-emerald-400 font-serif block mb-1">💡 مثال توضيحي:</strong>
                    {presentation.slides[currentSlideIndex].example}
                  </div>
                )}
              </div>
            )}

            {/* Slide Navigation Footer */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <button
                onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                disabled={currentSlideIndex === 0}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-lg text-xs font-mono flex items-center gap-1 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الشريحة السابقة</span>
              </button>

              <div className="flex items-center gap-1">
                {presentation.slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === currentSlideIndex ? "bg-[#C5A021] w-6" : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentSlideIndex(prev => Math.min(presentation.slides.length - 1, prev + 1))}
                disabled={currentSlideIndex === presentation.slides.length - 1}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-lg text-xs font-mono flex items-center gap-1 cursor-pointer"
              >
                <span>الشريحة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hidden Printable Area */}
          <div id="presentation-slides-print-area" className="hidden print:block p-8 bg-white font-sans text-slate-900 space-y-8">
            <div className="border-b-2 border-slate-900 pb-4 text-center">
              <h1 className="text-2xl font-bold">{presentation.title}</h1>
              <p className="text-sm text-slate-600">{presentation.metadata.grade} - {presentation.metadata.subject}</p>
            </div>
            {presentation.slides.map((s, i) => (
              <div key={i} className="p-6 border border-slate-300 rounded-xl space-y-3 page-break-after-always">
                <h3 className="text-lg font-bold text-slate-900">الشريحة {s.slideNumber}: {s.title}</h3>
                <ul className="list-disc pr-6 space-y-1 text-sm">
                  {s.mainPoints.map((p, pi) => <li key={pi}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
