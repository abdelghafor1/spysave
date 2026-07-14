"use client";

import { CreditCard, Gauge } from "lucide-react";
import { User, onAuthStateChanged } from "firebase/auth";
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

  return (
    <main className="aurora-page min-h-screen px-5 py-6 text-[#13231f]">
      <ServiceMenu />
      <section className="mx-auto max-w-6xl">
        <section className="premium-panel app-primary-panel rounded-xl p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase text-[#3157d5]">
                Billing and limits
              </p>
              <h1 className="mt-2 text-4xl font-semibold">Free beta usage</h1>
              <p className="mt-2 text-sm font-semibold text-[#4f635d]">
                Monitor your saved ads and AI analyses during the public beta.
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

          <div className="app-beta-note mt-5">
            <div>
              <p className="app-kicker">Public beta</p>
              <h2>Paid plans are not open yet.</h2>
            </div>
            <p>
              SpySave will show plan options here only after secure billing is connected.
              Your current beta access stays free.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
