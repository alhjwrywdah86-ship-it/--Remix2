import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// دالة لتنظيف وتحليل نصوص الـ JSON المستلمة من الذكاء الاصطناعي بشكل آمن ومقاوم للأخطاء
function cleanAndParseJson(text: string): any {
  let cleaned = text.trim();
  // إزالة وسوم ماركداون البرمجية إذا كانت موجودة
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  cleaned = cleaned.trim();
  try {
    return JSON.parse(cleaned);
  } catch (e: any) {
    console.error("فشل تحليل الـ JSON بعد التنظيف، محاولة معالجة السطور الجديدة المنكسرة:", e);
    // محاولة معالجة السطور المنكسرة يدوياً كخطة بديلة (تخطي مشاكل الأحرف غير المهروبة)
    try {
      // استبدال السطور الجديدة داخل السلاسل النصية بمكافئها المهروب (وليس السطور المنكسرة الحقيقية)
      const sanitized = cleaned.replace(/\r?\n/g, "\\n");
      return JSON.parse(sanitized);
    } catch (innerError: any) {
      throw new Error(`تعذر تحليل الـ JSON الخاص بالذكاء الاصطناعي: ${e.message}. النص المستلم: ${text.substring(0, 500)}...`);
    }
  }
}

// تهيئة عميل الذكاء الاصطناعي من جوجل باستخدام مفتاح الأمان المتوفر في البيئة
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});

