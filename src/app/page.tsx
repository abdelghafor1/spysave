"use client";

import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Library,
  Search,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";

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

const reports = [
  { label: "Curiosity hooks", value: "72%", trend: "+12%" },
  { label: "Proof in first 3 sec", value: "64%", trend: "+8%" },
  { label: "Average winning length", value: "18s", trend: "-3s" },
];

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".ss-reveal");
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

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function WindowFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="ss-window">
      <div className="ss-window-bar">
        <div className="ss-window-dots"><i /><i /><i /></div>
        <span>{label}</span>
        <div className="ss-window-search"><Search size={13} /> Search ads, hooks, brands</div>
      </div>
      {children}
    </div>
  );
}

function HeroProduct() {
  return (
    <WindowFrame label="Creative research">
      <div className="ss-hero-product">
        <aside className="ss-product-sidebar">
          <BrandMark size={28} />
          <nav>
            <b>Overview</b>
            <span>Saved ads <em>248</em></span>
            <span>AI analysis <em>183</em></span>
            <span>Competitors <em>18</em></span>
            <span>Notifications <em>6</em></span>
          </nav>
          <small>PUBLIC BETA</small>
        </aside>
        <div className="ss-product-main">
          <header>
            <div><small>WORKSPACE</small><h3>Creative command center</h3></div>
            <button><Sparkles size={14} /> Analyze selected</button>
          </header>
          <div className="ss-product-metrics">
            <article><strong>248</strong><span>Saved ads</span><small>+31 this month</small></article>
            <article><strong>183</strong><span>AI scores</span><small>73.8% analyzed</small></article>
            <article><strong>18</strong><span>Tracked brands</span><small>6 new signals</small></article>
          </div>
          <div className="ss-product-columns">
            <section>
              <div className="ss-mini-head"><b>Recent creatives</b><span>Score</span></div>
              <AdRow brand="GlowLab" detail="Dark spot serum · UGC" score="91" active />
              <AdRow brand="NovaFit" detail="Resistance bands · Demo" score="87" />
              <AdRow brand="CasaNest" detail="Modular sofa · Offer" score="84" />
              <AdRow brand="TrendCart" detail="Portable blender · POV" score="79" />
            </section>
            <section className="ss-next-action">
              <small>NEXT ACTION</small>
              <h4>Build GlowLab&apos;s angle as a 15-second UGC test.</h4>
              <ul>
                <li><Check size={13} /> Lead with visible proof</li>
                <li><Check size={13} /> Add guarantee by second 8</li>
                <li><Check size={13} /> Test 3 curiosity hooks</li>
              </ul>
              <button>Generate test plan <ArrowRight size={14} /></button>
            </section>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

function AdRow({ brand, detail, score, active = false }: { brand: string; detail: string; score: string; active?: boolean }) {
  return (
    <div className={`ss-ad-row ${active ? "is-active" : ""}`}>
      <span className="ss-ad-thumb">{brand.slice(0, 1)}</span>
      <div><b>{brand}</b><small>{detail}</small></div>
      <strong>{score}</strong>
    </div>
  );
}

function ResearchBlueprint() {
  return (
    <div className="ss-blueprint">
      <article><small>FIG 0.1</small><div className="ss-line-stack"><i /><i /><i /><i /></div><h3>Built for research</h3><p>Public competitor ads become structured creative knowledge.</p></article>
      <article><small>FIG 0.2</small><div className="ss-line-nodes"><i /><i /><i /><i /></div><h3>Powered by strategy</h3><p>AI explains why an angle works and what to test next.</p></article>
      <article><small>FIG 0.3</small><div className="ss-line-cards"><i /><i /><i /><i /><i /></div><h3>Designed for action</h3><p>Research flows into hooks, scripts, offers, and briefs.</p></article>
    </div>
  );
}

function AnalysisScene() {
  return (
    <div className="ss-scene ss-analysis-scene">
      <aside className="ss-creative-preview">
        <span>GLOWLAB</span>
        <div className="ss-bottle"><i /></div>
        <h4>Your dark spots are not your fault.</h4>
        <p>One gentle routine. Visible proof in 14 days.</p>
        <small>Sponsored · 00:15</small>
      </aside>
      <section className="ss-analysis-panel">
        <header><div><small>CREATIVE BREAKDOWN</small><h3>GlowLab dark spot serum</h3></div><strong>91</strong></header>
        <div className="ss-analysis-grid">
          <article><small>HOOK</small><b>Your dark spots are not your fault.</b></article>
          <article><small>AUDIENCE</small><b>Women 25-40 buying skincare online.</b></article>
          <article><small>OFFER</small><b>14-day routine with visible-proof promise.</b></article>
          <article><small>FATIGUE RISK</small><b>Medium. Refresh the visual after 7 days.</b></article>
          <article><small>OBJECTION</small><b>Add guarantee and ingredient clarity.</b></article>
          <article><small>TEST NEXT</small><b>Curiosity hook vs. proof-first hook.</b></article>
        </div>
        <div className="ss-recommendation"><Sparkles size={16} /><div><small>STRATEGIST RECOMMENDATION</small><b>Open with the result, reveal the routine at second 3, then close with proof and urgency.</b></div><button>Generate 5 hooks</button></div>
      </section>
    </div>
  );
}

function LibraryScene() {
  return (
    <div className="ss-scene ss-library-scene">
      <aside>
        <small>COLLECTIONS</small>
        <b>All creatives <em>248</em></b>
        <span>Winners <em>42</em></span>
        <span>UGC hooks <em>67</em></span>
        <span>Offer tests <em>31</em></span>
        <span>Skincare <em>56</em></span>
      </aside>
      <section>
        <header><div><small>SWIPE FILE</small><h3>Saved ads</h3></div><div className="ss-filter">All platforms · Score 75+</div></header>
        <div className="ss-library-grid">
          <article><div className="ss-ad-visual visual-one"><span>14 DAYS</span></div><small>GLOWLAB</small><b>Dark spot UGC</b><footer><span>Curiosity</span><strong>91</strong></footer></article>
          <article><div className="ss-ad-visual visual-two"><span>MOVE BETTER</span></div><small>NOVAFIT</small><b>Resistance band demo</b><footer><span>Demo</span><strong>87</strong></footer></article>
          <article><div className="ss-ad-visual visual-three"><span>ROOM TO LIVE</span></div><small>CASANEST</small><b>Modular sofa offer</b><footer><span>Bundle</span><strong>84</strong></footer></article>
          <article><div className="ss-ad-visual visual-four"><span>BLEND ANYWHERE</span></div><small>TRENDCART</small><b>Portable blender POV</b><footer><span>POV</span><strong>79</strong></footer></article>
        </div>
      </section>
    </div>
  );
}

function TrackingScene() {
  return (
    <div className="ss-scene ss-tracking-scene">
      <aside>
        <small>TRACKED BRANDS</small>
        <b>GlowLab <em>6 new</em></b>
        <span>NovaFit <em>4 new</em></span>
        <span>CasaNest <em>3 new</em></span>
        <span>TrendCart <em>2 new</em></span>
      </aside>
      <section>
        <div className="ss-timeline-head"><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span></div>
        <div className="ss-timeline-row"><b>GlowLab launch cycle</b><i className="bar-one" /><em>New proof angle</em></div>
        <div className="ss-timeline-row"><b>NovaFit UGC tests</b><i className="bar-two" /><em>4 creatives active</em></div>
        <div className="ss-timeline-row"><b>CasaNest offers</b><i className="bar-three" /><em>Bundle returned</em></div>
        <div className="ss-tracking-callout"><Bell size={16} /><div><small>NEW SIGNAL</small><b>GlowLab launched 6 creatives using the same proof-first hook.</b></div><span>12 min ago</span></div>
      </section>
    </div>
  );
}

function IntelligenceScene() {
  return (
    <div className="ss-scene ss-intelligence-scene">
      <section className="ss-weekly-report">
        <header><div><small>WEEKLY CREATIVE PULSE</small><h3>What changed this week</h3></div><span>Jul 08 - Jul 14</span></header>
        <article><i className="is-green" /><div><b>Curiosity hooks are accelerating</b><p>72% of high-scoring skincare ads now delay the product reveal.</p></div><strong>+12%</strong></article>
        <article><i className="is-blue" /><div><b>Proof is moving earlier</b><p>Top creatives show results within the first three seconds.</p></div><strong>64%</strong></article>
        <article><i className="is-orange" /><div><b>Discount language is tiring</b><p>Your library overuses percentage-off offers versus bundles.</p></div><strong>-9%</strong></article>
      </section>
      <section className="ss-signal-chart">
        <header><small>HOOK PERFORMANCE</small><b>Winning score by angle</b></header>
        <div className="ss-chart-grid">
          <span style={{ left: "14%", top: "68%" }} /><span style={{ left: "18%", top: "52%" }} /><span style={{ left: "22%", top: "42%" }} /><span style={{ left: "28%", top: "58%" }} />
          <span className="orange" style={{ left: "46%", top: "48%" }} /><span className="orange" style={{ left: "51%", top: "31%" }} /><span className="orange" style={{ left: "56%", top: "64%" }} />
          <span className="muted" style={{ left: "76%", top: "58%" }} /><span className="muted" style={{ left: "82%", top: "72%" }} /><span className="muted" style={{ left: "88%", top: "43%" }} />
        </div>
        <footer><span>Curiosity</span><span>Proof-first</span><span>Discount</span></footer>
      </section>
    </div>
  );
}

function SetupScene() {
  return (
    <div className="ss-setup-grid">
      <article><Library size={20} /><small>01 · EXTENSION</small><h3>Save without breaking your research flow.</h3><p>Use the side panel on Meta, Facebook, and TikTok Creative Center. Your page stays clickable while SpySave captures the ad.</p><a href="/app">Connect extension <ArrowRight size={15} /></a></article>
      <article><CircleHelp size={20} /><small>02 · HELP CENTER</small><h3>Every next step is visible.</h3><p>Account setup, User ID connection, supported pages, and analysis controls live in one focused onboarding path.</p><a href="/help">Open help center <ArrowRight size={15} /></a></article>
    </div>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

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
        <a href="#top" className="ss-brand" aria-label="SpySave home"><BrandMark size={32} /><strong>SpySave</strong></a>
        <div className="ss-nav-links"><a href="#workflow">Workflow</a><a href="#analysis">AI analysis</a><a href="#library">Library</a><a href="#tracking">Tracking</a><a href="#intelligence">Reports</a></div>
        <div className="ss-nav-actions">
          <button
            type="button"
            className="ss-theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Use light mode" : "Use dark mode"}
            title={theme === "dark" ? "Use light mode" : "Use dark mode"}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a href="/app" className="ss-login">Log in</a>
          <a href="/app" className="ss-button ss-button-light">Try for free <ArrowRight size={15} /></a>
        </div>
      </nav>

      <section id="top" className="ss-hero ss-reveal">
        <span className="ss-eyebrow"><Sparkles size={14} /> AI creative intelligence for e-commerce</span>
        <h1>Know which competitor ad to build on next.</h1>
        <p>SpySave captures public ads, explains the strategy behind them, and turns the strongest ideas into clear creative tests your team can launch.</p>
        <div className="ss-hero-actions"><a href="/app" className="ss-button ss-button-light">Start researching <ArrowRight size={16} /></a><a href="#workflow" className="ss-button ss-button-ghost">See how it works</a></div>
        <div className="ss-hero-stage"><HeroProduct /></div>
      </section>

      <section id="workflow" className="ss-workflow ss-reveal">
        <header><span>From public ad to testable idea</span><h2>A research workflow that moves at the speed of your ad account.</h2></header>
        <div>{workflow.map((item) => <article key={item.step}><small>{item.step}</small><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
      </section>

      <section className="ss-manifesto ss-reveal">
        <h2><span>A new kind of ad research workspace.</span> Built for teams that need more than saved screenshots, with AI strategy and creative action at its core.</h2>
        <ResearchBlueprint />
      </section>

      <section id="analysis" className="ss-story ss-reveal">
        <header><h2>Know what to do after you save the ad.</h2><div><p>SpySave finds the hook, audience, offer, pain point, trust signals, fatigue risk, objections, and weaknesses. Then it recommends the next creative test.</p><a href="/app">1.0 Analyze <ChevronRight size={18} /></a></div></header>
        <AnalysisScene />
      </section>

      <section id="library" className="ss-story ss-reveal">
        <header><h2>Turn scattered inspiration into creative memory.</h2><div><p>Every ad stays connected to its media, source, brand, landing page, tags, notes, folder, and score. Search one library instead of rebuilding context.</p><a href="/app">2.0 Organize <ChevronRight size={18} /></a></div></header>
        <LibraryScene />
      </section>

      <section id="tracking" className="ss-story ss-reveal">
        <header><h2>See competitor changes before they become obvious.</h2><div><p>Track brand activity, new creative launches, hook shifts, and offer history. SpySave turns scattered updates into a timeline your team can act on.</p><a href="/app">3.0 Track <ChevronRight size={18} /></a></div></header>
        <TrackingScene />
      </section>

      <section id="intelligence" className="ss-story ss-reveal">
        <header><h2>Understand creative patterns at scale.</h2><div><p>Weekly intelligence connects scores, hooks, formats, and fatigue signals so you can see what the market is doing and where your own testing is thin.</p><a href="/app">4.0 Learn <ChevronRight size={18} /></a></div></header>
        <IntelligenceScene />
      </section>

      <section className="ss-proof ss-reveal">
        <h2>One workspace. A clearer next move.</h2>
        <div>{reports.map((item) => <article key={item.label}><small>{item.label}</small><strong>{item.value}</strong><span>{item.trend} this week</span></article>)}</div>
      </section>

      <section className="ss-setup ss-reveal">
        <header><h2>Start simple. Stay in control.</h2><p>Save manually, analyze only when you choose, and keep onboarding clear for every user.</p></header>
        <SetupScene />
      </section>

      <section className="ss-release-log ss-reveal">
        <h2>Built in public</h2>
        <div><article><i /><h3>AI action plans</h3><p>Creative breakdowns now end with concrete tests, hooks, and rewrites.</p><small>JUL 14, 2026</small></article><article><i /><h3>Competitor signals</h3><p>New creative activity now appears in the notification center.</p><small>JUL 13, 2026</small></article><article><i /><h3>Side panel capture</h3><p>Save ads while the research page stays fully interactive.</p><small>JUL 12, 2026</small></article></div>
      </section>

      <section className="ss-final-cta ss-reveal">
        <span>PUBLIC BETA</span>
        <h2>Stop collecting ads.<br />Start building from them.</h2>
        <p>Create your first competitor swipe file and turn one saved ad into a testable creative plan.</p>
        <div><a href="/app" className="ss-button ss-button-light">Try SpySave free <ArrowRight size={16} /></a><a href="mailto:spysave.demo@gmail.com?subject=SpySave%20demo" className="ss-button ss-button-ghost">Book a demo</a></div>
      </section>

      <footer className="ss-footer"><div><BrandMark size={28} /><strong>SpySave</strong></div><span>AI ad research · Public beta</span><span>Built for dropshippers and e-commerce teams</span></footer>
    </main>
  );
}
