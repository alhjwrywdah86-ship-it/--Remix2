import React, { useState, useEffect } from "react";
import { DailyTrackingEntry, Language, Classroom, Student } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import ParentMessagingModal from "./ParentMessagingModal";
import {
  UserCheck,
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Award,
  RefreshCw,
  FileText,
  Save,
  MessageSquare
} from "lucide-react";

interface StudentTrackingBoardProps {
  lang: Language;
}

export default function StudentTrackingBoard({ lang }: StudentTrackingBoardProps) {
  const isAr = lang === "ar";

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("class_1");

  const [trackingList, setTrackingList] = useState<DailyTrackingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Messaging Modal State
  const [showMessagingModal, setShowMessagingModal] = useState(false);
  const [selectedStudentForMessaging, setSelectedStudentForMessaging] = useState<Student | null>(null);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    fetchTrackingData();
  }, [selectedClassId, date]);

  const fetchClassrooms = async () => {
    try {
      const data = await fetchWithRetry<Classroom[]>("/api/classrooms");
      setClassrooms(data || []);
      if (data && data.length > 0) {
        setSelectedClassId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrackingData = async () => {
    setLoading(true);
    try {
      const data = await fetchWithRetry<DailyTrackingEntry[]>(
        `/api/student-tracking?classroomId=${selectedClassId}&date=${date}`
      );
      setTrackingList(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, attendance: any) => {
    setTrackingList((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, attendance } : item))
    );
  };

  const handleParticipationChange = (studentId: string, participationLevel: any) => {
    setTrackingList((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, participationLevel } : item))
    );
  };

  const handleHomeworkToggle = (studentId: string) => {
    setTrackingList((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, homeworkCompleted: !item.homeworkCompleted } : item))
    );
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setTrackingList((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, notes } : item))
    );
  };

  const handleSaveTracking = async () => {
    setSaving(true);
    try {
      await fetchWithRetry("/api/student-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classroomId: selectedClassId,
          date,
          entries: trackingList
        })
      });

      alert("تم حفظ سجل المتابعة اليومية للطلاب بنجاح!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "حدث خطأ أثناء حفظ سجل المتابعة.");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateAIReport = async () => {
    setGeneratingReport(true);
    try {
      const data = await fetchWithRetry<any>("/api/student-tracking/ai-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classroomId: selectedClassId, date, trackingList })
      });

      setGeneratedReport(data.reportText);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "حدث خطأ أثناء إنشاء التقرير الذكي.");
    } finally {
      setGeneratingReport(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans dir-rtl">
      {/* Header Banner */}
      <div className="bg-[#1A365D] text-white p-6 rounded-2xl shadow-xl border border-[#C5A021]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold text-xl shadow">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white">لوحة المتابعة اليومية للطلاب</h1>
            <p className="text-xs text-slate-300">
              تسجيل الحضور والغياب، المشاركة الصفية، حل الواجبات، والملاحظات السلوكية اليومية.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
          <button
            onClick={handleGenerateAIReport}
            disabled={generatingReport || trackingList.length === 0}
            className="px-4 py-2.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 font-mono font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all"
          >
            {generatingReport ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#C5A021]" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#C5A021]" />
            )}
            <span>توليد تقرير يومي تلقائي بـ Gemini</span>
          </button>

          <button
            onClick={handleSaveTracking}
            disabled={saving}
            className="px-5 py-2.5 bg-[#C5A021] hover:bg-amber-400 text-[#1A365D] font-mono font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "جاري الحفظ..." : "حفظ المتابعة اليومية"}</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Class selector & Date picker */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-mono font-bold text-slate-700">الفصل الدراسي:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-serif font-bold text-[#1A365D] outline-none focus:border-[#C5A021]"
          >
            {classrooms.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.grade}) - {cls.subject}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#C5A021]" />
          <span className="text-xs font-mono font-bold text-slate-700">تاريخ المتابعة:</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-[#C5A021]"
          />
        </div>
      </div>

      {/* AI Generated Report Alert Box */}
      {generatedReport && (
        <div className="bg-amber-50 p-5 rounded-2xl border-2 border-[#C5A021] shadow-md space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 text-[#1A365D] font-serif font-bold text-sm">
            <Sparkles className="w-5 h-5 text-[#C5A021]" />
            <span>التقرير اليومي التلقائي الصادر من الذكاء الاصطناعي:</span>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-sans">{generatedReport}</p>
        </div>
      )}

      {/* Students Tracking Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#1A365D] text-white font-serif">
              <tr>
                <th className="p-3.5">اسم الطالب</th>
                <th className="p-3.5">حالة الحضور والغياب</th>
                <th className="p-3.5">المشاركة الصفية</th>
                <th className="p-3.5">إنجاز الواجب</th>
                <th className="p-3.5">ملاحظات المعلم</th>
                <th className="p-3.5 text-center">إجراء المراسلة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {trackingList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-serif">
                    {isAr ? "لا يوجد طلاب مسجلون في هذا الفصل حتى الآن." : "No registered students in this classroom."}
                  </td>
                </tr>
              ) : (
                trackingList.map((entry) => (
                  <tr key={entry.studentId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-[#1A365D]">{entry.studentName}</td>

                    {/* Attendance buttons */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1 font-mono">
                        {(["present", "absent", "late", "excused"] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(entry.studentId, status)}
                            className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                              entry.attendance === status
                                ? status === "present"
                                  ? "bg-emerald-600 text-white"
                                  : status === "absent"
                                  ? "bg-rose-600 text-white"
                                  : status === "late"
                                  ? "bg-amber-600 text-white"
                                  : "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {status === "present" && "حاضر"}
                            {status === "absent" && "غائب"}
                            {status === "late" && "متأخر"}
                            {status === "excused" && "بعذر"}
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Participation */}
                    <td className="p-3.5">
                      <select
                        value={entry.participationLevel}
                        onChange={(e) => handleParticipationChange(entry.studentId, e.target.value)}
                        className="p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-[#1A365D] outline-none"
                      >
                        <option value="ممتاز">ممتاز ⭐⭐⭐</option>
                        <option value="جيد جداً">جيد جداً ⭐⭐</option>
                        <option value="متوسط">متوسط ⭐</option>
                        <option value="ضعيف">يحتاج تشجيع</option>
                      </select>
                    </td>

                    {/* Homework Checkbox */}
                    <td className="p-3.5">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={entry.homeworkCompleted}
                          onChange={() => handleHomeworkToggle(entry.studentId)}
                          className="w-4 h-4 text-[#1A365D] rounded accent-[#1A365D]"
                        />
                        <span className={entry.homeworkCompleted ? "text-emerald-700 font-bold" : "text-rose-600"}>
                          {entry.homeworkCompleted ? "مكتمل ✔" : "غير مكتمل ❌"}
                        </span>
                      </label>
                    </td>

                    {/* Teacher Notes */}
                    <td className="p-3.5">
                      <input
                        type="text"
                        value={entry.notes}
                        onChange={(e) => handleNotesChange(entry.studentId, e.target.value)}
                        placeholder="أضف ملاحظة أو ثناء..."
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs outline-none focus:border-[#C5A021]"
                      />
                    </td>

                    {/* Parent Messaging Button */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => {
                          setSelectedStudentForMessaging({
                            id: entry.studentId,
                            name: entry.studentName,
                            grade: "الصف الدراسي",
                            homework: entry.homeworkCompleted ? 28 : 15,
                            participation: entry.participationLevel === "ممتاز" ? 20 : 15,
                            exam: 40,
                            finalScore: 85,
                            notes: entry.notes || ""
                          });
                          setShowMessagingModal(true);
                        }}
                        className="px-2.5 py-1.5 bg-[#1A365D] hover:bg-[#2A4A7F] text-white rounded-lg font-bold text-[11px] inline-flex items-center gap-1 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                        title="مراسلة ولي الأمر"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#C5A021]" />
                        <span>مراسلة ولي الأمر</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parent Messaging Modal */}
      {showMessagingModal && (
        <ParentMessagingModal
          isOpen={showMessagingModal}
          onClose={() => {
            setShowMessagingModal(false);
            setSelectedStudentForMessaging(null);
          }}
          student={selectedStudentForMessaging}
          isAr={isAr}
        />
      )}
    </div>
  );
}
