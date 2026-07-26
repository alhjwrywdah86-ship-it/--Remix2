import React, { useState } from "react";
import { UserRole } from "../types";
import {
  Sparkles,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  Send,
  HelpCircle,
  FileText
} from "lucide-react";

interface AIRecommendationsViewProps {
  isAr: boolean;
  userRole: UserRole;
}

export default function AIRecommendationsView({ isAr, userRole }: AIRecommendationsViewProps) {
  const [selectedSubject, setSelectedSubject] = useState("اللغة العربية");
  const [selectedGrade, setSelectedGrade] = useState("الصف التاسع الأساسي");
  const [customQuery, setCustomQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);

  const handleFetchRecommendations = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    fetch("/api/gemini/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: userRole,
        contextData: customQuery || `المادة: ${selectedSubject} - الصف: ${selectedGrade}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1A365D] to-[#2B4C7E] text-white p-6 rounded-2xl border-b-4 border-[#C5A021] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold shadow-md">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-[#C5A021]">
              {isAr ? "مركز التوصيات والخطط الذكية" : "AI Recommendations Center"}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {isAr
                ? "توليد اقتراحات بيداغوجية مخصصة، إستراتيجيات علاجية، وإرشادات للمراجعة والاستيعاب"
                : "Generate tailored pedagogical suggestions, remedial plans, and review guidelines"}
            </p>
          </div>
        </div>
      </div>

      {/* Input Generator Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-[#1A365D] font-serif flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#C5A021]" />
          <span>{isAr ? "حدد معايير الخطة المطلوب صياغتها:" : "Specify Parameters:"}</span>
        </h3>

        <form onSubmit={handleFetchRecommendations} className="space-y-4 text-xs font-serif">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "المادة الدراسية:" : "Subject:"}</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-50 border p-2.5 rounded-xl text-[#1A365D]"
              >
                <option value="اللغة العربية">اللغة العربية</option>
                <option value="القرآن الكريم وعلومه">القرآن الكريم وعلومه</option>
                <option value="التربية الإسلامية">التربية الإسلامية</option>
                <option value="الاجتماعيات والعلوم">الاجتماعيات والعلوم</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "الصف الدراسي:" : "Grade:"}</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full bg-slate-50 border p-2.5 rounded-xl text-[#1A365D]"
              >
                <option value="الصف السابع الأساسي">الصف السابع الأساسي</option>
                <option value="الصف الثامن الأساسي">الصف الثامن الأساسي</option>
                <option value="الصف التاسع الأساسي">الصف التاسع الأساسي</option>
                <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "وصف حالة الطلاب أو نقاط الضعف المستهدفة (اختياري):" : "Case Description:"}</label>
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="مثال: الطلاب يستصعبون استخراج النعت والبدل ويسهون في تطبيق القواعد"
              className="w-full bg-slate-50 border p-2.5 rounded-xl text-[#1A365D]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#1A365D] hover:bg-[#122846] text-[#C5A021] font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#C5A021]" />
              <span>{loading ? (isAr ? "جاري التوليد..." : "Generating...") : (isAr ? "صياغة التوصيات بالذكاء الاصطناعي" : "Generate Recommendations")}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {recommendations && (
        <div className="bg-white p-6 rounded-2xl border-2 border-[#C5A021] shadow-lg space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 border-b pb-3 text-[#1A365D]">
            <Sparkles className="w-6 h-6 text-[#C5A021]" />
            <h3 className="font-bold text-lg font-serif">{recommendations.title}</h3>
          </div>

          <div className="space-y-4 text-xs font-serif leading-relaxed">
            <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {recommendations.summary}
            </p>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
              <h4 className="font-bold text-[#1A365D] flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>{isAr ? "المنهجية والتطبيقات المقترحة:" : "Methodology:"}</span>
              </h4>
              <p className="text-slate-700">{recommendations.remedialStrategy}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#1A365D]">{isAr ? "خطوات العمل الموصى بها:" : "Action Steps:"}</h4>
              <ul className="space-y-2">
                {recommendations.actionItems?.map((act: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
