"use client";

import {
  ArrowRight,
  Bell,
  Bot,
  ChevronRight,
  Gauge,
  Library,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect } from "react";
import { BrandMark } from "@/components/BrandMark";

const workflow = [
  "Save ads from Meta, Facebook, or TikTok Creative Center.",
  "Organize by brand, niche, tag, folder, and campaign idea.",
  "Run AI only when you want strategy, not automatic noise.",
  "Turn analysis into hooks, scripts, rewrites, and test plans.",
];

const pillars = [
  {
    figure: "FIG 0.2",
    title: "Built for ad research",
    body: "Purpose-built for public competitor ads, not random screenshots in folders.",
    variant: "stack",
  },
  {
    figure: "FIG 0.3",
    title: "Powered by AI analysis",
    body: "Breaks down hooks, offers, fatigue risk, objections, and test ideas.",
    variant: "cubes",
  },
  {
    figure: "FIG 0.4",
    title: "Designed for speed",
    body: "Save, score, review, and rewrite creative angles without losing momentum.",
    variant: "cards",
  },
];

const storySections = [
  {
    number: "1.0",
    slug: "Analyze",
    kicker: "AI creative strategist",
    title: "Know what to do after you save the ad.",
    body: "SpySave does not just describe a competitor ad. It gives you the hook, offer, CTA, audience, pain point, trust signals, fatigue risk, objection handling, weaknesses, and concrete test ideas.",
    mockup: "ai",
  },
  {
    number: "2.0",
    slug: "Library",
    kicker: "Swipe file system",
    title: "Build a searchable library of competitor creatives.",
    body: "Every saved ad stays connected to the page name, source link, media, landing page, folder, notes, tags, and AI score. Your team stops losing ideas in screenshots and browser tabs.",
    mockup: "library",
  },
  {
    number: "3.0",
    slug: "Track",
    kicker: "Competitor tracking",
    title: "See which brands are moving before they become obvious.",
    body: "Track competitor pages, monitor saved activity, compare scores, and review changes from one clean workspace. The goal is simple: know which creative angles are worth copying, avoiding, or improving.",
    mockup: "tracking",
  },
  {
    number: "4.0",
    slug: "Report",
    kicker: "Reports and signals",
    title: "Turn research into weekly creative intelligence.",
    body: "SpySave surfaces repeated hooks, strong offers, fatigue risks, and top-performing patterns so dropshippers and small e-commerce teams know what to test next.",
    mockup: "reports",
  },
];

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".linear-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("linear-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function UiShell({
  type,
  large = false,
}: {
  type: "hero" | "ai" | "library" | "tracking" | "reports" | "dashboard";
  large?: boolean;
}) {
  return (
    <div className={`linear-ui ${large ? "linear-ui-large" : ""}`}>
      <div className="linear-ui-glow" />
      <div className="linear-window">
        <div className="linear-window-top">
          <span />
          <span />
          <span />
          <div>
            <Search size={13} />
            <em>Search ads, hooks, brands...</em>
          </div>
        </div>
        <div className={`linear-window-body linear-window-${type}`}>
          {type === "hero" && <HeroUi />}
          {type === "ai" && <AiUi />}
          {type === "library" && <LibraryUi />}
          {type === "tracking" && <TrackingUi />}
          {type === "reports" && <ReportsUi />}
          {type === "dashboard" && <DashboardUi />}
        </div>
      </div>
    </div>
  );
}

function HeroUi() {
  return (
    <>
      <div className="linear-command">
        <Search size={16} />
        <span>Find winning skincare ads with curiosity hooks</span>
        <kbd>⌘K</kbd>
      </div>
      <div className="linear-hero-grid">
        <div className="linear-list">
          <span><b>GlowLab Serum</b><em>91/100</em></span>
          <span><b>NovaFit Bands</b><em>87/100</em></span>
          <span><b>CasaNest Sofa</b><em>84/100</em></span>
          <span><b>TrendCart Blender</b><em>79/100</em></span>
        </div>
        <div className="linear-panel linear-panel-hot">
          <p>AI action plan</p>
          <h3>Build this as a 15-second UGC test with proof in the first 3 seconds.</h3>
          <button>Generate hooks</button>
        </div>
      </div>
    </>
  );
}

