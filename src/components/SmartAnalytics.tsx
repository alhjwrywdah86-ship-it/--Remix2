import React, { useState, useEffect } from "react";
import { UserRole, StudentLevelReport } from "../types";
import SmartRemedialPlanModal from "./SmartRemedialPlanModal";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Users,
  Award,
  Sparkles,
  RefreshCw,
  PieChart,
  Activity,
  Lightbulb,
  FileText
} from "lucide-react";

interface SmartAnalyticsProps {
  isAr: boolean;
  userRole: UserRole;
}

export default function SmartAnalytics({ isAr, userRole }: SmartAnalyticsProps) {
  const [summaryData, setSummaryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRemedialModalOpen, setIsRemedialModalOpen] = useState(false);
  const [studentReport, setStudentReport] = useState<StudentLevelReport | null>(null);
  const [analyzingStudent, setAnalyzingStudent] = useState(false);

  useEffect(() => {
    fetch("/api/analytics/summary")
      .then((res) => res.json())
      .then((data) => {
        setSummaryData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAnalyzeStudent = (studentName: string) => {
    setAnalyzingStudent(true);
    fetch("/api/ai/student-analyzer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName,
        grade: "الصف التاسع الأساسي",
        subject: "اللغة العربية",
        studentData: {
          quizzesScore: "76/100",
          frequentMistakes: ["الإعراب الفرعي", "الهمزات"],
          participation: "ممتازة"
        }
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setStudentReport(data);
        setAnalyzingStudent(false);
      })
      .catch((err) => {
        console.error(err);
        setAnalyzingStudent(false);
      });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1A365D] to-[#2B4C7E] text-white p-6 rounded-2xl border-b-4 border-[#C5A021] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold shadow-md">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-[#C5A021]">
              {isAr ? "التقارير والتحليلات التعليمية الذكية" : "Smart Educational Analytics"}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {isAr
                ? "متابعة دقيقة لمستويات الطلاب، تحليل المهارات الضعيفة، وإحصائيات استخدام المنصة"
                : "Comprehensive analytics on student performance, weak skills, and platform usage"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsRemedialModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#1A365D] bg-[#C5A021] hover:bg-amber-400 flex items-center gap-2 cursor-pointer shadow-md transition-all"
        >
          <Sparkles className="w-4 h-4 text-[#1A365D]" />
          <span>{isAr ? "إنشاء خطة علاجية بالذكاء الاصطناعي" : "Generate AI Remedial Plan"}</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-serif font-bold">
            <span>{isAr ? "إجمالي المستخدمين:" : "Total Users:"}</span>
            <Users className="w-4 h-4 text-[#1A365D]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#1A365D]">
            {summaryData ? summaryData.totalUsers : 18}
          </div>
          <p className="text-[10px] text-emerald-600 font-bold font-serif">✔ معلمون وطلاب نشطون</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-serif font-bold">
            <span>{isAr ? "الفصول الدراسية:" : "Classrooms:"}</span>
            <PieChart className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700">
            {summaryData ? summaryData.totalClassrooms : 2}
          </div>
          <p className="text-[10px] text-slate-500 font-serif">شعب موثقة</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-serif font-bold">
            <span>{isAr ? "الاختبارات المنشورة:" : "Active Quizzes:"}</span>
            <Activity className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-800">
            {summaryData ? summaryData.totalQuizzes : 1}
          </div>
          <p className="text-[10px] text-purple-600 font-bold font-serif">مصححة آلياً</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-serif font-bold">
            <span>{isAr ? "أجوبة الطلاب:" : "Quiz Submissions:"}</span>
            <Award className="w-4 h-4 text-[#C5A021]" />
          </div>
          <div className="text-2xl font-black font-mono text-[#1A365D]">
            {summaryData ? summaryData.totalSubmissions : 1}
          </div>
          <p className="text-[10px] text-emerald-600 font-bold font-serif">معدل النجاح: 88%</p>
        </div>
      </div>

      {/* Teacher Analysis Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performers & Students Needing Support */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#1A365D] font-serif flex items-center gap-2">
            <Award className="w-5 h-5 text-[#C5A021]" />
            <span>{isAr ? "تحليل مستوى أداء الطلاب" : "Student Performance Breakdown"}</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 font-serif">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? "الطلاب المتفوقون (مستويات متميزة):" : "Top Performers:"}</span>
              </span>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside font-serif">
                <li>سارة خالد الذماري (98%) - تميز في الخط والقراءة</li>
                <li>عبدالله صالح الحضرمي (95%) - شغف بالمتون الشعرية</li>
                <li>محمد علي الخولاني (91%) - أداء ممتاز في الاختبارات</li>
              </ul>
            </div>

            <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 space-y-2">
              <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5 font-serif">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{isAr ? "الطلاب الذين يحتاجون خطة مساندة:" : "Students Needing Support:"}</span>
              </span>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside font-serif">
                <li>عمر حسن التعزي (62%) - صعوبات في الإملاء وقواعد الإعراب</li>
                <li>أحمد عبدالله الصنعاني (79%) - يحتاج تدريباً على التوابع النحوية</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Skill Gap Analysis */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#1A365D] font-serif flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <span>{isAr ? "تحليل المهارات والفجوات البيداغوجية" : "Skill Gap Analysis"}</span>
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 font-serif mb-1">
                <span>القراءة الجهرية والتذوق الأدبي</span>
                <span className="text-emerald-700 font-mono">92%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: "92%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 font-serif mb-1">
                <span>الفهم القرائي واستخراج الأفكار</span>
                <span className="text-emerald-700 font-mono">85%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 font-serif mb-1">
                <span>القواعد النحوية والإعراب السبوري</span>
                <span className="text-amber-700 font-mono">68%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "68%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 font-serif mb-1">
                <span>الرسم الإملائي والخط العربي الورقي</span>
                <span className="text-rose-700 font-mono">60%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: "60%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Student Analyzer Action Banner */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-[#1A365D] font-serif flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C5A021]" />
            <span>المحلل التعليمي الذكي للأنشطة والدرجات</span>
          </h3>
          <p className="text-xs text-slate-600 font-sans">
            تحليل درجات الطالب واستخراج نقاط القوة والضعف والأخطاء المتكررة بتقرير بيداغوجي شامل.
          </p>
        </div>

        <button
          onClick={() => handleAnalyzeStudent("عمر حسن التعزي")}
          disabled={analyzingStudent}
          className="px-4 py-2.5 bg-[#1A365D] hover:bg-[#122846] text-white rounded-xl text-xs font-bold font-mono flex items-center gap-2 cursor-pointer shadow transition-all"
        >
          {analyzingStudent ? (
            <RefreshCw className="w-4 h-4 animate-spin text-[#C5A021]" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#C5A021]" />
          )}
          <span>{analyzingStudent ? "جاري التحليل الذكي..." : "توليد تقرير الطالب الذكي (عمر التعزي)"}</span>
        </button>
      </div>

      {/* AI Generated Student Level Report Box */}
      {studentReport && (
        <div className="bg-white p-6 rounded-2xl border-2 border-[#C5A021] shadow-lg space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b pb-3 text-[#1A365D]">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#C5A021]" />
              <h3 className="font-bold text-base font-serif">
                تقرير أداء الطالب: {studentReport.studentName} ({studentReport.grade})
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 bg-amber-100 text-[#1A365D] rounded-full">
              نسبة الإتقان العامة: {studentReport.overallMasteryPercentage}% • {studentReport.masteryLevel}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 space-y-1.5">
              <h4 className="font-bold text-emerald-800 flex items-center gap-1 font-serif">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> نقاط القوة المكتشفة:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {studentReport.strengths?.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 space-y-1.5">
              <h4 className="font-bold text-rose-800 flex items-center gap-1 font-serif">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> المهارات التي تحتاج دعماً:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {studentReport.weaknesses?.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
            <h4 className="font-bold text-xs text-[#1A365D] font-serif flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>ملخص الخطة العلاجية والأنشطة المقترحة:</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              {studentReport.suggestedRemedialPlanSummary}
            </p>
          </div>
        </div>
      )}

      {/* Smart Remedial Plan Modal */}
      <SmartRemedialPlanModal
        isOpen={isRemedialModalOpen}
        onClose={() => setIsRemedialModalOpen(false)}
        lang={isAr ? "ar" : "en"}
      />
    </div>
  );
}
