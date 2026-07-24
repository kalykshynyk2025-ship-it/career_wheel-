/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { CanvasExportHandle } from "../types";
import { Target, Plus, Trash2, RotateCcw, Download, FileDown, Sparkles, CheckCircle2, HelpCircle, FileText, Info } from "lucide-react";
import { Language } from "../translations";
import { jsPDF } from "jspdf";

export interface GoalCategoryRow {
  id: string;
  category: string;
  pointA: string;     // Сегодня - Пункт А
  mediumTerm: string; // 2-3 года (left blank initially)
  longTerm: string;   // 4-5 лет
}

interface CareerGoalsTableProps {
  lang: Language;
  theme: "dark" | "light";
  activeUsername?: string;
  activeWheelTitle?: string;
}

const DEFAULT_ROWS_BY_LANG: Record<Language, GoalCategoryRow[]> = {
  ru: [
    {
      id: "row-1",
      category: "1. Должность и роль в компании",
      pointA: "Текущая должность, статус, ключевые функции и зона ответственности...",
      mediumTerm: "",
      longTerm: "Целевая позиция через 5 лет, уровень руководства, масштаб влияния..."
    },
    {
      id: "row-2",
      category: "2. Доход и финансовый статус",
      pointA: "Текущий уровень совокупного дохода и финансовые бонусы...",
      mediumTerm: "",
      longTerm: "Желаемый уровень дохода через 5 лет, финансовая независимость..."
    },
    {
      id: "row-3",
      category: "3. Навыки и профессиональная экспертность",
      pointA: "Текущий уровень Hard & Soft skills, имеющийся опыт и квалификация...",
      mediumTerm: "",
      longTerm: "Ключевые компетенции, международные сертификаты, признание экспертности..."
    },
    {
      id: "row-4",
      category: "4. Условия работы и баланс карьеры",
      pointA: "График, степень загрузки, формат (офис/гибрид), уровень стресса...",
      mediumTerm: "",
      longTerm: "Гармоничный баланс работы и жизни, идеальный формат и атмосфера..."
    },
    {
      id: "row-5",
      category: "5. Проекты, продукты и достижения",
      pointA: "Текущие рабочие задачи и масштаб текущих проектов...",
      mediumTerm: "",
      longTerm: "Значимые реализованные продукты, польза для общества и индустрии..."
    }
  ],
  chm: [
    {
      id: "row-1",
      category: "1. Должность да паша вер",
      pointA: "Кызытсе должность да ответственности...",
      mediumTerm: "",
      longTerm: "5 ий гыч кумыллымо вер да должность..."
    },
    {
      id: "row-2",
      category: "2. Окса каем да доход",
      pointA: "Кызытсе доход уровень...",
      mediumTerm: "",
      longTerm: "Целевой доход 5 ий гыч..."
    },
    {
      id: "row-3",
      category: "3. Навык да экспертность",
      pointA: "Кызытсе навык-влак да мастарлык...",
      mediumTerm: "",
      longTerm: "У знания да экспертность..."
    },
    {
      id: "row-4",
      category: "4. Паша условий да каныш баланс",
      pointA: "Кызытсе график да условие...",
      mediumTerm: "",
      longTerm: "Идеальный баланс 5 ий гыч..."
    }
  ],
  sah: [
    {
      id: "row-1",
      category: "1. Дуоһунас уонна анал",
      pointA: "БилиҥҤи дуоһунас уонна эбээһинэстэр...",
      mediumTerm: "",
      longTerm: "5 сылынан баҕарар дуоһунас..."
    },
    {
      id: "row-2",
      category: "2. Доход уонна хамнас",
      pointA: "БилиҥҤи доход таһыма...",
      mediumTerm: "",
      longTerm: "Сыаллаах доход таһыма..."
    },
    {
      id: "row-3",
      category: "3. Сатабыллар уонна билиилэр",
      pointA: "БилиҥҤи сатабыллар...",
      mediumTerm: "",
      longTerm: "Сайыннарыллыбыт сатабыллар..."
    },
    {
      id: "row-4",
      category: "4. Үлэ усулуобуйата уонна тэҥнэһик",
      pointA: "Үлэ графига уонна усулуобуйата...",
      mediumTerm: "",
      longTerm: "Идеаллаах тэҥнэһик уонна усулуобуйа..."
    }
  ],
  tyv: [
    {
      id: "row-1",
      category: "1. Турум да ажыл олуду",
      pointA: "Амгы должность, функциялар да харыысалга зоназы...",
      mediumTerm: "",
      longTerm: "5 чыл болгаш сорулга дуоһунас да удуртулга деңнели..."
    },
    {
      id: "row-2",
      category: "2. Орулга да акша деңнели",
      pointA: "Амгы ниити орулга да бонустар...",
      mediumTerm: "",
      longTerm: "5 чыл болгаш күзээнин орулга деңнели..."
    },
    {
      id: "row-3",
      category: "3. Мергежил да сатабылдар",
      pointA: "Амгы Hard & Soft skills, арга-дуржук...",
      mediumTerm: "",
      longTerm: "Кол компетенциялар, эксперт үнелел..."
    },
    {
      id: "row-4",
      category: "4. Ажыл шарттары да теңнел",
      pointA: "Амгы график, ажыглал хевири, стресс деңнели...",
      mediumTerm: "",
      longTerm: "Идеалдыг ажыл да чуртталга теңнели..."
    },
    {
      id: "row-5",
      category: "5. Проекттер да четишишкиннер",
      pointA: "Амгы кылып турар проекттер да ажылдар...",
      mediumTerm: "",
      longTerm: "Улуг ужур-уткалыг четишишкиннер..."
    }
  ],
  en: [
    {
      id: "row-1",
      category: "1. Position & Role in Company",
      pointA: "Current job title, responsibility scope, primary daily functions...",
      mediumTerm: "",
      longTerm: "Target position in 5 years, leadership depth, influence area..."
    },
    {
      id: "row-2",
      category: "2. Income & Financial Status",
      pointA: "Current total compensation, bonus scheme, financial state...",
      mediumTerm: "",
      longTerm: "Target annual income in 5 years, financial autonomy..."
    },
    {
      id: "row-3",
      category: "3. Skills & Professional Expertise",
      pointA: "Current hard & soft skills, existing certifications...",
      mediumTerm: "",
      longTerm: "Mastered strategic skills, industry authority, thought leadership..."
    },
    {
      id: "row-4",
      category: "4. Work Conditions & Balance",
      pointA: "Current schedule, workload, remote/office ratio, stress level...",
      mediumTerm: "",
      longTerm: "Optimal work-life integration, preferred setup, inner peace..."
    },
    {
      id: "row-5",
      category: "5. Key Projects & Impact",
      pointA: "Ongoing active projects and deliverables...",
      mediumTerm: "",
      longTerm: "High-impact flagship projects, contribution to society..."
    }
  ]
};

