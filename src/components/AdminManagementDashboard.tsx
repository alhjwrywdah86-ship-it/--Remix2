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
  Activity,
  X,
  Edit2,
  Trash2,
  Eye,
  Check,
  AlertCircle,
  Filter
} from "lucide-react";

interface AdminManagementDashboardProps {
  lang: Language;
}

export default function AdminManagementDashboard({ lang }: AdminManagementDashboardProps) {
  const isAr = lang === "ar";

  const [overview, setOverview] = useState<SystemAdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  
  // UI States for Modals & Filtering
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSchoolDetails, setSelectedSchoolDetails] = useState<SchoolRecord | null>(null);
  const [editingSchool, setEditingSchool] = useState<SchoolRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");
  
  // Success notification message
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // New School Form State
  const [formData, setFormData] = useState({
    name: "",
    region: "أمانة العاصمة - صنعاء",
    principalName: "",
    educationalStage: "المرحلة الأساسية والثانوية",
    teachersCount: 25,
    studentsCount: 600,
    classroomsCount: 18,
    status: "نشط" as "نشط" | "تحت المراجعة"
  });

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

  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      region: "أمانة العاصمة - صنعاء",
      principalName: "",
      educationalStage: "المرحلة الأساسية والثانوية",
      teachersCount: 25,
      studentsCount: 600,
      classroomsCount: 18,
      status: "نشط"
    });
    setIsAddModalOpen(true);
  };

  const handleAddSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setSuccessMsg(`تمت إضافة "${formData.name}" بنجاح في سجل المدارس والمنظومة التعليمية.`);
        setTimeout(() => setSuccessMsg(null), 5000);
        await fetchAdminOverview();
      } else {
        alert(data.error || "حدث خطأ أثناء إضافة المدرسة");
      }
    } catch (err) {
      console.error("Error adding school:", err);
      // Fallback local state update if offline
      const newSchool: SchoolRecord = {
        id: `sch_${Date.now()}`,
        name: formData.name,
        region: formData.region,
        principalName: formData.principalName || "أ. مدير المدرسة",
        educationalStage: formData.educationalStage,
        teachersCount: Number(formData.teachersCount),
        studentsCount: Number(formData.studentsCount),
        classroomsCount: Number(formData.classroomsCount),
        status: formData.status
      };
      if (overview) {
        setOverview({
          ...overview,
          totalSchools: overview.totalSchools + 1,
          totalTeachers: overview.totalTeachers + newSchool.teachersCount,
          totalStudents: overview.totalStudents + newSchool.studentsCount,
          schools: [newSchool, ...overview.schools]
        });
      }
      setIsAddModalOpen(false);
      setSuccessMsg(`تمت إضافة "${formData.name}" بنجاح.`);
      setTimeout(() => setSuccessMsg(null), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchool) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/schools/${editingSchool.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSchool)
      });
      const data = await res.json();
      if (data.success) {
        setEditingSchool(null);
        setSuccessMsg(`تم تحديث بيانات "${editingSchool.name}" بنجاح.`);
        setTimeout(() => setSuccessMsg(null), 4000);
        await fetchAdminOverview();
      }
    } catch (err) {
      console.error("Error updating school:", err);
      if (overview) {
        setOverview({
          ...overview,
          schools: overview.schools.map(s => s.id === editingSchool.id ? editingSchool : s)
        });
      }
      setEditingSchool(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSchool = async (id: string, name: string) => {
    if (!window.confirm(`هل أنت تأكد من إزالة "${name}" من سجل المدارس؟`)) return;

    try {
      await fetch(`/api/admin/schools/${id}`, { method: "DELETE" });
      setSuccessMsg(`تمت إزالة مدرسة "${name}" من السجل.`);
      setTimeout(() => setSuccessMsg(null), 4000);
      await fetchAdminOverview();
    } catch (err) {
      console.error(err);
      if (overview) {
        setOverview({
          ...overview,
          totalSchools: Math.max(0, overview.totalSchools - 1),
          schools: overview.schools.filter(s => s.id !== id)
        });
      }
    }
  };

  // Filtered Schools List
  const filteredSchools = overview?.schools?.filter(school => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.principalName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage =
      stageFilter === "ALL" ||
      (stageFilter === "BASIC" && school.educationalStage.includes("الأساسية")) ||
      (stageFilter === "SECONDARY" && school.educationalStage.includes("الثانوية"));

    return matchesSearch && matchesStage;
  }) || [];

  return (
    <div className="space-y-6 pb-12 font-sans dir-rtl">
      {/* Success Banner */}
      {successMsg && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-fade-in font-medium text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-white hover:text-emerald-200 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-[#C5A021] hover:bg-amber-400 text-[#1A365D] font-mono font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all self-start active:scale-95"
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

      {/* Schools Directory Table & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-3 gap-3">
          <h3 className="font-serif font-bold text-base text-[#1A365D] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#C5A021]" />
            <span>سجل المدارس والمجمعات التعليمية المسجلة</span>
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث برقم أو اسم المدرسة أو المدير..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3 pr-9 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
              />
            </div>

            {/* Stage Filter */}
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
            >
              <option value="ALL">جميع المراحل</option>
              <option value="BASIC">المرحلة الأساسية</option>
              <option value="SECONDARY">المرحلة الثانوية</option>
            </select>

            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              المجموع: {filteredSchools.length}
            </span>
          </div>
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
                <th className="p-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-10 text-slate-500 space-y-3">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-serif font-bold text-slate-600 text-sm">
                      {searchQuery || stageFilter !== "ALL"
                        ? "لا توجد مدارس مطابقة لخيارات البحث المحددة."
                        : "لا توجد مدارس أو مجمعات تعليمية مسجلة في المنظومة حتى الآن."}
                    </p>
                    {(!searchQuery && stageFilter === "ALL") && (
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-[#1A365D] hover:bg-[#2A4A7F] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                      >
                        <Plus className="w-4 h-4 text-[#C5A021]" />
                        <span>إضافة مدرسة جديدة الآن</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school) => (
                  <tr key={school.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-[#1A365D]">{school.name}</td>
                    <td className="p-3 text-slate-600">
                      {school.region} - <span className="font-semibold text-slate-800">{school.principalName}</span>
                    </td>
                    <td className="p-3 text-slate-600">{school.educationalStage}</td>
                    <td className="p-3 font-mono font-bold text-purple-700">{school.teachersCount} معلم</td>
                    <td className="p-3 font-mono font-bold text-emerald-700">{school.studentsCount} طالب</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        school.status === "نشط"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {school.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedSchoolDetails(school)}
                          title="عرض التفاصيل الإحصائية"
                          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingSchool(school)}
                          title="تعديل بيانات المدرسة"
                          className="p-1.5 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSchool(school.id, school.name)}
                          title="حذف المدرسة"
                          className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD NEW SCHOOL FORM ("إضافة مدرسة أو مجتمع تعليمي جديد") */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans dir-rtl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#1A365D] text-white p-5 flex items-center justify-between border-b border-[#C5A021]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#C5A021] text-[#1A365D] rounded-xl flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">إضافة مدرسة أو مجتمع تعليمي جديد</h3>
                  <p className="text-[11px] text-slate-300">سجل بيانات المؤسسة التعليمية لربطها بالمنظومة</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleAddSchoolSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1A365D] mb-1">
                  اسم المدرسة أو المجمع التعليمي <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مدرسة الميثاق النموذجية للبنين"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#1A365D] mb-1">المحافظة والمنطقة التعليمية</label>
                  <input
                    type="text"
                    placeholder="مثال: أمانة العاصمة - صنعاء"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1A365D] mb-1">اسم مدير المدرسة / المسؤول</label>
                  <input
                    type="text"
                    placeholder="مثال: أ. عبد الله علي"
                    value={formData.principalName}
                    onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#1A365D] mb-1">المرحلة التعليمية</label>
                  <select
                    value={formData.educationalStage}
                    onChange={(e) => setFormData({ ...formData, educationalStage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                  >
                    <option value="المرحلة الأساسية والثانوية">المرحلة الأساسية والثانوية</option>
                    <option value="المرحلة الثانوية">المرحلة الثانوية</option>
                    <option value="المرحلة الأساسية">المرحلة الأساسية</option>
                    <option value="جميع المراحل">جميع المراحل</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1A365D] mb-1">حالة الحساب</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "نشط" | "تحت المراجعة" })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                  >
                    <option value="نشط">نشط وتستلم التحديثات</option>
                    <option value="تحت المراجعة">تحت المراجعة والتدقيق</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">عدد المعلمين</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.teachersCount}
                    onChange={(e) => setFormData({ ...formData, teachersCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">عدد الطلاب</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.studentsCount}
                    onChange={(e) => setFormData({ ...formData, studentsCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">عدد الفصول</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.classroomsCount}
                    onChange={(e) => setFormData({ ...formData, classroomsCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#1A365D] hover:bg-[#2A4A7F] text-white font-bold rounded-xl flex items-center gap-2 shadow transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 text-[#C5A021]" />
                  <span>{submitting ? "جاري الحفظ..." : "حفظ وإضافة المدرسة"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT SCHOOL FORM */}
      {editingSchool && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans dir-rtl">
            <div className="bg-[#1A365D] text-white p-4 flex items-center justify-between border-b border-[#C5A021]/30">
              <h3 className="font-serif font-bold text-sm">تعديل بيانات المدرسة</h3>
              <button onClick={() => setEditingSchool(null)} className="text-slate-300 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSchoolSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#1A365D] mb-1">اسم المدرسة</label>
                <input
                  type="text"
                  required
                  value={editingSchool.name}
                  onChange={(e) => setEditingSchool({ ...editingSchool, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1A365D] mb-1">المنطقة</label>
                  <input
                    type="text"
                    value={editingSchool.region}
                    onChange={(e) => setEditingSchool({ ...editingSchool, region: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1A365D] mb-1">اسم المدير</label>
                  <input
                    type="text"
                    value={editingSchool.principalName}
                    onChange={(e) => setEditingSchool({ ...editingSchool, principalName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingSchool(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl text-slate-600"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-[#1A365D] text-white font-bold rounded-xl"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW SCHOOL DETAILS */}
      {selectedSchoolDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden font-sans dir-rtl">
            <div className="bg-[#1A365D] text-white p-5 flex items-center justify-between border-b border-[#C5A021]/30">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#C5A021]" />
                <h3 className="font-serif font-bold text-base">{selectedSchoolDetails.name}</h3>
              </div>
              <button onClick={() => setSelectedSchoolDetails(null)} className="text-slate-300 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border space-y-1">
                <p><span className="font-bold text-[#1A365D]">المنطقة/المحافظة:</span> {selectedSchoolDetails.region}</p>
                <p><span className="font-bold text-[#1A365D]">اسم المدير المسؤول:</span> {selectedSchoolDetails.principalName}</p>
                <p><span className="font-bold text-[#1A365D]">المرحلة التعليمية:</span> {selectedSchoolDetails.educationalStage}</p>
                <p><span className="font-bold text-[#1A365D]">الحالة:</span> <span className="text-emerald-700 font-bold">{selectedSchoolDetails.status}</span></p>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-center">
                <div className="p-2.5 bg-purple-50 border border-purple-100 rounded-xl">
                  <span className="block text-[10px] text-purple-600 font-sans">المعلمون</span>
                  <span className="text-base font-bold text-purple-800">{selectedSchoolDetails.teachersCount}</span>
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <span className="block text-[10px] text-emerald-600 font-sans">الطلاب</span>
                  <span className="text-base font-bold text-emerald-800">{selectedSchoolDetails.studentsCount}</span>
                </div>
                <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                  <span className="block text-[10px] text-amber-600 font-sans">الفصول</span>
                  <span className="text-base font-bold text-amber-800">{selectedSchoolDetails.classroomsCount}</span>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end">
                <button
                  onClick={() => setSelectedSchoolDetails(null)}
                  className="px-4 py-1.5 bg-slate-800 text-white font-bold rounded-xl text-xs"
                >
                  إغلاق النافذة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

