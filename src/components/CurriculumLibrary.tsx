import React, { useState, useEffect } from "react";
import { Language } from "../types";
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  Sparkles,
  Layers,
  CheckCircle,
  HelpCircle,
  Activity,
  ArrowRight,
  Database,
  Globe,
  MessageSquare,
  Send,
  Eye,
  RefreshCw,
  Award,
  ChevronLeft,
  ChevronDown,
  Book,
  Download
} from "lucide-react";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import { getCanonicalBook } from "../data/canonicalCurricula";

interface CurriculumLibraryProps {
  lang: Language;
  onNavigateToTool?: (tool: "planner" | "qbank" | "worksheet" | "activity", initialData?: { grade?: string; subject?: string; lessonTitle?: string; unit?: string }) => void;
}

interface CurriculumBook {
  id: string;
  name: string;
  country: string;
  subject: string;
  grade: string;
  term: string;
  fileType: string;
  size: number;
  uploadedAt: string;
}

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  citations?: string[];
}

export default function CurriculumLibrary({ lang, onNavigateToTool }: CurriculumLibraryProps) {
  const isAr = lang === "ar";

  const [books, setBooks] = useState<CurriculumBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("الكل");
  const [selectedSubject, setSelectedSubject] = useState("الكل");
  const [selectedTerm, setSelectedTerm] = useState("الكل");

  // Selected Book for Detailed Reading & Unit Browsing
  const [activeBook, setActiveBook] = useState<CurriculumBook | null>(null);
  const [bookFullText, setBookFullText] = useState<string | null>(null);
  const [loadingBookText, setLoadingBookText] = useState(false);

  // RAG Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userChatInput, setUserChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/curriculum/books");
      if (!response.ok) throw new Error("فشل تحميل قائمة الكتب المنهجية.");
      const data = await response.json();
      setBooks(data);
    } catch (err: any) {
      console.error(err);
      setError(isAr ? "تعذر جلب الكتب المنهجية من قاعدة البيانات." : "Failed to load curriculum books.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBookDetails = async (book: CurriculumBook) => {
    setActiveBook(book);
    setLoadingBookText(true);
    setBookFullText(null);
    try {
      const response = await fetch("/api/curriculum/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          query: "اعرض لي نصوص هذا الكتاب والفصول كاملة بالتفصيل"
        })
      });
      const data = await response.json();
      setBookFullText(data.answer || "لا يتوفر نص كامل لهذا الكتاب حالياً.");
    } catch (err) {
      console.error(err);
      setBookFullText("تعذر تحميل التفاصيل الكاملة للكتاب.");
    } finally {
      setLoadingBookText(false);
    }
  };

  const handleSendRAGChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userChatInput.trim() || chatLoading) return;

    const queryText = userChatInput.trim();
    setUserChatInput("");

    setChatMessages(prev => [...prev, { sender: "user", text: queryText }]);
    setChatLoading(true);

    try {
      const response = await fetch("/api/curriculum/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: "اليمن",
          grade: selectedGrade !== "الكل" ? selectedGrade : activeBook?.grade,
          subject: selectedSubject !== "الكل" ? selectedSubject : activeBook?.subject,
          term: selectedTerm !== "الكل" ? selectedTerm : activeBook?.term,
          bookId: activeBook?.id || "all",
          query: queryText
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "فشل معالجة الاستعلام المنهجي.");

      setChatMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: data.answer,
          citations: data.citations
        }
      ]);
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        { sender: "ai", text: `[خطأ]: ${err.message || "حدث خطأ أثناء البحث في المنهج."}` }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Filtered books calculation
  const filteredBooks = books.filter(b => {
    const matchGrade = selectedGrade === "الكل" || b.grade.includes(selectedGrade) || selectedGrade.includes(b.grade);
    const matchSubject = selectedSubject === "الكل" || b.subject.includes(selectedSubject) || selectedSubject.includes(b.subject);
    const matchTerm = selectedTerm === "الكل" || b.term.includes(selectedTerm) || selectedTerm.includes(b.term);
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || b.name.toLowerCase().includes(q) || b.subject.toLowerCase().includes(q) || b.grade.toLowerCase().includes(q);

    return matchGrade && matchSubject && matchTerm && matchQuery;
  });

  const gradesList = ["الكل", "الصف السابع الأساسي", "الصف الثامن الأساسي", "الصف التاسع الأساسي", "الصف الأول الثانوي", "الصف الثاني الثانوي", "الصف الثالث الثانوي"];
  const subjectsList = ["الكل", "اللغة العربية", "القرآن الكريم والعلوم الإسلامية", "العلوم العامة", "الرياضيات", "الاجتماعيات والتربية الوطنية", "الحاسوب والبرمجة", "اللغة الإنجليزية"];
  const termsList = ["الكل", "الجزء الأول", "الجزء الثاني", "دليل المعلم"];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1A365D] via-[#2A4365] to-[#1A365D] rounded-2xl p-6 text-white shadow-lg border border-[#C5A021]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A021]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#C5A021]/20 border border-[#C5A021]/40 px-3 py-1 rounded-full text-xs text-[#C5A021] font-mono mb-2">
              <Database className="w-3.5 h-3.5" />
              <span>المكتبة المنهجية الجاهزة - محرك RAG المعتمد</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-white">
              قاعدة المناهج المدرسية والكتب المعتمدة
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              تصفح محتوى المناهج الرسمية والكتب الدراسية، وابحث داخل الدروس، مع إمكانية تحضير الدروس، وإنشاء الاختبارات وأوراق العمل المستندة مباشرة للنص المعتمد.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15">
            <BookOpen className="w-6 h-6 text-[#C5A021]" />
            <div className="text-start">
              <p className="text-[10px] text-slate-300 font-mono">عدد المناهج المسجلة</p>
              <p className="text-lg font-bold font-mono text-[#C5A021]">{books.length} كتاب/دليل</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم الدرس، العنوان، الكلمات المفتاحية، أو اسم المادة..."
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:border-[#C5A021] focus:ring-1 focus:ring-[#C5A021] outline-none transition-all"
            />
          </div>
          <button
            onClick={fetchBooks}
            disabled={loading}
            className="w-full md:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#1A365D] rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>تحديث المكتبة</span>
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="text-[11px] font-mono text-slate-500 mb-1 block">الصف الدراسي:</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-[#1A365D] outline-none focus:border-[#C5A021]"
            >
              {gradesList.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-500 mb-1 block">المادة الدراسية:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-[#1A365D] outline-none focus:border-[#C5A021]"
            >
              {subjectsList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-500 mb-1 block">الجزء / الترم:</label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-[#1A365D] outline-none focus:border-[#C5A021]"
            >
              {termsList.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Books List Section (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-serif font-bold text-[#1A365D] flex items-center gap-2">
              <Book className="w-4 h-4 text-[#C5A021]" />
              <span>الكتب المنهجية المتاحة ({filteredBooks.length})</span>
            </h2>
            {(selectedGrade !== "الكل" || selectedSubject !== "الكل" || selectedTerm !== "الكل" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedGrade("الكل");
                  setSelectedSubject("الكل");
                  setSelectedTerm("الكل");
                  setSearchQuery("");
                }}
                className="text-xs font-mono text-rose-600 hover:underline cursor-pointer"
              >
                إلغاء الفلاتر
              </button>
            )}
          </div>

          {loading ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-3">
              <RefreshCw className="w-6 h-6 text-[#C5A021] animate-spin mx-auto" />
              <p className="text-xs font-mono text-slate-500">جاري تحميل كتب المناهج المعتمدة من قاعدة البيانات...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-3">
              <Database className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">لم يتم العثور على كتب منهجية مطابقة للفلاتر الحالية.</p>
              <p className="text-xs text-slate-500">جرّب تغيير المادة أو الصف أو البحث باستخدام اسم الكتاب.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredBooks.map((book) => {
                const isActive = activeBook?.id === book.id;
                return (
                  <div
                    key={book.id}
                    className={`bg-white rounded-xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                      isActive
                        ? "border-[#C5A021] ring-2 ring-[#C5A021]/20 shadow-md bg-amber-50/20"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1A365D]/10 text-[#1A365D] font-bold">
                          {book.country}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-800 font-semibold">
                          {book.term}
                        </span>
                      </div>

                      <h3 className="text-sm font-serif font-bold text-[#1A365D] line-clamp-2">
                        {book.name}
                      </h3>

                      <div className="text-[11px] font-mono text-slate-600 space-y-1">
                        <p>📘 المادة: <span className="font-semibold">{book.subject}</span></p>
                        <p>🎓 الصف: <span className="font-semibold">{book.grade}</span></p>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                      <button
                        onClick={() => handleOpenBookDetails(book)}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#1A365D] text-white"
                            : "bg-slate-100 hover:bg-slate-200 text-[#1A365D]"
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isActive ? "الكتاب معروض حالياً" : "تصفح نصوص الكتاب"}</span>
                      </button>

                      {/* Tool Shortcuts for this Book */}
                      {onNavigateToTool && (
                        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono pt-1">
                          <button
                            onClick={() => onNavigateToTool("planner", { grade: book.grade, subject: book.subject })}
                            className="p-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60 rounded text-center cursor-pointer"
                          >
                            📝 تحضير درس
                          </button>
                          <button
                            onClick={() => onNavigateToTool("qbank", { grade: book.grade, subject: book.subject })}
                            className="p-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/60 rounded text-center cursor-pointer"
                          >
                            ❓ بنك الأسئلة
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Detailed Book Reader Drawer / Modal view if open */}
          {activeBook && (
            <div className="bg-white p-5 rounded-xl border border-[#C5A021] shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#C5A021]/15 flex items-center justify-center text-[#1A365D]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#1A365D]">{activeBook.name}</h3>
                    <p className="text-[10px] font-mono text-slate-500">
                      {activeBook.country} | {activeBook.subject} | {activeBook.grade} | {activeBook.term}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveBook(null)}
                  className="text-xs font-mono text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  إغلاق ✕
                </button>
              </div>

              {loadingBookText ? (
                <div className="py-6 text-center text-xs font-mono text-slate-500 space-y-2">
                  <RefreshCw className="w-5 h-5 text-[#C5A021] animate-spin mx-auto" />
                  <p>جاري استخراج وتحليل نصوص المنهج الرسمية لهذا الكتاب...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const canonical = getCanonicalBook(activeBook.id);
                    if (canonical) {
                      return (
                        <div className="space-y-3 bg-amber-50/40 p-4 rounded-xl border border-amber-200">
                          <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                            <div className="flex items-center gap-2">
                              <Layers className="w-4 h-4 text-[#C5A021]" />
                              <h4 className="font-serif font-bold text-sm text-[#1A365D]">
                                الهيكل المنهجي المعتمد (Canonical Curriculum Structure)
                              </h4>
                            </div>
                            <span className="px-2 py-0.5 bg-[#1A365D] text-white text-[11px] font-mono rounded-full">
                              {canonical.totalUnits} وحدة | {canonical.totalLessons} درساً
                            </span>
                          </div>

                          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                            {canonical.units.map((unit) => (
                              <details key={unit.unitNumber} className="group bg-white rounded-lg border border-slate-200 p-2.5 shadow-xs">
                                <summary className="flex items-center justify-between font-serif text-xs font-bold text-[#1A365D] cursor-pointer list-none select-none">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono flex items-center justify-center">
                                      {unit.unitNumber}
                                    </span>
                                    <span>{unit.unitTitle}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono group-open:rotate-180 transition-transform">
                                    ▼ ({unit.lessons.length} دروس)
                                  </span>
                                </summary>

                                <div className="mt-2 pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[11px]">
                                  {unit.lessons.map((les) => (
                                    <div key={les.lessonNumber} className="p-1.5 bg-slate-50 rounded border border-slate-100 flex items-center justify-between gap-1">
                                      <span className="text-slate-800 font-medium truncate">{les.lessonTitle}</span>
                                      {onNavigateToTool && (
                                        <button
                                          onClick={() => onNavigateToTool("planner", { grade: activeBook.grade, subject: activeBook.subject, lessonTitle: les.lessonTitle, unit: unit.unitTitle })}
                                          className="text-[9px] px-1.5 py-0.5 bg-[#1A365D] text-white rounded hover:bg-[#122846] cursor-pointer whitespace-nowrap"
                                          title="تحضير هذا الدرس"
                                        >
                                          تحضير
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </details>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans max-h-80 overflow-y-auto whitespace-pre-wrap">
                    {bookFullText}
                  </div>

                  {/* Actions Bar for the active book */}
                  {onNavigateToTool && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-serif font-semibold text-amber-900">
                        استخدم محتوى هذا الكتاب في الأدوات التعليمية الذكية:
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onNavigateToTool("planner", { grade: activeBook.grade, subject: activeBook.subject })}
                          className="px-3 py-1.5 bg-[#1A365D] text-white rounded text-xs font-mono hover:bg-[#122846] cursor-pointer"
                        >
                          📝 تحضير درس
                        </button>
                        <button
                          onClick={() => onNavigateToTool("worksheet", { grade: activeBook.grade, subject: activeBook.subject })}
                          className="px-3 py-1.5 bg-emerald-700 text-white rounded text-xs font-mono hover:bg-emerald-800 cursor-pointer"
                        >
                          📄 ورقة عمل
                        </button>
                        <button
                          onClick={() => onNavigateToTool("activity", { grade: activeBook.grade, subject: activeBook.subject })}
                          className="px-3 py-1.5 bg-amber-600 text-white rounded text-xs font-mono hover:bg-amber-700 cursor-pointer"
                        >
                          🎨 نشاط صفي
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar RAG Search & Chat Assistant (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col h-[580px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A021]" />
                <h3 className="text-xs font-serif font-bold text-[#1A365D]">مساعد التنقيب المنهجي (RAG Chat)</h3>
              </div>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                مرتبط بالمنهج
              </span>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs my-2 bg-slate-50 rounded-lg border border-slate-100">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12 space-y-2 text-slate-400">
                  <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="font-mono text-[11px]">طرح أي سؤال يتعلق بالمنهج وسيجيب النظام بمرجعية نصية دقيقة.</p>
                  <div className="text-[10px] space-y-1 text-slate-500 pt-2 text-start">
                    <p className="font-bold">أمثلة تجريبية:</p>
                    <p className="hover:text-[#1A365D] cursor-pointer" onClick={() => setUserChatInput("ما هو الدرس الأول في مادة اللغة العربية للصف التاسع وما هي أهدافه ومفرداته؟")}>• ما هو الدرس الأول في مادة اللغة العربية للصف التاسع؟</p>
                    <p className="hover:text-[#1A365D] cursor-pointer" onClick={() => setUserChatInput("استخرج أهداف وأنشطة درس البن اليمني الصف الثامن")}>• استخرج أهداف وأنشطة درس البن اليمني الصف الثامن</p>
                  </div>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#1A365D] text-white ms-6"
                        : "bg-white text-slate-800 border border-slate-200 me-2"
                    }`}
                  >
                    <p className="font-sans whitespace-pre-wrap">{msg.text}</p>
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200/80 text-[10px] font-mono text-amber-800 bg-amber-50 p-2 rounded">
                        <p className="font-bold mb-0.5">📌 المرجعية والتوثيق المعتمد:</p>
                        {msg.citations.map((c, ci) => (
                          <p key={ci}>• {c}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-slate-500 font-mono text-[11px] flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-[#C5A021] animate-spin" />
                  <span>جاري البحث في قاعدة المناهج المعتمدة واستخراج المراجع...</span>
                </div>
              )}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSendRAGChat} className="pt-2 flex gap-2">
              <input
                type="text"
                value={userChatInput}
                onChange={(e) => setUserChatInput(e.target.value)}
                placeholder="اسأل عن درس، سورة، أو هدف..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:bg-white focus:border-[#C5A021]"
              />
              <button
                type="submit"
                disabled={chatLoading || !userChatInput.trim()}
                className="px-3 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-[#122846] disabled:opacity-50 cursor-pointer flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
