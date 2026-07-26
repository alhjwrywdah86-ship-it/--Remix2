import React, { useState, useEffect } from "react";
import { Language, SystemLog } from "../types";
import {
  ShieldAlert,
  Plus,
  Trash2,
  RefreshCw,
  Database,
  CheckCircle,
  FileText,
  Globe,
  Upload,
  BookOpen,
  Eye,
  Activity,
  AlertTriangle,
  Info,
  Users,
  CreditCard,
  Zap,
  Server,
  Lock,
  Terminal,
  BarChart2
} from "lucide-react";

interface AdminPanelProps {
  lang: Language;
}

interface DBBook {
  id: string;
  name: string;
  country: string;
  subject: string;
  grade: string;
  term: "الجزء الأول" | "الجزء الثاني" | "دليل المعلم";
  fileType: string;
  size: number;
  uploadedAt: string;
}

export default function AdminPanel({ lang }: AdminPanelProps) {
  const isAr = lang === "ar";
  const [activeTab, setActiveTab] = useState<"overview" | "subscriptions" | "logs" | "books">("overview");

  // List of books from backend
  const [books, setBooks] = useState<DBBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // System Logs & AI Telemetry
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Book detail preview modal
  const [previewBookId, setPreviewBookId] = useState<string | null>(null);
  const [previewBookText, setPreviewBookText] = useState<string>("");

  useEffect(() => {
    fetchBooks();
    fetchLogs();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/curriculum/books");
      if (!response.ok) throw new Error("Failed to load curriculum books.");
      const data = await response.json();
      setBooks(data);
    } catch (err: any) {
      console.error(err);
      setError(isAr ? "فشل تحميل قائمة الكتب المنهجية." : "Failed to load curriculum books.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch("/api/admin/logs");
      if (res.ok) {
        const data = await res.json();
        if (data.logs) setLogs(data.logs);
      }
    } catch (e) {
      console.error("Failed to load server logs", e);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!window.confirm(isAr ? "هل أنت متأكد من حذف هذا الكتاب نهائياً من قاعدة البيانات المنهجية؟" : "Are you sure you want to delete this book?")) return;
    setActionLoading(bookId);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch(`/api/curriculum/books/${bookId}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete book.");
      
      setSuccessMessage(isAr ? "تم حذف الكتاب وإزالته بنجاح من الفهرسة." : "Book successfully removed.");
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to delete.");
    } finally {
      setActionLoading(null);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
      {/* Header Banner */}
      <div className="bg-[#1A365D] text-white p-6 rounded-2xl border-2 border-[#C5A021]/40 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold shadow-md">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                {isAr ? "لوحة الإدارة التنفيذية" : "Executive Admin Dashboard"}
              </span>
              <span className="text-[10px] bg-emerald-500 text-white font-mono px-2 py-0.2 rounded-full">
                SaaS 5.0
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#C5A021] mt-0.5">
              {isAr ? "إدارة المنصة والاشتراكات والمناهج" : "SaaS Platform & Curriculum Management"}
            </h2>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex flex-wrap gap-2 bg-white/10 p-1.5 rounded-xl border border-white/20">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "overview" ? "bg-[#C5A021] text-[#1A365D]" : "text-white hover:text-amber-200"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{isAr ? "الإحصائيات العامة" : "Overview"}</span>
          </button>

          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "subscriptions" ? "bg-[#C5A021] text-[#1A365D]" : "text-white hover:text-amber-200"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{isAr ? "الاشتراكات والخطط" : "Subscriptions"}</span>
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "logs" ? "bg-[#C5A021] text-[#1A365D]" : "text-white hover:text-amber-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{isAr ? "سجلات النظام والذكاء" : "System Logs"}</span>
          </button>

          <button
            onClick={() => setActiveTab("books")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "books" ? "bg-[#C5A021] text-[#1A365D]" : "text-white hover:text-amber-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isAr ? "إدارة الكتب والمناهج" : "Curriculum Books"}</span>
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">{isAr ? "المعلمون والمدارس" : "Active Teachers & Schools"}</span>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-serif font-bold text-[#1A365D]">1,248</p>
              <p className="text-[10px] text-emerald-600 font-mono flex items-center gap-1">
                <span>↑ 18% {isAr ? "نمو هذا الشهر" : "growth this month"}</span>
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">{isAr ? "عمليات الذكاء الاصطناعي" : "AI Generations Today"}</span>
                <Zap className="w-5 h-5 text-[#C5A021]" />
              </div>
              <p className="text-2xl font-serif font-bold text-[#1A365D]">14,890</p>
              <p className="text-[10px] text-slate-400 font-mono">
                {isAr ? "متوسط الاستجابة: 1.2 ثانية" : "Avg speed: 1.2s"}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">{isAr ? "الاشتراكات النشطة" : "Active Subscriptions"}</span>
                <CreditCard className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-2xl font-serif font-bold text-[#1A365D]">842</p>
              <p className="text-[10px] text-emerald-600 font-mono">
                {isAr ? "82% خطة المعلم المحترف Pro" : "82% Pro Plan"}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">{isAr ? "الكتب والمراجع المنهجية" : "Curriculum Books"}</span>
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-serif font-bold text-[#1A365D]">{books.length}</p>
              <p className="text-[10px] text-slate-400 font-mono">
                {isAr ? "فهرسة موحدة كاملة" : "Indexed in memory"}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-[#1A365D] border-b border-slate-100 pb-2">
              {isAr ? "حالة الأمان ومفاتيح الذكاء الاصطناعي" : "System Security & API Key Status"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold">GEMINI_API_KEY</span>
                  <Lock className="w-4 h-4 text-emerald-700" />
                </div>
                <p className="text-[10px] text-emerald-700">{isAr ? "محمية بالسيرفر الخلفي (Server-side)" : "Hidden in server environment"}</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Caching Layer</span>
                  <Zap className="w-4 h-4 text-blue-700" />
                </div>
                <p className="text-[10px] text-blue-700">{isAr ? "مفعلة لحفظ استجابات الذكاء الاصطناعي" : "In-Memory Response Cache Active"}</p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Audit Logger</span>
                  <Terminal className="w-4 h-4 text-amber-700" />
                </div>
                <p className="text-[10px] text-amber-700">{isAr ? "تسجيل فوري للأخطاء والمحاولات" : "Live Audit Logs Recorded"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBSCRIPTIONS TAB */}
      {activeTab === "subscriptions" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#1A365D]">
                {isAr ? "إدارة خطط الاشتراكات والترخيص المؤسسي" : "SaaS Subscriptions & Institutional Licensing"}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {isAr ? "عرض الاشتراكات الحالية وتوليد الأكواد والقسائم للمعلمين والمدارس" : "Manage active plans & generate promotion codes"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">{isAr ? "الخطة المجانية" : "Free Explorer"}</span>
              <p className="text-2xl font-serif font-bold text-[#1A365D]">$0 <span className="text-xs text-slate-400 font-mono">/mo</span></p>
              <p className="text-xs text-slate-600 font-serif">{isAr ? "15 عملية ذكاء اصطناعي شهرياً + فصلين دراسيين" : "15 AI generations/month"}</p>
              <div className="pt-2 text-[11px] font-mono text-slate-500">
                {isAr ? "عدد المعلمين المشتركين: 406" : "Subscribers: 406"}
              </div>
            </div>

            <div className="p-5 border-2 border-[#C5A021] rounded-2xl bg-amber-50/50 space-y-3 relative">
              <span className="bg-[#C5A021] text-[#1A365D] text-[9px] font-mono font-bold px-2 py-0.5 rounded absolute top-4 left-4">
                POPULAR
              </span>
              <span className="text-xs font-mono font-bold text-[#C5A021] uppercase">{isAr ? "خطة المعلم المحترف Pro" : "Pro Teacher Plan"}</span>
              <p className="text-2xl font-serif font-bold text-[#1A365D]">$9.99 <span className="text-xs text-slate-400 font-mono">/mo</span></p>
              <p className="text-xs text-slate-600 font-serif">{isAr ? "توليد غير محدود + PPTX + تصحيح إلكتروني كامل" : "Unlimited AI + full exports"}</p>
              <div className="pt-2 text-[11px] font-mono text-[#1A365D] font-bold">
                {isAr ? "عدد المعلمين المشتركين: 780" : "Subscribers: 780"}
              </div>
            </div>

            <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">{isAr ? "خطة المدارس والمؤسسات" : "School Enterprise"}</span>
              <p className="text-2xl font-serif font-bold text-[#1A365D]">$49.99 <span className="text-xs text-slate-400 font-mono">/mo</span></p>
              <p className="text-xs text-slate-600 font-serif">{isAr ? "حسابات متعددة للمعلمين والمدراء والنسخ الاحتياطي" : "Multi-teacher accounts"}</p>
              <div className="pt-2 text-[11px] font-mono text-slate-500">
                {isAr ? "عدد المدارس المنضمة: 62" : "Schools: 62"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOGS TAB */}
      {activeTab === "logs" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#C5A021]" />
              <h3 className="font-serif font-bold text-base text-[#1A365D]">
                {isAr ? "سجلات مراقبة الأخطاء والأمان (System Audit & Error Logs)" : "Live Audit Logs"}
              </h3>
            </div>
            <button
              onClick={fetchLogs}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#1A365D] text-xs font-mono font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${logsLoading ? "animate-spin" : ""}`} />
              <span>{isAr ? "تحديث السجل" : "Refresh"}</span>
            </button>
          </div>

          <div className="bg-[#1E1E1E] text-emerald-400 p-4 rounded-xl font-mono text-xs max-h-96 overflow-y-auto space-y-2 border border-slate-800 dir-ltr">
            {logs.length === 0 ? (
              <p className="text-slate-500 text-center italic">No system logs recorded yet.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="border-b border-slate-800/80 pb-1.5 pt-0.5 space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-bold ${
                      log.level === "error" ? "text-rose-400" : log.level === "warn" ? "text-amber-400" : log.level === "security" ? "text-purple-400" : "text-emerald-400"
                    }`}>
                      [{log.timestamp.split("T")[1]?.slice(0, 8)}] [{log.level.toUpperCase()}] [{log.category.toUpperCase()}]
                    </span>
                    <span className="text-slate-500 text-[10px]">{log.ipAddress}</span>
                  </div>
                  <p className="text-slate-200">{log.message}</p>
                  {log.details && <p className="text-[#C5A021] text-[10px] opacity-80">{log.details}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* BOOKS TAB */}
      {activeTab === "books" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C5A021]" />
                <h3 className="font-serif font-bold text-base text-[#1A365D]">
                  {isAr ? "مكتبة المنهج والدليل المربوطة حالياً" : "Active Curriculum Schoolbooks & Guides"}
                </h3>
              </div>
              <span className="font-mono text-xs text-slate-500">
                {isAr ? `إجمالي الموارد: ${books.length} ملفاً` : `Total: ${books.length} books`}
              </span>
            </div>

            {loading ? (
              <div className="text-center py-8 text-xs text-slate-500 animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#C5A021] mb-2" />
                {isAr ? "جاري تحميل قائمة الكتب والمناهج..." : "Loading curriculum resources..."}
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <AlertTriangle className="w-12 h-12 text-amber-500/50 mx-auto mb-2" />
                <p className="text-sm font-serif font-bold text-[#1A365D]">{isAr ? "المكتبة فارغة حالياً!" : "Library is currently empty!"}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200 bg-slate-50 font-mono font-bold text-[#1A365D]">
                      <th className="p-3 text-start">{isAr ? "اسم الكتاب / المرجع المنهجي" : "Resource name"}</th>
                      <th className="p-3 text-start">{isAr ? "الدولة" : "Country"}</th>
                      <th className="p-3 text-start">{isAr ? "الصف الدراسي" : "Grade"}</th>
                      <th className="p-3 text-start">{isAr ? "الجزء / المرجعية" : "Type"}</th>
                      <th className="p-3 text-start">{isAr ? "الحجم" : "Size"}</th>
                      <th className="p-3 text-start">{isAr ? "إجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {books.map((book) => (
                      <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-serif font-bold text-[#1A365D]">
                          📖 {book.name}
                        </td>
                        <td className="p-3 text-slate-600">{book.country}</td>
                        <td className="p-3 text-slate-600">{book.grade}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            book.term === "دليل المعلم"
                              ? "bg-red-50 text-red-900 border border-red-200"
                              : "bg-blue-50 text-blue-900 border border-blue-200"
                          }`}>
                            {book.term}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-500">{formatSize(book.size)}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDeleteBook(book.id)}
                              disabled={actionLoading !== null}
                              className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-700 rounded transition-all cursor-pointer border border-slate-200"
                              title={isAr ? "إزالة من النظام" : "Delete resource"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