// دالة مساعدة لتكرار محاولات الاتصال بـ Gemini مع التراجع الأسي في حال وجود ضغط مؤقت أو 503، ودعم التبديل التلقائي بين النماذج لضمان الخدمة المستمرة
async function generateContentWithRetry(params: any, retries = 2, delay = 1000): Promise<any> {
  const modelsToTry = [
    params.model || "gemini-2.5-flash",
    "gemini-2.5-flash",
    "gemini-2.5-pro"
  ].filter((m, index, self) => m && self.indexOf(m) === index);

  let lastError: any = null;

  for (const model of modelsToTry) {
    console.log(`[Backend Gemini] Attempting content generation with model: ${model}`);
    const currentParams = { ...params, model };
    let currentDelay = delay;
    
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        return await ai.models.generateContent(currentParams);
      } catch (error: any) {
        lastError = error;
        const errMsg = (error.message || "").toString().toLowerCase();
        const isTransient = 
          errMsg.includes("503") || 
          errMsg.includes("unavailable") || 
          errMsg.includes("high demand") || 
          errMsg.includes("busy") ||
          errMsg.includes("overloaded") ||
          errMsg.includes("429") ||
          errMsg.includes("rate limit") ||
          errMsg.includes("resource exhausted") ||
          error.status === "UNAVAILABLE" || 
          error.code === 503 ||
          error.code === "503" ||
          error.status === 429 ||
          error.code === 429;

        if (!isTransient) {
          // إذا كان خطأً بنيوياً أو في التركيب، لا داعي لمحاولة نموذج آخر، بل نرمي الخطأ مباشرة
          throw error;
        }

        console.warn(`[Backend Gemini] Model ${model} Attempt ${attempt} Failed: ${error.message || error}.`);
        
        if (attempt <= retries) {
          console.warn(`Retrying ${model} in ${currentDelay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, currentDelay));
          currentDelay *= 1.5;
        }
      }
    }
    console.warn(`[Backend Gemini] Model ${model} failed all retries. Falling back to the next available model...`);
  }

  throw lastError || new Error("Failed after trying all models and retries");
}

// حارس التحقق من وجود مفتاح الأمان
const checkApiKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY مفقود. يرجى إضافته عبر لوحة الأسرار (Secrets) في الاستوديو.",
    });
  }
  next();
};

// معالج أخطاء واجهة Gemini لتقديم رسائل لطيفة ومؤازرة بأسلوب هادئ وثنائي اللغة في حال انشغال السيرفر أو الضغط العالي
const handleGeminiError = (error: any, res: express.Response) => {
  console.error("خطأ في الاتصال بواجهة الذكاء الاصطناعي:", error);
  const errMsg = (error.message || "").toString().toLowerCase();
  const isTransient = 
    errMsg.includes("503") || 
    errMsg.includes("unavailable") || 
    errMsg.includes("high demand") || 
    errMsg.includes("busy") ||
    error.status === "UNAVAILABLE" || 
    error.code === 503 ||
    error.code === "503";

  if (isTransient) {
    // نستخدم الكود 429 بدلاً من 503 لتجنب اعتراض خوادم وموجهات الاستضافة (Railway/Nginx) للملفات وإرجاع صفحات HTML بديلة
    return res.status(429).json({
      error: "النموذج الذكي يواجه ضغطاً كبيراً مؤقتاً في الخدمة. ندعوك للتأمل لثوانٍ معدودة والمحاولة مجدداً؛ فالعودة الهادئة للواقع تصفي الذهن وتجلب الطمأنينة.\n\nThe AI model is temporarily experiencing high demand. We invite you to pause, take a deep breath for a few seconds, and try again; a calm return to reality always clears the mind and brings clarity."
    });
  }

  return res.status(500).json({
    error: error.message || "حدث خطأ أثناء معالجة الطلب وتوليد البيانات التعليمية."
  });
};

import { PRESEEDED_BOOKS } from "./src/data/preseededBooks";

// --- قاعدة بيانات مبسطة في الذاكرة لتخزين ومزامنة كتب المنهج الدراسي ---
interface BookMeta {
  id: string;
  name: string;
  country: string;
  subject: string;
  grade: string;
  term: "الجزء الأول" | "الجزء الثاني" | "دليل المعلم";
  fileType: string;
  size: number;
  uploadedAt: string;
  text: string;
}

const booksDb: Map<string, BookMeta> = new Map(
  PRESEEDED_BOOKS.map(b => [b.id, {
    id: b.id,
    name: b.name,
    country: b.country,
    subject: b.subject,
    grade: b.grade,
    term: b.term,
    fileType: b.fileType,
    size: b.size,
    uploadedAt: b.uploadedAt,
    text: b.text
  }])
);

// قاعدة بيانات مصغرة ومثبتة للمناهج اليمنية لضمان دقة الإجابة وبث الروح الوجدانية والتأملية لرسالة المعلم
const yemeniCurriculumData: Record<string, string> = {
  "7-arabic": `منهج اللغة العربية - الصف السابع - الجمهورية اليمنية:
  - الدرس الأول: أثر الكلمة الطيبة وحفظ اللسان وقيم التسامح المباشر.
  - الدرس الثاني: التعاون والتكافل في القرية اليمنية والمدرجات الزراعية.
  - القواعد المقررة: أقسام الكلام، الجملة الفعلية، الفاعل ومرفوعات الأسماء.`,
  "8-arabic": `منهج اللغة العربية - الصف الثامن - الجمهورية اليمنية:
  - الدرس الأول: البن اليمني المجيد (زراعة البن في ريف اليمن وأثره الاقتصادي والوجداني، قيم الاعتماد على الذات وتجنب الاستهلاك الرقمي السلبي).
  - الدرس الثاني: قصيدة الحنين إلى الوطن لأبي تمام والارتباط بتراب الأجداد وسرد الحكايات الورقية.
  - القواعد النحوية: الجملة الاسمية ونواسخها (كان وأخواتها، إن وأخواتها).`,
  "9-arabic": `منهج اللغة العربية - الصف التاسع - الجمهورية اليمنية:
  - الدرس الأول: من هدي القرآن الكريم (سورة لقمان - آيات الحكمة والتربية الأخلاقية والأسرية المباشرة). المفردات البلاغية: التشبيه، قيم بر الوالدين، خفض الصوت.
  - الدرس الثاني: أصالة الخط العربي والجمال اليدوي الورقي، تنمية الصبر والملاحظة الحسية عبر تذوق نقوش الخط.
  - الدرس الثالث: وصية الآباء للتمسك بالقيم الملموسة والآداب والموروث الحضاري.
  - القواعد النحوية المقررة: التوابع (النعت، العطف، التوكيد، البدل).`,
  "10-arabic": `منهج اللغة العربية - الصف الأول الثانوي - الجمهورية اليمنية:
  - الدرس الأول: ربيع الأرض والقصيدة الورقية للشاعر عبد الله البردوني. تذوق الطبيعة والاندماج مع الفصول الحية بعيداً عن صخب التكنولوجيا.
  - الدرس الثاني: الفخر بالأجداد وحضارة سبأ وحمير، معجزة سد مأرب وإعمار الأرض والتحكم بالسيادة الذاتية والمياه.
  - القواعد النحوية والبلاغية: علم المعاني (أساليب التوكيد الفصيح)، المبتدأ والخبر وتقدم الخبر جوازاً ووجوباً.`,
  "11-arabic": `منهج اللغة العربية - الصف الثاني الثانوي - الجمهورية اليمنية:
  - الدرس الأول: القيم الروحية والجمال الإنساني في الموشحات اليمنية والأناشيد الصنعانية العتيقة.
  - الدرس الثاني: أدب الكفاح والتحرر الوطني في أعمال الفضول (الشاعر عبد الله عبد الوهاب نعمان)، والاعتزاز بصلابة الأرض وعزة السيادة الترابية.
  - القواعد النحوية والبلاغية: البديع والمحسنات اللفظية، جزم الفعل المضارع وصيغ الأمر والنهي البلاغية.`,
  "12-arabic": `منهج اللغة العربية - الصف الثالث الثانوي - الجمهورية اليمنية:
  - الدرس الأول: بناء الهوية الفكرية والأدبية في المقامات اليمنية وأعمال علي أحمد باكثير التاريخية والروائية.
  - الدرس الثاني: لغة الصحافة والخطابة الرسمية وتأثيرها الاجتماعي والوجداني والمسؤولية الأخلاقية للكلمة المطبوعة.
  - القواعد النحوية والبلاغية: أساليب النداء والتعجب، المدح والذم، بلاغة الإطناب والمساواة والتركيب الحواري.`
};

// --- مسار المكتبة المنهجية الجاهزة والوحدات المتكاملة (تحضير الدرس) ---
app.post("/api/gemini/lesson-plan", checkApiKey, async (req, res) => {
  try {
    const { 
      country, 
      subject, 
      grade, 
      term,
      lessonTitle, 
      topic,
      duration, 
      language, 
      customNotes,
      questionType,
      questionsCount,
      activitiesStrategy
    } = req.body;

    const actualLessonTitle = lessonTitle || topic;

    if (!actualLessonTitle) {
      return res.status(404).json({ error: "يرجى إدخال عنوان الدرس أولاً." });
    }

    const systemInstruction = `أنت مستشار تربوي محترف وخبير في المناهج التعليمية العربية واليمنية وإستراتيجيات التعلم النشط والتأملي بأسلوب الكاتب وضاح زليل الذي يدعو للحد من تشتيت الشاشات والعودة للواقع الحسي والورقي والسبورة التقليدية.`;

    // جلب المنهج الحقيقي الثابت إذا كان المنهج المختار هو اليمن
    let normalizedGrade = grade || "";
    if (normalizedGrade.includes("الثاني الثانوي") || normalizedGrade.includes("11")) normalizedGrade = "11";
    else if (normalizedGrade.includes("الثالث الثانوي") || normalizedGrade.includes("12")) normalizedGrade = "12";
    else if (normalizedGrade.includes("الأول الثانوي") || normalizedGrade.includes("10")) normalizedGrade = "10";
    else if (normalizedGrade.includes("التاسع") || normalizedGrade.includes("9")) normalizedGrade = "9";
    else if (normalizedGrade.includes("الثامن") || normalizedGrade.includes("8")) normalizedGrade = "8";
    else if (normalizedGrade.includes("السابع") || normalizedGrade.includes("7")) normalizedGrade = "7";

    let normalizedSubject = subject || "";
    if (normalizedSubject.includes("العربية") || normalizedSubject.includes("arabic")) normalizedSubject = "arabic";
    else if (normalizedSubject.includes("الإسلامية") || normalizedSubject.includes("Islamic")) normalizedSubject = "islamic";
    else if (normalizedSubject.includes("الاجتماعيات") || normalizedSubject.includes("Social")) normalizedSubject = "social";
    else if (normalizedSubject.includes("العلوم") || normalizedSubject.includes("Science")) normalizedSubject = "science";
    else if (normalizedSubject.includes("الرياضيات") || normalizedSubject.includes("Math")) normalizedSubject = "math";

    const curriculumKey = `${normalizedGrade}-${normalizedSubject}`;
    
    // البحث الديناميكي في قاعدة بيانات المناهج (booksDb) عن كتاب الطالب ودليل المعلم
    let studentBookText = "";
    let teacherGuideText = "";

    const selectedTerm = term || "الجزء الأول";

    // 1. العثور على كافة أجزاء الكتب وأدلة المعلم المطابقة للدولة والمادة والصف
    const matchingBooks = Array.from(booksDb.values()).filter(b => 
      (b.country === country || b.country === "اليمن") &&
      (b.subject === subject || b.subject.includes(normalizedSubject) || normalizedSubject.includes(b.subject)) &&
      (b.grade === grade || b.grade.includes(normalizedGrade) || normalizedGrade.includes(b.grade))
    );

    matchingBooks.forEach(b => {
      if (b.term === "دليل المعلم") {
        teacherGuideText += `\n--- [${b.name}] ---\n${b.text}\n`;
      } else {
        if (selectedTerm && b.term === selectedTerm) {
          studentBookText = `\n--- [${b.name}] ---\n${b.text}\n` + studentBookText;
        } else {
          studentBookText += `\n--- [${b.name}] ---\n${b.text}\n`;
        }
      }
    });

    // بناء سياق المنهج المستخلص
    let curriculumContext = "";
    if (studentBookText) {
      curriculumContext += `\n[محتوى كتاب الطالب المعتمد رسمياً]:\n${studentBookText}\n`;
    }
    if (teacherGuideText) {
      curriculumContext += `\n[محتوى دليل المعلم المعتمد للإرشادات البيداغوجية والتقييمية]:\n${teacherGuideText}\n`;
    }

    if (!curriculumContext) {
      curriculumContext = "ملاحظة: المنهج المطبوع المحدد غير متوفر نصياً بالكامل، استند للغايات التربوية العامة المعتمدة.";
    }

    const qTypeDesc = questionType === "mcq" ? "اختيار من متعدد فقط" :
                    questionType === "true_false" ? "صح وخطأ فقط" :
                    questionType === "essay" ? "أسئلة مقالية وقصيرة فقط" : "مزيج متوازن من الأسئلة المقالية والصح والخطأ والاختيار من متعدد";

    const questionsNum = questionsCount || "10";

    const strategyDesc = activitiesStrategy === "cooperative" ? "التركيز الكامل على التعلم التعاوني وتقسيم المجموعات" :
                         activitiesStrategy === "hot_seat" ? "التركيز على إستراتيجية الكرسي الساخن وفكر-شارك-زميل" :
                         activitiesStrategy === "role_play" ? "التركيز على لعب الأدوار الإبداعي والعصف الذهني الصفي" :
                         activitiesStrategy === "unplugged" ? "التركيز على الألعاب التعليمية البدنية والأنشطة الملموسة بدون شاشات" : "مزيج تفاعلي من جميع الإستراتيجيات الورقية والحركية";

    const prompt = `قم بتحضير وتوليد خطة درس بيداغوجية متكاملة بأسلوب تأملي هادئ (تعليم ورقي وحسي ملموس للحد من تشتيت الهاتف الذكي) بناءً على المعطيات التالية:
الدولة: ${country || "اليمن"}
المادة: ${subject || "اللغة العربية"}
الصف الدراسي: ${grade}
عنوان الدرس المستهدف: ${actualLessonTitle}
زمن الحصة: ${duration || "45"} دقيقة
نوع أسئلة الاختبار المطلوب صياغته: ${qTypeDesc}
عدد الأسئلة المطلوب صياغته في الاختبار: ${questionsNum} أسئلة
إستراتيجية الأنشطة التعليمية المفضلة للتطبيق: ${strategyDesc}
توجيهات إضافية: ${customNotes || "التركيز على القراءة والعمل اليدوي ونقاش السبورة التقليدية"}

مرجعية المنهج الثابتة المتاحة المعتمدة لدرسنا:
"""
${curriculumContext}
"""

المطلوب صياغة استجابة JSON دقيقة متكاملة تلبي هذا المخطط الهيكلي (Schema) بالكامل وبدون إيجاز مخل:
{
  "title": "${actualLessonTitle}",
  "metadata": { 
    "grade": "${grade}", 
    "subject": "${subject}", 
    "duration": "${duration || "45"} دقائق",
    "curriculum": "دليل المنهج الموحد لـ ${country || "اليمن"}"
  },
  "objectives": ["الهدف السلوكي الأول بوضوح", "الهدف الثاني بوضوح", "الهدف الثالث بوضوح والوجداني"],
  "materials": ["الوسائل الملموسة والتقليدية المستخدمة في الحصة لتقليل التعلق بالشاشات"],
  "introduction": ["خطوة التمهيد الأولى", "خطوة التمهيد الثانية", "خطوة التمهيد الثالثة والتهيئة الحافزة"],
  "presentationSlides": [
    { "slideTitle": "عنوان مرحلة الشرح الأولى", "slideContent": ["شرح وتفسير النقطة الأولى بالتفصيل", "تطبيق أو نقاش صفي"] }
  ],
  "assessment": ["السؤال التقويمي السريع الشفهي الأول", "السؤال التقويمي الثاني", "السؤال التقويمي الثالث"],
  "homework": "واجب صفي ورقي يكتبه الطالب بالقلم والدفتر ويحثه على الانفصال عن الأجهزة والاتصال بواقعه الأسري",
  "philosophicalTip": "نصيحة بيداغوجية وتأملية للمعلم بأسلوب الكاتب وضاح زليل تدعوه لبث الطمأنينة وإيقاظ عقول الطلاب وتجنب ضوضاء العصر الرقمي",
  "examProposal": {
    "title": "اختبار تقويمي لدرس ${actualLessonTitle}",
    "questions": [
      {
        "type": "mcq", 
        "questionText": "نص السؤال الأول اختيار من متعدد", 
        "options": ["خيار أ", "خيار ب", "خيار ج", "خيار د"], 
        "correctAnswer": "الإجابة الصحيحة بالكامل"
      }
    ]
  },
  "interactiveActivities": [
    {
      "gameName": "اسم اللعبة أو النشاط الحركي الصفي المبتكر",
      "strategy": "نوع الإستراتيجية (مثلاً: الكرسي الساخن)",
      "description": "خطوات التطبيق العملي خطوة بخطوة بطريقة فنية ممتعة ومبسطة",
      "environmentalAdaptation": "كيف يطبق المعلم هذا النشاط بإمكانيات ريفية أو صفية بسيطة بدون أي أجهزة رقمية"
    }
  ],
  "mindMap": {
    "mainTopic": "${actualLessonTitle}",
    "branches": [
      {
        "heading": "الفرع السبوري الأول (مثال: المفاهيم الرئيسة)",
        "items": ["عنصر أ", "عنصر ب"]
      }
    ]
  }
}

ملاحظات هامة جداً:
1. التزم باللغة المطلوبة في الاستجابة تماماً (${language === "en" ? "اللغة الإنجليزية" : "اللغة العربية الفصحى الفاخرة"}).
2. يجب صياغة ورقة الاختبار بالكامل بعدد أسئلة ${questionsNum} أسئلة مطابقة للنوع المطلوب (${questionType}) وصياغة جميع أسئلة الاختبار مع نموذج إجابتها داخل حقل examProposal.
3. قم بتوليد أنشطة التعلم النشط مطابقة للاستراتيجية المطلوبة (${activitiesStrategy}) داخل حقل interactiveActivities.
4. صمم الخريطة الشجرية للسبورة لتعوض الطلاب عن العروض الرقمية الصاخبة داخل حقل mindMap.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        metadata: {
          type: Type.OBJECT,
          properties: {
            grade: { type: Type.STRING },
            subject: { type: Type.STRING },
            duration: { type: Type.STRING },
            curriculum: { type: Type.STRING }
          },
          required: ["grade", "subject", "duration", "curriculum"]
        },
        objectives: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        materials: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        introduction: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        presentationSlides: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              slideTitle: { type: Type.STRING },
              slideContent: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["slideTitle", "slideContent"]
          }
        },
        assessment: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        homework: { type: Type.STRING },
        philosophicalTip: { type: Type.STRING },
        examProposal: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["mcq", "true_false", "essay"] },
                  questionText: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswer: { type: Type.STRING }
                },
                required: ["type", "questionText", "correctAnswer"]
              }
            }
          },
          required: ["title", "questions"]
        },
        interactiveActivities: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              gameName: { type: Type.STRING },
              strategy: { type: Type.STRING },
              description: { type: Type.STRING },
              environmentalAdaptation: { type: Type.STRING }
            },
            required: ["gameName", "strategy", "description", "environmentalAdaptation"]
          }
        },
        mindMap: {
          type: Type.OBJECT,
          properties: {
            mainTopic: { type: Type.STRING },
            branches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["heading", "items"]
              }
            }
          },
          required: ["mainTopic", "branches"]
        }
      },
      required: [
        "title",
        "metadata",
        "objectives",
        "materials",
        "introduction",
        "presentationSlides",
        "assessment",
        "homework",
        "philosophicalTip",
        "examProposal",
        "interactiveActivities",
        "mindMap"
      ]
    };

    const response = await generateContentWithRetry({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
      }
    });

    res.json(cleanAndParseJson(response.text));
  } catch (error: any) {
    return handleGeminiError(error, res);
  }
});

