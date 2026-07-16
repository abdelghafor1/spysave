"use client";

import { CalendarDays, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { ServiceMenu } from "@/components/ServiceMenu";
import { useLanguage } from "@/components/LanguageProvider";
import { auth } from "@/lib/firebase";

function formatDate(value?: string | null) { return value ? new Date(value).toLocaleString() : "Not available"; }

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const { t } = useLanguage();
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  return <main className="aurora-page min-h-screen px-5 py-6 text-[#13231f]">
    <ServiceMenu />
    <section className="mx-auto max-w-4xl pt-24"><p className="app-kicker">{t("yourProfile")}</p><h1 className="mt-2 text-4xl font-semibold">{t("account")}</h1><p className="mt-2 text-sm font-semibold text-[#4f635d]">{t("accountIntro")}</p>
      <section className="premium-panel mt-6 rounded-xl p-6"><div className="flex items-center gap-4"><span className="account-avatar">{user?.email?.slice(0, 1).toUpperCase() ?? "S"}</span><div><h2 className="text-2xl font-semibold">{user?.email ?? t("loadingAccount")}</h2><p className="mt-1 text-sm text-[#4f635d]">{t("workspaceMember")}</p></div></div>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2"><div className="account-detail"><dt><Mail size={16} />{t("email")}</dt><dd>{user?.email ?? t("notAvailable")}</dd></div><div className="account-detail"><dt><ShieldCheck size={16} />{t("accountId")}</dt><dd className="break-all">{user?.uid ?? t("notAvailable")}</dd></div><div className="account-detail"><dt><CalendarDays size={16} />{t("created")}</dt><dd>{formatDate(user?.metadata.creationTime)}</dd></div><div className="account-detail"><dt><UserRound size={16} />{t("lastSignIn")}</dt><dd>{formatDate(user?.metadata.lastSignInTime)}</dd></div></dl>
      </section>
    </section>
  </main>;
}
