"use client";

import {
  BookmarkPlus,
  ChevronLeft,
  Download,
  Gauge,
  RefreshCw,
  Search,
  Tags,
  Trash2,
} from "lucide-react";
import { User, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SavedAdMedia } from "@/components/SavedAdMedia";
import { ServiceMenu } from "@/components/ServiceMenu";
import {
  SpySaveAd,
  SpySaveAnalysis,
  deleteAdWithFallback,
  updateAd,
  watchUserAds,
} from "@/lib/ads";
import { auth } from "@/lib/firebase";

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
  if (!analysis?.winningScore) return { score: "--", verdict: "Not scored" };
  return {
    score: `${analysis.winningScore}/100`,
    verdict: analysis.verdict || "Good",
  };
}

export default function SavedAdsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ads, setAds] = useState<SpySaveAd[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "winners" | "good" | "weak" | "unscored"
  >("all");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [deletingAdId, setDeletingAdId] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setAds([]);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    return watchUserAds(user.uid, setAds, (watchError) => {
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

    const term = search.trim().toLowerCase();
    if (!term) return scopedAds;

    return scopedAds.filter((ad) =>
      [
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
        .some((value) => value?.toLowerCase().includes(term)),
    );
  }, [activeFilter, ads, search]);

  function exportCsv() {
    const headers = [
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

  async function handleDeleteAd(ad: SpySaveAd) {
    if (!ad.id || !user) return;
    if (!window.confirm("Delete this ad from SpySave?")) return;

    setDeletingAdId(ad.id);
    setError("");
    setStatus("Deleting ad...");

    try {
      await deleteAdWithFallback(ad.id, user.uid);
      setAds((currentAds) => currentAds.filter((item) => item.id !== ad.id));
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

  return (
    <main className="aurora-page min-h-screen text-[#13231f]">
      <header className="glass-nav border-b backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <Link
            href="/app"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d8e8e1] bg-white/80 px-4 text-sm font-bold"
          >
            <ChevronLeft size={16} />
            Dashboard
          </Link>
          <div className="text-right">
            <p className="text-sm font-bold uppercase text-[#07966f]">Library</p>
            <h1 className="text-2xl font-semibold">Saved ads</h1>
          </div>
        </div>
        <ServiceMenu />
      </header>

      <section className="mx-auto max-w-7xl px-5 py-5">
        <div className="premium-panel rounded-xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase text-[#07966f]">
                Saved ads board
              </p>
              <h2 className="mt-1 text-3xl font-semibold">
                {ads.length} ads in your library
              </h2>
              <p className="mt-1 text-sm text-[#4f635d]">
                Search, filter, export, delete, and open AI detail from one page.
              </p>
              {user ? (
                <p className="mt-2 rounded-lg border border-[#d8e8e1] bg-white px-3 py-2 text-xs font-bold text-[#4f635d]">
                  Dashboard User ID:{" "}
                  <span className="font-mono text-[#13231f]">{user.uid}</span>
                </p>
              ) : null}
            </div>
            <button
              onClick={exportCsv}
              className="brand-gradient inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-bold"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="flex h-11 min-w-72 flex-1 items-center gap-2 rounded-lg border border-[#d8d0c2] bg-white px-3">
              <Search size={17} className="text-[#6f6a60]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search page, hook, tag, folder..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
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
                className={`h-10 rounded-lg px-3 text-sm font-bold ${
                  activeFilter === value
                    ? "brand-gradient"
                    : "border border-[#d8d0c2] bg-white text-[#625d53]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {status ? (
            <p className="mt-3 text-sm font-bold text-[#2f8a61]">{status}</p>
          ) : null}
          {error ? (
            <p className="mt-3 text-sm font-bold text-[#b42318]">{error}</p>
          ) : null}
        </div>

        <div className="mt-4">
          {!user ? (
            <section className="premium-panel rounded-xl p-6 text-center">
              <BookmarkPlus className="mx-auto text-[#d25f3f]" />
              <h2 className="mt-3 text-2xl font-semibold">Login required</h2>
              <p className="mt-2 text-sm text-[#4f635d]">
                Open dashboard and login first.
              </p>
            </section>
          ) : filteredAds.length === 0 ? (
            <section className="premium-panel rounded-xl p-8 text-center">
              <BookmarkPlus className="mx-auto text-[#d25f3f]" />
              <h2 className="mt-3 text-2xl font-semibold">No saved ads yet</h2>
              <p className="mt-2 text-sm text-[#4f635d]">
                Save ads from the extension or dashboard form. They will appear here.
              </p>
            </section>
          ) : (
            <div className="grid gap-4">
              {filteredAds.map((ad) => {
                const score = scoreLabel(ad.analysis);

                return (
                  <article
                    key={ad.id}
                    className="premium-panel rounded-xl p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xl font-semibold">{ad.pageName}</p>
                        <p className="text-sm text-[#6f6a60]">
                          {ad.analysis?.niche || "Meta"}{" "}
                          {ad.folder ? `- ${ad.folder}` : ""}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-bold ${scoreStyle(ad.analysis?.verdict)}`}
                        >
                          <Gauge size={16} />
                          {score.score} {score.verdict}
                        </span>
                        {ad.id ? (
                          <Link
                            href={`/app/ads/${ad.id}`}
                            className="brand-gradient inline-flex h-9 items-center rounded-lg px-3 text-sm font-bold"
                          >
                            Open detail
                          </Link>
                        ) : null}
                        {ad.id ? (
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
                        ) : null}
                      </div>
                    </div>

                    <SavedAdMedia mediaUrl={ad.mediaUrl} label="Product creative" />

                    <p className="mt-3 text-sm leading-6">{ad.adText}</p>

                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      <div className={`rounded-lg border p-3 ${scoreStyle(ad.analysis?.verdict)}`}>
                        <p className="text-xs font-bold uppercase">Winning Score</p>
                        <p className="mt-2 text-2xl font-semibold">{score.score}</p>
                      </div>
                      <div className="rounded-lg bg-white p-3">
                        <p className="text-xs font-bold uppercase text-[#8a8478]">
                          Hook
                        </p>
                        <p className="mt-2 text-sm font-medium leading-6">
                          {ad.analysis?.hook || "Not analyzed yet"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white p-3">
                        <p className="text-xs font-bold uppercase text-[#8a8478]">
                          Offer / CTA
                        </p>
                        <p className="mt-2 text-sm font-medium leading-6">
                          {ad.analysis?.offer || "No offer"} -{" "}
                          {ad.analysis?.cta || "No CTA"}
                        </p>
                      </div>
                    </div>

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

                    {ad.id ? (
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
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
