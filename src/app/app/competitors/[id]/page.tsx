"use client";

import { Building2, ChevronLeft, Gauge } from "lucide-react";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import {
  SpySaveAd,
  SpySaveCompetitor,
  getCompetitor,
  watchUserAds,
} from "@/lib/ads";
import { auth } from "@/lib/firebase";

export default function CompetitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [competitor, setCompetitor] = useState<SpySaveCompetitor | null>(null);
  const [ads, setAds] = useState<SpySaveAd[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!user) return;

    getCompetitor(id)
      .then((item) => {
        if (!item || item.userId !== user.uid) {
          setError("Competitor not found for this account.");
          return;
        }
        setCompetitor(item);
      })
      .catch((loadError) =>
        setError(loadError instanceof Error ? loadError.message : "Could not load competitor"),
      );

    return watchUserAds(user.uid, setAds, (watchError) => {
      setError(watchError.message);
    });
  }, [id, user]);

  const competitorAds = useMemo(() => {
    if (!competitor) return [];
    return ads.filter(
      (ad) => ad.pageName.toLowerCase() === competitor.name.toLowerCase(),
    );
  }, [ads, competitor]);

  const bestScore = Math.max(
    0,
    ...competitorAds.map((ad) => ad.analysis?.winningScore || 0),
  );

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

        {error ? <p className="mt-4 font-semibold text-[#b42318]">{error}</p> : null}

        {competitor ? (
          <>
            <section className="premium-panel mt-5 rounded-xl p-5">
              <p className="text-sm font-bold uppercase text-[#07966f]">
                Competitor page
              </p>
              <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-4xl font-semibold">{competitor.name}</h1>
                  <p className="mt-2 text-[#4f635d]">
                    {competitor.niche || "No niche yet"}
                  </p>
                </div>
                <Building2 className="text-[#08775d]" />
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  ["Saved ads", competitorAds.length],
                  ["Best score", bestScore ? `${bestScore}/100` : "--"],
                  ["Library", competitor.libraryUrl ? "Connected" : "Missing"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-[#eef8f2] p-4">
                    <p className="text-xs font-bold uppercase text-[#66736d]">{label}</p>
                    <p className="mt-2 text-2xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-4 grid gap-3">
              {competitorAds.length ? (
                competitorAds.map((ad) => (
                  <Link
                    key={ad.id}
                    href={ad.id ? `/app/ads/${ad.id}` : "/app"}
                    className="premium-panel rounded-xl p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold">{ad.pageName}</p>
                        <p className="mt-1 text-sm text-[#4f635d]">
                          {ad.analysis?.hook || ad.adText.slice(0, 90)}
                        </p>
                      </div>
                      <span className="brand-gradient inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold">
                        <Gauge size={16} />
                        {ad.analysis?.winningScore || "--"}/100
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="premium-panel rounded-xl p-5 text-center">
                  <p className="font-semibold">No saved ads for this competitor yet.</p>
                  <p className="mt-2 text-sm text-[#4f635d]">
                    Save an ad with the exact same page name to connect it here.
                  </p>
                </div>
              )}
            </section>
          </>
        ) : !user ? (
          <section className="premium-panel mt-5 rounded-xl p-5">
            <h1 className="text-3xl font-semibold">Login required</h1>
          </section>
        ) : null}
      </section>
    </main>
  );
}
