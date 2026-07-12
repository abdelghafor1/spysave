import { Check, ChevronRight, Sparkles } from "lucide-react";
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
            <BrandMark size={44} />
            <span>
              <span className="block text-lg font-semibold leading-none">
                SpySave
              </span>
              <span className="text-xs font-medium text-[#4f635d]">
                Help center
              </span>
            </span>
          </Link>

          <Link
            href="/app"
            className="brand-gradient inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold"
          >
            Dashboard
            <ChevronRight size={16} />
          </Link>
        </div>
        <ServiceMenu />
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-7">
        <div className="premium-panel rounded-xl p-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d8e8e1] bg-white px-4 py-2 text-sm font-bold text-[#29423a]">
            <Sparkles size={16} className="text-[#d7ff64]" />
            Help
          </span>
          <h1 className="mt-4 text-5xl font-semibold leading-tight">
            SpySave help and features
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#4f635d]">
            Everything removed from the main menu is collected here so the app
            stays clean while the project still has feature explanations.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {services.map((service) => (
            <article key={service.slug} className="premium-panel rounded-xl p-5">
              <p className="text-sm font-bold uppercase text-[#07966f]">
                {service.eyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-semibold">{service.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#4f635d]">
                {service.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {service.stats.map((stat) => (
                  <span
                    key={stat}
                    className="rounded-lg bg-[#eef8f2] px-3 py-2 text-xs font-bold text-[#29423a]"
                  >
                    {stat}
                  </span>
                ))}
              </div>

              <div className="mt-4 grid gap-2">
                {service.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="flex items-start gap-3 rounded-lg border border-[#d8e8e1] bg-white p-3"
                  >
                    <span className="brand-gradient grid size-7 shrink-0 place-items-center rounded-md">
                      <Check size={15} />
                    </span>
                    <p className="text-sm font-semibold leading-6 text-[#26302c]">
                      {bullet}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
