import React, { useState, useEffect } from "react";
import { SystemAdminOverview, SchoolRecord, Language } from "../types";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import {
  Building2,
  Users,
  GraduationCap,
  Shield,
  FileText,
  BarChart2,
  Plus,
  Search,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Activity
} from "lucide-react";

interface AdminManagementDashboardProps {
  lang: Language;
}

export default function AdminManagementDashboard({ lang }: AdminManagementDashboardProps) {
  const isAr = lang === "ar";

  const [overview, setOverview] = useState<SystemAdminOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminOverview();
  }, []);

  const fetchAdminOverview = async () => {
    setLoading(true);
    try {
      const data = await fetchWithRetry<SystemAdminOverview>("/api/admin/overview");
      setOverview(data);
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
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white">لوحة الإدارة التعليمية والمراقبة الشاملة</h1>
            <p className="text-xs text-slate-300">
              إدارة المدارس والصفوف، متابعة المعلمين والطلاب، وإصدار التقارير الإدارية والتحليلية للمنصة.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert("إضافة مدرسة أو مجمع تعليمي جديد")}
          className="px-4 py-2.5 bg-[#C5A021] hover:bg-amber-400 text-[#1A365D] font-mono font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مدرسة جديدة</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>المدارس المسجلة:</span>
              <Building2 className="w-4 h-4 text-[#C5A021]" />
            </div>
            <span className="text-2xl font-bold text-[#1A365D] block">{overview.totalSchools}</span>
            <span className="text-[10px] text-emerald-600 font-bold">مجمعات تعليمية نشطة</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>إجمالي المعلمين:</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-[#1A365D] block">{overview.totalTeachers}</span>
            <span className="text-[10px] text-purple-600 font-bold">حسابات موثقة</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>إجمالي الطلاب:</span>
              <GraduationCap className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-[#1A365D] block">{overview.totalStudents}</span>
            <span className="text-[10px] text-emerald-600 font-bold">في كافة الصفوف</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span>الواجبات والاختبارات:</span>
              <Activity className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-2xl font-bold text-[#1A365D] block">
              {overview.totalAssignments + overview.activeQuizzes}
            </span>
            <span className="text-[10px] text-amber-600 font-bold">عمليات نشطة اليوم</span>
          </div>
        </div>
      )}

      {/* Schools Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-serif font-bold text-base text-[#1A365D] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#C5A021]" />
            <span>سجل المدارس والمجمعات التعليمية المسجلة:</span>
          </h3>

          <span className="text-xs font-mono text-slate-500">
            عدد المدارس: {overview?.schools?.length || 0}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#1A365D] text-white font-serif">
              <tr>
                <th className="p-3">اسم المدرسة</th>
                <th className="p-3">المنطقة والمدير</th>
                <th className="p-3">المرحلة</th>
                <th className="p-3">المعلمون</th>
                <th className="p-3">الطلاب</th>
                <th className="p-3">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {overview?.schools?.map((school) => (
                <tr key={school.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-[#1A365D]">{school.name}</td>
                  <td className="p-3 text-slate-600">
                    {school.region} - {school.principalName}
                  </td>
                  <td className="p-3 text-slate-600">{school.educationalStage}</td>
                  <td className="p-3 font-mono font-bold text-purple-700">{school.teachersCount} معلم</td>
                  <td className="p-3 font-mono font-bold text-emerald-700">{school.studentsCount} طالب</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold text-[10px]">
                      {school.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
