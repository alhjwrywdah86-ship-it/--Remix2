import React, { useState } from "react";
import { X, ShieldCheck, FileText, Info, Mail, Award, CheckCircle, MapPin, Phone } from "lucide-react";
import WaddahAvatarSymbol from "./WaddahAvatarSymbol";

interface LegalPagesModalProps {
  isOpen?: boolean;
  onClose: () => void;
  initialTab?: "about" | "privacy" | "terms" | "contact";
  lang: "ar" | "en";
}

export default function LegalPagesModal({
  isOpen = true,
  onClose,
  initialTab = "about",
  lang
}: LegalPagesModalProps) {
  const isAr = lang === "ar";
  const [activeTab, setActiveTab] = useState<"about" | "privacy" | "terms" | "contact">(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl my-8 overflow-hidden text-[#1A365D] animate-fade-in"
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="bg-[#1A365D] text-white p-6 relative border-b border-[#C5A021]/30">
          <button
            onClick={onClose}
            className="absolute top-6 left-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-[#C5A021]" />
            <div>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#C5A021]">
                {isAr ? "منصة المعلم العربي المحترف" : "The Professional Arab Teacher Platform"}
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                {isAr ? "الهوية التجارية، سياسة الخصوصية والتواصل © 2026" : "Commercial Identity, Legal Terms & Support © 2026"}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4">
            <button
              onClick={() => setActiveTab("about")}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "about"
                  ? "bg-[#C5A021] text-[#1A365D]"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>{isAr ? "عن المنصة والفلسفة" : "About & Philosophy"}</span>
            </button>

            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "privacy"
                  ? "bg-[#C5A021] text-[#1A365D]"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAr ? "سياسة الخصوصية" : "Privacy Policy"}</span>
            </button>

            <button
              onClick={() => setActiveTab("terms")}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "terms"
                  ? "bg-[#C5A021] text-[#1A365D]"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isAr ? "شروط الاستخدام والترخيص" : "Terms & Licensing"}</span>
            </button>

            <button
              onClick={() => setActiveTab("contact")}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "contact"
                  ? "bg-[#C5A021] text-[#1A365D]"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isAr ? "اتصل بنا والدعم" : "Contact & Support"}</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 md:p-8 space-y-6 text-sm font-serif leading-relaxed text-slate-700 bg-[#F8FAFC]">
          {activeTab === "about" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <WaddahAvatarSymbol className="w-16 h-16 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-[#1A365D]">
                    {isAr ? "رؤية المعلم الرقمي الهادئ - الأستاذ وضاح أحمد حسن الزُّليل" : "The Mindful Educator's Manifesto - Waddah Al-Zulil"}
                  </h3>
                  <p className="text-xs text-[#C5A021] font-mono mt-0.5">
                    {isAr ? "صنعاء / ريف اليمن المعطاء • النشر التربوي المتقدم" : "Sanaa / Yemen • Advanced Pedagogical Publishing"}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-bold text-[#1A365D] text-base border-b border-slate-100 pb-2">
                  {isAr ? "فلسفة المنصة والأهداف البيداغوجية" : "Platform Purpose & Pedagogical Philosophy"}
                </h4>
                <p>
                  {isAr
                    ? "تأسست منصة 'المعلم العربي المحترف' لاستعادة اتزان الموقف التعليمي داخل الصفوف الدراسية في اليمن والعالم العربي. يكمن هدفنا في تمكين المعلم عبر أدوات الذكاء الاصطناعي المساندة للتحضير السريع دون إغراقه في الشاشات والتشتت الرقمي."
                    : "The platform was built to rebalance classroom environments across Yemen and the Arab world, empowering teachers with AI tools for lesson design while maintaining focus on physical learning."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-1">
                    <p className="font-bold text-xs text-[#1A365D]">{isAr ? "• التربية الهادئة (Unplugged Learning):" : "• Unplugged Learning:"}</p>
                    <p className="text-xs text-slate-600">
                      {isAr ? "التركيز على الدفاتر الورقية والأنشطة اليدوية والتفاعل المباشر." : "Prioritizing physical paper tasks and face-to-face interaction."}
                    </p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-1">
                    <p className="font-bold text-xs text-[#1A365D]">{isAr ? "• الذكاء الاصطناعي الخادم وليس البديل:" : "• AI as a Support Tool:"}</p>
                    <p className="text-xs text-slate-600">
                      {isAr ? "الذكاء الاصطناعي يجهز الخطة والاختبار، بينما يظل المعلم هو الموجه التربوي الأول." : "AI prepares material; the teacher guides the classroom."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-[#1A365D] border-b border-slate-100 pb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>{isAr ? "سياسة الخصوصية وحماية بيانات الطلاب والمعلمين" : "Privacy Policy & Student Data Safety"}</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <p>
                  {isAr
                    ? "نلتزم في منصة المعلم العربي المحترف بحماية خصوصية وأمان جميع بيانات المعلمين والطلاب والدرجات. لا نبيع أو نشارك أية معلومات شخصية مع أي أطراف إعلانية أو تجارية خارجية."
                    : "We strictly protect student records, quiz responses, and teacher profile data. No personal info is sold to third parties."}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{isAr ? "تشفير تام لجميع المراسلات والاستجابات والتحاضير." : "Full encryption for lesson plans & student answers."}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{isAr ? "عدم تخزين بيانات الاعتماد أو بطاقات الائتمان على سيرفرات غير معتمدة." : "No credit card or sensitive credentials stored on unapproved servers."}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{isAr ? "حق المستخدم التام في تصدير حسابه أو حذفه بالكامل مع كافة ملفاته." : "Full right for teachers to export or delete their data anytime."}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-[#1A365D] border-b border-slate-100 pb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C5A021]" />
                <span>{isAr ? "حقوق الملكية الفكرية وترخيص الاستخدام التجارية" : "Commercial License & Intellectual Property"}</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <p>
                  {isAr
                    ? "جميع الحقوق الفكرية والتصميمية والأكواد البرمجية والمحتوى المنهجي محفوظة © 2026 للأستاذ وضاح أحمد حسن الزُّليل و 'وضاح للنشر الرقمي'."
                    : "All intellectual rights, design assets, and preseeded textbook models are reserved © 2026 under Waddah Al-Zulil."}
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1">
                  <p className="text-[#1A365D] font-bold">{isAr ? "شروط الترخيص:" : "Licensing Terms:"}</p>
                  <p>1. {isAr ? "يسمح للمعلم المشترك باستخدام النتاجات والطباعة داخل صفوفه المعتمدة." : "Permitted for individual classroom usage & printouts."}</p>
                  <p>2. {isAr ? "يمنع إعادة بيع أو استنساخ الشفرة البرمجية بدون موافقة كتابية رسمية." : "Reselling code or reverse engineering is prohibited."}</p>
                  <p>3. {isAr ? "تراخيص المؤسسات والمدارس تعتمد عبر لوحة التحكم القيادية للمدرسة." : "School licenses are tied to official admin access keys."}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-[#1A365D] border-b border-slate-100 pb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <span>{isAr ? "التواصل المباشر والدعم الفني والتربوي" : "Contact & Support Channels"}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <p className="text-xs font-bold text-[#1A365D] flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#C5A021]" />
                    <span>{isAr ? "البريد الإلكتروني الرسمي:" : "Official Contact Email:"}</span>
                  </p>
                  <p className="text-xs font-mono text-slate-700 bg-white p-2 rounded border border-slate-200">
                    alhjwrywdah86@gmail.com
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <p className="text-xs font-bold text-[#1A365D] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C5A021]" />
                    <span>{isAr ? "المقر والمراسلات:" : "Office & Location:"}</span>
                  </p>
                  <p className="text-xs font-serif text-slate-700 bg-white p-2 rounded border border-slate-200">
                    {isAr ? "الجمهورية اليمنية - صنعاء / ريف اليمن المعطاء" : "Republic of Yemen - Sanaa"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
