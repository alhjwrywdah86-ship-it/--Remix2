import React, { useState, useEffect } from "react";
import { Language } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Share2,
  Plus,
  ShieldAlert,
  Sparkles,
  Search,
  MessageCircle
} from "lucide-react";

interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  title: string;
  content: string;
  likes: number;
  commentsCount: number;
  createdAt: string;
  category: string;
}

interface TeachersCommunityProps {
  lang: Language;
}

export default function TeachersCommunity({ lang }: TeachersCommunityProps) {
  const isAr = lang === "ar";

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  // New Post Modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("استراتيجيات التدريس");
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await fetchWithRetry<CommunityPost[]>("/api/community/posts");
      setPosts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!title.trim() || !content.trim()) return;

    setPublishing(true);
    try {
      await fetchWithRetry("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          category,
          authorName: "أستاذ اللغة العربية",
          authorRole: "معلم متميز وموجه تربوي"
        })
      });

      alert(isAr ? "تم نشر موضوع جديد في مجتمع المعلمين!" : "Post created successfully!");
      setShowModal(false);
      setTitle("");
      setContent("");
      fetchPosts();
    } catch (err: any) {
      alert(err.message || "حدث خطأ أثناء النشر.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans dir-rtl">
      {/* Header Banner */}
      <div className="bg-[#1A365D] text-white p-6 rounded-2xl shadow-xl border border-[#C5A021]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold text-xl shadow">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white">
              {isAr ? "مجتمع المعلمين والمربين العرب" : "Teachers & Educators Community"}
            </h1>
            <p className="text-xs text-slate-300">
              {isAr
                ? "مساحة الحوار والتبادل التربوي لمناقشة استراتيجيات التدريس، حلول التحديات الصفية، ونشر التجارب المبتكرة."
                : "Space for pedagogical discussion, teaching strategies and classroom challenges."}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#C5A021] hover:bg-amber-400 text-[#1A365D] font-mono font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? "طرح موضوع أو استفسار جديد" : "New Discussion"}</span>
        </button>
      </div>

      {/* Feed List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1A365D] text-[#C5A021] font-serif font-bold rounded-xl flex items-center justify-center text-sm shadow">
                  {post.authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1A365D]">{post.authorName}</h4>
                  <span className="text-[10px] text-slate-500 font-mono block">{post.authorRole} • {post.createdAt}</span>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-slate-100 text-[#1A365D] rounded-lg font-mono text-xs font-bold">
                {post.category}
              </span>
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-[#1A365D] mb-1">{post.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">{post.content}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 hover:text-[#1A365D] cursor-pointer">
                  <ThumbsUp className="w-3.5 h-3.5 text-amber-500" />
                  <span>إعجاب ({post.likes})</span>
                </button>

                <button className="flex items-center gap-1.5 hover:text-[#1A365D] cursor-pointer">
                  <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                  <span>مناقشة ({post.commentsCount})</span>
                </button>
              </div>

              <button
                onClick={() => alert("تم إرسال إبلاغ للمشرفين التربويين.")}
                className="text-[10px] text-slate-400 hover:text-red-500 flex items-center gap-1 cursor-pointer"
              >
                <ShieldAlert className="w-3 h-3" />
                <span>إبلاغ</span>
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
              طرح موضوع مناقشة جديدة في مجتمع المعلمين
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">الفئة التربوية:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif outline-none"
                >
                  <option value="استراتيجيات التدريس">استراتيجيات التدريس الحديثة</option>
                  <option value="الإدارة الصفية">الإدارة الصفية والتعامل مع الطلاب</option>
                  <option value="الذكاء الاصطناعي">تطبيقات الذكاء الاصطناعي بالتعليم</option>
                  <option value="تقويم واختبارات">تقويم الطلاب وتصميم الاختبارات</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">عنوان الموضوع:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: كيف تثير شغف الطلاب في تحليل النصوص البلاغية؟"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-[#C5A021]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">مضمون النقاش والتجربة:</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="اكتب تفاصيل الفكرة أو التجربة ليناقشها زملائك المعلمون..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-[#C5A021]"
                />
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
                onClick={handleCreatePost}
                disabled={publishing || !title.trim() || !content.trim()}
                className="px-5 py-2 bg-[#1A365D] hover:bg-[#122846] text-white rounded-xl text-xs font-mono font-bold cursor-pointer shadow"
              >
                {publishing ? "جاري النشر..." : "نشر في المجتمع"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