function AiUi() {
  return (
    <>
      <div className="linear-score-card">
        <div>
          <p>GlowLab dark spot serum</p>
          <h3>Creative breakdown</h3>
        </div>
        <strong>91</strong>
      </div>
      <div className="linear-card-grid">
        <article><p>Hook</p><h4>Your dark spots are not your fault.</h4></article>
        <article><p>Audience</p><h4>Women 25-40 buying skincare online.</h4></article>
        <article><p>Fatigue risk</p><h4>Medium. Refresh visual after 7 days.</h4></article>
        <article><p>Objection</p><h4>Add proof, guarantee, and ingredient clarity.</h4></article>
      </div>
      <div className="linear-code-block">
        <span>Rewrite suggestion</span>
        <code>Stop hiding dark spots. Test a gentle routine built for visible proof.</code>
      </div>
    </>
  );
}

function LibraryUi() {
  return (
    <>
      <div className="linear-tabs"><span>All</span><span>Winners</span><span>UGC</span><span>Skincare</span></div>
      <div className="linear-table">
        <span><b>GlowLab Serum</b><em>Hook: curiosity</em><strong>91</strong></span>
        <span><b>CasaNest Sofa</b><em>Offer: bundle</em><strong>84</strong></span>
        <span><b>NovaFit Bands</b><em>CTA: urgency</em><strong>87</strong></span>
        <span><b>TrendCart Blender</b><em>Weak: proof</em><strong>79</strong></span>
      </div>
    </>
  );
}

function TrackingUi() {
  return (
    <>
      <div className="linear-brand-row"><b>NovaFit</b><span>4 new ads</span><em>2 winners</em></div>
      <div className="linear-brand-row"><b>GlowLab</b><span>CTA changed</span><em>91 top score</em></div>
      <div className="linear-brand-row"><b>CasaNest</b><span>3 active offers</span><em>84 top score</em></div>
      <div className="linear-timeline">
        <i />
        <i />
        <i />
        <i />
      </div>
    </>
  );
}

function ReportsUi() {
  return (
    <>
      <div className="linear-report-chart">
        <span style={{ height: "74%" }} />
        <span style={{ height: "48%" }} />
        <span style={{ height: "88%" }} />
        <span style={{ height: "64%" }} />
        <span style={{ height: "36%" }} />
      </div>
      <div className="linear-panel">
        <p>Weekly insight</p>
        <h3>72% of high-scoring ads use curiosity hooks before the product reveal.</h3>
      </div>
    </>
  );
}

function DashboardUi() {
  return (
    <>
      <div className="linear-metrics">
        <span><b>248</b><em>Saved ads</em></span>
        <span><b>183</b><em>AI scores</em></span>
        <span><b>18</b><em>Brands</em></span>
      </div>
      <div className="linear-panel">
        <p>Next action</p>
        <h3>Analyze NovaFit’s new UGC angle and generate 5 hook variants.</h3>
      </div>
    </>
  );
}

