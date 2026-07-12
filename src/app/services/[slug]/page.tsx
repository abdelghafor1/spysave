import { Check, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { ServiceMenu } from "@/components/ServiceMenu";
import { services } from "@/lib/services";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  return {
    title: service ? `${service.title} - SpySave` : "SpySave",
    description: service?.description,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

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
                Meta ads research
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

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d8e8e1] bg-white/75 px-4 py-2 text-sm font-bold text-[#29423a] shadow-sm backdrop-blur">
            <Sparkles size={16} className="text-[#d7ff64]" />
            {service.eyebrow}
          </span>

          <div className="space-y-4">
            <h1 className="glow-text max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal md:text-6xl">
              {service.title}
            </h1>
            <p className="max-w-2xl text-base font-medium leading-7 text-[#29423a]">
              {service.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/app"
              className="brand-gradient inline-flex h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-bold"
            >
              Try it in dashboard
              <ChevronRight size={17} />
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-[#d8e8e1] bg-white/80 px-5 text-sm font-bold text-[#13231f] shadow-sm backdrop-blur"
            >
              Back home
            </Link>
          </div>
        </div>

        <section className="premium-panel rounded-xl p-4 text-[#101413]">
          <div className="grid gap-3 md:grid-cols-3">
            {service.stats.map((stat) => (
              <div key={stat} className="rounded-lg bg-[#eef2f0] p-4">
                <p className="text-sm font-bold uppercase text-[#66736d]">
                  Included
                </p>
                <p className="mt-2 text-xl font-semibold">{stat}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3">
            {service.bullets.map((bullet) => (
              <article
                key={bullet}
                className="rounded-lg border border-[#d8dfdc] bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="brand-gradient grid size-8 shrink-0 place-items-center rounded-lg">
                    <Check size={16} />
                  </span>
                  <p className="text-sm font-semibold leading-6 text-[#26302c]">
                    {bullet}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
