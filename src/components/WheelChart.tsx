/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { Criterion } from "../types";
import { Download, FileDown, Layers, Sparkles } from "lucide-react";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "motion/react";
import { Language, TRANSLATIONS } from "../translations";

interface WheelChartProps {
  criteria: Criterion[];
  compareCriteria?: Criterion[] | null;
  compareTitle?: string | null;
  onScoreChange?: (id: string, score: number) => void;
  username?: string;
  wheelTitle?: string;
  lang: Language;
  theme?: "dark" | "light";
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

const wrapText = (text: string, maxLength = 14): string[] => {
  const rawWords = text.split(/\s+/);
  const words: string[] = [];
  for (let i = 0; i < rawWords.length; i++) {
    if (i === 0 && /^\d+\.$/.test(rawWords[i]) && rawWords[i + 1]) {
      words.push(rawWords[i] + " " + rawWords[i + 1]);
      i++;
    } else {
      words.push(rawWords[i]);
    }
  }

  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    if (currentLine === "") {
      currentLine = word;
    } else if ((currentLine + " " + word).length <= maxLength) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

export function WheelChart({
  criteria,
  compareCriteria,
  compareTitle,
  onScoreChange,
  username,
  wheelTitle,
  lang,
  theme = "dark",
  colorMode,
  colorCritical,
  colorRoutine,
  colorComfort,
  colorPeak,
}: WheelChartProps) {
  const t = TRANSLATIONS[lang];
  const isDark = theme === "dark";
  const activeUsername = username || (lang === "en" ? "Guest" : lang === "chm" ? "Уна" : lang === "sah" ? "Ыалдьыт" : "Гость");
  const activeWheelTitle = wheelTitle || (lang === "en" ? "My Career" : lang === "chm" ? "Мыйын Карьер" : lang === "sah" ? "Мын карьерам" : "Моя Карьера");
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    criterion: Criterion;
    color: string;
  } | null>(null);

  const cx = 310;
  const cy = 250;
  const rInner = 45;
  const rOuter = 185;
  const totalLevels = 10;
  const N = criteria.length;
  const sliceAngle = N > 0 ? 360 / N : 0;

  // Polar to Cartesian conversion
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Helper to determine the wedge color based on mode
  const getWedgeColor = (score: number, idx: number) => {
    if (colorMode === "palette") {
      return PALETTE[idx % PALETTE.length];
    }
    if (score <= 3) return colorCritical;
    if (score <= 6) return colorRoutine;
    if (score <= 8) return colorComfort;
    return colorPeak;
  };

  // Generate path for a single wedge segment
  const getWedgePath = (
    startDeg: number,
    endDeg: number,
    innerR: number,
    outerR: number
  ) => {
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
      "Z",
    ].join(" ");
  };

  // Calculate rating-specific radius
  const getRadiusForScore = (score: number) => {
    return rInner + (score / 10) * (rOuter - rInner);
  };

  // Handle click on segment to set score directly
  const handleWedgeClick = (
    event: React.MouseEvent<SVGPathElement>,
    index: number,
    id: string
  ) => {
    if (!onScoreChange || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Scale mouse coordinates to match the 620x500 viewBox
    const svgX = (mouseX / rect.width) * 620;
    const svgY = (mouseY / rect.height) * 500;

    // Distance from center
    const dx = svgX - cx;
    const dy = svgY - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Map distance to score
    if (distance <= rInner) {
      onScoreChange(id, 1);
    } else if (distance >= rOuter) {
      onScoreChange(id, 10);
    } else {
      const percentage = (distance - rInner) / (rOuter - rInner);
      const score = Math.min(10, Math.max(1, Math.round(1 + percentage * 9)));
      onScoreChange(id, score);
    }
  };

  // Tooltip mouse movement
  const handleMouseMove = (
    event: React.MouseEvent,
    criterion: Criterion,
    color: string
  ) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltip({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top - 10,
      criterion,
      color,
    });
  };

  // Helper to draw clean Canvas (used for PNG and PDF export)
  const drawCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    // High-DPI Canvas Dimensions (3x scale for crystal clear rendering)
    canvas.width = 1500;
    canvas.height = 1100;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;

    // Enable high quality antialiasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw background card
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative clean header line
    ctx.fillStyle = "#C5A059";
    ctx.fillRect(0, 0, canvas.width, 15);

    // Title Block
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 38px Inter, system-ui, sans-serif";
    ctx.fillText(t.title.toUpperCase() + " / " + t.subtitle.split(" • ")[0].toUpperCase(), 70, 90);

