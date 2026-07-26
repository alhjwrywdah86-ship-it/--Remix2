import React, { useState } from "react";
import { SmartSearchResult, SmartSearchResultItem, Language } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import {
  Search,
  X,
  BookOpen,
  HelpCircle,
  FileText,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  Filter
} from "lucide-react";

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSelectItem?: (item: SmartSearchResultItem) => void;
}

export default function SmartSearchModal({
  isOpen,
  onClose,
  lang,
  onSelectItem
}: SmartSearchModalProps) {
  if (!isOpen) return null;

  const isAr = lang === "ar";

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "book" | "question" | "quiz" | "lesson">("all");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SmartSearchResult | null>(null);

  const quickSearches = [
    "درس المفعول به والأفعال المتعدية",
    "اختبار اللغة العربية للصف التاسع",
    "تجارب الكيمياء والفيزياء الصف الأول الثانوي",
    "تفسير وسور القرآن الكريم المقرر",
    "أسئلة علل وإعراب المتون"
  ];

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    try {
      const data = await fetchWithRetry<SmartSearchResult>("/api/ai/smart-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, filterType: filter })
      });

      setResult(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "حدث خطأ أثناء إجراء البحث الذكي.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = result?.items?.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#1A365D] p-5 text-white flex items-center justify-between border-b border-[#C5A021]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold shadow-md">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white">
                البحث التعليمي الذكي بالمعنى والمضمون
              </h2>
              <p className="text-xs text-slate-300">
                البحث الفوري في المقررات، بنك الأسئلة، الاختبارات، والتحاضير السابقة بالذكاء الاصطناعي.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Search Box & Button */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="ابحث بالمعنى عن أي درس، مهارة، سؤال، أو كتاب... (مثال: درس عن المفعول به أو اختبارات الكيمياء)"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-[#C5A021] focus:bg-white transition-all shadow-inner"
            />

            <button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              className="absolute left-2 top-2 bottom-2 px-4 bg-[#1A365D] hover:bg-[#122846] disabled:opacity-40 text-white font-mono font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow transition-all"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5A021]" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-[#C5A021]" />
              )}
              <span>بحث ذكي</span>
            </button>
          </div>

          {/* Quick Examples */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-500 block">عبارات بحث سريعة:</span>
            <div className="flex flex-wrap gap-2">
              {quickSearches.map((qs, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(qs);
                    handleSearch(qs);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-amber-50 hover:text-[#1A365D] hover:border-[#C5A021] text-slate-700 border border-slate-200 rounded-lg text-xs font-sans transition-all cursor-pointer"
                >
                  {qs}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Tags */}
          {result && (
            <div className="flex items-center gap-2 border-b pb-3 pt-2 text-xs font-mono">
              <span className="text-slate-500 font-bold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> تصفية النتائج:
              </span>
              {(["all", "book", "question", "quiz", "lesson"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    filter === type
                      ? "bg-[#1A365D] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {type === "all" && "الكل"}
                  {type === "book" && "الكتب والمنهج"}
                  {type === "question" && "بنك الأسئلة"}
                  {type === "quiz" && "الاختبارات"}
                  {type === "lesson" && "التحاضير والدروس"}
                </button>
              ))}
            </div>
          )}

          {/* AI Synthesis Summary */}
          {result && (
            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-1.5 font-sans">
              <div className="flex items-center gap-1.5 text-[#1A365D] font-bold text-xs font-serif">
                <Sparkles className="w-4 h-4 text-[#C5A021]" />
                <span>التلخيص والرؤية التعليمية الذكية للبحث:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{result.aiSummary}</p>
            </div>
          )}

          {/* Search Results List */}
          {filteredItems && filteredItems.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-600">
                نتائج البحث المطابقة ({filteredItems.length}):
              </h3>

              <div className="space-y-2.5">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem && onSelectItem(item)}
                    className="p-4 bg-slate-50 hover:bg-white hover:border-[#C5A021] border border-slate-200 rounded-xl transition-all cursor-pointer shadow-sm group space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.type === "book" && <BookOpen className="w-4 h-4 text-amber-600" />}
                        {item.type === "question" && <HelpCircle className="w-4 h-4 text-emerald-600" />}
                        {item.type === "quiz" && <FileText className="w-4 h-4 text-purple-600" />}
                        {item.type === "lesson" && <Sparkles className="w-4 h-4 text-[#C5A021]" />}

                        <span className="font-serif font-bold text-sm text-[#1A365D] group-hover:text-[#C5A021] transition-colors">
                          {item.title}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                        {item.subtitle}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-sans">
                      {item.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && filteredItems && filteredItems.length === 0 && (
            <div className="text-center py-8 text-slate-500 font-sans text-xs">
              لا توجد نتائج مطابقة لهذه التصفية في الوقت الحالي. جرب البحث عن كلمات عامة كالمادة أو المهارة.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
