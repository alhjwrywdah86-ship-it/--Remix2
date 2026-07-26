import React, { useState, useEffect } from "react";
import { Language } from "../types";
import { printContent } from "../utils/exportUtils";
import { getOfflineResources, deleteOfflineResource } from "../utils/offlineStorage";
import {
  BookmarkCheck,
  FileText,
  HelpCircle,
  FileCheck,
  Presentation,
  Trash2,
  Copy,
  Printer,
  Search,
  BookOpen,
  Calendar,
  CheckCircle,
  Sparkles,
  ExternalLink,
  WifiOff
} from "lucide-react";

interface SavedLibraryItem {
  id: string;
  type: "lesson_plan" | "quiz" | "worksheet" | "activity" | "presentation";
  title: string;
  grade: string;
  subject: string;
  savedAt: string;
  data: any;
  isOfflineOnly?: boolean;
}

interface TeacherLibraryProps {
  lang: Language;
  onNavigateToTool?: (tool: any) => void;
}

export default function TeacherLibrary({ lang, onNavigateToTool }: TeacherLibraryProps) {
  const isAr = lang === "ar";

  const [items, setItems] = useState<SavedLibraryItem[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<SavedLibraryItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchItems = async () => {
    let serverItems: SavedLibraryItem[] = [];
    try {
      if (navigator.onLine) {
        const res = await fetch("/api/teacher-library");
        if (res.ok) {
          serverItems = await res.json();
        }
      }
    } catch (err) {
      console.error("Failed to fetch teacher library items from server:", err);
    }

    // Combine with offline local storage items
    const offlineRes = getOfflineResources();
    const offlineAsLibraryItems: SavedLibraryItem[] = offlineRes.map(off => ({
      id: off.id,
      type: off.type as any,
      title: off.title,
      grade: off.grade || "عام",
      subject: off.subject || "المنهج العربي",
      savedAt: off.createdAt,
      data: off.content,
      isOfflineOnly: !off.synced
    }));

    // Deduplicate by title & type
    const map = new Map<string, SavedLibraryItem>();
    serverItems.forEach(item => map.set(`${item.title}_${item.type}`, item));
    offlineAsLibraryItems.forEach(item => {
      const key = `${item.title}_${item.type}`;
      if (!map.has(key)) {
        map.set(key, item);
      }
    });

    setItems(Array.from(map.values()));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDeleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(isAr ? "هل أنت تأكد من رغبتك في حذف هذا العنصر المحفوظ؟" : "Are you sure you want to delete this item?")) return;

    deleteOfflineResource(id);

    try {
      if (navigator.onLine) {
        await fetch(`/api/teacher-library/${id}`, { method: "DELETE" });
      }
    } catch (err) {
      console.error(err);
    }

    setItems(prev => prev.filter(item => item.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const handleCopyText = (item: SavedLibraryItem) => {
    let textToCopy = "";
    if (typeof item.data === "string") {
      textToCopy = item.data;
    } else {
      textToCopy = JSON.stringify(item.data, null, 2);
    }
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = items.filter(item => {
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesQuery = !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.grade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "lesson_plan": return "تحضير درس";
      case "quiz": return "اختبار ذكي";
      case "worksheet": return "ورقة عمل";
      case "activity": return "نشاط صفي";
      case "presentation": return "عرض تقديمي";
      default: return "مستند";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lesson_plan": return <FileText className="w-4 h-4 text-blue-600" />;
      case "quiz": return <HelpCircle className="w-4 h-4 text-emerald-600" />;
      case "worksheet": return <FileCheck className="w-4 h-4 text-purple-600" />;
      case "activity": return <Sparkles className="w-4 h-4 text-amber-600" />;
      case "presentation": return <Presentation className="w-4 h-4 text-rose-600" />;
      default: return <BookOpen className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#1A365D] to-[#2B4C7E] p-6 rounded-2xl text-white shadow-md border border-[#C5A021]/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] rounded-xl flex items-center justify-center text-[#1A365D] font-bold shadow-md">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold">مكتبتي الشخصية الحافظة للأصول</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              تصفح وأعد استخدام جميع تحاضيرك والاختبارات وأوراق العمل والعروض التقديمية المحفوظة في حسابك.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute top-3 right-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، المادة، أو الصف..."
              className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-[#C5A021]"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: "all", label: "الكل" },
              { id: "lesson_plan", label: "تحاضير الدروس" },
              { id: "quiz", label: "الاختبارات" },
              { id: "worksheet", label: "أوراق العمل" },
              { id: "activity", label: "الأنشطة الصفية" },
              { id: "presentation", label: "العروض التقديمية" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  filterType === tab.id
                    ? "bg-[#1A365D] text-[#C5A021] font-bold shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Saved Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-serif font-bold text-slate-700">لا توجد مستندات محفوظة في مكتبتك حالياً</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            قم بتوليد تحضير درس، أو اختبار، أو ورقة عمل، واضغط على زر "حفظ بمكتبتي الشخصية" لتظهر هنا وتتمكن من إعادة استخدامها وطباعتها بأي وقت.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-[#C5A021] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group relative"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-md text-[11px] font-mono font-semibold text-slate-700">
                    {getTypeIcon(item.type)}
                    <span>{getTypeLabel(item.type)}</span>
                  </span>

                  <button
                    onClick={(e) => handleDeleteItem(item.id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="text-sm font-serif font-bold text-[#1A365D] group-hover:text-[#C5A021] transition-colors line-clamp-2">
                  {item.title}
                </h4>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-500 pt-1">
                  <span>{item.subject}</span>
                  <span>•</span>
                  <span>{item.grade}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{item.savedAt ? new Date(item.savedAt).toLocaleDateString("ar-EG") : "اليوم"}</span>
                </div>

                <span className="text-[#1A365D] font-bold group-hover:translate-x-1 transition-transform">
                  استعراض المحتوى ←
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-[#1A365D] p-5 text-white flex items-center justify-between border-b border-[#C5A021]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold">
                  {getTypeIcon(selectedItem.type)}
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-serif font-bold">{selectedItem.title}</h2>
                  <p className="text-xs text-slate-300">
                    {getTypeLabel(selectedItem.type)} | {selectedItem.subject} | {selectedItem.grade}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyText(selectedItem)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === selectedItem.id ? "تم النسخ" : "نسخ"}</span>
                </button>

                <button
                  onClick={() => printContent("modal-library-print-content", selectedItem.title)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة</span>
                </button>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-lg text-xs font-mono cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto" id="modal-library-print-content">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 font-sans text-xs md:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {typeof selectedItem.data === "string" ? (
                  selectedItem.data
                ) : (
                  <pre className="font-mono text-xs overflow-x-auto p-4 bg-white rounded-lg border border-slate-200">
                    {JSON.stringify(selectedItem.data, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
