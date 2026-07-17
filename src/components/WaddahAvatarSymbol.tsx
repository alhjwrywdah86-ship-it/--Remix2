import React from "react";

interface WaddahAvatarSymbolProps {
  className?: string;
  borderColor?: string;
}

export default function WaddahAvatarSymbol({
  className = "w-10 h-10",
  borderColor = "border-[#C5A021]"
}: WaddahAvatarSymbolProps) {
  return (
    <div className={`relative rounded-full border-2 bg-[#FAF8F5] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md ${borderColor} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Clip path to ensure perfect circular boundaries */}
        <defs>
          <clipPath id="circleClip">
            <circle cx="50" cy="50" r="44" />
          </clipPath>
        </defs>

        {/* Outer Golden/Bronze Emblem Ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="48" 
          fill="none" 
          stroke="#C5A021" 
          strokeWidth="3.5" 
        />
        
        {/* Fine dark hairline separation ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="46" 
          fill="none" 
          stroke="#1A1A1A" 
          strokeWidth="1.5" 
        />

        <g clipPath="url(#circleClip)">
          {/* Top third - Crimson Red */}
          <rect x="0" y="0" width="100" height="34" fill="#CE1126" />
          
          {/* Middle third - Ivory White */}
          <rect x="0" y="34" width="100" height="32" fill="#FAF8F5" />
          
          {/* Bottom third - Deep Charcoal/Black */}
          <rect x="0" y="66" width="100" height="34" fill="#1A1A1A" />
          
          {/* Elegant diagonal light reflection/sheen across the badge */}
          <path 
            d="M -10 30 L 110 -10 L 110 5 L -10 45 Z" 
            fill="#FFFFFF" 
            opacity="0.18" 
          />
          <path 
            d="M -10 50 L 110 10 L 110 18 L -10 58 Z" 
            fill="#FFFFFF" 
            opacity="0.08" 
          />

          {/* Golden inner accent ring */}
          <circle 
            cx="50" 
            cy="50" 
            r="42" 
            fill="none" 
            stroke="#C5A021" 
            strokeWidth="1.5" 
            opacity="0.9" 
          />
        </g>
        
        {/* Inner dark framing line for high contrast */}
        <circle 
          cx="50" 
          cy="50" 
          r="44" 
          fill="none" 
          stroke="#1A1A1A" 
          strokeWidth="2" 
        />
      </svg>
    </div>
  );
}

