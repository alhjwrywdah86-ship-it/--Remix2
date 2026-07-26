import React, { useState } from "react";
import { Language } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import { Search, Sparkles, BookOpen, FileText, ArrowLeft, Layers } from "lucide-react";

interface SearchResult {
  title: string;
  type: string;
  snippet: string;
  targetTab: string;
}

interface GlobalSmartSearchProps {
  lang: Language;
  onNavigateTab: (tab: any) => void;
}

export default function GlobalSmartSearch({ lang, onNavigateTab }: GlobalSmartSearchProps) {
  const isAr = lang === "ar";

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    try {
      const data = await fetchWithRetry<{ results: SearchResult[] }>("/api/search/global", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      setResults(data?.results || []);
      setSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans dir-rtl max-w-4xl mx-auto">
      {/* Header Search Box */}
      <div className="bg-gradient-to-r from-[#1A365D] to-[#122846] text-white p-8 rounded-3xl shadow-xl border border-[#C5A021]/30 text-center space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A021]/20 text-[#C5A021] rounded-full text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>محرك البحث الشامل بالذكاء الاصطناعي</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">
            ابحث في كافة المناهج، التحاضير، الموارد والأنشطة
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mx-auto">
            يدعم البحث باللغة الطبيعية والمعنى الشامل للوصول الفوري لكل محتويات التطبيق.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-lg">
          <Search className="w-5 h-5 text-slate-400 ms-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="مثال: تحضير درس نواصب الفعل المضارع أو اختبار الصف التاسع..."
            className="flex-1 bg-transparent text-slate-800 text-xs font-sans outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={searching || !query.trim()}
            className="px-5 py-2.5 bg-[#C5A021] hover:bg-amber-400 text-[#1A365D] font-mono font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow transition-all"
          >
            {searching ? (
              <span>جاري البحث...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>بحث ذكي</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {searched && (
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-base text-[#1A365D] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#C5A021]" />
            <span>نتائج البحث للطلب "{query}":</span>
          </h3>

          <div className="space-y-3">
            {results.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onNavigateTab(item.targetTab || "planner")}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#C5A021] cursor-pointer transition-all flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-100 text-[#1A365D] font-mono text-[10px] font-bold rounded">
                      {item.type}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-[#1A365D]">{item.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">{item.snippet}</p>
                </div>

                <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#1A365D] bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <span>فتح القسم</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-[#C5A021]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
