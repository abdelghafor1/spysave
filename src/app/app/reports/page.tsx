"use client";

import { BarChart3, ChevronLeft, Download, Gauge, Lightbulb, Trophy } from "lucide-react";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ServiceMenu } from "@/components/ServiceMenu";
import type { SpySaveAd } from "@/lib/ads";
import { watchUserAds } from "@/lib/ads";
import { demoAds } from "@/lib/demoAds";
import { auth } from "@/lib/firebase";

function score(ad: SpySaveAd) {
  return ad.analysis?.winningScore || 0;
}

function listValues(ads: SpySaveAd[], getter: (ad: SpySaveAd) => string | undefined) {
  const counts = new Map<string, number>();
  ads.forEach((ad) => {
    const value = getter(ad)?.trim();
    if (!value) return;
    counts.set(value, (counts.get(value) || 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
}

function classifyHook(text = "") {
  const value = text.toLowerCase();
  if (/why|how|secret|nobody|this is why|what happens/i.test(value)) return "Curiosity";
  if (/tired|struggle|problem|stop|wasting|hate|without/i.test(value)) return "Problem";
  if (/review|rated|proof|results|before|after|customers/i.test(value)) return "Proof";
  if (/free|discount|%|sale|bundle|offer/i.test(value)) return "Offer";
  return "General";
}

export default function ReportsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ads, setAds] = useState<SpySaveAd[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setAds([]);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    return watchUserAds(user.uid, setAds, (watchError) => setError(watchError.message));
  }, [user]);

  const reportAds = ads.length ? ads : demoAds;
  const isDemo = !ads.length;

  const report = useMemo(() => {
    const analyzed = reportAds.filter((ad) => ad.analysis?.winningScore);
    const winners = reportAds.filter((ad) => ad.analysis?.verdict === "Possible Winner");
    const averageScore = analyzed.length
      ? Math.round(analyzed.reduce((sum, ad) => sum + score(ad), 0) / analyzed.length)
      : 0;
    const topAds = [...reportAds].sort((a, b) => score(b) - score(a)).slice(0, 5);
    const topHooks = reportAds
      .map((ad) => ad.analysis?.hook)
      .filter(Boolean)
      .slice(0, 5) as string[];
    const niches = listValues(reportAds, (ad) => ad.analysis?.niche);
    const offers = listValues(reportAds, (ad) => ad.analysis?.offer);
    const testIdeas = reportAds
      .flatMap((ad) => ad.analysis?.ideasToTest || [])
      .slice(0, 6);
    const highScoring = reportAds.filter((ad) => score(ad) >= 70);
    const hookTypes = highScoring.map((ad) => classifyHook(ad.analysis?.hook || ad.adText));
    const curiosityOrProblem = hookTypes.filter((type) =>
      ["Curiosity", "Problem"].includes(type),
    ).length;
    const discountHeavy = reportAds.filter((ad) =>
      /discount|%|sale|free shipping|bundle/i.test(ad.analysis?.offer || ad.adText),
    ).length;
    const proofAngles = reportAds.filter((ad) =>
      /review|rated|proof|results|before|after|testimonial/i.test(
        `${ad.analysis?.hook || ""} ${ad.analysis?.trustSignals?.join(" ") || ""} ${ad.adText}`,
      ),
    ).length;
    const insights = [
      highScoring.length
        ? `${Math.round((curiosityOrProblem / highScoring.length) * 100)}% of high-scoring ads use curiosity or problem hooks.`
        : "Analyze more ads to detect hook patterns.",
      discountHeavy > reportAds.length / 2
        ? "Your saved ads lean heavily on discounts. Add proof and problem-solution angles to avoid weak testing."
        : "Discount usage is balanced. Keep testing offer-led ads against proof-led ads.",
      proofAngles
        ? `${proofAngles} saved ad${proofAngles > 1 ? "s" : ""} include proof signals. Use those as creative references.`
        : "No strong proof angle detected yet. Save or create ads with reviews, before/after, or testimonials.",
      testIdeas[0] || "Run AI analysis on saved ads to generate next tests.",
    ];

    return {
      analyzed: analyzed.length,
      averageScore,
      winners: winners.length,
      topAds,
      topHooks,
      niches,
      offers,
      testIdeas,
      insights,
    };
  }, [reportAds]);

  function exportReport() {
    const rows = report.topAds.map((ad) => ({
      pageName: ad.pageName,
      score: ad.analysis?.winningScore || "",
      verdict: ad.analysis?.verdict || "",
      hook: ad.analysis?.hook || "",
      offer: ad.analysis?.offer || "",
      niche: ad.analysis?.niche || "",
      nextTest: ad.analysis?.testPlan?.[0] || ad.analysis?.ideasToTest?.[0] || "",
    }));
    const headers = ["pageName", "score", "verdict", "hook", "offer", "niche", "nextTest"];
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
    link.download = `spysave-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
            <p className="text-sm font-bold uppercase text-[#07966f]">Reports</p>
            <h1 className="text-2xl font-semibold">Creative research report</h1>
          </div>
        </div>
        <ServiceMenu />
      </header>

      <section className="mx-auto max-w-7xl px-5 py-5">
        {error ? <p className="mb-3 text-sm font-bold text-[#b42318]">{error}</p> : null}
        {isDemo ? (
          <div className="mb-4 rounded-xl border border-[#bfdbfe] bg-[#eff6ff] p-4 text-sm font-bold text-[#3157d5]">
            Demo report shown. Save and analyze your own ads to replace this with real data.
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["Saved ads", reportAds.length.toString(), BarChart3],
            ["Analyzed", report.analyzed.toString(), Gauge],
            ["Average score", `${report.averageScore}/100`, Gauge],
            ["Winners", report.winners.toString(), Trophy],
          ].map(([label, value, Icon]) => (
            <article key={label as string} className="premium-panel rounded-xl p-4">
              <Icon className="text-[#08775d]" size={20} />
              <p className="mt-4 text-sm font-bold uppercase text-[#66736d]">
                {label as string}
              </p>
              <p className="mt-1 text-3xl font-semibold">{value as string}</p>
            </article>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="premium-panel rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase text-[#07966f]">Top ads</p>
                <h2 className="mt-1 text-2xl font-semibold">Best creative candidates</h2>
              </div>
              <button
                onClick={exportReport}
                className="brand-gradient inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold"
              >
                <Download size={16} />
                Export report
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              {report.topAds.map((ad) => (
                <article key={ad.id || ad.pageName} className="rounded-lg border border-[#d8e8e1] bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{ad.pageName}</p>
                      <p className="mt-1 text-sm text-[#4f635d]">
                        {ad.analysis?.niche || "No niche"} - {ad.analysis?.verdict || "Not scored"}
                      </p>
                    </div>
                    <span className="rounded-lg bg-[#eef8f2] px-3 py-2 text-sm font-bold text-[#08775d]">
                      {ad.analysis?.winningScore || "--"}/100
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-6">
                    {ad.analysis?.hook || ad.adText.slice(0, 120)}
                  </p>
                  <p className="mt-2 text-sm text-[#4f635d]">
                    Next test: {ad.analysis?.testPlan?.[0] || ad.analysis?.ideasToTest?.[0] || "Analyze this ad first"}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <aside className="grid gap-4">
            <section className="premium-panel rounded-xl p-4">
              <p className="text-sm font-bold uppercase text-[#3157d5]">Trend intelligence</p>
              <div className="mt-3 grid gap-2">
                {report.insights.map((insight) => (
                  <p
                    key={insight}
                    className="rounded-lg bg-[#eff6ff] p-3 text-sm font-semibold leading-6 text-[#3157d5]"
                  >
                    {insight}
                  </p>
                ))}
              </div>
            </section>

            <section className="premium-panel rounded-xl p-4">
              <p className="text-sm font-bold uppercase text-[#07966f]">Top hooks</p>
              <div className="mt-3 grid gap-2">
                {report.topHooks.map((hook) => (
                  <p key={hook} className="rounded-lg bg-white p-3 text-sm font-semibold leading-6">
                    {hook}
                  </p>
                ))}
              </div>
            </section>

            <section className="premium-panel rounded-xl p-4">
              <p className="text-sm font-bold uppercase text-[#07966f]">Niches and offers</p>
              <div className="mt-3 grid gap-3">
                {[...report.niches, ...report.offers].map(([label, count]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm font-bold"
                  >
                    <span>{label}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="premium-panel rounded-xl p-4">
              <p className="flex items-center gap-2 text-sm font-bold uppercase text-[#07966f]">
                <Lightbulb size={16} />
                What to test next
              </p>
              <div className="mt-3 grid gap-2">
                {report.testIdeas.map((idea) => (
                  <p key={idea} className="rounded-lg bg-[#fff7ed] p-3 text-sm font-semibold leading-6 text-[#9a3412]">
                    {idea}
                  </p>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