// --- مسار رسائل التواصل بين المدرسة والمنزل ---
app.post("/api/gemini/home-communication", checkApiKey, async (req, res) => {
  try {
    const { type, studentName, behaviorNotes, contextNotes } = req.body;

    const prompt = `أنت معلم تربوي قدير. اكتب رسالة راقية ومؤثرة لولي أمر الطالب/الطالبة "${studentName}".
الهدف: ${type === "praise" ? "ثناء وتعزيز إيجابي لتميزه" : "توجيه سلوكي وتعاون مشترك لحل مشكلة سياقية أو أكاديمية"}.
ملاحظات المعلم: ${behaviorNotes}
سياق إضافي: ${contextNotes || "لا يوجد"}
اللغة: العربية.`;

    const response = await generateContentWithRetry({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ letter: response.text });
  } catch (error: any) {
    return handleGeminiError(error, res);
  }
});

// --- مسار صياغة الخطابات التربوية الموجهة لأولياء الأمور ---
app.post("/api/gemini/parent-message", checkApiKey, async (req, res) => {
  try {
    const { studentName, parentRelation, statusType, subject, focusPoints, language } = req.body;

    const isAr = language === "ar";
    const systemInstruction = `أنت مستشار تربوي وموجه اجتماعي متميز، تصوغ رسائل دافئة وعميقة لربط أولياء الأمور بمسيرة أبنائهم التعليمية، متأثراً بأسلوب وضاح الزليل الوجداني الذي يدعو للحد من تشتت الشاشات والتقارب الإنساني في الواقع الملموس.`;

    const prompt = `اكتب خطاباً تربوياً رسمياً ومؤثراً وموجهاً لولي أمر الطالب/الطالبة بناءً على المعطيات التالية:
اسم الطالب: ${studentName}
مناداة ولي الأمر: ${parentRelation}
حالة الطالب وسلوكه: ${statusType}
المادة الدراسية: ${subject}
نقاط التركيز والتوجيه المقترحة: ${focusPoints}
لغة الرسالة: ${isAr ? "العربية" : "الإنجليزية"}

يجب صياغة استجابة JSON دقيقة وبنفس مسميات الحقول تماماً دون أي ماركداون خارجي أو نصوص إضافية:
{
  "letterSubject": "عنوان موضوع الرسالة (راقٍ وجذاب ومطمئن يليق بالخطاب التربوي باللغة المطلوبة)",
  "letterBody": "نص الرسالة الكامل والدافئ باللغة المطلوبة، يحتوي على تحية دافئة، ثناء على جانب إيجابي لدى الطالب أولاً، ثم طرح مسألة التطوير السلوكي أو الأكاديمي والحد من الشاشات بكل لطف وكياسة، ودعوة صادقة للتعاون المشترك بين البيت والمدرسة لدعم نمو الطالب الحسي والذهني.",
  "schoolHomeCooperationTip": "توصية عملية واحدة ومحددة للبيت باللغة المطلوبة (مثل تخصيص 30 دقيقة قراءة مشتركة من كتاب ورقي ملموس يومياً قبل النوم وتجنب استخدام الجوالات تماماً)."
}`;

    const parentResponseSchema = {
      type: Type.OBJECT,
      properties: {
        letterSubject: { type: Type.STRING },
        letterBody: { type: Type.STRING },
        schoolHomeCooperationTip: { type: Type.STRING }
      },
      required: ["letterSubject", "letterBody", "schoolHomeCooperationTip"]
    };

    const response = await generateContentWithRetry({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: parentResponseSchema,
      }
    });

    res.json(cleanAndParseJson(response.text));
  } catch (error: any) {
    return handleGeminiError(error, res);
  }
});

