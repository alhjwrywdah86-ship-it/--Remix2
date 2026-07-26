export type Language = "ar" | "en" | string;

export interface TranslationDictionary {
  // App Titles
  appName: string;
  appSubtitle: string;
  
  // Roles
  roleTeacher: string;
  roleStudent: string;
  roleParent: string;
  roleSupervisor: string;
  roleAdmin: string;

  // Tabs & Navigation
  dashboard: string;
  lessonPlanner: string;
  curriculumLibrary: string;
  questionBank: string;
  worksheetGen: string;
  quizGen: string;
  presentationGen: string;
  essayGrader: string;
  activityDesigner: string;
  teacherLibrary: string;
  smartAnalytics: string;
  studentTracking: string;
  gradebook: string;
  attendance: string;
  assignmentsManager: string;
  virtualClassroom: string;
  messagingCenter: string;
  studentPortal: string;
  parentPortal: string;
  adminDashboard: string;
  teacherMarketplace: string;
  teacherCommunity: string;
  digitalCertificates: string;
  globalSearch: string;
  achievements: string;

  // Regional Curriculum
  regionalCurriculum: string;
  selectCountryCurriculum: string;
  activeCurriculumBadge: string;
  yemenCurriculum: string;
  saudiCurriculum: string;
  egyptCurriculum: string;
  uaeCurriculum: string;
  jordanCurriculum: string;
  generalArabCurriculum: string;

  // Actions & Buttons
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  search: string;
  generateAI: string;
  downloadPPTX: string;
  downloadPDF: string;
  print: string;
  share: string;
  close: string;
  viewDetails: string;
  syncNow: string;

  // Status & Offline Mode
  onlineStatus: string;
  offlineStatus: string;
  offlineNotice: string;
  syncedNotice: string;

  // Profile & Greetings
  welcomeTeacher: string;
  welcomeStudent: string;
  welcomeParent: string;
  userProfile: string;
  notifications: string;
  markAllRead: string;
  noNotifications: string;
  languageToggle: string;
}

