import React, { useState, useEffect } from "react";
import { QuestionBankItem, ExamQuestion } from "../types";
import { printContent, exportToWord } from "../utils/exportUtils";
import {
  Database,
  Search,
  Plus,
  Trash2,
  Edit,
  Download,
  Printer,
  Filter,
  CheckCircle,
  HelpCircle,
  X,
  FileCheck2
} from "lucide-react";

interface QuestionBankProps {
  isAr: boolean;
  questionItems?: QuestionBankItem[];
  onUpdateQuestionBank?: (items: QuestionBankItem[]) => void;
}

const PRESEEDED_QUESTIONS: QuestionBankItem[] = [
  {
    id: "qb-seed-1",
    grade: "الصف التاسع الأساسي",
    subject: "اللغة العربية",
    unit: "الوحدة الأولى",
    topic: "سورة الفرقان - صفات عباد الرحمن",
    question: {
      type: "mcq",
      questionText: "ما معنى كلمة 'هَوْنًا' في قوله تعالى: (وَعِبَادُ الرَّحْمَنِ الَّذِينَ يَمْشُونَ عَلَى الأَرْضِ هَوْنًا)؟",
      options: ["بسكنة وتواضع ووقار", "بتكبر واستعلاء", "بإسراع وهرولة", "بكسل وتوانٍ"],
      correctAnswer: "بسكنة وتواضع ووقار",
      explanation: "الهون هنا السكينة والتواضع والوقار من غير كبر ولا استعلاء.",
      points: 2,
    },
    createdAt: "2026-07-24T10:00:00Z",
  },
  {
    id: "qb-seed-2",
    grade: "الصف التاسع الأساسي",
    subject: "اللغة العربية",
    unit: "الوحدة الأولى",
    topic: "سورة الفرقان - صفات عباد الرحمن",
    question: {
      type: "true_false",
      questionText: "يتسم عباد الرحمن في معيشة أسرهم بالإسراف المفرط وتبذير الأموال في المظاهر الافتراضية.",
      correctAnswer: "خطأ",
      explanation: "بل منهجهم المالي هو الاعتدال والتوازن بين الإسراف والتقتير.",
      points: 2,
    },
    createdAt: "2026-07-24T10:00:00Z",
  },
  {
    id: "qb-seed-3",
    grade: "الصف الثامن الأساسي",
    subject: "اللغة العربية",
    unit: "الوحدة الأولى",
    topic: "شجرة البن اليمني المضيئة",
    question: {
      type: "essay",
      questionText: "وضح كيف تسهم زراعة البن في المدرجات الجبلية اليمنية في حماية التربة وتنمية روح الاعتماد على الذات لدى الشباب.",
      correctAnswer: "تثبت جذور شجرة البن مدرجات الجبال وتمنع انجراف التربة، وتنمي قيم الصبر والعمل الميداني الملموس.",
      points: 4,
    },
    createdAt: "2026-07-24T10:00:00Z",
  },
  {
    id: "qb-seed-4",
    grade: "الصف الأول الثانوي",
    subject: "اللغة العربية",
    unit: "الوحدة الأولى",
    topic: "ربيع الأرض - عبد الله البردوني",
    question: {
      type: "mcq",
      questionText: "كيف جسد البردوني ربيع اليمن في قصيدته الوجدانية الورقية؟",
      options: [
        "بحواسه البصرية واللمسية المرهفة ورائحة الطين والمطر",
        "بالصور الرقمية والشاشات العاكسة",
        "بالخيالات العلمية الجافة",
        "بالترجمة من اللغات الأجنبية"
      ],
      correctAnswer: "بحواسه البصرية واللمسية المرهفة ورائحة الطين والمطر",
      points: 2,
    },
    createdAt: "2026-07-24T10:00:00Z",
  },
];

