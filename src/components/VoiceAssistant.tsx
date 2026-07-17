import React, { useState, useEffect, useRef } from "react";
import { Language } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Volume2, VolumeX, Sparkles, AlertCircle, RefreshCw, Square, MessageSquare, Headphones, HelpCircle } from "lucide-react";

interface VoiceAssistantProps {
  lang: Language;
}

export default function VoiceAssistant({ lang }: VoiceAssistantProps) {
  const isAr = lang === "ar";
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Suggested Voice Commands
  const suggestionsAr = [
    "كيف أساعد طلابي على تقليل استخدام الهاتف؟",
    "اقترح نشاط قراءة هادئ وعميق لدرس اللغة العربية.",
    "أعطني نصيحة تربوية تأملية لهذا الصباح.",
    "فكرة للسيطرة على تشتت انتباه الطلاب دون أجهزة."
  ];

  const suggestionsEn = [
    "How do I help my students reduce mobile phone distraction?",
    "Suggest a screen-free reading exercise for Arabic literature.",
    "Give me a contemplative pedagogical tip for this morning.",
    "How can I capture student focus without using smart screens?"
  ];

  const suggestions = isAr ? suggestionsAr : suggestionsEn;

  useEffect(() => {
    // Check Speech Synthesis support
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize Web Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = isAr ? "ar-YE" : "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event);
        setIsListening(false);
        if (event.error === "not-allowed") {
          setError(
            isAr
              ? "صلاحية الميكروفون مرفوضة. يرجى تفعيل السماح بالوصول للميكروفون في المتصفح."
              : "Microphone access denied. Please enable microphone permissions in your browser."
          );
        } else {
          setError(isAr ? "لم يتم التقاط الصوت بوضوح، يرجى المحاولة مجدداً." : "Could not recognize speech clearly. Please try again.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleSubmitText(text);
      };

      recognitionRef.current = recognition;
    }

    // Cleanup speech on unmount
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [lang]);

  // Handle Voice Toggle
  const startListening = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    if (!recognitionRef.current) {
      setError(isAr ? "التعرف على الصوت غير مدعوم في متصفحك الحالي." : "Speech recognition is not supported in this browser.");
      return;
    }
    try {
      setTranscript("");
      recognitionRef.current.start();
    } catch (e) {
      console.error(e);
      recognitionRef.current.stop();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Submit Text/Voice to Gemini
  const handleSubmitText = async (textToSubmit: string) => {
    if (!textToSubmit.trim()) return;
    setLoading(true);
    setError(null);
    setAiResponse("");
    stopSpeaking();

    try {
      const response = await fetch("/api/gemini/voice-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSubmit,
          language: lang,
        }),
      });

      if (!response.ok) {
        let errMsg = isAr ? "فشل الاتصال بالمساعد الصوتي الذكي." : "Failed to connect to the Voice Assistant.";
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
      setAiResponse(data.reply);
      
      // Auto Speak the response
      speakText(data.reply);
    } catch (err: any) {
      console.error(err);
      setError(err.message || (isAr ? "حدث خطأ أثناء معالجة طلبك الصوتي." : "An error occurred while processing voice request."));
    } finally {
      setLoading(false);
    }
  };

  // Text-To-Speech Output
  const speakText = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel(); // Stop any current speech

    const utterance = new SpeechSynthesisUtterance(text);
    // Find a beautiful Arabic voice if exists, otherwise default
    if (isAr) {
      utterance.lang = "ar-EG"; // Or ar-SA
      const voices = synthRef.current.getVoices();
      const arVoice = voices.find((v) => v.lang.startsWith("ar"));
      if (arVoice) {
        utterance.voice = arVoice;
      }
    } else {
      utterance.lang = "en-US";
      const voices = synthRef.current.getVoices();
      const enVoice = voices.find((v) => v.lang.startsWith("en") && v.name.includes("Google"));
      if (enVoice) {
        utterance.voice = enVoice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="voice-assistant-tab">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-charcoal flex items-center gap-2">
          <Headphones className="w-6 h-6 text-amber-gold" />
          <span>{isAr ? "مساعد المعلم الصوتي الهادئ" : "Serene Teacher Voice Assistant"}</span>
        </h2>
        <p className="text-xs text-charcoal/70">
          {isAr
            ? "تحدث مباشرة مع المساعد الصوتي أو اختر إحدى اللفتات الفكرية ليوجهك بصوت دافئ ومريح نحو التدريس الفعال وتقليل ضجيج الأجهزة."
            : "Talk directly to your pedagogical advisor for audio-first guidance. Avoid digital fatigue by listening instead of reading."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Physical Radio / Hardware Speaker Device Design (5 cols) */}
        <div className="lg:col-span-5 paper-card bg-[#FAF8F5] border-4 border-charcoal overflow-hidden shadow-[4px_4px_0px_0px_#1A1A1A] p-6 space-y-6 relative">
          
          {/* Audio Status Header */}
          <div className="flex items-center justify-between border-b-2 border-charcoal pb-4">
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full ${isListening ? "bg-red-600 animate-pulse" : isSpeaking ? "bg-green-600 animate-pulse" : "bg-charcoal/30"}`}></span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal">
                {isListening ? (isAr ? "ميكروفون نشط" : "MIC ACTIVE") : isSpeaking ? (isAr ? "بث صوتي" : "AUDIO BROADCAST") : (isAr ? "جاهز للاستماع" : "IDLE / READY")}
              </span>
            </div>
            <div className="font-mono text-[10px] text-charcoal/60 bg-charcoal/5 px-2 py-0.5 rounded border border-charcoal/20">
              W-AUDIO MODEL-1
            </div>
          </div>

          {/* Sound Grille Design (Vintage Retro Vibe) */}
          <div className="bg-[#1A1A1A] text-[#C5A021] p-4 rounded-lg flex flex-col justify-center items-center h-48 space-y-4 border-2 border-charcoal shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#2c2c2c_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
            
            {/* Realtime voice wave mockup */}
            {(isListening || isSpeaking || loading) ? (
              <div className="flex items-center gap-1.5 h-12">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => {
                  const delay = (bar * 0.1).toFixed(1);
                  const height = loading ? "h-3" : isListening ? "h-10" : "h-8";
                  return (
                    <motion.span
                      key={bar}
                      animate={{
                        height: isListening 
                          ? ["12px", "40px", "16px", "48px", "12px"] 
                          : isSpeaking 
                          ? ["10px", "32px", "14px", "36px", "10px"]
                          : ["10px", "16px", "10px"]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        delay: parseFloat(delay),
                        ease: "easeInOut"
                      }}
                      className="w-1.5 bg-[#C5A021] rounded-full inline-block"
                    ></motion.span>
                  );
                })}
              </div>
            ) : (
              <Volume2 className="w-12 h-12 text-[#C5A021]/40" />
            )}

            <p className="text-[11px] font-mono font-bold tracking-wider text-center max-w-xs px-2 select-none">
              {isListening 
                ? (isAr ? "أنصت إليك بقلبٍ واعٍ... تحدث الآن" : "Listening with focus... Speak now") 
                : isSpeaking 
                ? (isAr ? "المساعد يتحدث الآن بصوت دافئ..." : "Broadcasting warm audio guidance...") 
                : loading
                ? (isAr ? "جاري التفكير والتأمل عبر الذكاء الاصطناعي..." : "Reflecting on your query...")
                : (isAr ? "اضغط على زر الميكروفون للتحدث" : "Press the Microphone to speak")}
            </p>
          </div>

          {/* Interactive Control Buttons */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-4">
              {/* Record Mic Button */}
              {isListening ? (
                <button
                  onClick={stopListening}
                  className="w-20 h-20 rounded-full bg-red-600 border-4 border-charcoal flex items-center justify-center text-white hover:bg-red-700 active:translate-y-0.5 cursor-pointer shadow-[2px_2px_0px_0px_#1A1A1A] transition-all"
                  title={isAr ? "إيقاف الميكروفون" : "Stop Recording"}
                >
                  <Square className="w-8 h-8 fill-white" />
                </button>
              ) : (
                <button
                  onClick={startListening}
                  className={`w-20 h-20 rounded-full bg-[#C5A021] border-4 border-charcoal flex items-center justify-center text-charcoal hover:bg-[#b08f1b] hover:text-white active:translate-y-0.5 cursor-pointer shadow-[3px_3px_0px_0px_#1A1A1A] transition-all ${isListening ? "animate-pulse" : ""}`}
                  title={isAr ? "تحدث الآن" : "Start Recording"}
                >
                  <Mic className="w-8 h-8" />
                </button>
              )}

              {/* Mute/Stop Speech Button */}
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="w-12 h-12 rounded-full bg-white border-2 border-charcoal text-charcoal hover:bg-[#FAF8F5] active:translate-y-0.5 cursor-pointer flex items-center justify-center shadow-[1px_1px_0px_0px_#1A1A1A]"
                  title={isAr ? "كتم الصوت" : "Mute Sound"}
                >
                  <VolumeX className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-3 bg-red-50 border-2 border-red-900 text-red-900 text-[11px] font-mono flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-900" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Non-support Warning */}
            {!speechSupported && (
              <div className="p-3 bg-amber-50 border-2 border-[#C5A021] text-charcoal text-[11px] font-mono flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#C5A021]" />
                <p>
                  {isAr 
                    ? "التعرف الصوتي المباشر غير مدعوم بالكامل في إطار متصفحك. لا تقلق، يمكنك استخدام لوحة المفاتيح والأسئلة السريعة أدناه لتلقي النصح والاستماع إليه صوتاً!"
                    : "Direct Speech Recognition is restricted in your current browser iframe. You can type or click the voice templates below and hear them read aloud!"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Interactive Response Panel & Preset Prompts (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Transcripted user voice */}
          {transcript && (
            <div className="paper-card p-4 bg-white space-y-1">
              <span className="text-[10px] font-mono text-charcoal/50 uppercase block">
                {isAr ? "الكلمات الملتقطة بصوتك:" : "Words captured from your voice:"}
              </span>
              <p className="text-sm font-bold text-charcoal italic">
                "{transcript}"
              </p>
            </div>
          )}

          {/* AI Response Display Card */}
          <div className="paper-card p-6 bg-white min-h-[220px] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b pb-2 mb-4">
                <h4 className="font-serif font-bold text-sm text-charcoal flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-gold animate-pulse" />
                  <span>{isAr ? "جواب مستشار التدريس الهادئ" : "Serene Pedagogical Guidance"}</span>
                </h4>
                {aiResponse && (
                  <button
                    onClick={() => speakText(aiResponse)}
                    className="paper-btn px-2.5 py-1 text-[10px] font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isAr ? "إعادة قراءة الصوت" : "Replay Speech"}</span>
                  </button>
                )}
              </div>

              {loading ? (
                <div className="space-y-3 py-6 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </div>
              ) : aiResponse ? (
                <div className="text-sm leading-relaxed text-charcoal font-serif space-y-3">
                  <p className="whitespace-pre-line bg-[#FAF8F5] p-4 border-l-4 border-amber-gold rounded">
                    {aiResponse}
                  </p>
                </div>
              ) : (
                <div className="text-center py-10 space-y-2 text-charcoal/50">
                  <MessageSquare className="w-12 h-12 mx-auto stroke-1" />
                  <p className="text-xs">
                    {isAr 
                      ? "اضغط الميكروفون وتكلم، أو انقر على أحد التساؤلات الجاهزة أدناه لبدء البث الصوتي التعليمي." 
                      : "Start speaking or tap any preset educational scenario below to generate serene auditory replies."}
                  </p>
                </div>
              )}
            </div>

            {/* Custom Text input fallback */}
            <div className="pt-4 border-t flex gap-2">
              <input
                type="text"
                placeholder={isAr ? "اكتب سؤالك التربوي هنا..." : "Type your educational question here..."}
                className="flex-1 bg-[#FAF8F5] border-2 border-charcoal p-2 text-xs focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const text = (e.target as HTMLInputElement).value;
                    if (text.trim()) {
                      setTranscript(text);
                      handleSubmitText(text);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  const text = input.value;
                  if (text.trim()) {
                    setTranscript(text);
                    handleSubmitText(text);
                    input.value = "";
                  }
                }}
                className="paper-btn-primary px-4 py-2 text-xs font-bold cursor-pointer"
              >
                {isAr ? "أرسل" : "Send"}
              </button>
            </div>
          </div>

          {/* Quick Voice Templates / Suggestions */}
          <div className="space-y-2">
            <h5 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-gold" />
              <span>{isAr ? "سيناريوهات وتساؤلات تربوية مقترحة:" : "Contemplative Inquiry Templates:"}</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(sug);
                    handleSubmitText(sug);
                  }}
                  className="paper-card p-3 bg-white text-start text-xs text-charcoal hover:bg-[#FAF8F5] hover:border-amber-gold transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-1 group"
                >
                  <p className="font-serif italic leading-relaxed group-hover:text-amber-gold">
                    "{sug}"
                  </p>
                  <span className="text-[9px] font-mono text-amber-600/70 block text-end pt-1">
                    {isAr ? "اضغط للمساءلة الصوتية ←" : "Tap for voice advisory ←"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
