"use client";

import {
  Bell,
  Bot,
  ChevronRight,
  Gauge,
  HelpCircle,
  Library,
  Moon,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/BrandMark";

type Theme = "dark" | "light";

const DEMO_LINK = "https://calendly.com/spysave/demo";

const workflowSteps = [
  {
    title: "Capture the ad",
    body: "Open Meta Ad Library, TikTok Creative Center, or a competitor page and save the creative into SpySave.",
  },
  {
    title: "Organize the research",
    body: "Group ads by competitor, niche, hook type, folder, and testing priority.",
  },
  {
    title: "Analyze with AI",
    body: "Break down the hook, offer, CTA, audience, fatigue risk, objections, and rewrite ideas.",
  },
  {
    title: "Launch the next test",
    body: "Turn the strongest angles into hooks, UGC scripts, Meta rewrites, and creative briefs.",
  },
];

const features = [
  {
    id: "ai-detail",
    eyebrow: "Core differentiator",
    title: "AI Detail turns saved ads into creative strategy.",
    body: "SpySave explains why an ad may work, where it is weak, what audience it targets, and what to test next. It moves the user from research to action.",
    cta: "See a real ad breakdown",
    icon: Bot,
    dominant: true,
    mockup: "ai",
  },
  {
    id: "dashboard",
    eyebrow: "Command center",
    title: "Dashboard keeps the whole research workflow visible.",
    body: "Saved ads, winners, competitors, notifications, and quick actions stay in one clean workspace.",
    cta: "See your command center",
    icon: Gauge,
    dominant: false,
    mockup: "dashboard",
  },
  {
    id: "saved-ads",
    eyebrow: "Swipe file",
    title: "Saved Ads becomes a searchable creative library.",
    body: "Users can filter by winner status, score, hook, tag, folder, page name, and export research when needed.",
    cta: "See a swipe file example",
    icon: Library,
    dominant: false,
    mockup: "saved",
  },
  {
    id: "tracking",
    eyebrow: "Competitor watchlist",
    title: "Tracking shows which brands deserve attention.",
    body: "Competitor pages, niches, saved-ad counts, best scores, and update checks keep research organized.",
    cta: "See competitor tracking",
    icon: Users,
    dominant: false,
    mockup: "tracking",
  },
  {
    id: "notifications",
    eyebrow: "Activity inbox",
    title: "Notifications make competitor activity easy to review.",
    body: "Updates from tracked brands land in one inbox before email delivery is connected.",
    cta: "See notifications",
    icon: Bell,
    dominant: false,
    mockup: "notifications",
  },
  {
    id: "help",
    eyebrow: "Setup guide",
    title: "Help gives users a clean onboarding path.",
    body: "The product explains extension setup, saving ads, AI analysis, tracking, privacy, and launch steps.",
    cta: "See the setup guide",
    icon: HelpCircle,
    dominant: false,
    mockup: "help",
  },
] as const;

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem("spysave-theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="ray-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MiniBar({ width }: { width: string }) {
  return (
    <span className="ray-bar">
      <span style={{ width }} />
    </span>
  );
}

function Mockup({ type, hero = false }: { type: string; hero?: boolean }) {
  return (
    <div className={`ray-shot ${hero ? "ray-shot-hero" : ""}`}>
      <div className="ray-shot-glow" />
      <div className="ray-window">
        <div className="ray-window-top">
          <span />
          <span />
          <span />
          <div className="ray-window-search">
            <Search size={13} />
            <span>Search ads, hooks, brands...</span>
          </div>
        </div>
        <div className={`ray-window-body ray-${type}`}>
          {type === "hero" ? <HeroMockup /> : null}
          {type === "ai" ? <AiMockup /> : null}
          {type === "dashboard" ? <DashboardMockup /> : null}
          {type === "saved" ? <SavedMockup /> : null}
          {type === "tracking" ? <TrackingMockup /> : null}
          {type === "notifications" ? <NotificationsMockup /> : null}
          {type === "help" ? <HelpMockup /> : null}
        </div>
      </div>
    </div>
  );
}

function HeroMockup() {
  return (
    <>
      <div className="ray-command">
        <Search size={16} />
        <span>Search ads, hooks, offers, competitors...</span>
      </div>
      <div className="ray-command-list">
        <div>
          <span className="ray-dot" />
          <strong>GlowLab dark spot serum</strong>
          <em>91/100</em>
        </div>
        <div>
          <span className="ray-dot" />
          <strong>NovaFit resistance band UGC</strong>
          <em>87/100</em>
        </div>
        <div>
          <span className="ray-dot" />
          <strong>CasaNest modular sofa demo</strong>
          <em>84/100</em>
        </div>
        <div>
          <span className="ray-dot" />
          <strong>TrendCart portable blender</strong>
          <em>79/100</em>
        </div>
      </div>
      <div className="ray-split">
        <div className="ray-card ray-card-strong">
          <p className="ray-label">AI recommendation</p>
          <h4>Curiosity hook + proof CTA</h4>
          <MiniBar width="74%" />
        </div>
        <div className="ray-card">
          <p className="ray-label">Fatigue risk</p>
          <h4>Refresh thumbnail after 7 days</h4>
          <MiniBar width="56%" />
        </div>
      </div>
    </>
  );
}
function AiMockup() {
  return (
    <>
      <div className="ray-ai-header">
        <div>
          <p className="ray-label">GlowLab Skincare</p>
          <h3>Creative breakdown</h3>
        </div>
        <strong>91/100</strong>
      </div>
      <div className="ray-grid-2">
        <div className="ray-card">
          <p className="ray-label">Hook</p>
          <h4>&quot;Your dark spots are not your fault.&quot;</h4>
        </div>
        <div className="ray-card">
          <p className="ray-label">Offer / CTA</p>
          <h4>20% off starter kit - Shop now</h4>
        </div>
        <div className="ray-card">
          <p className="ray-label">Fatigue risk</p>
          <h4>Medium: refresh thumbnail after 7 days</h4>
        </div>
        <div className="ray-card">
          <p className="ray-label">Objection handling</p>
          <h4>Before/after proof + refund guarantee</h4>
        </div>
      </div>
      <div className="ray-card ray-card-strong">
        <div>
          <p className="ray-label">What to do now</p>
          <h3>Test a UGC curiosity opener with social proof in the first 3 seconds.</h3>
        </div>
      </div>
    </>
  );
}

function DashboardMockup() {
  return (
    <>
      <div className="ray-grid-3">
        <Metric label="Saved ads" value="248" />
        <Metric label="AI scores" value="183" />
        <Metric label="Tracked brands" value="18" />
      </div>
      <div className="ray-card">
        <p className="ray-label">Quick action</p>
        <h4>Analyze &quot;NovaFit Bands&quot; saved 12 minutes ago.</h4>
      </div>
      <div className="ray-list">
        <span>GlowLab - Possible winner - 91/100</span>
        <span>NovaFit - Good - 78/100</span>
        <span>CasaNest - Needs rewrite - 54/100</span>
      </div>
    </>
  );
}

function SavedMockup() {
  return (
    <>
      <div className="ray-filters">
        <span>All</span>
        <span>Winners</span>
        <span>Skincare</span>
        <span>UGC</span>
      </div>
      <div className="ray-list ray-list-cards">
        <span>GlowLab - Dark spot serum - 91/100</span>
        <span>CasaNest - Modular sofa - 84/100</span>
        <span>TrendCart - Portable blender - 79/100</span>
      </div>
      <div className="ray-card">
        <p className="ray-label">Export ready</p>
        <h4>3 folders, 42 tags, 248 saved ads</h4>
      </div>
    </>
  );
}

function TrackingMockup() {
  return (
    <>
      <div className="ray-list ray-list-cards">
        <span>GlowLab - 23 saved ads - best 91/100</span>
        <span>CasaNest - 17 saved ads - best 84/100</span>
        <span>NovaFit - 31 saved ads - best 88/100</span>
      </div>
      <div className="ray-card ray-card-strong">
        <p className="ray-label">Last check</p>
        <h3>4 new saved ads found for NovaFit.</h3>
      </div>
    </>
  );
}

function NotificationsMockup() {
  return (
    <div className="ray-list ray-list-cards">
      <span>NovaFit launched 4 new ads - 2 possible winners</span>
      <span>GlowLab changed CTA from &quot;Shop now&quot; to &quot;Claim offer&quot;</span>
      <span>CasaNest fatigue risk increased on 3 creatives</span>
      <span>Weekly report ready: 14 high-scoring hooks</span>
    </div>
  );
}

function HelpMockup() {
  return (
    <div className="ray-list ray-list-cards">
      <span>1. Install the extension and paste your User ID</span>
      <span>2. Save ads from Meta or TikTok Creative Center</span>
      <span>3. Run AI analysis only when you need strategy</span>
      <span>4. Review reports, tracking, and notifications</span>
    </div>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    window.localStorage.setItem("spysave-theme", theme);
  }, [theme]);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(".ray-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ray-reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="ray-page" data-theme={theme}>
      <nav className="ray-nav">
        <a href="#" className="ray-brand" aria-label="SpySave home">
          <BrandMark size={38} />
          <span>
            <strong>SpySave</strong>
            <small>AI creative research</small>
          </span>
        </a>

        <div className="ray-nav-actions">
          <a href="#workflow">Workflow</a>
          <a href="#ai-detail">AI Detail</a>
          <a href="/app">Login</a>
          <button
            type="button"
            className="ray-theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </nav>

      <section className="ray-hero ray-reveal">
        <div className="ray-hero-copy">
          <span className="ray-eyebrow">
            <Sparkles size={16} />
            AI creative research, not just screenshots
          </span>
          <h1>Turn any competitor ad into your next winning creative.</h1>
          <p>
            SpySave saves, scores, and breaks down competitor ads with AI - hook,
            offer, fatigue risk - so you skip the guesswork and launch faster.
          </p>
          <div className="ray-cta-row">
            <a href="/app" className="ray-button ray-button-primary">
              Try for free
              <ChevronRight size={17} />
            </a>
            <a href="#workflow" className="ray-button ray-button-secondary">
              See workflow
            </a>
          </div>
          <div className="ray-store-buttons">
            <a href="/app">Continue to web app</a>
            <a href="#ai-detail">View AI breakdown</a>
          </div>
          <div className="ray-proof-row">
            <span>Meta ads research</span>
            <span>Manual save + extension</span>
            <span>AI action plans</span>
          </div>
        </div>
        <Mockup type="hero" hero />
      </section>

      <section id="workflow" className="ray-section ray-reveal">
        <div className="ray-section-heading">
          <span className="ray-eyebrow">
            <Zap size={16} />
            Workflow
          </span>
          <h2>From competitor ad to test idea.</h2>
          <p>
            SpySave gives e-commerce teams a repeatable path from saving ads to
            launching stronger creative tests.
          </p>
        </div>
        <div className="ray-workflow-grid">
          {workflowSteps.map((step, index) => (
            <article key={step.title} className="ray-workflow-card">
              <span>{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ray-feature-stack">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <article
              id={feature.id}
              key={feature.id}
              className={`ray-feature ray-reveal ${
                index % 2 ? "ray-feature-reverse" : ""
              } ${feature.dominant ? "ray-feature-dominant" : ""}`}
            >
              <div className="ray-feature-copy">
                <span className="ray-eyebrow">
                  <Icon size={16} />
                  {feature.eyebrow}
                </span>
                <h2>{feature.title}</h2>
                <p>{feature.body}</p>
                <a href="/app" className="ray-button ray-button-secondary">
                  {feature.cta}
                  <ChevronRight size={17} />
                </a>
              </div>
              <Mockup type={feature.mockup} />
            </article>
          );
        })}
      </section>

      <section className="ray-beta ray-reveal">
        <div>
          <span className="ray-eyebrow">
            <ShieldCheck size={16} />
            Public beta
          </span>
          <h2>Start building a better swipe file today.</h2>
          <p>
            Save real competitor ads, analyze the strongest angles, and turn
            research into creative tests faster.
          </p>
        </div>
        <div className="ray-cta-row">
          <a href="/app" className="ray-button ray-button-primary">
            Join beta
            <ChevronRight size={17} />
          </a>
          <a href={DEMO_LINK} className="ray-button ray-button-secondary">
            Book demo
          </a>
        </div>
      </section>

      <footer className="ray-footer">
        <span>AI ad research - Public beta</span>
        <span>Dropshippers and small e-commerce teams</span>
        <span>Minimal extension permissions</span>
      </footer>
    </main>
  );
}
