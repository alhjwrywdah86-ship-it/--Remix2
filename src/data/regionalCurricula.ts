export interface CurriculumStage {
  id: string;
  nameAr: string;
  nameEn: string;
  gradesAr: string[];
  gradesEn: string[];
}

export interface RegionalCurriculum {
  code: string; // e.g. YE, SA, EG, AE, JO, OM, QA, INT
  countryNameAr: string;
  countryNameEn: string;
  flag: string;
  ministryNameAr: string;
  ministryNameEn: string;
  stages: CurriculumStage[];
  subjectsAr: string[];
  subjectsEn: string[];
  examTypesAr: string[];
  examTypesEn: string[];
  aiPromptGuidelines: string;
}

export const REGIONAL_CURRICULA: RegionalCurriculum[] = [
  {
    code: "YE",
    countryNameAr: "الجمهورية اليمنية",
    countryNameEn: "Yemen",
    flag: "🇾🇪",
    ministryNameAr: "وزارة التربية والتعليم - اليمن",
    ministryNameEn: "Ministry of Education - Yemen",
    stages: [
      {
        id: "basic",
        nameAr: "المرحلة الأساسية (1 - 9)",
        nameEn: "Basic Stage (1 - 9)",
        gradesAr: [
          "الصف الأول الأساسي",
          "الصف الثاني الأساسي",
          "الصف الثالث الأساسي",
          "الصف الرابع الأساسي",
          "الصف الخامس الأساسي",
          "الصف السادس الأساسي",
          "الصف السابع الأساسي",
          "الصف الثامن الأساسي",
          "الصف التاسع الأساسي"
        ],
        gradesEn: [
          "Grade 1 Basic",
          "Grade 2 Basic",
          "Grade 3 Basic",
          "Grade 4 Basic",
          "Grade 5 Basic",
          "Grade 6 Basic",
          "Grade 7 Basic",
          "Grade 8 Basic",
          "Grade 9 Basic"
        ]
      },
      {
        id: "secondary",
        nameAr: "المرحلة الثانوية (10 - 12)",
        nameEn: "Secondary Stage (10 - 12)",
        gradesAr: [
          "الصف الأول الثانوي (العاشر)",
          "الصف الثاني الثانوي (العلمي)",
          "الصف الثاني الثانوي (الأدبي)",
          "الصف الثالث الثانوي (العلمي)",
          "الصف الثالث الثانوي (الأدبي)"
        ],
        gradesEn: [
          "Grade 10 Secondary",
          "Grade 11 Scientific",
          "Grade 11 Literary",
          "Grade 12 Scientific",
          "Grade 12 Literary"
        ]
      }
    ],
    subjectsAr: [
      "اللغة العربية (القراءة والنصوص والنحو)",
      "التربية الإسلامية (القرآن والحديث والفقه)",
      "العلوم العامة",
      "الرياضيات",
      "الدراسات الاجتماعية (الجغرافيا والتاريخ)",
      "اللغة الإنجليزية",
      "الفيزياء",
      "الكيمياء",
      "الأحياء",
      "الحاسوب وتكنولوجيا المعلومات"
    ],
    subjectsEn: [
      "Arabic Language (Grammar & Literature)",
      "Islamic Studies",
      "General Science",
      "Mathematics",
      "Social Studies (History & Geography)",
      "English Language",
      "Physics",
      "Chemistry",
      "Biology",
      "Computer Science & IT"
    ],
    examTypesAr: ["اختبارات شهرية", "اختبار منتصف الفصل", "اختبار نهاية الفصل", "الاختبار الوزاري العام (التاسع والثالث الثانوي)"],
    examTypesEn: ["Monthly Test", "Midterm Exam", "Final Semester Exam", "National Ministry Exam (Grades 9 & 12)"],
    aiPromptGuidelines: "التزم بتوزيع المنهج المدرسي الرسمي للجمهورية اليمنية، مع مراعاة المصطلحات التربوية اليمنية المعتمدة (الصفوف الأساسية 1-9، الثانوية العامة) والأسلوب التعليمي القائم على الأهداف السلوكية (المعرفية، الوجدانية، المهارية)."
  },
  {
    code: "SA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    flag: "🇸🇦",
    ministryNameAr: "وزارة التعليم - المملكة العربية السعودية",
    ministryNameEn: "Ministry of Education - Saudi Arabia",
    stages: [
      {
        id: "primary",
        nameAr: "المرحلة الابتدائية (1 - 6)",
        nameEn: "Primary Stage (1 - 6)",
        gradesAr: [
          "الصف الأول الابتدائي",
          "الصف الثاني الابتدائي",
          "الصف الثالث الابتدائي",
          "الصف الرابع الابتدائي",
          "الصف الخامس الابتدائي",
          "الصف السادس الابتدائي"
        ],
        gradesEn: ["Grade 1 Primary", "Grade 2 Primary", "Grade 3 Primary", "Grade 4 Primary", "Grade 5 Primary", "Grade 6 Primary"]
      },
      {
        id: "intermediate",
        nameAr: "المرحلة المتوسطة (1 - 3)",
        nameEn: "Intermediate Stage (1 - 3)",
        gradesAr: ["الصف الأول المتوسط", "الصف الثاني المتوسط", "الصف الثالث المتوسط"],
        gradesEn: ["Grade 1 Intermediate", "Grade 2 Intermediate", "Grade 3 Intermediate"]
      },
      {
        id: "secondary",
        nameAr: "المرحلة الثانوية (نظام المسارات 1 - 3)",
        nameEn: "Secondary Stage (Pathways 1 - 3)",
        gradesAr: ["السنة الأولى المشتركة", "مسار الصحة والحياة", "مسار الحاسب والهندسة", "المسار العام", "مسار إدارة الأعمال"],
        gradesEn: ["First Common Year", "Health & Life Pathway", "CS & Engineering Pathway", "General Pathway", "Business Admin Pathway"]
      }
    ],
    subjectsAr: [
      "لغتي الخالدة / لغتي الجميلة",
      "الدرسات الإسلامية (التوحيد، الفقه، الحديث، التفسير)",
      "العلوم",
      "الرياضيات",
      "الدراسات الاجتماعية",
      "اللغة الإنجليزية (English)",
      "التقنية الرقمية",
      "الفيزياء",
      "الكيمياء",
      "الأحياء"
    ],
    subjectsEn: [
      "My Arabic Language",
      "Islamic Studies",
      "Science",
      "Mathematics",
      "Social Studies",
      "English",
      "Digital Technology",
      "Physics",
      "Chemistry",
      "Biology"
    ],
    examTypesAr: ["تقويم مستمر", "اختبار فتري 1", "اختبار فتري 2", "اختبار نهائي للفصل الدراسي"],
    examTypesEn: ["Continuous Assessment", "Periodic Test 1", "Periodic Test 2", "Final Term Exam"],
    aiPromptGuidelines: "التزم بمعايير المنهج السعودي الحديث (نظام الفصول الدراسية الثلاثة ونظام المسارات الثانوية)، واستخدم مسميات المواد المعيارية لوزارة التعليم السعودية (لغتي الخالدة، الدراسات الإسلامية، التقنية الرقمية)."
  },
  {
    code: "EG",
    countryNameAr: "جمهورية مصر العربية",
    countryNameEn: "Egypt",
    flag: "🇪🇬",
    ministryNameAr: "وزارة التربية والتعليم والتعليم الفني - مصر",
    ministryNameEn: "Ministry of Education & Technical Education - Egypt",
    stages: [
      {
        id: "primary",
        nameAr: "المرحلة الابتدائية (1 - 6)",
        nameEn: "Primary Stage (1 - 6)",
        gradesAr: ["الصف الأول الابتدائي", "الصف الثاني الابتدائي", "الصف الثالث الابتدائي", "الصف الرابع الابتدائي", "الصف الخامس الابتدائي", "الصف السادس الابتدائي"],
        gradesEn: ["Grade 1 Primary", "Grade 2 Primary", "Grade 3 Primary", "Grade 4 Primary", "Grade 5 Primary", "Grade 6 Primary"]
      },
      {
        id: "preparatory",
        nameAr: "المرحلة الإعدادية (1 - 3)",
        nameEn: "Preparatory Stage (1 - 3)",
        gradesAr: ["الصف الأول الإعدادي", "الصف الثاني الإعدادي", "الصف الثالث الإعدادي (الشهادة الإعدادية)"],
        gradesEn: ["1st Prep", "2nd Prep", "3rd Prep (Certificate)"]
      },
      {
        id: "secondary",
        nameAr: "المرحلة الثانوية (الثانوية العامة 1 - 3)",
        nameEn: "General Secondary Stage (1 - 3)",
        gradesAr: ["الصف الأول الثانوي", "الصف الثاني الثانوي (علمي / أدبي)", "الصف الثالث الثانوي (الثانوية العامة)"],
        gradesEn: ["1st Secondary", "2nd Secondary", "3rd Secondary (Thanaweya Amma)"]
      }
    ],
    subjectsAr: [
      "اللغة العربية (النحو والبالغة والقراءة والقصة)",
      "التربية الدينية الإسلامية",
      "العلوم / الساينس",
      "الرياضيات / الماث",
      "الدراسات الاجتماعية (تاريخ وجغرافيا)",
      "اللغة الإنجليزية (English)",
      "الفيزياء",
      "الكيمياء",
      "الأحياء",
      "الفلسفة والمنطق / علم النفس"
    ],
    subjectsEn: [
      "Arabic Language",
      "Religious Education",
      "Science",
      "Mathematics",
      "Social Studies",
      "English Language",
      "Physics",
      "Chemistry",
      "Biology",
      "Philosophy & Psychology"
    ],
    examTypesAr: ["اختبار شهر أكتوبر", "اختبار شهر نوفمبر", "امتحان منتصف العام", "امتحان نهاية العام (البوكليت / البابل شيت)"],
    examTypesEn: ["October Monthly Test", "November Monthly Test", "Midyear Exam", "Final Year Exam (Bubble Sheet)"],
    aiPromptGuidelines: "التزم بمنهج وزارة التربية والتعليم المصرية (المطور ومقررات الثانوية العامة)، واعتمد صياغة نواتج التعلم والأسئلة بأسلوب التفكير النقدي ونظام البابل شيت الحديث."
  },
  {
    code: "AE",
    countryNameAr: "الإمارات العربية المتحدة",
    countryNameEn: "UAE",
    flag: "🇦🇪",
    ministryNameAr: "وزارة التربية والتعليم - الإمارات",
    ministryNameEn: "Ministry of Education - UAE",
    stages: [
      {
        id: "cycle1",
        nameAr: "الحلقة الأولى (1 - 4)",
        nameEn: "Cycle 1 (Grades 1 - 4)",
        gradesAr: ["الصف الأول", "الصف الثاني", "الصف الثالث", "الصف الرابع"],
        gradesEn: ["Grade 1", "Grade 2", "Grade 3", "Grade 4"]
      },
      {
        id: "cycle2",
        nameAr: "الحلقة الثانية (5 - 8)",
        nameEn: "Cycle 2 (Grades 5 - 8)",
        gradesAr: ["الصف الخامس", "الصف السادس", "الصف السابع", "الصف الثامن"],
        gradesEn: ["Grade 5", "Grade 6", "Grade 7", "Grade 8"]
      },
      {
        id: "cycle3",
        nameAr: "الحلقة الثالثة (9 - 12 - العام والمتقدم والإليت)",
        nameEn: "Cycle 3 (Grades 9 - 12 - General, Advanced, Elite)",
        gradesAr: ["الصف التاسع", "الصف العاشر", "الصف الحادي عشر", "الصف الثاني عشر (عام/متقدم)"],
        gradesEn: ["Grade 9", "Grade 10", "Grade 11", "Grade 12 (General/Advanced)"]
      }
    ],
    subjectsAr: ["اللغة العربية", "التربية الإسلامية", "العلوم", "الرياضيات", "الدراسات الاجتماعية والتربية الوطنية", "اللغة الإنجليزية", "الكيمياء", "الفيزياء", "الأحياء", "التصميم والتكنولوجيا"],
    subjectsEn: ["Arabic Language", "Islamic Education", "Science", "Mathematics", "Social Studies & Moral Ed", "English", "Chemistry", "Physics", "Biology", "Design & Technology"],
    examTypesAr: ["التقويم المستمر", "امتحانات الفصل الأول", "امتحانات الفصل الثاني", "امتحانات الفصل الثالث (سويفت اسيس)"],
    examTypesEn: ["Continuous Assessment", "Term 1 Exam", "Term 2 Exam", "Term 3 Exam (SwiftAssess)"],
    aiPromptGuidelines: "التزم بإطار المناهج الوطنية لوزارة التربية والتعليم بالإمارات (نظام الحلقات 1، 2، 3 والمسارات العام والمتقدم)، ودمج مفاهيم الابتكار والتفكير الاستشرافي وسلسلة المنهاج الوطني."
  },
  {
    code: "JO",
    countryNameAr: "المملكة الأردنية الهاشمية",
    countryNameEn: "Jordan",
    flag: "🇯🇴",
    ministryNameAr: "وزارة التربية والتعليم - الأردن",
    ministryNameEn: "Ministry of Education - Jordan",
    stages: [
      {
        id: "primary",
        nameAr: "المرحلة الأساسية (1 - 10)",
        nameEn: "Basic Stage (1 - 10)",
        gradesAr: ["الصف الأول الأساسي", "الصف الرابع الأساسي", "الصف السابع الأساسي", "الصف العاشر الأساسي"],
        gradesEn: ["Grade 1 Basic", "Grade 4 Basic", "Grade 7 Basic", "Grade 10 Basic"]
      },
      {
        id: "secondary",
        nameAr: "المرحلة الثانوية (التوجيهي 11 - 12)",
        nameEn: "Secondary Stage (Tawjihi 11 - 12)",
        gradesAr: ["الصف الأول الثانوي (11)", "الصف الثاني الثانوي (التوجيهي - العلمي/الأدبي/BTEC)"],
        gradesEn: ["Grade 11 Secondary", "Grade 12 Tawjihi (Sci/Lit/BTEC)"]
      }
    ],
    subjectsAr: ["اللغة العربية (مهارات الاتصال)", "التربية الإسلامية", "العلوم", "الرياضيات", "التاريخ والجغرافيا والتربية الوطنية", "اللغة الإنجليزية", "الفيزياء", "الكيمياء", "الأحياء"],
    subjectsEn: ["Arabic Communication Skills", "Islamic Studies", "Science", "Mathematics", "History & Geography", "English Language", "Physics", "Chemistry", "Biology"],
    examTypesAr: ["الاختبار الأول", "الاختبار الثاني", "التقويم المعتمد على الأداء", "امتحان شهادة الدراسة الثانوية العامة (التوجيهي)"],
    examTypesEn: ["First Assessment", "Second Assessment", "Performance-based Assessment", "Tawjihi National Exam"],
    aiPromptGuidelines: "التزم بالمنهاج الأردني الصادر عن وزارة التربية والتعليم (مناهج كولينز في العلوم والرياضيات ومهارات الاتصال للتوجيهي)، مع مراعاة المعايير الوطنية للتقويم."
  },
  {
    code: "INT",
    countryNameAr: "المنهج العربي العام والدولي",
    countryNameEn: "General Arab / International Curriculum",
    flag: "🌐",
    ministryNameAr: "المنهج العربي الشامل للتعليم العام والدولي",
    ministryNameEn: "Comprehensive Arab & International Curriculum Standards",
    stages: [
      {
        id: "primary",
        nameAr: "المرحلة الابتدائية / الأساسية الأولى",
        nameEn: "Primary / Early Stage",
        gradesAr: ["الصف الأول", "الصف الثاني", "الصف الثالث", "الصف الرابع", "الصف الخامس", "الصف السادس"],
        gradesEn: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"]
      },
      {
        id: "middle",
        nameAr: "المرحلة المتوسطة / الإعدادية",
        nameEn: "Middle / Preparatory Stage",
        gradesAr: ["الصف السابع", "الصف الثامن", "الصف التاسع"],
        gradesEn: ["Grade 7", "Grade 8", "Grade 9"]
      },
      {
        id: "high",
        nameAr: "المرحلة الثانوية / التوجيهي / البكالوريا",
        nameEn: "High School / Baccalaureate Stage",
        gradesAr: ["الصف العاشر", "الصف الحادي عشر", "الصف الثاني عشر / البكالوريا"],
        gradesEn: ["Grade 10", "Grade 11", "Grade 12 / Baccalaureate"]
      }
    ],
    subjectsAr: ["اللغة العربية والأدب", "التربية الإسلامية والثقافة", "العلوم العامة", "الرياضيات", "الدراسات الاجتماعية والتاريخ", "اللغة الإنجليزية", "الفيزياء", "الكيمياء", "الأحياء", "تكنولوجيا المعلومات"],
    subjectsEn: ["Arabic Language & Literature", "Islamic Studies & Culture", "General Science", "Mathematics", "Social Studies & History", "English Language", "Physics", "Chemistry", "Biology", "Information Technology"],
    examTypesAr: ["تقويم تكويني", "اختبار مرحلي", "اختبار نهائي شامل"],
    examTypesEn: ["Formative Assessment", "Progress Test", "Final Comprehensive Exam"],
    aiPromptGuidelines: "استخدم معايير الجودة التربوية العامة للمناهج العربية المعاصرة بأسلوب واضح وشامل يغطي الأهداف التعليمية المعرفية والمهارية."
  }
];

export function getCurriculumByCode(code: string): RegionalCurriculum {
  return REGIONAL_CURRICULA.find((c) => c.code === code) || REGIONAL_CURRICULA[0]; // Yemen default
}

export function getDefaultCountryCode(): string {
  const saved = typeof window !== "undefined" ? localStorage.getItem("app_regional_curriculum") : null;
  return saved || "YE";
}

export function setSavedCountryCode(code: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("app_regional_curriculum", code);
  }
}