const STORAGE_KEY = "career_goals_table_data_v1";

export const CareerGoalsTable = forwardRef<CanvasExportHandle, CareerGoalsTableProps>(function CareerGoalsTable({ lang, theme, activeUsername, activeWheelTitle }: CareerGoalsTableProps, ref) {
  const isDark = theme === "dark";

  const [rows, setRows] = useState<GoalCategoryRow[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error("Failed to parse saved career goals:", err);
    }
    return DEFAULT_ROWS_BY_LANG[lang] || DEFAULT_ROWS_BY_LANG.ru;
  });

  const [newCatName, setNewCatName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Auto save changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch (err) {
      console.error("Failed to save career goals:", err);
    }
  }, [rows]);

  const handleUpdateRow = (id: string, field: keyof Omit<GoalCategoryRow, "id">, value: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleDeleteRow = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const newRow: GoalCategoryRow = {
      id: `row-custom-${Date.now()}`,
      category: newCatName.trim(),
      pointA: "",
      mediumTerm: "",
      longTerm: ""
    };
    setRows(prev => [...prev, newRow]);
    setNewCatName("");
    setShowAddModal(false);
  };

  const handleResetDefaults = () => {
    if (window.confirm(lang === "en" ? "Reset table to default template?" : "Сбросить таблицу к исходному шаблону?")) {
      const defaultRows = DEFAULT_ROWS_BY_LANG[lang] || DEFAULT_ROWS_BY_LANG.ru;
      setRows(defaultRows);
    }
  };

  const drawTableCanvas = (): HTMLCanvasElement => {
    // Helper function for wrapped text lines calculation
    const getWrappedLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
      if (!text || !text.trim()) return ["—"];
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = "";

      words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(testLine).width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine);
      return lines.length > 0 ? lines : [text];
    };

    // Test canvas to measure row heights accurately
    const testCanvas = document.createElement("canvas");
    testCanvas.width = 1500;
    const testCtx = testCanvas.getContext("2d");

    const startX = 70;
    const initialY = 240; // after headers
    const rowGap = 15;

    const rowHeights: number[] = [];
    rows.forEach((row) => {
      if (testCtx) {
        testCtx.font = "13px Inter, sans-serif";
        const lines1 = getWrappedLines(testCtx, row.pointA, 410);
        const lines2 = getWrappedLines(testCtx, row.mediumTerm, 410);
        const lines3 = getWrappedLines(testCtx, row.longTerm, 410);
        const maxLines = Math.max(lines1.length, lines2.length, lines3.length, 1);
        const computedH = Math.max(130, 45 + maxLines * 20 + 20);
        rowHeights.push(computedH);
      } else {
        rowHeights.push(140);
      }
    });

    const totalRowsHeight = rowHeights.reduce((acc, h) => acc + h + rowGap, 0);
    const canvasHeight = initialY + totalRowsHeight + 100;

    const canvas = document.createElement("canvas");
    canvas.width = 1500;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // White background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Golden header accent
    ctx.fillStyle = "#C5A059";
    ctx.fillRect(0, 0, canvas.width, 15);

    // Header Title
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 30px Inter, system-ui, sans-serif";
    const canvasGoalsTitle = lang === "en"
      ? "CAREER CRITERIA DEVELOPMENT GOALS"
      : lang === "chm"
        ? "КАРЬЕР КРИТЕРИЙ-ВЛАКЫН ВИЯҤМЕ ЦЕЛЬЖЕ"
        : lang === "sah"
          ? "КАРЬЕРА ХАЙЫСХАЛАРЫН САЙЫННАРЫЫ СЫАЛЛАРА"
          : lang === "tyv"
            ? "КАРЬЕР КРИТЕРИЙЛЕРИНИҢ ӨЗЕЛИНИҢ СОРУЛГАЛАРА"
            : "КАРЬЕРНЫЕ ЦЕЛИ РАЗВИТИЯ КАРЬЕРНЫХ КРИТЕРИЕВ";
    ctx.fillText(canvasGoalsTitle, 70, 85);

    ctx.fillStyle = "#64748B";
    ctx.font = "500 18px Inter, system-ui, sans-serif";
    const localeStr = lang === "en" ? "en-US" : lang === "chm" ? "chm-RU" : lang === "sah" ? "sah-RU" : lang === "tyv" ? "tyv-RU" : "ru-RU";
    const dateStr = new Date().toLocaleDateString(localeStr, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const labelMeasure = lang === "en" ? "Assessment" : lang === "chm" ? "Висымаш" : lang === "sah" ? "Сыанабыл" : lang === "tyv" ? "Хемчээшкин" : "Замер";
    const labelDate = lang === "en" ? "Date" : lang === "chm" ? "Кече" : lang === "sah" ? "Күнэ-дьыла" : lang === "tyv" ? "Хүнү" : "Дата";
    ctx.fillText(`${labelMeasure}: ${activeWheelTitle || "Мое колесо карьеры"}  |  ${labelDate}: ${dateStr}`, 70, 125);

    // Separator line
    ctx.strokeStyle = "#F1F5F9";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(70, 155);
    ctx.lineTo(1430, 155);
    ctx.stroke();

    let startY = 185;

    // Table Headers
    const headers = [
      lang === "en" ? "1. Today - Point A" : lang === "chm" ? "1. Таче — Пункт А" : lang === "sah" ? "1. Билиҥҥэ — А пуун" : lang === "tyv" ? "1. Бөгүн — А чук" : "1. Сегодня — Пункт А",
      lang === "en" ? "2. 2–3 Years (Medium)" : lang === "chm" ? "2. 2–3 ий" : lang === "sah" ? "2. 2–3 сыл" : lang === "tyv" ? "2. 2–3 чыл" : "2. 2–3 года",
      lang === "en" ? "3. 4–5 Years (Target Goals)" : lang === "chm" ? "3. 4–5 ий (Цель-влак)" : lang === "sah" ? "3. 4–5 сыл (Сыаллар)" : lang === "tyv" ? "3. 4–5 чыл (Сорулгалар)" : "3. 4–5 лет (Цели)"
    ];

    ctx.fillStyle = "#1E293B";
    ctx.fillRect(startX, startY, 1360, 45);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 16px Inter, sans-serif";
    headers.forEach((h, i) => {
      ctx.fillText(h, startX + 20 + i * 450, startY + 28);
    });

    startY += 55;

    // Table Rows
    rows.forEach((row, rIdx) => {
      const currentH = rowHeights[rIdx];

      ctx.fillStyle = rIdx % 2 === 1 ? "#F8FAFC" : "#FFFFFF";
      ctx.fillRect(startX, startY, 1360, currentH);
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(startX, startY, 1360, currentH);

      // Gold vertical strip
      ctx.fillStyle = "#C5A059";
      ctx.fillRect(startX, startY, 5, currentH);

      // Category Header inside row
      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 15px Inter, sans-serif";
      ctx.fillText(row.category, startX + 20, startY + 28);

      // Render columns text cleanly wrapped
      ctx.fillStyle = "#334155";
      ctx.font = "13px Inter, sans-serif";

      const linesCol1 = getWrappedLines(ctx, row.pointA, 410);
      linesCol1.forEach((l, idx) => {
        ctx.fillText(l, startX + 20, startY + 54 + idx * 20);
      });

      const linesCol2 = getWrappedLines(ctx, row.mediumTerm, 410);
      linesCol2.forEach((l, idx) => {
        ctx.fillText(l, startX + 470, startY + 54 + idx * 20);
      });

      const linesCol3 = getWrappedLines(ctx, row.longTerm, 410);
      linesCol3.forEach((l, idx) => {
        ctx.fillText(l, startX + 920, startY + 54 + idx * 20);
      });

      startY += currentH + rowGap;
    });

    // Draw Developer Credit Footer
    ctx.save();
    ctx.fillStyle = "#0A0A0B";
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    ctx.fillStyle = "#DFC182";
    ctx.font = "bold 14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const devCreditLabel = lang === "en"
      ? "Tool Developer"
      : lang === "chm"
        ? "Инструментым ямдылыше"
        : lang === "sah"
          ? "Тэрили оҥорооччу"
          : lang === "tyv"
            ? "Херекселдиң чогаадыкчызы"
            : "Разработчик инструмента";
    ctx.fillText(
      `${devCreditLabel}: КАЛЫК ШЫНЫК • WEB STUDIO & GAMIFICATION (https://kalyk-shynyk-web-studio.vercel.app/)`,
      canvas.width / 2,
      canvas.height - 25
    );
    ctx.restore();

    return canvas;
  };

  useImperativeHandle(ref, () => ({
    getCanvas: drawTableCanvas,
  }));

  const exportTablePDF = () => {
    const canvas = drawTableCanvas();
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [1500, canvas.height],
    });
    pdf.addImage(dataUrl, "JPEG", 0, 0, 1500, canvas.height, undefined, "FAST");

    const sanitizedTitle = (activeWheelTitle || "goals").toLowerCase().replace(/[^a-z0-9а-яё]/gi, "_");
    pdf.save(`career_goals_table_${sanitizedTitle}.pdf`);
  };

  return (
    <div className={`rounded-2xl border p-6 shadow-xl transition-all duration-200 ${
      isDark ? "border-white/10 bg-[#0F0F12]" : "border-zinc-200 bg-white"
    }`}>
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059]">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className={`text-base sm:text-lg font-light font-serif tracking-tight leading-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
              {lang === "en" 
                ? "Career Goals Projections" 
                : lang === "chm"
                  ? "Карьер критерий-влакын вияҤме цельже"
                  : lang === "sah"
                    ? "Карьера хайысхаларын сайыннарыы сыаллара"
                    : lang === "tyv"
                      ? "Карьер критерийлериниң өзелинин сорулгалары"
                      : "Карьерные цели развития карьерных критериев"}
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-zinc-500"}`}>
              {lang === "en" 
                ? "Formulate your career trajectory: Current state vs 5-year goal projection" 
                : lang === "chm"
                  ? "Шке карьер корным чоҥымаш: «Таче» статус да «5 ий гыч» ориентир"
                  : lang === "sah"
                    ? "Карьера траекториятын оҥоруу: «Билиҥҥи» турук уонна «5 сылынан» сыаллар"
                    : lang === "tyv"
                      ? "Карьер орууңарны тургузары: «Бөгүн» байдалы да «5 чыл болгаш» сорулгалар"
                      : "Формирование вашей карьерной траектории: Статус «Сегодня» и ориентиры «Через 5 лет»"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>
              {lang === "en" 
                ? "Add Category" 
                : lang === "chm" 
                  ? "Категорийым ешараш" 
                  : lang === "sah" 
                    ? "Категория ууруу" 
                    : lang === "tyv" 
                      ? "Категория немеп алыр" 
                      : "Добавить категорию"}
            </span>
          </button>

          <button
            onClick={exportTablePDF}
            className="flex items-center gap-1.5 rounded-xl border border-[#C5A059]/40 bg-[#C5A059]/10 px-3 py-1.5 text-xs font-bold text-[#DFC182] hover:bg-[#C5A059]/20 transition cursor-pointer active:scale-95 shadow-md"
          >
            <FileDown className="h-3.5 w-3.5 text-[#C5A059]" />
            <span>{lang === "en" ? "Export PDF" : "Экспорт PDF"}</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
              isDark ? "border-white/10 bg-white/5 text-white/50 hover:text-white" : "border-zinc-200 bg-zinc-50 text-zinc-500 hover:text-zinc-800"
            }`}
            title={lang === "en" ? "Reset template" : "Сбросить к образцу"}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Task Instructions Banner Box */}
      <div className={`mb-6 rounded-xl border p-4 transition-all ${
        isDark 
          ? "border-[#C5A059]/20 bg-[#C5A059]/5 text-white/85" 
          : "border-[#C5A059]/30 bg-[#C5A059]/5 text-zinc-800"
      }`}>
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-[#C5A059] shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed space-y-1.5">
            <p className="font-bold text-[#DFC182] text-sm">
              {lang === "en" 
                ? "Career Goals Guidelines" 
                : lang === "chm" 
                  ? "Карьер критерий-влакын вияҤме цельже" 
                  : lang === "sah" 
                    ? "Карьера хайысхаларын сайыннарыы сыаллара" 
                    : lang === "tyv" 
                      ? "Карьер критерийлериниң өзелинин сорулгалары" 
                      : "Карьерные цели развития карьерных критериев"}
            </p>
            <p className={isDark ? "text-white/80" : "text-zinc-700"}>
              {lang === "en"
                ? "Create a table with your career goals consisting of three columns:"
                : lang === "chm"
                  ? "Шке карьер цель-влак дене кылме кум столбцан таблицым возыза:"
                  : lang === "sah"
                    ? "Үс анал графалаах карьера сыалларын таблицатын толоруҥ:"
                    : lang === "tyv"
                      ? "Үш бажыңныг карьер сорулгаларының таблицазын тургузуңар:"
                      : "Создайте таблицу с вашими карьерными целями, состоящую из трех столбцов:"}
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] font-medium">
              <li>
                <strong className="text-[#C5A059]">
                  {lang === "en" 
                    ? "Column 1 (Today - Point A):" 
                    : lang === "chm" 
                      ? "Икымше столбцышто (Таче - Пункт А):" 
                      : lang === "sah" 
                        ? "Маҥнайгы графаҕа (Билиҥҥэ - А пуун):" 
                        : lang === "tyv" 
                          ? "Баштапкы бажыңга (Бөгүн - А чук):" 
                          : "В первом столбце (Сегодня - Пункт А):"}
                </strong>{" "}
                {lang === "en" 
                  ? "Describe your current career status, role, income, and balance." 
                  : lang === "chm"
                    ? "кызытсе карьер статусым возыза."
                    : lang === "sah"
                      ? "билиҥҥи туруккутун суруйуҥ."
                      : lang === "tyv"
                        ? "амгы карьер байдалыңарны бижиңер."
                        : "опишите свой текущий карьерный статус."}
              </li>
              <li>
                <strong className="text-white/50">
                  {lang === "en" 
                    ? "Column 2 (2–3 years):" 
                    : lang === "chm" 
                      ? "Кокымшо столбец (2-3 ий):" 
                      : lang === "sah" 
                        ? "Иккис графа (2-3 сыл):" 
                        : lang === "tyv" 
                          ? "Ийиги бажың (2-3 чыл):" 
                          : "Второй столбец (2-3 года):"}
                </strong>{" "}
                {lang === "en" 
                  ? "Leave empty for now (reserved for medium-term check-in)." 
                  : lang === "chm"
                    ? "кызытлан яра кодыза."
                    : lang === "sah"
                      ? "кураанах хаалларыҥ."
                      : lang === "tyv"
                        ? "амдыгаагар куруг арттырыңар."
                        : "пока оставьте пустым."}
              </li>
              <li>
                <strong className="text-emerald-400">
                  {lang === "en" 
                    ? "Column 3 (4–5 years):" 
                    : lang === "chm" 
                      ? "Кумшо столбцышто (4-5 ий):" 
                      : lang === "sah" 
                        ? "Үһүс графаҕа (4-5 сыл):" 
                        : lang === "tyv" 
                          ? "Үшкү бажыңга (4-5 чыл):" 
                          : "В третьем столбце (4-5 лет):"}
                </strong>{" "}
                {lang === "en"
                  ? "Based on your values and career balance, write what career goals you aspire to achieve in 5 years and what is important to you in your work."
                  : lang === "chm"
                    ? "шке лышташ да баланс негызеш, 5 ий гыч могай цельлан кумыл пашам ыштеда, возыза."
                    : lang === "sah"
                      ? "бэйэҕит сыаннастаргытыгар олоҕуран, 5 сылынан туохха тиийэргитин уонна үлэҕитигэр туох суолталааҕын суруйуҥ."
                      : lang === "tyv"
                        ? "бодуңарның үнелелдериңерге удуртур, 5 чыл болгаш кандыг сорулгаларга чедип алыксаарыңарны бижиңер."
                        : "основываясь на ваших ценностях и балансе карьеры, напишите, к каким карьерным целям вы стремитесь через 5 лет, что для вас важно в вашей работе."}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Table Structure */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className={`border-b text-xs uppercase tracking-wider font-semibold ${
              isDark ? "border-white/10 text-white/60 bg-[#0D0D0F]" : "border-zinc-200 text-zinc-600 bg-zinc-50"
            }`}>
              <th className="py-3 px-4 w-[28%] rounded-tl-xl border-r border-white/5">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-[#C5A059]/20 text-[#C5A059] font-mono text-[10px]">1</span>
                  <span>
                    {lang === "en" 
                      ? "Today - Point A" 
                      : lang === "chm" 
                        ? "Таче — Пункт А" 
                        : lang === "sah" 
                          ? "Билиҥҥэ — А пуун" 
                          : lang === "tyv" 
                            ? "Бөгүн — А чук" 
                            : "Сегодня — Пункт А"}
                  </span>
                </div>
              </th>
              <th className="py-3 px-4 w-[28%] border-r border-white/5">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-white/50 font-mono text-[10px]">2</span>
                  <span>
                    {lang === "en" 
                      ? "2–3 Years" 
                      : lang === "chm" 
                        ? "2–3 ий" 
                        : lang === "sah" 
                          ? "2–3 сыл" 
                          : lang === "tyv" 
                            ? "2–3 чыл" 
                            : "2–3 года"}
                  </span>
                  <span className="text-[10px] text-white/30 lowercase font-normal">
                    ({lang === "en" ? "empty" : lang === "chm" ? "яра" : lang === "sah" ? "кураанах" : lang === "tyv" ? "куруг" : "пусто"})
                  </span>
                </div>
              </th>
              <th className="py-3 px-4 w-[38%] rounded-tr-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">3</span>
                    <span className="text-emerald-400">
                      {lang === "en" 
                        ? "4–5 Years (Goals)" 
                        : lang === "chm" 
                          ? "4–5 ий (Цель-влак)" 
                          : lang === "sah" 
                            ? "4–5 сыл (Сыаллар)" 
                            : lang === "tyv" 
                              ? "4–5 чыл (Сорулгалар)" 
                              : "4–5 лет (Цели)"}
                    </span>
                  </div>
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400 opacity-60" />
                </div>
              </th>
              <th className="py-3 px-2 w-[6%] text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row) => (
              <tr 
                key={row.id}
                className={`transition-colors ${
                  isDark ? "hover:bg-white/[0.01]" : "hover:bg-zinc-50/80"
                }`}
              >
                {/* Column 1: Today - Point A */}
                <td className={`p-3 align-top border-r ${isDark ? "border-white/5" : "border-zinc-150"}`}>
                  <div className="mb-2 flex items-center justify-between">
                    <input
                      type="text"
                      value={row.category}
                      onChange={(e) => handleUpdateRow(row.id, "category", e.target.value)}
                      className={`text-xs font-bold outline-none bg-transparent border-b border-transparent focus:border-[#C5A059]/40 w-full ${
                        isDark ? "text-[#DFC182]" : "text-[#8C6D32]"
                      }`}
                    />
                  </div>
                  <textarea
                    value={row.pointA}
                    onChange={(e) => handleUpdateRow(row.id, "pointA", e.target.value)}
                    placeholder={
                      lang === "en"
                        ? "Describe your current career status, role, income, and balance today..."
                        : lang === "chm"
                          ? "Таче кызытсе карьер статусым, верым, доходатым сӱретлыза..."
                          : lang === "sah"
                            ? "Билиҥҥи карьера туругун, дуоһунаһы, доходу уонна тэҥнэһиги суруйуҥ..."
                            : lang === "tyv"
                              ? "Амгы карьер байдалыңарны, хүлээлгеңерни, орулгаңарны бижиңер..."
                              : "Опишите ваш текущий статус сегодня: ваша роль, должность, уровень дохода..."
                    }
                    rows={4}
                    className={`w-full rounded-lg border p-2.5 text-xs outline-none transition focus:border-[#C5A059]/40 resize-y ${
                      isDark 
                        ? "border-white/10 bg-[#0D0D0F] text-white placeholder:text-white/20" 
                        : "border-zinc-200 bg-white text-zinc-800 placeholder:text-zinc-400"
                    }`}
                  />
                </td>

                {/* Column 2: 2-3 Years (Left empty by default as requested) */}
                <td className={`p-3 align-top border-r ${isDark ? "border-white/5" : "border-zinc-150"}`}>
                  <div className="mb-2 text-[10px] uppercase font-bold text-white/30 tracking-wider">
                    {lang === "en" 
                      ? "Medium term" 
                      : lang === "chm" 
                        ? "Кычык кужым" 
                        : lang === "sah" 
                          ? "Орто мөһөл" 
                          : lang === "tyv" 
                            ? "Ортаа хевири" 
                            : "Среднесрочный"}
                  </div>
                  <textarea
                    value={row.mediumTerm}
                    onChange={(e) => handleUpdateRow(row.id, "mediumTerm", e.target.value)}
                    placeholder={
                      lang === "en" 
                        ? "(Leave empty for now)" 
                        : lang === "chm" 
                          ? "(Кызытлан яра кодыза)" 
                          : lang === "sah" 
                            ? "(Кураанах хаалларыҥ)" 
                            : lang === "tyv" 
                              ? "(Амдыгаагар куруг арттырыңар)" 
                              : "(Пока оставьте пустым)"
                    }
                    rows={4}
                    className={`w-full rounded-lg border p-2.5 text-xs outline-none transition focus:border-[#C5A059]/40 resize-y ${
                      isDark 
                        ? "border-white/5 bg-[#0A0A0B] text-white/60 placeholder:text-white/15 italic" 
                        : "border-zinc-200 bg-zinc-50/50 text-zinc-600 placeholder:text-zinc-400 italic"
                    }`}
                  />
                </td>

                {/* Column 3: 4-5 Years Goals */}
                <td className="p-3 align-top">
                  <div className="mb-2 flex items-center justify-between text-[10px] uppercase font-bold text-emerald-400/80 tracking-wider">
                    <span>
                      {lang === "en" 
                        ? "5-Year Goals & Values" 
                        : lang === "chm" 
                          ? "5 ий гыч цель да лышташ" 
                          : lang === "sah" 
                            ? "5 сыллаах сыаллар уонна суолталар" 
                            : lang === "tyv" 
                              ? "5 чыл сорулгалары да үнелелдери" 
                              : "Цели и ценности через 5 лет"}
                    </span>
                  </div>
                  <textarea
                    value={row.longTerm}
                    onChange={(e) => handleUpdateRow(row.id, "longTerm", e.target.value)}
                    placeholder={
                      lang === "en"
                        ? "Describe your 5-year target career goals and core work values..."
                        : lang === "chm"
                          ? "5 ий гыч могай целевой вер да паша лышташлан кумылым возыза..."
                          : lang === "sah"
                            ? "5 сылынан туох анал сыалга тиийэргитин уонна суолталааҕын суруйуҥ..."
                            : lang === "tyv"
                              ? "5 чыл болгаш кандыг сорулгаларга чедип алыксаарыңарны бижиңер..."
                              : "Опишите, к каким карьерным целям вы стремитесь через 5 лет, что для вас важно в вашей работе..."
                    }
                    rows={4}
                    className={`w-full rounded-lg border p-2.5 text-xs outline-none transition focus:border-emerald-500/40 resize-y ${
                      isDark 
                        ? "border-emerald-500/20 bg-[#0D0D0F] text-white placeholder:text-white/20" 
                        : "border-emerald-500/30 bg-emerald-50/20 text-zinc-800 placeholder:text-zinc-400"
                    }`}
                  />
                </td>

                {/* Row Delete Button */}
                <td className="p-2 align-middle text-center">
                  <button
                    onClick={() => handleDeleteRow(row.id)}
                    className={`rounded p-1.5 transition cursor-pointer ${
                      isDark ? "text-white/30 hover:bg-rose-500/10 hover:text-rose-400" : "text-zinc-400 hover:bg-rose-500/10 hover:text-rose-500"
                    }`}
                    title={
                      lang === "en" 
                        ? "Delete row" 
                        : lang === "chm" 
                          ? "Строкам корандаш" 
                          : lang === "sah" 
                            ? "Осуоланы сотор" 
                            : lang === "tyv" 
                              ? "Одуругну кааптар" 
                              : "Удалить строку"
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Custom Category Form Modal/Bar */}
      {showAddModal && (
        <div className={`mt-4 rounded-xl border p-4 transition-all ${
          isDark ? "border-[#C5A059]/30 bg-[#0D0D0F]" : "border-[#C5A059]/30 bg-zinc-50"
        }`}>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
            isDark ? "text-[#DFC182]" : "text-[#8C6D32]"
          }`}>
            {lang === "en" 
              ? "New Goal Category Title:" 
              : lang === "chm" 
                ? "У цель категорий лӱм:" 
                : lang === "sah" 
                  ? "Саҥа сыал категориятын аата:" 
                  : lang === "tyv" 
                    ? "Чаа сорулга категориязының ады:" 
                    : "Название новой категории целей:"}
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder={
                lang === "en" 
                  ? "e.g., International mobility / Team leadership..." 
                  : lang === "chm" 
                    ? "Мутлан: Калыккокласе паша / Команда..." 
                    : lang === "sah" 
                      ? "Анал холобур: Норуоттар икки ардыларынааҕы хамсааһын..." 
                      : lang === "tyv" 
                        ? "Байдал: Делегей чергелиг ажыл / Команда..." 
                        : "Например: Международная мобильность / Команда..."
              }
              className={`flex-1 rounded-xl border px-3 py-2 text-xs outline-none ${
                isDark 
                  ? "border-white/10 bg-[#0A0A0B] text-white focus:border-[#C5A059]" 
                  : "border-zinc-200 bg-white text-zinc-800 focus:border-[#C5A059]"
              }`}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCategory}
                className="rounded-xl bg-[#C5A059] px-4 py-2 text-xs font-bold text-[#0A0A0B] hover:bg-[#DFC182] active:scale-95 transition cursor-pointer"
              >
                {lang === "en" 
                  ? "Add" 
                  : lang === "chm" 
                    ? "Ешараш" 
                    : lang === "sah" 
                      ? "Ууруу" 
                      : lang === "tyv" 
                        ? "Немеп алыр" 
                        : "Добавить"}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                  isDark ? "border-white/10 text-white/50 hover:text-white" : "border-zinc-200 text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {lang === "en" 
                  ? "Cancel" 
                  : lang === "chm" 
                    ? "Чараш" 
                    : lang === "sah" 
                      ? "Кэпсииртэн туттунуу" 
                      : lang === "tyv" 
                        ? "Соксадыры" 
                        : "Отмена"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
