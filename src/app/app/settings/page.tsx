"use client";

import { Globe2, KeyRound, LogOut, Monitor, Moon, ShieldAlert, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteUser, onAuthStateChanged, sendPasswordResetEmail, signOut, User } from "firebase/auth";
import { ServiceMenu } from "@/components/ServiceMenu";
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
  const [language, setLanguage] = useState(() => typeof window === "undefined" ? "en" : (localStorage.getItem("spysave-language") ?? "en"));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => applyTheme(theme), [theme]);

  function updateTheme(nextTheme: ThemeMode) {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  function updateLanguage(nextLanguage: string) {
    setLanguage(nextLanguage);
    localStorage.setItem("spysave-language", nextLanguage);
    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = nextLanguage === "ar" ? "rtl" : "ltr";
    setMessage("Language preference saved.");
  }

  async function resetPassword() {
    if (!user?.email) return;
    setError("");
    try {
      await sendPasswordResetEmail(auth, user.email);
      setMessage(`A password reset link was sent to ${user.email}.`);
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Could not send the reset email.");
    }
  }

  async function removeAccount() {
    if (!user || !window.confirm("Delete this sign-in account? This cannot be undone.")) return;
    setError("");
    try {
      await deleteUser(user);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete the account.");
    }
  }

  return <main className="aurora-page min-h-screen px-5 py-6 text-[#13231f]">
    <ServiceMenu />
    <section className="mx-auto max-w-4xl pt-16">
      <p className="app-kicker">Workspace preferences</p><h1 className="mt-2 text-4xl font-semibold">Settings</h1>
      <p className="mt-2 text-sm font-semibold text-[#4f635d]">Control how SpySave looks, reads, and protects your account.</p>
      {message ? <p className="settings-message">{message}</p> : null}
      {error ? <p className="settings-error">{error}</p> : null}
      <div className="mt-6 grid gap-4">
        <section className="premium-panel rounded-xl p-5"><div className="flex items-start gap-3"><Globe2 className="text-[#07966f]" /><div><h2 className="text-xl font-semibold">Language</h2><p className="mt-1 text-sm text-[#4f635d]">Save your preferred language for this browser.</p></div></div><select value={language} onChange={(event) => updateLanguage(event.target.value)} className="settings-select"><option value="en">English</option><option value="fr">Francais</option><option value="ar">Arabic</option></select></section>
        <section className="premium-panel rounded-xl p-5"><div className="flex items-start gap-3"><Monitor className="text-[#3157d5]" /><div><h2 className="text-xl font-semibold">Screen mode</h2><p className="mt-1 text-sm text-[#4f635d]">Choose the appearance that feels best for your workspace.</p></div></div><div className="mt-4 grid gap-2 sm:grid-cols-3">{[{ value: "light", label: "Light", icon: Sun }, { value: "dark", label: "Dark", icon: Moon }, { value: "system", label: "System", icon: Monitor }].map(({ value, label, icon: Icon }) => <button key={value} type="button" onClick={() => updateTheme(value as ThemeMode)} className={`settings-choice${theme === value ? " is-selected" : ""}`}><Icon size={17} />{label}</button>)}</div></section>
        <section className="premium-panel rounded-xl p-5"><div className="flex items-start gap-3"><KeyRound className="text-[#7a50c9]" /><div><h2 className="text-xl font-semibold">Password and session</h2><p className="mt-1 text-sm text-[#4f635d]">Manage access to your SpySave account.</p></div></div><div className="mt-4 flex flex-wrap gap-3"><button type="button" className="settings-action" onClick={resetPassword}>Send password reset</button><button type="button" className="settings-action settings-logout" onClick={() => signOut(auth)}><LogOut size={16} />Log out</button></div></section>
        <section className="rounded-xl border border-[#f0c8c2] bg-[#fff9f8] p-5"><div className="flex items-start gap-3"><ShieldAlert className="text-[#b42318]" /><div><h2 className="text-xl font-semibold">Delete account</h2><p className="mt-1 text-sm text-[#7a4a45]">Permanently remove this Firebase sign-in account. You may need to sign in again before this action is allowed.</p></div></div><button type="button" className="settings-delete mt-4" onClick={removeAccount}>Delete account</button></section>
      </div>
    </section>
  </main>;
}