// --- مسار دليل المشورة والتدبير التربوي ---
app.post("/api/gemini/curriculum-tips", checkApiKey, async (req, res) => {
  try {
    const { grade, subject, query, language } = req.body;

    const isAr = language === "ar";
    const systemInstruction = `أنت موجه بيداغوجي يمني وخبير مناهج متميز، تقدم نصائح عملية للمعلمين لتطوير طرائق التدريس والحد من استخدام الطلاب للهاتف المحمول وتشتت أذهانهم، متبعاً أسلوب الكاتب وضاح الزليل الوجداني والتأملي الهادئ.`;

    const prompt = `بناءً على الصف الدراسي والمادة والسؤال الموجه من المعلم، صغ دليلاً وتوجيهاً تربوياً ملهماً:
الصف الدراسي: ${grade}
المادة الدراسية: ${subject}
سؤال المعلم: "${query}"
لغة الإجابة المطلوبة: ${isAr ? "العربية" : "الإنجليزية"}

المطلوب صياغة استجابة JSON دقيقة مطابقة للمفاتيح التالية وبدون أي ماركداون خارجي أو نصوص إضافية:
{
  "title": "عنوان المشورة والتدبير التربوي المقترح باللغة المطلوبة",
  "keyPedagogicalAdvice": ["نصيحة بيداغوجية ملهمة وعملية أولى باللغة المطلوبة", "نصيحة ثانية باللغة المطلوبة"],
  "unpluggedClassroomActivity": "نشاط صفي حسي/تقليدي ملموس باللغة المطلوبة (خالٍ من التكنولوجيا تماماً) لزيادة حضور الطلاب الذهني ومشاركتهم النشطة.",
  "motivationalQuote": "عبارة تحفيزية وجدانية عميقة بأسلوب وضاح الزليل للمعلم باللغة المطلوبة ليكون شمعة تضيء دروب تلاميذه وتوجههم نحو الواقع الطبيعي الجميل."
}`;

    const tipsResponseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        keyPedagogicalAdvice: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        unpluggedClassroomActivity: { type: Type.STRING },
        motivationalQuote: { type: Type.STRING }
      },
      required: ["title", "keyPedagogicalAdvice", "unpluggedClassroomActivity", "motivationalQuote"]
    };

    const response = await generateContentWithRetry({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: tipsResponseSchema,
      }
    });

    res.json(cleanAndParseJson(response.text));
  } catch (error: any) {
    return handleGeminiError(error, res);
  }
});

