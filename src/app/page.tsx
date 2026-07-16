"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Languages,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { type Locale, useLanguage } from "@/components/LanguageProvider";

const copy = {
  en: {
    workflow: "Workflow", analysis: "AI analysis", library: "Library", tracking: "Tracking", help: "Help",
    login: "Log in", tryFree: "Try for free", eyebrow: "AI creative intelligence for e-commerce",
    title: "Know which competitor ad to build on next.",
    intro: "SpySave captures public ads, explains the strategy behind them, and turns the strongest ideas into clear creative tests your team can launch.",
    start: "Start researching", seeHow: "See how it works",
  },
  fr: {
    workflow: "Fonctionnement", analysis: "Analyse IA", library: "Bibliothèque", tracking: "Suivi", help: "Aide",
    login: "Connexion", tryFree: "Essayer gratuitement", eyebrow: "Intelligence créative IA pour l’e-commerce",
    title: "Identifiez la prochaine publicité concurrente à exploiter.",
    intro: "SpySave capture les publicités publiques, explique leur stratégie et transforme les meilleures idées en tests créatifs prêts à lancer.",
    start: "Commencer la recherche", seeHow: "Voir comment ça marche",
  },
  ar: {
    workflow: "طريقة العمل", analysis: "تحليل الذكاء", library: "المكتبة", tracking: "التتبع", help: "المساعدة",
    login: "تسجيل الدخول", tryFree: "جرّب مجاناً", eyebrow: "ذكاء إبداعي للتجارة الإلكترونية",
    title: "اعرف إعلان المنافس الذي يستحق أن تبني عليه.",
    intro: "يحفظ SpySave الإعلانات العامة، ويشرح الاستراتيجية وراءها، ويحوّل أقوى الأفكار إلى اختبارات إبداعية واضحة وجاهزة للإطلاق.",
    start: "ابدأ البحث", seeHow: "شاهد كيف يعمل",
  },
} satisfies Record<Locale, Record<string, string>>;

const workflow = [
  {
    step: "01",
    title: "Capture",
    copy: "Save a public Meta or TikTok ad without leaving the research page.",
  },
  {
    step: "02",
    title: "Organize",
    copy: "Keep the media, source, brand, tags, notes, and landing page together.",
  },
  {
    step: "03",
    title: "Analyze",
    copy: "Run AI when you need it to uncover the hook, offer, audience, and risks.",
  },
  {
    step: "04",
    title: "Create",
    copy: "Turn the breakdown into new hooks, UGC scripts, rewrites, and test plans.",
  },
];

type ProductScreenshotProps = {
  src: string;
  alt: string;
  href: string;
  label: string;
  priority?: boolean;
  compact?: boolean;
};

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".ss-reveal");
    nodes.item(0)?.classList.add("ss-visible");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("ss-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    nodes.forEach((node, index) => {
      if (index > 0) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);
}

function ProductScreenshot({
  src,
  alt,
  href,
  label,
  priority = false,
  compact = false,
}: ProductScreenshotProps) {
  return (
    <a
      className={`ss-real-shot${compact ? " is-compact" : ""}`}
      href={href}
      aria-label={`Open ${label}`}
    >
      <span className="ss-real-shot-label">
        <i />
        Live product
        <b>{label}</b>
      </span>
      <span className="ss-shot-grid" aria-hidden="true"><i /><i /><i /></span>
      <Image
        src={src}
        alt={alt}
        width={1280}
        height={720}
        priority={priority}
        sizes={compact ? "(max-width: 760px) 100vw, 50vw" : "100vw"}
      />
    </a>
  );
}

