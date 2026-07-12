"use client";

import {
  BookmarkPlus,
  Bot,
  ChevronDown,
  Copy,
  Download,
  Eye,
  Gauge,
  ImageIcon,
  LogOut,
  Bell,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  Tags,
  Trash2,
} from "lucide-react";
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { ServiceMenu } from "@/components/ServiceMenu";
import { auth } from "@/lib/firebase";
import {
  SpySaveAd,
  SpySaveAnalysis,
  SpySaveCompetitor,
  SpySaveNotification,
  deleteAdWithFallback,
  saveAd,
  saveAnalysis,
  updateAd,
  watchUserCompetitors,
  watchUserNotifications,
  watchUserAds,
} from "@/lib/ads";

type AdForm = {
  pageName: string;
  adText: string;
  mediaUrl: string;
  sourceUrl: string;
  landingPageUrl: string;
  tags: string;
  notes: string;
  folder: string;
};

const emptyForm: AdForm = {
  pageName: "",
  adText: "",
  mediaUrl: "",
  sourceUrl: "",
  landingPageUrl: "",
  tags: "",
  notes: "",
  folder: "",
};

function tagList(tags: string) {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function scoreStyle(verdict?: SpySaveAnalysis["verdict"]) {
  if (verdict === "Possible Winner") {
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  }

  if (verdict === "Good") {
    return "bg-amber-100 text-amber-800 border-amber-200";
  }

  return "bg-rose-100 text-rose-800 border-rose-200";
}

function scoreLabel(analysis?: SpySaveAnalysis) {
  if (!analysis?.winningScore) {
    return { score: "--", verdict: "Not scored" };
  }

  return {
    score: `${analysis.winningScore}/100`,
    verdict: analysis.verdict || "Good",
  };
}

function friendlyAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (
    message.includes("auth/invalid-credential") ||
    message.includes("auth/user-not-found") ||
    message.includes("auth/wrong-password")
  ) {
    return "Email or password is not correct. If this is your first time, switch to Register.";
  }

  if (message.includes("auth/email-already-in-use")) {
    return "This email already has an account. Switch to Login.";
  }

  if (message.includes("auth/weak-password")) {
    return "Password must be at least 6 characters.";
  }

  if (message.includes("auth/too-many-requests")) {
    return "Too many attempts. Wait a little, then try again.";
  }

  if (message.includes("auth/unauthorized-domain")) {
    return "This domain is not authorized in Firebase. Add spysave.vercel.app in Firebase Authorized domains.";
  }

  return "Authentication failed. Please check your details and try again.";
}

async function analyzeAd(form: AdForm) {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pageName: form.pageName,
      adText: form.adText,
      mediaUrl: form.mediaUrl,
      sourceUrl: form.sourceUrl,
      landingPageUrl: form.landingPageUrl,
    }),
  });

  if (!response.ok) {
    throw new Error("Analysis failed");
  }

  const data = (await response.json()) as { analysis: SpySaveAnalysis };
  return data.analysis;
}

