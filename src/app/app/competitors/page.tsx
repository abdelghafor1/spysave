"use client";

import { Building2, ChevronLeft, Plus, RefreshCw, Trash2 } from "lucide-react";
import { User, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ServiceMenu } from "@/components/ServiceMenu";
import {
  SpySaveAd,
  SpySaveCompetitor,
  createNotification,
  deleteCompetitor,
  saveCompetitor,
  updateCompetitorCheck,
  watchUserAds,
  watchUserCompetitors,
} from "@/lib/ads";
import { auth } from "@/lib/firebase";

type CompetitorForm = {
  name: string;
  libraryUrl: string;
  niche: string;
  notes: string;
};

const emptyCompetitorForm: CompetitorForm = {
  name: "",
  libraryUrl: "",
  niche: "",
  notes: "",
};

export default function CompetitorsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ads, setAds] = useState<SpySaveAd[]>([]);
  const [competitors, setCompetitors] = useState<SpySaveCompetitor[]>([]);
  const [competitorForm, setCompetitorForm] =
    useState<CompetitorForm>(emptyCompetitorForm);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [checkingId, setCheckingId] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setAds([]);
        setCompetitors([]);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    const stopAds = watchUserAds(user.uid, setAds, (watchError) => {
      setError(watchError.message);
    });
    const stopCompetitors = watchUserCompetitors(
      user.uid,
      setCompetitors,
      (watchError) => {
        setError(watchError.message);
      },
    );

    return () => {
      stopAds();
      stopCompetitors();
    };
  }, [user]);

  const competitorStats = useMemo(() => {
    return competitors.map((competitor) => {
      const competitorAds = ads.filter(
        (ad) => ad.pageName.toLowerCase() === competitor.name.toLowerCase(),
      );
      const scores = competitorAds
        .map((ad) => ad.analysis?.winningScore || 0)
        .filter(Boolean);
      const bestScore = scores.length ? Math.max(...scores) : 0;
      const avgScore = scores.length
        ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
        : 0;

      return {
        competitor,
        adsCount: competitorAds.length,
        bestScore,
        avgScore,
      };
    });
  }, [ads, competitors]);

  async function handleCompetitorSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !competitorForm.name.trim()) return;

    setError("");
    setStatus("Adding competitor...");

    try {
      await saveCompetitor({
        userId: user.uid,
        name: competitorForm.name.trim(),
        libraryUrl: competitorForm.libraryUrl.trim(),
        niche: competitorForm.niche.trim(),
        notes: competitorForm.notes.trim(),
      });

      setCompetitorForm(emptyCompetitorForm);
      setStatus("Competitor added.");
    } catch (competitorError) {
      setError(
        competitorError instanceof Error
          ? competitorError.message
          : "Competitor save failed",
      );
      setStatus("");
    }
  }

  async function checkCompetitor(competitor: SpySaveCompetitor, adsCount: number) {
    if (!user || !competitor.id) return;

    setCheckingId(competitor.id);
    setError("");

    try {
      const previousCount = competitor.trackedAdsCount || 0;
      const newAds = Math.max(0, adsCount - previousCount);
      const summary =
        newAds > 0
          ? `${newAds} new saved ad${newAds > 1 ? "s" : ""} found for ${competitor.name}.`
          : `No new saved ads found for ${competitor.name}.`;

      await updateCompetitorCheck(competitor.id, {
        trackedAdsCount: adsCount,
        lastCheckSummary: summary,
      });
      await createNotification({
        userId: user.uid,
        competitorName: competitor.name,
        title: newAds > 0 ? "Competitor has new saved ads" : "Competitor check complete",
        message: summary,
        read: false,
      });

      setStatus(summary);
    } catch (checkError) {
      setError(
        checkError instanceof Error
          ? checkError.message
          : "Competitor check failed",
      );
    } finally {
      setCheckingId(null);
    }
  }

  if (!user) {
    return (
      <main className="aurora-page min-h-screen px-5 py-7 text-[#13231f]">
        <ServiceMenu />
        <section className="premium-panel mx-auto mt-8 max-w-3xl rounded-xl p-5">
          <p className="text-sm font-bold uppercase text-[#07966f]">
            Competitor tracking lite
          </p>
          <h1 className="mt-2 text-4xl font-semibold">Login required</h1>
          <p className="mt-2 text-[#4f635d]">
            Login f dashboard باش تزيد competitors وتشوف stats ديالهم.
          </p>
          <Link
            href="/app"
            className="brand-gradient mt-5 inline-flex h-11 items-center rounded-lg px-4 text-sm font-bold"
          >
            Open dashboard
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="aurora-page min-h-screen px-5 py-6 text-[#13231f]">
      <ServiceMenu />
      <section className="mx-auto max-w-7xl">
        <Link
          href="/app"
          className="mb-4 inline-flex h-10 items-center gap-2 rounded-lg border border-[#d8e8e1] bg-white/80 px-4 text-sm font-bold"
        >
          <ChevronLeft size={16} />
          Back dashboard
        </Link>

        <section className="premium-panel rounded-xl p-5">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase text-[#07966f]">
                Competitor tracking lite
              </p>
              <h1 className="mt-1 text-4xl font-semibold">
                Track competitor pages
              </h1>
            </div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-[#e7fff7] px-4 py-3 text-sm font-bold text-[#067655]">
              <Building2 size={18} />
              {competitors.length} tracked
            </span>
          </div>

          <form onSubmit={handleCompetitorSave} className="grid gap-4 md:grid-cols-4">
            <label className="grid gap-2 text-sm font-bold text-[#625d53]">
              Competitor name
              <input
                value={competitorForm.name}
                onChange={(event) =>
                  setCompetitorForm({ ...competitorForm, name: event.target.value })
                }
                required
                placeholder="Brand / page name"
                className="h-11 rounded-lg border border-[#d8d0c2] px-3 text-[#181713] outline-none focus:border-[#13b98f]"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#625d53]">
              Meta Library URL
              <input
                value={competitorForm.libraryUrl}
                onChange={(event) =>
                  setCompetitorForm({
                    ...competitorForm,
                    libraryUrl: event.target.value,
                  })
                }
                placeholder="https://www.facebook.com/ads/library/..."
                className="h-11 rounded-lg border border-[#d8d0c2] px-3 text-[#181713] outline-none focus:border-[#13b98f]"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#625d53]">
              Niche
              <input
                value={competitorForm.niche}
                onChange={(event) =>
                  setCompetitorForm({ ...competitorForm, niche: event.target.value })
                }
                placeholder="skincare, fashion..."
                className="h-11 rounded-lg border border-[#d8d0c2] px-3 text-[#181713] outline-none focus:border-[#13b98f]"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-[#625d53]">
              Notes
              <input
                value={competitorForm.notes}
                onChange={(event) =>
                  setCompetitorForm({ ...competitorForm, notes: event.target.value })
                }
                placeholder="Why track it?"
                className="h-11 rounded-lg border border-[#d8d0c2] px-3 text-[#181713] outline-none focus:border-[#13b98f]"
              />
            </label>
            <button className="brand-gradient inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold md:col-span-4">
              <Plus size={16} />
              Add competitor
            </button>
          </form>

          {status ? (
            <p className="mt-3 text-sm font-semibold text-[#08775d]">{status}</p>
          ) : null}
          {error ? (
            <p className="mt-3 text-sm font-semibold text-[#b42318]">{error}</p>
          ) : null}

          {competitorStats.length ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {competitorStats.map(({ competitor, adsCount, avgScore, bestScore }) => (
                <article
                  key={competitor.id || competitor.name}
                  className="rounded-lg border border-[#e0d7c8] bg-[#fbf8f1] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{competitor.name}</p>
                      <p className="text-sm text-[#6f6a60]">
                        {competitor.niche || "No niche yet"}
                      </p>
                    </div>
                    {competitor.id ? (
                      <button
                        type="button"
                        onClick={() => deleteCompetitor(competitor.id as string)}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-[#d8d0c2] bg-white text-[#b42318]"
                        aria-label="Delete competitor"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      ["Ads", adsCount],
                      ["Avg", avgScore ? `${avgScore}/100` : "--"],
                      ["Best", bestScore ? `${bestScore}/100` : "--"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg bg-white p-3">
                        <p className="text-xs font-bold uppercase text-[#8a8478]">
                          {label}
                        </p>
                        <p className="mt-1 text-lg font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>

                  {competitor.lastCheckSummary ? (
                    <p className="mt-3 rounded-lg bg-[#eef3ff] p-3 text-sm font-semibold leading-6 text-[#3157d5]">
                      {competitor.lastCheckSummary}
                    </p>
                  ) : null}

                  {competitor.notes ? (
                    <p className="mt-3 text-sm leading-6 text-[#625d53]">
                      {competitor.notes}
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {competitor.id ? (
                      <button
                        type="button"
                        onClick={() => checkCompetitor(competitor, adsCount)}
                        disabled={checkingId === competitor.id}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#bfdbfe] bg-white px-3 text-sm font-bold text-[#3157d5] disabled:opacity-60"
                      >
                        <RefreshCw size={15} />
                        {checkingId === competitor.id ? "Checking..." : "Check updates"}
                      </button>
                    ) : null}
                    {competitor.libraryUrl ? (
                      <a
                        href={competitor.libraryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center rounded-lg border border-[#d8d0c2] bg-white px-3 text-sm font-bold text-[#625d53]"
                      >
                        Open library
                      </a>
                    ) : null}
                    {competitor.id ? (
                      <Link
                        href={`/app/competitors/${competitor.id}`}
                        className="brand-gradient inline-flex h-9 items-center rounded-lg px-3 text-sm font-bold"
                      >
                        Open page
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-[#d8d0c2] bg-[#fbf8f1] p-8 text-center">
              <Building2 className="mx-auto text-[#d25f3f]" />
              <p className="mt-3 text-sm font-semibold text-[#625d53]">
                Add competitor pages here, then save ads under the same page name.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
