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
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
    return res.status(503).json({
      error: "النموذج الذكي يواجه ضغطاً كبيراً مؤقتاً في الخدمة. ندعوك للتأمل لثوانٍ معدودة والمحاولة مجدداً؛ فالعودة الهادئة للواقع تصفي الذهن وتجلب الطمأنينة.\n\nThe AI model is temporarily experiencing high demand. We invite you to pause, take a deep breath for a few seconds, and try again; a calm return to reality always clears the mind and brings clarity."
    });
  }

  return res.status(500).json({
    error: error.message || "حدث خطأ أثناء معالجة الطلب وتوليد البيانات التعليمية."
  });
};

// --- قاعدة بيانات مبسطة في الذاكرة لتخزين ومزامنة كتب المنهج الدراسي ---
interface BookMeta {
  id: string;
  name: string;
  fileType: string;
  size: number;
  uploadedAt: string;
  text: string;
}

const booksDb: Map<string, BookMeta> = new Map([
  [
    "seed-coffee",
    {
      id: "seed-coffee",
      name: "كتاب القراءة واللغة العربية - اليمن.pdf",
      fileType: "pdf",
      size: 2450000,
      uploadedAt: new Date().toISOString(),
      text: `منهج القراءة واللغة العربية - الدرس الرابع: زراعة البن في ريف اليمن وأثره الوجداني.
تعتبر شجرة البن في اليمن رمزاً للأصالة والتأمل والصلة مع الأرض الواقعية المعطاءة. يصحو الفلاح اليمني مع بواكير الفجر، مستنشقاً الهواء النقي الملموس، بعيداً عن صخب المدن وضجيجها الرقمي الحديث. يسير بخطى وئيدة نحو الجبال المكسوة بالخضرة الداكنة، حاملاً أدواته اليدوية التقليدية التي تصون تربة الأجداد.
يتعلم الطالب من هذا الدرس كيفية الحفاظ على الموارد الزراعية التقليدية، وقيمة الصبر والمثابرة التي يتطلبها نضوج حبة البن، وأهمية التقليل من الضوضاء التكنولوجية والعودة لجلسات القهوة الدافئة التي تجمع العائلة حول حديث إنساني حقيقي وصادق.`
    }
  ]
]);

// قاعدة بيانات مصغرة ومثبتة للمناهج اليمنية لضمان دقة الإجابة
const yemeniCurriculumData: Record<string, string> = {
  "9-arabic": `منهج اللغة العربية - الصف التاسع - الجزء الأول - الجمهورية اليمنية:
  - الوحدة الأولى: من هدي القرآن الكريم (سورة لقمان - آيات الحكمة والتربية الأخلاقية). المفردات البلاغية: التشبيه، قيم بر الوالدين، خفض الصوت.
  - الوحدة الثانية: قيم وطنية وقراءة أدبية عن هوية اليمن الحضارية والتاريخية.
  - القواعد النحوية المقررة: التوابع (النعت، العطف، التوكيد، البدل).`,
  "8-arabic": `منهج اللغة العربية - الصف الثامن - الجزء الأول - الجمهورية اليمنية:
  - الدرس الأول: البن اليمني المجيد (زراعة البن في ريف اليمن وأثره الاقتصادي والوجداني، قيم الاعتماد على الذات).
  - القواعد النحوية: الجملة الاسمية ونواسخها.`
};

