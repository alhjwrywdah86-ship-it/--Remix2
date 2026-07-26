import React, { useState, useEffect } from "react";
import { Language } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import {
  Award,
  CheckCircle2,
  Download,
  Share2,
  Plus,
  ShieldCheck,
  QrCode,
  FileText
} from "lucide-react";

interface Certificate {
  id: string;
  code: string;
  recipientName: string;
  recipientRole: string;
  title: string;
  issuer: string;
  issueDate: string;
  verifiableUrl: string;
}

interface DigitalCertificatesProps {
  lang: Language;
}

export default function DigitalCertificates({ lang }: DigitalCertificatesProps) {
  const isAr = lang === "ar";

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  // Issue Certificate Modal
  const [showModal, setShowModal] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientRole, setRecipientRole] = useState("طالب متميز");
  const [title, setTitle] = useState("شهادة إتمام وتفوق في مقرر اللغة العربية");
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const data = await fetchWithRetry<Certificate[]>("/api/certificates");
      setCertificates(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCertificate = async () => {
    if (!recipientName.trim()) return;

    setIssuing(true);
    try {
      await fetchWithRetry("/api/certificates/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientName, recipientRole, title })
      });

      alert(isAr ? "تم إصدار الشهادة الرقمية بنجاح!" : "Digital certificate issued successfully!");
      setShowModal(false);
      setRecipientName("");
      fetchCertificates();
    } catch (err: any) {
      alert(err.message || "حدث خطأ أثناء إصدار الشهادة.");
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans dir-rtl">
      {/* Header Banner */}
      <div className="bg-[#1A365D] text-white p-6 rounded-2xl shadow-xl border border-[#C5A021]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold text-xl shadow">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white">
              {isAr ? "نظام الشهادات الرقمية والإنجازات الموثقة" : "Digital Certificates & Verifiable Credentials"}
            </h1>
            <p className="text-xs text-slate-300">
              {isAr
                ? "إصدار وتوثيق شهادات إكمال الدورات، تميز الطلاب، وسجل إنجازات المعلمين مع روابط تحقق رقمية."
                : "Issue and verify course completion certificates and student achievements with QR validation."}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#C5A021] hover:bg-amber-400 text-[#1A365D] font-mono font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? "إصدار شهادة تقديرية جديدة" : "Issue Certificate"}</span>
        </button>
      </div>

      {/* Certificates Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-gradient-to-br from-amber-50/40 via-white to-slate-50 border-2 border-[#C5A021]/40 p-6 rounded-3xl shadow-md space-y-4 relative overflow-hidden"
          >
            {/* Seal Graphic */}
            <div className="absolute top-4 left-4 w-12 h-12 bg-[#C5A021]/15 rounded-full border border-[#C5A021] flex items-center justify-center text-[#1A365D]">
              <ShieldCheck className="w-6 h-6 text-[#C5A021]" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#C5A021] tracking-widest uppercase block">
                {cert.code}
              </span>
              <h2 className="text-lg font-serif font-bold text-[#1A365D] leading-tight">{cert.title}</h2>
            </div>

            <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/60 space-y-1">
              <p className="text-xs text-slate-500 font-serif">ممنوحة لـ:</p>
              <p className="text-sm font-serif font-bold text-[#1A365D]">{cert.recipientName}</p>
              <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">
                {cert.recipientRole}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2 border-t border-slate-200">
              <div>
                <span className="block text-[10px] text-slate-400">جهة الاصدار:</span>
                <span className="font-bold text-[#1A365D] text-[11px]">{cert.issuer}</span>
              </div>

              <button
                onClick={() => alert(`رابط التحقق الرقمي الموثق: ${cert.verifiableUrl}`)}
                className="px-3 py-1.5 bg-[#1A365D] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
              >
                <QrCode className="w-3.5 h-3.5 text-[#C5A021]" />
                <span>التحقق الرقمي</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1A365D] border-b pb-2">
              إصدار شهادة رقمية جديدة
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">اسم الممنوح له الشهادة:</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="اسم الطالب أو المعلم الرباعي..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans outline-none focus:border-[#C5A021]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">الصفة أو الدور:</label>
                <select
                  value={recipientRole}
                  onChange={(e) => setRecipientRole(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif outline-none"
                >
                  <option value="طالب متميز - الصف التاسع">طالب متميز - الصف التاسع</option>
                  <option value="طالب متميز - الثانوية العامة">طالب متميز - الثانوية العامة</option>
                  <option value="معلم متميز ومتدرب">معلم متميز ومتدرب</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">عنوان الشهادة والإنجاز:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                onClick={handleIssueCertificate}
                disabled={issuing || !recipientName.trim()}
                className="px-5 py-2 bg-[#1A365D] hover:bg-[#122846] text-white rounded-xl text-xs font-mono font-bold cursor-pointer shadow"
              >
                {issuing ? "جاري الإصدار..." : "إصدار وتوثيق"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