export default function SpySaveApp() {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState<AdForm>(emptyForm);
  const [ads, setAds] = useState<SpySaveAd[]>([]);
  const [competitors, setCompetitors] = useState<SpySaveCompetitor[]>([]);
  const [notifications, setNotifications] = useState<SpySaveNotification[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [copiedUserId, setCopiedUserId] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(true);
  const [showExtensionHelper, setShowExtensionHelper] = useState(false);
  const [extensionConnectStatus, setExtensionConnectStatus] = useState("");
  const [selectedAd, setSelectedAd] = useState<SpySaveAd | null>(null);
  const [reAnalyzingId, setReAnalyzingId] = useState<string | null>(null);
  const [deletingAdId, setDeletingAdId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "winners" | "good" | "weak" | "unscored"
  >("all");
  const [activeCompetitor, setActiveCompetitor] = useState("all");

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setAds([]);
        setCompetitors([]);
        setNotifications([]);
        setShowExtensionHelper(false);
      } else {
        const helperSeenKey = `spysave-extension-helper-seen-${currentUser.uid}`;
        setShowExtensionHelper(
          window.localStorage.getItem(helperSeenKey) !== "yes",
        );
      }
      setStatus("");
      setError("");
    });
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    return watchUserAds(user.uid, setAds, (watchError) => {
      setError(watchError.message);
    });
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    return watchUserNotifications(user.uid, setNotifications, (watchError) => {
      setError(watchError.message);
    });
  }, [user]);

  useEffect(() => {
    function handleExtensionMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "SPYSAVE_EXTENSION_CONNECTED") return;

      setExtensionConnectStatus(
        event.data.message || "SpySave extension connected.",
      );

      if (user) {
        window.localStorage.setItem(
          `spysave-extension-helper-seen-${user.uid}`,
          "yes",
        );
        if (event.data?.ok !== false) {
          setShowExtensionHelper(false);
        }
      }
    }

    window.addEventListener("message", handleExtensionMessage);
    return () => window.removeEventListener("message", handleExtensionMessage);
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    return watchUserCompetitors(user.uid, setCompetitors, (watchError) => {
      setError(watchError.message);
    });
  }, [user]);

  const filteredAds = useMemo(() => {
    const scopedAds = ads.filter((ad) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "winners") {
        return ad.analysis?.verdict === "Possible Winner";
      }
      if (activeFilter === "good") return ad.analysis?.verdict === "Good";
      if (activeFilter === "weak") return ad.analysis?.verdict === "Weak";
      return !ad.analysis?.winningScore;
    });
    const competitorScopedAds =
      activeCompetitor === "all"
        ? scopedAds
        : scopedAds.filter((ad) => {
            return ad.pageName.toLowerCase() === activeCompetitor.toLowerCase();
          });

    const term = search.trim().toLowerCase();
    if (!term) return competitorScopedAds;

    return competitorScopedAds.filter((ad) => {
      return [
        ad.pageName,
        ad.adText,
        ad.mediaUrl,
        ad.folder,
        ad.notes,
        ad.analysis?.verdict,
        ...(ad.tags || []),
        ad.analysis?.hook,
        ad.analysis?.niche,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(term));
    });
  }, [activeCompetitor, activeFilter, ads, search]);

  const dashboardStats = useMemo(() => {
    const winners = ads.filter(
      (ad) => ad.analysis?.verdict === "Possible Winner",
    ).length;

    return [
      ["Saved ads", ads.length.toString()],
      ["Winners", winners.toString()],
      ["Competitors", competitors.length.toString()],
    ];
  }, [ads, competitors.length]);

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("Connecting...");

    try {
      if (authMode === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      setStatus("Account connected.");
    } catch (authError) {
      setError(friendlyAuthError(authError));
      setStatus("");
    }
  }

  async function handlePasswordReset() {
    setError("");
    setStatus("");

    if (!email.trim()) {
      setError("Add your email first, then click reset password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setStatus("Password reset email sent. Check your inbox.");
    } catch (resetError) {
      setError(friendlyAuthError(resetError));
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setError("");
    setStatus("Saving ad...");

    try {
      await saveAd({
        userId: user.uid,
        pageName: form.pageName || "Unknown page",
        adText: form.adText,
        mediaUrl: form.mediaUrl,
        sourceUrl: form.sourceUrl,
        landingPageUrl: form.landingPageUrl,
        platform: "Meta",
        tags: tagList(form.tags),
        notes: form.notes,
        folder: form.folder,
      });

      setForm(emptyForm);
      setStatus("Ad saved. Open detail page to run AI analysis.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed");
      setStatus("");
    } finally {
      setIsSaving(false);
    }
  }

  async function copyUserId() {
    await navigator.clipboard.writeText(user?.uid || "");
    setCopiedUserId(true);
    window.setTimeout(() => setCopiedUserId(false), 1800);
  }

  async function connectExtension() {
    if (!user) return;

    await navigator.clipboard.writeText(user.uid).catch(() => undefined);
    setExtensionConnectStatus("Connecting SpySave extension...");

    window.postMessage(
      {
        type: "SPYSAVE_CONNECT_EXTENSION",
        apiBase: window.location.origin,
        userId: user.uid,
      },
      window.location.origin,
    );

    window.setTimeout(() => {
      setExtensionConnectStatus((current) =>
        current === "Connecting SpySave extension..."
          ? "If it did not open, reload SpySave in chrome://extensions, then click Open extension again. Your User ID is already copied."
          : current,
      );
    }, 1400);
  }

  async function reAnalyzeAd(ad: SpySaveAd) {
    if (!ad.id) return;

    setReAnalyzingId(ad.id);
    setError("");

    try {
      const analysis = await analyzeAd({
        pageName: ad.pageName,
        adText: ad.adText,
        mediaUrl: ad.mediaUrl || "",
        sourceUrl: ad.sourceUrl || "",
        landingPageUrl: ad.landingPageUrl || "",
        tags: (ad.tags || []).join(", "),
        notes: ad.notes || "",
        folder: ad.folder || "",
      });

      await saveAnalysis(ad.id, analysis);
      setSelectedAd({ ...ad, analysis });
      setStatus("AI analysis refreshed.");
    } catch (analysisError) {
      setError(
        analysisError instanceof Error ? analysisError.message : "Re-analysis failed",
      );
    } finally {
      setReAnalyzingId(null);
    }
  }

  function loadAdIntoForm(ad: SpySaveAd) {
    setForm({
      pageName: ad.pageName || "",
      adText: ad.adText || "",
      mediaUrl: ad.mediaUrl || "",
      sourceUrl: ad.sourceUrl || "",
      landingPageUrl: ad.landingPageUrl || "",
      tags: (ad.tags || []).join(", "),
      notes: ad.notes || "",
      folder: ad.folder || "",
    });
    setShowSaveForm(true);
    setStatus("Ad details loaded into the save form.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteAd(ad: SpySaveAd) {
    if (!ad.id || !user) return;

    const confirmed = window.confirm("Delete this ad from SpySave?");
    if (!confirmed) return;

    setDeletingAdId(ad.id);
    setError("");
    setStatus("Deleting ad...");

    try {
      await deleteAdWithFallback(ad.id, user.uid);
      setAds((currentAds) => currentAds.filter((item) => item.id !== ad.id));
      if (selectedAd?.id === ad.id) {
        setSelectedAd(null);
      }
      setStatus("Ad deleted.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Could not delete ad",
      );
      setStatus("");
    } finally {
      setDeletingAdId(null);
    }
  }

  function exportCsv() {
    const fallbackHeaders = [
      "pageName",
      "verdict",
      "winningScore",
      "niche",
      "hook",
      "offer",
      "cta",
      "tags",
      "folder",
      "sourceUrl",
      "mediaUrl",
      "landingPageUrl",
      "adText",
    ];
    const rows = filteredAds.map((ad) => ({
      pageName: ad.pageName,
      verdict: ad.analysis?.verdict || "",
      winningScore: ad.analysis?.winningScore || "",
      niche: ad.analysis?.niche || "",
      hook: ad.analysis?.hook || "",
      offer: ad.analysis?.offer || "",
      cta: ad.analysis?.cta || "",
      tags: (ad.tags || []).join("|"),
      folder: ad.folder || "",
      sourceUrl: ad.sourceUrl || "",
      mediaUrl: ad.mediaUrl || "",
      landingPageUrl: ad.landingPageUrl || "",
      adText: ad.adText,
    }));
    const headers = Object.keys(rows[0] || Object.fromEntries(fallbackHeaders.map((key) => [key, ""])));
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = String(row[header as keyof typeof row] ?? "");
            return `"${value.replaceAll('"', '""')}"`;
          })
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `spysave-ads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!user) {
    return (
    <main className="aurora-page min-h-screen px-5 py-7 text-[#13231f]">
        <section className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 font-semibold">
              <BrandMark size={40} />
              SpySave
            </Link>
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#d8e8e1] bg-white/75 px-4 py-2 text-sm font-semibold text-[#29423a] backdrop-blur">
                <Sparkles size={15} className="text-[#d7ff64]" />
                Firebase dashboard ready
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold leading-[1.02] tracking-normal md:text-5xl">
                Create your swipe file for competitor ads.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-[#5c6863]">
                Save competitor ads, organize your research, and review AI
                insights from one workspace.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleAuth}
            className="premium-panel rounded-xl p-5 text-[#101413]"
          >
            <div className="mb-5 flex rounded-lg bg-[#eef2f0] p-1">
              {(["register", "login"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAuthMode(mode)}
                  className={`h-10 flex-1 rounded-md text-sm font-bold capitalize ${
                    authMode === mode ? "brand-gradient" : "text-[#5c6863]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <label className="grid gap-2 text-sm font-bold text-[#5c6863]">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-11 rounded-lg border border-[#d8dfdc] px-3 text-[#101413] outline-none focus:border-[#e15f41]"
              />
            </label>

            <label className="mt-4 grid gap-2 text-sm font-bold text-[#5c6863]">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                className="h-11 rounded-lg border border-[#d8dfdc] px-3 text-[#101413] outline-none focus:border-[#e15f41]"
              />
            </label>

            <button className="brand-gradient mt-5 h-11 w-full rounded-lg text-sm font-bold">
              {authMode === "register" ? "Create account" : "Login"}
            </button>

            {authMode === "login" ? (
              <button
                type="button"
                onClick={handlePasswordReset}
                className="mt-3 h-10 w-full rounded-lg border border-[#d8dfdc] bg-white text-sm font-bold text-[#3157d5]"
              >
                Forgot password?
              </button>
            ) : null}

            {status && <p className="mt-3 text-sm font-semibold text-[#2f8a61]">{status}</p>}
            {error && <p className="mt-3 text-sm font-semibold text-[#b42318]">{error}</p>}

          </form>

          <div className="grid gap-3 lg:col-span-2 md:grid-cols-3">
            {[
              ["1", "Save Meta ads", "Use the extension or manual form to capture competitor ads."],
              ["2", "Analyze with AI", "Get hook, offer, CTA, audience, and winning score."],
              ["3", "Track competitors", "Group ads by page and compare strongest creatives."],
            ].map(([step, title, body]) => (
              <article key={title} className="premium-panel rounded-xl p-4 text-[#101413]">
                <span className="brand-gradient grid size-9 place-items-center rounded-lg text-sm font-bold">
                  {step}
                </span>
                <h2 className="mt-3 text-lg font-semibold">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-[#5c6863]">{body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="aurora-page min-h-screen text-[#101413]">
      <header className="glass-nav border-b backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <BrandMark size={40} />
            <div>
              <p className="font-semibold leading-none">SpySave</p>
              <p className="text-xs text-[#4f635d]">{user.email}</p>
            </div>
          </Link>
          <button
            onClick={() => signOut(auth)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d8e8e1] bg-white/80 px-4 text-sm font-bold text-[#13231f]"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
        <ServiceMenu />
      </header>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-4 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="lg:col-span-2">
          <p className="text-sm font-bold uppercase text-[#07966f]">Dashboard</p>
          <h1 className="mt-1 text-4xl font-semibold">SpySave workspace</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4f635d]">
            Save competitor ads, connect your extension, and jump to your library or tracking page.
          </p>
        </div>

        {showExtensionHelper && (
          <section className="premium-panel rounded-xl border-2 border-[#3157d5] p-5 lg:col-span-2">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase text-[#3157d5]">
                  Required first setup
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  Connect your Chrome extension first
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#4f635d]">
                  Copy this User ID, open the SpySave extension on screen, and paste it once.
                  After that, SpySave will remember it.
                </p>
                {extensionConnectStatus ? (
                  <p className="mt-2 text-sm font-bold text-[#2f8a61]">
                    {extensionConnectStatus}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-2 sm:min-w-[420px]">
                <code className="max-w-full overflow-x-auto rounded-lg bg-[#eef2f0] px-3 py-3 text-xs font-bold text-[#101413]">
                  {user.uid}
                </code>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    onClick={copyUserId}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#d8e8e1] bg-white px-4 text-sm font-bold text-[#13231f]"
                  >
                    <Copy size={16} />
                    {copiedUserId ? "Copied" : "Copy User ID"}
                  </button>
                  <button
                    type="button"
                    onClick={connectExtension}
                    className="brand-gradient inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold"
                  >
                    <Sparkles size={16} />
                    Open extension
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="grid gap-2 lg:col-span-2 md:grid-cols-3">
          {dashboardStats.map(([label, value]) => (
            <div
              key={label}
              className="premium-panel rounded-xl p-4"
            >
              <p className="text-sm font-bold uppercase text-[#66736d]">{label}</p>
              <p className="mt-1 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        {!showExtensionHelper && (
        <div className="lg:col-span-2">
          <div className="premium-panel flex flex-wrap items-center justify-between gap-3 rounded-xl p-4">
            <div>
              <p className="text-sm font-bold uppercase text-[#e15f41]">
                Extension
              </p>
              <h2 className="mt-1 text-2xl font-semibold">
                Connect extension
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#5c6863]">
                Use this ID once to connect SpySave with your Chrome extension.
              </p>
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <code className="max-w-full overflow-x-auto rounded-lg bg-[#eef2f0] px-3 py-2 text-xs font-bold text-[#101413]">
                {user.uid}
              </code>
              <button
                onClick={copyUserId}
                className="brand-gradient inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold"
              >
                <Copy size={16} />
                {copiedUserId ? "Copied" : "Copy User ID"}
              </button>
            </div>
          </div>
        </div>
        )}

        <section className="hidden">
          <div className="grid gap-3 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-sm font-bold uppercase text-[#07966f]">
                Quick onboarding
              </p>
              <h2 className="mt-1 text-2xl font-semibold">Start in 3 steps</h2>
              <p className="mt-2 text-sm leading-6 text-[#4f635d]">
                This keeps the beta demo clear: connect extension, save one ad,
                then open AI detail.
              </p>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {[
                ["1", "Copy User ID"],
                ["2", "Open extension"],
                ["3", "Save first ad"],
              ].map(([step, label]) => (
                <div key={label} className="rounded-lg bg-[#eef8f2] p-3">
                  <span className="brand-gradient inline-grid size-7 place-items-center rounded-md text-xs font-bold">
                    {step}
                  </span>
                  <p className="mt-2 text-sm font-bold">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="premium-panel rounded-xl p-4 lg:col-start-1 lg:row-start-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase text-[#07966f]">Save</p>
              <h1 className="mt-1 text-2xl font-semibold">Save new ad</h1>
            </div>
            <button
              type="button"
              onClick={() => setShowSaveForm((current) => !current)}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-[#d8dfdc] text-[#5c6863]"
              aria-label="Toggle save form"
            >
              {showSaveForm ? <ChevronDown size={18} /> : <Plus size={18} />}
            </button>
          </div>

          {showSaveForm && (
            <form
          onSubmit={handleSave}
          className="mt-4"
        >
          <div className="grid gap-3">
            <label className="grid gap-2 text-sm font-bold text-[#625d53]">
              Page name
              <input
                value={form.pageName}
                onChange={(event) => setForm({ ...form, pageName: event.target.value })}
                placeholder="GlowLab"
                className="h-11 rounded-lg border border-[#d8d0c2] px-3 text-[#181713] outline-none focus:border-[#d25f3f]"
              />
            </label>

            <label className="grid gap-2 text-sm font-bold text-[#625d53]">
              Ad text
              <textarea
                value={form.adText}
                onChange={(event) => setForm({ ...form, adText: event.target.value })}
                required
                placeholder="Paste the ad copy here..."
                className="min-h-24 rounded-lg border border-[#d8d0c2] p-3 text-[#181713] outline-none focus:border-[#d25f3f]"
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-[#625d53]">
                Media URL
                <input
                  value={form.mediaUrl}
                  onChange={(event) => setForm({ ...form, mediaUrl: event.target.value })}
                  placeholder="Image/video URL"
                  className="h-11 rounded-lg border border-[#d8d0c2] px-3 text-[#181713] outline-none focus:border-[#d25f3f]"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-[#625d53]">
                Source URL
                <input
                  value={form.sourceUrl}
                  onChange={(event) => setForm({ ...form, sourceUrl: event.target.value })}
                  placeholder="Meta Ad Library link"
                  className="h-11 rounded-lg border border-[#d8d0c2] px-3 text-[#181713] outline-none focus:border-[#d25f3f]"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-[#625d53] md:col-span-2">
                Landing page URL
                <input
                  value={form.landingPageUrl}
                  onChange={(event) =>
                    setForm({ ...form, landingPageUrl: event.target.value })
                  }
                  placeholder="Store/product link"
                  className="h-11 rounded-lg border border-[#d8d0c2] px-3 text-[#181713] outline-none focus:border-[#d25f3f]"
                />
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-[#625d53]">
                Tags
                <input
                  value={form.tags}
                  onChange={(event) => setForm({ ...form, tags: event.target.value })}
                  placeholder="skincare, ugc, winning idea"
                  className="h-11 rounded-lg border border-[#d8d0c2] px-3 text-[#181713] outline-none focus:border-[#d25f3f]"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-[#625d53]">
                Folder
                <input
                  value={form.folder}
                  onChange={(event) => setForm({ ...form, folder: event.target.value })}
                  placeholder="Skincare research"
                  className="h-11 rounded-lg border border-[#d8d0c2] px-3 text-[#181713] outline-none focus:border-[#d25f3f]"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-bold text-[#625d53]">
              Notes
              <textarea
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                placeholder="Why did you save this ad?"
                className="min-h-20 rounded-lg border border-[#d8d0c2] p-3 text-[#181713] outline-none focus:border-[#d25f3f]"
              />
            </label>
          </div>

          <button
            disabled={isSaving}
            className="brand-gradient mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-bold disabled:opacity-60"
          >
            <Bot size={17} />
            {isSaving ? "Saving..." : "Save ad"}
          </button>

          {status && <p className="mt-3 text-sm font-semibold text-[#2f8a61]">{status}</p>}
          {error && <p className="mt-3 text-sm font-semibold text-[#b42318]">{error}</p>}
            </form>
          )}
        </section>

        <section className="premium-panel order-last rounded-xl p-4 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase text-[#07966f]">
                Tracking
              </p>
              <h2 className="mt-1 text-2xl font-semibold">
                Track competitors
              </h2>
              <p className="mt-1 text-sm text-[#4f635d]">
                Add competitor pages and compare their saved ads.
              </p>
            </div>
            <Link
              href="/app/competitors"
              className="brand-gradient inline-flex h-11 items-center rounded-lg px-4 text-sm font-bold"
            >
              Manage competitors
            </Link>
          </div>
        </section>

        <section className="premium-panel order-last rounded-xl p-4 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase text-[#07966f]">
                Notifications
              </p>
              <h2 className="mt-1 text-2xl font-semibold">
                Competitor updates
              </h2>
              <p className="mt-1 text-sm text-[#4f635d]">
                Alerts appear here when a tracked competitor gets a new saved ad.
              </p>
            </div>
            <span className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#eef8f2] px-3 text-sm font-bold text-[#08775d]">
              <Bell size={16} />
              {notifications.length} alerts
            </span>
          </div>

          <div className="mt-4 grid gap-2">
            {notifications.slice(0, 4).map((notification) => (
              <article
                key={notification.id}
                className="rounded-lg border border-[#d8e8e1] bg-white p-3"
              >
                <p className="font-bold">{notification.title}</p>
                <p className="mt-1 text-sm text-[#4f635d]">
                  {notification.message}
                </p>
              </article>
            ))}
            {!notifications.length ? (
              <div className="rounded-lg border border-dashed border-[#d8e8e1] bg-white/70 p-4 text-sm font-semibold text-[#4f635d]">
                No notifications yet.
              </div>
            ) : null}
          </div>
        </section>

        <section className="premium-panel rounded-xl p-4 lg:col-start-2 lg:row-start-3">
          <div className="flex h-full min-h-[280px] flex-col justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase text-[#07966f]">Library</p>
              <h2 className="mt-1 text-3xl font-semibold">
                Open ad library
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#4f635d]">
                Search, filter, export, delete, and review saved ads in one clean page.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-[#eef8f2] p-4">
                <p className="text-sm font-bold uppercase text-[#66736d]">
                  Saved ads
                </p>
                <p className="mt-1 text-3xl font-semibold">{ads.length}</p>
              </div>
              <Link
                href="/app/ads"
                className="brand-gradient inline-flex min-h-20 items-center justify-center rounded-lg px-4 text-sm font-bold"
              >
                Open saved ads
              </Link>
            </div>
          </div>
        </section>

        <section className="hidden">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase text-[#07966f]">Dashboard</p>
              <h2 className="mt-1 text-2xl font-semibold">Saved ads</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-11 min-w-64 items-center gap-2 rounded-lg border border-[#d8d0c2] px-3">
                <Search size={17} className="text-[#6f6a60]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search ads..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
              <button
                onClick={exportCsv}
                className="brand-gradient inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-bold"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-2">
              {[
                ["all", "All"],
                ["winners", "Winners"],
                ["good", "Good"],
                ["weak", "Weak"],
                ["unscored", "Unscored"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() =>
                    setActiveFilter(
                      value as "all" | "winners" | "good" | "weak" | "unscored",
                    )
                  }
                  className={`h-9 rounded-lg px-3 text-sm font-bold ${
                    activeFilter === value
                      ? "brand-gradient"
                      : "border border-[#d8d0c2] bg-white text-[#625d53]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <select
              value={activeCompetitor}
              onChange={(event) => setActiveCompetitor(event.target.value)}
              className="h-9 rounded-lg border border-[#d8d0c2] bg-white px-3 text-sm font-bold text-[#625d53] outline-none focus:border-[#d25f3f]"
            >
              <option value="all">All competitors</option>
              {competitors.map((competitor) => (
                <option key={competitor.id || competitor.name} value={competitor.name}>
                  {competitor.name}
                </option>
              ))}
            </select>
          </div>

          {filteredAds.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#d8d0c2] bg-[#fbf8f1] p-8 text-center">
              <BookmarkPlus className="mx-auto text-[#d25f3f]" />
              <h3 className="mt-4 text-xl font-semibold">No ads yet</h3>
              <p className="mt-2 text-sm leading-6 text-[#625d53]">
                Save your first competitor ad from the form. It will appear here
                from Firestore.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredAds.map((ad) => {
                const score = scoreLabel(ad.analysis);
                return (
                <article
                  key={ad.id}
                  className="rounded-lg border border-[#e0d7c8] bg-[#fbf8f1] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{ad.pageName}</p>
                      <p className="text-sm text-[#6f6a60]">
                        {ad.analysis?.niche || "Meta"} {ad.folder ? `- ${ad.folder}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold ${scoreStyle(ad.analysis?.verdict)}`}
                      >
                        <Gauge size={16} />
                        {score.score} {score.verdict}
                      </span>
                      <button
                        onClick={() => setSelectedAd(ad)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#d8d0c2] bg-white px-3 text-sm font-bold text-[#625d53]"
                      >
                        <Eye size={16} />
                        AI detail
                      </button>
                      {ad.id && !ad.id.startsWith("demo-") ? (
                        <Link
                          href={`/app/ads/${ad.id}`}
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#d8d0c2] bg-white px-3 text-sm font-bold text-[#625d53]"
                        >
                          Open page
                        </Link>
                      ) : null}
                      <button
                        onClick={() => reAnalyzeAd(ad)}
                        disabled={reAnalyzingId === ad.id}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#d8d0c2] bg-white px-3 text-sm font-bold text-[#625d53] disabled:opacity-60"
                      >
                        <RefreshCw size={16} />
                        {reAnalyzingId === ad.id ? "Analyzing" : "Re-analyze"}
                      </button>
                      <button
                        onClick={() => loadAdIntoForm(ad)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#d8d0c2] bg-white px-3 text-sm font-bold text-[#625d53]"
                      >
                        <RotateCcw size={16} />
                        Use in form
                      </button>
                      {ad.id && (
                        <button
                          onClick={() => handleDeleteAd(ad)}
                          disabled={deletingAdId === ad.id}
                          className="inline-flex size-9 items-center justify-center rounded-lg border border-[#d8d0c2] bg-white text-[#b42318] disabled:cursor-wait disabled:opacity-60"
                          aria-label="Delete ad"
                        >
                          {deletingAdId === ad.id ? (
                            <RefreshCw size={16} />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {ad.mediaUrl ? (
                    <a
                      href={ad.mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 flex items-center gap-3 rounded-lg border border-[#e0d7c8] bg-white p-3 text-sm font-bold text-[#625d53]"
                    >
                      <span
                        className="grid size-12 place-items-center rounded-md bg-[#f6f3ed] text-[#d25f3f]"
                        style={
                          /\.(png|jpe?g|webp|gif)$/i.test(ad.mediaUrl)
                            ? {
                                backgroundImage: `url(${ad.mediaUrl})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }
                            : undefined
                        }
                      >
                        {!/\.(png|jpe?g|webp|gif)$/i.test(ad.mediaUrl) ? (
                          <ImageIcon size={18} />
                        ) : null}
                      </span>
                      Open saved media
                    </a>
                  ) : null}

                  <p className="mt-3 text-sm leading-6">{ad.adText}</p>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className={`rounded-lg border p-3 ${scoreStyle(ad.analysis?.verdict)}`}>
                      <p className="flex items-center gap-2 text-xs font-bold uppercase">
                        <Gauge size={14} />
                        Winning Score
                      </p>
                      <p className="mt-2 text-2xl font-semibold">{score.score}</p>
                      <p className="mt-1 text-sm font-bold">{score.verdict}</p>
                    </div>
                    <div className="rounded-lg bg-white p-3">
                      <p className="flex items-center gap-2 text-xs font-bold uppercase text-[#8a8478]">
                        <Bot size={14} />
                        Hook
                      </p>
                      <p className="mt-2 text-sm font-medium leading-6">
                        {ad.analysis?.hook || "Not analyzed yet"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-3">
                      <p className="flex items-center gap-2 text-xs font-bold uppercase text-[#8a8478]">
                        <Sparkles size={14} />
                        Offer / CTA
                      </p>
                      <p className="mt-2 text-sm font-medium leading-6">
                        {ad.analysis?.offer || "No offer"} - {ad.analysis?.cta || "No CTA"}
                      </p>
                    </div>
                  </div>

                  {ad.analysis?.scoreReasons?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {ad.analysis.scoreReasons.map((reason) => (
                        <span
                          key={reason}
                          className="rounded-md bg-white px-2 py-1 text-xs font-bold text-[#625d53]"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(ad.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-bold text-[#625d53]"
                      >
                        <Tags size={13} />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {ad.id && (
                    <textarea
                      defaultValue={ad.notes || ""}
                      onBlur={(event) =>
                        updateAd(ad.id as string, {
                          notes: event.target.value,
                          tags: ad.tags || [],
                          folder: ad.folder || "",
                        })
                      }
                      placeholder="Notes..."
                      className="mt-4 min-h-20 w-full rounded-lg border border-[#d8d0c2] bg-white p-3 text-sm outline-none focus:border-[#d25f3f]"
                    />
                  )}
                </article>
                );
              })}
            </div>
          )}
        </section>
      </section>

      {selectedAd ? (
        <div className="fixed inset-0 z-50 bg-black/45 p-4 backdrop-blur-sm">
          <section className="mx-auto max-h-[92vh] max-w-4xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#e0d7c8] pb-4">
              <div>
                <p className="text-sm font-bold uppercase text-[#d25f3f]">
                  AI Analysis
                </p>
                <h2 className="mt-1 text-3xl font-semibold">{selectedAd.pageName}</h2>
                <p className="mt-1 text-sm text-[#625d53]">
                  {selectedAd.analysis?.niche || "Meta ad"}{" "}
                  {selectedAd.folder ? `- ${selectedAd.folder}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => reAnalyzeAd(selectedAd)}
                  disabled={reAnalyzingId === selectedAd.id}
                  className="brand-gradient inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold disabled:opacity-60"
                >
                  <RefreshCw size={16} />
                  {reAnalyzingId === selectedAd.id ? "Analyzing..." : "Re-analyze"}
                </button>
                <button
                  onClick={() => {
                    loadAdIntoForm(selectedAd);
                    setSelectedAd(null);
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d8d0c2] px-4 text-sm font-bold text-[#625d53]"
                >
                  <RotateCcw size={16} />
                  Use in form
                </button>
                <button
                  onClick={() => setSelectedAd(null)}
                  className="inline-flex h-10 items-center rounded-lg border border-[#d8d0c2] px-4 text-sm font-bold text-[#625d53]"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
              <div className={`rounded-lg border p-5 ${scoreStyle(selectedAd.analysis?.verdict)}`}>
                <p className="flex items-center gap-2 text-sm font-bold uppercase">
                  <Gauge size={17} />
                  Winning Score
                </p>
                <p className="mt-3 text-5xl font-semibold">
                  {scoreLabel(selectedAd.analysis).score}
                </p>
                <p className="mt-2 text-lg font-bold">
                  {scoreLabel(selectedAd.analysis).verdict}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(selectedAd.analysis?.scoreReasons || ["Not scored yet"]).map(
                    (reason) => (
                      <span
                        key={reason}
                        className="rounded-md bg-white/80 px-2 py-1 text-xs font-bold"
                      >
                        {reason}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-[#e0d7c8] bg-[#fbf8f1] p-5">
                <p className="text-sm font-bold uppercase text-[#8a8478]">Ad text</p>
                <p className="mt-3 text-sm leading-7">{selectedAd.adText}</p>
              </div>
            </div>

            {selectedAd.mediaUrl ? (
              <a
                href={selectedAd.mediaUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center gap-3 rounded-lg border border-[#e0d7c8] p-4 text-sm font-bold text-[#625d53]"
              >
                <span className="grid size-10 place-items-center rounded-md bg-[#f6f3ed] text-[#d25f3f]">
                  <ImageIcon size={18} />
                </span>
                Open media creative
              </a>
            ) : null}

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                ["Hook", selectedAd.analysis?.hook],
                ["Offer", selectedAd.analysis?.offer],
                ["CTA", selectedAd.analysis?.cta],
                ["Audience", selectedAd.analysis?.audienceGuess],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-[#e0d7c8] p-4">
                  <p className="text-xs font-bold uppercase text-[#8a8478]">{label}</p>
                  <p className="mt-2 text-sm font-medium leading-6">
                    {value || "Not analyzed yet"}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-[#e0d7c8] p-4">
              <p className="text-xs font-bold uppercase text-[#8a8478]">
                Why it may work
              </p>
              <p className="mt-2 text-sm leading-7">
                {selectedAd.analysis?.whyItMayWork || "Not analyzed yet"}
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-[#e0d7c8] p-4">
              <p className="text-xs font-bold uppercase text-[#8a8478]">
                Ideas to test
              </p>
              <div className="mt-3 grid gap-2">
                {(selectedAd.analysis?.ideasToTest || ["Re-analyze this ad"]).map(
                  (idea) => (
                    <div
                      key={idea}
                      className="rounded-lg bg-[#f6f3ed] px-3 py-2 text-sm font-medium"
                    >
                      {idea}
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