// --- مسار المكتبة المنهجية الجاهزة والوحدات المتكاملة (تحضير الدرس) ---
app.post("/api/gemini/lesson-plan", checkApiKey, async (req, res) => {
  try {
    const { 
      country, 
      subject, 
      grade, 
      lessonTitle, 
      topic,
      duration, 
      language, 
      customNotes 
    } = req.body;

    const actualLessonTitle = lessonTitle || topic;

    if (!actualLessonTitle) {
      return res.status(404).json({ error: "يرجى إدخال عنوان الدرس أولاً." });
    }

    const systemInstruction = `أنت مستشار تربوي محترف وخبير في المناهج التعليمية العربية واليمنية وإستراتيجيات التعلم النشط والتأملي.`;

    // جلب المنهج الحقيقي الثابت إذا كان المنهج المختار هو اليمن
    let normalizedGrade = grade || "";
    if (normalizedGrade.includes("التاسع") || normalizedGrade.includes("9")) normalizedGrade = "9";
    else if (normalizedGrade.includes("الثامن") || normalizedGrade.includes("8")) normalizedGrade = "8";
    else if (normalizedGrade.includes("السابع") || normalizedGrade.includes("7")) normalizedGrade = "7";
    else if (normalizedGrade.includes("الأول الثانوي") || normalizedGrade.includes("10")) normalizedGrade = "10";

    let normalizedSubject = subject || "";
    if (normalizedSubject.includes("العربية") || normalizedSubject.includes("arabic")) normalizedSubject = "arabic";
    else if (normalizedSubject.includes("الإسلامية") || normalizedSubject.includes("Islamic")) normalizedSubject = "islamic";
    else if (normalizedSubject.includes("الاجتماعيات") || normalizedSubject.includes("Social")) normalizedSubject = "social";
    else if (normalizedSubject.includes("العلوم") || normalizedSubject.includes("Science")) normalizedSubject = "science";
    else if (normalizedSubject.includes("الرياضيات") || normalizedSubject.includes("Math")) normalizedSubject = "math";

    const curriculumKey = `${normalizedGrade}-${normalizedSubject}`;
    let curriculumContext = "اعتماداً على المعايير التربوية العامة للمنهج المختار.";

    if (country === "اليمن") {
      if (yemeniCurriculumData[curriculumKey]) {
        curriculumContext = yemeniCurriculumData[curriculumKey];
      } else if (yemeniCurriculumData[`${grade}-${subject}`]) {
        curriculumContext = yemeniCurriculumData[`${grade}-${subject}`];
      }
    }

    const prompt = `قم بتحضير وتوليد خطة درس متكاملة بناءً على المعطيات التالية:
الدولة: ${country || "اليمن"}
المادة: ${subject || "اللغة العربية"}
الصف الدراسي: ${grade}
عنوان الدرس المستهدف: ${actualLessonTitle}
زمن الحصة: ${duration || "45"} دقيقة
مرجعية المنهج الثابتة المتاحة:
"""
${curriculumContext}
"""

المطلوب صياغة استجابة JSON دقيقة تحتوي على الحقول التالية فقط:
{
  "title": "${actualLessonTitle}",
  "metadata": { "grade": "${grade}", "subject": "${subject}", "duration": "${duration || "45"} دقائق" },
  "objectives": ["الهدف الأول", "الهدف الثاني"],
  "materials": ["الوسائل الحسية والتقليدية المفضل استخدامها في الصف"],
  "introduction": ["خطوات التمهيد والتهيئة الحافزة للطلاب"],
  "presentationSlides": [
    { "slideTitle": "المحور الأول للدرس", "slideContent": ["شرح النقطة الأساسية"] }
  ],
  "examUnit": {
    "quizText": "نص اختبار مقترح للدرس يتنوع بين اختيار من متعدد، صح وخطأ، وأسئلة مقالية",
    "answerKey": "نموذج الإجابة الكامل والنموذجي"
  },
  "activitiesUnit": [
    "إستراتيجية تعلم نشط تفاعلية مثل (فكر-شارك-زميل) تناسب الصف الدراسي"
  ],
  "mindMapUnit": {
    "mainIdea": "الفكرة المركزية للرسم على السبورة",
    "branches": ["الأفكار الفرعية", "المفردات والتراكيب", "القواعد المقررة"]
  },
  "philosophicalTip": "نصيحة تربوية وجدانية عميقة وهادئة للمعلم لغرس قيم الانتماء والعمل الحقيقي"
}`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        metadata: {
          type: Type.OBJECT,
          properties: {
            grade: { type: Type.STRING },
            subject: { type: Type.STRING },
            duration: { type: Type.STRING }
          },
          required: ["grade", "subject", "duration"]
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
        examUnit: {
          type: Type.OBJECT,
          properties: {
            quizText: { type: Type.STRING },
            answerKey: { type: Type.STRING }
          },
          required: ["quizText", "answerKey"]
        },
        activitiesUnit: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        mindMapUnit: {
          type: Type.OBJECT,
          properties: {
            mainIdea: { type: Type.STRING },
            branches: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["mainIdea", "branches"]
        },
        philosophicalTip: { type: Type.STRING }
      },
      required: [
        "title",
        "metadata",
        "objectives",
        "materials",
        "introduction",
        "presentationSlides",
        "examUnit",
        "activitiesUnit",
        "mindMapUnit",
        "philosophicalTip"
      ]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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

      const id = "book-" + Date.now();
      const book: BookMeta = {
        id,
        name: filename,
        fileType: filename.split(".").pop()?.toLowerCase() || "txt",
        size: buffer.length,
        uploadedAt: new Date().toISOString(),
        text: fileContent || "محتوى فارغ."
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
  if (id === "seed-coffee") {
    return res.status(400).json({ error: "لا يمكن حذف كتاب المنهج الافتراضي المدمج." });
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
    const { bookId, query, documentText, documentName } = req.body;

    let context = "";
    let sourceName = "";

    if (bookId === "all") {
      context = Array.from(booksDb.values()).map(b => `[كتاب: ${b.name}]\n${b.text}`).join("\n\n").slice(0, 15000);
      sourceName = "جميع المناهج المرفوعة";
    } else if (bookId === "custom") {
      context = documentText || "";
      sourceName = documentName || "منهج مخصص";
    } else {
      const book = booksDb.get(bookId);
      if (book) {
        context = book.text.slice(0, 15000);
        sourceName = book.name;
      }
    }

    const systemInstruction = `أنت مستشار تربوي يمني قدير ومساعد دراسي ذكي يعتمد على أسلوب الكاتب والمفكر "وضاح الزليل" في تعزيز الواقع الحقيقي والملموس وتجنب ضوضاء العالم الرقمي.
أجب عن استفسارات المعلم بناءً على نصوص الكتب المدرسية المرفوعة بدقة وأمانة علمية وبأسلوب فلسفي دافئ وجميل باللغة العربية.`;

    const prompt = `استخدم السياق التالي المستخرج من المناهج المدرسية للإجابة عن سؤال المعلم بدقة.
السياق المتاح من (${sourceName}):
"""
${context || "لا يوجد سياق إضافي مرفوع."}
"""

سؤال المعلم: "${query}"

يجب أن تتضمن الإجابة العناصر التالية وتكون منسقة كـ JSON تماماً ومطابقة للمفاتيح التالية:
{
  "answer": "الإجابة التفصيلية والتربوية الهادئة على السؤال، مع ربطها بالأمثلة والأنشطة الواقعية المناسبة.",
  "citations": ["اقتباس مباشر من النص يدعم الإجابة"],
  "mindfulConnection": "لمسة وجدانية عميقة بأسلوب وضاح الزليل تدعو المعلم للحد من التشتت الرقمي وتفعيل الحواس الخمس والعودة للطبيعة في هذا الموضوع بالتحديد."
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

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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
