import React, { useState } from "react";
import { Download, Upload, Shield, CheckCircle, RefreshCw, X, FileJson, HardDrive } from "lucide-react";
import { SystemBackupPayload } from "../types";

interface DataBackupModalProps {
  isOpen?: boolean;
  onClose: () => void;
  lang: "ar" | "en";
  onRestoreCompleted?: () => void;
}

export default function DataBackupModal({
  isOpen = true,
  onClose,
  lang,
  onRestoreCompleted
}: DataBackupModalProps) {
  const isAr = lang === "ar";
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleExportBackup = () => {
    setExporting(true);
    setStatusMessage("");
    setErrorMessage("");

    fetch("/api/admin/backup")
      .then((res) => res.json())
      .then((backupData: SystemBackupPayload) => {
        setExporting(false);
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(backupData, null, 2)
        )}`;
        const downloadAnchor = document.createElement("a");
        const dateStr = new Date().toISOString().split("T")[0];
        downloadAnchor.setAttribute("href", jsonString);
        downloadAnchor.setAttribute("download", `ProTeacher_Backup_${dateStr}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        setStatusMessage(
          isAr
            ? "تم تصدير النسخة الاحتياطية بنجاح وتنزيل ملف JSON على جهازك!"
            : "Backup exported and downloaded successfully!"
        );
      })
      .catch((err) => {
        setExporting(false);
        // Fallback local backup generator from localStorage
        try {
          const localClassrooms = localStorage.getItem("pro_teacher_classrooms");
          const localQuizzes = localStorage.getItem("pro_teacher_online_quizzes");
          const backupPayload = {
            exportDate: new Date().toISOString(),
            version: "5.0.0-commercial-saas",
            appTitle: "المعلم العربي المحترف",
            author: "الأستاذ وضاح أحمد حسن الزُّليل",
            data: {
              classrooms: localClassrooms ? JSON.parse(localClassrooms) : [],
              onlineQuizzes: localQuizzes ? JSON.parse(localQuizzes) : []
            }
          };

          const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(backupPayload, null, 2)
          )}`;
          const downloadAnchor = document.createElement("a");
          downloadAnchor.setAttribute("href", jsonString);
          downloadAnchor.setAttribute("download", `ProTeacher_Backup_Local.json`);
          document.body.appendChild(downloadAnchor);
          downloadAnchor.click();
          downloadAnchor.remove();

          setStatusMessage(isAr ? "تم تصدير النسخة الاحتياطية المحلية بنجاح!" : "Local backup exported!");
        } catch {
          setErrorMessage(isAr ? "فشل تصدير البيانات. تعذر الاتصال بالسيرفر." : "Failed to export data.");
        }
      });
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setStatusMessage("");
    setErrorMessage("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedBackup = JSON.parse(content);

        fetch("/api/admin/restore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: parsedBackup.data || parsedBackup })
        })
          .then((res) => res.json())
          .then((data) => {
            setImporting(false);
            if (data.success) {
              setStatusMessage(
                isAr
                  ? "تمت استعادة البيانات بنجاح في قاعدة البيانات الحية!"
                  : "Database restored successfully!"
              );
              onRestoreCompleted();
            } else {
              setErrorMessage(data.error || "فشلت استعادة البيانات.");
            }
          })
          .catch(() => {
            setImporting(false);
            // Fallback restore to localStorage
            if (parsedBackup.data?.classrooms) {
              localStorage.setItem("pro_teacher_classrooms", JSON.stringify(parsedBackup.data.classrooms));
            }
            if (parsedBackup.data?.onlineQuizzes) {
              localStorage.setItem("pro_teacher_online_quizzes", JSON.stringify(parsedBackup.data.onlineQuizzes));
            }
            setStatusMessage(isAr ? "تمت استعادة البيانات محلياً بنجاح!" : "Restored locally!");
            onRestoreCompleted();
          });
      } catch (err: any) {
        setImporting(false);
        setErrorMessage(isAr ? "تنسيق ملف النسخة الاحتياطية غير صالح." : "Invalid backup file format.");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl my-8 overflow-hidden text-[#1A365D] animate-fade-in"
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="bg-[#1A365D] text-white p-6 relative border-b border-[#C5A021]/30">
          <button
            onClick={onClose}
            className="absolute top-6 left-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <HardDrive className="w-7 h-7 text-[#C5A021]" />
            <div>
              <h2 className="text-xl font-serif font-bold text-[#C5A021]">
                {isAr ? "نظام النسخ الاحتياطي واستعادة البيانات" : "Data Backup & Recovery System"}
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                {isAr ? "حماية وحفظ البيانات الأكاديمية والدرجات" : "Export & restore student records & quizzes"}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 font-serif text-sm bg-[#F8FAFC]">
          {/* Export Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#1A365D] font-bold">
              <Download className="w-5 h-5 text-emerald-600" />
              <h4>{isAr ? "تصدير نسخة احتياطية كاملة (JSON)" : "Export Full Data Backup"}</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isAr
                ? "قم بتنزيل ملف نُسخة احتياطية آمن يحتوي على جميع تحاضيرك، الفصول، درجات الطلاب، بنك الأسئلة، والأنشطة للحفاظ عليها."
                : "Download a JSON backup containing all lesson plans, classrooms, student grades, and quizzes."}
            </p>
            <button
              onClick={handleExportBackup}
              disabled={exporting}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold rounded-xl transition-all cursor-pointer shadow flex items-center justify-center gap-2"
            >
              {exporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isAr ? "جاري التصدير..." : "Exporting..."}</span>
                </>
              ) : (
                <>
                  <FileJson className="w-4 h-4" />
                  <span>{isAr ? "تحميل ملف النسخة الاحتياطية" : "Download Backup JSON"}</span>
                </>
              )}
            </button>
          </div>

          {/* Import Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#1A365D] font-bold">
              <Upload className="w-5 h-5 text-[#C5A021]" />
              <h4>{isAr ? "استعادة البيانات من ملف سابق" : "Restore Data from Backup File"}</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isAr
                ? "حدد ملف النسخة الاحتياطية (JSON) المستخرج سابقاً لاستعادة جميع بيانات الفصول والاختبارات دفعة واحدة."
                : "Select a previously downloaded JSON backup file to restore classrooms and quiz records."}
            </p>

            <label className="w-full py-2.5 px-4 bg-[#1A365D] hover:bg-[#122846] text-white font-mono text-xs font-bold rounded-xl transition-all cursor-pointer shadow flex items-center justify-center gap-2 inline-block text-center">
              {importing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin inline" />
                  <span>{isAr ? "جاري الاستعادة..." : "Restoring..."}</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 inline" />
                  <span>{isAr ? "رفع واستعادة ملف JSON" : "Upload & Restore JSON File"}</span>
                </>
              )}
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                disabled={importing}
                className="hidden"
              />
            </label>
          </div>

          {statusMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in">
              <Shield className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
