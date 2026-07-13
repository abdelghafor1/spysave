"use client";

import { ChevronLeft, CreditCard, Gauge } from "lucide-react";
import { User, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ServiceMenu } from "@/components/ServiceMenu";
import { SpySaveAd, watchUserAds } from "@/lib/ads";
import { auth } from "@/lib/firebase";

export default function BillingPage() {
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

  const usage = useMemo(() => {
    const analyzed = ads.filter((ad) => ad.analysis).length;
    return {
      savedAds: ads.length,
      analyzed,
      saveLimit: 50,
      aiLimit: 20,
    };
  }, [ads]);

  const cards = [
    {
      name: "Free beta",
      price: "$0",
      status: "Active",
      body: "Manual saves, saved ads board, basic AI analysis, reports, and competitor watchlist checks.",
    },
    {
      name: "Pro",
      price: "$19-$29",
      status: "Coming soon",
      body: "Unlimited saves, deeper AI generation, automatic competitor checks, and stronger reports.",
    },
    {
      name: "Agency",
      price: "$79-$99",
      status: "Coming soon",
      body: "Workspaces, members, client reports, and team permissions.",
    },
  ];

  return (
    <main className="aurora-page min-h-screen px-5 py-6 text-[#13231f]">
      <ServiceMenu />
      <section className="mx-auto max-w-6xl">
        <Link
          href="/app"
          className="mb-4 inline-flex h-10 items-center gap-2 rounded-lg border border-[#d8e8e1] bg-white/80 px-4 text-sm font-bold"
        >
          <ChevronLeft size={16} />
          Back dashboard
        </Link>

        <section className="premium-panel rounded-xl p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase text-[#3157d5]">
                Billing and limits
              </p>
              <h1 className="mt-2 text-4xl font-semibold">Free beta usage</h1>
              <p className="mt-2 text-sm font-semibold text-[#4f635d]">
                Stripe is not connected yet. These limits prepare the product for paid plans.
              </p>
            </div>
            <CreditCard className="text-[#3157d5]" />
          </div>

          {error ? <p className="mt-4 text-sm font-bold text-[#b42318]">{error}</p> : null}

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ["Saved ads", usage.savedAds, usage.saveLimit],
              ["AI analyses", usage.analyzed, usage.aiLimit],
            ].map(([label, value, limit]) => {
              const percent = Math.min(100, Math.round((Number(value) / Number(limit)) * 100));
              return (
                <article key={label as string} className="rounded-xl border border-[#d8e8e1] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold uppercase text-[#4f635d]">
                        {label as string}
                      </p>
                      <p className="mt-1 text-3xl font-semibold">
                        {value as number}/{limit as number}
                      </p>
                    </div>
                    <Gauge className="text-[#3157d5]" />
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#eef3ff]">
                    <div
                      className="h-full rounded-full bg-[#3157d5]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {cards.map((card) => (
              <article key={card.name} className="rounded-xl border border-[#d8e8e1] bg-white p-5">
                <p className="text-sm font-bold uppercase text-[#3157d5]">{card.status}</p>
                <h2 className="mt-3 text-2xl font-semibold">{card.name}</h2>
                <p className="mt-2 text-4xl font-semibold">{card.price}</p>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#4f635d]">
                  {card.body}
                </p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