export const translations: Record<string, TranslationDictionary> = {
  ar: {
    appName: "المعلم العربي المحترف",
    appSubtitle: "منصة تعليمية ذكية متكاملة للمعلمين والطلاب وأولياء الأمور",
    
    roleTeacher: "حساب المعلم",
    roleStudent: "مساحة الطالب",
    roleParent: "بوابة ولي الأمر",
    roleSupervisor: "الإدارة التعليمية",
    roleAdmin: "لوحة الإدارة",

    dashboard: "الرئيسية واللوحة الشاملة",
    lessonPlanner: "تحضير الدروس الذكي",
    curriculumLibrary: "المكتبة المنهجية المكتملة",
    questionBank: "بنك الأسئلة والمولد الذكي",
    worksheetGen: "مولد أوراق العمل",
    quizGen: "مصمم الاختبارات الذكية",
    presentationGen: "عروض العرض التقديمي",
    essayGrader: "المصحح الآلي للتعبير",
    activityDesigner: "مصمم الأنشطة الصفية",
    teacherLibrary: "مكتبة المعلم المحفوظة",
    smartAnalytics: "التحليلات ومؤشرات الأداء",
    studentTracking: "لوحة المتابعة والدرجات",
    gradebook: "كشف الدرجات الشامل",
    attendance: "سجل الحضور والغياب",
    assignmentsManager: "نظام الواجبات المدرسية",
    virtualClassroom: "الفصل الافتراضي المباشر",
    messagingCenter: "التواصل والإعلانات",
    studentPortal: "بوابة الطالب التفردية",
    parentPortal: "بوابة ولي الأمر",
    adminDashboard: "لوحة الإشراف الإداري",
    teacherMarketplace: "متجر المعلم للموارد",
    teacherCommunity: "مجتمع المعلمين والمربين",
    digitalCertificates: "الشهادات الرقمية",
    globalSearch: "البحث الذكي والشامل",
    achievements: "الأوسمة والإنجازات",

    regionalCurriculum: "المنهج الإقليمي النشط",
    selectCountryCurriculum: "اختر منهج الدولة المعتمد:",
    activeCurriculumBadge: "المنهج المعتمد للذكاء الاصطناعي",
    yemenCurriculum: "الجمهورية اليمنية",
    saudiCurriculum: "المملكة العربية السعودية",
    egyptCurriculum: "جمهورية مصر العربية",
    uaeCurriculum: "الإمارات العربية المتحدة",
    jordanCurriculum: "المملكة الأردنية الهاشمية",
    generalArabCurriculum: "المنهج العربي العام",

    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    search: "بحث",
    generateAI: "توليد بالذكاء الاصطناعي",
    downloadPPTX: "تنزيل عرض بوربوينت (PPTX)",
    downloadPDF: "طباعة / حفظ PDF",
    print: "طباعة",
    share: "مشاركة",
    close: "إغلاق",
    viewDetails: "عرض التفاصيل",
    syncNow: "مزامنة الآن",

    onlineStatus: "متصل بالإنترنت",
    offlineStatus: "وضع عدم الاتصال بالإنترنت (Offline)",
    offlineNotice: "أنت تعمل حالياً في وضع عدم الاتصال. تم حفظ جميع أعمالك محلياً وستتم المزامنة فور عودة الاتصال.",
    syncedNotice: "تمت مزامنة جميع البيانات بنجاح مع الخادم.",

    welcomeTeacher: "مرحباً بك، أستاذي الفاضل",
    welcomeStudent: "مرحباً بك في مساحتك التعليمية",
    welcomeParent: "مرحباً بك في بوابة ولي الأمر",
    userProfile: "الملف الشخصي",
    notifications: "الإشعارات والتنبيهات",
    markAllRead: "تحديد الكل كقروء",
    noNotifications: "لا توجد إشعارات جديدة",
    languageToggle: "English"
  },
  en: {
    appName: "Pro Arab Teacher LMS",
    appSubtitle: "Integrated Smart LMS Platform for Teachers, Students, Parents & Admins",
    
    roleTeacher: "Teacher Account",
    roleStudent: "Student Portal",
    roleParent: "Parent Portal",
    roleSupervisor: "Educational Admin",
    roleAdmin: "Admin Dashboard",

    dashboard: "Dashboard & Overview",
    lessonPlanner: "AI Lesson Planner",
    curriculumLibrary: "Curriculum Library",
    questionBank: "Question Bank & AI Generator",
    worksheetGen: "Worksheet Generator",
    quizGen: "Smart Quiz Designer",
    presentationGen: "Presentation Generator",
    essayGrader: "Auto Essay Grader",
    activityDesigner: "Class Activity Designer",
    teacherLibrary: "Saved Teacher Library",
    smartAnalytics: "Smart Analytics & KPI",
    studentTracking: "Student Tracking & Marks",
    gradebook: "Comprehensive Gradebook",
    attendance: "Attendance Records",
    assignmentsManager: "Assignments System",
    virtualClassroom: "Live Virtual Classroom",
    messagingCenter: "Messaging & Announcements",
    studentPortal: "Student Workspace",
    parentPortal: "Parent Portal",
    adminDashboard: "Admin Management Board",
    teacherMarketplace: "Teacher Resource Store",
    teacherCommunity: "Educators Community",
    digitalCertificates: "Digital Certificates",
    globalSearch: "Global Smart Search",
    achievements: "Badges & Achievements",

    regionalCurriculum: "Active Regional Curriculum",
    selectCountryCurriculum: "Select Ministry Curriculum:",
    activeCurriculumBadge: "AI Primary Curriculum Standard",
    yemenCurriculum: "Yemen Republic",
    saudiCurriculum: "Saudi Arabia",
    egyptCurriculum: "Egypt Republic",
    uaeCurriculum: "United Arab Emirates",
    jordanCurriculum: "Hashemite Kingdom of Jordan",
    generalArabCurriculum: "General Arab Standard",

    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    search: "Search",
    generateAI: "Generate with AI",
    downloadPPTX: "Download PowerPoint (PPTX)",
    downloadPDF: "Print / Save PDF",
    print: "Print",
    share: "Share",
    close: "Close",
    viewDetails: "View Details",
    syncNow: "Sync Now",

    onlineStatus: "Online",
    offlineStatus: "Offline Mode Active",
    offlineNotice: "You are currently working offline. All changes are saved locally and will auto-sync once online.",
    syncedNotice: "All data successfully synced to cloud server.",

    welcomeTeacher: "Welcome, Respected Teacher",
    welcomeStudent: "Welcome to your Student Workspace",
    welcomeParent: "Welcome to Parent Portal",
    userProfile: "User Profile",
    notifications: "Notifications",
    markAllRead: "Mark all as read",
    noNotifications: "No new notifications",
    languageToggle: "العربية"
  }
};

/**
 * Universal translation function with safe fallback to Arabic
 */
export function t(key: keyof TranslationDictionary, lang: Language = "ar"): string {
  const targetDict = translations[lang] || translations["ar"];
  return targetDict[key] || translations["ar"][key] || (key as string);
}

/**
 * Direction helper
 */
export function getDir(lang: Language = "ar"): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr";
}
