/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SavedWheel } from "../types";
import { Calendar, Trash2, ArrowUpRight, Check, Play, BarChart3, ListFilter, GitCompare } from "lucide-react";
import { motion } from "motion/react";
import { Language, TRANSLATIONS } from "../translations";

interface HistoryProps {
  savedWheels: SavedWheel[];
  onLoadWheel: (wheel: SavedWheel) => void;
  onDeleteWheel: (id: string) => void;
  onSelectForComparison: (wheel: SavedWheel | null) => void;
  compareWheel: SavedWheel | null;
  lang: Language;
  theme?: "dark" | "light";
}

export function History({
  savedWheels,
  onLoadWheel,
  onDeleteWheel,
  onSelectForComparison,
  compareWheel,
  lang,
  theme = "dark",
}: HistoryProps) {
  const t = TRANSLATIONS[lang];
  const isDark = theme === "dark";
  
  // Calculate average for a wheel
  const getAverage = (wheel: SavedWheel) => {
    if (!wheel.criteria || wheel.criteria.length === 0) return "0";
    const sum = wheel.criteria.reduce((acc, c) => acc + c.score, 0);
    return (sum / wheel.criteria.length).toFixed(1);
  };

  // Sort wheels by date (oldest to newest for progress, but newest first for listing)
  const sortedWheelsNewestFirst = [...savedWheels].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const sortedWheelsOldestFirst = [...savedWheels].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Render a beautiful custom SVG trendline chart
  const renderTrendChart = () => {
    if (savedWheels.length < 2) return null;

    const width = 500;
    const height = 150;
    const padding = 30;

    const localeStr = lang === "en" ? "en-US" : lang === "chm" ? "chm-RU" : lang === "sah" ? "sah-RU" : lang === "tyv" ? "tyv-RU" : "ru-RU";
    const dataPoints = sortedWheelsOldestFirst.map((wheel) => ({
      title: wheel.title,
      avg: parseFloat(getAverage(wheel)),
      date: new Date(wheel.date).toLocaleDateString(localeStr, {
        day: "numeric",
        month: "short",
      }),
    }));

    const minX = padding;
    const maxX = width - padding;
    const minY = height - padding;
    const maxY = padding;

    // Map function
    const getX = (index: number) => {
      if (dataPoints.length === 1) return (minX + maxX) / 2;
      return minX + (index / (dataPoints.length - 1)) * (maxX - minX);
    };

    const getY = (val: number) => {
      // Scale from 1 to 10
      return minY - ((val - 1) / 9) * (minY - maxY);
    };

    // Build SVG Path
    let pathD = "";
    dataPoints.forEach((point, idx) => {
      const x = getX(idx);
      const y = getY(point.avg);
      if (idx === 0) {
        pathD += `M ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
      }
    });

    return (
      <div className={`rounded-xl border p-5 mt-2 transition-all duration-200 ${
        isDark ? "border-white/5 bg-[#0D0D0F]" : "border-zinc-200 bg-zinc-50/50"
      }`}>
        <h4 className="text-xs font-light text-[#C5A059] uppercase tracking-widest mb-3 flex items-center gap-2 font-serif">
          <BarChart3 className="h-4 w-4" />
          {t.historyChartTitle}
        </h4>
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[400px]">
            {/* Grid lines for level 1, 5, 10 */}
            {[1, 5, 10].map((level) => {
              const y = getY(level);
              return (
                <g key={`grid-line-${level}`}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}
                    strokeWidth="0.75"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={padding - 10}
                    y={y + 3}
                    textAnchor="end"
                    className={`font-mono text-[9px] font-bold ${isDark ? "fill-white/40" : "fill-zinc-400"}`}
                  >
                    {level}
                  </text>
                </g>
              );
            })}

            {/* Connecting Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#C5A059"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Gradient under line */}
            {dataPoints.length > 1 && (
              <path
                d={`${pathD} L ${getX(dataPoints.length - 1)} ${minY} L ${getX(0)} ${minY} Z`}
                fill="url(#trendGrad)"
                opacity="0.15"
              />
            )}

            {/* Gradients definitions */}
            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C5A059" />
                <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Points circles and labels */}
            {dataPoints.map((point, idx) => {
              const x = getX(idx);
              const y = getY(point.avg);
              return (
                <g key={`point-${idx}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    className={`fill-[#C5A059] stroke-2 ${isDark ? "stroke-[#0A0A0B]" : "stroke-white"}`}
                  />
                  <text
                    x={x}
                    y={y - 8}
                    textAnchor="middle"
                    className="fill-[#C5A059] font-mono text-[10px] font-bold"
                  >
                    {point.avg}
                  </text>
                  <text
                    x={x}
                    y={minY + 14}
                    textAnchor="middle"
                    className={`text-[9px] font-mono ${isDark ? "fill-white/40" : "fill-zinc-400"}`}
                  >
                    {point.date}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  if (savedWheels.length === 0) {
    return (
      <div className={`rounded-2xl border p-8 text-center shadow-xl transition-all duration-200 ${
        isDark ? "border-white/10 bg-[#0F0F12]" : "border-zinc-200 bg-white"
      }`}>
        <Calendar className={`mx-auto h-12 w-12 mb-3 ${isDark ? "text-white/20" : "text-zinc-300"}`} />
        <h3 className={`text-base font-light font-serif ${isDark ? "text-white" : "text-zinc-850"}`}>{t.historyEmptyTitle}</h3>
        <p className={`mt-1.5 text-xs max-w-sm mx-auto leading-relaxed ${isDark ? "text-white/40" : "text-zinc-500"}`}>
          {t.historyEmptyDesc}
        </p>
      </div>
    );
  }

  const localeStr = lang === "en" ? "en-US" : lang === "chm" ? "chm-RU" : lang === "sah" ? "sah-RU" : "ru-RU";

  return (
    <div className={`flex flex-col gap-6 rounded-2xl border p-6 shadow-xl transition-all duration-200 ${
      isDark ? "border-white/10 bg-[#0F0F12]" : "border-zinc-200 bg-white"
    }`}>
      <div>
        <h3 className={`text-lg font-light flex items-center gap-2 font-serif ${isDark ? "text-white" : "text-zinc-900"}`}>
          <Calendar className="h-5 w-5 text-[#C5A059]" />
          {t.historyHeader}
        </h3>
        <p className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-zinc-500"}`}>
          {t.historyDesc}
        </p>
      </div>

      {/* Dynamic progression chart */}
      {renderTrendChart()}

      {/* Saved list */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
        {sortedWheelsNewestFirst.map((wheel) => {
          const isComparing = compareWheel?.id === wheel.id;
          const avgScore = getAverage(wheel);

          return (
            <div
              key={wheel.id}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-150 ${
                isComparing
                  ? "border-[#C5A059]/40 bg-[#C5A059]/5"
                  : isDark
                    ? "border-white/5 bg-[#0D0D0F] hover:bg-white/[0.02] hover:border-white/10"
                    : "border-zinc-150 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 shadow-xs"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className={`text-sm font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>{wheel.title}</h4>
                  <span className={`flex h-5 items-center justify-center rounded border px-2 font-mono text-[10px] font-bold ${
                    isDark 
                      ? "bg-white/5 border-white/10 text-white/60" 
                      : "bg-zinc-100 border-zinc-200 text-zinc-600"
                  }`}>
                    {wheel.criteria.length} {lang === "en" ? "spheres" : lang === "chm" ? "орва" : lang === "sah" ? "хайысха" : "сфер"}
                  </span>
                </div>
                <div className={`flex items-center gap-2 mt-1 text-xs font-mono ${isDark ? "text-white/40" : "text-zinc-500"}`}>
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-[#C5A059]" />
                  <span>
                    {new Date(wheel.date).toLocaleDateString(localeStr, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {wheel.overallNotes && (
                  <p className={`text-xs italic mt-1.5 line-clamp-1 ${isDark ? "text-white/40" : "text-zinc-500"}`}>
                    "{wheel.overallNotes}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                {/* Score badge */}
                <div className={`flex flex-col items-center justify-center border px-3 py-1 rounded-lg text-center shadow-xs ${
                  isDark ? "bg-[#0D0D0F] border-white/10" : "bg-white border-zinc-200"
                }`}>
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? "text-white/40" : "text-zinc-500"}`}>
                    {lang === "en" ? "avg" : lang === "chm" ? "кыл. балл" : lang === "sah" ? "орто баал" : "ср. балл"}
                  </span>
                  <span className="text-sm font-mono font-bold text-[#C5A059]">{avgScore}</span>
                </div>

                {/* Compare toggle */}
                <button
                  onClick={() => onSelectForComparison(isComparing ? null : wheel)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer ${
                    isComparing
                      ? "bg-[#C5A059] text-[#0A0A0B] hover:bg-[#DFC182]"
                      : isDark
                        ? "bg-[#0D0D0F] border border-white/10 text-white/80 hover:border-[#C5A059]/50 hover:text-[#C5A059]"
                        : "bg-white border border-zinc-200 text-zinc-700 hover:border-[#C5A059]/50 hover:text-[#C5A059]"
                  }`}
                  title={
                    isComparing 
                      ? (lang === "en" ? "Cancel comparison" : lang === "chm" ? "Таҥастарымашым кораш" : lang === "sah" ? "Тэҥнээһини уһул" : "Отменить сравнение") 
                      : (lang === "en" ? "Overlay on current chart for comparison" : lang === "chm" ? "Текущий диаграммышке таҥастарымашым сакаш" : "Наложить на текущую диаграмму для сравнения")
                  }
                >
                  <GitCompare className="h-3.5 w-3.5" />
                  {lang === "en" ? (isComparing ? "Comparing" : "Compare") : lang === "chm" ? (isComparing ? "Таҥастараш" : "Таҥастараш") : lang === "sah" ? (isComparing ? "Тэҥнэнилин" : "Тэҥнээ") : (isComparing ? "Сравнивается" : "Сравнить")}
                </button>

                {/* Load button */}
                <button
                  onClick={() => onLoadWheel(wheel)}
                  className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer ${
                    isDark 
                      ? "bg-[#C5A059]/10 border-[#C5A059]/20 text-[#C5A059] hover:bg-[#C5A059]/20" 
                      : "bg-[#C5A059]/10 border-[#C5A059]/30 text-[#A3803B] hover:bg-[#C5A059]/20"
                  }`}
                  title={lang === "en" ? "Load this wheel into active editor" : lang === "chm" ? "Тиде орвам активный редакторыш вераҥдаш" : "Загрузить данное колесо в активный редактор"}
                >
                  <Play className="h-3.5 w-3.5 fill-[#C5A059] text-[#C5A059]" />
                  {lang === "en" ? "Open" : lang === "chm" ? "Почаш" : lang === "sah" ? "Ас" : "Открыть"}
                </button>

                {/* Delete button */}
                <button
                  onClick={() => onDeleteWheel(wheel.id)}
                  className={`rounded-lg p-2 transition cursor-pointer ${
                    isDark 
                      ? "text-white/40 hover:bg-rose-500/10 hover:text-rose-400" 
                      : "text-zinc-400 hover:bg-rose-500/5 hover:text-rose-500"
                  }`}
                  title={lang === "en" ? "Delete" : lang === "chm" ? "Удалитлаш" : lang === "sah" ? "Уһул" : "Удалить"}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
