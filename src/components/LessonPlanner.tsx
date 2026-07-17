import React, { useState, useEffect } from "react";
import { LessonPlan, Language } from "../types";
import {
  Sparkles,
  FileText,
  Download,
  Presentation,
  Cpu,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Settings,
  Map,
  CheckSquare,
  Eye,
  EyeOff,
  ClipboardList,
  HelpCircle,
  CheckCircle,
  Shuffle,
  Info
} from "lucide-react";
import pptxgen from "pptxgenjs";
import { PRELOADED_CURRICULUM } from "../data/curriculumData";
import { fetchWithRetry } from "../utils/fetchWithRetry";

interface LessonPlannerProps {
  lang: Language;
}

const DEFAULT_SUBJECTS_AR = [
  "اللغة العربية",
  "التربية الإسلامية والقرآن الكريم",
  "الاجتماعيات والتاريخ العربي",
  "العلوم والفيزياء الحيوية",
  "الرياضيات والمنطق الحسابي",
];

const DEFAULT_SUBJECTS_EN = [
  "Arabic Language",
  "Islamic Studies & Ethics",
  "Social Studies & History",
  "General Sciences & Biology",
  "Mathematics & Analytical Logic",
];

const GRADE_LEVELS_AR = [
  "الصف السابع الأساسي",
  "الصف الثامن الأساسي",
  "الصف التاسع الأساسي",
  "الصف الأول الثانوي",
  "الصف الثاني الثانوي",
  "الصف الثالث الثانوي",
];

const GRADE_LEVELS_EN = [
  "7th Grade Primary",
  "8th Grade Primary",
  "9th Grade Primary",
  "10th Grade Secondary",
  "11th Grade Secondary",
  "12th Grade Secondary",
];

function getFallbackTopicText(country: string, grade: string, subject: string, isAr: boolean): string {
  if (subject.includes("الإسلامية") || subject.includes("Islamic")) {
    return isAr ? "التأمل والتفكر في خلق السماوات والأرض" : "Contemplation of the Heavens and the Earth";
  }
  if (subject.includes("الاجتماعيات") || subject.includes("Social")) {
    return isAr ? `معالم الحضارة والتجارة التقليدية في ${country}` : `Historic Heritage & Traditional Commerce in ${country}`;
  }
  if (subject.includes("العلوم") || subject.includes("Science")) {
    return isAr ? "الفيزياء الحيوية للنبات والتركيب الضوئي" : "Biophysics of Plants and Photosynthesis";
  }
  if (subject.includes("الرياضيات") || subject.includes("Math")) {
    return isAr ? "علم الجبر والمقابلة عند الخوارزمي" : "The Science of Algebra by Al-Khwarizmi";
  }
  return isAr ? `قراءة نقدية في أدب وتراث ${country}` : `Critical Readings in the Heritage of ${country}`;
}

