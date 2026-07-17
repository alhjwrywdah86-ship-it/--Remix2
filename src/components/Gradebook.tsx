import React, { useState, useEffect } from "react";
import { Student, Language } from "../types";
import { Plus, Trash2, Download, RefreshCw, FileSpreadsheet, UserPlus, Save } from "lucide-react";
import * as XLSX from "xlsx";

interface GradebookProps {
  lang: Language;
}

const DEFAULT_STUDENTS: Student[] = [
  { id: "1", name: "أحمد علي محمد صالح", grade: "الصف التاسع - أ", homework: 28, participation: 18, exam: 45, finalScore: 91, notes: "طالب متميز ومجتهد" },
  { id: "2", name: "بلقيس وضاح أحمد الزليل", grade: "الصف التاسع - أ", homework: 30, participation: 20, exam: 49, finalScore: 99, notes: "مبدعة متفوقة في القراءة والكتابة" },
  { id: "3", name: "أروى محمد حميد", grade: "الصف التاسع - ب", homework: 24, participation: 16, exam: 38, finalScore: 78, notes: "تحتاج لمزيد من التركيز والحد من المشتتات" },
  { id: "4", name: "علي عبد الله قاسم", grade: "الصف التاسع - أ", homework: 22, participation: 15, exam: 35, finalScore: 72, notes: "يحتاج لمراجعة مستمرة بالبيت" },
  { id: "5", name: "سلوى مسعد حسن", grade: "الصف التاسع - ب", homework: 29, participation: 19, exam: 47, finalScore: 95, notes: "سرعة بديهة ممتازة ومثابرة" },
];

