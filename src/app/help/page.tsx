import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { ServiceMenu } from "@/components/ServiceMenu";
import { services } from "@/lib/services";

export default function HelpPage() {
  return (
    <main className="aurora-page min-h-screen text-[#13231f]">
      <nav className="glass-nav sticky top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <BrandMark size={40} />
            <span>
              <span className="block text-base font-semibold leading-none">
                SpySave
              </span>
              <span className="text-xs font-medium text-[#4f635d]">
                Product guide
              </span>
            </span>
          </Link>

          <Link
            href="/app"
            className="brand-gradient inline-flex h-10 items-center gap-2 px-4 text-sm font-bold"
          >
            Open workspace
            <ChevronRight size={16} />
          </Link>
        </div>
        <ServiceMenu />
      </nav>

      <section className="app-help-shell">
        <header className="app-help-hero">
          <p className="app-kicker">Product guide</p>
          <h1>From public ad to a creative decision.</h1>
          <p>
            Learn the four parts of SpySave: capture research, analyze the ads
            that matter, compare competitors, and share what your team learned.
          </p>
        </header>

        <div className="app-help-layout">
          <aside className="app-help-index" aria-label="Help topics">
            <p>On this page</p>
            <nav>
              {services.map((service, index) => (
                <a key={service.slug} href={`#${service.slug}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {service.title}
                </a>
              ))}
            </nav>
            <Link href="/app" className="app-help-index-cta">
              Start in the workspace
              <ArrowUpRight size={15} />
            </Link>
          </aside>

          <div className="app-help-content">
            {services.map((service, index) => (
              <article
                id={service.slug}
                key={service.slug}
                className="app-help-section"
              >
                <div className="app-help-section-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <p className="app-kicker">{service.eyebrow}</p>
                  <h2>{service.title}</h2>
                  <p className="app-help-description">{service.description}</p>

                  <div className="app-help-details">
                    {service.bullets.map((bullet) => (
                      <div key={bullet}>
                        <span aria-hidden="true" />
                        <p>{bullet}</p>
                      </div>
                    ))}
                  </div>

                  <div className="app-help-metadata">
                    {service.stats.map((stat) => (
                      <span key={stat}>{stat}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
