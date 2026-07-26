import React, { useState, useEffect } from "react";
import { StudentGamificationState, Language } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import {
  Award,
  Zap,
  Star,
  Trophy,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Shield,
  User,
  Crown
} from "lucide-react";

interface GamificationAchievementsProps {
  lang: Language;
  studentId?: string;
}

export default function GamificationAchievements({
  lang,
  studentId = "st_student_1"
}: GamificationAchievementsProps) {
  const isAr = lang === "ar";

  const [studentGamification, setStudentGamification] = useState<StudentGamificationState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const fetchGamificationData = async () => {
    setLoading(true);
    try {
      const data = await fetchWithRetry<StudentGamificationState>("/api/achievements/student?studentId=st_student_1");
      setStudentGamification(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans dir-rtl">
      {/* Header Banner */}
      <div className="bg-[#1A365D] text-white p-6 rounded-2xl shadow-xl border border-[#C5A021]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold text-xl shadow">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white">نظام الإنجازات والأوسمة التحفيزية</h1>
            <p className="text-xs text-slate-300">
              تحفيز الطلاب والمعلمين بشارات التميز الأكاديمي، النقاط التراكمية، وسجل الأوسمة.
            </p>
          </div>
        </div>

        {studentGamification && (
          <div className="bg-white/10 p-3 rounded-xl border border-white/20 flex items-center gap-4 text-xs font-mono">
            <div className="text-center">
              <span className="text-amber-300 block text-lg font-bold">Lvl {studentGamification.level}</span>
              <span className="text-[10px] text-slate-300">المستوى</span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div className="text-center">
              <span className="text-amber-300 block text-lg font-bold">{studentGamification.points} pts</span>
              <span className="text-[10px] text-slate-300">النقاط</span>
            </div>
          </div>
        )}
      </div>

      {/* Badges Grid for Student & Teacher */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-base text-[#1A365D] flex items-center gap-2">
          <Award className="w-5 h-5 text-[#C5A021]" />
          <span>أوسمة التميز المتاحة وقواعد فتحها:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 bg-amber-100 text-[#1A365D] rounded-xl flex items-center justify-center font-bold text-xl">
              ⭐
            </div>
            <h4 className="font-serif font-bold text-sm text-[#1A365D]">فارس الواجبات المدرسية</h4>
            <p className="text-xs text-slate-600">تسليم 5 واجبات متتالية قبل موعد التسليم النهائى وبدرجات كاملة.</p>
            <span className="text-[10px] font-mono text-emerald-700 font-bold block">+100 نقطة إنجاز</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 bg-purple-100 text-purple-800 rounded-xl flex items-center justify-center font-bold text-xl">
              👑
            </div>
            <h4 className="font-serif font-bold text-sm text-[#1A365D]">الملتزم بالحضور والأنضباط</h4>
            <p className="text-xs text-slate-600">حضور شهر كامل بدون أي تأخير أو غياب غير مبرر.</p>
            <span className="text-[10px] font-mono text-emerald-700 font-bold block">+150 نقطة إنجاز</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold text-xl">
              💡
            </div>
            <h4 className="font-serif font-bold text-sm text-[#1A365D]">المعلم المبتكر المتقدم</h4>
            <p className="text-xs text-slate-600">توليد 20 تحضير درس بالذكاء الاصطناعي وإنشاء 5 اختبارات تفاعلية.</p>
            <span className="text-[10px] font-mono text-purple-700 font-bold block">وسام الإنتاجية المعلمية</span>
          </div>
        </div>
      </div>
    </div>
  );
}