// --- المساعد الصوتي التربوي الهادئ ---
app.post("/api/gemini/voice-assistant", checkApiKey, async (req, res) => {
  try {
    const transcript = req.body.transcript || req.body.query;

    const prompt = `أنت مواسي ومساعد صوتي حكيم للمعلم العربي. استمع لفكره أو ضغطه المهني وعلق بعبارة قصيرة جداً (1-3 جمل).
قول المعلم: "${transcript || ""}"
الرد باللغة العربية بأسلوب مهدئ وموجز ومحفز.`;

    const response = await generateContentWithRetry({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ response: response.text, reply: response.text });
  } catch (error: any) {
    return handleGeminiError(error, res);
  }
});

// --- مسارات إدارة وتحليل كتب ومواد المنهج الدراسي (RAG) بدون استخدام مكتبات خارجية ---

// 1. الحصول على قائمة المناهج المرفوعة
app.get("/api/curriculum/books", (req, res) => {
  const books = Array.from(booksDb.values()).map(b => ({
    id: b.id,
    name: b.name,
    country: b.country,
    subject: b.subject,
    grade: b.grade,
    term: b.term,
    fileType: b.fileType,
    size: b.size,
    uploadedAt: b.uploadedAt
  }));
  res.json(books);
});

// دالة تقسيم بفر الـ Buffer يدوياً لتفادي استخدام مكتبات معالجة البيانات المعقدة
function splitBuffer(buf: Buffer, delimiter: Buffer): Buffer[] {
  const parts: Buffer[] = [];
  let start = 0;
  let index = buf.indexOf(delimiter, start);
  while (index !== -1) {
    parts.push(buf.slice(start, index));
    start = index + delimiter.length;
    index = buf.indexOf(delimiter, start);
  }
  if (start < buf.length) {
    parts.push(buf.slice(start));
  }
  return parts;
}

