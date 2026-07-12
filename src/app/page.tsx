"use client";

import {
  Bell,
  BookmarkPlus,
  Bot,
  ChevronRight,
  CircleDollarSign,
  FileText,
  Gauge,
  Globe2,
  Languages,
  Layers3,
  Library,
  ShieldCheck,
  Sparkles,
  Tags,
  Users,
} from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";

type Locale = "en" | "ar" | "fr";

const workflow = [
  ["Open Meta Ad Library", "Find an ad from a product or competitor page."],
  ["Save with extension", "SpySave captures page name, text, links, and media."],
  ["Analyze with AI", "Get hook, offer, CTA, niche, audience, and winning score."],
  ["Build your next test", "Use the best angles inside your next creative brief."],
];

const productScreens = [
  {
    label: "Dashboard",
    title: "Command center",
    description:
      "Overview dyal saved ads, AI scores, tracked brands, notifications, w quick actions f blasa wahda.",
    icon: Gauge,
    accent: "#3157d5",
    preview: "dashboard",
    screenshot: "/screenshots/dashboard.png",
  },
  {
    label: "Saved Ads",
    title: "Clean swipe file",
    description:
      "Kol ad kayban msetef b page name, tags, notes, media link, score, search, filters, w export CSV.",
    icon: BookmarkPlus,
    accent: "#f59e0b",
    preview: "ads",
    screenshot: "/screenshots/saved-ads.png",
  },
  {
    label: "AI Detail",
    title: "Deep creative analysis",
    description:
      "Hook, offer, CTA, pain point, audience, trust signals, weaknesses, test ideas, w rewrite suggestions.",
    icon: Bot,
    accent: "#6d5dfc",
    preview: "ai",
    screenshot: "/screenshots/ai-detail.png",
  },
  {
    label: "Tracking",
    title: "Competitor tracking",
    description:
      "Zid competitor pages, organize niches, w khlli SpySave ijme3 lik updates f notifications page.",
    icon: Users,
    accent: "#0ea5e9",
    preview: "tracking",
    screenshot: "/screenshots/tracking.png",
  },
  {
    label: "Notifications",
    title: "Updates inbox",
    description:
      "Blasa n9iya katban fiha alerts mlli competitor li tracked kayban 3ndo ad jdida.",
    icon: Bell,
    accent: "#d97706",
    preview: "notifications",
    screenshot: "/screenshots/notifications.png",
  },
  {
    label: "Help",
    title: "Setup and launch guide",
    description:
      "Page katjme3 install steps, workflow, privacy, pricing info, w launch checklist bach demo ib9a wadeh.",
    icon: FileText,
    accent: "#64748b",
    preview: "help",
    screenshot: "/screenshots/help.png",
  },
] as const;

