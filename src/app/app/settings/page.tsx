"use client";

import { Globe2, KeyRound, LogOut, Monitor, Moon, ShieldAlert, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteUser, onAuthStateChanged, sendPasswordResetEmail, signOut, User } from "firebase/auth";
import { ServiceMenu } from "@/components/ServiceMenu";
import { useLanguage } from "@/components/LanguageProvider";
import { auth } from "@/lib/firebase";

type ThemeMode = "light" | "dark" | "system";

function applyTheme(mode: ThemeMode) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("spysave-dark", mode === "dark" || (mode === "system" && prefersDark));
  localStorage.setItem("spysave-theme", mode);
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<ThemeMode>(() => typeof window === "undefined" ? "system" : ((localStorage.getItem("spysave-theme") as ThemeMode | null) ?? "system"));
  const { locale, setLocale, t } = useLanguage();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => applyTheme(theme), [theme]);

  function updateTheme(nextTheme: ThemeMode) {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  function updateLanguage(nextLanguage: "en" | "fr" | "ar") {
    setLocale(nextLanguage);
    setMessage(t("languageSaved"));
  }

  async function resetPassword() {
    if (!user?.email) return;
    setError("");
    try {
      await sendPasswordResetEmail(auth, user.email);
      setMessage(`${t("passwordResetSent")} ${user.email}.`);
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : t("passwordResetFailed"));
    }
  }

  async function removeAccount() {
    if (!user || !window.confirm(t("deleteConfirm"))) return;
    setError("");
    try {
      await deleteUser(user);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : t("deleteFailed"));
    }
  }

  return <main className="aurora-page min-h-screen px-5 py-6 text-[#13231f]">
    <ServiceMenu />
    <section className="mx-auto max-w-4xl pt-24">
      <p className="app-kicker">{t("workspacePreferences")}</p><h1 className="mt-2 text-4xl font-semibold">{t("settings")}</h1>
      <p className="mt-2 text-sm font-semibold text-[#4f635d]">{t("settingsIntro")}</p>
      {message ? <p className="settings-message">{message}</p> : null}
      {error ? <p className="settings-error">{error}</p> : null}
      <div className="mt-6 grid gap-4">
        <section className="premium-panel rounded-xl p-5"><div className="flex items-start gap-3"><Globe2 className="text-[#07966f]" /><div><h2 className="text-xl font-semibold">{t("language")}</h2><p className="mt-1 text-sm text-[#4f635d]">{t("languageIntro")}</p></div></div><select value={locale} onChange={(event) => updateLanguage(event.target.value as "en" | "fr" | "ar")} className="settings-select"><option value="en">English</option><option value="fr">Français</option><option value="ar">العربية</option></select></section>
        <section className="premium-panel rounded-xl p-5"><div className="flex items-start gap-3"><Monitor className="text-[#3157d5]" /><div><h2 className="text-xl font-semibold">{t("screenMode")}</h2><p className="mt-1 text-sm text-[#4f635d]">{t("screenModeIntro")}</p></div></div><div className="mt-4 grid gap-2 sm:grid-cols-3">{[{ value: "light", label: t("light"), icon: Sun }, { value: "dark", label: t("dark"), icon: Moon }, { value: "system", label: t("system"), icon: Monitor }].map(({ value, label, icon: Icon }) => <button key={value} type="button" onClick={() => updateTheme(value as ThemeMode)} className={`settings-choice${theme === value ? " is-selected" : ""}`}><Icon size={17} />{label}</button>)}</div></section>
        <section className="premium-panel rounded-xl p-5"><div className="flex items-start gap-3"><KeyRound className="text-[#7a50c9]" /><div><h2 className="text-xl font-semibold">{t("passwordSession")}</h2><p className="mt-1 text-sm text-[#4f635d]">{t("passwordSessionIntro")}</p></div></div><div className="mt-4 flex flex-wrap gap-3"><button type="button" className="settings-action" onClick={resetPassword}>{t("sendPasswordReset")}</button><button type="button" className="settings-action settings-logout" onClick={() => signOut(auth)}><LogOut size={16} />{t("logOut")}</button></div></section>
        <section className="rounded-xl border border-[#f0c8c2] bg-[#fff9f8] p-5"><div className="flex items-start gap-3"><ShieldAlert className="text-[#b42318]" /><div><h2 className="text-xl font-semibold">{t("deleteAccount")}</h2><p className="mt-1 text-sm text-[#7a4a45]">{t("deleteAccountIntro")}</p></div></div><button type="button" className="settings-delete mt-4" onClick={removeAccount}>{t("deleteAccount")}</button></section>
      </div>
    </section>
  </main>;
}