export default function QuestionBank({
  isAr,
  questionItems,
  onUpdateQuestionBank,
}: QuestionBankProps) {
  const [bankItems, setBankItems] = useState<QuestionBankItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("الكل");
  const [selectedSubject, setSelectedSubject] = useState("الكل");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  // New Question Form State
  const [newGrade, setNewGrade] = useState("الصف التاسع الأساسي");
  const [newSubject, setNewSubject] = useState("اللغة العربية");
  const [newUnit, setNewUnit] = useState("الوحدة الأولى");
  const [newTopic, setNewTopic] = useState("");
  const [newQType, setNewQType] = useState<"mcq" | "true_false" | "essay">("mcq");
  const [newQText, setNewQText] = useState("");
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);
  const [newCorrectAnswer, setNewCorrectAnswer] = useState("");

  useEffect(() => {
    // Load from localStorage or seeds
    const saved = localStorage.getItem("ai_teacher_question_bank");
    if (saved) {
      try {
        const parsed: QuestionBankItem[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setBankItems(parsed);
          return;
        }
      } catch (e) {
        console.error("Failed to parse saved question bank", e);
      }
    }
    setBankItems(PRESEEDED_QUESTIONS);
    localStorage.setItem("ai_teacher_question_bank", JSON.stringify(PRESEEDED_QUESTIONS));
  }, []);

  const saveItemsToStorage = (items: QuestionBankItem[]) => {
    setBankItems(items);
    localStorage.setItem("ai_teacher_question_bank", JSON.stringify(items));
    if (onUpdateQuestionBank) {
      onUpdateQuestionBank(items);
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim() || !newTopic.trim()) {
      alert(isAr ? "يرجى تعبئة نص السؤال والدرس." : "Please fill question text and topic.");
      return;
    }

    const newItem: QuestionBankItem = {
      id: `qb-custom-${Date.now()}`,
      grade: newGrade,
      subject: newSubject,
      unit: newUnit,
      topic: newTopic,
      question: {
        type: newQType,
        questionText: newQText,
        options: newQType === "mcq" ? newOptions.filter((o) => o.trim().length > 0) : undefined,
        correctAnswer: newCorrectAnswer || (newQType === "mcq" ? newOptions[0] : "صحيح"),
        points: 2,
      },
      createdAt: new Date().toISOString(),
    };

    const updated = [newItem, ...bankItems];
    saveItemsToStorage(updated);
    setShowAddModal(false);
    setNewQText("");
    setNewTopic("");
    setSuccessMessage(isAr ? "تمت إضافة السؤال بنجاح إلى بنك الأسئلة!" : "Question added successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm(isAr ? "هل أنت تأكد من حذف هذا السؤال من بنك الأسئلة؟" : "Delete this question?")) {
      const updated = bankItems.filter((item) => item.id !== id);
      saveItemsToStorage(updated);
      setSelectedQuestions((prev) => prev.filter((qId) => qId !== id));
    }
  };

  const handleToggleSelectQuestion = (id: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
    );
  };

  const filteredItems = bankItems.filter((item) => {
    const matchGrade = selectedGrade === "الكل" || item.grade === selectedGrade;
    const matchSubject = selectedSubject === "الكل" || item.subject === selectedSubject;
    const matchQuery =
      !searchQuery.trim() ||
      item.question.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGrade && matchSubject && matchQuery;
  });

  const handleExportSelectedToWord = () => {
    const itemsToExport = bankItems.filter((i) => selectedQuestions.includes(i.id));
    if (itemsToExport.length === 0) {
      alert(isAr ? "يرجى تحديد أسئلة للتصدير أولاً." : "Select questions first.");
      return;
    }

    let html = `<div style="font-family: Arial; direction: rtl; text-align: right;"><h2>أسئلة مختارة من بنك الأسئلة الذكي</h2>`;
    itemsToExport.forEach((item, idx) => {
      html += `
        <div style="margin-bottom: 15px; padding: 10px; border-bottom: 1px solid #ccc;">
          <p><strong>س ${idx + 1} (${item.grade} - ${item.subject} - ${item.topic}):</strong> ${item.question.questionText}</p>
          ${item.question.options ? `<p>الخيارات: ${item.question.options.join(" | ")}</p>` : ""}
          <p style="color: green;">✔ الإجابة: ${item.question.correctAnswer}</p>
        </div>
      `;
    });
    html += `</div>`;

    exportToWord("تصدير_أسئلة_بنك_الأسئلة", "أسئلة مجمعة من بنك الأسئلة", html);
  };

  const handlePrintSelected = () => {
    const itemsToExport = bankItems.filter((i) => selectedQuestions.includes(i.id));
    if (itemsToExport.length === 0) {
      alert(isAr ? "يرجى تحديد أسئلة للطباعة." : "Select questions first.");
      return;
    }

    let html = `<div>`;
    itemsToExport.forEach((item, idx) => {
      html += `
        <div class="question-box">
          <p><strong>س ${idx + 1}:</strong> ${item.question.questionText} (${item.grade} - ${item.topic})</p>
          ${item.question.options ? `<ul>${item.question.options.map((o) => `<li>[  ] ${o}</li>`).join("")}</ul>` : ""}
          <p style="color: #166534; font-weight: bold;">✔ الإجابة النموذجية: ${item.question.correctAnswer}</p>
        </div>
      `;
    });
    html += `</div>`;

    printContent("طباعة أسئلة مختارة من بنك الأسئلة الذكي", html);
  };

  const handlePublishAsOnlineQuiz = () => {
    const itemsToPublish = bankItems.filter((i) => selectedQuestions.includes(i.id));
    if (itemsToPublish.length === 0) {
      alert(isAr ? "يرجى تحديد أسئلة أولاً لنشرها كاختبار إلكتروني للطلاب." : "Select questions first.");
      return;
    }

    const quizQuestions = itemsToPublish.map((item) => item.question);
    const quizTitle = `اختبار تقويمي من بنك الأسئلة (${itemsToPublish[0].topic || itemsToPublish[0].subject})`;

    fetch("/api/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: quizTitle,
        grade: itemsToPublish[0].grade,
        subject: itemsToPublish[0].subject,
        durationMinutes: Math.max(10, itemsToPublish.length * 5),
        questions: quizQuestions,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setSuccessMessage(isAr ? "تم نشر الأسئلة المختارة كاختبار إلكتروني للطلاب بنجاح!" : "Published as Online Quiz!");
          setSelectedQuestions([]);
          setTimeout(() => setSuccessMessage(""), 4000);
        }
      })
      .catch((err) => alert("فشل نشر الاختبار"));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1A365D] text-white p-6 rounded-xl border-b-4 border-[#C5A021] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] rounded-xl flex items-center justify-center text-[#1A365D] shadow-md">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-[#C5A021]">
              {isAr ? "بنك الأسئلة الذكي (Smart Question Bank)" : "Smart Question Bank"}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {isAr
                ? "قاعدة بيانات تفاعلية لحفظ، تنظيم، فلترة وتدوير أسئلة المناهج حسب الصفوف والمواد"
                : "Organize, filter, search, and reuse curriculum questions offline"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-lg text-xs font-bold text-[#1A365D] bg-[#C5A021] hover:bg-amber-400 flex items-center gap-2 cursor-pointer shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? "إضافة سؤال جديد للبنك" : "Add Question"}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث في نصوص الأسئلة أو الموضوعات..." : "Search questions or topics..."}
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded-lg pr-9 pl-3 py-2 text-xs text-[#1A365D] focus:ring-2 focus:ring-[#C5A021]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-[#F8FAFC] border border-slate-300 rounded-lg p-2 text-xs text-[#1A365D]"
          >
            <option value="الكل">{isAr ? "جميع الصفوف" : "All Grades"}</option>
            <option value="الصف السابع الأساسي">الصف السابع الأساسي</option>
            <option value="الصف الثامن الأساسي">الصف الثامن الأساسي</option>
            <option value="الصف التاسع الأساسي">الصف التاسع الأساسي</option>
            <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
            <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
            <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-[#F8FAFC] border border-slate-300 rounded-lg p-2 text-xs text-[#1A365D]"
          >
            <option value="الكل">{isAr ? "جميع المواد" : "All Subjects"}</option>
            <option value="اللغة العربية">اللغة العربية</option>
            <option value="التربية الإسلامية والقرآن الكريم">التربية الإسلامية</option>
            <option value="الاجتماعيات والتاريخ العربي">الاجتماعيات</option>
            <option value="العلوم والفيزياء الحيوية">العلوم</option>
            <option value="الرياضيات والمنطق الحسابي">الرياضيات</option>
          </select>

          {selectedQuestions.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePublishAsOnlineQuiz}
                className="px-3 py-2 rounded-lg text-xs font-bold text-[#1A365D] bg-[#C5A021] hover:bg-amber-400 flex items-center gap-1 cursor-pointer shadow-sm transition-all"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>{isAr ? `نشر باختبار للطلاب (${selectedQuestions.length})` : `Publish Quiz (${selectedQuestions.length})`}</span>
              </button>
              <button
                onClick={handleExportSelectedToWord}
                className="px-3 py-2 rounded-lg text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Word ({selectedQuestions.length})</span>
              </button>
              <button
                onClick={handlePrintSelected}
                className="px-3 py-2 rounded-lg text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isAr ? "طباعة" : "Print"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-lg text-xs font-bold flex items-center gap-2 animate-pulse">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Question List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
          <span>{isAr ? `إجمالي الأسئلة المتاحة: (${filteredItems.length})` : `Total Questions: (${filteredItems.length})`}</span>
          <span className="text-[11px] text-slate-500">{isAr ? "مفلترة ومحفوظة أوفلاين في جهازك" : "Filtered & Saved Offline"}</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-sm text-[#1A365D]">
              {isAr ? "لا توجد أسئلة مطابقة للبحث حالياً." : "No questions matched your search."}
            </p>
            <p className="text-xs mt-1">
              {isAr ? "يمكنك توليد اختبار جديد أو إضافة أسئلة يدوية لبنك الأسئلة." : "Generate a new quiz or add questions manually."}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isSelected = selectedQuestions.includes(item.id);
            return (
              <div
                key={item.id}
                className={`p-5 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-amber-50/60 border-[#C5A021] shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelectQuestion(item.id)}
                      className="mt-1 w-4 h-4 accent-[#C5A021] cursor-pointer"
                    />
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-[#1A365D] text-white text-[10px] px-2 py-0.5 rounded font-bold">
                          {item.grade}
                        </span>
                        <span className="bg-[#C5A021]/20 text-[#1A365D] text-[10px] px-2 py-0.5 rounded font-bold">
                          {item.subject}
                        </span>
                        <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded">
                          {item.unit} | {item.topic}
                        </span>
                      </div>

                      <p className="font-bold text-sm text-[#1A365D] leading-relaxed">
                        {item.question.questionText}
                      </p>

                      {item.question.options && item.question.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-600 bg-slate-50 p-2 rounded">
                          {item.question.options.map((opt, idx) => (
                            <span key={idx}>• {opt}</span>
                          ))}
                        </div>
                      )}

                      <div className="bg-emerald-50 text-emerald-800 text-xs p-2 rounded border border-emerald-200 font-bold">
                        ✔ {isAr ? "الإجابة النموذجية:" : "Answer:"} {item.question.correctAnswer}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteQuestion(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                    title={isAr ? "حذف السؤال" : "Delete Question"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border-2 border-[#C5A021] w-full max-w-lg overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-[#1A365D] font-serif">
                {isAr ? "إضافة سؤال جديد لبنك الأسئلة" : "Add New Question"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "الصف:" : "Grade:"}</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full bg-[#F8FAFC] border p-2 rounded"
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
                  <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "المادة:" : "Subject:"}</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-[#F8FAFC] border p-2 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "اسم الدرس أو الموضوع:" : "Topic:"}</label>
                <input
                  type="text"
                  required
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="مثال: سورة الفرقان"
                  className="w-full bg-[#F8FAFC] border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "نص السؤال:" : "Question Text:"}</label>
                <textarea
                  rows={2}
                  required
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  className="w-full bg-[#F8FAFC] border p-2 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "نوع السؤال:" : "Question Type:"}</label>
                <select
                  value={newQType}
                  onChange={(e) => setNewQType(e.target.value as any)}
                  className="w-full bg-[#F8FAFC] border p-2 rounded"
                >
                  <option value="mcq">اختيار من متعدد</option>
                  <option value="true_false">صح وخطأ</option>
                  <option value="essay">سؤال مقالي</option>
                </select>
              </div>

              {newQType === "mcq" && (
                <div className="space-y-1">
                  <label className="block font-bold text-[#1A365D]">{isAr ? "الخيارات الاربعة:" : "Options:"}</label>
                  {newOptions.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`خيار ${idx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const updated = [...newOptions];
                        updated[idx] = e.target.value;
                        setNewOptions(updated);
                      }}
                      className="w-full bg-[#F8FAFC] border p-1.5 rounded mb-1"
                    />
                  ))}
                </div>
              )}

              <div>
                <label className="block font-bold text-[#1A365D] mb-1">{isAr ? "الإجابة الصحيحة النموذجية:" : "Correct Answer:"}</label>
                <input
                  type="text"
                  required
                  value={newCorrectAnswer}
                  onChange={(e) => setNewCorrectAnswer(e.target.value)}
                  placeholder="أدخل الإجابة الدقيقة"
                  className="w-full bg-[#F8FAFC] border p-2 rounded"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded text-slate-600 bg-slate-100"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded text-white bg-[#1A365D] font-bold"
                >
                  {isAr ? "حفظ السؤال بالبنك" : "Save Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