export default function LessonPlanner({ lang }: LessonPlannerProps) {
  const isAr = lang === "ar";

  // Form States
  const [country, setCountry] = useState("اليمن");
  const [subject, setSubject] = useState("اللغة العربية");
  const [grade, setGrade] = useState("الصف الثامن الأساسي");
  const [selectedLessonId, setSelectedLessonId] = useState("yemen-ar-8-coffee");
  const [topic, setTopic] = useState(isAr ? "زراعة البن في ريف اليمن وأثره الوجداني" : "Coffee Plantation in Yemen");
  const [curriculum, setCurriculum] = useState(isAr ? "المنهج اليمني الرسمي" : "Yemeni Standard Curriculum");
  const [duration, setDuration] = useState("45");
  const [customNotes, setCustomNotes] = useState("");

  // Quiz, Activity & Mindmap customization options
  const [questionType, setQuestionType] = useState("mixed");
  const [questionsCount, setQuestionsCount] = useState("10");
  const [activitiesStrategy, setActivitiesStrategy] = useState("all");
  const [retryStatus, setRetryStatus] = useState<string | null>(null);

  // UI & Loading States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // New features: Outputs Tab selection & Show Answer Key toggle
  const [activeOutputTab, setActiveOutputTab] = useState<"plan" | "exam" | "activities" | "mindmap">("plan");
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  // Synchronize lessons list from the preloaded library when country, grade, or subject changes
  useEffect(() => {
    const matched = PRELOADED_CURRICULUM.filter(
      (l) => l.country === country && l.grade === grade && l.subject === subject
    );
    if (matched.length > 0) {
      setSelectedLessonId(matched[0].id);
      setTopic(matched[0].topic);
      setCurriculum(isAr ? `دليل المنهج الموحد لـ ${country}` : `${country} Standard Curriculum Guidelines`);
    } else {
      setSelectedLessonId("custom");
      const fallbackTopic = getFallbackTopicText(country, grade, subject, isAr);
      setTopic(fallbackTopic);
      setCurriculum(isAr ? `دليل المنهج الموحد لـ ${country}` : `${country} Standard Curriculum Guidelines`);
    }
  }, [country, grade, subject, lang]);

  const handleLessonSelectionChange = (id: string) => {
    setSelectedLessonId(id);
    if (id === "custom") {
      setTopic("");
    } else {
      const matched = PRELOADED_CURRICULUM.find((l) => l.id === id);
      if (matched) {
        setTopic(matched.topic);
      }
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPlan(null);
    setShowAnswerKey(false);
    setRetryStatus(null);

    try {
      const response = await fetchWithRetry(
        "/api/gemini/lesson-plan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject,
            grade,
            topic,
            curriculum,
            duration,
            language: lang,
            customNotes,
            preloadedLessonId: selectedLessonId,
            questionType,
            questionsCount,
            activitiesStrategy,
          }),
        },
        3,
        1500,
        2,
        (attempt, delayMs, errorMsg) => {
          const sec = (delayMs / 1000).toFixed(1);
          setRetryStatus(
            isAr
              ? `السيرفر مشغول حالياً بضغط مؤقت (${errorMsg}). جاري إعادة المحاولة تلقائياً (المحاولة ${attempt} من 3) خلال ${sec} ثانية... يرجى عدم إغلاق الصفحة.`
              : `Server is temporarily busy (${errorMsg}). Retrying automatically (Attempt ${attempt} of 3) in ${sec}s... Please stay on this page.`
          );
        }
      );

      const data = await response.json();
      setPlan(data);
      setActiveSlideIndex(0);
      setActiveOutputTab("plan");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while generating the plan.");
    } finally {
      setLoading(false);
      setRetryStatus(null);
    }
  };

  // Direct Automatic PPTX Export
  const handleGenerateAndDownloadPPTX = async () => {
    setLoading(true);
    setError(null);
    setPlan(null);
    setShowAnswerKey(false);
    setRetryStatus(null);

    try {
      const response = await fetchWithRetry(
        "/api/gemini/lesson-plan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject,
            grade,
            topic,
            curriculum,
            duration,
            language: lang,
            customNotes,
            preloadedLessonId: selectedLessonId,
            questionType,
            questionsCount,
            activitiesStrategy,
          }),
        },
        3,
        1500,
        2,
        (attempt, delayMs, errorMsg) => {
          const sec = (delayMs / 1000).toFixed(1);
          setRetryStatus(
            isAr
              ? `السيرفر مشغول حالياً بضغط مؤقت (${errorMsg}). جاري إعادة المحاولة تلقائياً (المحاولة ${attempt} من 3) خلال ${sec} ثانية... يرجى عدم إغلاق الصفحة.`
              : `Server is temporarily busy (${errorMsg}). Retrying automatically (Attempt ${attempt} of 3) in ${sec}s... Please stay on this page.`
          );
        }
      );

      const data = await response.json();
      setPlan(data);
      setActiveSlideIndex(0);
      setActiveOutputTab("plan");
      handleExportPPTX(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while generating the PowerPoint presentation.");
    } finally {
      setLoading(false);
      setRetryStatus(null);
    }
  };

  // PowerPoint Slide Export
  const handleExportPPTX = (customPlan?: any) => {
    const activePlan = customPlan || plan;
    if (!activePlan) return;

    const ppx = new pptxgen();
    ppx.layout = "LAYOUT_16x9";

    const colorIvory = "FAF8F5";
    const colorCharcoal = "1A1A1A";
    const colorAmber = "D97706";
    const colorYellow = "F59E0B";

    // Slide 1: Cover
    const slide1 = ppx.addSlide();
    slide1.background = { color: colorIvory };
    slide1.addShape(ppx.ShapeType.rect, {
      x: 0.2,
      y: 0.2,
      w: 9.6,
      h: 5.2,
      line: { color: colorCharcoal, width: 4 },
      fill: { color: "FFFFFF" },
    });

    slide1.addText(activePlan.title, {
      x: 0.5,
      y: 1.2,
      w: 9.0,
      h: 1.2,
      fontSize: 32,
      fontFace: isAr ? "Amiri" : "Georgia",
      align: isAr ? "right" : "left",
      bold: true,
      color: colorCharcoal,
    });

    slide1.addText(
      `${isAr ? "المادة" : "Subject"}: ${activePlan.metadata.subject} | ${isAr ? "الصف" : "Grade"}: ${activePlan.metadata.grade}`,
      {
        x: 0.5,
        y: 2.6,
        w: 9.0,
        h: 0.5,
        fontSize: 16,
        fontFace: isAr ? "IBM Plex Sans Arabic" : "Arial",
        align: isAr ? "right" : "left",
        color: colorAmber,
        bold: true,
      }
    );

    slide1.addText(
      `${isAr ? "المنهج" : "Curriculum"}: ${activePlan.metadata.curriculum} | ${isAr ? "المدة" : "Duration"}: ${activePlan.metadata.duration} ${isAr ? "دقيقة" : "mins"}`,
      {
        x: 0.5,
        y: 3.2,
        w: 9.0,
        h: 0.5,
        fontSize: 14,
        fontFace: isAr ? "IBM Plex Sans Arabic" : "Arial",
        align: isAr ? "right" : "left",
        color: colorCharcoal,
      }
    );

    slide1.addText(
      isAr
        ? "منصة المعلم العربي المحترف © وضاح للنشر الرقمي"
        : "Arab Professional Teacher Platform © Waddah Digital Publishing",
      {
        x: 0.5,
        y: 4.8,
        w: 9.0,
        h: 0.4,
        fontSize: 11,
        fontFace: isAr ? "IBM Plex Sans Arabic" : "Arial",
        align: "center",
        color: "888888",
      }
    );

    // Slide 2: Objectives & Materials
    const slide2 = ppx.addSlide();
    slide2.background = { color: colorIvory };
    slide2.addShape(ppx.ShapeType.rect, {
      x: 0.2,
      y: 0.2,
      w: 9.6,
      h: 5.2,
      line: { color: colorCharcoal, width: 3 },
      fill: { color: "FFFFFF" },
    });

    slide2.addText(isAr ? "أهداف الدرس والوسائل المطلوبة" : "Objectives & Materials", {
      x: 0.5,
      y: 0.4,
      w: 9.0,
      h: 0.6,
      fontSize: 22,
      fontFace: isAr ? "Amiri" : "Georgia",
      bold: true,
      color: colorAmber,
      align: isAr ? "right" : "left",
    });

    const objText = activePlan.objectives.map((o: string) => `• ${o}`).join("\n");
    slide2.addText(isAr ? "الأهداف السلوكية:" : "Learning Objectives:", {
      x: isAr ? 5.0 : 0.5,
      y: 1.1,
      w: 4.3,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: colorCharcoal,
      align: isAr ? "right" : "left",
      fontFace: isAr ? "IBM Plex Sans Arabic" : "Arial",
    });
    slide2.addText(objText, {
      x: isAr ? 5.0 : 0.5,
      y: 1.6,
      w: 4.3,
      h: 3.2,
      fontSize: 12,
      color: colorCharcoal,
      align: isAr ? "right" : "left",
      fontFace: isAr ? "IBM Plex Sans Arabic" : "Arial",
    });

    const matText = activePlan.materials.map((m: string) => `• ${m}`).join("\n");
    slide2.addText(isAr ? "الوسائل التعليمية والمواد الملموسة:" : "Tactile Teaching Aids:", {
      x: isAr ? 0.5 : 5.0,
      y: 1.1,
      w: 4.3,
      h: 0.4,
      fontSize: 16,
      bold: true,
      color: colorCharcoal,
      align: isAr ? "right" : "left",
      fontFace: isAr ? "IBM Plex Sans Arabic" : "Arial",
    });
    slide2.addText(matText, {
      x: isAr ? 0.5 : 5.0,
      y: 1.6,
      w: 4.3,
      h: 3.2,
      fontSize: 12,
      color: colorCharcoal,
      align: isAr ? "right" : "left",
      fontFace: isAr ? "IBM Plex Sans Arabic" : "Arial",
    });

    // Slide 3: Introduction
    const slide3 = ppx.addSlide();
    slide3.background = { color: colorIvory };
    slide3.addShape(ppx.ShapeType.rect, {
      x: 0.2,
      y: 0.2,
      w: 9.6,
      h: 5.2,
      line: { color: colorCharcoal, width: 3 },
      fill: { color: "FFFFFF" },
    });

    slide3.addText(isAr ? "التهيئة والتمهيد للدرس" : "Lesson Warm-up & Hook", {
      x: 0.5,
      y: 0.4,
      w: 9.0,
      h: 0.6,
      fontSize: 22,
      fontFace: isAr ? "Amiri" : "Georgia",
      bold: true,
      color: colorAmber,
      align: isAr ? "right" : "left",
    });
    const introText = activePlan.introduction.map((i: string) => `• ${i}`).join("\n\n");
    slide3.addText(introText, {
      x: 0.8,
      y: 1.4,
      w: 8.4,
      h: 3.4,
      fontSize: 14,
      color: colorCharcoal,
      align: isAr ? "right" : "left",
      fontFace: isAr ? "IBM Plex Sans Arabic" : "Arial",
    });

    // Slides 4+: Presentation Sequences
    activePlan.presentationSlides.forEach((slideData: any, idx: number) => {
      const s = ppx.addSlide();
      s.background = { color: colorIvory };
      s.addShape(ppx.ShapeType.rect, {
        x: 0.2,
        y: 0.2,
        w: 9.6,
        h: 5.2,
        line: { color: colorCharcoal, width: 3 },
        fill: { color: "FFFFFF" },
      });

      s.addText(`${isAr ? "مرحلة الشرح" : "Content"}: ${slideData.slideTitle}`, {
        x: 0.5,
        y: 0.4,
        w: 9.0,
        h: 0.6,
        fontSize: 22,
        fontFace: isAr ? "Amiri" : "Georgia",
        bold: true,
        color: colorAmber,
        align: isAr ? "right" : "left",
      });

      const bullets = slideData.slideContent.map((c: string) => `• ${c}`).join("\n\n");
      s.addText(bullets, {
        x: 0.8,
        y: 1.3,
        w: 8.4,
        h: 3.5,
        fontSize: 13,
        color: colorCharcoal,
        align: isAr ? "right" : "left",
        fontFace: isAr ? "IBM Plex Sans Arabic" : "Arial",
      });
    });

    // Save File
    ppx.writeFile({
      fileName: `درس_${activePlan.title.replace(/\s+/g, "_")}.pptx`,
    });
  };

  // Get matching lessons for preloaded library
  const matchedLessons = PRELOADED_CURRICULUM.filter(
    (l) => l.grade === grade && (subject.includes("العربية") || subject.includes("Arabic"))
  );

  return (
    <div className="space-y-6 animate-fade-in" id="lesson-planner-tab-content">
      {/* Platform Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 border-charcoal/10 gap-3">
        <div>
          <h2 className="text-3xl font-serif font-bold text-charcoal flex items-center gap-2">
            <BookOpen className="text-amber-gold w-7 h-7" />
            {isAr ? "المكتبة المنهجية الجاهزة وأدوات التخطيط" : "Preloaded Curriculum & Lesson Planner"}
          </h2>
          <p className="text-xs text-charcoal/70">
            {isAr
              ? "تحضير فوري ذكي يعتمد على مناهج اليمن والوطن العربي دون عناء الرفع اليدوي وحمايةً لذاكرة الهاتف."
              : "Instant pedagogical design mapped to Yemeni and regional curricula, avoiding slow manual uploads."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Settings Panel Form (4 cols) */}
        <form onSubmit={handleGenerate} className="paper-card p-6 bg-white space-y-4 lg:col-span-4 border-2 border-charcoal">
          <div className="flex items-center gap-2 border-b pb-2 border-charcoal/10">
            <Settings className="w-4 h-4 text-amber-gold" />
            <h3 className="font-serif font-bold text-sm text-charcoal">
              {isAr ? "إعدادات الدرس والمكتبة" : "Lesson & Library Setup"}
            </h3>
          </div>

          <div className="space-y-3 text-xs font-mono">
            {/* Country Dropdown */}
            <div className="space-y-1">
              <label className="block font-bold text-charcoal">{isAr ? "الدولة:" : "Country:"}</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 focus:outline-none focus:ring-1 focus:ring-amber-gold font-sans cursor-pointer"
              >
                <option value="اليمن">{isAr ? "🇾🇪 الجمهورية اليمنية" : "🇾🇪 Yemen"}</option>
                <option value="السعودية">{isAr ? "🇸🇦 المملكة العربية السعودية" : "🇸🇦 Saudi Arabia"}</option>
                <option value="مصر">{isAr ? "🇪🇬 جمهورية مصر العربية" : "🇪🇬 Egypt"}</option>
                <option value="العراق">{isAr ? "🇮🇶 جمهورية العراق" : "🇮🇶 Iraq"}</option>
                <option value="الإمارات">{isAr ? "🇦🇪 الإمارات العربية المتحدة" : "🇦🇪 UAE"}</option>
                <option value="الأردن">{isAr ? "🇯🇴 المملكة الأردنية الهاشمية" : "🇯🇴 Jordan"}</option>
              </select>
            </div>

            {/* Subject Dropdown */}
            <div className="space-y-1">
              <label className="block font-bold text-charcoal">{isAr ? "المادة الدراسية:" : "Academic Subject:"}</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 focus:outline-none focus:ring-1 focus:ring-amber-gold font-sans cursor-pointer"
              >
                {(isAr ? DEFAULT_SUBJECTS_AR : DEFAULT_SUBJECTS_EN).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade dropdown */}
            <div className="space-y-1">
              <label className="block font-bold text-charcoal">{isAr ? "الصف الدراسي:" : "Grade Level:"}</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 focus:outline-none focus:ring-1 focus:ring-amber-gold font-sans cursor-pointer"
              >
                {(isAr ? GRADE_LEVELS_AR : GRADE_LEVELS_EN).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Lesson Library Selector */}
            <div className="space-y-1 bg-[#FAF8F5] p-2.5 border border-dashed border-charcoal/30 rounded">
              <label className="block font-bold text-[#C5A021] text-[11px] mb-1">
                {isAr ? "📚 المكتبة المنهجية الجاهزة:" : "📚 Ready Schoolbook Library:"}
              </label>
              <select
                value={selectedLessonId}
                onChange={(e) => handleLessonSelectionChange(e.target.value)}
                className="w-full bg-white border-2 border-charcoal p-2 focus:outline-none font-sans text-xs"
              >
                {matchedLessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    📖 {l.topic}
                  </option>
                ))}
                <option value="custom">✍️ {isAr ? "ـ تحضير موضوع مخصص خارجي ـ" : "— Use Custom Lesson Topic —"}</option>
              </select>
              {selectedLessonId !== "custom" && (
                <p className="text-[10px] text-charcoal/60 mt-1 font-sans italic leading-tight">
                  {isAr ? "✓ تم ربط الدرس السحري محلياً لتفادي تشتيت الهاتف واستهلاك الرام." : "✓ Textbook context mapped locally to preserve phone memory."}
                </p>
              )}
            </div>

            {/* Topic Input (shown/enabled always, auto-filled or editable) */}
            <div className="space-y-1">
              <label className="block font-bold text-charcoal">{isAr ? "عنوان الدرس بالتفصيل:" : "Lesson Topic title:"}</label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={isAr ? "أدخل عنوان الدرس..." : "Enter topic name..."}
                className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 focus:outline-none focus:ring-1 focus:ring-amber-gold font-sans text-xs"
              />
            </div>

            {/* Curriculum guidelines */}
            <div className="space-y-1">
              <label className="block font-bold text-charcoal">{isAr ? "دليل المنهج المرجعي:" : "Curriculum Standard:"}</label>
              <input
                type="text"
                required
                value={curriculum}
                onChange={(e) => setCurriculum(e.target.value)}
                className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 focus:outline-none text-xs font-sans"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <label className="block font-bold text-charcoal">{isAr ? "المدة الزمنية (بالدقائق):" : "Duration (minutes):"}</label>
              <input
                type="number"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 focus:outline-none font-mono text-xs"
              />
            </div>

            {/* Exam Generation Customizer */}
            <div className="bg-[#FAF8F5] p-3 border-2 border-charcoal space-y-2 rounded">
              <span className="block font-serif font-bold text-[#C5A021] text-[11px]">
                {isAr ? "📝 تخصيص وحدة الاختبارات المقترحة:" : "📝 Customize Suggested Quiz Unit:"}
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="space-y-1">
                  <label className="block font-bold text-charcoal">{isAr ? "نوع الأسئلة:" : "Question Type:"}</label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="w-full bg-white border border-charcoal p-1 focus:outline-none cursor-pointer font-sans"
                  >
                    <option value="mixed">{isAr ? "مختلط (شامل)" : "Mixed (All)"}</option>
                    <option value="mcq">{isAr ? "اختيار من متعدد" : "Multiple Choice"}</option>
                    <option value="true_false">{isAr ? "صح وخطأ" : "True / False"}</option>
                    <option value="essay">{isAr ? "أسئلة مقالية وقصيرة" : "Essay & Short Answers"}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-charcoal">{isAr ? "عدد الأسئلة:" : "Questions Count:"}</label>
                  <select
                    value={questionsCount}
                    onChange={(e) => setQuestionsCount(e.target.value)}
                    className="w-full bg-white border border-charcoal p-1 focus:outline-none cursor-pointer font-sans"
                  >
                    <option value="5">5 {isAr ? "أسئلة" : "Questions"}</option>
                    <option value="10">10 {isAr ? "أسئلة" : "Questions"}</option>
                    <option value="15">15 {isAr ? "سؤالاً" : "Questions"}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Activities Customizer */}
            <div className="bg-[#FAF8F5] p-3 border-2 border-charcoal space-y-2 rounded">
              <span className="block font-serif font-bold text-[#C5A021] text-[11px]">
                {isAr ? "🎲 تخصيص إستراتيجية الأنشطة:" : "🎲 Customize Activities Strategy:"}
              </span>
              <div className="space-y-1 text-[11px]">
                <label className="block font-bold text-charcoal">{isAr ? "إستراتيجية التعلم النشط المفضلة:" : "Active Learning Strategy:"}</label>
                <select
                  value={activitiesStrategy}
                  onChange={(e) => setActivitiesStrategy(e.target.value)}
                  className="w-full bg-white border border-charcoal p-1 focus:outline-none cursor-pointer font-sans text-[11px]"
                >
                  <option value="all">{isAr ? "توليد جميع الإستراتيجيات" : "Generate All Strategies"}</option>
                  <option value="cooperative">{isAr ? "التعلم التعاوني وعمل المجموعات" : "Cooperative & Group Work"}</option>
                  <option value="hot_seat">{isAr ? "الكرسي الساخن وفكر-شارك-زميل" : "Hot Seat & Think-Pair-Share"}</option>
                  <option value="role_play">{isAr ? "لعب الأدوار والعصف الذهني" : "Role Play & Brainstorming"}</option>
                  <option value="unplugged">{isAr ? "ألعاب تعليمية وأنشطة ملموسة" : "Educational Games & Tangible Tasks"}</option>
                </select>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-1">
              <label className="block font-bold text-charcoal">{isAr ? "توجيهات وضاح الإضافية:" : "Special Instructions:"}</label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder={isAr ? "مثال: ركز على التعلم النشط الخالي من الأجهزة والعمل اليدوي." : "e.g., Focus on hands-on experiences and group writing."}
                rows={3}
                className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 focus:outline-none font-sans text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full paper-btn-primary py-3 flex items-center justify-center gap-2 font-bold cursor-pointer text-xs"
            >
              <Cpu className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading
                ? isAr
                  ? "جاري الصياغة التربوية المتكاملة..."
                  : "Compiling pedagogical package..."
                : isAr
                ? "توليد الخطة والشرائح الذكية"
                : "Generate Integrated Plan"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleGenerateAndDownloadPPTX}
              className="w-full paper-card bg-[#C5A021] text-charcoal py-3 flex items-center justify-center gap-2 font-bold cursor-pointer hover:bg-[#b08f1b] hover:text-white border-2 border-charcoal text-xs shadow-[2px_2px_0px_0px_#1A1A1A] transition-all"
            >
              <Presentation className="w-4 h-4" />
              {loading ? (isAr ? "جاري البناء..." : "Generating...") : isAr ? "توليد وتنزيل شرائح PPTX فوراً" : "Generate & Download PPTX"}
            </button>
          </div>
        </form>

        {/* Presentation & Plan Display Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {error && (
            <div className="paper-card p-4 bg-red-50 border-2 border-red-900 text-red-900 text-xs font-mono">
              <strong>{isAr ? "خطأ في الاتصال:" : "Connection Error:"}</strong> {error}
            </div>
          )}

          {!plan && !loading && (
            <div className="paper-card p-12 bg-white text-center space-y-4 border-2 border-charcoal">
              <Presentation className="w-16 h-16 text-charcoal/30 mx-auto" />
              <h4 className="text-xl font-serif font-bold text-charcoal">
                {isAr ? "بانتظار التحضير البيداغوجي" : "Planner Ready"}
              </h4>
              <p className="text-sm text-charcoal/70 max-w-md mx-auto leading-relaxed">
                {isAr
                  ? "اختر الصف الدراسي وموضوع الدرس من المكتبة الجاهزة، واضغط على توليد لبناء أربعة مخرجات ذكية: الخطة، الاختبار، الأنشطة، والخريطة الذهنية."
                  : "Select a lesson from our local repository and generate to produce your lesson sheets, test prep, interactive unplugged games, and chalkboard visual tree."}
              </p>
            </div>
          )}

          {loading && (
            <div className="paper-card p-12 bg-white text-center space-y-6 border-2 border-charcoal animate-pulse">
              <Sparkles className="w-12 h-12 text-amber-gold animate-spin mx-auto" />
              <div className="space-y-2">
                <h4 className="text-lg font-serif font-bold text-charcoal">
                  {isAr ? "جاري صياغة الخطة والأنشطة الإبداعية..." : "Synthesizing textbook elements..."}
                </h4>
                <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
                  {isAr
                    ? "يقوم Gemini بربط أهداف المنهج، وتوليد أسئلة الاختبار النموذجي، واقتراح ألعاب صفية ملموسة، ورسم هيكل السبورة."
                    : "Connecting educational goals with outdoor tasks and blackboard designs in standard JSON format."}
                </p>
                {retryStatus && (
                  <div className="p-3 bg-autumn-yellow/15 border-2 border-charcoal text-xs text-charcoal font-sans rounded max-w-md mx-auto mt-4 shadow-[2px_2px_0px_0px_#1A1A1A] animate-bounce">
                    <strong>{isAr ? "💡 ملاحظة الاتصال:" : "💡 Connection Note:"}</strong> {retryStatus}
                  </div>
                )}
              </div>
            </div>
          )}

          {plan && (
            <div className="space-y-6">
              {/* Output Tab Selector */}
              <div id="lesson-planner-outputs-section" className="flex flex-wrap gap-1 border-b-2 border-charcoal pb-1">
                <button
                  onClick={() => setActiveOutputTab("plan")}
                  className={`px-3 py-2 text-xs font-serif font-bold border-t-4 transition-all cursor-pointer ${
                    activeOutputTab === "plan"
                      ? "border-t-[#C5A021] bg-[#FAF8F5] text-charcoal border-x-2 border-x-charcoal/20"
                      : "border-t-transparent text-charcoal/60 hover:text-charcoal"
                  }`}
                >
                  📁 {isAr ? "الخطة والشرائح" : "Plan & PPTX"}
                </button>
                <button
                  onClick={() => setActiveOutputTab("exam")}
                  className={`px-3 py-2 text-xs font-serif font-bold border-t-4 transition-all cursor-pointer ${
                    activeOutputTab === "exam"
                      ? "border-t-[#C5A021] bg-[#FAF8F5] text-charcoal border-x-2 border-x-charcoal/20"
                      : "border-t-transparent text-charcoal/60 hover:text-charcoal"
                  }`}
                >
                  📝 {isAr ? "الاختبار المقترح" : "Suggested Exam"}
                </button>
                <button
                  onClick={() => setActiveOutputTab("activities")}
                  className={`px-3 py-2 text-xs font-serif font-bold border-t-4 transition-all cursor-pointer ${
                    activeOutputTab === "activities"
                      ? "border-t-[#C5A021] bg-[#FAF8F5] text-charcoal border-x-2 border-x-charcoal/20"
                      : "border-t-transparent text-charcoal/60 hover:text-charcoal"
                  }`}
                >
                  🎲 {isAr ? "الأنشطة والتعلم النشط" : "Interactive Games"}
                </button>
                <button
                  onClick={() => setActiveOutputTab("mindmap")}
                  className={`px-3 py-2 text-xs font-serif font-bold border-t-4 transition-all cursor-pointer ${
                    activeOutputTab === "mindmap"
                      ? "border-t-[#C5A021] bg-[#FAF8F5] text-charcoal border-x-2 border-x-charcoal/20"
                      : "border-t-transparent text-charcoal/60 hover:text-charcoal"
                  }`}
                >
                  🌿 {isAr ? "خريطة السبورة الشجرية" : "Chalkboard Mind Map"}
                </button>
              </div>

              {/* TAB CONTENT 1: Lesson Plan & Slides */}
              {activeOutputTab === "plan" && (
                <div className="space-y-6">
                  {/* PPTX Header action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 paper-card p-4 bg-white border-2 border-charcoal">
                    <div className="space-y-1">
                      <h4 className="text-lg font-serif font-bold text-charcoal">{plan.title}</h4>
                      <p className="text-xs text-charcoal/60 font-mono">
                        {plan.metadata.subject} • {plan.metadata.grade} • {plan.metadata.duration} {isAr ? "دقيقة" : "mins"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleExportPPTX()}
                      className="paper-btn-primary px-4 py-2 text-xs flex items-center justify-center gap-2 self-start"
                    >
                      <Download className="w-4 h-4" />
                      {isAr ? "تصدير عروض PPTX جاهزة" : "Export PPTX Slides"}
                    </button>
                  </div>

                  {/* Interactive Slideshow Preview */}
                  <div className="paper-card p-6 bg-white min-h-[300px] flex flex-col justify-between space-y-6 relative border-2 border-charcoal border-t-8 border-t-amber-gold">
                    <div className="flex items-center justify-between border-b pb-2 border-charcoal/10">
                      <span className="font-mono text-xs font-bold text-amber-gold uppercase tracking-wider">
                        {isAr ? `شريحة العرض رقم ${activeSlideIndex + 1}` : `Slide ${activeSlideIndex + 1}`}
                      </span>
                      <span className="font-mono text-xs text-charcoal/50">
                        {activeSlideIndex + 1} / {4 + plan.presentationSlides.length}
                      </span>
                    </div>

                    <div className="py-4 space-y-4 flex-1">
                      {activeSlideIndex === 0 && (
                        <div className="text-center space-y-4 py-6">
                          <h2 className="text-3xl font-serif font-bold text-charcoal leading-snug">{plan.title}</h2>
                          <div className="h-1 w-24 bg-autumn-yellow mx-auto"></div>
                          <p className="text-sm font-mono text-charcoal/70">
                            {isAr ? "منصة المعلم العربي المحترف" : "Arabic Professional Teacher Plan"}
                          </p>
                          <p className="text-xs text-amber-gold font-serif italic">{plan.metadata.curriculum}</p>
                        </div>
                      )}

                      {activeSlideIndex === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          <div className="space-y-2">
                            <h5 className="font-serif font-bold text-amber-gold border-b pb-1 border-charcoal/10">
                              {isAr ? "الأهداف السلوكية للدرس:" : "Learning Objectives:"}
                            </h5>
                            <ul className="space-y-1.5 list-disc list-inside text-charcoal/90">
                              {plan.objectives.map((obj, i) => (
                                <li key={i}>{obj}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <h5 className="font-serif font-bold text-charcoal border-b pb-1 border-charcoal/10">
                              {isAr ? "الوسائل المطلوبة (حسية وملموسة):" : "Tactile Materials Needed:"}
                            </h5>
                            <ul className="space-y-1.5 list-disc list-inside text-charcoal/90">
                              {plan.materials.map((mat, i) => (
                                <li key={i}>{mat}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {activeSlideIndex === 2 && (
                        <div className="space-y-3">
                          <h5 className="font-serif font-bold text-amber-gold border-b pb-1 border-charcoal/10 text-base">
                            {isAr ? "التمهيد والتهيئة الحيوية غير الرقمية:" : "Warmup Hook & Introduction:"}
                          </h5>
                          <ol className="space-y-2 list-decimal list-inside text-charcoal/90 text-sm leading-relaxed">
                            {plan.introduction.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {activeSlideIndex >= 3 && activeSlideIndex < 3 + plan.presentationSlides.length && (
                        <div className="space-y-4">
                          <h4 className="text-xl font-serif font-bold text-charcoal">
                            {plan.presentationSlides[activeSlideIndex - 3].slideTitle}
                          </h4>
                          <ul className="space-y-2 text-sm text-charcoal/95 list-none">
                            {plan.presentationSlides[activeSlideIndex - 3].slideContent.map((bullet: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-amber-gold font-mono mt-0.5">•</span>
                                <span className="leading-relaxed">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {activeSlideIndex === 3 + plan.presentationSlides.length && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          <div className="space-y-2">
                            <h5 className="font-serif font-bold text-amber-gold border-b pb-1 border-charcoal/10">
                              {isAr ? "التقويم التكويني السريع:" : "Formative Assessment Questions:"}
                            </h5>
                            <ul className="space-y-1.5 list-disc list-inside text-charcoal/90">
                              {plan.assessment.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <h5 className="font-serif font-bold text-charcoal border-b pb-1 border-charcoal/10">
                              {isAr ? "النشاط العملي / المنزلي الوجداني:" : "Homework / Tangible Activity:"}
                            </h5>
                            <p className="text-charcoal/90 leading-relaxed bg-[#FAF8F5] p-3 border border-charcoal/10 rounded">
                              {plan.homework}
                            </p>
                          </div>
                        </div>
                      )}

                      {activeSlideIndex === 4 + plan.presentationSlides.length && (
                        <div className="space-y-4 text-center max-w-xl mx-auto py-4">
                          <div className="text-xs font-mono text-amber-gold uppercase tracking-widest">
                            {isAr ? "لفتة تأملية بأسلوب وضاح الزليل" : "Mindful Insight by Waddah Al-Zulil"}
                          </div>
                          <blockquote className="text-lg font-serif italic text-charcoal font-semibold leading-relaxed border-x-4 border-autumn-yellow px-4">
                            "{plan.philosophicalTip}"
                          </blockquote>
                          <p className="text-xs text-charcoal/50 font-mono">
                            {isAr ? "وضاح للنشر الرقمي — إيقاظ الحواس والحد من الضوضاء الرقمية" : "Waddah Digital Publishing — Rescuing human connection"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Interactive Controls */}
                    <div className="flex items-center justify-between border-t border-charcoal/10 pt-4">
                      <button
                        onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
                        disabled={activeSlideIndex === 0}
                        className="paper-btn px-3 py-1.5 text-xs flex items-center gap-1 cursor-pointer disabled:opacity-40"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        {isAr ? "السابق" : "Prev"}
                      </button>

                      <button
                        onClick={() =>
                          setActiveSlideIndex(Math.min(4 + plan.presentationSlides.length, activeSlideIndex + 1))
                        }
                        disabled={activeSlideIndex === 4 + plan.presentationSlides.length}
                        className="paper-btn px-3 py-1.5 text-xs flex items-center gap-1 cursor-pointer disabled:opacity-40"
                      >
                        {isAr ? "التالي" : "Next"}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Written Paper Plan Draft */}
                  <div className="paper-card p-6 bg-[#FAF8F5] space-y-4 border-2 border-charcoal">
                    <div className="flex items-center gap-2 border-b pb-2 border-charcoal/10">
                      <FileText className="w-5 h-5 text-charcoal" />
                      <h4 className="font-serif font-bold text-base text-charcoal">
                        {isAr ? "مسودة خطة المعلم الورقية الكاملة" : "Complete Written Lesson Draft"}
                      </h4>
                    </div>

                    <div className="space-y-4 text-sm text-charcoal/90 leading-relaxed font-sans">
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-white p-3 border border-charcoal/15 rounded">
                        <div>
                          <strong>{isAr ? "المادة:" : "Subject:"}</strong> {plan.metadata.subject}
                        </div>
                        <div>
                          <strong>{isAr ? "المستوى:" : "Level:"}</strong> {plan.metadata.grade}
                        </div>
                        <div>
                          <strong>{isAr ? "المدة:" : "Duration:"}</strong> {plan.metadata.duration} {isAr ? "دقيقة" : "mins"}
                        </div>
                        <div>
                          <strong>{isAr ? "دليل المنهج:" : "Curriculum:"}</strong> {plan.metadata.curriculum}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h5 className="font-serif font-bold text-charcoal">{isAr ? "الأهداف السلوكية للدرس:" : "Learning Objectives:"}</h5>
                        <ul className="list-disc list-inside space-y-0.5">
                          {plan.objectives.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <h5 className="font-serif font-bold text-charcoal">{isAr ? "الوسائل والتهيئة الصفية:" : "Classroom Setup & Materials:"}</h5>
                        <ul className="list-disc list-inside space-y-0.5">
                          {plan.materials.map((mat, i) => (
                            <li key={i}>{mat}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <h5 className="font-serif font-bold text-charcoal">{isAr ? "مراحل عرض الدرس بالتفصيل:" : "Detailed Presentation Sections:"}</h5>
                        {plan.presentationSlides.map((slide, sIdx) => (
                          <div key={sIdx} className="bg-white p-3 border border-charcoal/10 rounded my-2">
                            <strong className="text-amber-gold font-serif block mb-1">
                              ({sIdx + 1}) {slide.slideTitle}
                            </strong>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                              {slide.slideContent.map((bullet, bIdx) => (
                                <li key={bIdx}>{bullet}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1 bg-white p-4 border-2 border-charcoal rounded shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                        <span className="font-serif italic font-bold text-amber-gold block mb-1">
                          {isAr ? "توجيهات وضاح الزليل التأملية:" : "Waddah Al-Zulil Pedagogical Reflection:"}
                        </span>
                        <p className="font-serif italic text-xs leading-relaxed">"{plan.philosophicalTip}"</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons for Additional Tools (Below preparation) */}
                  <div className="bg-white p-5 border-2 border-charcoal rounded-lg shadow-[4px_4px_0px_#1A1A1A] space-y-3 mt-6">
                    <h5 className="font-serif font-bold text-xs text-charcoal flex items-center gap-1.5 border-b pb-2 border-charcoal/15">
                      <Sparkles className="w-4 h-4 text-amber-gold" />
                      <span>{isAr ? "أدوات التخطيط التفاعلية المرتبطة بالدرس" : "Interactive Planning Tools Mapped to This Lesson"}</span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveOutputTab("exam");
                          setTimeout(() => {
                            const el = document.getElementById("lesson-planner-outputs-section");
                            if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
                          }, 50);
                        }}
                        className="p-3 bg-[#FAF8F5] border-2 border-charcoal hover:bg-autumn-yellow/10 rounded-lg flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group active:translate-y-0.5"
                      >
                        <ClipboardList className="w-6 h-6 text-[#C5A021] group-hover:scale-110 transition-transform" />
                        <span className="font-serif font-bold text-xs text-charcoal">{isAr ? "توليد اختبار نموذجي" : "Generate Model Exam"}</span>
                        <span className="text-[9px] text-slate-500 font-sans">{isAr ? "توليد وضبط ورقة أسئلة متكاملة" : "Generate 10-point printable exam"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveOutputTab("activities");
                          setTimeout(() => {
                            const el = document.getElementById("lesson-planner-outputs-section");
                            if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
                          }, 50);
                        }}
                        className="p-3 bg-[#FAF8F5] border-2 border-charcoal hover:bg-autumn-yellow/10 rounded-lg flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group active:translate-y-0.5"
                      >
                        <Shuffle className="w-6 h-6 text-green-700 group-hover:scale-110 transition-transform" />
                        <span className="font-serif font-bold text-xs text-charcoal">{isAr ? "ابتكار نشاط صفي" : "Create Sensory Activity"}</span>
                        <span className="text-[9px] text-slate-500 font-sans">{isAr ? "ألعاب تفاعلية حسية للطلاب" : "Zero-screen interactive games"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveOutputTab("mindmap");
                          setTimeout(() => {
                            const el = document.getElementById("lesson-planner-outputs-section");
                            if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
                          }, 50);
                        }}
                        className="p-3 bg-[#FAF8F5] border-2 border-charcoal hover:bg-autumn-yellow/10 rounded-lg flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group active:translate-y-0.5"
                      >
                        <Map className="w-6 h-6 text-amber-gold group-hover:scale-110 transition-transform" />
                        <span className="font-serif font-bold text-xs text-charcoal">{isAr ? "رسم خريطة ذهنية" : "Generate Mind Map"}</span>
                        <span className="text-[9px] text-slate-500 font-sans">{isAr ? "رسم شجري تماثلي للسبورة" : "Chalkboard tree diagram draft"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 2: Suggested Exam */}
              {activeOutputTab === "exam" && (
                <div className="paper-card p-6 bg-[#FAF8F5] border-2 border-charcoal space-y-6">
                  {/* Exam Printable Header */}
                  <div className="bg-white p-6 border-2 border-charcoal rounded text-center relative shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                    <span className="absolute top-2 left-3 font-mono text-[10px] text-charcoal/40">
                      {isAr ? "مسودة ورقية قابلة للطباعة" : "Paper Draft"}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-charcoal">
                      {plan.examProposal?.title || (isAr ? "اختبار تقويمي مقترح" : "Suggested Assessment Sheet")}
                    </h3>
                    <div className="grid grid-cols-3 gap-3 text-xs font-mono border-t border-b border-charcoal/20 py-2.5 my-4">
                      <div>
                        {isAr ? "المادة:" : "Subject:"} {plan.metadata.subject}
                      </div>
                      <div>
                        {isAr ? "الصف الدراسي:" : "Level:"} {plan.metadata.grade}
                      </div>
                      <div>{isAr ? "الدرجة المستحقة: [10 درجات]" : "Score: [10 marks]"}</div>
                    </div>
                    {/* Student details mock fields for real printable look */}
                    <div className="flex justify-between items-center text-xs font-serif mt-3 text-charcoal/70">
                      <div>
                        {isAr ? "اسم الطالب الكلي: ......................................." : "Student Full Name: ......................................."}
                      </div>
                      <div>{isAr ? "تاريخ اليوم: .... / .... / 2026م" : "Date: .... / .... / 2026"}</div>
                    </div>
                  </div>

                  {/* Exam Questions list */}
                  <div className="space-y-6">
                    {plan.examProposal?.questions.map((q, idx) => (
                      <div key={idx} className="bg-white p-4 border border-charcoal/20 rounded space-y-3">
                        <div className="flex items-start gap-2">
                          <span className="font-mono bg-charcoal text-white w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <h5 className="font-serif font-bold text-sm text-charcoal leading-relaxed">{q.questionText}</h5>
                        </div>

                        {/* Question body layout depending on type */}
                        {q.type === "mcq" && q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans pl-8 pr-2">
                            {q.options.map((opt, oIdx) => {
                              const letters = ["أ", "ب", "ج", "د"];
                              const lettersEn = ["A", "B", "C", "D"];
                              const label = isAr ? letters[oIdx] : lettersEn[oIdx];
                              return (
                                <div key={oIdx} className="flex items-center gap-2 p-2 bg-[#FAF8F5] border rounded">
                                  <span className="font-mono text-[10px] bg-charcoal/10 px-1.5 py-0.5 rounded text-charcoal font-bold">
                                    {label}
                                  </span>
                                  <span className="font-medium text-charcoal/90">{opt}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {q.type === "true_false" && (
                          <div className="flex items-center gap-4 text-xs font-sans pl-8 pr-2">
                            <div className="flex items-center gap-1.5">
                              <input type="checkbox" disabled className="w-4 h-4" />
                              <span>{isAr ? "صح [ √ ]" : "True [ √ ]"}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <input type="checkbox" disabled className="w-4 h-4" />
                              <span>{isAr ? "خطأ [ X ]" : "False [ X ]"}</span>
                            </div>
                          </div>
                        )}

                        {q.type === "essay" && (
                          <div className="space-y-1.5 pl-8 text-charcoal/30 font-mono text-xs select-none">
                            <p>........................................................................................................</p>
                            <p>........................................................................................................</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Toggle Answer key */}
                  <div className="border-t border-charcoal/20 pt-4 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setShowAnswerKey(!showAnswerKey)}
                      className="paper-btn border-2 border-charcoal bg-white py-2 px-4 text-xs flex items-center gap-2 font-bold hover:bg-[#FAF8F5] shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-y-0.5 transition-all cursor-pointer"
                    >
                      {showAnswerKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showAnswerKey ? (isAr ? "إخفاء نموذج الإجابة" : "Hide Answer Key") : (isAr ? "عرض نموذج الإجابة النموذجي" : "Show Answer Key")}
                    </button>

                    {showAnswerKey && (
                      <div className="w-full mt-4 bg-white p-4 border-2 border-dashed border-[#C5A021] rounded text-xs animate-fade-in space-y-3">
                        <h4 className="font-serif font-bold text-sm text-[#C5A021] flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          {isAr ? "دليل المعلم لإجابات الأسئلة:" : "Teacher Guide Model Answers:"}
                        </h4>
                        <div className="space-y-2.5 font-sans divide-y divide-charcoal/10">
                          {plan.examProposal?.questions.map((q, idx) => (
                            <div key={idx} className="pt-2 text-charcoal/90">
                              <span className="font-bold text-[#C5A021]">({idx + 1}):</span> {q.questionText}
                              <p className="mt-1 font-mono text-[#1A365D] bg-[#FAF8F5] p-2 rounded border border-charcoal/5 font-semibold">
                                {isAr ? "الإجابة الصحيحة:" : "Correct Answer:"} {q.correctAnswer}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setActiveOutputTab("plan");
                        setTimeout(() => {
                          const el = document.getElementById("lesson-planner-outputs-section");
                          if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
                        }, 50);
                      }}
                      className="mt-6 text-xs text-charcoal/70 hover:text-[#C5A021] font-serif font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>{isAr ? "⬅️ العودة لشرائح وتحضير الدرس" : "⬅️ Return to Lesson Plan & Slides"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 3: Interactive Unplugged Activities */}
              {activeOutputTab === "activities" && (
                <div className="space-y-6">
                  <div className="paper-card p-5 bg-white border-2 border-charcoal">
                    <h4 className="text-lg font-serif font-bold text-charcoal mb-1">
                      {isAr ? "🎲 الأنشطة والتعلم النشط الخالي من الأجهزة" : "🎲 Unplugged Interactive Classroom Games"}
                    </h4>
                    <p className="text-xs text-charcoal/70">
                      {isAr
                        ? "استراتيجيات حركة وحوار واقعي تفصل الطلاب عن غمر الشاشات الرقمية وتغرس حضورهم الحسي."
                        : "Educational methods encouraging physically active, collaborative play with zero screens."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plan.interactiveActivities?.map((act, idx) => (
                      <div
                        key={idx}
                        className="paper-card p-5 bg-white border-2 border-charcoal border-l-8 border-l-amber-gold relative flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b pb-1.5 border-charcoal/10">
                            <span className="font-serif font-bold text-sm text-[#C5A021]">{act.gameName}</span>
                            <span className="font-mono text-[9px] uppercase font-bold bg-charcoal/10 text-charcoal px-2 py-0.5 rounded">
                              {act.strategy}
                            </span>
                          </div>

                          <p className="text-xs text-charcoal/85 leading-relaxed font-sans">{act.description}</p>
                        </div>

                        {/* Screen-free adaptive highlight card */}
                        <div className="mt-4 bg-[#FAF8F5] p-3 border border-dashed border-[#C5A021] rounded text-[11px] space-y-1 text-charcoal/90 leading-normal">
                          <strong className="text-amber-gold block font-serif">
                            {isAr ? "🌱 التكيف مع البيئة والتعليم اليدوي:" : "🌱 Environmental Screen-free Adaptability:"}
                          </strong>
                          <p className="font-sans italic">{act.environmentalAdaptation}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveOutputTab("plan");
                        setTimeout(() => {
                          const el = document.getElementById("lesson-planner-outputs-section");
                          if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
                        }, 50);
                      }}
                      className="paper-btn border-2 border-charcoal bg-white py-2 px-6 text-xs flex items-center gap-2 font-bold hover:bg-[#FAF8F5] shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-y-0.5 transition-all cursor-pointer"
                    >
                      <span>{isAr ? "⬅️ العودة لشرائح وتحضير الدرس" : "⬅️ Return to Lesson Plan & Slides"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 4: Chalkboard Mind Map */}
              {activeOutputTab === "mindmap" && (
                <div className="space-y-6">
                  <div className="paper-card p-5 bg-white border-2 border-charcoal">
                    <h4 className="text-lg font-serif font-bold text-charcoal mb-1">
                      {isAr ? "🌿 الخريطة الهيكلية الشجرية للسبورة" : "🌿 Chalkboard Visual Tree Structure"}
                    </h4>
                    <p className="text-xs text-charcoal/70">
                      {isAr
                        ? "دليل تخطيطي لتسهيل رسم الأفكار والمستويات على السبورة المدرسية باستعمال الطباشير أو الأقلام الملونة."
                        : "A clear schematic designed to help teachers map key topics on the physical chalkboard using simple chalk."}
                    </p>
                  </div>

                  {/* Chalkboard simulation container */}
                  <div className="bg-[#262F36] text-white p-6 rounded-lg border-4 border-charcoal shadow-inner space-y-6 font-mono text-xs overflow-x-auto relative">
                    {/* Blackboard header */}
                    <div className="absolute top-2 right-3 text-[9px] text-white/30 tracking-widest font-sans">
                      {isAr ? "السبورة المدرسية" : "CHALKBOARD DESIGN"}
                    </div>

                    <div className="text-center py-2 border-b border-white/10">
                      <span className="text-amber-gold font-serif font-bold text-base bg-[#1F262B] px-4 py-1.5 border border-amber-gold/30 rounded inline-block">
                        [ {plan.mindMap?.mainTopic || plan.title} ]
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                      {plan.mindMap?.branches.map((b, idx) => (
                        <div key={idx} className="bg-[#1F262B]/60 p-4 border border-white/10 rounded space-y-2.5">
                          <h6 className="font-serif font-bold text-sm text-[#C5A021] border-b border-dashed border-amber-gold/30 pb-1">
                            * {b.heading}
                          </h6>
                          <ul className="space-y-1.5 list-none text-[11px] text-white/90">
                            {b.items.map((it, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-[#C5A021]">├─</span>
                                <span className="font-sans leading-tight">{it}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="text-center text-white/20 text-[9px] pt-4 border-t border-white/5 font-sans uppercase">
                      {isAr
                        ? "منصة المعلم العربي — رسم باليد الملموسة لتثبيت الوعي والهدوء"
                        : "Arab Teacher Platform — Restore physical drawing for deep focus"}
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveOutputTab("plan");
                        setTimeout(() => {
                          const el = document.getElementById("lesson-planner-outputs-section");
                          if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
                        }, 50);
                      }}
                      className="paper-btn border-2 border-charcoal bg-white py-2 px-6 text-xs flex items-center gap-2 font-bold hover:bg-[#FAF8F5] shadow-[2px_2px_0px_0px_#1A1A1A] active:translate-y-0.5 transition-all cursor-pointer"
                    >
                      <span>{isAr ? "⬅️ العودة لشرائح وتحضير الدرس" : "⬅️ Return to Lesson Plan & Slides"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
