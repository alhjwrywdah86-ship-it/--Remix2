import React from "react";
import { Language } from "../types";
import { Sparkles, BookOpen, Heart, Landmark, Compass } from "lucide-react";
import WaddahAvatarSymbol from "./WaddahAvatarSymbol";

interface AboutWaddahProps {
  lang: Language;
}

export default function AboutWaddah({ lang }: AboutWaddahProps) {
  const isAr = lang === "ar";

  const quotes = isAr
    ? [
        "التعليم الحقيقي ليس تراكمًا للمعلومات الرقمية، بل هو إيقاظ للحواس وإعادة اتصال مع العالم الواقعي الملموس.",
        "حين نقلل من ضجيج الشاشات، نمنح عقول طلابنا المساحة الهادئة التي ينمو فيها التفكير النقدي والتأمل العميق.",
        "الورق يحمل عبق المعرفة، والحدود الواضحة تمنح الذهن تركيزاً لا تتيحه الروابط المتشعبة والشبكات اللانهائية.",
      ]
    : [
        "True education is not an accumulation of digital data, but an awakening of the senses and a reconnection with the tangible world.",
        "When we quiet the noise of screens, we give our students' minds the peaceful sanctuary where deep critical thinking grows.",
        "Paper carries the scent of authentic knowledge, and bold borders frame a focus that endless digital links can never replicate.",
      ];

  return (
    <div className="space-y-8 animate-fade-in" id="about-waddah-section">
      {/* Bio Card */}
      <div className="paper-card p-8 bg-white space-y-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <WaddahAvatarSymbol className="w-24 h-24" borderColor="border-charcoal border-4" />
          <div className="space-y-3 flex-1 text-center md:text-right">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
              <h2 className="text-3xl font-serif font-bold text-charcoal">
                {isAr ? "وضاح أحمد حسن الزليل" : "Waddah Ahmed Hassan Al-Zulil"}
              </h2>
              <span className="font-mono text-xs px-2 py-1 bg-autumn-yellow/20 border border-charcoal rounded">
                {isAr ? "وضاح للنشر الرقمي © 2026" : "Waddah Digital Publishing © 2026"}
              </span>
            </div>
            <p className="text-lg font-serif italic text-amber-gold">
              {isAr ? "مؤسس المنصة ورائد فلسفة التعليم الهادئ" : "Platform Founder & Pioneer of Mindful Pedagogies"}
            </p>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              {isAr
                ? "كاتب وباحث تربوي يسعى لإعادة الألق للتعليم العربي من خلال دمج تقنيات التفكير العميق مع الممارسات التعليمية الواقعية. تدعو فلسفة وضاح الزليل إلى الحد من الاستهلاك التكنولوجي السلبي (الديتوكس الرقمي) والتركيز على التعلم الحسي الملموس، وتأصيل المناهج العربية واليمنية في قوالب فنية راقية."
                : "An educational writer and researcher dedicated to reviving Arabic pedagogy through deep thinking practices. Al-Zulil’s philosophy advocates for reducing passive screen consumption (digital detox), refocusing on sensory and tangible learning, and presenting Arab and Yemeni curricula in beautiful, high-contrast, artistic structures."}
            </p>
          </div>
        </div>
      </div>

      {/* Philosophical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Principles */}
        <div className="paper-card p-6 bg-[#FAF8F5] border-l-4 border-l-amber-gold space-y-4">
          <div className="flex items-center gap-3">
            <Compass className="w-6 h-6 text-amber-gold" />
            <h3 className="text-xl font-serif font-bold">
              {isAr ? "المبادئ التوجيهية للتعليم الورقي الهادئ" : "Core Tenets of Peaceful Paper-Like Pedagogy"}
            </h3>
          </div>
          <ul className="space-y-3 text-sm text-charcoal/90 list-disc list-inside">
            {isAr ? (
              <>
                <li><strong>الحد من الشاشات:</strong> تشجيع المعلمين على استخدام الأنشطة اليدوية والرسومات والسبورة الواقعية.</li>
                <li><strong>التأطير البصري الواضح:</strong> استخدام الهوية البسيطة والأوراق والخطوط الجريئة لمساعدة الطلاب على حصر انتباههم.</li>
                <li><strong>التربية الأخلاقية:</strong> ربط الأهداف التعليمية بالقيم الإنسانية والوجدانية الأصيلة.</li>
                <li><strong>بيئة خالية من التشتت:</strong> تبني الديتوكس الرقمي داخل الغرفة الصفية كنهج مستدام.</li>
              </>
            ) : (
              <>
                <li><strong>Screen Limitation:</strong> Encouraging physical tasks, books, and real chalkboards.</li>
                <li><strong>Bold Frameworks:</strong> Utilizing clean layouts and strong borders to secure student focus.</li>
                <li><strong>Moral Grounding:</strong> Anchoring standard lesson objectives in human-centric empathy.</li>
                <li><strong>Distraction-Free Spaces:</strong> Practicing classroom-level digital detox as a baseline.</li>
              </>
            )}
          </ul>
        </div>

        {/* Quotes Carousels */}
        <div className="paper-card p-6 bg-white space-y-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-amber-gold" />
            <h3 className="text-xl font-serif font-bold">
              {isAr ? "من وحي فلسفة وضاح الزليل" : "Reflections from Waddah Al-Zulil"}
            </h3>
          </div>
          <div className="space-y-4">
            {quotes.map((quote, idx) => (
              <blockquote key={idx} className="border-r-4 border-autumn-yellow pr-4 text-xs italic text-charcoal/80 leading-relaxed font-serif">
                "{quote}"
              </blockquote>
            ))}
          </div>
        </div>
      </div>

      {/* Licensing details */}
      <div className="paper-card p-4 bg-charcoal text-ivory flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Landmark className="w-5 h-5 text-autumn-yellow" />
          <span className="text-xs font-mono">
            {isAr
              ? "وضاح للنشر الرقمي — جميع الحقوق محفوظة لعام 2026"
              : "Waddah Digital Publishing — All Rights Reserved © 2026"}
          </span>
        </div>
        <div className="text-xs font-serif text-autumn-yellow">
          {isAr
            ? "وضاح أحمد حسن الزليل — صنع بحب لتطوير المعلم اليمني والعربي"
            : "Waddah Ahmed Hassan Al-Zulil — Crafted for Yemeni & Arab Teachers"}
        </div>
      </div>
    </div>
  );
}