function ResearchBlueprint() {
  return (
    <div className="ss-blueprint">
      <article>
        <small>FIG 0.1</small>
        <div className="ss-blueprint-visual ss-research-map" aria-hidden="true">
          <div className="ss-source-list">
            <span><b>Meta</b><em>GlowLab serum</em></span>
            <span><b>TikTok</b><em>NovaFit UGC</em></span>
            <span><b>Meta</b><em>Maison home</em></span>
          </div>
          <div className="ss-ingest-path"><span /><span /><span /></div>
          <div className="ss-swipe-node">
            <span>SWIPE FILE</span>
            <strong>248 creatives</strong>
            <div><b>Hook</b><b>Offer</b><b>Angle</b></div>
          </div>
        </div>
        <h3>Built for research</h3>
        <p>Public competitor ads become structured creative knowledge.</p>
      </article>
      <article>
        <small>FIG 0.2</small>
        <div className="ss-blueprint-visual ss-strategy-map" aria-hidden="true">
          <div className="ss-strategy-core">
            <Sparkles size={17} />
            <span>AI STRATEGY</span>
            <strong>87 / 100</strong>
          </div>
          <div className="ss-strategy-signals">
            <span><b>Hook</b><em>Curiosity</em></span>
            <span><b>Offer</b><em>Bundle -20%</em></span>
            <span><b>Audience</b><em>Women 25-40</em></span>
            <span><b>Fatigue</b><em>Low risk</em></span>
          </div>
        </div>
        <h3>Powered by strategy</h3>
        <p>AI explains why an angle works and what to test next.</p>
      </article>
      <article>
        <small>FIG 0.3</small>
        <div className="ss-blueprint-visual ss-action-map" aria-hidden="true">
          <div className="ss-action-head">
            <span>CREATIVE TEST PLAN</span>
            <b>Ready</b>
          </div>
          <div className="ss-action-list">
            <span><i>01</i><strong>Curiosity hook</strong><em>5 variants</em></span>
            <span><i>02</i><strong>15s UGC script</strong><em>Drafted</em></span>
            <span><i>03</i><strong>Offer A/B test</strong><em>2 versions</em></span>
          </div>
          <div className="ss-action-footer"><span>Research</span><i /><span>Launch</span></div>
        </div>
        <h3>Designed for action</h3>
        <p>Research flows into hooks, scripts, offers, and briefs.</p>
      </article>
    </div>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const { locale, setLocale } = useLanguage();
  const text = copy[locale];

  useReveal();

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("spysave-theme");
    const preferredTheme = savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const frame = window.requestAnimationFrame(() => setTheme(preferredTheme));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("spysave-theme", nextTheme);
  }

  return (
    <main className="ss-landing" data-theme={theme}>
      <nav className="ss-nav">
        <a href="#top" className="ss-brand" aria-label="SpySave home">
          <BrandMark size={32} />
          <strong>SpySave</strong>
        </a>
        <div className="ss-nav-actions">
          <label className="ss-language-select" title="Change language">
            <Languages size={16} aria-hidden="true" />
            <select
              value={locale}
              onChange={(event) => setLocale(event.target.value as "en" | "fr" | "ar")}
              aria-label="Change language"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="ar">AR</option>
            </select>
          </label>
          <button
            type="button"
            className="ss-theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Use light mode" : "Use dark mode"}
            title={theme === "dark" ? "Use light mode" : "Use dark mode"}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a href="/app" className="ss-login">{text.login}</a>
          <a href="/app" className="ss-button ss-button-light">
            {text.tryFree} <ArrowRight size={15} />
          </a>
        </div>
      </nav>

      <section id="top" className="ss-hero ss-reveal">
        <span className="ss-eyebrow">
          <Sparkles size={14} /> {text.eyebrow}
        </span>
        <h1>{text.title}</h1>
        <p>{text.intro}</p>
        <div className="ss-hero-actions">
          <a href="/app" className="ss-button ss-button-light">
            {text.start} <ArrowRight size={16} />
          </a>
          <a href="#workflow" className="ss-button ss-button-ghost">{text.seeHow}</a>
        </div>
        <div className="ss-hero-stage ss-real-hero-stage">
          <aside className="ss-hero-screen-copy">
            <span>Creative command center</span>
            <h2>See the full picture before you build the next ad.</h2>
            <p>
              Your dashboard keeps saved creatives, AI analysis, competitor research,
              and the next action together in one focused workspace.
            </p>
            <div className="ss-hero-capabilities">
              <span><i /> Save ads from Meta and TikTok</span>
              <span><i /> Analyze only when you choose</span>
              <span><i /> Move from research to a test plan</span>
            </div>
            <Link href="/app">
              Open the workspace <ArrowRight size={15} />
            </Link>
          </aside>
          <ProductScreenshot
            src="/screenshots/dashboard.png"
            alt="The real SpySave dashboard with saved ads, AI scores, competitors, and save controls"
            href="/app"
            label="Dashboard"
            priority
          />
        </div>
      </section>

      <section id="workflow" className="ss-workflow ss-reveal">
        <header>
          <span>From public ad to testable idea</span>
          <h2>A research workflow that moves at the speed of your ad account.</h2>
        </header>
        <div>
          {workflow.map((item) => (
            <article key={item.step}>
              <small>{item.step}</small>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ss-manifesto ss-reveal">
        <h2>
          <span>A new kind of ad research workspace.</span> Built for teams that need
          more than saved screenshots, with AI strategy and creative action at its core.
        </h2>
        <ResearchBlueprint />
      </section>

      <section id="analysis" className="ss-story ss-story-split ss-reveal">
        <header>
          <h2>Know what to do after you save the ad.</h2>
          <div>
            <p>
              Open any saved ad and ask SpySave to analyze its hook, audience, offer,
              pain point, trust signals, fatigue risk, objections, and weaknesses.
            </p>
            <Link href="/app/ads">1.0 Analyze <ChevronRight size={18} /></Link>
          </div>
        </header>
        <ProductScreenshot
          src="/screenshots/ai-detail.png"
          alt="The real SpySave saved ads and AI detail workspace"
          href="/app/ads"
          label="AI detail"
        />
      </section>

      <section id="library" className="ss-story ss-story-split is-reverse ss-reveal">
        <header>
          <h2>Turn scattered inspiration into creative memory.</h2>
          <div>
            <p>
              Search and review every ad with its media, source, brand, landing page,
              tags, notes, folder, and AI score in one focused library.
            </p>
            <Link href="/app/ads">2.0 Organize <ChevronRight size={18} /></Link>
          </div>
        </header>
        <ProductScreenshot
          src="/screenshots/saved-ads.png"
          alt="The real SpySave saved ads library"
          href="/app/ads"
          label="Saved Ads"
        />
      </section>

      <section id="tracking" className="ss-story ss-story-split ss-reveal">
        <header>
          <h2>Keep the competitors that matter in one place.</h2>
          <div>
            <p>
              Add competitor pages, store their Meta Library links, niches, and notes,
              then connect new activity to the brands your team follows.
            </p>
            <Link href="/app/competitors">3.0 Track <ChevronRight size={18} /></Link>
          </div>
        </header>
        <ProductScreenshot
          src="/screenshots/tracking.png"
          alt="The real SpySave competitor tracking page"
          href="/app/competitors"
          label="Tracking"
        />
      </section>

      <section id="notifications" className="ss-story ss-story-split is-reverse ss-reveal">
        <header>
          <h2>Stay close to every important update.</h2>
          <div>
            <p>
              SpySave keeps account actions, extension setup, and competitor signals
              visible inside the workspace so the next step never gets lost.
            </p>
            <a href="/app">4.0 Stay updated <ChevronRight size={18} /></a>
          </div>
        </header>
        <ProductScreenshot
          src="/screenshots/notifications.png"
          alt="The real SpySave dashboard and extension connection area"
          href="/app"
          label="Dashboard setup"
        />
      </section>

      <section id="setup" className="ss-setup ss-reveal">
        <header>
          <h2>Start simple. Stay in control.</h2>
          <p>Connect the extension, learn the workflow, and find every setup step in one place.</p>
        </header>
        <div className="ss-real-shot-grid">
          <ProductScreenshot
            src="/screenshots/help.png"
            alt="The real SpySave help center"
            href="/help"
            label="Help center"
            compact
          />
          <ProductScreenshot
            src="/screenshots/dashboard.png"
            alt="The real SpySave dashboard"
            href="/app"
            label="Workspace"
            compact
          />
        </div>
      </section>

      <section className="ss-final-cta ss-reveal">
        <span>PUBLIC BETA</span>
        <h2>Stop collecting ads.<br />Start building from them.</h2>
        <p>Create your first competitor swipe file and turn one saved ad into a testable creative plan.</p>
        <div>
          <a href="/app" className="ss-button ss-button-light">
            Try SpySave free <ArrowRight size={16} />
          </a>
          <a
            href="mailto:spysave.demo@gmail.com?subject=SpySave%20demo"
            className="ss-button ss-button-ghost"
          >
            Book a demo
          </a>
        </div>
      </section>

      <footer className="ss-footer">
        <div><BrandMark size={28} /><strong>SpySave</strong></div>
        <span>AI ad research · Public beta</span>
        <span>Built for dropshippers and e-commerce teams</span>
      </footer>
    </main>
  );
}
