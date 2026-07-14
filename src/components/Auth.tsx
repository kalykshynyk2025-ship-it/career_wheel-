/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User } from "../types";
import { UserCheck, UserPlus, LogIn, ArrowRight, Sparkles, LogIn as GuestIcon } from "lucide-react";
import { motion } from "motion/react";
import { Language, TRANSLATIONS } from "../translations";

interface AuthProps {
  onAuthSuccess: (user: User | null) => void; // null means guest mode
  lang: Language;
}

export function Auth({ onAuthSuccess, lang }: AuthProps) {
  const t = TRANSLATIONS[lang];
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim() || !password.trim()) {
      setError(t.authEmptyFieldsErr);
      return;
    }

    const trimmedUsername = username.trim();
    const storedUsersJson = localStorage.getItem("career_wheel_users");
    const users: User[] = storedUsersJson ? JSON.parse(storedUsersJson) : [];

    if (isLogin) {
      // Login flow
      const user = users.find(
        (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
      );
      if (!user) {
        setError(t.authNotFoundErr);
        return;
      }
      if (user.passwordHash !== password) {
        setError(t.authWrongPassErr);
        return;
      }
      
      // Store current user session
      localStorage.setItem("career_wheel_current_user", JSON.stringify(user));
      setSuccess(t.authSuccessLogin);
      setTimeout(() => {
        onAuthSuccess(user);
      }, 800);
    } else {
      // Registration flow
      const userExists = users.some(
        (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
      );
      if (userExists) {
        setError(t.authExistsErr);
        return;
      }

      const newUser: User = {
        username: trimmedUsername,
        passwordHash: password, // simple storage for static preview demo
        wheels: [],
      };

      users.push(newUser);
      localStorage.setItem("career_wheel_users", JSON.stringify(users));
      localStorage.setItem("career_wheel_current_user", JSON.stringify(newUser));
      
      setSuccess(t.authSuccessRegister);
      setTimeout(() => {
        onAuthSuccess(newUser);
      }, 800);
    }
  };

  const handleGuestMode = () => {
    localStorage.removeItem("career_wheel_current_user");
    onAuthSuccess(null);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl border border-zinc-200/50 bg-white dark:border-white/10 dark:bg-[#0F0F12] p-8 shadow-2xl transition-colors duration-200"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#C5A059]/10 text-[#C5A059]">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-light text-zinc-900 dark:text-white font-serif">
            {isLogin ? t.authTitleLogin : t.authTitleRegister}
          </h2>
          <p className="mt-2 text-xs text-zinc-500 dark:text-white/40 tracking-wider">
            {isLogin ? t.authDescLogin : t.authDescRegister}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 dark:text-white/40 uppercase tracking-widest mb-1">
              {t.authUsernameLabel}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.authUsernamePlaceholder}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-[#0D0D0F] px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-white/20 outline-none transition duration-150 focus:border-[#C5A059] focus:bg-white dark:focus:bg-[#0A0A0B]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 dark:text-white/40 uppercase tracking-widest mb-1">
              {t.authPasswordLabel}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.authPasswordPlaceholder}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-[#0D0D0F] px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-white/20 outline-none transition duration-150 focus:border-[#C5A059] focus:bg-white dark:focus:bg-[#0A0A0B]"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-medium text-rose-500 dark:text-rose-400"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/20 p-3 text-xs font-medium text-[#C5A059] dark:text-[#DFC182]"
            >
              {success}
            </motion.div>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#C5A059] px-4 py-2.5 text-sm font-bold text-[#0A0A0B] shadow-lg hover:bg-[#DFC182] active:scale-[0.98] transition cursor-pointer"
          >
            {isLogin ? (
              <>
                <LogIn className="h-4 w-4" /> {t.authLoginBtn}
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> {t.authRegisterBtn}
              </>
            )}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 text-center border-t border-zinc-100 dark:border-white/5 pt-4">
          <p className="text-xs text-zinc-500 dark:text-white/40">
            {isLogin ? t.authNoAccount : t.authHaveAccount}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccess("");
              }}
              className="font-bold text-[#C5A059] hover:underline cursor-pointer"
            >
              {isLogin ? t.authRegisterLink : t.authLoginLink}
            </button>
          </p>

          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100 dark:border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="bg-white dark:bg-[#0F0F12] px-2 text-zinc-400 dark:text-white/30 transition-colors">
                {t.authOr}
              </span>
            </div>
          </div>

          <button
            onClick={handleGuestMode}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-white/10 dark:bg-[#0D0D0F] dark:hover:bg-[#121215] px-4 py-2.5 text-sm font-bold text-zinc-700 dark:text-white/80 hover:border-[#C5A059]/50 hover:text-[#C5A059] active:scale-[0.98] transition cursor-pointer"
          >
            <GuestIcon className="h-4 w-4 text-[#C5A059]" />
            {t.authContinueGuest}
          </button>
          <span className="text-[10px] text-zinc-400 dark:text-white/30">
            {t.authGuestWarning}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