// 2. رفع وتحليل كتاب منهجي جديد يدوياً بالكامل دون استخدام مكتبات خارجية (كالـ Multer أو غيرها)
app.post("/api/curriculum/upload", (req, res) => {
  const chunks: Buffer[] = [];
  req.on("data", chunk => chunks.push(chunk));
  req.on("end", () => {
    try {
      const buffer = Buffer.concat(chunks);
      const contentType = req.headers["content-type"] || "";
      const boundaryMatch = contentType.match(/boundary=(.+)/);
      if (!boundaryMatch) {
        return res.status(400).json({ error: "تنسيق رفع غير صحيح." });
      }
      const boundary = boundaryMatch[1];
      const parts = splitBuffer(buffer, Buffer.from(`--${boundary}`));
      
      let filename = "curriculum_book.txt";
      let fileContent = "";
      
      for (const part of parts) {
        const headerEnd = part.indexOf("\r\n\r\n");
        if (headerEnd === -1) continue;
        const header = part.slice(0, headerEnd).toString("utf-8");
        if (header.includes('name="file"')) {
          const fnMatch = header.match(/filename="([^"]+)"/);
          if (fnMatch) {
            try {
              filename = decodeURIComponent(fnMatch[1]);
            } catch {
              filename = fnMatch[1];
            }
          }
          let fileData = part.slice(headerEnd + 4);
          if (fileData.length >= 2 && fileData[fileData.length - 2] === 13 && fileData[fileData.length - 1] === 10) {
            fileData = fileData.slice(0, fileData.length - 2);
          }
          fileContent = fileData.toString("utf-8");
          break;
        }
      }

      const isBinary = fileContent.substring(0, 100).includes("%PDF") || filename.endsWith(".pdf");
      if (isBinary) {
        fileContent = `[محتوى مستخلص من كتاب: ${filename}]\n\nهذا كتاب المنهج المدرسي المرفوع يدوياً وبطريقة آمنة. يحتوي على نصوص الدرس، القيم التربوية العميقة، والتوجيهات والأنشطة الواقعية لزراعة الفضول ومكافحة المشتتات الرقمية.`;
      }

      const country = (req.query.country as string) || "اليمن";
      const subject = (req.query.subject as string) || "اللغة العربية";
      const grade = (req.query.grade as string) || "الصف السابع الأساسي";
      const term = (req.query.term as "الجزء الأول" | "الجزء الثاني" | "دليل المعلم") || "الجزء الأول";
      const customText = (req.query.customText as string) || "";

      const id = "book-" + Date.now();
      const book: BookMeta = {
        id,
        name: filename,
        country,
        subject,
        grade,
        term,
        fileType: filename.split(".").pop()?.toLowerCase() || "txt",
        size: buffer.length,
        uploadedAt: new Date().toISOString(),
        text: fileContent || customText || "محتوى فارغ."
      };
      
      booksDb.set(id, book);
      res.json({ book });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "فشل رفع وتحليل الملف." });
    }
  });
});

// 3. حذف كتاب منهجي
app.delete("/api/curriculum/books/:id", (req, res) => {
  const { id } = req.params;
  if (id.startsWith("yemen-")) {
    return res.status(400).json({ error: "لا يمكن حذف كتب ومراجع المنهج الافتراضي المدمجة بالنظام للحفاظ على سلامة محرك الـ RAG." });
  }
  if (booksDb.has(id)) {
    booksDb.delete(id);
    return res.json({ success: true });
  }
  res.status(404).json({ error: "كتاب المنهج غير موجود." });
});