export default function Gradebook({ lang }: GradebookProps) {
  const isAr = lang === "ar";

  // Load students from localStorage or fallback to defaults
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem("arabic_teacher_students");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_STUDENTS;
      }
    }
    return DEFAULT_STUDENTS;
  });

  useEffect(() => {
    localStorage.setItem("arabic_teacher_students", JSON.stringify(students));
  }, [students]);

  // Form State
  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [newHomework, setNewHomework] = useState<number | "">("");
  const [newParticipation, setNewParticipation] = useState<number | "">("");
  const [newExam, setNewExam] = useState<number | "">("");
  const [newNotes, setNewNotes] = useState("");

  const [activeTab, setActiveTab] = useState<"list" | "add">("list");

  // Filter grade/class
  const [selectedGradeFilter, setSelectedGradeFilter] = useState("all");

  const gradesList = ["all", ...Array.from(new Set(students.map((s) => s.grade)))];

  // Helper to compute final grade
  const computeFinal = (hw: number, part: number, exam: number) => {
    return Math.min(100, Math.max(0, hw + part + exam));
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newGrade.trim()) return;

    const hw = Number(newHomework) || 0;
    const part = Number(newParticipation) || 0;
    const ex = Number(newExam) || 0;
    const final = computeFinal(hw, part, ex);

    const newStudent: Student = {
      id: Date.now().toString(),
      name: newName,
      grade: newGrade,
      homework: Math.min(30, Math.max(0, hw)),
      participation: Math.min(20, Math.max(0, part)),
      exam: Math.min(50, Math.max(0, ex)),
      finalScore: final,
      notes: newNotes,
    };

    setStudents([newStudent, ...students]);
    resetForm();
    setActiveTab("list");
  };

  const resetForm = () => {
    setNewName("");
    setNewGrade("");
    setNewHomework("");
    setNewParticipation("");
    setNewExam("");
    setNewNotes("");
  };

  const handleDelete = (id: string) => {
    if (confirm(isAr ? "هل أنت متأكد من حذف سجل هذا الطالب؟" : "Are you sure you want to delete this student record?")) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  const handleScoreChange = (id: string, field: "homework" | "participation" | "exam", value: number) => {
    setStudents(
      students.map((s) => {
        if (s.id === id) {
          const updated = { ...s };
          if (field === "homework") updated.homework = Math.min(30, Math.max(0, value));
          if (field === "participation") updated.participation = Math.min(20, Math.max(0, value));
          if (field === "exam") updated.exam = Math.min(50, Math.max(0, value));
          updated.finalScore = computeFinal(updated.homework, updated.participation, updated.exam);
          return updated;
        }
        return s;
      })
    );
  };

  const handleNotesChange = (id: string, val: string) => {
    setStudents(
      students.map((s) => (s.id === id ? { ...s, notes: val } : s))
    );
  };

  const handleExportToExcel = () => {
    const dataToExport = students
      .filter((s) => selectedGradeFilter === "all" || s.grade === selectedGradeFilter)
      .map((s) => ({
        [isAr ? "الرقم" : "ID"]: s.id,
        [isAr ? "اسم الطالب" : "Student Name"]: s.name,
        [isAr ? "الصف/الشعبة" : "Grade/Class"]: s.grade,
        [isAr ? "الواجبات (من 30)" : "Homework (Max 30)"]: s.homework,
        [isAr ? "المشاركة الحرة (من 20)" : "Participation (Max 20)"]: s.participation,
        [isAr ? "الاختبار التحريري (من 50)" : "Exam (Max 50)"]: s.exam,
        [isAr ? "الدرجة النهائية (من 100)" : "Final Score (Max 100)"]: s.finalScore,
        [isAr ? "ملاحظات تربوية" : "Educational Notes"]: s.notes,
      }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, isAr ? "سجل الدرجات" : "Gradebook");

    // Save File
    XLSX.writeFile(workbook, `gradebook_${selectedGradeFilter === "all" ? "all" : selectedGradeFilter}.xlsx`);
  };

  const handleResetToDefault = () => {
    if (confirm(isAr ? "هل تريد استعادة السجل النموذجي؟ سيؤدي هذا لمسح التعديلات." : "Reset to default sample records? Current edits will be lost.")) {
      setStudents(DEFAULT_STUDENTS);
    }
  };

  const filteredStudents = students.filter(
    (s) => selectedGradeFilter === "all" || s.grade === selectedGradeFilter
  );

  return (
    <div className="space-y-6 animate-fade-in" id="gradebook-tab-content">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">
            {isAr ? "سجل درجات الطلاب التفاعلي" : "Interactive Gradebook Engine"}
          </h2>
          <p className="text-xs text-charcoal/70">
            {isAr
              ? "إدارة سريعة ومحسوبة تلقائياً مع خيار التصدير الفوري لملفات Excel."
              : "Calculated automatically with rapid inline editing and instant Excel exports."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 text-xs font-mono border-2 border-charcoal transition-all ${
              activeTab === "list"
                ? "bg-charcoal text-ivory shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                : "bg-white text-charcoal hover:bg-autumn-yellow/20"
            }`}
          >
            {isAr ? "عرض السجل" : "View Register"}
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-4 py-2 text-xs font-mono border-2 border-charcoal transition-all ${
              activeTab === "add"
                ? "bg-charcoal text-ivory shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                : "bg-white text-charcoal hover:bg-autumn-yellow/20"
            }`}
          >
            <span className="flex items-center gap-1">
              <UserPlus className="w-3.5 h-3.5" />
              {isAr ? "إضافة طالب جديد" : "Add Student"}
            </span>
          </button>
        </div>
      </div>

      {activeTab === "list" ? (
        <div className="space-y-4">
          {/* Controls: Filter and Export */}
          <div className="paper-card p-4 bg-[#FAF8F5] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <label className="text-xs font-mono font-bold text-charcoal">
                {isAr ? "تصفية حسب الصف:" : "Filter Grade:"}
              </label>
              <select
                value={selectedGradeFilter}
                onChange={(e) => setSelectedGradeFilter(e.target.value)}
                className="bg-white border-2 border-charcoal px-3 py-1 text-xs font-mono focus:outline-none"
              >
                {gradesList.map((g) => (
                  <option key={g} value={g}>
                    {g === "all" ? (isAr ? "الكل" : "All Classes") : g}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button onClick={handleResetToDefault} className="paper-btn px-3 py-1.5 text-xs flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                {isAr ? "استعادة النموذجي" : "Reset Sample"}
              </button>

              <button
                onClick={handleExportToExcel}
                className="paper-btn-primary px-3 py-1.5 text-xs flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                {isAr ? "تصدير إلى Excel" : "Export to Excel"}
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="paper-card p-0 bg-white overflow-x-auto">
            <table className="w-full text-sm text-right border-collapse" dir={isAr ? "rtl" : "ltr"}>
              <thead>
                <tr className="bg-charcoal text-ivory border-b-2 border-charcoal font-serif">
                  <th className="p-3 text-center w-12 font-mono">#</th>
                  <th className="p-3 text-right">{isAr ? "الاسم الكامل" : "Full Name"}</th>
                  <th className="p-3 text-right">{isAr ? "الصف/الشعبة" : "Grade/Class"}</th>
                  <th className="p-3 text-center font-mono w-24">{isAr ? "الواجب (30)" : "HW (30)"}</th>
                  <th className="p-3 text-center font-mono w-24">{isAr ? "مشاركة (20)" : "Part (20)"}</th>
                  <th className="p-3 text-center font-mono w-24">{isAr ? "اختبار (50)" : "Exam (50)"}</th>
                  <th className="p-3 text-center font-mono w-24 bg-autumn-yellow/20 text-charcoal">{isAr ? "المجموع (100)" : "Total (100)"}</th>
                  <th className="p-3 text-right">{isAr ? "ملاحظات تربوية" : "Pedagogical Notes"}</th>
                  <th className="p-3 text-center w-16">{isAr ? "حذف" : "Del"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-charcoal/50 font-serif">
                      {isAr ? "لا يوجد طلاب مسجلين في هذا الفلتر." : "No student records found."}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s, idx) => (
                    <tr key={s.id} className="border-b border-charcoal/20 hover:bg-[#FAF8F5] transition-colors">
                      <td className="p-3 text-center font-mono text-xs text-charcoal/50">{idx + 1}</td>
                      <td className="p-3 font-serif font-bold text-charcoal">{s.name}</td>
                      <td className="p-3 text-xs font-mono">{s.grade}</td>
                      
                      {/* Interactive Score Inputs */}
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={s.homework}
                          onChange={(e) => handleScoreChange(s.id, "homework", Number(e.target.value))}
                          className="w-16 bg-white border border-charcoal text-center px-1.5 py-1 font-mono text-xs focus:ring-1 focus:ring-amber-gold focus:outline-none rounded"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={s.participation}
                          onChange={(e) => handleScoreChange(s.id, "participation", Number(e.target.value))}
                          className="w-16 bg-white border border-charcoal text-center px-1.5 py-1 font-mono text-xs focus:ring-1 focus:ring-amber-gold focus:outline-none rounded"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={s.exam}
                          onChange={(e) => handleScoreChange(s.id, "exam", Number(e.target.value))}
                          className="w-16 bg-white border border-charcoal text-center px-1.5 py-1 font-mono text-xs focus:ring-1 focus:ring-amber-gold focus:outline-none rounded"
                        />
                      </td>

                      {/* Computed Total with Color Logic */}
                      <td className={`p-2 text-center font-mono font-bold bg-autumn-yellow/10 ${
                        s.finalScore >= 90 ? "text-green-800 font-bold" : s.finalScore < 50 ? "text-red-700" : "text-charcoal"
                      }`}>
                        {s.finalScore}%
                      </td>

                      {/* Educational Notes Input */}
                      <td className="p-2">
                        <input
                          type="text"
                          value={s.notes}
                          onChange={(e) => handleNotesChange(s.id, e.target.value)}
                          placeholder={isAr ? "ملاحظة تربوية..." : "Educational notes..."}
                          className="w-full bg-transparent hover:bg-white focus:bg-white border-0 focus:border border-charcoal/20 px-2 py-1 text-xs focus:outline-none rounded"
                        />
                      </td>

                      {/* Actions */}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="text-charcoal/60 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Quick Statistics Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="paper-card p-4 bg-[#FAF8F5] text-center space-y-1">
              <span className="text-xs font-mono text-charcoal/60">{isAr ? "إجمالي الطلاب المقيدين" : "Total Enrolled Students"}</span>
              <p className="text-3xl font-mono font-bold text-charcoal">{filteredStudents.length}</p>
            </div>
            <div className="paper-card p-4 bg-[#FAF8F5] text-center space-y-1">
              <span className="text-xs font-mono text-charcoal/60">{isAr ? "متوسط المجموع العام" : "Class Overall Average"}</span>
              <p className="text-3xl font-mono font-bold text-amber-gold">
                {filteredStudents.length > 0
                  ? (filteredStudents.reduce((acc, curr) => acc + curr.finalScore, 0) / filteredStudents.length).toFixed(1)
                  : "0.0"}%
              </p>
            </div>
            <div className="paper-card p-4 bg-[#FAF8F5] text-center space-y-1">
              <span className="text-xs font-mono text-charcoal/60">{isAr ? "نسبة النجاح المقدرة" : "Estimated Passing Rate"}</span>
              <p className="text-3xl font-mono font-bold text-green-700">
                {filteredStudents.length > 0
                  ? (
                      (filteredStudents.filter((s) => s.finalScore >= 50).length / filteredStudents.length) *
                      100
                    ).toFixed(0)
                  : "0"}%
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Add Student Form */
        <div className="paper-card p-6 bg-white max-w-2xl mx-auto space-y-6">
          <h3 className="text-xl font-serif font-bold text-charcoal border-b pb-2">
            {isAr ? "إدراج سجل طالب جديد" : "Enroll New Student Record"}
          </h3>

          <form onSubmit={handleAddStudent} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-bold text-charcoal">{isAr ? "الاسم الكامل للطالب *:" : "Full Student Name *:"}</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={isAr ? "مثال: بلقيس وضاح الزليل" : "e.g. Belqis Waddah Al-Zulil"}
                  className="w-full bg-white border-2 border-charcoal p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-gold"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-charcoal">{isAr ? "الصف والشعبة *:" : "Class / Grade *:"}</label>
                <input
                  type="text"
                  required
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  placeholder={isAr ? "مثال: الصف التاسع - أ" : "e.g. Grade 9 - A"}
                  className="w-full bg-white border-2 border-charcoal p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block font-bold text-charcoal">{isAr ? "درجة الواجبات (الحد الأقصى 30):" : "Homework (Max 30):"}</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={newHomework}
                  onChange={(e) => setNewHomework(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="30"
                  className="w-full bg-white border-2 border-charcoal p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-gold"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-charcoal">{isAr ? "درجة المشاركة (الحد الأقصى 20):" : "Participation (Max 20):"}</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={newParticipation}
                  onChange={(e) => setNewParticipation(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="20"
                  className="w-full bg-white border-2 border-charcoal p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-gold"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-charcoal">{isAr ? "درجة الاختبار التحريري (الحد الأقصى 50):" : "Exam Score (Max 50):"}</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={newExam}
                  onChange={(e) => setNewExam(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="50"
                  className="w-full bg-white border-2 border-charcoal p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-gold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-charcoal">{isAr ? "ملاحظات وتوجيهات تربوية:" : "Educational / Behavioral Notes:"}</label>
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder={isAr ? "توجيهات تربوية بخصوص مستوى الطالب وتطويره..." : "Guidance notes on student growth..."}
                rows={3}
                className="w-full bg-white border-2 border-charcoal p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-gold font-sans text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveTab("list");
                }}
                className="paper-btn px-4 py-2"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button type="submit" className="paper-btn-primary px-5 py-2 flex items-center gap-1.5 font-bold">
                <Save className="w-4 h-4" />
                {isAr ? "حفظ وتثبيت الطالب" : "Save Student"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
