"use client";

import { Bot, ChevronLeft, Gauge, RefreshCw, Trash2, Wand2 } from "lucide-react";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { SavedAdMedia } from "@/components/SavedAdMedia";
import {
  SpySaveAd,
  SpySaveAnalysis,
  SpySaveLandingPageAnalysis,
  SpySaveMediaStatus,
  deleteAdWithFallback,
  getAd,
  saveAnalysis,
  saveLandingPageAnalysis,
  saveMediaStatus,
} from "@/lib/ads";
import { auth } from "@/lib/firebase";

async function analyzeAd(ad: SpySaveAd) {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pageName: ad.pageName,
      adText: ad.adText,
      mediaUrl: ad.mediaUrl,
      sourceUrl: ad.sourceUrl,
      landingPageUrl: ad.landingPageUrl,
    }),
  });

  if (!response.ok) throw new Error("Analysis failed");
  const data = (await response.json()) as { analysis: SpySaveAnalysis };
  return data.analysis;
}

type GenerateMode = "hooks" | "ugc" | "tiktok" | "meta" | "image" | "video";

function diagnoseMedia(ad: SpySaveAd): SpySaveMediaStatus {
  if (!ad.mediaUrl?.trim()) {
    return {
      source: "missing",
      status: "missing",
      recommendation:
        "No media URL is saved. Use the extension picker or paste the product image/video URL.",
    };
  }

  const socialCdn = /fbcdn|tiktokcdn|byteoversea|akamaized/i.test(ad.mediaUrl);
  if (socialCdn) {
    return {
      mediaUrl: ad.mediaUrl,
      source: "detected-url",
      status: "external-preview-risk",
      recommendation:
        "This media is hosted on a social CDN and may expire. Keep the source URL and capture a backup screenshot before using it in reports.",
    };
  }

  return {
    mediaUrl: ad.mediaUrl,
    source: "manual-url",
    status: "ready",
    recommendation: "Media URL is available for preview and research.",
  };
}

