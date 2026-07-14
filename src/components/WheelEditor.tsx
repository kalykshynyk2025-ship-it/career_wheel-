/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Criterion } from "../types";
import { Plus, Trash2, RotateCcw, Save, Settings, Briefcase, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Language, TRANSLATIONS, TEMPLATES_BY_LANG } from "../translations";

interface WheelEditorProps {
  criteria: Criterion[];
  wheelTitle: string;
  onChangeCriteria: (criteria: Criterion[]) => void;
  onChangeTitle: (title: string) => void;
  onSave: () => void;
  isRegistered: boolean;
  lang: Language;
  theme?: "dark" | "light";
}

export function WheelEditor({
  criteria,
  wheelTitle,
  onChangeCriteria,
  onChangeTitle,
  onSave,
  isRegistered,
  lang,
  theme = "dark",
}: WheelEditorProps) {
  const t = TRANSLATIONS[lang];
  const [newCriterionName, setNewCriterionName] = useState("");
  const isDark = theme === "dark";

  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCriterionName.trim()) return;

    const newCrit: Criterion = {
      id: Math.random().toString(36).substring(2, 9),
      name: newCriterionName.trim(),
      score: 5,
      notes: "",
    };

    onChangeCriteria([...criteria, newCrit]);
    setNewCriterionName("");
  };

  const handleDeleteCriterion = (id: string) => {
    onChangeCriteria(criteria.filter((c) => c.id !== id));
  };

  const handleUpdateCriterion = (
    id: string,
    updates: Partial<Omit<Criterion, "id">>
  ) => {
    onChangeCriteria(
      criteria.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const applyTemplate = (type: "standard" | "business" | "freelance") => {
    const templateData = TEMPLATES_BY_LANG[lang][type];
    const formatted: Criterion[] = templateData.map((item, index) => ({
      id: `${type}-${index}-${Math.random().toString(36).substring(2, 5)}`,
      name: item.name,
      score: item.score,
      notes: item.notes,
    }));
    onChangeCriteria(formatted);
  };

  return (
    <div className={`flex flex-col gap-6 rounded-2xl border p-6 shadow-xl transition-all duration-200 ${
      isDark ? "border-white/10 bg-[#0F0F12]" : "border-zinc-200 bg-white"
    }`}>
      {/* Title block */}
      <div>
        <label className={`block text-xs font-semibold uppercase tracking-widest mb-1.5 ${
          isDark ? "text-white/40" : "text-zinc-500"
        }`}>
          {t.wheelTitleLabel}
        </label>
        <input
          type="text"
          value={wheelTitle}
          onChange={(e) => onChangeTitle(e.target.value)}
          placeholder={t.wheelTitlePlaceholder}
          className={`w-full rounded-xl border px-4 py-2.5 text-base font-light outline-none transition ${
            isDark 
              ? "border-white/10 bg-[#0D0D0F] text-white focus:border-[#C5A059] focus:bg-[#0A0A0B]" 
              : "border-zinc-200 bg-zinc-50 text-zinc-800 focus:border-[#C5A059] focus:bg-white"
          }`}
        />
      </div>

      {/* Templates Row */}
      <div className={`border-t pt-4 ${isDark ? "border-white/5" : "border-zinc-100"}`}>
        <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 ${
          isDark ? "text-white/40" : "text-zinc-500"
        }`}>
          {t.templateHeader}
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button
            onClick={() => applyTemplate("standard")}
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition cursor-pointer ${
              isDark 
                ? "border-white/10 bg-[#0D0D0F] text-white/80 hover:border-[#C5A059]/50 hover:bg-[#C5A059]/10 hover:text-white" 
                : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-[#C5A059]/50 hover:bg-[#C5A059]/5 hover:text-zinc-950"
            }`}
          >
            <Briefcase className="h-4 w-4 text-[#C5A059]" />
            {t.templateClassic}
          </button>
          <button
            onClick={() => applyTemplate("business")}
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition cursor-pointer ${
              isDark 
                ? "border-white/10 bg-[#0D0D0F] text-white/80 hover:border-[#DFC182]/50 hover:bg-[#DFC182]/10 hover:text-white" 
                : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-[#DFC182]/50 hover:bg-[#DFC182]/5 hover:text-zinc-950"
            }`}
          >
            <Settings className="h-4 w-4 text-[#DFC182]" />
            {t.templateBusiness}
          </button>
          <button
            onClick={() => applyTemplate("freelance")}
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition cursor-pointer ${
              isDark 
                ? "border-white/10 bg-[#0D0D0F] text-white/80 hover:border-[#9E8047]/50 hover:bg-[#9E8047]/10 hover:text-white" 
                : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-[#9E8047]/50 hover:bg-[#9E8047]/5 hover:text-zinc-950"
            }`}
          >
            <UserCheck className="h-4 w-4 text-[#9E8047]" />
            {t.templateFreelance}
          </button>
        </div>
      </div>

      {/* Add custom sphere */}
      <form onSubmit={handleAddCriterion} className={`border-t pt-4 ${isDark ? "border-white/5" : "border-zinc-100"}`}>
        <label className={`block text-xs font-semibold uppercase tracking-widest mb-1.5 ${
          isDark ? "text-white/40" : "text-zinc-500"
        }`}>
          {t.addCustomLabel}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCriterionName}
            onChange={(e) => setNewCriterionName(e.target.value)}
            placeholder={t.addCustomPlaceholder}
            className={`flex-1 rounded-xl border px-4 py-2 text-sm outline-none transition ${
              isDark 
                ? "border-white/10 bg-[#0D0D0F] text-white placeholder:text-white/20 focus:border-[#C5A059] focus:bg-[#0A0A0B]" 
                : "border-zinc-200 bg-zinc-50 text-zinc-800 placeholder:text-zinc-400 focus:border-[#C5A059] focus:bg-white"
            }`}
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-[#C5A059] px-4 py-2 text-sm font-bold text-[#0A0A0B] hover:bg-[#DFC182] active:scale-95 transition cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" /> {t.addButton}
          </button>
        </div>
      </form>

      {/* Criteria Editor List */}
      <div className={`border-t pt-4 ${isDark ? "border-white/5" : "border-zinc-100"}`}>
        <div className="flex items-center justify-between mb-4">
          <label className={`block text-xs font-semibold uppercase tracking-widest ${
            isDark ? "text-white/40" : "text-zinc-500"
          }`}>
            {t.editCriteriaHeader} ({criteria.length})
          </label>
          {criteria.length > 0 && (
            <button
              onClick={() => onChangeCriteria([])}
              className="flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-350 hover:underline transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" /> {t.clearAll}
            </button>
          )}
        </div>

        {criteria.length === 0 ? (
          <div className={`rounded-xl border-2 border-dashed p-8 text-center text-sm ${
            isDark ? "border-white/10 text-white/30" : "border-zinc-200 text-zinc-400 bg-zinc-50/50"
          }`}>
            {t.emptyListWarning}
          </div>
        ) : (
          <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence initial={false}>
              {criteria.map((crit, idx) => (
                <motion.div
                  key={crit.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`group rounded-xl border p-4 transition-all ${
                    isDark 
                      ? "border-white/5 bg-[#0D0D0F] hover:bg-white/[0.02] hover:border-white/10" 
                      : "border-zinc-150 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 flex items-center gap-2">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-mono font-bold ${
                        isDark 
                          ? "bg-white/5 text-[#C5A059] border border-white/10" 
                          : "bg-[#C5A059]/10 text-[#8C6D32] border border-[#C5A059]/20"
                      }`}>
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={crit.name}
                        onChange={(e) =>
                          handleUpdateCriterion(crit.id, { name: e.target.value })
                        }
                        className={`flex-1 bg-transparent text-sm font-bold outline-none border-b border-transparent focus:border-[#C5A059]/40 pb-0.5 ${
                          isDark ? "text-white" : "text-zinc-800"
                        }`}
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteCriterion(crit.id)}
                      className={`rounded p-1 transition cursor-pointer ${
                        isDark ? "text-white/40 hover:bg-rose-500/10 hover:text-rose-400" : "text-zinc-400 hover:bg-rose-500/5 hover:text-rose-500"
                      }`}
                      title={lang === "en" ? "Delete" : lang === "chm" ? "Удалитлаш" : lang === "sah" ? "Уһул" : "Удалить"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Rating Slider */}
                  <div className="flex items-center gap-4 mb-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={crit.score}
                      onChange={(e) =>
                        handleUpdateCriterion(crit.id, {
                          score: parseInt(e.target.value),
                        })
                      }
                      className={`h-1.5 w-full cursor-pointer appearance-none rounded-lg outline-none accent-[#C5A059] ${
                        isDark ? "bg-white/10" : "bg-zinc-200"
                      }`}
                    />
                    <span className="flex h-8 w-11 shrink-0 items-center justify-center rounded-lg bg-[#C5A059] font-mono text-sm font-bold text-[#0A0A0B] shadow-lg">
                      {crit.score}
                    </span>
                  </div>

                  {/* Criteria Notes (coaching comment) */}
                  <div>
                    <textarea
                      value={crit.notes || ""}
                      onChange={(e) =>
                        handleUpdateCriterion(crit.id, { notes: e.target.value })
                      }
                      placeholder={t.notesPlaceholder}
                      rows={1}
                      className={`w-full rounded-lg border px-3 py-1.5 text-xs outline-none transition focus:border-[#C5A059]/40 ${
                        isDark 
                          ? "border-white/10 bg-[#0A0A0B] text-white/85 placeholder:text-white/20" 
                          : "border-zinc-200 bg-white text-zinc-700 placeholder:text-zinc-400"
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Main Save Action button */}
      <div className={`border-t pt-5 mt-auto ${isDark ? "border-white/5" : "border-zinc-100"}`}>
        <button
          onClick={onSave}
          disabled={criteria.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C5A059] px-4 py-3 text-sm font-bold text-[#0A0A0B] shadow-lg hover:bg-[#DFC182] active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
        >
          <Save className="h-4 w-4" />
          {t.saveWheelButton}
        </button>
        {!isRegistered && (
          <div className={`mt-3 rounded-lg border p-2.5 text-center text-[10px] leading-snug ${
            isDark 
              ? "border-[#C5A059]/20 bg-[#C5A059]/5 text-[#DFC182]" 
              : "border-[#C5A059]/30 bg-[#C5A059]/5 text-[#8C6D32]"
          }`}>
            {t.guestWarningInEditor}
          </div>
        )}
      </div>
    </div>
  );
}