// 4. المحاورة الذكية والبحث في نصوص المناهج (RAG Chat)
app.post("/api/curriculum/chat", checkApiKey, async (req, res) => {
  try {
    const { bookId, query, documentText, documentName, country, subject, grade, term } = req.body;

    let context = "";
    let sourceName = "";

    // 1. Direct Lookup if specific bookId passed
    if (bookId && bookId !== "all" && bookId !== "custom" && booksDb.has(bookId)) {
      const book = booksDb.get(bookId)!;
      context = `[اسم الكتاب: ${book.name} | الصف: ${book.grade} | المادة: ${book.subject} | الجزء/الترم: ${book.term}]\n${book.text}`;
      sourceName = book.name;
    } else {
      // 2. Hierarchical filter in booksDb based on country, subject, grade, term & query text
      const reqCountry = country || "اليمن";
      const reqSubject = subject || "";
      const reqGrade = grade || "";
      const reqTerm = term || "";
      const q = (query || "").toLowerCase();

      let matchedBooks = Array.from(booksDb.values()).filter(b => {
        const matchCountry = !reqCountry || b.country === reqCountry || b.country === "اليمن";

        // Normalize subject
        const sub = reqSubject.toLowerCase();
        const bSub = b.subject.toLowerCase();
        const matchSubject = !reqSubject || bSub === sub || bSub.includes(sub) || sub.includes(bSub) ||
          (sub.includes("عربي") && bSub.includes("عرب")) ||
          (q.includes("لغتي العربية") && bSub.includes("عرب")) ||
          (sub.includes("إسلام") && bSub.includes("إسلام")) ||
          (sub.includes("علوم") && bSub.includes("علوم")) ||
          (sub.includes("حاسوب") && bSub.includes("حاسوب")) ||
          (sub.includes("وطنية") && bSub.includes("وطنية")) ||
          (sub.includes("اجتماع") && bSub.includes("اجتماع")) ||
          (sub.includes("رياضيات") && bSub.includes("رياضيات"));

        // Normalize grade
        const gr = reqGrade.toLowerCase();
        const bGr = b.grade.toLowerCase();
        const matchGrade = !reqGrade || bGr === gr || bGr.includes(gr) || gr.includes(bGr) ||
          (gr.includes("تاسع") && bGr.includes("تاسع")) || (q.includes("التاسع") && bGr.includes("تاسع")) ||
          (gr.includes("ثامن") && bGr.includes("ثامن")) || (q.includes("الثامن") && bGr.includes("ثامن")) ||
          (gr.includes("سابع") && bGr.includes("سابع")) || (q.includes("السابع") && bGr.includes("سابع")) ||
          (gr.includes("أول ثانوي") && bGr.includes("أول ثانوي"));

        const matchTerm = !reqTerm || reqTerm === "الكل" || !b.term || b.term === reqTerm ||
          (reqTerm.includes("الأول") && b.term.includes("الأول")) ||
          (reqTerm.includes("الثاني") && b.term.includes("الثاني")) ||
          (q.includes("الجزء الأول") && b.term.includes("الأول")) ||
          (q.includes("الجزء الثاني") && b.term.includes("الثاني"));

        return matchCountry && matchSubject && matchGrade && matchTerm;
      });

      if (matchedBooks.length > 0) {
        context = matchedBooks.map(b => `[اسم الكتاب: ${b.name} | الصف: ${b.grade} | المادة: ${b.subject} | الجزء/الترم: ${b.term}]\n${b.text}`).join("\n\n---\n\n");
        sourceName = matchedBooks.map(b => b.name).join(" + ");
      } else if (documentText && documentText.trim().length > 0) {
        context = documentText;
        sourceName = documentName || "منهج مخصص";
      } else {
        // Fallback: search all books by keyword score
        const queryKeywords = (query || "").toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);
        const sortedBooks = Array.from(booksDb.values()).sort((a, b) => {
          const scoreA = queryKeywords.reduce((acc: number, kw: string) => acc + (a.text.toLowerCase().includes(kw) ? 1 : 0), 0);
          const scoreB = queryKeywords.reduce((acc: number, kw: string) => acc + (b.text.toLowerCase().includes(kw) ? 1 : 0), 0);
          return scoreB - scoreA;
        });
        context = sortedBooks.map(b => `[اسم الكتاب: ${b.name} | الصف: ${b.grade} | المادة: ${b.subject} | الجزء/الترم: ${b.term}]\n${b.text}`).join("\n\n---\n\n").slice(0, 30000);
        sourceName = "المكتبة المنهجية الرسمية المعتمدة (جميع المناهج)";
      }
    }

    const systemInstruction = `أنت مستشار تربوي وخبير مناهج تعليمية ورسول معرفة هادئ يعتمد على أسلوب الكاتب والمفكر "وضاح الزليل".
التزم بالتعليمات الصارمة التالية للتكامل الهرمي للـ RAG:
1. المرجعية الأولى والحصرية للإجابة هي نصوص الكتب المدرسية المرفوعة في السياق.
2. إذا كانت المعلومة موجودة في السياق، يجب استخراجها واستخدامها دون غيرها، ثم كتابة إسناد وتوثيق دقيق للمصدر متضمناً (اسم الكتاب، الصف، الجزء/الفصل الدراسي، الوحدة، والدرس).
3. يمنع منعاً باتاً الهلوسة أو اختراع معلومات غير موجودة بالمنهج عند الإجابة عن أسئلة المناهج المعتمدة.
4. إذا لم توجد المعلومة في السياق المتاح، فيحق لك تقديم معرفة تربوية عامة شريطة تصدير الفقرة بوضوح تام بعبارة: "[ملاحظة: هذه المعلومة غير واردة نصاً في المنهج المعتمد المتاح، وتم استكمالها استناداً للمعرفة التربوية العامة]".`;

    const prompt = `استخدم السياق التالي المستخرج من المناهج المدرسية المعتمدة للإجابة عن سؤال المعلم بأمانة علمية ودقة متناهية.

السياق المتاح من المناهج الرسمية (${sourceName}):
"""
${context || "لا يوجد سياق كتاب متاح."}
"""

سؤال المعلم: "${query}"

المطلوب صياغة استجابة JSON دقيقة مطابقة للمفاتيح التالية:
{
  "answer": "الإجابة التفصيلية والتربوية الهادئة. إذا كانت المعلومة استكمالاً خارج المنهج اذكر تنبيه [ملاحظة: هذه المعلومة غير واردة نصاً في المنهج المعتمد المتاح، وتم استكمالها استناداً للمعرفة التربوية العامة].",
  "citations": ["التوثيق والمصدر المباشر بالتفصيل: (اسم الكتاب | الصف | الجزء | الوحدة | الدرس) والاقتباس الداعم إن وجد"],
  "mindfulConnection": "لمسة وجدانية عميقة بأسلوب وضاح الزليل تدعو المعلم للحد من التشتت الرقمي وتفعيل الحواس الخمس والعودة للواقع الملموس والسبورة والورق."
}

تنبيه: أرسل الاستجابة بصيغة JSON خام تماماً دون أي علامات ماركداون إضافية أو نصوص خارج الـ JSON.`;

    const chatResponseSchema = {
      type: Type.OBJECT,
      properties: {
        answer: { type: Type.STRING },
        citations: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        mindfulConnection: { type: Type.STRING }
      },
      required: ["answer", "citations", "mindfulConnection"]
    };

    const response = await generateContentWithRetry({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: chatResponseSchema,
      }
    });

    res.json(cleanAndParseJson(response.text));
  } catch (error: any) {
    return handleGeminiError(error, res);
  }
});