function ProductScreenPreview({
  label,
  screenshot,
}: {
  label: string;
  screenshot: string;
}) {
  return (
    <Image
      src={screenshot}
      alt={`${label} screenshot from SpySave`}
      width={1263}
      height={744}
      className="real-screen-shot"
      priority={label === "Dashboard"}
    />
  );
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <main dir={dir} className="aurora-page min-h-screen text-[#101413]">
      <nav className="glass-nav sticky top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3">
          <a href="#" className="flex items-center gap-3">
            <BrandMark size={44} className="shadow-sm" />
            <span>
              <span className="block text-lg font-semibold leading-none">SpySave</span>
              <span className="text-xs font-medium text-[#4f635d]">Meta ads research</span>
            </span>
          </a>

          <p className="hidden text-sm font-semibold text-[#4f635d] md:block">
            Simple ad research workspace
          </p>

          <div className="flex items-center gap-2 rounded-lg border border-[#d8e8e1] bg-white/80 p-1 shadow-sm">
            <Languages size={16} className="ms-2 text-[#0f9f7a]" />
            {(["en", "ar", "fr"] as Locale[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLocale(item)}
                className={`h-8 rounded-md px-3 text-xs font-bold uppercase ${
                  locale === item
                    ? "brand-gradient"
                    : "text-[#29423a] hover:bg-[#eaf7f2]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <section className="first-screen-showcase">
        <div className="mx-auto max-w-7xl px-5 py-8 md:py-10">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d8e8e1] bg-white/80 px-4 py-2 text-sm font-bold text-[#29423a] shadow-sm backdrop-blur">
              <Sparkles size={16} className="text-[#0f9f7a]" />
              Ad intelligence workspace
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-[#13231f] md:text-6xl">
              Research competitor ads before you launch.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-[#4f635d]">
              Preview how SpySave helps you save ads, organize swipe files,
              analyze creative angles with AI, and track competitor activity.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/app"
                className="brand-gradient inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-bold shadow-sm"
              >
                Try for free
                <ChevronRight size={17} />
              </a>
            </div>
          </div>

          <div className="vertical-screens mt-8" aria-label="SpySave page previews">
            {productScreens.map((screen) => {
              const Icon = screen.icon;

              return (
                <article
                  key={`first-${screen.label}`}
                  className="screen-card screen-card-vertical hover-glow"
                  style={{ "--screen-accent": screen.accent } as CSSProperties}
                >
                  <div className="screen-copy">
                    <div className="screen-card-header">
                      <span className="screen-icon">
                        <Icon size={18} />
                      </span>
                      <span className="screen-label">{screen.label}</span>
                    </div>

                    <h3>{screen.title}</h3>
                    <p>{screen.description}</p>

                    <a
                      href="/app"
                      className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#d8e8e1] bg-white px-4 text-sm font-bold text-[#13231f]"
                    >
                      Try this page
                      <ChevronRight size={16} />
                    </a>
                  </div>

                  <div className="screen-browser">
                    <ProductScreenPreview
                      label={screen.label}
                      screenshot={screen.screenshot}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-6">
        <div className="premium-panel flex flex-wrap items-center justify-between gap-3 rounded-xl p-4">
          <div>
            <p className="text-sm font-bold uppercase text-[#08775d]">Beta access</p>
            <h2 className="mt-1 text-2xl font-semibold">
              Join the SpySave beta and test with real ads.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="/app"
              className="brand-gradient inline-flex h-11 items-center rounded-lg px-4 text-sm font-bold"
            >
              Join beta
            </a>
            <a
              href="mailto:hello@spysave.app?subject=SpySave%20demo"
              className="inline-flex h-11 items-center rounded-lg border border-[#d8e8e1] bg-white px-4 text-sm font-bold text-[#13231f]"
            >
              Book demo
            </a>
          </div>
        </div>
      </section>

      <section id="product" className="border-y border-[#dbe7e2] bg-white/70">
        <div className="mx-auto grid max-w-7xl gap-3 px-5 py-8 md:grid-cols-4">
          {[
            [BookmarkPlus, "Save ads", "Capture public Meta ads into your account."],
            [Tags, "Organize", "Tags, notes, folders, search, and CSV export."],
            [Bot, "AI analysis", "Hook, offer, CTA, audience, ideas, and score."],
            [Bell, "Track competitors", "Save competitor pages and compare their ads."],
          ].map(([Icon, title, body]) => {
            const IconComponent = Icon as typeof BookmarkPlus;
            return (
              <article key={title as string} className="premium-panel rounded-lg p-4">
                <IconComponent size={22} className="text-[#07966f]" />
                <h3 className="mt-4 text-lg font-semibold">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-[#66736d]">{body as string}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-5 py-9">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase text-[#07966f]">Workflow</p>
            <h2 className="mt-2 text-3xl font-semibold">From competitor ad to test idea.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#66736d]">
            Simple enough for a 14-day MVP, useful enough for a real product demo.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {workflow.map(([title, body], index) => (
            <article key={title} className="premium-panel rounded-lg p-4">
              <span className="brand-gradient grid size-9 place-items-center rounded-lg text-sm font-bold">
                {index + 1}
              </span>
              <h3 className="mt-5 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#66736d]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="premium-dark px-5 py-9 text-[#13231f]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase text-[#08775d]">Pricing</p>
              <h2 className="mt-2 text-3xl font-semibold">Ready for beta testing.</h2>
            </div>
            <a
              href="/app"
              className="brand-gradient inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-bold"
            >
              Start now
              <ChevronRight size={16} />
            </a>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["Free beta", "$0", "50 saved ads, manual save, basic AI."],
              ["Pro", "$19-$29", "Unlimited saves, deep AI, competitor alerts."],
              ["Agency", "$79-$99", "Workspaces, teams, PDF/CSV reports."],
            ].map(([name, price, body]) => (
              <article key={name} className="premium-panel rounded-lg p-5">
                <CircleDollarSign size={22} className="text-[#0f9f7a]" />
                <p className="mt-5 text-sm font-bold uppercase text-[#4f635d]">{name}</p>
                <p className="mt-3 text-4xl font-semibold">{price}</p>
                <p className="mt-4 leading-7 text-[#4f635d]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-sm font-medium text-[#66736d] md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} />
          Public ad research. Minimal extension permissions.
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2">
            <Globe2 size={16} />
            EN / AR / FR
          </span>
          <span className="inline-flex items-center gap-2">
            <Library size={16} />
            Swipe file SaaS
          </span>
          <span className="inline-flex items-center gap-2">
            <Layers3 size={16} />
            MVP ready
          </span>
        </div>
      </footer>
    </main>
  );
}