    ctx.fillStyle = "#64748B";
    ctx.font = "500 20px Inter, system-ui, sans-serif";
    const localeStr = lang === "en" ? "en-US" : lang === "chm" ? "chm-RU" : lang === "sah" ? "sah-RU" : "ru-RU";
    const dateStr = new Date().toLocaleDateString(localeStr, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const labelUser = t.userLabel;
    const labelTitle = t.wheelTitleLabel;
    const labelDate = lang === "en" ? "Date" : lang === "chm" ? "Кече" : lang === "sah" ? "Күнэ" : "Дата";
    ctx.fillText(`${labelUser}: ${activeUsername}  |  ${labelTitle}: ${activeWheelTitle}  |  ${labelDate}: ${dateStr}`, 70, 130);

    // Divider Line
    ctx.strokeStyle = "#F1F5F9";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(70, 160);
    ctx.lineTo(1430, 160);
    ctx.stroke();

    // Wheel dimensions on Canvas
    const ccx = 480;
    const ccy = 630;
    const crInner = 80;
    const crOuter = 315;
    const crStep = (crOuter - crInner) / 10;

    // Draw concentric rings with grid scores
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 1;
    for (let l = 1; l <= totalLevels; l++) {
      const radius = crInner + l * crStep;
      ctx.beginPath();
      ctx.arc(ccx, ccy, radius, 0, 2 * Math.PI);
      ctx.stroke();

      // Add scores on vertical ring line
      ctx.fillStyle = "#94A3B8";
      ctx.font = "bold 14px Inter, monospace";
      ctx.fillText(l.toString(), ccx - 7, ccy - radius + 5);
    }

    // Draw Wheel slices (criteria)
    const angleStep = (2 * Math.PI) / N;
    criteria.forEach((crit, idx) => {
      // Dynamic color logic based on scoring settings passed
      const color = getWedgeColor(crit.score, idx);
      const startRad = idx * angleStep - Math.PI / 2;
      const endRad = (idx + 1) * angleStep - Math.PI / 2;
      const valRadius = crInner + (crit.score / 10) * (crOuter - crInner);

      // Draw wedge fill
      ctx.save();
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(ccx, ccy, valRadius, startRad, endRad);
      ctx.lineTo(ccx + crInner * Math.cos(endRad), ccy + crInner * Math.sin(endRad));
      ctx.arc(ccx, ccy, crInner, endRad, startRad, true);
      ctx.closePath();
      ctx.fill();

      // Draw border slice
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // Draw grid radial line divider
      ctx.strokeStyle = "#CBD5E1";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ccx + crInner * Math.cos(startRad), ccy + crInner * Math.sin(startRad));
      ctx.lineTo(ccx + crOuter * Math.cos(startRad), ccy + crOuter * Math.sin(startRad));
      ctx.stroke();

      // Draw Labels on the outer ring with correct orientation/anchor
      const midRad = startRad + angleStep / 2;
      const labelRadius = crOuter + 25;
      const lx = ccx + labelRadius * Math.cos(midRad);
      const ly = ccy + labelRadius * Math.sin(midRad);

      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 16px Inter, sans-serif";

      // Aligned label anchoring
      let align: CanvasTextAlign = "center";
      const cosVal = Math.cos(midRad);
      if (cosVal > 0.15) align = "left";
      else if (cosVal < -0.15) align = "right";

      ctx.textAlign = align;
      ctx.textBaseline = "middle";

      // Wrap text labels if too long
      const lines = wrapText(`${idx + 1}. ${crit.name}`, 15);
      const lineHeight = 22;
      const startY = ly - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, lineIdx) => {
        ctx.fillText(line.toUpperCase(), lx, startY + lineIdx * lineHeight);
      });