export default function AdDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [ad, setAd] = useState<SpySaveAd | null>(null);
  const [status, setStatus] = useState("Loading ad...");
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCheckingLanding, setIsCheckingLanding] = useState(false);
  const [isCheckingMedia, setIsCheckingMedia] = useState(false);
  const [generatingMode, setGeneratingMode] = useState<GenerateMode | null>(null);
  const [generatedOutput, setGeneratedOutput] = useState<string[]>([]);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!user) return;

    getAd(id)
      .then((item) => {
        if (!item || item.userId !== user.uid) {
          setError("Ad not found for this account.");
          setStatus("");
          return;
        }

        setAd(item);
        setStatus("");
      })
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "Could not load ad");
        setStatus("");
      });
  }, [id, user]);

  async function refreshAnalysis() {
    if (!ad?.id) return;
    setIsAnalyzing(true);
    setError("");

    try {
      const analysis = await analyzeAd(ad);
      await saveAnalysis(ad.id, analysis);
      setAd({ ...ad, analysis });
      setStatus("AI analysis refreshed.");
    } catch (analysisError) {
      setError(
        analysisError instanceof Error ? analysisError.message : "Could not analyze ad",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function removeAd() {
    if (!ad?.id || !user) return;

    const confirmed = window.confirm("Delete this ad from SpySave?");
    if (!confirmed) return;

    setIsDeleting(true);
    setError("");
    setStatus("Deleting ad...");

    try {
      await deleteAdWithFallback(ad.id, user.uid);
      window.location.href = "/app";
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Could not delete ad",
      );
      setStatus("");
      setIsDeleting(false);
    }
  }

  async function checkLandingPage() {
    if (!ad?.id || !ad.landingPageUrl) return;
    setIsCheckingLanding(true);
    setError("");

    try {
      const response = await fetch("/api/landing-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: ad.landingPageUrl,
          adText: ad.adText,
        }),
      });
      const data = (await response.json()) as {
        analysis?: SpySaveLandingPageAnalysis;
        error?: string;
      };
      if (!response.ok || !data.analysis) {
        throw new Error(data.error || "Landing page check failed");
      }
      await saveLandingPageAnalysis(ad.id, data.analysis);
      setAd({ ...ad, landingPageAnalysis: data.analysis });
      setStatus("Landing page intelligence saved.");
    } catch (landingError) {
      setError(
        landingError instanceof Error
          ? landingError.message
          : "Could not check landing page",
      );
    } finally {
      setIsCheckingLanding(false);
    }
  }

  async function checkMedia() {
    if (!ad?.id) return;
    setIsCheckingMedia(true);
    setError("");

    try {
      const mediaStatus = diagnoseMedia(ad);
      await saveMediaStatus(ad.id, mediaStatus);
      setAd({ ...ad, mediaStatus });
      setStatus("Media check saved.");
    } catch (mediaError) {
      setError(
        mediaError instanceof Error ? mediaError.message : "Could not check media",
      );
    } finally {
      setIsCheckingMedia(false);
    }
  }

  async function generateCreative(mode: GenerateMode) {
    if (!ad?.adText) return;
    setGeneratingMode(mode);
    setGeneratedOutput([]);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, adText: ad.adText }),
      });
      const data = (await response.json()) as { output?: string[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Generation failed");
      setGeneratedOutput((data.output || []).filter(Boolean));
    } catch (generateError) {
      setError(
        generateError instanceof Error
          ? generateError.message
          : "Could not generate creative",
      );
    } finally {
      setGeneratingMode(null);
    }
  }

  return (
    <main className="aurora-page min-h-screen px-5 py-6 text-[#13231f]">
      <section className="mx-auto max-w-6xl">
        <Link
          href="/app"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d8e8e1] bg-white/80 px-4 text-sm font-bold"
        >
          <ChevronLeft size={16} />
          Back dashboard
        </Link>

        {status ? <p className="mt-4 font-semibold text-[#08775d]">{status}</p> : null}
        {error ? <p className="mt-4 font-semibold text-[#b42318]">{error}</p> : null}

        {ad ? (
          <div className="mt-5 grid gap-4">
            <section className="premium-panel rounded-xl p-5">
              <p className="text-sm font-bold uppercase text-[#07966f]">Ad detail</p>
              <h1 className="mt-2 text-4xl font-semibold">{ad.pageName}</h1>
              <p className="mt-3 text-sm leading-7 text-[#4f635d]">{ad.adText}</p>
              <SavedAdMedia mediaUrl={ad.mediaUrl} label="Product creative" />

              <div className="mt-4 rounded-lg border border-[#d8e8e1] bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-[#66736d]">
                      Media capture
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6">
                      {ad.mediaStatus?.recommendation ||
                        "Check if the saved media URL is usable or risky."}
                    </p>
                  </div>
                  <button
                    onClick={checkMedia}
                    disabled={isCheckingMedia}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-4 text-sm font-bold text-[#3157d5] disabled:opacity-60"
                  >
                    <RefreshCw size={16} />
                    {isCheckingMedia ? "Checking..." : "Check media"}
                  </button>
                </div>
                {ad.mediaStatus ? (
                  <p className="mt-3 rounded-md bg-[#eef8f2] px-3 py-2 text-sm font-bold text-[#08775d]">
                    Status: {ad.mediaStatus.status}
                  </p>
                ) : null}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {[
                  ["Folder", ad.folder || "No folder"],
                  ["Tags", (ad.tags || []).join(", ") || "No tags"],
                  ["Landing page", ad.landingPageUrl || "No landing page"],
                  ["Source", ad.sourceUrl || "No source"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-[#eef8f2] p-4">
                    <p className="text-xs font-bold uppercase text-[#66736d]">{label}</p>
                    <p className="mt-2 break-words text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="premium-panel rounded-xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase text-[#07966f]">
                    AI analysis
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold">
                    {ad.analysis?.winningScore || "--"}/100
                  </h2>
                  <p className="mt-1 font-bold text-[#4f635d]">
                    {ad.analysis?.verdict || "Not scored"}
                  </p>
                </div>
                <Gauge className="text-[#08775d]" />
              </div>

              <div className="mt-4 grid gap-3">
                <div className="rounded-lg border-2 border-[#3157d5] bg-[#eff6ff] p-4">
                  <p className="text-xs font-bold uppercase text-[#3157d5]">
                    Recommended next test
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">
                    {ad.analysis?.actionPlan?.bestNextMove || "Analyze this ad to get an action plan."}
                  </h3>
                  <div className="mt-3 grid gap-2 text-sm font-semibold leading-6 md:grid-cols-2">
                    <p>
                      <span className="text-[#66736d]">Format: </span>
                      {ad.analysis?.actionPlan?.recommendedFormat || "--"}
                    </p>
                    <p>
                      <span className="text-[#66736d]">Length: </span>
                      {ad.analysis?.actionPlan?.scriptLength || "--"}
                    </p>
                    <p>
                      <span className="text-[#66736d]">Hook: </span>
                      {ad.analysis?.actionPlan?.hookToTest || "--"}
                    </p>
                    <p>
                      <span className="text-[#66736d]">CTA: </span>
                      {ad.analysis?.actionPlan?.ctaToTest || "--"}
                    </p>
                    <p className="md:col-span-2">
                      <span className="text-[#66736d]">Audience: </span>
                      {ad.analysis?.actionPlan?.audienceToTarget || "--"}
                    </p>
                    <p className="md:col-span-2">
                      <span className="text-[#66736d]">Platform: </span>
                      {ad.analysis?.actionPlan?.platformRecommendation || "--"}
                    </p>
                  </div>
                </div>

                {[
                  ["Hook", ad.analysis?.hook],
                  ["Offer", ad.analysis?.offer],
                  ["CTA", ad.analysis?.cta],
                  ["Audience", ad.analysis?.audienceGuess],
                  ["Pain point", ad.analysis?.painPoint],
                  ["Ad fatigue risk", ad.analysis?.adFatigueRisk],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-white p-4">
                    <p className="text-xs font-bold uppercase text-[#66736d]">{label}</p>
                    <p className="mt-2 text-sm font-semibold leading-6">
                      {value || "Not analyzed yet"}
                    </p>
                  </div>
                ))}
              </div>

              {ad.analysis?.scoreBreakdown ? (
                <div className="mt-4 rounded-lg bg-white p-4">
                  <p className="text-xs font-bold uppercase text-[#66736d]">
                    Winning score breakdown
                  </p>
                  <div className="mt-3 grid gap-2">
                    {[
                      ["Hook", ad.analysis.scoreBreakdown.hook],
                      ["Offer", ad.analysis.scoreBreakdown.offer],
                      ["CTA", ad.analysis.scoreBreakdown.cta],
                      ["Trust", ad.analysis.scoreBreakdown.trust],
                      ["Audience fit", ad.analysis.scoreBreakdown.audienceFit],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-md bg-[#eef8f2] px-3 py-2 text-sm font-bold"
                      >
                        <span>{label}</span>
                        <span>{value || 0}/25</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg bg-white p-4">
                  <p className="text-xs font-bold uppercase text-[#66736d]">
                    Trust signals
                  </p>
                  <div className="mt-2 grid gap-2">
                    {(ad.analysis?.trustSignals || ["Not analyzed yet"]).map(
                      (signal) => (
                        <span
                          key={signal}
                          className="rounded-md bg-[#eef8f2] px-3 py-2 text-sm font-semibold"
                        >
                          {signal}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-white p-4">
                  <p className="text-xs font-bold uppercase text-[#66736d]">
                    Objection handling
                  </p>
                  <div className="mt-2 grid gap-2">
                    {(ad.analysis?.objectionHandling || ["Not analyzed yet"]).map(
                      (objection) => (
                        <span
                          key={objection}
                          className="rounded-md bg-[#eef3ff] px-3 py-2 text-sm font-semibold text-[#3157d5]"
                        >
                          {objection}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-white p-4">
                  <p className="text-xs font-bold uppercase text-[#66736d]">
                    Weaknesses
                  </p>
                  <div className="mt-2 grid gap-2">
                    {(ad.analysis?.weaknesses || ["Not analyzed yet"]).map(
                      (weakness) => (
                        <span
                          key={weakness}
                          className="rounded-md bg-[#fff4ed] px-3 py-2 text-sm font-semibold text-[#9a3412]"
                        >
                          {weakness}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-white p-4">
                <p className="text-xs font-bold uppercase text-[#66736d]">
                  Test ideas
                </p>
                <div className="mt-2 grid gap-2">
                  {(ad.analysis?.ideasToTest || ["Not analyzed yet"]).map((idea) => (
                    <div
                      key={idea}
                      className="rounded-md bg-[#eef8f2] px-3 py-2 text-sm font-semibold"
                    >
                      {idea}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-white p-4">
                <p className="text-xs font-bold uppercase text-[#66736d]">
                  Creative brief
                </p>
                <div className="mt-2 grid gap-2 text-sm font-semibold leading-6">
                  <p>
                    <span className="text-[#66736d]">Angle: </span>
                    {ad.analysis?.creativeBrief?.angle || "Not analyzed yet"}
                  </p>
                  <p>
                    <span className="text-[#66736d]">Concept: </span>
                    {ad.analysis?.creativeBrief?.concept || "Not analyzed yet"}
                  </p>
                  <p>
                    <span className="text-[#66736d]">Script: </span>
                    {ad.analysis?.creativeBrief?.script || "Not analyzed yet"}
                  </p>
                  <p>
                    <span className="text-[#66736d]">Visual direction: </span>
                    {ad.analysis?.creativeBrief?.visualDirection ||
                      "Not analyzed yet"}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-white p-4">
                <p className="text-xs font-bold uppercase text-[#66736d]">
                  Generate hooks
                </p>
                <div className="mt-2 grid gap-2">
                  {(ad.analysis?.generatedCreatives?.hooks || ["Not analyzed yet"]).map(
                    (hook) => (
                      <div
                        key={hook}
                        className="rounded-md bg-[#eef8f2] px-3 py-2 text-sm font-semibold"
                      >
                        {hook}
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-lg border-2 border-[#3157d5] bg-[#eff6ff] p-4">
                <p className="text-xs font-bold uppercase text-[#3157d5]">
                  One-click creative generation
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    ["hooks", "Generate hooks"],
                    ["ugc", "UGC scripts"],
                    ["tiktok", "TikTok rewrite"],
                    ["meta", "Meta rewrite"],
                    ["image", "Image prompts"],
                    ["video", "Video prompt"],
                  ].map(([mode, label]) => (
                    <button
                      key={mode}
                      onClick={() => generateCreative(mode as GenerateMode)}
                      disabled={generatingMode === mode}
                      className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-3 text-sm font-bold text-[#3157d5] disabled:opacity-60"
                    >
                      <Wand2 size={15} />
                      {generatingMode === mode ? "Generating..." : label}
                    </button>
                  ))}
                </div>
                {generatedOutput.length ? (
                  <div className="mt-3 grid gap-2">
                    {generatedOutput.map((item) => (
                      <p
                        key={item}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold leading-6"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="mt-4 rounded-lg bg-white p-4">
                <p className="text-xs font-bold uppercase text-[#66736d]">
                  UGC scripts
                </p>
                <div className="mt-2 grid gap-2">
                  {(ad.analysis?.generatedCreatives?.ugcScripts || [
                    "Not analyzed yet",
                  ]).map((script) => (
                    <div
                      key={script}
                      className="rounded-md bg-[#fff7ed] px-3 py-2 text-sm font-semibold text-[#9a3412]"
                    >
                      {script}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg bg-white p-4">
                  <p className="text-xs font-bold uppercase text-[#66736d]">
                    Rewrite for TikTok
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6">
                    {ad.analysis?.generatedCreatives?.tiktokRewrite ||
                      "Not analyzed yet"}
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4">
                  <p className="text-xs font-bold uppercase text-[#66736d]">
                    Rewrite for Meta
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6">
                    {ad.analysis?.generatedCreatives?.metaRewrite ||
                      "Not analyzed yet"}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-white p-4">
                <p className="text-xs font-bold uppercase text-[#66736d]">
                  Image and video prompts
                </p>
                <div className="mt-2 grid gap-2">
                  {(ad.analysis?.generatedCreatives?.imagePrompts || [
                    "Not analyzed yet",
                  ]).map((prompt) => (
                    <div
                      key={prompt}
                      className="rounded-md bg-[#eef3ff] px-3 py-2 text-sm font-semibold text-[#3157d5]"
                    >
                      {prompt}
                    </div>
                  ))}
                  <div className="rounded-md bg-[#eef3ff] px-3 py-2 text-sm font-semibold text-[#3157d5]">
                    {ad.analysis?.generatedCreatives?.videoPrompt ||
                      "Not analyzed yet"}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-white p-4">
                <p className="text-xs font-bold uppercase text-[#66736d]">
                  Test plan
                </p>
                <div className="mt-2 grid gap-2">
                  {(ad.analysis?.testPlan || ["Not analyzed yet"]).map((step) => (
                    <div
                      key={step}
                      className="rounded-md bg-[#eff6ff] px-3 py-2 text-sm font-semibold text-[#3157d5]"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-[#66736d]">
                      Landing page intelligence
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#4f635d]">
                      Check message match, offer, price, and CTA from the landing page.
                    </p>
                  </div>
                  <button
                    onClick={checkLandingPage}
                    disabled={isCheckingLanding || !ad.landingPageUrl}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-4 text-sm font-bold text-[#3157d5] disabled:opacity-60"
                  >
                    <RefreshCw size={16} />
                    {isCheckingLanding ? "Checking..." : "Check landing page"}
                  </button>
                </div>
                {ad.landingPageAnalysis ? (
                  <div className="mt-3 grid gap-2 text-sm font-semibold leading-6">
                    <p>
                      <span className="text-[#66736d]">Title: </span>
                      {ad.landingPageAnalysis.title}
                    </p>
                    <p>
                      <span className="text-[#66736d]">Offer: </span>
                      {ad.landingPageAnalysis.offerGuess}
                    </p>
                    <p>
                      <span className="text-[#66736d]">Price: </span>
                      {ad.landingPageAnalysis.priceGuess}
                    </p>
                    <p>
                      <span className="text-[#66736d]">CTA: </span>
                      {ad.landingPageAnalysis.ctaGuess}
                    </p>
                    <p>
                      <span className="text-[#66736d]">Ad match: </span>
                      {ad.landingPageAnalysis.adMatchScore}/100
                    </p>
                    <div className="grid gap-2">
                      {ad.landingPageAnalysis.recommendations.map((recommendation) => (
                        <span
                          key={recommendation}
                          className="rounded-md bg-[#fff7ed] px-3 py-2 text-sm font-semibold text-[#9a3412]"
                        >
                          {recommendation}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-4 rounded-lg bg-white p-4">
                <p className="text-xs font-bold uppercase text-[#66736d]">
                  Rewrite suggestions
                </p>
                <div className="mt-2 grid gap-2 text-sm font-semibold leading-6">
                  <p>
                    <span className="text-[#66736d]">Hook: </span>
                    {ad.analysis?.rewriteSuggestions?.hook || "Not analyzed yet"}
                  </p>
                  <p>
                    <span className="text-[#66736d]">CTA: </span>
                    {ad.analysis?.rewriteSuggestions?.cta || "Not analyzed yet"}
                  </p>
                  <p>
                    <span className="text-[#66736d]">Copy: </span>
                    {ad.analysis?.rewriteSuggestions?.adCopy || "Not analyzed yet"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={refreshAnalysis}
                  disabled={isAnalyzing}
                  className="brand-gradient inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold disabled:opacity-60"
                >
                  <RefreshCw size={16} />
                  {isAnalyzing
                    ? "Analyzing..."
                    : ad.analysis
                      ? "Re-analyze"
                      : "Analyze with AI"}
                </button>
                {ad.id ? (
                  <button
                    onClick={removeAd}
                    disabled={isDeleting}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#f2c4bc] bg-white px-4 text-sm font-bold text-[#b42318] disabled:cursor-wait disabled:opacity-60"
                  >
                    {isDeleting ? <RefreshCw size={16} /> : <Trash2 size={16} />}
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                ) : null}
              </div>
            </section>
          </div>
        ) : !user ? (
          <section className="premium-panel mt-5 rounded-xl p-5">
            <Bot className="text-[#08775d]" />
            <h1 className="mt-3 text-3xl font-semibold">Login required</h1>
            <p className="mt-2 text-[#4f635d]">Open the dashboard and login first.</p>
          </section>
        ) : null}
      </section>
    </main>
  );
}
