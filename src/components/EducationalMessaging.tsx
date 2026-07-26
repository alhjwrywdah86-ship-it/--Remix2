import React, { useState, useEffect } from "react";
import { EducationalMessage, Language, UserRole } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import {
  MessageSquare,
  Send,
  Bell,
  Megaphone,
  Mail,
  ShieldCheck,
  Plus,
  CheckCircle2,
  Clock,
  Filter
} from "lucide-react";

interface EducationalMessagingProps {
  lang: Language;
  currentUserId?: string;
  currentUserName?: string;
  currentUserRole?: UserRole;
}

export default function EducationalMessaging({
  lang,
  currentUserId = "teacher_1",
  currentUserName = "أستاذ اللغة العربية",
  currentUserRole = "teacher"
}: EducationalMessagingProps) {
  const isAr = lang === "ar";

  const [messages, setMessages] = useState<EducationalMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // New Message Modal
  const [showSendModal, setShowSendModal] = useState(false);
  const [recipient, setRecipient] = useState("all_students");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<"notice" | "message" | "alert">("notice");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await fetchWithRetry<EducationalMessage[]>("/api/messages");
      setMessages(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!subject.trim() || !body.trim()) return;

    setSending(true);
    try {
      await fetchWithRetry("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUserId,
          senderName: currentUserName,
          senderRole: currentUserRole,
          recipientId: recipient,
          recipientName:
            recipient === "all_students"
              ? "جميع الطلاب"
              : recipient === "all_parents"
              ? "جميع أولياء الأمور"
              : "الصف التاسع الأساسي",
          subject,
          body,
          category
        })
      });

      alert("تم إرسال الإعلان/الرسالة بنجاح!");
      setShowSendModal(false);
      setSubject("");
      setBody("");
      fetchMessages();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "حدث خطأ أثناء إرسال الرسالة.");
    } finally {
      setSending(false);
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filterCategory === "all") return true;
    return m.category === filterCategory;
  });

  return (
    <div className="space-y-6 pb-12 font-sans dir-rtl">
      {/* Header Banner */}
      <div className="bg-[#1A365D] text-white p-6 rounded-2xl shadow-xl border border-[#C5A021]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold text-xl shadow">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white">مركز التواصل والإعلانات التعليمية</h1>
            <p className="text-xs text-slate-300">
              قناة تواصل آمنة ومنظمة بين المعلمين والطلاب وأولياء الأمور للتعميمات والملاحظات التربوية.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSendModal(true)}
          className="px-4 py-2.5 bg-[#C5A021] hover:bg-amber-400 text-[#1A365D] font-mono font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إرسال إعلان أو رسالة جديدة</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#C5A021]" />
          <span className="text-xs font-mono font-bold text-slate-700">تصفية الرسائل:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
              filterCategory === "all" ? "bg-[#1A365D] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            الكل ({messages.length})
          </button>
          <button
            onClick={() => setFilterCategory("notice")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
              filterCategory === "notice" ? "bg-[#1A365D] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            إعلانات وتعميمات
          </button>
          <button
            onClick={() => setFilterCategory("alert")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
              filterCategory === "alert" ? "bg-[#1A365D] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            تنبيهات هامة
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-[#C5A021] transition-all"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-[#1A365D]">{msg.senderName}</span>
                <span className="px-2 py-0.5 bg-amber-100 text-[#1A365D] font-mono text-[10px] font-bold rounded">
                  المرسل إليه: {msg.recipientName}
                </span>
              </div>

              <span className="text-[10px] font-mono text-slate-500">{msg.sentAt}</span>
            </div>

            <h3 className="font-serif font-bold text-base text-[#1A365D] pt-1">{msg.subject}</h3>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">{msg.body}</p>
          </div>
        ))}
      </div>

      {/* NEW MESSAGE MODAL */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="font-serif font-bold text-lg text-[#1A365D] border-b pb-2">
              إرسال إعلان أو رسالة جديدة
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">الجهة المستقبلة:</label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif outline-none focus:border-[#C5A021]"
                >
                  <option value="all_students">جميع الطلاب المسجلين</option>
                  <option value="all_parents">جميع أولياء الأمور</option>
                  <option value="class_1">طلاب الصف التاسع (أ)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">نوع الرسالة:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif outline-none focus:border-[#C5A021]"
                >
                  <option value="notice">إعلان وتعميم مدرسي</option>
                  <option value="alert">تنبيه واختبار عاجل</option>
                  <option value="message">رسالة إفادة تعليمية</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">موضوع الرسالة:</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="مثال: موعد الاختبار الشهري الأول والتحضير له"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-[#C5A021]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">نص الإعلان والرسالة:</label>
                <textarea
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="اكتب تفاصيل الرسالة بأسلوب تربوي واضح..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-[#C5A021]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSendModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-mono font-bold"
              >
                إلغاء
              </button>

              <button
                onClick={handleSendMessage}
                disabled={sending || !subject.trim()}
                className="px-5 py-2 bg-[#1A365D] hover:bg-[#122846] text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow"
              >
                <Send className="w-3.5 h-3.5 text-[#C5A021]" />
                <span>{sending ? "جاري الإرسال..." : "إرسال الرسالة الآن"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
