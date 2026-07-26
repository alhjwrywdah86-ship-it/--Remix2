import React, { useState, useEffect } from "react";
import { Classroom, Student, AttendanceEntry } from "../types";
import {
  Users,
  Plus,
  Trash2,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  UserPlus,
  Save,
  Check,
  Search,
  Sparkles,
  ClipboardList
} from "lucide-react";

interface ClassroomManagerProps {
  isAr: boolean;
}

export default function ClassroomManager({ isAr }: ClassroomManagerProps) {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"students" | "attendance">("students");

  // New Class Form
  const [newClassName, setNewClassName] = useState("");
  const [newClassGrade, setNewClassGrade] = useState("الصف التاسع الأساسي");
  const [newClassSubject, setNewClassSubject] = useState("اللغة العربية");

  // New Student Form
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentHw, setNewStudentHw] = useState(25);
  const [newStudentPart, setNewStudentPart] = useState(15);
  const [newStudentExam, setNewStudentExam] = useState(40);
  const [newStudentNotes, setNewStudentNotes] = useState("");

  // Attendance Form State
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceEntries, setAttendanceEntries] = useState<Record<string, "present" | "absent" | "late">>({});
  const [saveMessage, setSaveMessage] = useState("");

  const loadClassrooms = () => {
    fetch("/api/classrooms")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setClassrooms(data);
          if (data.length > 0 && !selectedClassId) {
            setSelectedClassId(data[0].id);
          }
        }
      })
      .catch((err) => console.error("Error loading classrooms:", err));
  };

  useEffect(() => {
    loadClassrooms();
  }, []);

  const activeClassroom = classrooms.find((c) => c.id === selectedClassId) || classrooms[0];

  useEffect(() => {
    if (activeClassroom && activeClassroom.students) {
      const initial: Record<string, "present" | "absent" | "late"> = {};
      activeClassroom.students.forEach((s) => {
        initial[s.id] = "present";
      });
      setAttendanceEntries(initial);
    }
  }, [selectedClassId, classrooms]);

  const handleCreateClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    fetch("/api/classrooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newClassName,
        grade: newClassGrade,
        subject: newClassSubject,
        teacherName: "أ. وضاح زليل",
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setShowAddClassModal(false);
          setNewClassName("");
          loadClassrooms();
          setSelectedClassId(resData.classroom.id);
        }
      })
      .catch((err) => alert("خطأ في إنشاء الفصل"));
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedClassId) return;

    fetch(`/api/classrooms/${selectedClassId}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newStudentName,
        homework: newStudentHw,
        participation: newStudentPart,
        exam: newStudentExam,
        notes: newStudentNotes,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setShowAddStudentModal(false);
          setNewStudentName("");
          setNewStudentNotes("");
          loadClassrooms();
        }
      })
      .catch((err) => alert("خطأ في إضافة الطالب"));
  };

  const handleDeleteClassroom = (id: string) => {
    if (confirm(isAr ? "هل أنت تأكد من حذف هذا الفصل وسجلات طلابه؟" : "Delete classroom?")) {
      fetch(`/api/classrooms/${id}`, { method: "DELETE" })
        .then(() => loadClassrooms())
        .catch((err) => console.error(err));
    }
  };

  const handleSaveAttendance = () => {
    if (!selectedClassId) return;
    const entriesArray = Object.entries(attendanceEntries).map(([sId, st]) => ({
      studentId: sId,
      status: st,
    }));

    fetch(`/api/classrooms/${selectedClassId}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: attendanceDate,
        entries: entriesArray,
        recordedBy: "أ. وضاح زليل",
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setSaveMessage(isAr ? "تم حفظ سجل الحضور والغياب بنجاح!" : "Attendance saved successfully!");
          setTimeout(() => setSaveMessage(""), 3000);
        }
      })
      .catch((err) => alert("فشل حفظ الحضور"));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1A365D] to-[#2B4C7E] text-white p-6 rounded-2xl border-b-4 border-[#C5A021] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold shadow-md">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-[#C5A021]">
              {isAr ? "إدارة الفصول الدراسية والحضور" : "Classroom & Attendance Management"}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {isAr
                ? "تنظيم الطلاب حسب المواد والصفوف، تسجيل الحضور والغياب اليومي، ومتابعة الدرجات والملاحظات"
                : "Manage class rosters, daily attendance, notes, and student performance"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddClassModal(true)}
          className="px-4 py-2.5 rounded-lg text-xs font-bold text-[#1A365D] bg-[#C5A021] hover:bg-amber-400 flex items-center gap-2 cursor-pointer shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? "إنشاء فصل دراسي جديد" : "Create New Classroom"}</span>
        </button>
      </div>

      {/* Classroom Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {classrooms.map((cls) => (
          <button
            key={cls.id}
            onClick={() => setSelectedClassId(cls.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-serif transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              cls.id === selectedClassId
                ? "bg-[#1A365D] text-[#C5A021] border-2 border-[#C5A021] shadow-sm"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#C5A021]" />
            <span>{cls.name}</span>
            <span className="bg-[#C5A021]/20 text-[#1A365D] px-2 py-0.5 rounded-full text-[10px]">
              {cls.students ? cls.students.length : 0} {isAr ? "طالب" : "students"}
            </span>
          </button>
        ))}
      </div>

      {/* Active Classroom Details */}
      {activeClassroom && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header Bar */}
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-serif text-[#1A365D]">
                  {activeClassroom.name}
                </h3>
                <span className="bg-[#1A365D] text-white text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                  {activeClassroom.grade}
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                  {activeClassroom.subject}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isAr ? "المعلم المسؤول:" : "Teacher:"} {activeClassroom.teacherName} | {isAr ? "تاريخ الإنشاء:" : "Created:"} {new Date(activeClassroom.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-xl border border-slate-300 flex items-center gap-1 text-xs">
                <button
                  onClick={() => setActiveTab("students")}
                  className={`px-3 py-1.5 rounded-lg font-bold font-serif transition-colors ${
                    activeTab === "students"
                      ? "bg-[#1A365D] text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isAr ? "سجل الطلاب والدرجات" : "Students Roster"}
                </button>
                <button
                  onClick={() => setActiveTab("attendance")}
                  className={`px-3 py-1.5 rounded-lg font-bold font-serif transition-colors ${
                    activeTab === "attendance"
                      ? "bg-[#1A365D] text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isAr ? "تسجيل الحضور والغياب" : "Daily Attendance"}
                </button>
              </div>

              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isAr ? "إضافة طالب" : "Add Student"}</span>
              </button>

              <button
                onClick={() => handleDeleteClassroom(activeClassroom.id)}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title={isAr ? "حذف الفصل" : "Delete Classroom"}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab 1: Students Roster */}
          {activeTab === "students" && (
            <div className="p-5 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start border-collapse">
                  <thead>
                    <tr className="bg-[#1A365D] text-white font-serif font-bold text-[11px]">
                      <th className="p-3 text-start rounded-s-lg">#</th>
                      <th className="p-3 text-start">{isAr ? "اسم الطالب" : "Student Name"}</th>
                      <th className="p-3 text-center">{isAr ? "الواجبات (30)" : "Homework"}</th>
                      <th className="p-3 text-center">{isAr ? "المشاركة (20)" : "Participation"}</th>
                      <th className="p-3 text-center">{isAr ? "الاختبار (50)" : "Exam"}</th>
                      <th className="p-3 text-center">{isAr ? "المجموع (100)" : "Final Score"}</th>
                      <th className="p-3 text-start rounded-e-lg">{isAr ? "ملاحظات المعلم" : "Notes"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(!activeClassroom.students || activeClassroom.students.length === 0) ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 font-serif">
                          {isAr ? "لا يوجد طلاب مضافين لهذا الفصل بعد. اضغط على 'إضافة طالب' لإدخال أسماء الطلاب." : "No students added yet."}
                        </td>
                      </tr>
                    ) : (
                      activeClassroom.students.map((st, idx) => (
                        <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-500">{idx + 1}</td>
                          <td className="p-3 font-bold text-[#1A365D] font-serif">{st.name}</td>
                          <td className="p-3 text-center font-mono">{st.homework}</td>
                          <td className="p-3 text-center font-mono">{st.participation}</td>
                          <td className="p-3 text-center font-mono">{st.exam}</td>
                          <td className="p-3 text-center font-mono font-bold">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs ${
                                st.finalScore >= 85
                                  ? "bg-emerald-100 text-emerald-800"
                                  : st.finalScore >= 60
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {st.finalScore}%
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 font-serif text-[11px]">{st.notes || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Daily Attendance */}
          {activeTab === "attendance" && (
            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between bg-amber-50 p-4 rounded-xl border border-amber-200">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#1A365D]" />
                  <span className="font-bold text-xs text-[#1A365D] font-serif">
                    {isAr ? "تاريخ الحضور اليومي:" : "Date:"}
                  </span>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono text-[#1A365D]"
                  />
                </div>

                <button
                  onClick={handleSaveAttendance}
                  className="px-4 py-2 bg-[#1A365D] hover:bg-[#122846] text-white font-bold rounded-lg text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4 text-[#C5A021]" />
                  <span>{isAr ? "حفظ سجل الحضور" : "Save Attendance"}</span>
                </button>
              </div>

              {saveMessage && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-lg text-xs font-bold flex items-center gap-2 animate-pulse">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{saveMessage}</span>
                </div>
              )}

              <div className="space-y-3">
                {(!activeClassroom.students || activeClassroom.students.length === 0) ? (
                  <p className="text-center text-slate-500 py-6 font-serif text-xs">
                    {isAr ? "أضف طلاباً للفصل أولاً لتتمكن من تسجيل الحضور والغياب." : "Add students first to record attendance."}
                  </p>
                ) : (
                  activeClassroom.students.map((st) => {
                    const status = attendanceEntries[st.id] || "present";
                    return (
                      <div
                        key={st.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4"
                      >
                        <span className="font-bold text-xs text-[#1A365D] font-serif">{st.name}</span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setAttendanceEntries((prev) => ({ ...prev, [st.id]: "present" }))
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                              status === "present"
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{isAr ? "حاضر" : "Present"}</span>
                          </button>

                          <button
                            onClick={() =>
                              setAttendanceEntries((prev) => ({ ...prev, [st.id]: "absent" }))
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                              status === "absent"
                                ? "bg-rose-600 text-white shadow-sm"
                                : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{isAr ? "غائب" : "Absent"}</span>
                          </button>

                          <button
                            onClick={() =>
                              setAttendanceEntries((prev) => ({ ...prev, [st.id]: "late" }))
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                              status === "late"
                                ? "bg-amber-600 text-white shadow-sm"
                                : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{isAr ? "متأخر" : "Late"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Classroom Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#C5A021] w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-base text-[#1A365D] font-serif border-b pb-2">
              {isAr ? "إنشاء فصل دراسي جديد" : "Create Classroom"}
            </h3>

            <form onSubmit={handleCreateClassroom} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "اسم الفصل والشعبة:" : "Classroom Name:"}</label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="مثال: الصف التاسع - شعبة (ج)"
                  className="w-full bg-[#F8FAFC] border p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "الصف الدراسي:" : "Grade:"}</label>
                <select
                  value={newClassGrade}
                  onChange={(e) => setNewClassGrade(e.target.value)}
                  className="w-full bg-[#F8FAFC] border p-2 rounded-lg"
                >
                  <option value="الصف السابع الأساسي">الصف السابع الأساسي</option>
                  <option value="الصف الثامن الأساسي">الصف الثامن الأساسي</option>
                  <option value="الصف التاسع الأساسي">الصف التاسع الأساسي</option>
                  <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                  <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                  <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "المادة الدراسية:" : "Subject:"}</label>
                <input
                  type="text"
                  value={newClassSubject}
                  onChange={(e) => setNewClassSubject(e.target.value)}
                  className="w-full bg-[#F8FAFC] border p-2 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 bg-slate-100"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-white bg-[#1A365D] font-bold"
                >
                  {isAr ? "حفظ الفصل" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#C5A021] w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-base text-[#1A365D] font-serif border-b pb-2">
              {isAr ? "إضافة طالب جديد للفصل" : "Add Student"}
            </h3>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "اسم الطالب الرباعي:" : "Full Name:"}</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="مثال: علي محمد عبدالله اليافعي"
                  className="w-full bg-[#F8FAFC] border p-2 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "الواجبات (30):" : "Homework:"}</label>
                  <input
                    type="number"
                    max={30}
                    value={newStudentHw}
                    onChange={(e) => setNewStudentHw(Number(e.target.value))}
                    className="w-full bg-[#F8FAFC] border p-2 rounded-lg font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "المشاركة (20):" : "Participation:"}</label>
                  <input
                    type="number"
                    max={20}
                    value={newStudentPart}
                    onChange={(e) => setNewStudentPart(Number(e.target.value))}
                    className="w-full bg-[#F8FAFC] border p-2 rounded-lg font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "الاختبار (50):" : "Exam:"}</label>
                  <input
                    type="number"
                    max={50}
                    value={newStudentExam}
                    onChange={(e) => setNewStudentExam(Number(e.target.value))}
                    className="w-full bg-[#F8FAFC] border p-2 rounded-lg font-mono text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "ملاحظات وتوجيهات المعلم:" : "Notes:"}</label>
                <input
                  type="text"
                  value={newStudentNotes}
                  onChange={(e) => setNewStudentNotes(e.target.value)}
                  placeholder="مثال: ممتازة في الخط العربي ومشاركة في الإذاعة"
                  className="w-full bg-[#F8FAFC] border p-2 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 bg-slate-100"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-white bg-[#1A365D] font-bold"
                >
                  {isAr ? "حفظ الطالب" : "Save Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
