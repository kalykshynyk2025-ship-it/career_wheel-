/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { Criterion } from "../types";
import { Download, Sparkles, Edit3, ChevronDown, ChevronUp, Check, Plus, Minus } from "lucide-react";
import { Language, TRANSLATIONS } from "../translations";

interface TargetWheelCardProps {
  criteria: Criterion[];
  onChangeCriteria?: (criteria: Criterion[]) => void;
  onUpdateTargetScore?: (id: string, targetScore: number) => void;
  lang: Language;
  theme: "dark" | "light";
  activeWheelTitle?: string;
  colorMode: "palette" | "scores";
  colorCritical: string;
  colorRoutine: string;
  colorComfort: string;
  colorPeak: string;
}

const PALETTE = [
  "#C5A059", // Signature Gold
  "#DFC182", // Champagne
  "#9E8047", // Antique Brass
  "#BCA068", // Muted Gold
  "#E5C17D", // Golden Sand
  "#8A6D3B", // Bronze
  "#A38A5E", // Vintage Gold
  "#D4AF37", // Metallic Gold
  "#C3B091", // Khaki Gold
  "#B38B41", // Dark Ochre
];

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
};

const getWedgePath = (cx: number, cy: number, startDeg: number, endDeg: number, innerR: number, outerR: number) => {
  const startOuter = polarToCartesian(cx, cy, outerR, startDeg);
  const endOuter = polarToCartesian(cx, cy, outerR, endDeg);
  const startInner = polarToCartesian(cx, cy, innerR, startDeg);
  const endInner = polarToCartesian(cx, cy, innerR, endDeg);
  const largeArcFlag = endDeg - startDeg <= 180 ? "0" : "1";
  return [
    `M ${startInner.x} ${startInner.y}`,
    `L ${startOuter.x} ${startOuter.y}`,
    `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
    "Z"
  ].join(" ");
};

export function TargetWheelCard({
  criteria,
  onChangeCriteria,
  onUpdateTargetScore,
  lang,
  theme,
  activeWheelTitle = "My Career Wheel",
  colorMode,
  colorCritical,
  colorRoutine,
  colorComfort,
  colorPeak
}: TargetWheelCardProps) {
  const isDark = theme === "dark";
  const t = TRANSLATIONS[lang];
  const svgRef = useRef<SVGSVGElement>(null);
  const [showEditor, setShowEditor] = useState<boolean>(true);

  const getWedgeColor = (score: number, idx: number) => {
    if (colorMode === "palette") {
      return PALETTE[idx % PALETTE.length];
    }
    if (score <= 3) return colorCritical;
    if (score <= 6) return colorRoutine;
    if (score <= 8) return colorComfort;
    return colorPeak;
  };

  const handleTargetUpdate = (id: string, newTarget: number) => {
    const clamped = Math.min(10, Math.max(1, newTarget));
    if (onUpdateTargetScore) {
      onUpdateTargetScore(id, clamped);
    } else if (onChangeCriteria) {
      onChangeCriteria(criteria.map(c => c.id === id ? { ...c, targetScore: clamped } : c));
    }
  };

  const handleSvgClick = (event: React.MouseEvent<SVGGElement>, idx: number, id: string) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Scale to viewBox 320x320
    const svgX = (mouseX / rect.width) * 320;
    const svgY = (mouseY / rect.height) * 320;

    const cx = 160;
    const cy = 160;
    const dx = svgX - cx;
    const dy = svgY - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const rInner = 30;
    const rOuter = 110;

    if (distance <= rInner) {
      handleTargetUpdate(id, 1);
    } else if (distance >= rOuter) {
      handleTargetUpdate(id, 10);
    } else {
      const percentage = (distance - rInner) / (rOuter - rInner);
      const score = Math.min(10, Math.max(1, Math.round(1 + percentage * 9)));
      handleTargetUpdate(id, score);
    }
  };

  const exportTargetWheelPNG = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 650;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = isDark ? "#0A0A0B" : "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title text
    ctx.fillStyle = isDark ? "#FFFFFF" : "#1E293B";
    ctx.font = "bold 18px Inter, sans-serif";
    ctx.textAlign = "center";
    const titleText = lang === "en" 
      ? "Target Career Balance Wheel" 
      : lang === "chm" 
        ? "Карьер кушмо орава (Цель)" 
        : lang === "sah" 
          ? "Карьера сайдыытын эргимтэтэ (Сыал)" 
          : "Колесо карьерного роста (Цели)";
    ctx.fillText(titleText, 300, 45);

    const cx = 300;
    const cy = 310;
    const crInner = 70;
    const crOuter = 220;
    const crStep = (crOuter - crInner) / 10;

    // Concentric rings
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1;
    for (let l = 1; l <= 10; l++) {
      const r = crInner + l * crStep;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.stroke();

      // Label concentric ring scores
      ctx.fillStyle = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
      ctx.font = "bold 11px Inter, monospace";
      ctx.fillText(l.toString(), cx - 5, cy - r + 3);
    }

    const N = criteria.length;
    if (N > 0) {
      const angleStep = (2 * Math.PI) / N;
      criteria.forEach((crit, idx) => {
        const targetVal = crit.targetScore ?? crit.score;
        const currentVal = crit.score;
        const colorTarget = getWedgeColor(targetVal, idx);
        const colorCurrent = getWedgeColor(currentVal, idx);
        const startRad = idx * angleStep - Math.PI / 2;
        const endRad = (idx + 1) * angleStep - Math.PI / 2;
        
        // Target slice (drawn with lighter opacity)
        const valRadiusTarget = crInner + (targetVal / 10) * (crOuter - crInner);
        ctx.save();
        ctx.fillStyle = colorTarget;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(cx, cy, valRadiusTarget, startRad, endRad);
        ctx.lineTo(cx + crInner * Math.cos(endRad), cy + crInner * Math.sin(endRad));
        ctx.arc(cx, cy, crInner, endRad, startRad, true);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Current slice (layered with solid opacity)
        const valRadiusCurrent = crInner + (currentVal / 10) * (crOuter - crInner);
        ctx.save();
        ctx.fillStyle = colorCurrent;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(cx, cy, valRadiusCurrent, startRad, endRad);
        ctx.lineTo(cx + crInner * Math.cos(endRad), cy + crInner * Math.sin(endRad));
        ctx.arc(cx, cy, crInner, endRad, startRad, true);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Stroke wedge
        ctx.strokeStyle = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, valRadiusTarget, startRad, endRad);
        ctx.lineTo(cx + crInner * Math.cos(endRad), cy + crInner * Math.sin(endRad));
        ctx.arc(cx, cy, crInner, endRad, startRad, true);
        ctx.closePath();
        ctx.stroke();

        // Rays separating slices
        ctx.strokeStyle = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx + crInner * Math.cos(startRad), cy + crInner * Math.sin(startRad));
        ctx.lineTo(cx + crOuter * Math.cos(startRad), cy + crOuter * Math.sin(startRad));
        ctx.stroke();

        // Labels at outer edge
        const midRad = startRad + angleStep / 2;
        const labelX = cx + (crOuter + 22) * Math.cos(midRad);
        const labelY = cy + (crOuter + 22) * Math.sin(midRad);
        
        ctx.fillStyle = isDark ? "rgba(255,255,255,0.7)" : "#475569";
        ctx.font = "bold 13px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText((idx + 1).toString(), labelX, labelY);
      });
    }

    // Legend at bottom of PNG
    ctx.textAlign = "center";
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.6)" : "#475569";
    ctx.font = "11px Inter, sans-serif";
    const currentText = lang === "en" ? "Current Level" : lang === "chm" ? "Кызытсе уровень" : lang === "sah" ? "БилиҥҤи таҺым" : "Текущий уровень";
    const growthText = lang === "en" ? "Growth (Target)" : lang === "chm" ? "Вияҥмаш (Цель)" : lang === "sah" ? "Сайдыы (Сыал)" : "Прирост (Цель)";
    ctx.fillText(`●  ${currentText}   |   ○  ${growthText}`, 300, 580);

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const sanitizedTitle = activeWheelTitle.toLowerCase().replace(/[^a-z0-9а-яё]/gi, "_");
    link.download = `career_target_wheel_${sanitizedTitle}.png`;
    link.href = dataUrl;
    link.click();
  };

  if (criteria.length === 0) return null;

  return (
    <div className={`rounded-2xl border p-6 shadow-xl transition-all duration-200 ${
      isDark ? "border-white/10 bg-[#0F0F12]" : "border-zinc-200 bg-white"
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className={`text-base sm:text-lg font-light font-serif tracking-tight leading-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
              {lang === "en" 
                ? "Target Career Balance Wheel" 
                : lang === "chm" 
                  ? "Карьер кушмо орава (Цель)" 
                  : lang === "sah" 
                    ? "Карьера сайдыытын эргимтэтэ (Сыал)" 
                    : "Колесо карьерного роста (Цели)"}
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-zinc-500"}`}>
              {lang === "en" 
                ? "Visualized target growth points contrasted with current status" 
                : "Визуализированные целевые точки роста в сопоставлении с текущим состоянием"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            onClick={exportTargetWheelPNG}
            className="flex items-center gap-1.5 rounded-xl border border-[#C5A059]/40 bg-[#C5A059]/10 px-3.5 py-1.5 text-xs font-bold text-[#DFC182] hover:bg-[#C5A059]/20 transition cursor-pointer active:scale-95 shadow-md"
            title={lang === "en" ? "Save PNG" : "Сохранить PNG"}
          >
            <Download className="h-3.5 w-3.5 text-[#C5A059]" />
            <span>{lang === "en" ? "Save PNG" : "Сохранить PNG"}</span>
          </button>
          
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
            {lang === "en" ? "growth" : lang === "chm" ? "вияҥмаш" : lang === "sah" ? "сайдыы" : "рост"}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 py-4">
        <div className="relative">
          <svg ref={svgRef} width="280" height="280" viewBox="0 0 320 320" className="mx-auto overflow-visible select-none">
            {/* Concentric rings */}
            {Array.from({ length: 10 }).map((_, i) => {
              const l = i + 1;
              const r = 30 + (l / 10) * (110 - 30);
              return (
                <circle
                  key={i}
                  cx={160}
                  cy={160}
                  r={r}
                  fill="none"
                  stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}
                  strokeWidth={1}
                />
              );
            })}
            
            {/* Wedge slices */}
            {criteria.map((crit, idx) => {
              const sliceAngle = criteria.length > 0 ? 360 / criteria.length : 0;
              const startDeg = idx * sliceAngle;
              const endDeg = (idx + 1) * sliceAngle;
              const targetVal = crit.targetScore ?? crit.score;
              const currentVal = crit.score;
              
              const rCurrent = 30 + (currentVal / 10) * (110 - 30);
              const rTarget = 30 + (targetVal / 10) * (110 - 30);
              
              const pathFull = getWedgePath(160, 160, startDeg, endDeg, 30, 110);
              const pathTarget = getWedgePath(160, 160, startDeg, endDeg, 30, rTarget);
              const pathCurrent = getWedgePath(160, 160, startDeg, endDeg, 30, rCurrent);
              
              const colorCurrent = getWedgeColor(currentVal, idx);
              const colorTarget = getWedgeColor(targetVal, idx);
              
              return (
                <g key={crit.id} className="cursor-pointer group" onClick={(e) => handleSvgClick(e, idx, crit.id)}>
                  {/* Invisible full wedge hit target */}
                  <path
                    d={pathFull}
                    fill="transparent"
                  />

                  {/* Target slice with light opacity */}
                  <path
                    d={pathTarget}
                    fill={colorTarget}
                    fillOpacity={0.22}
                    stroke={colorTarget}
                    strokeWidth={1.5}
                    className="transition-all duration-300 group-hover:fill-opacity-35"
                  />
                  
                  {/* Current slice layered with more solid opacity */}
                  <path
                    d={pathCurrent}
                    fill={colorCurrent}
                    fillOpacity={0.8}
                    stroke={colorCurrent}
                    strokeWidth={1.5}
                    className="transition-all duration-300 pointer-events-none"
                  />
                  
                  {/* Radial separator line */}
                  {(() => {
                    const radialLine = polarToCartesian(160, 160, 110, startDeg);
                    const innerLine = polarToCartesian(160, 160, 30, startDeg);
                    return (
                      <line
                        x1={innerLine.x}
                        y1={innerLine.y}
                        x2={radialLine.x}
                        y2={radialLine.y}
                        stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}
                        strokeWidth={1}
                      />
                    );
                  })()}

                  {/* Numeric indicator */}
                  {(() => {
                    const midDeg = startDeg + sliceAngle / 2;
                    const labelPos = polarToCartesian(160, 160, 122, midDeg);
                    return (
                      <text
                        x={labelPos.x}
                        y={labelPos.y}
                        fill={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.6)"}
                        fontSize={9}
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {idx + 1}
                      </text>
                    );
                  })()}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend Panel & Quick summary */}
        <div className={`flex flex-col gap-3 max-w-sm rounded-xl p-4 border ${
          isDark ? "bg-[#0D0D0F]/50 border-white/5" : "bg-zinc-50 border-zinc-150"
        }`}>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: `${getWedgeColor(7, 0)}bf` }} />
              <span className={isDark ? "text-white/80" : "text-zinc-700 font-medium"}>
                {lang === "en" ? "Current Level" : lang === "chm" ? "Кызытсе уровень" : lang === "sah" ? "БилиҥҤи таҺым" : "Текущий уровень"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm border" style={{ borderColor: getWedgeColor(9, 0), backgroundColor: `${getWedgeColor(9, 0)}33` }} />
              <span className={isDark ? "text-white/80" : "text-zinc-700 font-medium"}>
                {lang === "en" ? "Growth (Target)" : lang === "chm" ? "Вияҥмаш (Цель)" : lang === "sah" ? "Сайдыы (Сыал)" : "Прирост (Цель)"}
              </span>
            </div>
          </div>
          
          <p className={`text-[11px] leading-relaxed border-t pt-3.5 ${
            isDark ? "text-white/40 border-white/5" : "text-zinc-500 border-zinc-200"
          }`}>
            {lang === "en" 
              ? "Click directly on any wedge of the target wheel above or adjust the sliders below to set target scores (1–10) for each criterion." 
              : "Нажимайте прямо на секторы целевого колеса выше или используйте ползунки ниже, чтобы задать целевые баллы (1–10) по каждому критерию."}
          </p>
        </div>
      </div>

      {/* Interactive Target Score Editor List */}
      <div className={`mt-6 border-t pt-5 ${isDark ? "border-white/5" : "border-zinc-200"}`}>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowEditor(!showEditor)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059] hover:text-[#DFC182] transition cursor-pointer"
          >
            <Edit3 className="h-4 w-4" />
            <span>
              {lang === "en" 
                ? "Edit Target Scores (Wheel 2)" 
                : lang === "chm" 
                  ? "Целевой балл-влакым тӧрлатымаш" 
                  : lang === "sah" 
                    ? "Сыал баалларын уларытыы" 
                    : "Редактирование целевых баллов (Колесо 2)"}
            </span>
            {showEditor ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          <span className={`text-[11px] ${isDark ? "text-white/40" : "text-zinc-500"}`}>
            {lang === "en" ? "Click wheel or use sliders below" : "Нажмите на колесо или двигайте слайдеры"}
          </span>
        </div>

        {showEditor && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1.5 custom-scrollbar">
            {criteria.map((crit, idx) => {
              const currentScore = crit.score;
              const targetScore = crit.targetScore ?? currentScore;
              const color = getWedgeColor(targetScore, idx);
              return (
                <div
                  key={crit.id}
                  className={`flex flex-col gap-2 rounded-xl border p-3 transition-all ${
                    isDark 
                      ? "border-white/5 bg-[#0D0D0F] hover:border-white/10" 
                      : "border-zinc-150 bg-zinc-50 hover:border-zinc-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold truncate max-w-[180px] ${isDark ? "text-white" : "text-zinc-800"}`} title={crit.name}>
                      <span className="text-[#C5A059] font-mono mr-1.5">{idx + 1}.</span>
                      {crit.name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] ${isDark ? "text-white/40" : "text-zinc-500"}`}>
                        {lang === "en" ? "Cur" : "Факт"}: <b className={isDark ? "text-white" : "text-zinc-800"}>{currentScore}</b>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md text-[#0A0A0B]" style={{ backgroundColor: color }}>
                        {lang === "en" ? "Goal" : "Цель"}: {targetScore}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTargetUpdate(crit.id, targetScore - 1)}
                      disabled={targetScore <= 1}
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border text-xs font-bold transition active:scale-95 disabled:opacity-30 cursor-pointer ${
                        isDark 
                          ? "border-white/10 bg-white/5 text-white hover:bg-white/10" 
                          : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={targetScore}
                      onChange={(e) => handleTargetUpdate(crit.id, parseInt(e.target.value))}
                      className={`h-1.5 w-full cursor-pointer appearance-none rounded-lg outline-none accent-[#C5A059] ${
                        isDark ? "bg-white/10" : "bg-zinc-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleTargetUpdate(crit.id, targetScore + 1)}
                      disabled={targetScore >= 10}
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border text-xs font-bold transition active:scale-95 disabled:opacity-30 cursor-pointer ${
                        isDark 
                          ? "border-white/10 bg-white/5 text-white hover:bg-white/10" 
                          : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
