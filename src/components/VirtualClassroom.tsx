import React, { useState, useEffect } from "react";
import { VirtualClassroomPost, Language, UserRole } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import {
  BookOpen,
  MessageSquare,
  Plus,
  Send,
  Share2,
  FileText,
  ThumbsUp,
  Sparkles,
  Paperclip,
  CheckCircle2
} from "lucide-react";

interface VirtualClassroomProps {
  lang: Language;
  currentUserName?: string;
  currentUserRole?: UserRole;
}

export default function VirtualClassroom({
  lang,
  currentUserName = "أستاذ اللغة العربية",
  currentUserRole = "teacher"
}: VirtualClassroomProps) {
  const isAr = lang === "ar";

  const [posts, setPosts] = useState<VirtualClassroomPost[]>([]);
  const [loading, setLoading] = useState(true);

  // New Post Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState<"announcement" | "lesson_material" | "discussion">("announcement");
  const [creating, setCreating] = useState(false);

  // Comment input state
  const [commentTextMap, setCommentTextMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await fetchWithRetry<VirtualClassroomPost[]>("/api/virtual-classroom/posts?classroomId=class_1");
      setPosts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!postTitle.trim() || !postContent.trim()) return;

    setCreating(true);
    try {
      await fetchWithRetry("/api/virtual-classroom/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classroomId: "class_1",
          authorName: currentUserName,
          authorRole: currentUserRole,
          title: postTitle,
          content: postContent,
          postType
        })
      });

      alert("تم نشر منشور جديد في الفصل الافتراضي!");
      setShowCreateModal(false);
      setPostTitle("");
      setPostContent("");
      fetchPosts();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "حدث خطأ أثناء النشر.");
    } finally {
      setCreating(false);
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentTextMap[postId];
    if (!text || !text.trim()) return;

    try {
      await fetchWithRetry(`/api/virtual-classroom/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName: currentUserName, text })
      });

      setCommentTextMap((prev) => ({ ...prev, [postId]: "" }));
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans dir-rtl">
      {/* Header Banner */}
      <div className="bg-[#1A365D] text-white p-6 rounded-2xl shadow-xl border border-[#C5A021]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold text-xl shadow">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white">الفصل الافتراضي والمناقشات الصفية</h1>
            <p className="text-xs text-slate-300">
              مساحة تفاعلية لنشر المواد الدراسية، إدارة النقاشات التفاعلية، ومشاركة ملفات الشرح.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-[#C5A021] hover:bg-amber-400 text-[#1A365D] font-mono font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منشور أو درس جديد</span>
        </button>
      </div>

      {/* Posts Stream */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#1A365D] text-[#C5A021] rounded-xl font-bold flex items-center justify-center text-sm font-serif">
                  {post.authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1A365D]">{post.authorName}</h4>
                  <span className="text-[10px] font-mono text-slate-500">{post.createdAt}</span>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-amber-100 text-[#1A365D] rounded-lg font-mono text-xs font-bold">
                {post.postType === "announcement"
                  ? "إعلان صفّي"
                  : post.postType === "lesson_material"
                  ? "مادة دراسية"
                  : "مناقشة تفاعلية"}
              </span>
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-[#1A365D]">{post.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-sans mt-1">{post.content}</p>
            </div>

            {/* Comments List */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <span className="text-xs font-mono font-bold text-slate-600 block">
                التعليقات والمناقشات ({post.comments?.length || 0}):
              </span>

              {post.comments?.map((c) => (
                <div key={c.id} className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-[#1A365D]">
                    <span>{c.authorName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{c.createdAt}</span>
                  </div>
                  <p className="text-slate-700 font-sans">{c.text}</p>
                </div>
              ))}

              {/* Add Comment Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={commentTextMap[post.id] || ""}
                  onChange={(e) =>
                    setCommentTextMap((prev) => ({ ...prev, [post.id]: e.target.value }))
                  }
                  placeholder="اكتب تعليقاً أو استفساراً حول المنشور..."
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-[#C5A021]"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="px-3 py-2 bg-[#1A365D] hover:bg-[#122846] text-white font-mono font-bold rounded-xl text-xs cursor-pointer shadow"
                >
                  تعليق
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE POST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="font-serif font-bold text-lg text-[#1A365D] border-b pb-2">
              إضافة منشور في الفصل الافتراضي
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">نوع المنشور:</label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif outline-none focus:border-[#C5A021]"
                >
                  <option value="announcement">إعلان وتنبيه صفّي</option>
                  <option value="lesson_material">مادة ومذكّرة دراسية</option>
                  <option value="discussion">موضوع مناقشة واستفسار</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">عنوان المنشور:</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="مثال: تلخيص درس الفاعل ونواصب المضارع"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-[#C5A021]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">محتوى المنشور:</label>
                <textarea
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="اكتب التلخيص أو موضوع المناقشة بوضوح..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-[#C5A021]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-mono font-bold"
              >
                إلغاء
              </button>

              <button
                onClick={handleCreatePost}
                disabled={creating || !postTitle.trim()}
                className="px-5 py-2 bg-[#1A365D] hover:bg-[#122846] text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow"
              >
                <Plus className="w-4 h-4 text-[#C5A021]" />
                <span>{creating ? "جاري النشر..." : "نشر في الفصل الافتراضي"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
