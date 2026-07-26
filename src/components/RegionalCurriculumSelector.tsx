import React, { useState } from "react";
import { Language } from "../types";
import { REGIONAL_CURRICULA, RegionalCurriculum, getCurriculumByCode, setSavedCountryCode } from "../data/regionalCurricula";
import { Globe, Check, Sparkles, BookOpen, Layers, X, Flag } from "lucide-react";

interface RegionalCurriculumSelectorProps {
  lang: Language;
  activeCountryCode: string;
  onSelectCountry: (code: string) => void;
  variant?: "header" | "modal" | "inline";
}

export default function RegionalCurriculumSelector({
  lang,
  activeCountryCode,
  onSelectCountry,
  variant = "header",
}: RegionalCurriculumSelectorProps) {
  const isAr = lang === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const activeCurriculum = getCurriculumByCode(activeCountryCode);

  const handleSelect = (code: string) => {
    setSavedCountryCode(code);
    onSelectCountry(code);
    setIsOpen(false);
  };

  if (variant === "header") {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 bg-[#122846] hover:bg-[#1a3860] border border-[#C5A021]/60 rounded-xl text-xs font-mono font-bold text-amber-300 flex items-center gap-2 cursor-pointer transition-all shadow-sm"
          title={isAr ? "اختيار المنهج الدراسي الإقليمي" : "Select Regional Curriculum"}
        >
          <span className="text-base">{activeCurriculum.flag}</span>
          <span className="hidden sm:inline font-serif font-bold text-white text-[11px]">
            {isAr ? activeCurriculum.countryNameAr : activeCurriculum.countryNameEn}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#C5A021] animate-pulse" />
        </button>

        {isOpen && (
          <div className="absolute right-0 md:left-0 md:right-auto mt-2 w-80 bg-white text-slate-800 rounded-2xl shadow-2xl border-2 border-[#C5A021] z-50 overflow-hidden font-sans">
            <div className="bg-[#1A365D] text-white p-3.5 flex items-center justify-between border-b border-[#C5A021]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C5A021]" />
                <span className="font-bold text-xs font-serif text-[#C5A021]">
                  {isAr ? "اختيار المنهج التعليمي المعتمد" : "Select Ministry Curriculum"}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
              <p className="text-[10px] text-slate-500 px-2 py-1 font-mono">
                {isAr
                  ? "تعتمد أدوات الذكاء الاصطناعي والتحضير التلقائي على المنهج المحدد:"
                  : "AI generation and tools adapt to the active country curriculum:"}
              </p>

              {REGIONAL_CURRICULA.map((curr) => {
                const isSelected = curr.code === activeCountryCode;
                return (
                  <button
                    key={curr.code}
                    onClick={() => handleSelect(curr.code)}
                    className={`w-full p-2.5 rounded-xl text-start flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-50 border-2 border-[#C5A021] text-[#1A365D]"
                        : "hover:bg-slate-50 border border-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{curr.flag}</span>
                      <div>
                        <div className="font-serif font-bold text-xs">
                          {isAr ? curr.countryNameAr : curr.countryNameEn}
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans truncate max-w-[180px]">
                          {isAr ? curr.ministryNameAr : curr.ministryNameEn}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 bg-[#C5A021] text-[#1A365D] rounded-full flex items-center justify-center font-bold">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 font-sans">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Globe className="w-5 h-5 text-[#C5A021]" />
        <h3 className="font-serif font-bold text-sm text-[#1A365D]">
          {isAr ? "المنهج الإقليمي النشط لأدوات الذكاء الاصطناعي" : "Active Regional AI Curriculum"}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {REGIONAL_CURRICULA.map((curr) => {
          const isSelected = curr.code === activeCountryCode;
          return (
            <button
              key={curr.code}
              onClick={() => handleSelect(curr.code)}
              className={`p-3.5 rounded-xl text-start flex items-center gap-3 transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#1A365D] text-white border-2 border-[#C5A021] shadow-md"
                  : "bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800"
              }`}
            >
              <span className="text-2xl">{curr.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="font-serif font-bold text-xs truncate">
                  {isAr ? curr.countryNameAr : curr.countryNameEn}
                </div>
                <div className={`text-[10px] truncate ${isSelected ? "text-amber-300" : "text-slate-500"}`}>
                  {isAr ? curr.ministryNameAr : curr.ministryNameEn}
                </div>
              </div>
              {isSelected && <Check className="w-4 h-4 text-[#C5A021]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
