export interface CanonicalLesson {
  lessonNumber: number;
  lessonTitle: string;
}

export interface CanonicalUnit {
  unitNumber: number;
  unitTitle: string;
  lessons: CanonicalLesson[];
}

export interface CanonicalBookStructure {
  id: string;
  country: string;
  subject: string;
  grade: string;
  bookName: string;
  term: "الجزء الأول" | "الجزء الثاني" | "دليل المعلم";
  totalUnits: number;
  totalLessons: number;
  units: CanonicalUnit[];
}

export const CANONICAL_CURRICULA: Record<string, CanonicalBookStructure> = {
  "yemen-9-arabic-part1": {
    id: "yemen-9-arabic-part1",
    country: "اليمن",
    subject: "اللغة العربية",
    grade: "الصف التاسع الأساسي",
    bookName: "لغتي العربية - الجزء الأول",
    term: "الجزء الأول",
    totalUnits: 12,
    totalLessons: 72,
    units: [
      {
        unitNumber: 1,
        unitTitle: "الوحدة الأولى: عباد الرحمن*قرآن الايات سورة الفرقان من 63-77*",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: تطبيقات نحوية عامة." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات إملائية عامة." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: "الوحدة الثانية: التشجير",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: المستثنى بـ (إلا)." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات على علامات الترقيم." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 3,
        unitTitle: "الوحدة الثالثة: الأمانة",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: المستثنى بغير وسوى وخلا وعدا." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات على همزتي الوصل والقطع." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 4,
        unitTitle: "الوحدة الرابعة: بر الوالدين",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: أسلوب النداء." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات على المدة." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 5,
        unitTitle: "الوحدة الخامسة: خُطبة لأبي بكر الصديق (رضي الله عنه)",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: تطبيقات نحوية." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات على الألف اللينة في الأسماء." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 6,
        unitTitle: "الوحدة السادسة: في المولد النبوي (شعر)",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: أسلوب الشرط." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات على الألف اللينة في الأفعال والحروف." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 7,
        unitTitle: "الوحدة السابعة: وادي مور",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: اقتران جواب الشرط بالفاء." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات على الحذف في أول الكلمة." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 8,
        unitTitle: "الوحدة الثامنة: أشعة الليزر في العلاج الطبي",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: تطبيقات نحوية عامة." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات على الحذف في وسط الكلمة." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 9,
        unitTitle: "الوحدة التاسعة: مدينة شبام (حضرموت)",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: أسلوب التعجب." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات على الحذف في آخر الكلمة." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 10,
        unitTitle: "الوحدة العاشرة: رعاية الأم الحامل",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: أسلوبا المدح والذم." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات إملائية على ما سبق." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 11,
        unitTitle: "الوحدة الحادية عشرة: الإمام علي بن أبي طالب (رضي الله عنه)",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: أسلوبا الإغراء والتحذير." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات على الألف اللينة في الأفعال والحروف." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 12,
        unitTitle: "الوحدة الثانية عشرة: من نوادر العرب وطرائفهم",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: تطبيقات نحوية على ما سبق دراسته." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات إملائية على ما سبق دراسته." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      }
    ]
  },
  "yemen-8-arabic-part1": {
    id: "yemen-8-arabic-part1",
    country: "اليمن",
    subject: "اللغة العربية",
    grade: "الصف الثامن الأساسي",
    bookName: "لغتي العربية - الجزء الأول",
    term: "الجزء الأول",
    totalUnits: 12,
    totalLessons: 72,
    units: [
      {
        unitNumber: 1,
        unitTitle: "الوحدة الأولى: من صفات المؤمن (قرآن سورة آل عمران الايات من 130-136)",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: تطبيقات نحوية عامة." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات إملائية عامة." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: "الوحدة الثانية: حب الوطن (شعر)",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: المضارع وإعرابه (نحو)." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات إملائية عامة." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 3,
        unitTitle: "الوحدة الثالثة: التنمية المائية",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: جزم الفعل المضارع (نحو)." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: المد في أول الكلمة ووسطها (إملاء)." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 4,
        unitTitle: "الوحدة الرابعة: آداب الحوار",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: الأفعال الخمسة (نحو)." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات إملائية على المد." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 5,
        unitTitle: "الوحدة الخامسة: سمك القرش",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: تطبيقات على الفعل المضارع والأفعال الخمسة (نحو)." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: الألف اللينة في الأسماء (إملاء)." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 6,
        unitTitle: "الوحدة السادسة: أيها العمال (شعر)",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: المبتدأ والخبر (نحو)." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات على الألف اللينة في الأسماء (إملاء)." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 7,
        unitTitle: "الوحدة السابعة: أخطار تهدد الزراعة",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: تقديم الخبر على المبتدأ وجوباً (نحو)." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: الألف اللينة في الأفعال والحروف (إملاء)." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 8,
        unitTitle: "الوحدة الثامنة: الثورة اليمنية (26 سبتمبر)",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: كان وأخواتها (نحو)." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات على الألف اللينة في الأفعال والحروف (إملاء)." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 9,
        unitTitle: "الوحدة التاسعة: جبلة",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: كاد وأخواتها (نحو)." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: تطبيقات على الألف اللينة في الأسماء والأفعال والحروف (إملاء)." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 10,
        unitTitle: "الوحدة العاشرة: الأمثال والحكم",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: إن وأخواتها (نحو)." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: حذف الألف من أول الكلمة (إملاء)." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 11,
        unitTitle: "الوحدة الحادية عشرة: عصر الفضاء",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: ظن وأخواتها (نحو)." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: الهمزة المتوسطة (إملاء)." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      },
      {
        unitNumber: 12,
        unitTitle: "الوحدة الثانية عشرة: ابن النفيس",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: الفهم والاستيعاب." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: تطبيقات على أنواع الخبر (نحو)." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: الحذف في آخر الكلمة (إملاء)." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم." }
        ]
      }
    ]
  },
  "yemen-7-arabic-part1": {
    id: "yemen-7-arabic-part1",
    country: "اليمن",
    subject: "اللغة العربية",
    grade: "الصف السابع الأساسي",
    bookName: "لغتي العربية - الجزء الأول",
    term: "الجزء الأول",
    totalUnits: 3,
    totalLessons: 18,
    units: [
      {
        unitNumber: 1,
        unitTitle: "الوحدة الأولى: الكلمة الطيبة وأثرها في النفوس",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: القراءة والمطالعة - أثر الكلمة الطيبة وحفظ اللسان" },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: النحو - أقسام الكلام (اسم، فعل، حرف)" },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: الإملاء - همزتا الوصل والقطع" },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط - خط النسخ والرقعة" },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير - كتابة فقرة عن حفظ اللسان" },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم والمراجعة" }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: "الوحدة الثانية: التعاون والتكافل الاجتماعي",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: القراءة والمطالعة - التعاون والتكافل في القرية اليمنية" },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: النحو - الجملة الاسمية والجملة الفعلية" },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: الإملاء - التاء المربوطة والتاء المفتوحة" },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط - تطبيقات خطية" },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير - التعبير الوصفي للحقول والمدرجات" },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم والمراجعة" }
        ]
      },
      {
        unitNumber: 3,
        unitTitle: "الوحدة الثالثة: بر الوالدين وحفظ اللسان",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: النصوص الأدبية - قصيدة في بر الوالدين" },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: النحو - الفاعل وعلامات رفعه" },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: الإملاء - تطبيقات إملائية عامة" },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: الخط - تحسين الخط العربي" },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: التعبير - رسالة إلى الوالدين" },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: التقويم والمراجعة" }
        ]
      }
    ]
  },
  "yemen-10-literature-part1": {
    id: "yemen-10-literature-part1",
    country: "اليمن",
    subject: "اللغة العربية",
    grade: "الصف الأول الثانوي",
    bookName: "أدب ونصوص وبلاغة",
    term: "الجزء الأول",
    totalUnits: 8,
    totalLessons: 28,
    units: [
      {
        unitNumber: 1,
        unitTitle: "الجزء الأول: الأدب والنصوص - 1 - التمهيد: الأدب",
        lessons: [
          { lessonNumber: 1, lessonTitle: "ما الأدب؟" },
          { lessonNumber: 2, lessonTitle: "تاريخ الأدب" },
          { lessonNumber: 3, lessonTitle: "العصور الأدبية" }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: "2 - العصر الجاهلي",
        lessons: [
          { lessonNumber: 1, lessonTitle: "مظاهر الحياة في العصر الجاهلي" },
          { lessonNumber: 2, lessonTitle: "الشعر في العصر الجاهلي" },
          { lessonNumber: 3, lessonTitle: "الشعراء الصعاليك" },
          { lessonNumber: 4, lessonTitle: "خصائص الشعر الجاهلي" }
        ]
      },
      {
        unitNumber: 3,
        unitTitle: "3 - النصوص الشعرية",
        lessons: [
          { lessonNumber: 1, lessonTitle: "وصف الجواد – امرؤ القيس" },
          { lessonNumber: 2, lessonTitle: "فلسفة ذاتية – طرفة بن العبد" },
          { lessonNumber: 3, lessonTitle: "شجاعة وإقدام – عنترة" },
          { lessonNumber: 4, lessonTitle: "صلح وسلم – زهير بن أبي سلمى" },
          { lessonNumber: 5, lessonTitle: "عزة وإباء – عمرو بن كلثوم" },
          { lessonNumber: 6, lessonTitle: "اعتذار – النابغة الذبياني" },
          { lessonNumber: 7, lessonTitle: "رثاء – الخنساء" },
          { lessonNumber: 8, lessonTitle: "رفض وتمرد – الشنفرى" }
        ]
      },
      {
        unitNumber: 4,
        unitTitle: "4 - النثر في العصر الجاهلي",
        lessons: [
          { lessonNumber: 1, lessonTitle: "عزاء – أكثم بن صيفي" },
          { lessonNumber: 2, lessonTitle: "وصية أم – أمامة بنت الحارث" }
        ]
      },
      {
        unitNumber: 5,
        unitTitle: "5 - عصر صدر الإسلام",
        lessons: [
          { lessonNumber: 1, lessonTitle: "موقف الإسلام من الشعر" },
          { lessonNumber: 2, lessonTitle: "من أثر القرآن في اللغة العربية" },
          { lessonNumber: 3, lessonTitle: "القرآن الكريم وأثره في الشعر والنثر" }
        ]
      },
      {
        unitNumber: 6,
        unitTitle: "6 - أولاً – النثر في صدر الإسلام",
        lessons: [
          { lessonNumber: 1, lessonTitle: "أ - نصوص قرآنية (تفكر وتوحيد، قيم أخلاقية)" },
          { lessonNumber: 2, lessonTitle: "ب - حديث شريف (دين الفطرة)" },
          { lessonNumber: 3, lessonTitle: "ج - في الجهاد (الإمام علي بن أبي طالب)" },
          { lessonNumber: 4, lessonTitle: "د - رسالة في القضاء (عمر بن الخطاب)" },
          { lessonNumber: 5, lessonTitle: "هـ - من الخطب (ثبات مجاهد) سعد بن معاذ" }
        ]
      },
      {
        unitNumber: 7,
        unitTitle: "قسم البلاغة - 1 - مقدمة في الفصاحة والبلاغة",
        lessons: [
          { lessonNumber: 1, lessonTitle: "مقدمة في الفصاحة والبلاغة" }
        ]
      },
      {
        unitNumber: 8,
        unitTitle: "قسم البلاغة - 2 - علم البيان",
        lessons: [
          { lessonNumber: 1, lessonTitle: "التشبيه وأقسامه" },
          { lessonNumber: 2, lessonTitle: "التشبيه التمثيلي" },
          { lessonNumber: 3, lessonTitle: "التشبيه الضمني" },
          { lessonNumber: 4, lessonTitle: "التشبيه المقلوب" },
          { lessonNumber: 5, lessonTitle: "بلاغة التشبيه" },
          { lessonNumber: 6, lessonTitle: "المجاز المرسل" },
          { lessonNumber: 7, lessonTitle: "الاستعارة وأقسامها" },
          { lessonNumber: 8, lessonTitle: "بلاغة الاستعارة" }
        ]
      }
    ]
  },
  "yemen-10-grammar-part1": {
    id: "yemen-10-grammar-part1",
    country: "اليمن",
    subject: "اللغة العربية",
    grade: "الصف الأول الثانوي",
    bookName: "النحو والصرف",
    term: "الجزء الأول",
    totalUnits: 1,
    totalLessons: 9,
    units: [
      {
        unitNumber: 1,
        unitTitle: "موضوعات كتاب النحو والصرف - الجزء الأول",
        lessons: [
          { lessonNumber: 1, lessonTitle: "1. تدريبات على ما سبق دراسته وتطبيقات." },
          { lessonNumber: 2, lessonTitle: "2. المبني والمعرب من الأفعال." },
          { lessonNumber: 3, lessonTitle: "3. من مبنيات الأسماء (أسماء الإشارة، الأسماء الموصولة)." },
          { lessonNumber: 4, lessonTitle: "4. علامات الإعراب الأصلية والفرعية." },
          { lessonNumber: 5, lessonTitle: "5. الأسماء الخمسة." },
          { lessonNumber: 6, lessonTitle: "6. المثنى والملحق به." },
          { lessonNumber: 7, lessonTitle: "7. جمع المذكر السالم والملحق به." },
          { lessonNumber: 8, lessonTitle: "8. جمع المؤنث السالم والملحق به." },
          { lessonNumber: 9, lessonTitle: "9. الممنوع من الصرف." }
        ]
      }
    ]
  },
  "yemen-10-reading-part1": {
    id: "yemen-10-reading-part1",
    country: "اليمن",
    subject: "اللغة العربية",
    grade: "الصف الأول الثانوي",
    bookName: "القراءة",
    term: "الجزء الأول",
    totalUnits: 1,
    totalLessons: 8,
    units: [
      {
        unitNumber: 1,
        unitTitle: "موضوعات كتاب القراءة - الجزء الأول",
        lessons: [
          { lessonNumber: 1, lessonTitle: "1. ويسبح الرعد بحمده." },
          { lessonNumber: 2, lessonTitle: "2. أسس الحياة الطيبة." },
          { lessonNumber: 3, lessonTitle: "3. من آداب السلوك (لابن المقفع)." },
          { lessonNumber: 4, lessonTitle: "4. قيمة الوقت." },
          { lessonNumber: 5, lessonTitle: "5. العربية صورة وجودنا." },
          { lessonNumber: 6, lessonTitle: "6. فضل العلم والعلماء." },
          { lessonNumber: 7, lessonTitle: "7. مؤسس علم الكيمياء." },
          { lessonNumber: 8, lessonTitle: "8. الاستعمار الصهيوني." }
        ]
      }
    ]
  },
  "yemen-11-literature-part1": {
    id: "yemen-11-literature-part1",
    country: "اليمن",
    subject: "اللغة العربية",
    grade: "الصف الثاني الثانوي",
    bookName: "الأدب والنصوص والبلاغة والعروض",
    term: "الجزء الأول",
    totalUnits: 7,
    totalLessons: 24,
    units: [
      {
        unitNumber: 1,
        unitTitle: "القسم الأول: الأدب والنصوص - 1 - العصر العباسي",
        lessons: [
          { lessonNumber: 1, lessonTitle: "العصر العباسي" }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: "2 - الشعر في العصر العباسي الأول",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الشعر في العصر العباسي الأول" }
        ]
      },
      {
        unitNumber: 3,
        unitTitle: "3 - نماذج من الشعر في هذا العصر",
        lessons: [
          { lessonNumber: 1, lessonTitle: "من شعر الحكمة – لبشار بن برد" },
          { lessonNumber: 2, lessonTitle: "في مدح آل البيت – لدعبل الخزاعي" },
          { lessonNumber: 3, lessonTitle: "فتح الفتوح – لأبي تمام" },
          { lessonNumber: 4, lessonTitle: "وصف الربيع – لأبي تمام" },
          { lessonNumber: 5, lessonTitle: "في الزهد – لأبي العتاهية" },
          { lessonNumber: 6, lessonTitle: "وصف إيوان كسرى – للبحتري" },
          { lessonNumber: 7, lessonTitle: "غربة وشوق – للعباس بن الأحنف" },
          { lessonNumber: 8, lessonTitle: "دمعة رثاء – لابن الرومي" }
        ]
      },
      {
        unitNumber: 4,
        unitTitle: "4 - النثر في العصر العباسي الأول",
        lessons: [
          { lessonNumber: 1, lessonTitle: "النثر في العصر العباسي الأول" }
        ]
      },
      {
        unitNumber: 5,
        unitTitle: "5 - نماذج من النثر في هذا العصر",
        lessons: [
          { lessonNumber: 1, lessonTitle: "خطبة – لأبي جعفر المنصور" },
          { lessonNumber: 2, lessonTitle: "وصف صديق – لابن المقفع" },
          { lessonNumber: 3, lessonTitle: "قاضي البصرة – للجاحظ" }
        ]
      },
      {
        unitNumber: 6,
        unitTitle: "القسم الثاني: البلاغة",
        lessons: [
          { lessonNumber: 1, lessonTitle: "مراجعة عامة على ما سبق دراسته" },
          { lessonNumber: 2, lessonTitle: "الخبر والإنشاء" },
          { lessonNumber: 3, lessonTitle: "الجملة الخبرية (أغراضها وأضربها)" },
          { lessonNumber: 4, lessonTitle: "أضرب الجملة الخبرية" },
          { lessonNumber: 5, lessonTitle: "الإنشاء الطلبي وغير الطلبي" },
          { lessonNumber: 6, lessonTitle: "أساليب الإنشاء الطلبي (الأمر، النهي، الاستفهام، التمني، النداء وأغراضها البلاغية)" }
        ]
      },
      {
        unitNumber: 7,
        unitTitle: "القسم الثالث: العروض",
        lessons: [
          { lessonNumber: 1, lessonTitle: "أسباب نشأته" },
          { lessonNumber: 2, lessonTitle: "تعريفه" },
          { lessonNumber: 3, lessonTitle: "مصطلحات عروضية" },
          { lessonNumber: 4, lessonTitle: "الكتابة العروضية" },
          { lessonNumber: 5, lessonTitle: "كيفية التقطيع" },
          { lessonNumber: 6, lessonTitle: "بحور الشعر (الطويل، الوافر)" }
        ]
      }
    ]
  },
  "yemen-11-grammar-part1": {
    id: "yemen-11-grammar-part1",
    country: "اليمن",
    subject: "اللغة العربية",
    grade: "الصف الثاني الثانوي",
    bookName: "النحو",
    term: "الجزء الأول",
    totalUnits: 1,
    totalLessons: 14,
    units: [
      {
        unitNumber: 1,
        unitTitle: "موضوعات كتاب النحو - الجزء الأول",
        lessons: [
          { lessonNumber: 1, lessonTitle: "الدرس الأول: تدريبات عامة على ما سبق." },
          { lessonNumber: 2, lessonTitle: "الدرس الثاني: الجملة الاسمية." },
          { lessonNumber: 3, lessonTitle: "الدرس الثالث: الترتيب بين المبتدأ والخبر." },
          { lessonNumber: 4, lessonTitle: "الدرس الرابع: حذف المبتدأ أو الخبر." },
          { lessonNumber: 5, lessonTitle: "الدرس الخامس: تطبيقات عامة على ما سبق." },
          { lessonNumber: 6, lessonTitle: "الدرس السادس: كان وأخواتها." },
          { lessonNumber: 7, lessonTitle: "الدرس السابع: الحروف المشبهة بـ (ليس)." },
          { lessonNumber: 8, lessonTitle: "الدرس الثامن: أفعال المقاربة والرجاء والشروع (كاد وأخواتها)." },
          { lessonNumber: 9, lessonTitle: "الدرس التاسع: تطبيقات عامة على ما سبق." },
          { lessonNumber: 10, lessonTitle: "الدرس العاشر: إن وأخواتها." },
          { lessonNumber: 11, lessonTitle: "الدرس الحادي عشر: كسر همزة (إن) وفتحها." },
          { lessonNumber: 12, lessonTitle: "الدرس الثاني عشر: لا النافية للجنس." },
          { lessonNumber: 13, lessonTitle: "الدرس الثالث عشر: ظن وأخواتها (أفعال القلوب والتحويل)." },
          { lessonNumber: 14, lessonTitle: "الدرس الرابع عشر: تدريبات عامة على ما سبق." }
        ]
      }
    ]
  },
  "yemen-11-reading-part1": {
    id: "yemen-11-reading-part1",
    country: "اليمن",
    subject: "اللغة العربية",
    grade: "الصف الثاني الثانوي",
    bookName: "القراءة",
    term: "الجزء الأول",
    totalUnits: 1,
    totalLessons: 8,
    units: [
      {
        unitNumber: 1,
        unitTitle: "موضوعات كتاب القراءة - الجزء الأول",
        lessons: [
          { lessonNumber: 1, lessonTitle: "1. الوحدة واجب ديني." },
          { lessonNumber: 2, lessonTitle: "2. أنت أنت الله." },
          { lessonNumber: 3, lessonTitle: "3. اصنع حياتك." },
          { lessonNumber: 4, lessonTitle: "4. العمل في ميزان الإسلام." },
          { lessonNumber: 5, lessonTitle: "5. معالم أثرية." },
          { lessonNumber: 6, lessonTitle: "6. البطولة." },
          { lessonNumber: 7, lessonTitle: "7. في عالم البحار." },
          { lessonNumber: 8, lessonTitle: "8. المبيدات وأضرارها بالبيئة." }
        ]
      }
    ]
  }
};