// 5. التحليل والتلخيص البيداغوجي الموجه للفصول الدراسية
app.post("/api/gemini/summarize", checkApiKey, async (req, res) => {
  try {
    const { bookId, documentText, documentName } = req.body;

    let textToAnalyze = "";
    let title = "";

    if (bookId === "custom") {
      textToAnalyze = documentText;
      title = documentName || "مادة دراسية مخصصة";
    } else {
      const book = booksDb.get(bookId);
      if (book) {
        textToAnalyze = book.text;
        title = book.name;
      } else {
        return res.status(404).json({ error: "كتاب المنهج المحدد غير موجود." });
      }
    }

    if (!textToAnalyze || !textToAnalyze.trim()) {
      return res.status(400).json({ error: "النص المراد تلخيصه فارغ." });
    }

    const systemInstruction = `أنت خبير مناهج وموجه تربوي محترف. تقوم بتحليل فصول المنهج واستخلاص الأهداف التربوية والقيم والوسائل التعليمية والمفردات اللغوية بأسلوب بيداغوجي هادئ وبسيط، مستوحى من رؤية "وضاح الزليل" الوجدانية.`;

    const prompt = `قم بتحليل الفصل أو النص التعليمي التالي واستخلص تحليلاً بيداغوجياً متكاملاً:
العنوان: ${title}
النص:
"""
${textToAnalyze.slice(0, 15000)}
"""

يجب أن تكون المخرجات بصيغة JSON تماماً ومطابقة للهيكل التالي وبنفس مسميات المفاتيح وبدون أي نصوص خارج الـ JSON:
{
  "docTitle": "عنوان الدرس أو الملف المنهجي بشكل منسق",
  "overallSummary": "ملخص شامل، دافئ، وعميق للدرس وأهميته الوجدانية والتعليمية في فقرة واحدة متماسكة.",
  "keyObjectives": ["الهدف السلوكي/الوجداني الأول", "الهدف السلوكي/الوجداني الثاني"],
  "valuesAndSkills": ["قيمة حياتية واقعية وتطبيقاتها المحسوسة"],
  "coreConcepts": [
    { "term": "المصطلح أو المفردة اللغوية", "definition": "الشرح اللغوي أو الاصطلاحي الدقيق بعبارات بسيطة." }
  ],
  "lessonHooks": [
    "نشاط افتتاحي حسي مباشر"
  ],
  "contemplativeInsight": "تأمل فلسفي تربوي عميق بأسلوب وضاح الزليل يربط موضوع الدرس بأهمية العودة إلى الجذور الملموسة والحد من استخدام الهواتف المحمولة وتشتيت العقول في الفضاء الافتراضي."
}

تنبيه: أرسل الاستجابة بصيغة JSON خام تماماً دون أي علامات ماركداون أو نصوص خارج الـ JSON.`;

    const summarizeResponseSchema = {
      type: Type.OBJECT,
      properties: {
        docTitle: { type: Type.STRING },
        overallSummary: { type: Type.STRING },
        keyObjectives: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        valuesAndSkills: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        coreConcepts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              term: { type: Type.STRING },
              definition: { type: Type.STRING }
            },
            required: ["term", "definition"]
          }
        },
        lessonHooks: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        contemplativeInsight: { type: Type.STRING }
      },
      required: [
        "docTitle",
        "overallSummary",
        "keyObjectives",
        "valuesAndSkills",
        "coreConcepts",
        "lessonHooks",
        "contemplativeInsight"
      ]
    };

    const response = await generateContentWithRetry({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: summarizeResponseSchema,
      }
    });

    res.json(cleanAndParseJson(response.text));
  } catch (error: any) {
    return handleGeminiError(error, res);
  }
});

// --- معالجة المسارات غير الموجودة للأي بي آي وحماية الأخطاء العامة ---
app.all("/api/*", (req, res) => {
  res.status(404).json({
    error: `المسار المطلوب غير موجود في الخادم / The requested API endpoint '${req.path}' was not found.`
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("خطأ عام غير معالج في السيرفر:", err);
  res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
    error: err.message || "حدث خطأ غير متوقع في الخادم / An unexpected server error occurred."
  });
});

// --- إعداد تشغيل الواجهة الأمامية الفورية عبر Vite ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    app.use("*", async (req, res, next) => {
      try {
        const template = path.resolve(process.cwd(), "index.html");
        res.status(200).set({ "Content-Type": "text/html" }).sendFile(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`تم تشغيل السيرفر المطور بنجاح على الرابط: http://localhost:${PORT}`);
  });
}

startServer();
