/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Criterion } from "../types";
import { 
  Target, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  ListTodo,
  FileText,
  Plus,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Language, TRANSLATIONS } from "../translations";
import { generatePseudoAiSteps } from "../coaching-context";

interface CareerPlanProps {
  criteria: Criterion[];
  onChangeCriteria: (criteria: Criterion[]) => void;
  lang: Language;
  theme: "dark" | "light";
  activeUsername?: string;
  activeWheelTitle?: string;
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

const GET_STRATEGY = (score: number, target: number, lang: Language): { text: string; colorClass: string } => {
  const t = TRANSLATIONS[lang];
  if (target > score) {
    return { 
      text: t.strategyGrowth, 
      colorClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 dark:bg-emerald-500/25 dark:text-emerald-300"
    };
  } else if (target < score) {
    return { 
      text: t.strategyOptimization, 
      colorClass: "bg-amber-500/10 text-amber-400 border-amber-500/20 dark:bg-amber-500/25 dark:text-amber-300" 
    };
  } else {
    return { 
      text: t.strategyMaintain, 
      colorClass: "bg-[#C5A059]/10 text-[#DFC182] border-[#C5A059]/20 dark:bg-[#C5A059]/20 dark:text-[#DFC182]" 
    };
  }
};

export function CareerPlan({ 
  criteria, 
  onChangeCriteria, 
  lang, 
  theme,
  activeUsername = "Guest",
  activeWheelTitle = "My Career Wheel"
}: CareerPlanProps) {
  const isDark = theme === "dark";
  const [expandedId, setExpandedId] = useState<string | null>(criteria[0]?.id || null);
  const t = TRANSLATIONS[lang];

  const handleUpdateCriterion = (id: string, updates: Partial<Criterion>) => {
    onChangeCriteria(
      criteria.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleStepChange = (id: string, stepIdx: number, val: string) => {
    const crit = criteria.find((c) => c.id === id);
    if (!crit) return;
    const currentSteps = crit.steps ? [...crit.steps] : ["", "", "", ""];
    currentSteps[stepIdx] = val;
    handleUpdateCriterion(id, { steps: currentSteps });
  };

  const handleAutoGenerate = (crit: Criterion) => {
    const target = crit.targetScore ?? crit.score;
    // Uses the smart pseudo-AI engine loaded with coaching insights
    const presets = generatePseudoAiSteps(crit.name, crit.score, target, lang);
    handleUpdateCriterion(crit.id, { 
      targetScore: target,
      steps: presets 
    });
  };

  // Standalone high-quality canvas rendering engine for the plan matrix
  const drawPlanCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    canvas.width = 1500;
    canvas.height = 1600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Golden header line
    ctx.fillStyle = "#C5A059";
    ctx.fillRect(0, 0, canvas.width, 15);

    // Header title block
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 32px Inter, system-ui, sans-serif";
    ctx.fillText(t.careerPlanTitle.toUpperCase(), 70, 90);

    ctx.fillStyle = "#64748B";
    ctx.font = "500 18px Inter, system-ui, sans-serif";
    const localeStr = lang === "en" ? "en-US" : lang === "chm" ? "chm-RU" : lang === "sah" ? "sah-RU" : "ru-RU";
    const dateStr = new Date().toLocaleDateString(localeStr, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    ctx.fillText(`${t.userLabel}: ${activeUsername}  |  Date: ${dateStr}`, 70, 130);

    // Elegant separator line
    ctx.strokeStyle = "#F1F5F9";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(70, 160);
    ctx.lineTo(1430, 160);
    ctx.stroke();

    const startX = 70;
    const startY = 195;
    const cardWidth = 660;
    const cardHeight = 185;
    const colGap = 40;
    const rowGap = 20;

    criteria.forEach((crit, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = startX + col * (cardWidth + colGap);
      const y = startY + row * (cardHeight + rowGap);

      if (y + cardHeight > 1020) return;

      // Card Background with fine stroke
      ctx.fillStyle = "#F8FAFC";
      ctx.fillRect(x, y, cardWidth, cardHeight);
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, cardWidth, cardHeight);

      // Gold highlight
      ctx.fillStyle = "#C5A059";
      ctx.fillRect(x, y, 6, cardHeight);

      // Sphere counter badge
      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(x + 35, y + 35, 15, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText((i + 1).toString(), x + 35, y + 39);
      ctx.textAlign = "left";

      // Sphere Title
      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 16px Inter, sans-serif";
      let nameText = crit.name;
      const maxNameWidth = 400;
      if (ctx.measureText(nameText).width > maxNameWidth) {
        while (ctx.measureText(nameText + "...").width > maxNameWidth && nameText.length > 0) {
          nameText = nameText.substring(0, nameText.length - 1);
        }
        nameText = nameText + "...";
      }
      ctx.fillText(nameText, x + 65, y + 41);

      // Scores (Now -> Target)
      ctx.fillStyle = "#475569";
      ctx.font = "bold 13px Inter, monospace";
      const targetVal = crit.targetScore ?? crit.score;
      const progressLabel = `${crit.score} → ${targetVal}`;
      ctx.fillText(progressLabel, x + cardWidth - 80, y + 40);

      // Strategy Label
      const strategy = GET_STRATEGY(crit.score, targetVal, lang);
      let strategyColor = "#C5A059";
      if (targetVal > crit.score) {
        strategyColor = "#10B981";
      } else if (targetVal < crit.score) {
        strategyColor = "#F59E0B";
      } else {
        strategyColor = "#475569";
      }

      ctx.fillStyle = strategyColor;
      ctx.fillRect(x + 65, y + 54, 130, 18);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 8px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(strategy.text.toUpperCase(), x + 65 + 65, y + 66);
      ctx.textAlign = "left";

      // Inner thin divider
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 20, y + 80);
      ctx.lineTo(x + cardWidth - 20, y + 80);
      ctx.stroke();

      // Render actual steps
      const steps = crit.steps || [];
      const hasSteps = steps.some(s => s.trim() !== "");

      if (!hasSteps) {
        ctx.fillStyle = "#94A3B8";
        ctx.font = "italic 12px Inter, sans-serif";
        const emptyPlanStr = lang === "en" ? "No development action steps set for this sphere yet." : "Шаги развития для данной сферы пока не заполнены.";
        ctx.fillText(emptyPlanStr, x + 35, y + 130);
      } else {
        let stepCount = 0;
        steps.forEach((step, sIdx) => {
          if (step.trim() && stepCount < 4) {
            const stepY = y + 101 + stepCount * 20;
            ctx.fillStyle = "#C5A059";
            ctx.font = "bold 12px Inter, sans-serif";
            ctx.fillText(`•`, x + 30, stepY);
            ctx.fillStyle = "#334155";
            ctx.font = "500 12px Inter, sans-serif";
            
            let sText = step;
            const maxStepWidth = cardWidth - 75;
            if (ctx.measureText(sText).width > maxStepWidth) {
              while (ctx.measureText(sText + "...").width > maxStepWidth && sText.length > 0) {
                sText = sText.substring(0, sText.length - 1);
              }
              sText = sText + "...";
            }
            ctx.fillText(sText, x + 45, stepY);
            stepCount++;
          }
        });
      }
    });

    // Draw a divider line above the wheels
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(70, 1020);
    ctx.lineTo(1430, 1020);
    ctx.stroke();

    // Wheel Title Headers
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 20px Inter, sans-serif";
    ctx.textAlign = "center";
    
    const currentWheelLabel = lang === "en" ? "CURRENT BALANCE" : lang === "chm" ? "КЫЗЫТСЕ БАЛАНС" : lang === "sah" ? "БИЛИҤҤИ ТЭҤНЭҺИК" : "ТЕКУЩИЙ БАЛАНС";
    const targetWheelLabel = lang === "en" ? "TARGET GROWTH GOALS" : lang === "chm" ? "ВИЯҤМАШ ЦЕЛЬ-ВЛАК" : lang === "sah" ? "САЙДЫЫ СЫАЛЛАРА" : "ЦЕЛЕВОЙ РОСТ И ПЛАНЫ";
    
    ctx.fillText(currentWheelLabel, 420, 1060);
    ctx.fillText(targetWheelLabel, 1080, 1060);
    ctx.textAlign = "left"; // reset

    const N = criteria.length;
    // Draw wheels!
    const drawSingleWheelOnCanvas = (cx: number, cy: number, isTarget: boolean) => {
      const crInner = 50;
      const crOuter = 160;
      const crStep = (crOuter - crInner) / 10;

      // Concentric rings
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1;
      for (let l = 1; l <= 10; l++) {
        const r = crInner + l * crStep;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.stroke();

        // Label concentric ring scores
        ctx.fillStyle = "#94A3B8";
        ctx.font = "bold 10px Inter, monospace";
        ctx.fillText(l.toString(), cx - 5, cy - r + 3);
      }

      // Slices
      if (N > 0) {
        const angleStep = (2 * Math.PI) / N;
        criteria.forEach((crit, idx) => {
          const score = isTarget ? (crit.targetScore ?? crit.score) : crit.score;
          const color = PALETTE[idx % PALETTE.length];
          const startRad = idx * angleStep - Math.PI / 2;
          const endRad = (idx + 1) * angleStep - Math.PI / 2;
          const valRadius = crInner + (score / 10) * (crOuter - crInner);

          // Fill wedge
          ctx.save();
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.85;
          ctx.beginPath();
          ctx.arc(cx, cy, valRadius, startRad, endRad);
          ctx.lineTo(cx + crInner * Math.cos(endRad), cy + crInner * Math.sin(endRad));
          ctx.arc(cx, cy, crInner, endRad, startRad, true);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          // Stroke wedge
          ctx.strokeStyle = "rgba(0,0,0,0.15)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx, cy, valRadius, startRad, endRad);
          ctx.lineTo(cx + crInner * Math.cos(endRad), cy + crInner * Math.sin(endRad));
          ctx.arc(cx, cy, crInner, endRad, startRad, true);
          ctx.closePath();
          ctx.stroke();

          // Rays
          ctx.strokeStyle = "#E2E8F0";
          ctx.beginPath();
          ctx.moveTo(cx + crInner * Math.cos(startRad), cy + crInner * Math.sin(startRad));
          ctx.lineTo(cx + crOuter * Math.cos(startRad), cy + crOuter * Math.sin(startRad));
          ctx.stroke();

          // Labels (1, 2, 3...) at outer edge
          const midRad = startRad + angleStep / 2;
          const labelX = cx + (crOuter + 20) * Math.cos(midRad);
          const labelY = cy + (crOuter + 20) * Math.sin(midRad);
          
          ctx.fillStyle = "#475569";
          ctx.font = "bold 12px Inter, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText((idx + 1).toString(), labelX, labelY);
        });
      }
    };

    drawSingleWheelOnCanvas(420, 1270, false);
    drawSingleWheelOnCanvas(1080, 1270, true);

    // Footnote
    ctx.fillStyle = "#94A3B8";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText(`${t.title} — Career Development Report`, 70, 1540);
    ctx.textAlign = "right";
    ctx.fillText("Сгенерировано локально и конфиденциально", 1430, 1540);

    return canvas;
  };

  const exportPlanPNG = () => {
    const canvas = drawPlanCanvas();
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const sanitizedTitle = activeWheelTitle.toLowerCase().replace(/[^a-z0-9а-яё]/gi, "_");
    link.download = `career_development_plan_${sanitizedTitle}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className={`rounded-2xl border p-6 shadow-xl transition-all duration-200 space-y-8 ${
      isDark ? "border-white/10 bg-[#0F0F12]" : "border-zinc-200 bg-white"
    }`}>
      {/* Block Header with title, description, and export PNG plan button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] shadow-inner">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className={`text-base sm:text-lg font-light font-serif flex items-center flex-wrap gap-2 leading-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
              {t.careerPlanTitle}
            </h3>
            <p className={`text-xs mt-1 leading-normal ${isDark ? "text-white/40" : "text-zinc-500"}`}>
              {t.careerPlanDesc}
            </p>
          </div>
        </div>

        {criteria.length > 0 && (
          <button
            onClick={exportPlanPNG}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#C5A059] px-4 py-2.5 text-xs font-bold text-[#0A0A0B] hover:bg-[#DFC182] active:scale-95 transition cursor-pointer self-start md:self-auto shrink-0 shadow-lg"
          >
            <Download className="h-4 w-4" />
            {t.careerPlanSavePngBtn}
          </button>
        )}
      </div>

      {criteria.length === 0 ? (
        <div className={`rounded-xl border-2 border-dashed p-10 text-center text-sm ${
          isDark ? "border-white/10 text-white/30" : "border-zinc-200 text-zinc-400 bg-zinc-50/50"
        }`}>
          {t.careerPlanEmpty}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white/40" : "text-zinc-400"}`}>
                <Sparkles className="h-3.5 w-3.5 text-[#C5A059] inline mr-1.5 align-text-bottom" />
                {lang === "en" ? "Interactive Planner & Generator" : "Интерактивный конструктор и Генератор шагов"}
              </span>
            </div>

            <div className="space-y-3 pr-1">
              {criteria.map((crit, idx) => {
                const isExpanded = expandedId === crit.id;
                const targetVal = crit.targetScore ?? crit.score;
                const strategy = GET_STRATEGY(crit.score, targetVal, lang);
                const steps = crit.steps || ["", "", "", ""];

                return (
                  <div
                    key={crit.id}
                    className={`rounded-xl border transition-all duration-200 ${
                      isExpanded 
                        ? isDark 
                          ? "border-[#C5A059]/50 bg-[#0D0D0F] shadow-lg shadow-[#C5A059]/5" 
                          : "border-[#C5A059]/50 bg-zinc-50/80 shadow-md shadow-zinc-200/50"
                        : isDark
                          ? "border-white/5 bg-[#0D0D0F]/40 hover:bg-[#0D0D0F] hover:border-white/10"
                          : "border-zinc-150 bg-white hover:bg-zinc-50 hover:border-zinc-200 shadow-xs"
                    }`}
                  >
                    {/* Header bar click to expand */}
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : crit.id)}
                      className="flex items-center justify-between p-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                          isExpanded
                            ? "bg-[#C5A059] text-[#0a0a0b]"
                            : isDark ? "bg-white/5 text-[#C5A059]" : "bg-[#C5A059]/10 text-[#8C6D32]"
                        }`}>
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h4 className={`text-sm font-bold tracking-tight truncate ${isDark ? "text-white" : "text-zinc-800"}`}>
                            {crit.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className={`text-[10px] font-medium font-mono border px-1.5 py-0.25 rounded ${
                              isDark ? "bg-white/5 border-white/10 text-white/50" : "bg-zinc-100 border-zinc-200 text-zinc-500"
                            }`}>
                              {lang === "en" ? "now" : "сейчас"}: {crit.score}
                            </span>
                            <ArrowRight className={`h-3 w-3 ${isDark ? "text-white/20" : "text-zinc-350"}`} />
                            <span className="text-[10px] font-bold font-mono text-[#C5A059] border border-[#C5A059]/30 bg-[#C5A059]/5 px-1.5 py-0.25 rounded">
                              {lang === "en" ? "target" : "цель"}: {targetVal}
                            </span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.25 rounded border text-center whitespace-normal leading-tight ${strategy.colorClass}`}>
                              {strategy.text}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`ml-2 shrink-0 ${isDark ? "text-white/40" : "text-zinc-400"}`}>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>

                    {/* Expandable content */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`overflow-hidden border-t px-4 pb-5 pt-4 ${
                            isDark ? "border-white/5 bg-[#0A0A0B]/30" : "border-zinc-100 bg-white/50"
                          }`}
                        >
                          {/* Inner grid */}
                          <div className="space-y-4">
                            
                            {/* Sliders for targets and autogenerate */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1.5">
                                  <label className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? "text-white/40" : "text-zinc-500"}`}>
                                    {t.careerPlanSetTarget}
                                  </label>
                                  <span className="text-xs font-mono font-bold text-[#DFC182]">{targetVal} / 10</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={targetVal}
                                    onChange={(e) => handleUpdateCriterion(crit.id, { targetScore: parseInt(e.target.value) })}
                                    className={`h-1.5 w-full cursor-pointer appearance-none rounded-lg outline-none accent-[#C5A059] ${
                                      isDark ? "bg-white/10" : "bg-zinc-200"
                                    }`}
                                  />
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAutoGenerate(crit)}
                                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#DFC182] px-3.5 py-1.5 text-xs font-bold hover:bg-[#C5A059]/20 hover:text-white transition cursor-pointer active:scale-95 shrink-0"
                                title={lang === "en" ? "Generate Steps" : "Заполнить шаги автоматически по шаблону коучинга"}
                              >
                                <Sparkles className="h-3.5 w-3.5 text-[#C5A059]" />
                                {t.careerPlanAutoGen}
                              </button>
                            </div>

                            {/* 4 Steps Section */}
                            <div className="space-y-3 pt-3 border-t border-white/5">
                              <div className="flex items-center gap-1.5">
                                <ListTodo className="h-3.5 w-3.5 text-[#C5A059]" />
                                <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? "text-white/40" : "text-zinc-500"}`}>
                                  {t.careerPlanStepsHeader}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 gap-2.5">
                                {[0, 1, 2, 3].map((stepIdx) => {
                                  const placeholder = lang === "en" 
                                    ? `Step ${stepIdx + 1}. Specific action to take...`
                                    : `Шаг ${stepIdx + 1}. Опишите конкретное действие...`;
                                  return (
                                    <div key={stepIdx} className="flex gap-2 items-center">
                                      <span className={`text-xs font-mono font-bold w-12 text-right shrink-0 ${isDark ? "text-[#DFC182]/50" : "text-[#8C6D32]/60"}`}>
                                        {lang === "en" ? `Step ${stepIdx + 1}` : `Шаг ${stepIdx + 1}`}
                                      </span>
                                      <input
                                        type="text"
                                        value={steps[stepIdx] || ""}
                                        onChange={(e) => handleStepChange(crit.id, stepIdx, e.target.value)}
                                        placeholder={placeholder}
                                        className={`w-full rounded-lg border px-3 py-1.5 text-xs outline-none transition ${
                                          isDark 
                                            ? "border-white/5 bg-[#0D0D0F] text-white/90 placeholder:text-white/10 focus:border-[#C5A059]/40 focus:bg-black" 
                                            : "border-zinc-200 bg-zinc-50 text-zinc-700 placeholder:text-zinc-400 focus:border-[#C5A059]/40 focus:bg-white"
                                        }`}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Beautiful Summary Table (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white/40" : "text-zinc-400"}`}>
                <FileText className="h-3.5 w-3.5 text-[#C5A059] inline mr-1.5 align-text-bottom" />
                {t.careerPlanSummaryHeader}
              </span>
            </div>

            {/* Career Plan Table */}
            <div className={`rounded-xl border overflow-hidden ${
              isDark ? "border-white/5 bg-[#0D0D0F]" : "border-zinc-200 bg-white shadow-xs"
            }`}>
              <div className={`p-4 border-b flex items-center justify-between ${
                isDark ? "border-white/5 bg-white/[0.01]" : "border-zinc-150 bg-zinc-50/50"
              }`}>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-[#C5A059] animate-pulse" />
                  <span className={`text-xs font-bold ${isDark ? "text-white" : "text-zinc-700"}`}>
                    {t.careerPlanMatrixTitle}
                  </span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  isDark ? "bg-white/5 text-white/55" : "bg-zinc-150 text-zinc-500"
                }`}>
                  {criteria.length} {lang === "en" ? "spheres" : "сфер"}
                </span>
              </div>

              <div className="divide-y divide-white/5">
                {criteria.map((crit, idx) => {
                  const targetVal = crit.targetScore ?? crit.score;
                  const strategy = GET_STRATEGY(crit.score, targetVal, lang);
                  const hasSteps = crit.steps && crit.steps.some(s => s.trim() !== "");
                  const filledSteps = crit.steps ? crit.steps.filter(s => s.trim() !== "") : [];

                  return (
                    <div key={crit.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C5A059]" />
                          <span className={`text-xs font-semibold truncate ${isDark ? "text-white/90" : "text-zinc-800"}`}>
                            {idx + 1}. {crit.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold font-mono text-[#DFC182] shrink-0">
                          {crit.score} → {targetVal}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.25 rounded border text-center whitespace-normal leading-tight ${strategy.colorClass}`}>
                          {strategy.text}
                        </span>
                        {hasSteps ? (
                          <span className="text-[10px] text-emerald-400 font-medium">
                            ✓ {filledSteps.length} {t.careerPlanStepsActive}
                          </span>
                        ) : (
                          <span className={`text-[10px] font-medium ${isDark ? "text-white/20" : "text-zinc-400"}`}>
                            {t.careerPlanNoSteps}
                          </span>
                        )}
                      </div>

                      {filledSteps.length > 0 && (
                        <div className={`mt-2 rounded-lg p-2.5 space-y-1.5 border text-[11px] leading-relaxed ${
                          isDark 
                            ? "bg-white/[0.01] border-white/5 text-white/60" 
                            : "bg-zinc-50 border-zinc-150 text-zinc-600"
                        }`}>
                          {filledSteps.map((step, sIdx) => (
                            <div key={sIdx} className="flex gap-1.5 items-start">
                              <span className="text-[#C5A059] font-bold font-mono">▸</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Helper Coaching Card */}
            <div className={`rounded-xl p-4 border text-xs leading-relaxed ${
              isDark 
                ? "bg-[#C5A059]/5 border-[#C5A059]/20 text-white/60" 
                : "bg-[#C5A059]/5 border-[#C5A059]/30 text-zinc-700"
            }`}>
              <strong className="text-[#C5A059] block mb-1 font-serif font-semibold">
                💡 {t.careerPlanAdviceHeader}
              </strong>
              {t.careerPlanAdviceText}
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