export function getCanonicalBook(bookId: string): CanonicalBookStructure | undefined {
  return CANONICAL_CURRICULA[bookId];
}

export function findCanonicalBook(country: string, subject: string, grade: string, term?: string, bookName?: string): CanonicalBookStructure | undefined {
  return Object.values(CANONICAL_CURRICULA).find(b => {
    const matchCountry = !country || b.country.includes(country) || country.includes(b.country);
    const matchSubject = !subject || b.subject.includes(subject) || subject.includes(b.subject);
    const matchGrade = !grade || b.grade.includes(grade) || grade.includes(b.grade)
      || (grade.includes("ثاني ثانوي") && b.grade.includes("الثاني الثانوي"))
      || (grade.includes("11") && b.grade.includes("الثاني الثانوي"))
      || (grade.includes("أول ثانوي") && b.grade.includes("الأول الثانوي"))
      || (grade.includes("10") && b.grade.includes("الأول الثانوي"))
      || (grade.includes("تاسع") && b.grade.includes("تاسع"))
      || (grade.includes("ثامن") && b.grade.includes("ثامن"))
      || (grade.includes("سابع") && b.grade.includes("سابع"));
    const matchTerm = !term || term === "الكل" || b.term.includes(term) || term.includes(b.term);
    const matchBookName = !bookName || b.bookName.includes(bookName) || bookName.includes(b.bookName);
    return matchCountry && matchSubject && matchGrade && matchTerm && matchBookName;
  });
}
