import React, { useState, useEffect } from "react";
import { Language } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import {
  ShoppingBag,
  Search,
  Plus,
  Star,
  Download,
  FileText,
  Video,
  Presentation,
  CheckCircle2,
  DollarSign,
  Tag
} from "lucide-react";

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  authorName: string;
  type: "lesson_plan" | "worksheet" | "quiz" | "presentation";
  grade: string;
  subject: string;
  rating: number;
  downloadsCount: number;
  price: string;
  createdAt: string;
}

interface TeacherMarketplaceProps {
  lang: Language;
}

export default function TeacherMarketplace({ lang }: TeacherMarketplaceProps) {
  const isAr = lang === "ar";

  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Create Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"lesson_plan" | "worksheet" | "quiz" | "presentation">("worksheet");
  const [grade, setGrade] = useState("الصف التاسع الأساسي");
  const [subject, setSubject] = useState("اللغة العربية");
  const [price, setPrice] = useState("مجاني");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const data = await fetchWithRetry<ResourceItem[]>("/api/marketplace/resources");
      setResources(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await fetchWithRetry("/api/marketplace/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          type,
          grade,
          subject,
          price,
          authorName: "أستاذ اللغة العربية"
        })
      });

      alert(isAr ? "تم نشر المورد التعليمي بنجاح في متجر المعلمين!" : "Resource published successfully!");
      setShowModal(false);
      setTitle("");
      setDescription("");
      fetchResources();
    } catch (err: any) {
      alert(err.message || "حدث خطأ أثناء النشر.");
    } finally {
      setSaving(false);
    }
  };

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedCategory === "all" || res.type === selectedCategory;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12 font-sans dir-rtl">
      {/* Header Banner */}
      <div className="bg-[#1A365D] text-white p-6 rounded-2xl shadow-xl border border-[#C5A021]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold text-xl shadow">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white">
              {isAr ? "متجر المعلم العربي للموارد التعليمية" : "Teacher Resources Marketplace"}
            </h1>
            <p className="text-xs text-slate-300">
              {isAr
                ? "منصة تبادل ومشاركة أوراق العمل، الاختبارات، الخطط الدراسية، والعروض التفاعلية بين المعلمين."
                : "Share, exchange and trade worksheets, lesson plans and quizzes among teachers."}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#C5A021] hover:bg-amber-400 text-[#1A365D] font-mono font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? "إضافة مورد تعليمي جديد" : "Add Resource"}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? "البحث في متجر الموارد والملخصات..." : "Search resources..."}
            className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#C5A021]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto font-mono text-xs">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
              selectedCategory === "all" ? "bg-[#1A365D] text-[#C5A021]" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {isAr ? "الكل" : "All"}
          </button>
          <button
            onClick={() => setSelectedCategory("worksheet")}
            className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
              selectedCategory === "worksheet" ? "bg-[#1A365D] text-[#C5A021]" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {isAr ? "أوراق عمل" : "Worksheets"}
          </button>
          <button
            onClick={() => setSelectedCategory("presentation")}
            className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
              selectedCategory === "presentation" ? "bg-[#1A365D] text-[#C5A021]" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {isAr ? "عروض تقديمية" : "Presentations"}
          </button>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => (
          <div key={res.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#C5A021] transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-amber-100 text-[#1A365D] rounded-lg font-mono text-[10px] font-bold">
                  {res.type === "worksheet" ? "ورقة عمل" : res.type === "presentation" ? "عرض تقديمي" : "حقيبة تعليمية"}
                </span>

                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {res.price}
                </span>
              </div>

              <h3 className="font-serif font-bold text-sm text-[#1A365D] leading-snug">{res.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{res.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{res.rating}</span>
                <span className="text-slate-400 text-[10px]">({res.downloadsCount} تنزيل)</span>
              </div>

              <button
                onClick={() => alert(`تم تنزيل المورد: ${res.title}`)}
                className="px-3 py-1.5 bg-[#1A365D] hover:bg-[#122846] text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow"
              >
                <Download className="w-3.5 h-3.5 text-[#C5A021]" />
                <span>تنزيل</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1A365D] border-b pb-2">
              نشر مورد جديد في متجر المعلمين
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">عنوان المورد:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: ورقة عمل درس نواصب الفعل المضارع"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-[#C5A021]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">الوصف:</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف مختصر لمحتوى ورقة العمل والحلول الإرشادية..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-[#C5A021]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-700 block mb-1">النوع:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif outline-none"
                  >
                    <option value="worksheet">ورقة عمل</option>
                    <option value="presentation">عرض تقديمي</option>
                    <option value="lesson_plan">خطة درس</option>
                    <option value="quiz">اختبار قصيرة</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-700 block mb-1">السعر:</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="مجاني أو $5"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-mono font-bold"
              >
                إلغاء
              </button>

              <button
                onClick={handleCreateResource}
                disabled={saving || !title.trim()}
                className="px-5 py-2 bg-[#1A365D] hover:bg-[#122846] text-white rounded-xl text-xs font-mono font-bold cursor-pointer shadow"
              >
                {saving ? "جاري الحفظ..." : "نشر المورد"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
