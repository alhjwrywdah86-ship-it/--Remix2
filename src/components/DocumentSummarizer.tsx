import React, { useState, useRef, useEffect, useMemo } from "react";
import { SummaryResult, Language } from "../types";
import { 
  FileText, 
  Upload, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  MessageSquare, 
  Send, 
  Book, 
  FileDown, 
  Layers, 
  FileCheck,
  ChevronRight,
  RefreshCw,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import WaddahAvatarSymbol from "./WaddahAvatarSymbol";
import { PRELOADED_CURRICULUM } from "../data/curriculumData";

// Helper function to synthesize beautiful educational lessons if there's no matching preloaded lesson
function getFallbackCurriculumText(country: string, grade: string, subject: string, lang: Language): { topic: string; content: string } {
  const isAr = lang === "ar";
  
  if (subject.includes("الإسلامية") || subject.includes("Islamic")) {
    return {
      topic: isAr ? "التأمل والتفكر في خلق السماوات والأرض" : "Contemplation of the Heavens and the Earth",
      content: isAr 
        ? `درس التربية الإسلامية والآداب - التفكر في بديع صنع الله:
إن التفكر والتأمل في الكون الفسيح هو عبادة قلبية رفيعة ترتقي بوجدان الإنسان وتهدئ نفسه. يدعونا القرآن الكريم في مواضع شتى للنظر في ملكوت السماوات والأرض، والتدبر في حركة السحاب، وهطول المطر، ونمو الزرع، وتعاقب الليل والنهار.
في حياتنا المعاصرة المليئة بضوضاء الشاشات والأجهزة الباردة، يصبح الصمت والتأمل ضرورة قصوى لاستعادة التوازن النفسي والروحي.
يتعلم الطالب من هذا الدرس:
1. مهارات التفكر كأداة لبناء اليقين والاستقرار الداخلي.
2. عظمة التنظيم الإلهي للكون ودور الإنسان كخليفة يعمر الأرض بالخير والصلاح.
3. ممارسات عملية للحد من الصخب والجلوس في هدوء لتأمل الطبيعة الملموسة.`
        : `Islamic Studies & Ethics - Contemplation of Divine Creation:
Contemplation and reflection upon the vast universe are high forms of spiritual worship that elevate human consciousness and restore inner calm. The Holy Qur'an frequently invites us to gaze upon the heavens, ponder the movement of clouds, the rainfall, plant growth, and the succession of night and day.
In our modern lives full of screen noise and digital distraction, quiet reflection becomes essential for emotional and spiritual balance.
Students learn from this lesson:
1. Contemplation skills as a tool for personal clarity and internal stability.
2. The greatness of divine cosmic order and the human role in preserving the environment.
3. Practical screen-free activities to enjoy silent moments in nature.`
    };
  }

  if (subject.includes("الاجتماعيات") || subject.includes("Social")) {
    return {
      topic: isAr ? `معالم الحضارة والتجارة التقليدية في ${country}` : `Historic Heritage & Traditional Commerce in ${country}`,
      content: isAr
        ? `درس التاريخ والاجتماعيات - الأصالة والتواصل التاريخي في ${country}:
تتمتع ${country} بإرث تاريخي واجتماعي غني، شيدته سواعد الأجداد عبر العصور بالعمل الدؤوب والتعاون الوثيق. من الأسواق التقليدية العتيقة ذات الطابع الملموس والروائح الزكية، إلى العمارة القديمة الشامخة التي تنسجم مع البيئة الطبيعية.
إن دراسة تاريخنا العريق تدعونا كمعلمين وطلاب للتفكر في كيفية بناء علاقات اجتماعية حقيقية متماسكة تقوم على اللقاء المباشر والتكافل، بعيداً عن عزلة شبكات التواصل الافتراضية السطحية.
يتعلم الطالب من هذا الدرس:
1. تاريخ ومعالم الحضارة الإنسانية في ${country} وأهميتها الإستراتيجية.
2. دور الأسواق والمبادلات التجارية التقليدية في صون الهوية الثقافية.
3. تقدير الصناعات والحرف اليدوية الموروثة والتقليل من الاستهلاك الرقمي.`
        : `History & Social Studies - Civilizational Roots & Cultural Identity in ${country}:
${country} possesses a profound historic and social heritage built through generations of manual labor and cooperative harmony. From ancient physical souks filled with spice aromas to towering historical architecture that blends with nature.
Studying this legacy invites us to reflect on establishing real, strong human relationships through physical gatherings, away from the isolated screen life.
Students learn from this lesson:
1. The history and monumental achievements of ancient civilizations in ${country}.
2. The role of traditional markets in preserving national culture and identity.
3. Appreciating local craftsmanship and hand-made products instead of virtual play.`
    };
  }

  if (subject.includes("العلوم") || subject.includes("Science")) {
    return {
      topic: isAr ? "الفيزياء الحيوية للنبات والتركيب الضوئي" : "Biophysics of Plants and Photosynthesis",
      content: isAr
        ? `درس العلوم العامة - معجزة الضوء وحياة النبات:
يعتبر التمثيل الضوئي في النبات أحد أعظم العمليات الحيوية على وجه الأرض، حيث يحول النبات طاقة الشمس الذهبية إلى غذاء وأكسجين ينبض بالحياة. هذه العملية الصامتة والهادئة تحدث كل ثانية في حقولنا الخضراء الملموسة دون إحداث ضجيج أو مخلفات ضارة بالبيئة.
إن مراقبة نمو النبات في الصف الدراسي ولمس أوراقه يغرس في نفوس الطلاب حب الملاحظة العلمية الدقيقة والهدوء الحسي.
يتعلم الطالب من هذا الدرس:
1. المكونات الأساسية لعملية البناء الضوئي (الكلوروفيل، الماء، ثاني أكسيد الكربون، الضوء).
2. دور النباتات في الحفاظ على التوازن البيئي ونقاء الهواء الملموس.
3. إجراء تجارب عملية زراعية ملموسة داخل فناء المدرسة بدون استخدام الأجهزة.`
        : `General Sciences - The Miracle of Light and Plant Life:
Photosynthesis is one of the most magnificent biological processes on Earth, converting solar energy into food and life-giving oxygen. This quiet, silent chemical reaction takes place every second in our physical green fields without creating noise or carbon footprints.
Observing plant growth directly in the classroom and touching its soil instills precise scientific curiosity and sensory calm.
Students learn from this lesson:
1. The essential components of photosynthesis (chlorophyll, water, carbon dioxide, sunlight).
2. The role of plants in maintaining environmental balance and cleaning the physical air.
3. Conducting physical agricultural experiments in the school garden with zero screens.`
    };
  }

  if (subject.includes("الرياضيات") || subject.includes("Math")) {
    return {
      topic: isAr ? "علم الجبر والمقابلة عند الخوارزمي" : "The Science of Algebra by Al-Khwarizmi",
      content: isAr
        ? `درس الرياضيات والمنطق الحسابي - أصول الجبر وتوازن العقل:
أسس العالم العربي المسلم محمد بن موسى الخوارزمي علم الجبر والمقابلة كأداة منطقية لحل المعادلات والمسائل الحسابية الواقعية (كالمواريث، والتجارة، والمساحة). يمثل الجبر لغة التوازن الفكري والتحليل المتأني للمشكلات بوعي وهدوء.
إن حل المسائل الرياضية المعقدة بالورقة والقلم التقليديين ينشط التآزر الحسي والعقلي، وينمي الصبر والمثابرة لدى المتعلم بعيداً عن الحلول الفورية بنقرة زر على الشاشات الذكية.
يتعلم الطالب من هذا الدرس:
1. مفهوم المتغيرات والمعادلات الجبرية من الدرجة الأولى وكيفية موازنتها.
2. تاريخ وإسهامات الخوارزمي في صياغة الفكر الحسابي والخوارزميات عالمياً.
3. تطوير التفكير المنطقي المتأني والصبر في فك الشفرات الرياضية يدوياً.`
        : `Mathematics - The Roots of Algebra & Mental Balance:
The great Arab scholar Muhammad ibn Musa Al-Khwarizmi founded Algebra as a logical framework to solve real-world calculation and distribution problems. Algebra represents the language of intellectual balance and meticulous problem-solving with absolute peace of mind.
Solving math equations using pencil and real paper activates sensory-motor coordination and trains patience, unlike instant solutions obtained on smart devices.
Students learn from this lesson:
1. The concept of algebraic variables and first-degree equations and how to balance them.
2. The history of Al-Khwarizmi and his global contributions to mathematical thinking.
3. Developing analytical patience and structured logic through hand-written math tasks.`
    };
  }

  return {
    topic: isAr ? `قراءة نقدية في أدب وتراث ${country}` : `Critical Readings in the Heritage of ${country}`,
    content: isAr
      ? `درس اللغة العربية والمطالعة - أصالة التراث والصلة بالواقع في ${country}:
تحمل الآداب والقصص الشعبية في ${country} حكايات الآباء والأجداد وقيم الأصالة، التسامح، والصبر على الشدائد. يتميز الأدب في بلادنا بالارتباط الحسي بالبيئة المحلية، سواء كانت صحراوية شامخة، أو ودياناً خضراء، أو مدناً مبنية من الطين والحجر الصلب.
إن القراءة الواعية المباشرة لهذه النصوص الأدبية من الكتب المطبوعة تغذي الخيال، وتصون ذاكرة اللغة الفصحى، وتعزز الحضور الذهني للطالب في واقعه المادي الملموس.
يتعلم الطالب من هذا الدرس:
1. تذوق النثر الفني والأساليب البلاغية وصور التشبيه والاستعارة الجميلة.
2. تعزيز الانتماء للهوية الوطنية والتراث الملموس في ${country}.
3. تدريبات إملائية ونحوية وصياغة تعابير تعكس المشاعر الحقيقية بعيداً عن تشتت الشاشات.`
      : `Literature & Reading - Heritage & Physical Connection in ${country}:
The literature and folktales of ${country} carry the wisdom of ancestors, promoting tolerance, endurance, and honesty. This literary legacy is physically grounded in local environments—be it golden sands, lush green valleys, or brick-built towns.
Mindful, direct reading of these printed stories feeds student imagination, preserves classic linguistics, and deepens sensory presence.
Students learn from this lesson:
1. Appreciating artistic prose, rhetorical structures, and metaphorical aesthetics.
2. Cultivating a deep respect for national identity and tangible heritage in ${country}.
3. Grammar and writing exercises that encourage writing real thoughts away from smart devices.`
  };
}

interface DocumentSummarizerProps {
  lang: Language;
}

interface BookMeta {
  id: string;
  name: string;
  fileType: string;
  size: number;
  uploadedAt: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  citations?: string[];
  mindfulConnection?: string;
  timestamp: string;
}

const SAMPLE_TEXT_AR = `منهج القراءة واللغة العربية - الدرس الرابع: زراعة البن في ريف اليمن وأثره الوجداني.
تعتبر شجرة البن في اليمن رمزاً للأصالة والتأمل والصلة مع الأرض الواقعية المعطاءة. يصحو الفلاح اليمني مع بواكير الفجر، مستنشقاً الهواء النقي الملموس، بعيداً عن صخب المدن وضجيجها الرقمي الحديث. يسير بخطى وئيدة نحو الجبال المكسوة بالخضرة الداكنة، حاملاً أدواته اليدوية التقليدية التي تصون تربة الأجداد.
يتعلم الطالب من هذا الدرس كيفية الحفاظ على الموارد الزراعية التقليدية، وقيمة الصبر والمثابرة التي يتطلبها نضوج حبة البن، وأهمية التقليل من الضوضاء التكنولوجية والعودة لجلسات القهوة الدافئة التي تجمع العائلة حول حديث إنساني حقيقي وصادق.`;

const SAMPLE_TEXT_EN = `Arabic Reading Curriculum - Lesson Four: Coffee Farming in Rural Yemen.
The coffee tree in Yemen represents authenticity, reflection, and a deep sensory connection with the earth. The Yemeni farmer wakes up with the first light of dawn, breathing the fresh tangible air, far from the digital clutter of modern city life. He walks with calm, mindful steps toward the green terraces, carrying simple hand tools that preserve his ancestors' land.
Students learn from this lesson the value of sustainable traditional agriculture, the patience required for coffee cherries to ripen, and the sensory beauty of returning to warm family gatherings around a cup of coffee, fostering real human conversation.`;

export default function DocumentSummarizer({ lang }: DocumentSummarizerProps) {
  const isAr = lang === "ar";

  // Navigation tab for RAG Chat vs. Chapter Summarizer
  const [activeSubTab, setActiveSubTab] = useState<"chat" | "summarize">("chat");

  // Books list
  const [books, setBooks] = useState<BookMeta[]>([]);
  const [selectedBookForChat, setSelectedBookForChat] = useState<string>("custom");
  const [selectedBookForSum, setSelectedBookForSum] = useState<string>("custom");

  // Arab Curriculum Selector States
  const [selectedCountry, setSelectedCountry] = useState<string>("اليمن");
  const [selectedGrade, setSelectedGrade] = useState<string>("الصف السابع الأساسي");
  const [selectedSubject, setSelectedSubject] = useState<string>("اللغة العربية");

  // Compute available subjects dynamically
  const availableSubjects = useMemo(() => {
    const matchingBooks = books.filter(
      b => b.country === selectedCountry && b.grade === selectedGrade
    );
    if (matchingBooks.length > 0) {
      // Return only subjects that exist in the books database for this grade
      return Array.from(new Set(matchingBooks.map(b => b.subject)));
    }
    // Fallback to static defaults if no uploaded books exist
    return isAr 
      ? ["اللغة العربية", "التربية الإسلامية والقرآن الكريم", "الاجتماعيات والتاريخ العربي", "العلوم والفيزياء الحيوية", "الرياضيات والمنطق الحسابي"]
      : ["Arabic Language", "Islamic Studies & Ethics", "Social Studies & History", "General Sciences & Biology", "Mathematics & Analytical Logic"];
  }, [books, selectedCountry, selectedGrade, isAr]);

  // Adjust current subject if not in the available subjects list
  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.includes(selectedSubject)) {
      setSelectedSubject(availableSubjects[0]);
    }
  }, [availableSubjects, selectedSubject]);

  // State for document analysis (summarization)
  const [documentText, setDocumentText] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SummaryResult | null>(null);

  // Sync selected curriculum dropdown values with document text & name
  useEffect(() => {
    const matched = PRELOADED_CURRICULUM.find(
      (lesson) => 
        lesson.country === selectedCountry && 
        lesson.grade === selectedGrade && 
        lesson.subject === selectedSubject
    );

    if (matched) {
      setDocumentText(matched.content);
      setDocumentName(matched.topic);
    } else {
      const fallback = getFallbackCurriculumText(selectedCountry, selectedGrade, selectedSubject, lang);
      setDocumentText(fallback.content);
      setDocumentName(fallback.topic);
    }
  }, [selectedCountry, selectedGrade, selectedSubject, lang]);

  // RAG Chat States
  const [chatQuery, setChatQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // File uploading states
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch uploaded books from backend
  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/curriculum/books");
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {
      console.error("Failed to fetch curriculum books:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Initialize greeting message in chat
  useEffect(() => {
    setChatMessages([
      {
        id: "msg-welcome",
        sender: "assistant",
        text: isAr 
          ? "أهلاً بك في مساعد المنهج التفاعلي (RAG). اختر الدولة العربية والصف والمادة من القوائم المنسدلة بالمكتبة المنهجية الجاهزة، ثم اطرح أي سؤال لنبحث فيه مباشرة ونقدم شروحات تأملية عميقة متصلة بالواقع الملموس والحياة الطبيعية."
          : "Welcome to the Interactive Curriculum Assistant (RAG). Choose your Arab country, grade, and subject from the Preloaded Curriculum Library dropdowns, and ask any question. I will search through the textbook text to provide mindful explanations connected to the real world.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [lang]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  // File upload Zone
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    let ext = "";
    if (file.name) {
      const parts = file.name.split('.');
      if (parts.length > 1) {
        ext = parts.pop()?.trim().toLowerCase() || "";
      }
    }

    // Fallback/Correction using MIME type if extension is not detected or unrecognized (very common on mobile)
    const mime = file.type?.toLowerCase();
    if (!ext || !["pdf", "docx", "txt", "md", "json"].includes(ext)) {
      if (mime === "application/pdf" || mime?.includes("pdf")) {
        ext = "pdf";
      } else if (
        mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
        mime === "application/msword" ||
        mime?.includes("word") ||
        mime?.includes("officedocument")
      ) {
        ext = "docx";
      } else if (mime === "text/plain") {
        ext = "txt";
      } else if (mime === "text/markdown") {
        ext = "md";
      } else if (mime === "application/json") {
        ext = "json";
      }
    }

    // Blacklisted extensions that we definitely should reject (images, audio, video, packages)
    const blacklisted = ["png", "jpg", "jpeg", "gif", "svg", "webp", "mp4", "avi", "mov", "mp3", "wav", "zip", "rar", "tar", "gz", "exe", "apk"];
    if (ext && blacklisted.includes(ext)) {
      setError(isAr 
        ? "عذراً، نوع الملف غير مدعوم (صور أو وسائط). يرجى رفع ملف كتاب مدرسي (PDF أو Word أو نص)." 
        : "Unsupported file type (image or media). Please upload a curriculum schoolbook (PDF, Word, or Text)."
      );
      return;
    }

    // Validate file size to prevent phone browser crash and server memory depletion
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      setError(isAr
        ? "حجم الملف كبير جداً (أكثر من 10 ميجابايت). للحد من تشتيت طاقة الجوال وحفظ ذاكرة النظام بوعي وهدوء، يرجى رفع فصول منفصلة أو ملفات أصغر."
        : "File size is too large (over 10MB). To avoid phone power drain and maintain system memory with ease and mindfulness, please upload individual chapters or smaller files."
      );
      return;
    }

    setUploading(true);
    setError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/curriculum/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let errMsg = isAr ? "فشل رفع وتحليل الملف." : "Upload failed";
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            errMsg = data.error || errMsg;
          } else {
            const txt = await res.text();
            errMsg = txt.substring(0, 300) || errMsg;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await res.json();
      setUploadSuccess(isAr ? `تم بنجاح رفع وتحليل كتاب: ${file.name}` : `Successfully uploaded & parsed: ${file.name}`);
      fetchBooks();
      
      // Select newly uploaded book automatically
      setSelectedBookForChat(data.book.id);
      setSelectedBookForSum(data.book.id);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload and parse document.");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  // Delete a book from system
  const handleDeleteBook = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(isAr ? "هل أنت متأكد من حذف هذا الكتاب المنهجي من النظام؟" : "Are you sure you want to delete this curriculum book?")) {
      return;
    }

    try {
      const res = await fetch(`/api/curriculum/books/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchBooks();
        if (selectedBookForChat === id) setSelectedBookForChat("all");
        if (selectedBookForSum === id) setSelectedBookForSum("custom");
      } else {
        let errMsg = isAr ? "فشل حذف الكتاب." : "Failed to delete";
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            errMsg = data.error || errMsg;
          } else {
            const txt = await res.text();
            errMsg = txt.substring(0, 300) || errMsg;
          }
        } catch (_) {}
        alert(errMsg);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // RAG Chat Submission
  const handleSendChatMessage = async () => {
    if (!chatQuery.trim() || chatLoading) return;

    const userMsgText = chatQuery;
    setChatQuery("");
    setChatError(null);
    setChatLoading(true);

    const newUserMessage: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newUserMessage]);

    try {
      const res = await fetch("/api/curriculum/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: selectedBookForChat,
          query: userMsgText,
          documentText: selectedBookForChat === "custom" ? documentText : "",
          documentName: selectedBookForChat === "custom" ? documentName : "",
          country: selectedCountry,
          subject: selectedSubject,
          grade: selectedGrade,
          term: selectedTerm,
          language: lang
        })
      });

      if (!res.ok) {
        let errMsg = isAr ? "فشل استعلام نظام الـ RAG للمناهج." : "Failed to query curriculum RAG";
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            errMsg = data.error || errMsg;
          } else {
            const txt = await res.text();
            errMsg = txt.substring(0, 300) || errMsg;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: "msg-" + (Date.now() + 1),
        sender: "assistant",
        text: data.answer,
        citations: data.citations,
        mindfulConnection: data.mindfulConnection,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setChatError(err.message || "Failed to get response from book.");
    } finally {
      setChatLoading(false);
    }
  };

  // Handle Pedagogical Summary / Chapter analysis
  const handleSummarize = async () => {
    if (selectedBookForSum === "custom" && !documentText.trim()) {
      setError(isAr ? "الرجاء إدخال نص أو رفع ملف أولاً للتلخيص." : "Please input some text or upload a document to summarize.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: selectedBookForSum,
          documentText: selectedBookForSum === "custom" ? documentText : "",
          documentName: selectedBookForSum === "custom" ? (documentName || (isAr ? "مادة دراسية مخصصة" : "Custom study material")) : "",
          language: lang,
        }),
      });

      if (!response.ok) {
        let errMsg = isAr ? "فشل تحليل وتلخيص الملف المنهجي." : "Summarization failed";
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errData = await response.json();
            errMsg = errData.error || errMsg;
          } else {
            const txt = await response.text();
            errMsg = txt.substring(0, 300) || errMsg;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze document.");
    } finally {
      setLoading(false);
    }
  };

  const useSampleData = () => {
    setSelectedBookForSum("custom");
    setDocumentText(isAr ? SAMPLE_TEXT_AR : SAMPLE_TEXT_EN);
    setDocumentName(isAr ? "درس البن اليمني نموذج.txt" : "yemen_coffee_lesson_sample.txt");
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6 animate-fade-in" id="doc-summarizer-tab-content">
      
      {/* Editorial Header */}
      <div className="border-b border-charcoal/15 pb-4">
        <h2 className="text-2xl font-serif font-bold text-charcoal flex items-center gap-2">
          <Book className="w-6 h-6 text-amber-gold" />
          <span>{isAr ? "المساعد الدراسي والمحاورة الذكية لكتب المنهج (RAG)" : "Smart RAG Document Summarizer & Book Reader"}</span>
        </h2>
        <p className="text-xs text-charcoal/70 mt-1">
          {isAr
            ? "اختر الدولة والمادة والصف من المكتبة المنهجية الجاهزة، وحاور المنهج بذكاء (RAG) أو لخص فصوله بأسلوب بيداغوجي عميق وهادئ."
            : "Choose the country, subject, and grade level from the preloaded library. Chat with the textbook or summarize it using a mindful pedagogical approach."}
        </p>
      </div>

      {/* Main Grid: Selector & Library on top/left, Active Tools on bottom/right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Ready Curriculum Selector & Library Directory (5 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* 1. Ready Arab Curriculum Selector */}
          <div className="paper-card p-5 bg-white border-2 border-charcoal shadow-[4px_4px_0px_#1A1A1A] rounded-lg space-y-4">
            <div className="flex items-center gap-2 border-b pb-2 border-charcoal/10">
              <Book className="w-5 h-5 text-amber-gold" />
              <h4 className="font-serif font-bold text-xs text-charcoal">
                {isAr ? "المكتبة المنهجية الجاهزة" : "Preloaded Curriculum Library"}
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              {/* Dropdown for Arab Countries */}
              <div className="space-y-1">
                <label className="block font-serif font-bold text-charcoal">
                  {isAr ? "الدولة العربية:" : "Arab Country:"}
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 rounded focus:outline-none focus:ring-1 focus:ring-amber-gold font-sans cursor-pointer"
                >
                  <option value="اليمن">{isAr ? "🇾🇪 الجمهورية اليمنية" : "🇾🇪 Yemen"}</option>
                  <option value="السعودية">{isAr ? "🇸🇦 المملكة العربية السعودية" : "🇸🇦 Saudi Arabia"}</option>
                  <option value="مصر">{isAr ? "🇪🇬 جمهورية مصر العربية" : "🇪🇬 Egypt"}</option>
                  <option value="العراق">{isAr ? "🇮🇶 جمهورية العراق" : "🇮🇶 Iraq"}</option>
                  <option value="الإمارات">{isAr ? "🇦🇪 الإمارات العربية المتحدة" : "🇦🇪 UAE"}</option>
                  <option value="الأردن">{isAr ? "🇯🇴 المملكة الأردنية الهاشمية" : "🇯🇴 Jordan"}</option>
                </select>
              </div>

              {/* Dropdown for Grades */}
              <div className="space-y-1">
                <label className="block font-serif font-bold text-charcoal">
                  {isAr ? "الصف الدراسي:" : "Grade Level:"}
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 rounded focus:outline-none focus:ring-1 focus:ring-amber-gold font-sans cursor-pointer"
                >
                  <option value="الصف السابع الأساسي">{isAr ? "الصف السابع الأساسي" : "7th Grade Primary"}</option>
                  <option value="الصف الثامن الأساسي">{isAr ? "الصف الثامن الأساسي" : "8th Grade Primary"}</option>
                  <option value="الصف التاسع الأساسي">{isAr ? "الصف التاسع الأساسي" : "9th Grade Primary"}</option>
                  <option value="الصف الأول الثانوي">{isAr ? "الصف الأول الثانوي" : "10th Grade Secondary"}</option>
                </select>
              </div>

              {/* Dropdown for Subjects */}
              <div className="space-y-1">
                <label className="block font-serif font-bold text-charcoal">
                  {isAr ? "المادة الدراسية:" : "Academic Subject:"}
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-[#FAF8F5] border-2 border-charcoal p-2 rounded focus:outline-none focus:ring-1 focus:ring-amber-gold font-sans cursor-pointer"
                >
                  {availableSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Topic Banner */}
            <div className="bg-[#FAF8F5] p-3 border border-charcoal/10 rounded space-y-1.5 text-xs">
              <span className="font-mono text-[9px] font-bold text-amber-gold uppercase tracking-wider block">
                {isAr ? "📖 الدرس المنهجي النشط الآن:" : "📖 Active Curriculum Lesson:"}
              </span>
              <p className="font-serif font-bold text-charcoal leading-relaxed">{documentName}</p>
              <div className="flex items-center gap-1.5 pt-1 border-t border-charcoal/5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                <span className="text-[10px] text-slate-500 font-sans">
                  {isAr ? "جاهز ومحمل للمحاورة والتلخيص" : "Loaded for Chat & Analysis"}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback & Errors */}
          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-900 text-red-900 text-xs font-mono rounded flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3 bg-green-50 border-2 border-green-800 text-green-900 text-xs font-mono rounded flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {/* 2. Uploaded Curriculum Books Directory (System database) */}
          <div className="paper-card p-4 bg-white space-y-3">
            <h4 className="font-serif font-bold text-sm text-charcoal border-b pb-1.5 flex items-center justify-between">
              <span>{isAr ? "كتب المنهج المحفوظة في النظام:" : "System Curriculum Library:"}</span>
              <span className="text-[10px] font-mono bg-charcoal text-[#C5A021] px-1.5 py-0.5 rounded font-bold">
                {books.length} {isAr ? "ملفات" : "Files"}
              </span>
            </h4>

            {books.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic text-center py-4">
                {isAr ? "لا يوجد كتب مرفوعة حالياً. ارفع كتابك الأول بالأعلى." : "No books in system database. Upload your first textbook."}
              </p>
            ) : (
              <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                {books.map((book) => {
                  const isSelectedForChat = selectedBookForChat === book.id;
                  const isSelectedForSum = selectedBookForSum === book.id;
                  
                  return (
                    <div 
                      key={book.id}
                      className={`p-2.5 border-2 rounded transition-all flex flex-col justify-between gap-1.5 ${
                        isSelectedForChat || isSelectedForSum
                          ? "border-[#C5A021] bg-autumn-yellow/5" 
                          : "border-charcoal/20 hover:border-charcoal/50 bg-[#FAF8F5]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-1.5 min-w-0">
                          <FileText className={`w-4 h-4 mt-0.5 flex-shrink-0 ${book.fileType === "pdf" ? "text-red-700" : book.fileType === "docx" ? "text-blue-700" : "text-amber-gold"}`} />
                          <div className="min-w-0">
                            <span className="block text-[11px] font-bold text-charcoal truncate font-sans" title={book.name}>
                              {book.name}
                            </span>
                            <span className="text-[9px] font-mono text-slate-500 block">
                              {formatSize(book.size)} • {book.fileType.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        {!book.id.startsWith("yemen-") && (
                          <button
                            onClick={(e) => handleDeleteBook(book.id, e)}
                            className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-700 rounded transition-all cursor-pointer"
                            title={isAr ? "حذف الكتاب من النظام" : "Delete from system"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Select shortcuts for operations */}
                      <div className="flex items-center gap-2 pt-1.5 border-t border-charcoal/5 text-[9px] font-mono">
                        <button
                          onClick={() => setSelectedBookForChat(book.id)}
                          className={`px-1.5 py-0.5 rounded border transition-all cursor-pointer ${
                            isSelectedForChat 
                              ? "bg-charcoal text-[#C5A021] border-charcoal font-bold" 
                              : "bg-white text-charcoal border-charcoal/15 hover:bg-charcoal/5"
                          }`}
                        >
                          {isAr ? "محاورة (RAG)" : "Select for RAG"}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBookForSum(book.id);
                            setActiveSubTab("summarize");
                          }}
                          className={`px-1.5 py-0.5 rounded border transition-all cursor-pointer ${
                            isSelectedForSum 
                              ? "bg-charcoal text-[#C5A021] border-charcoal font-bold" 
                              : "bg-white text-charcoal border-charcoal/15 hover:bg-charcoal/5"
                          }`}
                        >
                          {isAr ? "تحليل بيداغوجي" : "Select for Analysis"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
        </div>

        {/* Right Column: Dynamic Tool Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Sub-Tabs Switcher */}
          <div className="flex border-4 border-charcoal rounded-lg bg-white overflow-hidden p-1 gap-1 shadow-[4px_4px_0px_#1A1A1A]">
            <button
              onClick={() => setActiveSubTab("chat")}
              className={`flex-1 py-2.5 text-xs font-serif font-bold rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeSubTab === "chat" ? "bg-charcoal text-white" : "text-charcoal hover:bg-charcoal/5"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-amber-gold" />
              <span>{isAr ? "المساعد الدراسي والمحاورة الذكية (RAG Chat)" : "System Book Q&A Assistant (RAG)"}</span>
            </button>
            <button
              onClick={() => setActiveSubTab("summarize")}
              className={`flex-1 py-2.5 text-xs font-serif font-bold rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeSubTab === "summarize" ? "bg-charcoal text-white" : "text-charcoal hover:bg-charcoal/5"
              }`}
            >
              <Layers className="w-4 h-4 text-amber-gold" />
              <span>{isAr ? "تحليل وتلخيص الفصول المنهجية" : "Pedagogical Chapter Summarizer"}</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            
            {/* WORKSPACE TAB 1: RAG CHAT BOT */}
            {activeSubTab === "chat" && (
              <motion.div
                key="chat-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="paper-card bg-white p-4 space-y-4 flex flex-col h-[550px]"
              >
                {/* Chat Control Bar */}
                <div className="border-b border-charcoal/10 pb-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#FAF8F5] p-2.5 rounded border border-charcoal/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-serif font-bold text-charcoal">
                      {isAr ? "الكتاب المدرسي المستهدف بالبحث:" : "Target school textbook to query:"}
                    </span>
                    <select
                      value={selectedBookForChat}
                      onChange={(e) => setSelectedBookForChat(e.target.value)}
                      className="bg-white border-2 border-charcoal text-xs p-1 font-sans rounded focus:outline-none focus:ring-1 focus:ring-amber-gold cursor-pointer"
                    >
                      <option value="custom">✍️ {isAr ? "📖 المنهج الجاهز المختار من القائمة" : "📖 Selected Arab Curriculum"}</option>
                      <option value="all">{isAr ? "📚 جميع الكتب المرفوعة في النظام" : "📚 All uploaded books combined"}</option>
                      {books.map(b => (
                        <option key={b.id} value={b.id}>📖 {b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">
                    RAG Engine: <span className="text-[#C5A021] font-bold">Gemini 3.5 Flash</span>
                  </div>
                </div>

                {/* Chat Messages Log */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 pl-1 max-h-[380px]" dir={isAr ? "rtl" : "ltr"}>
                  {chatMessages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col max-w-[85%] ${
                        msg.sender === "user" 
                          ? isAr ? "mr-auto" : "ml-auto" 
                          : isAr ? "ml-auto" : "mr-auto"
                      }`}
                    >
                      {/* Sender label */}
                      <span className={`text-[9px] font-mono mb-1 text-slate-500 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                        {msg.sender === "user" ? (isAr ? "المعلم" : "Teacher") : (isAr ? "المساعد الدراسي" : "Classroom Assistant")} • {msg.timestamp}
                      </span>

                      {/* Message bubble */}
                      <div 
                        className={`p-3.5 border-2 rounded-lg font-sans text-xs leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-charcoal text-[#FAF8F5] border-charcoal shadow-[2px_2px_0px_0px_#C5A021]"
                            : "bg-white text-charcoal border-charcoal/20 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {/* Citations block for assistant RAG results */}
                        {msg.sender === "assistant" && msg.citations && msg.citations.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-charcoal/10 space-y-1">
                            <span className="block text-[10px] font-serif font-bold text-[#C5A021]">
                              {isAr ? "📌 مقتبسات من مستند المنهج:" : "📌 Curriculum Citations:"}
                            </span>
                            <div className="space-y-1">
                              {msg.citations.map((cite, i) => (
                                <p key={i} className="text-[10px] font-mono text-slate-600 bg-[#FAF8F5] px-2 py-1 rounded border border-charcoal/5 italic">
                                  "{cite}"
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Mindful connection block */}
                        {msg.sender === "assistant" && msg.mindfulConnection && (
                          <div className="mt-3 p-2.5 bg-autumn-yellow/10 border-l-4 border-l-[#C5A021] rounded space-y-1">
                            <span className="block text-[10px] font-serif font-bold text-charcoal flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#C5A021]" />
                              <span>{isAr ? "لفتة صفية تأملية (بدون تشتيت):" : "Mindful Classroom Connection:"}</span>
                            </span>
                            <p className="text-[10px] text-slate-700 italic font-sans leading-relaxed">
                              {msg.mindfulConnection}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {chatLoading && (
                    <div className={`flex flex-col max-w-[80%] ${isAr ? "ml-auto" : "mr-auto"}`}>
                      <span className="text-[9px] font-mono mb-1 text-slate-500">
                        {isAr ? "جاري البحث في الكتب المرفوعة..." : "Searching selected textbook pages..."}
                      </span>
                      <div className="bg-[#FAF8F5] border-2 border-dashed border-charcoal/30 p-4 rounded-lg flex items-center gap-2.5">
                        <RefreshCw className="w-4 h-4 text-amber-gold animate-spin" />
                        <span className="text-xs font-mono text-slate-600">{isAr ? "استرجاع النصوص الذكي وصياغة الشرح..." : "Extracting paragraphs & preparing response..."}</span>
                      </div>
                    </div>
                  )}

                  {chatError && (
                    <div className="p-2.5 bg-red-50 text-red-900 border border-red-200 rounded text-xs font-mono">
                      {chatError}
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input Area */}
                <div className="border-t border-charcoal/10 pt-3 flex gap-2" dir={isAr ? "rtl" : "ltr"}>
                  <input
                    type="text"
                    value={chatQuery}
                    onChange={(e) => setChatQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendChatMessage();
                    }}
                    placeholder={
                      isAr 
                        ? `اسأل المساعد بخصوص كتاب: ${selectedBookForChat === "all" ? "جميع المناهج" : "الكتاب المحدد"}...`
                        : `Ask something about ${selectedBookForChat === "all" ? "all manuals" : "the selected textbook"}...`
                    }
                    className="flex-1 bg-[#FAF8F5] border-2 border-charcoal px-3 py-2 text-xs font-sans rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C5A021]"
                    disabled={chatLoading}
                  />
                  <button
                    onClick={handleSendChatMessage}
                    disabled={chatLoading}
                    className="px-4 py-2 bg-charcoal text-[#C5A021] border-2 border-charcoal rounded-lg hover:bg-charcoal/90 transition-all font-bold cursor-pointer flex items-center justify-center gap-1 flex-shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span className="text-xs hidden sm:inline">{isAr ? "إرسال" : "Send"}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* WORKSPACE TAB 2: SUMMARIZER */}
            {activeSubTab === "summarize" && (
              <motion.div
                key="summarize-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Upper options panel */}
                <div className="paper-card p-4 bg-white space-y-4">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-serif font-bold text-charcoal">
                        {isAr ? "المستند المراد تحليله وتلخيصه:" : "Document for analysis & summary:"}
                      </span>
                      <select
                        value={selectedBookForSum}
                        onChange={(e) => setSelectedBookForSum(e.target.value)}
                        className="bg-white border-2 border-charcoal text-xs p-1 font-sans rounded focus:outline-none focus:ring-1 focus:ring-amber-gold cursor-pointer"
                      >
                        <option value="custom">✍️ {isAr ? "📖 المنهج الجاهز المختار من القائمة" : "📖 Selected Arab Curriculum"}</option>
                        {books.map(b => (
                          <option key={b.id} value={b.id}>📖 {b.name}</option>
                        ))}
                      </select>
                    </div>

                    {selectedBookForSum === "custom" && (
                      <button
                        onClick={useSampleData}
                        className="text-[10px] font-mono text-amber-gold border border-amber-gold px-2 py-1 hover:bg-amber-gold hover:text-ivory transition-all cursor-pointer"
                      >
                        {isAr ? "استخدم مثال البن اليمني المدمج" : "Use Yemeni Coffee Sample"}
                      </button>
                    )}
                  </div>

                  {/* Text editor box for custom text input */}
                  {selectedBookForSum === "custom" ? (
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono font-bold text-slate-600 block">
                        {isAr ? "الصق صفحات المنهج أو الفصل الدراسي هنا:" : "Paste manual curriculum text below:"}
                      </label>
                      <textarea
                        value={documentText}
                        onChange={(e) => setDocumentText(e.target.value)}
                        placeholder={isAr ? "انسخ والصق فصول كتاب المدرسة أو النص التعليمي هنا للتحليل..." : "Copy and paste school textbook pages or teaching texts here..."}
                        rows={6}
                        className="w-full bg-[#FAF8F5] border-2 border-charcoal p-3 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-amber-gold leading-relaxed"
                      />
                    </div>
                  ) : (
                    <div className="bg-[#FAF8F5] p-4 border border-charcoal/10 rounded-lg text-center space-y-1">
                      <FileCheck className="w-8 h-8 text-green-700 mx-auto" />
                      <p className="text-xs font-serif font-bold text-charcoal">
                        {isAr ? "تم اختيار كتاب محفوظ بالكامل للتحليل" : "Entire saved curriculum book selected for parsing"}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {books.find(b => b.id === selectedBookForSum)?.name}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleSummarize}
                    disabled={loading}
                    className="w-full paper-btn-primary py-3 flex items-center justify-center gap-2 font-bold cursor-pointer text-xs"
                  >
                    <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    {loading ? (isAr ? "جاري تصفح طيات الكتاب بذكاء..." : "Reading textbook pages...") : (isAr ? "بدء التحليل والتلخيص البيداغوجي" : "Start Smart Pedagogical Analysis")}
                  </button>
                </div>

                {/* Summarization Output results */}
                {loading && (
                  <div className="paper-card p-12 bg-white text-center space-y-6 animate-pulse">
                    <Sparkles className="w-12 h-12 text-amber-gold animate-spin mx-auto" />
                    <div className="space-y-2">
                      <h4 className="text-lg font-serif font-bold text-charcoal">
                        {isAr ? "جاري تصفح طيات الكتاب واستخراج الأهداف..." : "Analyzing textbooks & weaving wisdom..."}
                      </h4>
                      <p className="text-xs text-charcoal/60 max-w-sm mx-auto leading-relaxed">
                        {isAr
                          ? "يقوم الذكاء الاصطناعي بدراسة النص واستخراج المهارات الملموسة وبناء هيكل تأملي يحد من ضجيج العالم الرقمي."
                          : "Extracting pedagogical structures, core concepts, and unplugged lesson suggestions."}
                      </p>
                    </div>
                  </div>
                )}

                {result && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Overall Summary Card */}
                    <div className="paper-card p-6 bg-white space-y-4 border-t-8 border-t-charcoal">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-xl font-serif font-bold text-charcoal">
                          {result.docTitle}
                        </h3>
                        <span className="text-xs font-mono px-2 py-0.5 bg-autumn-yellow/20 border border-charcoal rounded">
                          {isAr ? "تحليل بيداغوجي ذكي" : "Pedagogical Map"}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <h5 className="font-serif font-bold text-amber-gold">{isAr ? "الملخص التعليمي الشامل:" : "Overall Educational Summary:"}</h5>
                        <p className="text-charcoal/90 leading-relaxed font-sans">{result.overallSummary}</p>
                      </div>
                    </div>

                    {/* Objectives & Life Values Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Objectives */}
                      <div className="paper-card p-5 bg-[#FAF8F5] space-y-3">
                        <h5 className="font-serif font-bold text-charcoal border-b pb-1.5 text-base">
                          {isAr ? "الأهداف المنهجية المستخرجة:" : "Derived Objectives:"}
                        </h5>
                        <ul className="space-y-1.5 list-disc list-inside text-xs text-charcoal/90">
                          {result.keyObjectives.map((obj, i) => (
                            <li key={i} className="leading-relaxed">
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Values & Skills */}
                      <div className="paper-card p-5 bg-white space-y-3 border-l-4 border-l-amber-gold">
                        <h5 className="font-serif font-bold text-amber-gold border-b pb-1.5 text-base">
                          {isAr ? "القيم الملموسة والمهارات الحياتية:" : "Sensory Life Skills & Values:"}
                        </h5>
                        <ul className="space-y-1.5 list-disc list-inside text-xs text-charcoal/90">
                          {result.valuesAndSkills.map((val, i) => (
                            <li key={i} className="leading-relaxed">
                              {val}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Core Vocabulary Definitions */}
                    <div className="paper-card p-5 bg-white space-y-3">
                      <h5 className="font-serif font-bold text-charcoal border-b pb-1.5 text-base">
                        {isAr ? "المفردات اللغوية والمصطلحات الأساسية:" : "Key Vocabulary & Definitions:"}
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.coreConcepts.map((item, i) => (
                          <div key={i} className="bg-[#FAF8F5] p-3 border border-charcoal/10 rounded space-y-1">
                            <span className="font-serif font-bold text-amber-gold text-xs block">{item.term}</span>
                            <p className="text-[11px] text-charcoal/80 leading-relaxed">{item.definition}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Classroom Hooks */}
                    <div className="paper-card p-5 bg-[#FAF8F5] space-y-3">
                      <h5 className="font-serif font-bold text-charcoal border-b pb-1.5 text-base">
                        {isAr ? "أنشطة افتتاحية ووسائل صفية مقترحة (بدون شاشات):" : "Screen-Free Lesson Starters & Hooks:"}
                      </h5>
                      <ul className="space-y-1.5 list-none text-xs text-[#1A1A1A]">
                        {result.lessonHooks.map((hook, i) => (
                          <li key={i} className="flex items-start gap-2 bg-white p-2.5 border border-charcoal/5 rounded">
                            <CheckCircle2 className="w-4 h-4 text-autumn-yellow mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{hook}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Waddah Al-Zulail Philosophical Insight */}
                    <div className="paper-card p-6 bg-white border-2 border-charcoal rounded shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-3">
                      <div className="text-xs font-mono text-amber-gold font-bold uppercase tracking-widest">
                        {isAr ? "تأمل فلسفي عميق — بقلم وضاح الزليل" : "Sensory Educational Insight — by Waddah Al-Zulil"}
                      </div>
                      <blockquote className="text-base font-serif italic text-charcoal font-semibold leading-relaxed">
                        "{result.contemplativeInsight}"
                      </blockquote>
                      <div className="text-right text-[10px] font-mono text-charcoal/50">
                        {isAr ? "وضاح للنشر الرقمي © 2026 • العودة للمس والمشاهدة الواقعية" : "Waddah Digital Publishing © 2026 • Return to the Real"}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Golden/Bronze Advisory Note in Waddah's style */}
          <div className="paper-card p-4 bg-[#FAF8F5] border-2 border-charcoal text-xs space-y-1">
            <h4 className="font-serif font-bold text-charcoal flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-gold" />
              <span>{isAr ? "دليل توظيف المساعد التفاعلي" : "Curriculum RAG Guidelines"}</span>
            </h4>
            <p className="font-sans leading-relaxed text-slate-700">
              {isAr
                ? "ارفع الملفات التي تود مناقشتها وتدريسها لطلابك، المساعد يبني جسراً وثيقاً بين النصوص الجامدة والأنشطة الصفية الحية والمحسوسة، مما يربط طفولة تلامذتك بواقع ملموس هادئ."
                : "The RAG Assistant reads the uploaded manuals directly to contextualize curriculum summaries and unplugged lesson suggestions, ensuring school days are interactive and real."}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