function LineArt({ variant }: { variant: string }) {
  return (
    <div className={`linear-art linear-art-${variant}`}>
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

function StoryScene({
  type,
}: {
  type: "ai" | "library" | "tracking" | "reports" | "dashboard";
}) {
  return (
    <div className={`linear-scene linear-scene-${type}`}>
      <div className="linear-scene-fade" />
      {type === "ai" && <AiUi />}
      {type === "library" && <LibraryUi />}
      {type === "tracking" && <TrackingUi />}
      {type === "reports" && <ReportsUi />}
      {type === "dashboard" && <DashboardUi />}
    </div>
  );
}

export default function Home() {
  useReveal();

  return (
    <main className="linear-page">
      <nav className="linear-nav">
        <a href="#" className="linear-brand" aria-label="SpySave home">
          <BrandMark size={34} />
          <strong>SpySave</strong>
        </a>
        <div className="linear-links">
          <a href="#workflow">Workflow</a>
          <a href="#ai">AI</a>
          <a href="#library">Library</a>
          <a href="#tracking">Tracking</a>
          <a href="#reports">Reports</a>
        </div>
        <div className="linear-actions">
          <a href="/app" className="linear-login">Log in</a>
          <a href="/app" className="linear-primary">Try for free</a>
        </div>
      </nav>

      <section className="linear-hero linear-reveal">
        <div className="linear-hero-copy">
          <span className="linear-kicker">
            <Sparkles size={14} />
            AI creative research for e-commerce teams
          </span>
          <h1>Turn competitor ads into creative tests that actually ship.</h1>
          <p>
            SpySave helps dropshippers and small e-commerce teams save public
            ads, score the creative, understand the strategy, and generate the
            next hook, script, or offer to test.
          </p>
          <div className="linear-hero-actions">
            <a href="/app" className="linear-primary linear-primary-big">
              Start researching
              <ArrowRight size={16} />
            </a>
            <a href="#workflow" className="linear-secondary">
              See how it works
            </a>
          </div>
        </div>
        <UiShell type="hero" large />
      </section>

      <section id="workflow" className="linear-workflow linear-reveal">
        <div>
          <p className="linear-section-label">Built for fast creative research</p>
          <h2>A simple system for finding, saving, and testing better ad angles.</h2>
        </div>
        <div className="linear-workflow-grid">
          {workflow.map((item, index) => (
            <article key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="linear-product-strip linear-reveal">
        <div><Gauge size={18} /><span>Dashboard</span></div>
        <div><Bot size={18} /><span>AI analysis</span></div>
        <div><Library size={18} /><span>Saved ads</span></div>
        <div><Bell size={18} /><span>Notifications</span></div>
        <div><Target size={18} /><span>Test ideas</span></div>
      </section>

      <section className="linear-manifesto linear-reveal">
        <h2>
          <span>A new species of ad research tool.</span> Purpose-built for
          e-commerce teams with AI creative workflows at its core, SpySave sets
          a cleaner standard for planning and launching ads.
        </h2>
        <div className="linear-pillar-grid">
          {pillars.map((pillar) => (
            <article key={pillar.title}>
              <small>{pillar.figure}</small>
              <LineArt variant={pillar.variant} />
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="linear-story-stack">
        {storySections.map((feature) => (
          <article
            id={feature.mockup === "ai" ? "ai" : feature.mockup}
            key={feature.title}
            className="linear-story linear-reveal"
          >
            <div className="linear-story-heading">
              <h2>{feature.title}</h2>
              <div>
                <p>{feature.body}</p>
                <span>
                  {feature.number} {feature.slug} <ChevronRight size={20} />
                </span>
              </div>
            </div>
            <StoryScene type={feature.mockup as "ai" | "library" | "tracking" | "reports"} />
          </article>
        ))}
      </section>

      <section className="linear-story linear-dashboard-story linear-reveal">
        <div className="linear-story-heading">
          <h2>Everything stays connected in one workspace.</h2>
          <div>
            <p>
              Dashboard, saved ads, AI detail, tracking, notifications, reports,
              help, and extension setup work together so the user always knows the
              next step.
            </p>
            <span>
              5.0 Workspace <ChevronRight size={20} />
            </span>
          </div>
        </div>
        <StoryScene type="dashboard" />
      </section>

      <section className="linear-changelog linear-reveal">
        <h2>Creative intelligence log</h2>
        <div>
          <article>
            <span />
            <h3>AI action plans</h3>
            <p>Saved ads now turn into concrete next steps, hooks, and rewrites.</p>
            <small>JUL 14, 2026</small>
          </article>
          <article>
            <span />
            <h3>Competitor tracking</h3>
            <p>Track brands and review new saved ads in a focused notification flow.</p>
            <small>JUL 13, 2026</small>
          </article>
          <article>
            <span />
            <h3>Extension side panel</h3>
            <p>Save Meta, Facebook, and TikTok Creative Center ads while browsing.</p>
            <small>JUL 12, 2026</small>
          </article>
        </div>
      </section>

      <section className="linear-quotes linear-reveal">
        <article>
          <p>
            &quot;SpySave gives small teams the creative research discipline they
            usually only see inside bigger media buying teams.&quot;
          </p>
          <span>Beta user - e-commerce founder</span>
        </article>
        <article>
          <p>
            &quot;The value is not saving ads. The value is knowing what angle to
            test next.&quot;
          </p>
          <span>SpySave positioning</span>
        </article>
      </section>

      <section className="linear-cta linear-reveal">
        <span className="linear-kicker">
          <ShieldCheck size={14} />
          Public beta
        </span>
        <h2>Research faster. Launch with better creative logic.</h2>
        <p>
          Start with the web app, connect the browser extension, and build your
          first competitor swipe file.
        </p>
        <div className="linear-hero-actions">
          <a href="/app" className="linear-primary linear-primary-big">
            Try SpySave
            <ChevronRight size={16} />
          </a>
          <a href="https://calendly.com/spysave/demo" className="linear-secondary">
            Book demo
          </a>
        </div>
      </section>

      <footer className="linear-footer">
        <div>
          <BrandMark size={28} />
          <span>SpySave</span>
        </div>
        <span>AI ad research - Public beta</span>
        <span>Built for dropshippers and small e-commerce teams</span>
      </footer>
    </main>
  );
}
