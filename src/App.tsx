/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Criterion, SavedWheel, User } from "./types";
import { Auth } from "./components/Auth";
import { WheelChart } from "./components/WheelChart";
import { WheelEditor } from "./components/WheelEditor";
import { CareerPlan } from "./components/CareerPlan";
import { History } from "./components/History";
import { Language, TRANSLATIONS } from "./translations";
import {
  Compass,
  LogOut,
  Sparkles,
  Award,
  HelpCircle,
  BookOpen,
  CheckCircle,
  Globe,
  Sun,
  Moon,
  Palette,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const DEFAULT_CRITERIA: Criterion[] = [
  { id: "1", name: "Профессиональный рост", score: 6, notes: "Изучаю новые технологии, стремлюсь к повышению квалификации" },
  { id: "2", name: "Заработная плата и бонусы", score: 5, notes: "Текущий доход устраивает, но хочу увеличить на 30% в этом году" },
  { id: "3", name: "Баланс работы и жизни", score: 7, notes: "Успеваю отдыхать, провожу выходные с семьей" },
  { id: "4", name: "Отношения с коллегами", score: 8, notes: "Отличный дружный коллектив, комфортная атмосфера" },
  { id: "5", name: "Интерес к задачам", score: 6, notes: "Задачи интересные, но иногда бывает рутина" },
  { id: "6", name: "Условия труда", score: 7, notes: "Работаю гибридно, условия в офисе отличные" },
  { id: "7", name: "Признание руководства", score: 5, notes: "Хотелось бы больше обратной связи по результатам" },
  { id: "8", name: "Обучение и развитие", score: 6, notes: "Прохожу курсы от компании раз в полгода" },
];

export default function App() {
  const [lang, setLang] = useState<Language>("ru");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [criteria, setCriteria] = useState<Criterion[]>(DEFAULT_CRITERIA);
  const [wheelTitle, setWheelTitle] = useState("Мой Карьерный Компас");
  const [savedWheels, setSavedWheels] = useState<SavedWheel[]>([]);
  const [compareWheel, setCompareWheel] = useState<SavedWheel | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Theme support state (persisted)
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("career_wheel_theme") as "dark" | "light") || "dark";
  });

  // Color customizations state
  const [colorMode, setColorMode] = useState<"palette" | "scores">(() => {
    return (localStorage.getItem("career_wheel_color_mode") as "palette" | "scores") || "palette";
  });

  const [colorCritical, setColorCritical] = useState(() => {
    return localStorage.getItem("career_wheel_color_critical") || "#f43f5e";
  });

  const [colorRoutine, setColorRoutine] = useState(() => {
    return localStorage.getItem("career_wheel_color_routine") || "#f59e0b";
  });

  const [colorComfort, setColorComfort] = useState(() => {
    return localStorage.getItem("career_wheel_color_comfort") || "#DFC182";
  });

  const [colorPeak, setColorPeak] = useState(() => {
    return localStorage.getItem("career_wheel_color_peak") || "#10b981";
  });

  const t = TRANSLATIONS[lang];

  // Sync color preferences to localstorage
  useEffect(() => {
    localStorage.setItem("career_wheel_color_mode", colorMode);
  }, [colorMode]);

  useEffect(() => {
    localStorage.setItem("career_wheel_color_critical", colorCritical);
  }, [colorCritical]);

  useEffect(() => {
    localStorage.setItem("career_wheel_color_routine", colorRoutine);
  }, [colorRoutine]);

  useEffect(() => {
    localStorage.setItem("career_wheel_color_comfort", colorComfort);
  }, [colorComfort]);

  useEffect(() => {
    localStorage.setItem("career_wheel_color_peak", colorPeak);
  }, [colorPeak]);

  // Dynamic automatic translation of default title on language change
  useEffect(() => {
    const defaultTitles = [
      "Мой Карьерный Компас",
      "My Career Compass",
      "Мыйын карьер компасем",
      "Мин Карьерам Компаһа"
    ];
    if (defaultTitles.includes(wheelTitle)) {
      if (lang === "en") {
        setWheelTitle("My Career Compass");
      } else if (lang === "chm") {
        setWheelTitle("Мыйын карьер компасем");
      } else if (lang === "sah") {
        setWheelTitle("Мин Карьерам Компаһа");
      } else {
        setWheelTitle("Мой Карьерный Компас");
      }
    }
  }, [lang]);

  // Load user session and saved wheels on mount
  useEffect(() => {
    const cachedUser = localStorage.getItem("career_wheel_current_user");
    if (cachedUser) {
      const user: User = JSON.parse(cachedUser);
      setCurrentUser(user);
      setSavedWheels(user.wheels || []);
    } else {
      // Load guest wheels
      const guestWheelsJson = localStorage.getItem("career_wheel_guest_wheels");
      const gWheels = guestWheelsJson ? JSON.parse(guestWheelsJson) : [];
      setSavedWheels(gWheels);
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAuthSuccess = (user: User | null) => {
    setCurrentUser(user);
    setShowAuth(false);
    
    if (user) {
      setSavedWheels(user.wheels || []);
      const welcomeStr = lang === "en" ? "Welcome, " : lang === "chm" ? "Салам лийже, " : lang === "sah" ? "Нөрүөн нэргэй, " : "Добро пожаловать, ";
      triggerToast(`${welcomeStr}${user.username}!`);
    } else {
      // Load guest wheels
      const guestWheelsJson = localStorage.getItem("career_wheel_guest_wheels");
      const gWheels = guestWheelsJson ? JSON.parse(guestWheelsJson) : [];
      setSavedWheels(gWheels);
      const guestStr = lang === "en" ? "You logged in as Guest" : lang === "chm" ? "Те Уна семын пурышыч" : lang === "sah" ? "Ыалдьыт быһыытынан киирдиң" : "Вы вошли в режиме Гостя";
      triggerToast(guestStr);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("career_wheel_current_user");
    setCurrentUser(null);
    setCompareWheel(null);
    // Reload guest wheels
    const guestWheelsJson = localStorage.getItem("career_wheel_guest_wheels");
    const gWheels = guestWheelsJson ? JSON.parse(guestWheelsJson) : [];
    setSavedWheels(gWheels);
    const logoutStr = lang === "en" ? "Logged out successfully" : lang === "chm" ? "Аккаунт гыч лектыч" : lang === "sah" ? "Аккаунтан таҕыстың" : "Вы вышли из аккаунта";
    triggerToast(logoutStr);
  };

  // Direct scoring handler from chart clicking
  const handleScoreChange = (id: string, score: number) => {
    setCriteria(
      criteria.map((c) => (c.id === id ? { ...c, score } : c))
    );
  };

  // Save active wheel
  const handleSaveWheel = () => {
    if (criteria.length === 0) {
      const errStr = lang === "en" ? "Add at least one criterion to save!" : lang === "chm" ? "Аре аралаш ик критерийым гынат пурто!" : lang === "sah" ? "Араарарга уонна уурарга биир эмэ критерийда уур!" : "Добавьте хотя бы один критерий для сохранения!";
      triggerToast(errStr);
      return;
    }

    const newSavedWheel: SavedWheel = {
      id: Math.random().toString(36).substring(2, 9),
      title: wheelTitle.trim() || "Карьерное Колесо",
      date: new Date().toISOString(),
      criteria: JSON.parse(JSON.stringify(criteria)), // deep copy
    };

    let updatedWheels: SavedWheel[] = [];

    if (currentUser) {
      // Save for registered user
      const usersJson = localStorage.getItem("career_wheel_users");
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];
      
      const userIndex = users.findIndex(
        (u) => u.username.toLowerCase() === currentUser.username.toLowerCase()
      );

      if (userIndex !== -1) {
        users[userIndex].wheels = users[userIndex].wheels || [];
        users[userIndex].wheels.push(newSavedWheel);
        
        // Update local state and DB
        updatedWheels = users[userIndex].wheels;
        localStorage.setItem("career_wheel_users", JSON.stringify(users));
        
        const updatedCurrentUser = { ...currentUser, wheels: updatedWheels };
        setCurrentUser(updatedCurrentUser);
        localStorage.setItem("career_wheel_current_user", JSON.stringify(updatedCurrentUser));
      }
    } else {
      // Save for Guest
      const guestWheelsJson = localStorage.getItem("career_wheel_guest_wheels");
      const gWheels = guestWheelsJson ? JSON.parse(guestWheelsJson) : [];
      gWheels.push(newSavedWheel);
      updatedWheels = gWheels;
      localStorage.setItem("career_wheel_guest_wheels", JSON.stringify(gWheels));
    }

    setSavedWheels(updatedWheels);
    const saveSuccessStr = lang === "en" ? `Wheel "${newSavedWheel.title}" successfully saved!` : lang === "chm" ? `"${newSavedWheel.title}" орва историйыш аралалт кайыш!` : lang === "sah" ? `"${newSavedWheel.title}" эргимтэ историяҕа уурулунна!` : `Колесо "${newSavedWheel.title}" успешно сохранено в историю!`;
    triggerToast(saveSuccessStr);
  };

  // Load a saved wheel into editor
  const handleLoadWheel = (wheel: SavedWheel) => {
    setCriteria(JSON.parse(JSON.stringify(wheel.criteria)));
    setWheelTitle(wheel.title);
    const loadSuccessStr = lang === "en" ? `Loaded measurement: "${wheel.title}"` : lang === "chm" ? `Висымаш вераҥдыме: "${wheel.title}"` : lang === "sah" ? `Сыанабыл киирдэ: "${wheel.title}"` : `Загружен замер: "${wheel.title}"`;
    triggerToast(loadSuccessStr);
    
    // Smooth scroll to top of workspace
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete a saved wheel
  const handleDeleteWheel = (id: string) => {
    let updatedWheels: SavedWheel[] = [];

    if (currentUser) {
      const usersJson = localStorage.getItem("career_wheel_users");
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];
      
      const userIndex = users.findIndex(
        (u) => u.username.toLowerCase() === currentUser.username.toLowerCase()
      );

      if (userIndex !== -1) {
        users[userIndex].wheels = (users[userIndex].wheels || []).filter(
          (w) => w.id !== id
        );
        updatedWheels = users[userIndex].wheels;
        
        localStorage.setItem("career_wheel_users", JSON.stringify(users));
        
        const updatedCurrentUser = { ...currentUser, wheels: updatedWheels };
        setCurrentUser(updatedCurrentUser);
        localStorage.setItem("career_wheel_current_user", JSON.stringify(updatedCurrentUser));
      }
    } else {
      const guestWheelsJson = localStorage.getItem("career_wheel_guest_wheels");
      const gWheels = guestWheelsJson ? JSON.parse(guestWheelsJson) : [];
      updatedWheels = gWheels.filter((w: SavedWheel) => w.id !== id);
      localStorage.setItem("career_wheel_guest_wheels", JSON.stringify(updatedWheels));
    }

    setSavedWheels(updatedWheels);
    if (compareWheel?.id === id) {
      setCompareWheel(null);
    }
    const delSuccessStr = lang === "en" ? "Measurement deleted from history" : lang === "chm" ? "Висымашым историй гыч кораш лие" : lang === "sah" ? "Сыанабыл уһулунна" : "Замер удален из истории";
    triggerToast(delSuccessStr);
  };

  const isDark = theme === "dark";

  return (
    <div className={theme}>
      <div className={`min-h-screen font-sans antialiased selection:bg-[#C5A059]/30 selection:text-white transition-colors duration-200 ${
        isDark ? "bg-[#0A0A0B] text-[#E5E5E7]" : "bg-zinc-50 text-zinc-800"
      }`}>
        
        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-6 py-3 text-sm font-semibold shadow-2xl flex items-center gap-2 border ${
                isDark 
                  ? "bg-[#0D0D0F] text-white border-[#C5A059]/40" 
                  : "bg-white text-zinc-900 border-[#C5A059]/50"
              }`}
            >
              <CheckCircle className="h-4 w-4 text-[#C5A059]" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Navigation Header */}
        <header className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-200 ${
          isDark ? "border-white/5 bg-[#0A0A0B]/85" : "border-zinc-200 bg-white/85"
        }`}>
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] shadow-lg shadow-[#C5A059]/5">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h1 className={`text-sm xs:text-base sm:text-lg font-light tracking-tight flex flex-wrap items-center gap-1.5 font-serif leading-tight ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}>
                  {t.title}
                </h1>
                <p className={`hidden text-xs sm:block tracking-wider font-light ${
                  isDark ? "text-white/40" : "text-zinc-500"
                }`}>
                  {t.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Elegant Language Selector */}
              <div className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
                isDark ? "border-white/10 bg-[#0D0D0F] text-white/80" : "border-zinc-200 bg-white text-zinc-700 shadow-xs"
              }`}>
                <Globe className="h-3.5 w-3.5 text-[#C5A059]" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Language)}
                  className="bg-transparent border-none outline-none text-xs font-semibold cursor-pointer focus:ring-0 pr-1 text-inherit"
                >
                  <option value="ru" className="bg-[#0D0D0F] dark:bg-[#0D0D0F] text-zinc-900 dark:text-white">Русский</option>
                  <option value="chm" className="bg-[#0D0D0F] dark:bg-[#0D0D0F] text-zinc-900 dark:text-white">Марий йылме</option>
                  <option value="sah" className="bg-[#0D0D0F] dark:bg-[#0D0D0F] text-zinc-900 dark:text-white">Саха тыла</option>
                  <option value="en" className="bg-[#0D0D0F] dark:bg-[#0D0D0F] text-zinc-900 dark:text-white">English</option>
                </select>
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={() => {
                  const nextTheme = theme === "dark" ? "light" : "dark";
                  setTheme(nextTheme);
                  localStorage.setItem("career_wheel_theme", nextTheme);
                }}
                className={`flex items-center justify-center p-2 rounded-lg border transition active:scale-95 cursor-pointer ${
                  isDark 
                    ? "border-white/10 bg-[#0D0D0F] text-white/80 hover:bg-white/5" 
                    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 shadow-xs"
                }`}
                title={theme === "dark" ? t.themeLight : t.themeDark}
              >
                {isDark ? (
                  <Sun className="h-4 w-4 text-[#C5A059]" />
                ) : (
                  <Moon className="h-4 w-4 text-[#C5A059]" />
                )}
              </button>

              {currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className={`text-[10px] font-semibold uppercase tracking-widest ${isDark ? "text-white/40" : "text-zinc-400"}`}>
                      {t.userLabel}
                    </p>
                    <p className="text-sm font-semibold text-[#DFC182]">{currentUser.username}</p>
                  </div>
                  <div className="h-9 w-9 flex items-center justify-center rounded-full bg-[#C5A059] font-bold text-[#0A0A0B] uppercase text-sm shadow-inner">
                    {currentUser.username.charAt(0)}
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition active:scale-95 cursor-pointer ${
                      isDark 
                        ? "border-white/10 bg-[#0D0D0F] text-white/80 hover:border-white/20 hover:text-white" 
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 shadow-xs"
                    }`}
                    title={t.logoutLabel}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{t.logoutLabel}</span>
                  </button>
                </div>
              ) : showAuth ? (
                <button
                  onClick={() => setShowAuth(false)}
                  className={`rounded-lg border px-4 py-1.5 text-xs font-semibold transition active:scale-95 cursor-pointer ${
                    isDark 
                      ? "border-white/10 bg-[#0D0D0F] text-white/80 hover:border-white/20 hover:text-white" 
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 shadow-xs"
                  }`}
                >
                  {lang === "en" ? "Go Back" : lang === "chm" ? "Мӧҥгеш пӧртылаш" : lang === "sah" ? "Төнүн" : "Назад"}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className={`hidden text-xs font-semibold md:inline-flex items-center gap-1 border px-2 py-0.5 rounded-md font-mono ${
                    isDark 
                      ? "text-[#DFC182] bg-[#C5A059]/10 border-[#C5A059]/20" 
                      : "text-[#8C6D32] bg-[#C5A059]/10 border-[#C5A059]/30"
                  }`}>
                    {t.guestMode}
                  </span>
                  <button
                    onClick={() => setShowAuth(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-[#C5A059] px-4 py-1.5 text-xs font-bold text-[#0A0A0B] shadow-lg hover:bg-[#DFC182] active:scale-95 transition cursor-pointer"
                  >
                    {t.loginRegister}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Hero Banner (For branding / explanation) */}
        <section className={`border-b py-12 px-4 text-center relative overflow-hidden transition-colors duration-200 ${
          isDark ? "bg-[#0F0F12] border-white/5" : "bg-white border-zinc-200"
        }`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.06),transparent_45%)]" />
          <div className="mx-auto max-w-3xl relative z-10">
            <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold mb-3 tracking-wider uppercase font-mono ${
              isDark 
                ? "bg-[#C5A059]/10 border-[#C5A059]/20 text-[#DFC182]" 
                : "bg-[#C5A059]/10 border-[#C5A059]/30 text-[#8C6D32]"
            }`}>
              <Award className="h-3.5 w-3.5 text-[#C5A059]" />
              {lang === "en" ? "Career Coaching Tool" : lang === "chm" ? "Карьер Коучинг ӱзгар" : lang === "sah" ? "Карьера коучинг тэрилэ" : "Инструмент Карьерного Коучинга"}
            </span>
            <h2 className={`text-2xl md:text-4xl font-light tracking-tight font-serif ${isDark ? "text-white" : "text-zinc-900"}`}>
              {t.heroTitle}
            </h2>
            <p className={`mt-2.5 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-light ${
              isDark ? "text-white/60" : "text-zinc-600"
            }`}>
              {t.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Main Container */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          {showAuth ? (
            <Auth onAuthSuccess={handleAuthSuccess} lang={lang} />
          ) : (
            <div className="space-y-8">
              
              {/* Top Workspace: Split Screen Layout */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
                
                {/* Left Column: Visualizer & Guidance (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Visualizer Component */}
                  <WheelChart
                    criteria={criteria}
                    compareCriteria={compareWheel?.criteria}
                    compareTitle={compareWheel?.title}
                    onScoreChange={handleScoreChange}
                    username={currentUser ? currentUser.username : undefined}
                    wheelTitle={wheelTitle}
                    lang={lang}
                    theme={theme}
                    colorMode={colorMode}
                    colorCritical={colorCritical}
                    colorRoutine={colorRoutine}
                    colorComfort={colorComfort}
                    colorPeak={colorPeak}
                  />

                  {/* Analytical & Coaching Guidance */}
                  <div className={`rounded-2xl border p-6 shadow-xl transition-all duration-200 ${
                    isDark ? "border-white/10 bg-[#0F0F12]" : "border-zinc-200 bg-white"
                  }`}>
                    <h3 className={`text-base font-light flex items-center gap-2 mb-4 font-serif ${isDark ? "text-white" : "text-zinc-900"}`}>
                      <BookOpen className="h-5 w-5 text-[#C5A059]" />
                      {t.howToReadHeader}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className={`rounded-xl p-4 border ${
                        isDark ? "bg-rose-500/5 border-rose-500/20" : "bg-rose-500/[0.02] border-rose-500/10"
                      }`}>
                        <h4 className="text-xs font-semibold text-rose-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 font-mono">
                          <span className="h-2 w-2 rounded-full bg-rose-500" />
                          {t.zoneCritical}
                        </h4>
                        <p className={`text-xs leading-relaxed ${isDark ? "text-white/60" : "text-zinc-600"}`}>
                          {t.zoneCriticalDesc}
                        </p>
                      </div>

                      <div className={`rounded-xl p-4 border ${
                        isDark ? "bg-amber-500/5 border-amber-500/20" : "bg-amber-500/[0.02] border-amber-500/10"
                      }`}>
                        <h4 className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 font-mono">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          {t.zoneRoutine}
                        </h4>
                        <p className={`text-xs leading-relaxed ${isDark ? "text-white/60" : "text-zinc-600"}`}>
                          {t.zoneRoutineDesc}
                        </p>
                      </div>

                      <div className={`rounded-xl p-4 border ${
                        isDark ? "bg-[#C5A059]/5 border-[#C5A059]/20" : "bg-[#C5A059]/5 border-[#C5A059]/35"
                      }`}>
                        <h4 className="text-xs font-semibold text-[#8C6D32] dark:text-[#DFC182] uppercase tracking-widest mb-1.5 flex items-center gap-1.5 font-mono">
                          <span className="h-2 w-2 rounded-full bg-[#C5A059]" />
                          {t.zoneComfort}
                        </h4>
                        <p className={`text-xs leading-relaxed ${isDark ? "text-white/60" : "text-zinc-600"}`}>
                          {t.zoneComfortDesc}
                        </p>
                      </div>

                      <div className={`rounded-xl p-4 border ${
                        isDark ? "bg-emerald-500/5 border-emerald-500/20" : "bg-emerald-500/[0.02] border-emerald-500/10"
                      }`}>
                        <h4 className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 font-mono">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          {t.zonePeak}
                        </h4>
                        <p className={`text-xs leading-relaxed ${isDark ? "text-white/60" : "text-zinc-600"}`}>
                          {t.zonePeakDesc}
                        </p>
                      </div>
                    </div>

                    <div className={`mt-4 rounded-xl p-4 border text-xs leading-relaxed ${
                      isDark 
                        ? "bg-[#0D0D0F] border-white/5 text-white/50" 
                        : "bg-zinc-50 border-zinc-200/60 text-zinc-600"
                    }`}>
                      <strong className="text-[#C5A059] block mb-1 font-serif">{t.coachTipHeader}</strong>
                      {t.coachTipDesc}
                    </div>
                  </div>

                </div>

                {/* Right Column: Spheres Editor & Config (5 Cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <WheelEditor
                    criteria={criteria}
                    wheelTitle={wheelTitle}
                    onChangeCriteria={setCriteria}
                    onChangeTitle={setWheelTitle}
                    onSave={handleSaveWheel}
                    isRegistered={!!currentUser}
                    lang={lang}
                    theme={theme}
                  />

                  {/* Color Settings Panel */}
                  <div className={`rounded-2xl border p-6 shadow-xl transition-all duration-200 ${
                    isDark ? "border-white/10 bg-[#0F0F12]" : "border-zinc-200 bg-white"
                  }`}>
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="h-5 w-5 text-[#C5A059]" />
                      <h3 className={`text-base font-light font-serif ${isDark ? "text-white" : "text-zinc-900"}`}>
                        {t.colorSettingsHeader}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Mode selection buttons */}
                      <div>
                        <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 ${
                          isDark ? "text-white/40" : "text-zinc-500"
                        }`}>
                          {t.colorModeLabel}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setColorMode("palette")}
                            className={`px-3 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                              colorMode === "palette"
                                ? "bg-[#C5A059] text-[#0A0A0B] border-[#C5A059]"
                                : isDark
                                  ? "border-white/10 bg-[#0D0D0F] text-white/80 hover:bg-white/5"
                                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                            }`}
                          >
                            {t.colorModePalette}
                          </button>
                          <button
                            onClick={() => setColorMode("scores")}
                            className={`px-3 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                              colorMode === "scores"
                                ? "bg-[#C5A059] text-[#0A0A0B] border-[#C5A059]"
                                : isDark
                                  ? "border-white/10 bg-[#0D0D0F] text-white/80 hover:bg-white/5"
                                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                            }`}
                          >
                            {t.colorModeScores}
                          </button>
                        </div>
                        <p className={`text-[10px] mt-2 leading-relaxed ${isDark ? "text-white/45" : "text-zinc-500"}`}>
                          {t.colorModeDesc}
                        </p>
                      </div>

                      {/* Colors Customizer Inputs */}
                      {colorMode === "scores" && (
                        <div className={`space-y-3 pt-3 border-t ${isDark ? "border-white/5" : "border-zinc-100"}`}>
                          <div className="flex items-center justify-between mb-1">
                            <label className={`block text-xs font-semibold uppercase tracking-widest ${
                              isDark ? "text-white/40" : "text-zinc-500"
                            }`}>
                              {t.colorCustomizerHeader}
                            </label>
                            <button
                              onClick={() => {
                                setColorCritical("#f43f5e");
                                setColorRoutine("#f59e0b");
                                setColorComfort("#DFC182");
                                setColorPeak("#10b981");
                                triggerToast(lang === "en" ? "Colors reset to defaults" : lang === "chm" ? "Тӱс-влак кудалтылыныт" : "Цвета сброшены по умолчанию");
                              }}
                              className="flex items-center gap-1 text-[10px] font-bold text-[#C5A059] hover:underline cursor-pointer"
                            >
                              <RotateCcw className="h-3 w-3" />
                              {t.colorResetBtn}
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            {/* Critical Range */}
                            <div className={`flex items-center justify-between p-2 rounded-xl border ${
                              isDark ? "border-white/5 bg-[#0D0D0F]" : "border-zinc-150 bg-zinc-50"
                            }`}>
                              <span className={`text-[11px] font-medium ${isDark ? "text-white/85" : "text-zinc-700"}`}>
                                1 - 3 ({lang === "en" ? "Critical" : lang === "chm" ? "Критик" : "Критич."})
                              </span>
                              <input
                                type="color"
                                value={colorCritical}
                                onChange={(e) => setColorCritical(e.target.value)}
                                className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                              />
                            </div>

                            {/* Routine Range */}
                            <div className={`flex items-center justify-between p-2 rounded-xl border ${
                              isDark ? "border-white/5 bg-[#0D0D0F]" : "border-zinc-150 bg-zinc-50"
                            }`}>
                              <span className={`text-[11px] font-medium ${isDark ? "text-white/85" : "text-zinc-700"}`}>
                                4 - 6 ({lang === "en" ? "Routine" : lang === "chm" ? "Рутина" : "Рутина"})
                              </span>
                              <input
                                type="color"
                                value={colorRoutine}
                                onChange={(e) => setColorRoutine(e.target.value)}
                                className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                              />
                            </div>

                            {/* Comfort Range */}
                            <div className={`flex items-center justify-between p-2 rounded-xl border ${
                              isDark ? "border-white/5 bg-[#0D0D0F]" : "border-zinc-150 bg-zinc-50"
                            }`}>
                              <span className={`text-[11px] font-medium ${isDark ? "text-white/85" : "text-zinc-700"}`}>
                                7 - 8 ({lang === "en" ? "Comfort" : lang === "chm" ? "Йӧнан" : "Комфорт"})
                              </span>
                              <input
                                type="color"
                                value={colorComfort}
                                onChange={(e) => setColorComfort(e.target.value)}
                                className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                              />
                            </div>

                            {/* Peak Range */}
                            <div className={`flex items-center justify-between p-2 rounded-xl border ${
                              isDark ? "border-white/5 bg-[#0D0D0F]" : "border-zinc-150 bg-zinc-50"
                            }`}>
                              <span className={`text-[11px] font-medium ${isDark ? "text-white/85" : "text-zinc-700"}`}>
                                9 - 10 ({lang === "en" ? "Peak" : lang === "chm" ? "Кӱкшыт" : "Пик"})
                              </span>
                              <input
                                type="color"
                                value={colorPeak}
                                onChange={(e) => setColorPeak(e.target.value)}
                                className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>

              {/* Individual Career Development Plan Section (IDP) */}
              <CareerPlan
                criteria={criteria}
                onChangeCriteria={setCriteria}
                lang={lang}
                theme={theme}
                activeUsername={currentUser ? currentUser.username : undefined}
                activeWheelTitle={wheelTitle}
              />

              {/* Bottom Row: History Timeline (Full Width) */}
              <div className={`border-t pt-8 ${isDark ? "border-white/5" : "border-zinc-200"}`}>
                <History
                  savedWheels={savedWheels}
                  onLoadWheel={handleLoadWheel}
                  onDeleteWheel={handleDeleteWheel}
                  onSelectForComparison={setCompareWheel}
                  compareWheel={compareWheel}
                  lang={lang}
                  theme={theme}
                />
              </div>

            </div>
          )}
        </main>

        {/* Footer */}
        <footer className={`border-t py-8 mt-16 text-center text-xs transition-colors duration-200 ${
          isDark ? "border-white/5 bg-[#0F0F12] text-white/40" : "border-zinc-200 bg-white text-zinc-500"
        }`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p>{t.footerCopy1}</p>
            <p className="mt-1">{t.footerCopy2}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
