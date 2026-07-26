import React, { useState } from "react";
import { SubscriptionPlan, UserSubscription } from "../types";
import { Check, Sparkles, CreditCard, Shield, Zap, Award, Gift, Lock, ArrowRight, X } from "lucide-react";

interface SubscriptionModalProps {
  isOpen?: boolean;
  onClose: () => void;
  lang: "ar" | "en";
  currentSubscription?: UserSubscription;
  onUpgradeSuccess: (newSubscription: UserSubscription) => void;
}

export default function SubscriptionModal({
  isOpen = true,
  onClose,
  lang,
  currentSubscription,
  onUpgradeSuccess
}: SubscriptionModalProps) {
  const isAr = lang === "ar";
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [voucherCode, setVoucherCode] = useState("");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [voucherSuccess, setVoucherSuccess] = useState("");
  const [voucherError, setVoucherError] = useState("");

  if (!isOpen) return null;

  const plans: SubscriptionPlan[] = [
    {
      id: "free",
      nameAr: "الخطة المجانية",
      nameEn: "Free Explorer",
      priceMonthlyUSD: 0,
      priceYearlyUSD: 0,
      aiGenerationsPerMonth: 15,
      maxClassrooms: 2,
      maxStudentsPerClass: 20,
      featuresAr: [
        "15 عملية تحضير بالذكاء الاصطناعي شهرياً",
        "إدارة فصلين دراسيين (حتى 20 طالباً)",
        "إنشاء اختبارات قصيرة من بنك الأسئلة",
        "تصفح الكتب المنهجية العامة"
      ],
      featuresEn: [
        "15 AI generations per month",
        "Manage 2 classrooms (20 students max)",
        "Basic Quiz & Question Bank access",
        "Browse preseeded textbooks"
      ]
    },
    {
      id: "pro_teacher",
      nameAr: "خطة المعلم المحترف",
      nameEn: "Pro Teacher Plan",
      priceMonthlyUSD: 9.99,
      priceYearlyUSD: 89.99, // 25% discount
      aiGenerationsPerMonth: -1,
      maxClassrooms: 15,
      maxStudentsPerClass: 60,
      popular: true,
      featuresAr: [
        "توليد وحفظ غير محدود للدروس والخطط بالذكاء الاصطناعي",
        "تصدير العروض التقديمية PowerPoint كاملة التنسيق",
        "إدارة حتى 15 فصلاً دراسياً بالسجل الإلكتروني",
        "التصحيح التلقائي الفوري للاختبارات الإلكترونية",
        "توليد الخطط العلاجية والتوصيات البيداغوجية للطلاب",
        "تنزيل وتصدير أوراق العمل وملفات Word مجاناً",
        "الوصول الشامل لمكتبة المناهج اليمنية والعربية"
      ],
      featuresEn: [
        "Unlimited AI lesson planning & preparation",
        "Export full custom PowerPoint (PPTX) presentations",
        "Manage 15 classrooms & full gradebook",
        "Instant online quiz auto-grading",
        "AI student remedial & enrichment plans",
        "Export editable Word worksheets",
        "Full access to Yemen & Arab textbook library"
      ]
    },
    {
      id: "school_enterprise",
      nameAr: "خطة المدارس والمؤسسات",
      nameEn: "School & Institutional",
      priceMonthlyUSD: 49.99,
      priceYearlyUSD: 450.00,
      aiGenerationsPerMonth: -1,
      maxClassrooms: 100,
      maxStudentsPerClass: 100,
      featuresAr: [
        "حسابات قيادية متعددة للمعلمين والإدارة والمشرفين",
        "لوحة تحكم إدارية شاملة لمراقبة الأداء الأكاديمي",
        "تقارير وإحصائيات متقدمة للطلاب والمواد",
        "إضافة شعار المدرسة والهوية المخصصة للشهادات",
        "أولوية السرعة في استجابة الذكاء الاصطناعي والدعم الفني",
        "نسخ احتياطي واستعادة كاملة للبيانات"
      ],
      featuresEn: [
        "Multi-teacher & Supervisor institutional accounts",
        "Executive School Admin & Academic Dashboard",
        "Advanced analytics on subjects & overall progress",
        "Custom school logo on test headers & gradebooks",
        "Priority AI server speed & 24/7 dedicated support",
        "Full database backup & data migration tools"
      ]
    }
  ];

  const handleSubscribe = (tier: "free" | "pro_teacher" | "school_enterprise") => {
    setLoadingTier(tier);
    fetch("/api/subscriptions/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "teacher_1",
        tier,
        voucherCode
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setLoadingTier(null);
        if (data.success && data.subscription) {
          onUpgradeSuccess(data.subscription);
          onClose();
        }
      })
      .catch(() => {
        setLoadingTier(null);
        // Fallback local upgrade if offline
        const localSub: UserSubscription = {
          userId: "teacher_1",
          tier,
          status: "active",
          startDate: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
          aiCreditsUsedThisMonth: 0,
          maxMonthlyCredits: tier === "free" ? 15 : -1,
          autoRenew: true
        };
        onUpgradeSuccess(localSub);
        onClose();
      });
  };

  const handleRedeemVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;

    if (voucherCode.toUpperCase().includes("WADDAH") || voucherCode.toUpperCase().includes("PRO2026") || voucherCode.toUpperCase().includes("FREEPRO")) {
      setVoucherSuccess(isAr ? "تم تفعيل القسيمة المخصصة من الأستاذ وضاح الزليل بنجاح! تم ترقيتك للخطة الاحترافية." : "Voucher redeemed! You have been upgraded to Pro Teacher.");
      setVoucherError("");
      setTimeout(() => {
        handleSubscribe("pro_teacher");
      }, 1500);
    } else {
      setVoucherError(isAr ? "رمز القسيمة غير صحيح أو منتهي الصلاحية." : "Invalid or expired voucher code.");
      setVoucherSuccess("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl my-8 overflow-hidden text-[#1A365D] animate-fade-in"
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A365D] via-[#122846] to-[#1A365D] text-white p-6 md:p-8 relative border-b border-[#C5A021]/30">
          <button
            onClick={onClose}
            className="absolute top-6 left-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#C5A021] text-[#1A365D] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {isAr ? "الباقة والاشتراكات التجاريه" : "SaaS Subscription Plans"}
            </span>
            <span className="text-amber-300 text-xs font-mono">
              {isAr ? "• وضاح للنشر الرقمي 2026" : "• Waddah Digital Publishing"}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#C5A021]">
            {isAr ? "اختر الخطة المناسبة لرحلتك التعليمية" : "Choose Your Preferred EdTech Plan"}
          </h2>
          <p className="text-xs md:text-sm text-slate-200 mt-2 font-serif max-w-2xl">
            {isAr
              ? "استمتع بقوة الذكاء الاصطناعي لإنشاء التحاضير، بنك الأسئلة، الاختبارات الإلكترونية، والتحليلات دون قيود."
              : "Unlock full AI power for lesson planning, auto-graded quizzes, and institutional reports."}
          </p>

          {/* Billing Toggle */}
          <div className="mt-6 inline-flex items-center bg-white/10 p-1.5 rounded-xl border border-white/20">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                billingCycle === "monthly" ? "bg-[#C5A021] text-[#1A365D] shadow" : "text-white hover:text-amber-200"
              }`}
            >
              {isAr ? "دفع شهري" : "Monthly Billing"}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "yearly" ? "bg-[#C5A021] text-[#1A365D] shadow" : "text-white hover:text-amber-200"
              }`}
            >
              <span>{isAr ? "دفع سنوي" : "Yearly Billing"}</span>
              <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-mono">
                {isAr ? "وفر 25%" : "Save 25%"}
              </span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-8 bg-[#F8FAFC]">
          {/* Current Quota Indicator */}
          {currentSubscription && (
            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-[#C5A021]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1A365D]">
                    {isAr ? "الاشتراك الحالي:" : "Current Subscription:"}{" "}
                    <span className="text-[#C5A021] uppercase">{currentSubscription.tier.replace("_", " ")}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {currentSubscription.maxMonthlyCredits === -1
                      ? isAr ? "استخدام الذكاء الاصطناعي: غير محدود ∞" : "AI Usage: Unlimited ∞"
                      : isAr
                      ? `تم استخدام ${currentSubscription.aiCreditsUsedThisMonth} من أصل ${currentSubscription.maxMonthlyCredits} عمليات شهرياً`
                      : `Used ${currentSubscription.aiCreditsUsedThisMonth} / ${currentSubscription.maxMonthlyCredits} monthly AI generations`}
                  </p>
                </div>
              </div>
              <div className="text-end">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                  {isAr ? "نشط" : "Active"}
                </span>
              </div>
            </div>
          )}

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const price = billingCycle === "yearly" ? plan.priceYearlyUSD : plan.priceMonthlyUSD;
              const isCurrent = currentSubscription?.tier === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all relative ${
                    plan.popular
                      ? "border-2 border-[#C5A021] shadow-xl bg-gradient-to-b from-amber-50/30 to-white"
                      : "border-slate-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C5A021] text-[#1A365D] text-[10px] font-mono font-bold px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{isAr ? "الأكثر اختياراً من المعلمين" : "Most Popular Choice"}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-[#1A365D]">{isAr ? plan.nameAr : plan.nameEn}</h3>
                      <p className="text-xs text-slate-500 mt-1 font-mono">
                        {plan.aiGenerationsPerMonth === -1
                          ? isAr ? "توليد ذكاء اصطناعي غير محدود" : "Unlimited AI Generations"
                          : isAr ? `${plan.aiGenerationsPerMonth} عملية شهرياً` : `${plan.aiGenerationsPerMonth} generations/month`}
                      </p>
                    </div>

                    {/* Price display */}
                    <div className="border-y border-slate-100 py-3">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-serif font-bold text-[#1A365D]">${price}</span>
                        <span className="text-xs text-slate-400 font-mono">
                          {price === 0
                            ? isAr ? "مجاناً دائماً" : "Free Forever"
                            : billingCycle === "yearly" ? isAr ? "/ سنوياً" : "/ year" : isAr ? "/ شهرياً" : "/ month"}
                        </span>
                      </div>
                    </div>

                    {/* Feature list */}
                    <ul className="space-y-2 text-xs text-slate-600 font-serif">
                      {(isAr ? plan.featuresAr : plan.featuresEn).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={loadingTier === plan.id || isCurrent}
                      className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        isCurrent
                          ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-default"
                          : plan.popular
                          ? "bg-[#C5A021] text-[#1A365D] hover:bg-amber-400 shadow-md hover:shadow-lg"
                          : "bg-[#1A365D] text-white hover:bg-[#122846]"
                      }`}
                    >
                      {loadingTier === plan.id ? (
                        <span>{isAr ? "جاري التفعيل..." : "Activating..."}</span>
                      ) : isCurrent ? (
                        <span>{isAr ? "خيارك الحالي" : "Current Plan"}</span>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>{plan.id === "free" ? (isAr ? "البدء مجاناً" : "Start Free") : (isAr ? "اشترك الآن" : "Upgrade Now")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Voucher Code Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-serif font-bold text-[#1A365D] flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-[#C5A021]" />
              <span>{isAr ? "تفعيل قسيمة ترقية أو كود مؤسسي" : "Redeem Voucher or Promo Code"}</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4 font-serif">
              {isAr
                ? "إذا حصلت على كود ترقية مجاني من الأستاذ وضاح الزليل أو إدارتك التعليمية، أدخله هنا لتفعيل الحساب فوراً."
                : "Enter your official access code or voucher from Waddah Publishing to activate Pro instant access."}
            </p>

            <form onSubmit={handleRedeemVoucher} className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder={isAr ? "أدخل رمز القسيمة (مثال: WADDAH2026)" : "Enter code (e.g. WADDAH2026)"}
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="flex-1 px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#C5A021] outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1A365D] hover:bg-[#122846] text-white font-mono text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                {isAr ? "تفعيل الكود" : "Redeem Code"}
              </button>
            </form>

            {voucherSuccess && (
              <p className="text-xs text-emerald-600 font-bold mt-2 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                {voucherSuccess}
              </p>
            )}
            {voucherError && (
              <p className="text-xs text-rose-600 font-bold mt-2 bg-rose-50 p-2 rounded-lg border border-rose-200">
                {voucherError}
              </p>
            )}
          </div>

          {/* Payment Security Note */}
          <div className="border-t border-slate-200 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>
                {isAr
                  ? "معاملات آمنة وموفرة للمعلمين والمدارس مع دعم جاهز للتكامل مع Stripe وبوابات الدفع المحلية."
                  : "Secured SaaS infrastructure ready for Stripe & local regional payment gateways."}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-500 font-bold">
              <span>Visa</span>
              <span>MasterCard</span>
              <span>Stripe</span>
              <span>Paypal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
