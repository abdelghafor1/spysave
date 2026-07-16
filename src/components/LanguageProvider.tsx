"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "en" | "fr" | "ar";

const dictionary = {
  en: { dashboard: "Dashboard", savedAds: "Saved Ads", tracking: "Tracking", reports: "Reports", notifications: "Notifications", billing: "Billing", help: "Help", settings: "Settings", account: "Account", productNavigation: "Product navigation", accountControls: "Account controls", spySaveDashboard: "SpySave dashboard", workspacePreferences: "Workspace preferences", settingsIntro: "Control how SpySave looks, reads, and protects your account.", language: "Language", languageIntro: "Choose the language used across the SpySave interface.", screenMode: "Screen mode", screenModeIntro: "Choose the appearance that feels best for your workspace.", light: "Light", dark: "Dark", system: "System", passwordSession: "Password and session", passwordSessionIntro: "Manage access to your SpySave account.", sendPasswordReset: "Send password reset", logOut: "Log out", deleteAccount: "Delete account", deleteAccountIntro: "Permanently remove this Firebase sign-in account. You may need to sign in again before this action is allowed.", languageSaved: "Language changed across SpySave.", passwordResetSent: "A password reset link was sent to", passwordResetFailed: "Could not send the reset email.", deleteConfirm: "Delete this sign-in account? This cannot be undone.", deleteFailed: "Could not delete the account.", yourProfile: "Your SpySave profile", accountIntro: "Your sign-in details and workspace identity.", loadingAccount: "Loading account...", workspaceMember: "SpySave workspace member", email: "Email", accountId: "Account ID", created: "Created", lastSignIn: "Last sign in", notAvailable: "Not available" },
  fr: { dashboard: "Tableau de bord", savedAds: "Annonces sauvegardées", tracking: "Suivi", reports: "Rapports", notifications: "Notifications", billing: "Facturation", help: "Aide", settings: "Paramètres", account: "Compte", productNavigation: "Navigation du produit", accountControls: "Contrôles du compte", spySaveDashboard: "Tableau de bord SpySave", workspacePreferences: "Préférences de l'espace", settingsIntro: "Contrôlez l'apparence, la langue et la sécurité de SpySave.", language: "Langue", languageIntro: "Choisissez la langue utilisée dans toute l'interface SpySave.", screenMode: "Mode d'affichage", screenModeIntro: "Choisissez l'apparence la plus confortable pour votre espace.", light: "Clair", dark: "Sombre", system: "Système", passwordSession: "Mot de passe et session", passwordSessionIntro: "Gérez l'accès à votre compte SpySave.", sendPasswordReset: "Envoyer la réinitialisation", logOut: "Se déconnecter", deleteAccount: "Supprimer le compte", deleteAccountIntro: "Supprime définitivement ce compte Firebase. Il peut être nécessaire de vous reconnecter avant cette action.", languageSaved: "La langue a été appliquée dans SpySave.", passwordResetSent: "Un lien de réinitialisation a été envoyé à", passwordResetFailed: "Impossible d'envoyer l'e-mail de réinitialisation.", deleteConfirm: "Supprimer ce compte de connexion ? Cette action est définitive.", deleteFailed: "Impossible de supprimer le compte.", yourProfile: "Votre profil SpySave", accountIntro: "Vos informations de connexion et l'identité de votre espace.", loadingAccount: "Chargement du compte...", workspaceMember: "Membre de l'espace SpySave", email: "E-mail", accountId: "ID du compte", created: "Créé le", lastSignIn: "Dernière connexion", notAvailable: "Non disponible" },
  ar: { dashboard: "لوحة التحكم", savedAds: "الإعلانات المحفوظة", tracking: "تتبع المنافسين", reports: "التقارير", notifications: "الإشعارات", billing: "الفوترة", help: "المساعدة", settings: "الإعدادات", account: "الحساب", productNavigation: "تنقل المنتج", accountControls: "إعدادات الحساب", spySaveDashboard: "لوحة تحكم SpySave", workspacePreferences: "تفضيلات مساحة العمل", settingsIntro: "تحكم في مظهر SpySave ولغته وأمان حسابك.", language: "اللغة", languageIntro: "اختر اللغة المستعملة في واجهة SpySave كاملة.", screenMode: "مظهر الشاشة", screenModeIntro: "اختر المظهر الأنسب لمساحة عملك.", light: "فاتح", dark: "داكن", system: "تلقائي", passwordSession: "كلمة المرور والجلسة", passwordSessionIntro: "إدارة الوصول إلى حساب SpySave الخاص بك.", sendPasswordReset: "إرسال إعادة تعيين كلمة المرور", logOut: "تسجيل الخروج", deleteAccount: "حذف الحساب", deleteAccountIntro: "حذف حساب Firebase هذا بشكل نهائي. قد تحتاج إلى تسجيل الدخول من جديد قبل تنفيذ العملية.", languageSaved: "تم تطبيق اللغة على SpySave.", passwordResetSent: "تم إرسال رابط إعادة تعيين كلمة المرور إلى", passwordResetFailed: "تعذر إرسال رسالة إعادة التعيين.", deleteConfirm: "حذف حساب تسجيل الدخول هذا؟ لا يمكن التراجع عن العملية.", deleteFailed: "تعذر حذف الحساب.", yourProfile: "ملف SpySave الخاص بك", accountIntro: "بيانات تسجيل الدخول وهوية مساحة العمل.", loadingAccount: "جار تحميل الحساب...", workspaceMember: "عضو في مساحة SpySave", email: "البريد الإلكتروني", accountId: "معرف الحساب", created: "تاريخ الإنشاء", lastSignIn: "آخر تسجيل دخول", notAvailable: "غير متاح" },
} as const;

export type TranslationKey = keyof typeof dictionary.en;

type LanguageContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (key: TranslationKey) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);

function validLocale(value: string | null): value is Locale { return value === "en" || value === "fr" || value === "ar"; }
function applyLocale(locale: Locale) { document.documentElement.lang = locale; document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"; }

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    const storedLocale = localStorage.getItem("spysave-language");
    return validLocale(storedLocale) ? storedLocale : "en";
  });
  useEffect(() => {
    applyLocale(locale);
    const onLanguageChange = (event: Event) => {
      const nextLocale = (event as CustomEvent<Locale>).detail;
      if (validLocale(nextLocale)) { setLocaleState(nextLocale); applyLocale(nextLocale); }
    };
    window.addEventListener("spysave-language-change", onLanguageChange);
    return () => window.removeEventListener("spysave-language-change", onLanguageChange);
  }, [locale]);
  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    setLocale(nextLocale) { localStorage.setItem("spysave-language", nextLocale); applyLocale(nextLocale); setLocaleState(nextLocale); window.dispatchEvent(new CustomEvent("spysave-language-change", { detail: nextLocale })); },
    t: (key) => dictionary[locale][key],
  }), [locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
