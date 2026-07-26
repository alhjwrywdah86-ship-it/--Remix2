import React from "react";
import {
  Award,
  BookOpen,
  Sparkles,
  Presentation,
  Database,
  Users,
  CheckCircle,
  FileCheck2,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  Globe,
  GraduationCap,
  HeartHandshake
} from "lucide-react";
import WaddahAvatarSymbol from "./WaddahAvatarSymbol";

interface LandingPageProps {
  onStartDemo?: () => void;
  onExplorePlatform?: () => void;
  onOpenPricing?: () => void;
  onUpgradeClick?: () => void;
  onOpenLegal?: (tab: "about" | "privacy" | "terms" | "contact") => void;
  lang: "ar" | "en";
  onToggleLang?: () => void;
}

export default function LandingPage({
  onStartDemo,
  onExplorePlatform,
  onOpenPricing,
  onUpgradeClick,
  onOpenLegal,
  lang,
  onToggleLang
}: LandingPageProps) {
  const isAr = lang === "ar";
  const handleStart = onStartDemo || onExplorePlatform || (() => {});
  const handleUpgrade = onOpenPricing || onUpgradeClick || (() => {});

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1A365D] selection:bg-[#C5A021] selection:text-white" dir={isAr ? "rtl" : "ltr"}>
      {/* Top Banner */}
      <div className="bg-[#122846] text-white text-xs py-2 px-6 border-b border-[#C5A021]/30 flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C5A021] animate-pulse"></span>
          <span className="text-[#C5A021] font-bold">
            {isAr ? "منصة التعليم الرقمية التجاري - المرحلة 5:" : "EdTech Commercial SaaS Platform Phase 5:"}
          </span>
          <span className="hidden md:inline text-slate-300">
            {isAr
              ? "إمكانات جيل القادمة للمعلم المحترف والمدارس المتقدمة"
              : "Next-gen EdTech engine for professional teachers & school networks"}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <button onClick={onToggleLang} className="text-amber-300 hover:underline flex items-center gap-1 cursor-pointer">
            <Globe className="w-3.5 h-3.5" />
            <span>{isAr ? "English" : "العربية"}</span>
          </button>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 md:px-12 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1A365D] text-[#C5A021] rounded-xl flex items-center justify-center font-bold shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-lg font-serif font-bold text-[#1A365D] block leading-tight">
              {isAr ? "المعلم العربي المحترف" : "The Pro Arab Teacher"}
            </span>
            <span className="text-[10px] text-slate-400 font-mono block">
              {isAr ? "وضاح للنشر الرقمي © 2026" : "Waddah Publishing © 2026"}
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6 font-mono text-xs text-slate-600 font-semibold">
          <a href="#features" className="hover:text-[#C5A021] transition-colors">{isAr ? "المميزات" : "Features"}</a>
          <a href="#curriculum" className="hover:text-[#C5A021] transition-colors">{isAr ? "المكتبة المنهجية" : "Curriculum"}</a>
          <a href="#analytics" className="hover:text-[#C5A021] transition-colors">{isAr ? "التحليل والاختبارات" : "Analytics"}</a>
          <button onClick={onOpenPricing} className="hover:text-[#C5A021] transition-colors cursor-pointer">{isAr ? "الخطط والأسعار" : "Pricing"}</button>
          <button onClick={() => onOpenLegal("about")} className="hover:text-[#C5A021] transition-colors cursor-pointer">{isAr ? "عن المنصة" : "About Us"}</button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPricing}
            className="px-3.5 py-2 border border-[#C5A021] text-[#1A365D] hover:bg-amber-50 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer hidden sm:flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-[#C5A021]" />
            <span>{isAr ? "الاشتراكات" : "Plans"}</span>
          </button>
          <button
            onClick={onStartDemo}
            className="px-5 py-2.5 bg-[#1A365D] hover:bg-[#122846] text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-md flex items-center gap-2"
          >
            <span>{isAr ? "دخول المنصة مجاناً" : "Launch App"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-6 py-16 md:px-12 md:py-24 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/80 border border-amber-300 rounded-full text-xs font-mono font-bold text-[#1A365D]">
              <Sparkles className="w-4 h-4 text-[#C5A021]" />
              <span>{isAr ? "الجيل الجديد من حلول الذكاء الاصطناعي البيداغوجي" : "Next Generation AI Pedagogical Solution"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1A365D] leading-tight tracking-tight">
              {isAr ? (
                <>
                  منصة <span className="text-[#C5A021] underline decoration-[#C5A021]/30 decoration-wavy">المعلم العربي المحترف</span> المتكاملة للمناهج والتحضير الفعّال
                </>
              ) : (
                <>
                  Empowering Educators with <span className="text-[#C5A021]">AI Curriculum Planning</span> & Automated Grading
                </>
              )}
            </h1>

            <p className="text-slate-600 font-serif text-sm md:text-base leading-relaxed max-w-2xl">
              {isAr
                ? "صممت المنصة خصيصاً للمعلمين والمدارس للتحضير اليومي الذكي، توليد عروض الباوربوينت، إنشاء بنك الأسئلة والاختبارات الإلكترونية بالتصحيح الآلي، مع التحليل التربوي وخطط الدعم العلاجي."
                : "A unified EdTech SaaS ecosystem for lesson planning, PPTX creation, textbook alignment, auto-graded online quizzes, and student performance analytics."}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onStartDemo}
                className="px-6 py-3.5 bg-[#C5A021] hover:bg-amber-400 text-[#1A365D] font-mono text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Award className="w-5 h-5 text-[#1A365D]" />
                <span>{isAr ? "تجربة المنصة الآن" : "Start Free Trial"}</span>
              </button>

              <button
                onClick={onOpenPricing}
                className="px-6 py-3.5 bg-white border-2 border-slate-200 hover:border-[#C5A021] text-[#1A365D] font-mono text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-[#C5A021]" />
                <span>{isAr ? "استعراض الخطط والأسعار" : "View SaaS Pricing"}</span>
              </button>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? "متوافق مع مناهج اليمن والعالم العربي" : "100% Curriculum Aligned"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? "تصدير Word و PowerPoint" : "Word & PPTX Export"}</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-gradient-to-br from-[#1A365D] to-[#122846] p-6 md:p-8 rounded-3xl border-2 border-[#C5A021]/40 shadow-2xl text-white space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <WaddahAvatarSymbol className="w-12 h-12" />
                  <div>
                    <h3 className="font-serif font-bold text-amber-300 text-sm">
                      {isAr ? "الأستاذ وضاح أحمد حسن الزُّليل" : "Waddah Ahmed Al-Zulil"}
                    </h3>
                    <p className="text-[10px] text-slate-300 font-mono">
                      {isAr ? "مؤسس رؤية التعليم الهادئ والواقعي" : "Founder & Pedagogical Visionary"}
                    </p>
                  </div>
                </div>
                <span className="bg-[#C5A021] text-[#1A365D] text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                  2026
                </span>
              </div>

              <div className="space-y-3 font-serif text-xs text-slate-200">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#C5A021] flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white">{isAr ? "المكتبة المنهجية الجاهزة" : "Curriculum Library"}</p>
                    <p className="text-[10px] text-slate-300">{isAr ? "مئات الدروس والكتب والملخصات المجهزة" : "Preseeded textbooks & units"}</p>
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                  <FileCheck2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white">{isAr ? "الاختبارات والتصحيح الآلي" : "Auto-Graded Quizzes"}</p>
                    <p className="text-[10px] text-slate-300">{isAr ? "تصحيح إلكتروني وتصدير درجات فوري" : "Instant student portal & feedback"}</p>
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-purple-300 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white">{isAr ? "التحليل والخطط العلاجية" : "Remedial AI Engine"}</p>
                    <p className="text-[10px] text-slate-300">{isAr ? "تحديد جوانب القوة والضعف لكل طالب" : "Identify weaknesses & action plans"}</p>
                  </div>
                </div>
              </div>

              <p className="text-[11px] font-mono text-center text-amber-200/80 italic border-t border-white/10 pt-3">
                {isAr ? "العودة للحضور الملموس والواقعية في التربية والتدريس" : "Return to tangible presence and real-world pedagogy"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[#1A365D] text-white py-12 px-6 border-y border-[#C5A021]/30">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center font-mono">
          <div>
            <p className="text-3xl md:text-4xl font-serif font-bold text-[#C5A021]">15+</p>
            <p className="text-xs text-slate-300 mt-1">{isAr ? "ساعة عمل موفرة أسبوعياً للمعلم" : "Hours Saved Weekly / Teacher"}</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-serif font-bold text-[#C5A021]">100%</p>
            <p className="text-xs text-slate-300 mt-1">{isAr ? "دقة التوافق مع المناهج الرسمية" : "Official Curriculum Alignment"}</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-serif font-bold text-[#C5A021]">88%</p>
            <p className="text-xs text-slate-300 mt-1">{isAr ? "تحسن نسب النجاح بالتوصيات العلاجية" : "Pass Rate Improvement"}</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-serif font-bold text-[#C5A021]">3</p>
            <p className="text-xs text-slate-300 mt-1">{isAr ? "أدوار متكاملة (معلم، طالب، مشرف)" : "Unified User Roles"}</p>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold text-[#C5A021] bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
            {isAr ? "الحل الشامل للتطوير التعليمي" : "Comprehensive SaaS Capabilities"}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1A365D]">
            {isAr ? "أدوات الذكاء الاصطناعي المصممة لخدمة المعلم والمدرسة" : "Designed for Modern Teachers & Educational Institutions"}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-serif">
            {isAr
              ? "بيئة واحدة تحتوي على كافة ما يحتاجه المعلم العربي من تخطيط وتقويم وتحليل."
              : "All essential pedagogical tools combined into one intuitive, responsive interface."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-amber-100 text-[#C5A021] rounded-xl flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1A365D]">{isAr ? "المخطط المنهجي الذكي" : "AI Lesson Planner"}</h3>
            <p className="text-xs text-slate-600 font-serif leading-relaxed">
              {isAr
                ? "إنشاء خطط دروس متكاملة بجميع عناصرها المنهجية، النتاجات، الأنشطة الفردية والجماعية، والتصاميم المخصصة."
                : "Generate complete lesson plans aligned with specific subject standards and classroom levels."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold">
              <Presentation className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1A365D]">{isAr ? "مولد PowerPoint التلقائي" : "PPTX Presentation Builder"}</h3>
            <p className="text-xs text-slate-600 font-serif leading-relaxed">
              {isAr
                ? "توليد ملفات العروض التقديمية وتنزيلها مباشرة بملف PPTX جاهز للوايت بورد والبروجكتر."
                : "Create beautiful, ready-to-present PowerPoint slides generated directly from subject content."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1A365D]">{isAr ? "بوابة الاختبارات والتصحيح" : "Online Quizzes & Auto-Grade"}</h3>
            <p className="text-xs text-slate-600 font-serif leading-relaxed">
              {isAr
                ? "نشر اختبارات بنك الأسئلة للطلاب مع توقيت، وتصحيح آلي فوري وإصدار الشهادات وسجل الدرجات."
                : "Publish timed online quizzes to students with instant automated grading and breakdown feedback."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center font-bold">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1A365D]">{isAr ? "التحليل البيداغوجي الذكي" : "Smart Pedagogical Analytics"}</h3>
            <p className="text-xs text-slate-600 font-serif leading-relaxed">
              {isAr
                ? "تحليل نتائج الطلاب ومستويات الفهم وتوليد توصيات علاجية موجهة لكل طالب أو فصل."
                : "Analyze student marks and weakness areas to produce targeted AI remedial and enrichment tasks."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-amber-100 text-[#C5A021] rounded-xl flex items-center justify-center font-bold">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1A365D]">{isAr ? "مكتبتي الشخصية الحافظة" : "Personal Content Library"}</h3>
            <p className="text-xs text-slate-600 font-serif leading-relaxed">
              {isAr
                ? "حفظ جميع الدروس والاختبارات المولدة واسترجاعها وتعديلها وطباعتها بأي وقت دون فقدان."
                : "Save and organize your generated lesson plans, worksheets, and quizzes for future semesters."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1A365D]">{isAr ? "إدارة الفصول والحضور" : "Classroom & Attendance Roster"}</h3>
            <p className="text-xs text-slate-600 font-serif leading-relaxed">
              {isAr
                ? "تسجيل حضور وغياب الطلاب اليومي مع رصد درجات المشاركة والواجبات والاختبار النهائي."
                : "Maintain complete student rosters, track daily attendance, and calculate final weighted scores."}
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER & LEGAL NAVIGATION */}
      <footer className="bg-[#122846] text-white py-12 px-6 md:px-12 border-t border-[#C5A021]/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs font-serif">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-[#C5A021]" />
              <span className="font-serif font-bold text-base text-white">{isAr ? "المعلم العربي المحترف" : "The Pro Teacher"}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {isAr
                ? "منصة تعليمية متكاملة لخدمة المعلم العربي وتفعيل مبادئ التربية الهادئة والمناهج الحديثة."
                : "Empowering educators across Yemen & the Arab world with smart, respectful EdTech solutions."}
            </p>
            <p className="text-[10px] font-mono text-[#C5A021]">
              © 2026 {isAr ? "وضاح للنشر الرقمي" : "Waddah Digital Publishing"}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#C5A021] mb-3 font-mono">{isAr ? "روابط سريعة" : "Quick Links"}</h4>
            <ul className="space-y-2 text-slate-300">
              <li><button onClick={onStartDemo} className="hover:text-amber-300 cursor-pointer">{isAr ? "تطبيق المعلم" : "Teacher App"}</button></li>
              <li><button onClick={onOpenPricing} className="hover:text-amber-300 cursor-pointer">{isAr ? "خطط الاشتراكات" : "SaaS Pricing"}</button></li>
              <li><button onClick={() => onOpenLegal("about")} className="hover:text-amber-300 cursor-pointer">{isAr ? "عن التطبيق والفلسفة" : "About Platform"}</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#C5A021] mb-3 font-mono">{isAr ? "الصفحات القانونية" : "Legal & Privacy"}</h4>
            <ul className="space-y-2 text-slate-300">
              <li><button onClick={() => onOpenLegal("privacy")} className="hover:text-amber-300 cursor-pointer">{isAr ? "سياسة الخصوصية" : "Privacy Policy"}</button></li>
              <li><button onClick={() => onOpenLegal("terms")} className="hover:text-amber-300 cursor-pointer">{isAr ? "شروط الاستخدام والترخيص" : "Terms of Service"}</button></li>
              <li><button onClick={() => onOpenLegal("contact")} className="hover:text-amber-300 cursor-pointer">{isAr ? "اتصل بنا والدعم" : "Contact Support"}</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#C5A021] mb-3 font-mono">{isAr ? "المطور والملكية" : "Author & Publisher"}</h4>
            <p className="text-slate-300 font-bold">{isAr ? "الأستاذ وضاح أحمد حسن الزُّليل" : "Waddah Ahmed Hassan Al-Zulil"}</p>
            <p className="text-slate-400 text-[11px] mt-1 font-mono">alhjwrywdah86@gmail.com</p>
            <p className="text-slate-400 text-[11px] font-mono">{isAr ? "صنعاء / ريف اليمن المعطاء" : "Sanaa / Rural Yemen"}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