      // Draw segment index number near center ring
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.textAlign = "center";
      const numRadius = crInner + 20;
      ctx.fillText(
        (idx + 1).toString(),
        ccx + numRadius * Math.cos(midRad),
        ccy + numRadius * Math.sin(midRad)
      );
    });

    // Draw Wheel Core Center Badge
    ctx.fillStyle = "#1E293B";
    ctx.beginPath();
    ctx.arc(ccx, ccy, crInner - 15, 0, 2 * Math.PI);
    ctx.fill();

    const sum = criteria.reduce((acc, c) => acc + c.score, 0);
    const avg = N > 0 ? (sum / N).toFixed(1) : "0";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.font = "bold 30px Inter, monospace";
    ctx.fillText(avg, ccx, ccy + 2);
    ctx.font = "bold 11px Inter, uppercase";
    ctx.fillStyle = "#C5A059";
    const labelAvgLine1 = lang === "en" ? "AVERAGE" : lang === "chm" ? "КЫДАЛАШ" : lang === "sah" ? "ОРТО" : "СРЕДНИЙ";
    const labelAvgLine2 = lang === "en" ? "SCORE" : lang === "chm" ? "БАЛЛ" : lang === "sah" ? "БААЛ" : "БАЛЛ";
    ctx.fillText(labelAvgLine1, ccx, ccy - 18);
    ctx.fillText(labelAvgLine2, ccx, ccy + 18);

    // Draw Detailed Table Infographic on the Right side
    const tx = 950;
    let ty = 230;

    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 24px Inter, sans-serif";
    ctx.textAlign = "left";
    const labelCriteriaAndScores = lang === "en" ? "CRITERIA AND SCORES" : lang === "chm" ? "КРИТЕРИЙ ДА ВИСЫМАШ" : lang === "sah" ? "ХАЙЫСХА УОННА СЫАНАБЫЛ" : "КРИТЕРИИ И ОЦЕНКИ";
    ctx.fillText(labelCriteriaAndScores, tx, ty);

    // Table Header
    ty += 40;
    ctx.fillStyle = "#F8FAFC";
    ctx.fillRect(tx, ty, 480, 45);
    ctx.strokeStyle = "#E2E8F0";
    ctx.strokeRect(tx, ty, 480, 45);

    ctx.fillStyle = "#475569";
    ctx.font = "bold 14px Inter, uppercase";
    const labelCritCol = lang === "en" ? "Criterion" : lang === "chm" ? "Критерий" : lang === "sah" ? "Хайысха" : "Критерий";
    ctx.fillText(labelCritCol, tx + 15, ty + 25);
    ctx.textAlign = "right";
    const labelScoreCol = lang === "en" ? "Score (1-10)" : lang === "chm" ? "Балл (1-10)" : lang === "sah" ? "Баал (1-10)" : "Балл (1-10)";
    ctx.fillText(labelScoreCol, tx + 465, ty + 25);
    ctx.textAlign = "left";

    // Table Rows
    criteria.forEach((crit, idx) => {
      ty += 50;
      // Zebra striping
      if (idx % 2 === 1) {
        ctx.fillStyle = "#F8FAFC";
        ctx.fillRect(tx, ty, 480, 42);
      }
      ctx.strokeStyle = "#F1F5F9";
      ctx.strokeRect(tx, ty, 480, 42);

      // Color Badge Indicator
      ctx.fillStyle = getWedgeColor(crit.score, idx);
      ctx.beginPath();
      ctx.arc(tx + 25, ty + 21, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Criterion Title
      ctx.fillStyle = "#334155";
      ctx.font = "600 15px Inter, sans-serif";
      const maxTextWidth = 320;
      let text = `${idx + 1}. ${crit.name}`;
      if (ctx.measureText(text).width > maxTextWidth) {
        while (ctx.measureText(text + "...").width > maxTextWidth && text.length > 0) {
          text = text.substring(0, text.length - 1);
        }
        text = text + "...";
      }
      ctx.fillText(text, tx + 45, ty + 25);

      // Score Text
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 16px Inter, monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${crit.score} / 10`, tx + 465, ty + 25);
      ctx.textAlign = "left";
    });

    // Drawing Legend of Comparison if applicable
    if (compareCriteria) {
      ty += 70;
      ctx.fillStyle = "#FFF7ED";
      ctx.fillRect(tx, ty, 480, 60);
      ctx.strokeStyle = "#FED7AA";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(tx, ty, 480, 60);

      ctx.fillStyle = "#C2410C";
      ctx.font = "bold 13px Inter, uppercase";
      const labelComparison = lang === "en" ? "COMPARISON:" : lang === "chm" ? "ТАҤАСТАРЫМАШ:" : lang === "sah" ? "ТЭҤНЭЭҺИН:" : "СРАВНЕНИЕ:";
      ctx.fillText(`${labelComparison} ${compareTitle || t.prevMeasurement}`, tx + 15, ty + 25);
      ctx.fillStyle = "#4A0404";
      ctx.font = "14px Inter, sans-serif";
      const labelCompDesc = lang === "en" ? "Shown on the chart as a dotted golden line" : lang === "chm" ? "Колесошто оранжевый пунктир линий дене ончыктымо" : lang === "sah" ? "Эргимтэҕэ оранжевай сурааһынынан көрдөрүлүннэ" : "Отображено на диаграмме оранжевой пунктирной линией";
      ctx.fillText(labelCompDesc, tx + 15, ty + 45);
    }

    return canvas;
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

    const GET_STRATEGY = (score: number, target: number, l: Language): { text: string } => {
      const trans = TRANSLATIONS[l];
      if (target > score) {
        return { text: trans.strategyGrowth };
      } else if (target < score) {
        return { text: trans.strategyOptimization };
      } else {
        return { text: trans.strategyMaintain };
      }
    };

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
    ctx.fillText(`${t.interactiveWheel} — Career Development Report`, 70, 1540);
    ctx.textAlign = "right";
    ctx.fillText("Сгенерировано локально и конфиденциально", 1430, 1540);

    return canvas;
  };

  // Trigger Local PNG Export
  const exportPNG = () => {
    const canvas = drawCanvas();
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const sanitizedTitle = activeWheelTitle.toLowerCase().replace(/[^a-z0-9а-яё]/gi, "_");
    link.download = `career_wheel_${sanitizedTitle}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Trigger Local PNG Export for Development Plan
  const exportPlanPNG = () => {
    const canvas = drawPlanCanvas();
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const sanitizedTitle = activeWheelTitle.toLowerCase().replace(/[^a-z0-9а-яё]/gi, "_");
    link.download = `career_development_plan_${sanitizedTitle}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Trigger Local PDF Report Export
  const exportPDF = () => {
    const canvas = drawCanvas();
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

    // Create custom landscape document in jsPDF
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [1500, 1100],
    });

    // Add Page 1
    pdf.addImage(dataUrl, "JPEG", 0, 0, 1500, 1100, undefined, "FAST");

    // Add Page 2 (Plan Matrix with Wheels)
    try {
      const planCanvas = drawPlanCanvas();
      const planDataUrl = planCanvas.toDataURL("image/jpeg", 0.95);
      pdf.addPage([1500, 1600], "landscape");
      pdf.addImage(planDataUrl, "JPEG", 0, 0, 1500, 1600, undefined, "FAST");
    } catch (err) {
      console.error("Error adding career plan page to PDF:", err);
    }

    const sanitizedTitle = activeWheelTitle.toLowerCase().replace(/[^a-z0-9а-яё]/gi, "_");
    pdf.save(`career_audit_report_${sanitizedTitle}.pdf`);
  };

  const getAverageScore = () => {
    if (N === 0) return "0.0";
    const sum = criteria.reduce((acc, c) => acc + c.score, 0);
    return (sum / N).toFixed(1);
  };

  return (
    <div className={`flex flex-col items-center gap-6 rounded-2xl border p-6 shadow-xl transition-all duration-200 ${
      isDark ? "bg-[#0F0F12] border-white/10" : "bg-white border-zinc-200 text-zinc-900"
    }`}>
      <div className={`flex w-full items-center justify-between border-b pb-4 ${
        isDark ? "border-white/5" : "border-zinc-100"
      }`}>
        <div>
          <h3 className={`text-lg font-light flex items-center gap-2 font-serif ${
            isDark ? "text-white" : "text-zinc-900"
          }`}>
            <Sparkles className="h-5 w-5 text-[#C5A059]" />
            {t.interactiveWheel}
          </h3>
          <p className={`text-xs tracking-wider ${isDark ? "text-white/40" : "text-zinc-500"}`}>
            {t.interactiveWheelDesc}
          </p>
        </div>
        
        {/* Export Buttons */}
        <div className="flex flex-wrap gap-2 justify-end">
          <button
            onClick={exportPNG}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition active:scale-95 cursor-pointer ${
              isDark 
                ? "border-white/10 bg-[#0D0D0F] text-white/80 hover:border-[#C5A059] hover:text-[#C5A059]" 
                : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-[#C5A059] hover:text-[#C5A059] shadow-xs"
            }`}
          >
            <Download className="h-3.5 w-3.5 text-[#C5A059]" />
            {t.savePng}
          </button>
          <button
            onClick={exportPDF}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition active:scale-95 cursor-pointer ${
              isDark 
                ? "border-[#C5A059]/40 bg-[#C5A059]/10 text-[#C5A059] hover:bg-[#C5A059]/20" 
                : "border-[#C5A059]/30 bg-[#C5A059]/10 text-[#8C6D32] hover:bg-[#C5A059]/20 shadow-xs"
            }`}
          >
            <FileDown className="h-3.5 w-3.5" />
            {t.downloadPdf}
          </button>
        </div>
      </div>

      <div className="relative flex justify-center items-center w-full max-w-[500px]">
        {/* Main SVG Chart */}
        <svg
          ref={svgRef}
          viewBox="0 0 620 500"
          className="w-full h-auto drop-shadow-[0_0_25px_rgba(197,160,89,0.05)] select-none"
        >
          {/* Faint Grid concentric rings for scoring levels 1-10 */}
          {Array.from({ length: totalLevels }).map((_, i) => {
            const level = i + 1;
            const radius = rInner + (level / 10) * (rOuter - rInner);
            return (
              <circle
                key={`grid-${level}`}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}
                strokeWidth={level === 10 ? "1.5" : "0.75"}
                strokeDasharray={level === 10 ? "0" : "3,3"}
              />
            );
          })}

          {/* Scores numbers on rings */}
          {Array.from({ length: totalLevels }).map((_, i) => {
            const level = i + 1;
            const radius = rInner + (level / 10) * (rOuter - rInner);
            if (level % 2 === 0 || level === 10) {
              return (
                <text
                  key={`score-num-${level}`}
                  x={cx}
                  y={cy - radius + 3}
                  textAnchor="middle"
                  className={`font-mono text-[9px] font-bold ${isDark ? "fill-[#C5A059]/70" : "fill-[#8C6D32]/80"}`}
                >
                  {level}
                </text>
              );
            }
            return null;
          })}

          {/* Slices of filled values (Criteria scores) */}
          {criteria.map((crit, idx) => {
            const startAngle = idx * sliceAngle;
            const endAngle = (idx + 1) * sliceAngle;
            const scoreRadius = getRadiusForScore(crit.score);
            // Dynamic wedge coloring
            const color = getWedgeColor(crit.score, idx);
            const isHovered = hoveredIndex === idx;

            return (
              <g key={`slice-group-${crit.id}`}>
                {/* Background full-size wedge to capture clicks/hovers in empty segments */}
                <path
                  d={getWedgePath(startAngle, endAngle, rInner, rOuter)}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={(e) => handleWedgeClick(e, idx, crit.id)}
                  onMouseEnter={(e) => {
                    setHoveredIndex(idx);
                    handleMouseMove(e, crit, color);
                  }}
                  onMouseMove={(e) => handleMouseMove(e, crit, color)}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                    setTooltip(null);
                  }}
                />
                
                {/* Colored score wedge */}
                <path
                  d={getWedgePath(startAngle, endAngle, rInner, scoreRadius)}
                  fill={color}
                  fillOpacity={isHovered ? "0.95" : "0.75"}
                  stroke={isDark ? "#0A0A0B" : "#FFFFFF"}
                  strokeWidth="1.5"
                  className="transition-all duration-200 cursor-pointer pointer-events-none"
                />
              </g>
            );
          })}

          {/* Comparison Overlay (Semi-transparent dash outline) */}
          {compareCriteria &&
            compareCriteria.map((compCrit, idx) => {
              const startAngle = idx * sliceAngle;
              const endAngle = (idx + 1) * sliceAngle;
              const compareRadius = getRadiusForScore(compCrit.score);
              return (
                <path
                  key={`compare-slice-${compCrit.id}`}
                  d={getWedgePath(startAngle, endAngle, rInner, compareRadius)}
                  fill="none"
                  stroke="#FF8A00" // distinct comparison color
                  strokeWidth="2.5"
                  strokeDasharray="4,3"
                  className="pointer-events-none opacity-90 animate-pulse"
                />
              );
            })}

          {/* Radial grid lines separating criteria */}
          {criteria.map((_, idx) => {
            const angle = idx * sliceAngle;
            const pInner = polarToCartesian(cx, cy, rInner, angle);
            const pOuter = polarToCartesian(cx, cy, rOuter, angle);
            return (
              <line
                key={`line-${idx}`}
                x1={pInner.x}
                y1={pInner.y}
                x2={pOuter.x}
                y2={pOuter.y}
                stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}
                strokeWidth="1"
              />
            );
          })}

          {/* External text labels outside the circle */}
          {criteria.map((crit, idx) => {
            const startAngle = idx * sliceAngle;
            const midAngle = startAngle + sliceAngle / 2;
            const labelRadius = rOuter + 18;
            const pLabel = polarToCartesian(cx, cy, labelRadius, midAngle);

            const cosVal = Math.cos(((midAngle - 90) * Math.PI) / 180.0);
            let textAnchor = "middle";
            if (cosVal > 0.15) textAnchor = "start";
            else if (cosVal < -0.15) textAnchor = "end";

            const isHovered = hoveredIndex === idx;

            const lines = wrapText(`${idx + 1}. ${crit.name}`, 14);
            const lineHeight = 11;
            const startY = pLabel.y - ((lines.length - 1) * lineHeight) / 2;

            return (
              <text
                key={`label-${crit.id}`}
                x={pLabel.x}
                y={startY}
                textAnchor={textAnchor}
                className={`transition-all duration-150 text-[10px] uppercase tracking-wider font-semibold cursor-pointer hover:fill-[#C5A059] ${
                  isHovered 
                    ? "fill-[#C5A059] font-bold scale-[1.02]" 
                    : isDark 
                      ? "fill-white/80" 
                      : "fill-zinc-700"
                }`}
                onClick={() => {
                  setHoveredIndex(idx);
                }}
              >
                {lines.map((line, lineIdx) => (
                  <tspan
                    key={lineIdx}
                    x={pLabel.x}
                    dy={lineIdx === 0 ? 0 : lineHeight}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })}

          {/* Inner Circle Center Core */}
          <circle 
            cx={cx} 
            cy={cy} 
            r={rInner - 8} 
            className={isDark ? "fill-[#0D0D0F] stroke-white/10 stroke-1" : "fill-zinc-50 stroke-zinc-200 stroke-1"} 
          />
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            className={`font-bold text-[8px] uppercase tracking-widest ${isDark ? "fill-white/40" : "fill-zinc-400"}`}
          >
            {lang === "en" ? "Average" : lang === "chm" ? "Кыдалаш" : lang === "sah" ? "Орто" : "Средний"}
          </text>
          <text
            x={cx}
            y={cy + 13}
            textAnchor="middle"
            className="fill-[#C5A059] font-mono text-xl font-bold"
          >
            {getAverageScore()}
          </text>
        </svg>

        {/* Real-time Rich Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: "absolute",
                left: tooltip.x + 10,
                top: tooltip.y + 10,
              }}
              className={`z-40 pointer-events-none min-w-[180px] max-w-[240px] rounded-xl p-3 shadow-2xl backdrop-blur-md border ${
                isDark 
                  ? "bg-[#0D0D0F]/95 text-[#E5E5E7] border-white/10" 
                  : "bg-white/95 text-zinc-800 border-zinc-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: tooltip.color }}
                />
                <span className={`text-xs font-bold truncate ${isDark ? "text-white" : "text-zinc-900"}`}>
                  {tooltip.criterion.name}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-lg font-mono font-bold text-[#C5A059]">
                  {tooltip.criterion.score}
                </span>
                <span className={`text-[10px] ${isDark ? "text-white/40" : "text-zinc-400"}`}>
                  {lang === "en" ? "out of 10 points" : lang === "chm" ? "10 балл гыч" : lang === "sah" ? "10 баалтан" : "из 10 баллов"}
                </span>
              </div>
              {tooltip.criterion.notes && (
                <p className={`text-[10px] leading-relaxed border-t pt-1.5 mt-1 font-sans italic ${
                  isDark ? "text-white/60 border-white/5" : "text-zinc-500 border-zinc-100"
                }`}>
                  "{tooltip.criterion.notes}"
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Legend of comparison */}
      {compareCriteria && (
        <div className={`flex items-center gap-3 rounded-lg border p-2.5 px-4 text-xs ${
          isDark 
            ? "bg-[#C5A059]/10 border-[#C5A059]/30 text-[#DFC182]" 
            : "bg-[#C5A059]/5 border-[#C5A059]/20 text-[#8C6D32]"
        }`}>
          <Layers className="h-4 w-4 text-[#C5A059] animate-pulse" />
          <span>
            {lang === "en" ? (
              <>Showing comparison with <b>{compareTitle || "Previous measurement"}</b> (dotted orange line).</>
            ) : lang === "chm" ? (
              <><b>{compareTitle || "Ондашно висымаш"}</b> дене таҥастарымаш (оранжевый пунктир линий).</>
            ) : lang === "sah" ? (
              <><b>{compareTitle || "Урукку сыанабыл"}</b> тэҥнээһинэ көрдөрүлүүн (оранжевай сурааһын).</>
            ) : (
              <>Показано сравнение с <b>{compareTitle || "Предыдущим замером"}</b> (оранжевая пунктирная линия).</>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
