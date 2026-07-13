"use client";

import {
  Bell,
  BookmarkPlus,
  Bot,
  ChevronRight,
  Gauge,
  Globe2,
  Languages,
  Layers3,
  Library,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";

type Locale = "en" | "ar" | "fr";

const DEMO_LINK = "https://calendly.com/spysave/demo";

const screenshots = [
  { key: "aiDetail", icon: Bot, accent: "#7c3aed", screenshot: "/screenshots/ai-detail.png" },
  { key: "savedAds", icon: BookmarkPlus, accent: "#f59e0b", screenshot: "/screenshots/saved-ads.png" },
  { key: "tracking", icon: Users, accent: "#06b6d4", screenshot: "/screenshots/tracking.png" },
  { key: "notifications", icon: Bell, accent: "#f97316", screenshot: "/screenshots/notifications.png" },
  { key: "dashboard", icon: Gauge, accent: "#2563eb", screenshot: "/screenshots/dashboard.png" },
] as const;

const screenActions = {
  dashboard: "See your command center",
  savedAds: "See a swipe file example",
  aiDetail: "See a real ad breakdown",
  tracking: "See competitor tracking",
  notifications: "See notifications",
  help: "See the setup guide",
} as const;

const translations = {
  en: {
    meta: "Meta ads research",
    navBadge: "Public ad research workspace",
    heroBadge: "AI creative research, not just screenshots",
    heroTitle: "Turn any competitor ad into your next winning creative.",
    heroBody:
      "SpySave saves, scores, and breaks down competitor ads with AI — hook, offer, fatigue risk — so you skip the guesswork and launch faster.",
    tryFree: "Try for free",
    seeProduct: "See product",
    stats: [
      ["AI score", "Hook, offer, fatigue risk"],
      ["Swipe file", "Tags, notes, media preview"],
      ["Tracking", "Competitor updates"],
    ],
    screens: {
      dashboard: [
        "Dashboard",
        "Command center",
        "Overview of saved ads, AI scores, tracked brands, notifications, and quick actions in one workspace.",
      ],
      savedAds: [
        "Saved Ads",
        "Clean swipe file",
        "Every ad is organized with page name, tags, notes, media preview, score, search, filters, and CSV export.",
      ],
      aiDetail: [
        "AI Detail",
        "Deep creative analysis",
        "Hook, offer, CTA, pain point, audience, trust signals, objection handling, fatigue risk, and rewrite ideas.",
      ],
      tracking: [
        "Tracking",
        "Competitor tracking",
        "Add competitor pages, organize niches, and keep their saved ads connected to your research.",
      ],
      notifications: [
        "Notifications",
        "Updates inbox",
        "A clean inbox for alerts when tracked competitors have new saved ads or activity.",
      ],
      help: [
        "Help",
        "Setup and launch guide",
        "Install steps, workflow, privacy, and launch checklist for a clear product demo.",
      ],
    },
    tryPage: "Try this page",
    betaEyebrow: "Beta access",
    betaTitle: "Join the SpySave beta and test with real ads.",
    joinBeta: "Join beta",
    bookDemo: "Book demo",
    productCards: [
      ["AI analysis", "Hook, offer, CTA, audience, ideas, and score."],
      ["Save ads", "Capture public Meta ads into your account."],
      ["Organize", "Tags, notes, folders, search, and CSV export."],
      ["Track competitors", "Save competitor pages and compare their ads."],
    ],
    workflowEyebrow: "Workflow",
    workflowTitle: "From competitor ad to test idea.",
    workflowBody:
      "Simple enough for a 14-day MVP, useful enough for a real product demo.",
    workflow: [
      ["Open Meta Ad Library", "Find an ad from a product or competitor page."],
      ["Save with extension", "SpySave captures page name, text, links, and media."],
      ["Analyze with AI", "Get hook, offer, CTA, niche, audience, and winning score."],
      ["Build your next test", "Use the best angles inside your next creative brief."],
    ],
    footerLeft: "Public ad research. Minimal extension permissions.",
    footerLang: "EN / AR / FR",
    footerSwipe: "AI ad research",
    footerMvp: "Public beta",
  },
  ar: {
    meta: "بحث إعلانات ميتا",
    navBadge: "مساحة بحث للإعلانات العامة",
    heroBadge: "منصة ذكاء الإعلانات",
    heroTitle: "حلّل إعلانات المنافسين قبل إطلاق حملتك.",
    heroBody:
      "SpySave يساعدك تحفظ الإعلانات، تنظّم ملف الأفكار، تحلل الزوايا الإبداعية بالذكاء الاصطناعي، وتتابع نشاط المنافسين.",
    tryFree: "جرّب مجاناً",
    seeProduct: "شاهد المنتج",
    stats: [
      ["نقاط AI", "Hook، عرض، خطر التعب"],
      ["ملف الإعلانات", "Tags، ملاحظات، معاينة media"],
      ["التتبع", "تحديثات المنافسين"],
    ],
    screens: {
      dashboard: [
        "لوحة التحكم",
        "مركز العمل",
        "نظرة عامة على الإعلانات المحفوظة، نقاط AI، العلامات المتتبعة، التنبيهات، والإجراءات السريعة.",
      ],
      savedAds: [
        "الإعلانات المحفوظة",
        "ملف أفكار مرتب",
        "كل إعلان يظهر مع اسم الصفحة، الوسوم، الملاحظات، معاينة المنتج، النتيجة، البحث، الفلاتر، والتصدير.",
      ],
      aiDetail: [
        "تفاصيل AI",
        "تحليل إبداعي عميق",
        "Hook، العرض، CTA، نقطة الألم، الجمهور، إشارات الثقة، الاعتراضات، خطر التعب، واقتراحات إعادة الكتابة.",
      ],
      tracking: [
        "التتبع",
        "تتبع المنافسين",
        "أضف صفحات المنافسين، نظّم المجالات، واربط إعلاناتهم المحفوظة ببحثك.",
      ],
      notifications: [
        "التنبيهات",
        "صندوق التحديثات",
        "مكان واضح للتنبيهات عندما يظهر نشاط أو إعلان محفوظ جديد لمنافس متتبع.",
      ],
      help: [
        "المساعدة",
        "دليل الإعداد والإطلاق",
        "خطوات التثبيت، طريقة العمل، الخصوصية، وقائمة الإطلاق لعرض المنتج بوضوح.",
      ],
    },
    tryPage: "جرّب هذه الصفحة",
    betaEyebrow: "دخول تجريبي",
    betaTitle: "انضم لنسخة SpySave التجريبية وجرب بإعلانات حقيقية.",
    joinBeta: "انضم للبيتا",
    bookDemo: "احجز عرضاً",
    productCards: [
      ["حفظ الإعلانات", "احفظ إعلانات Meta العامة داخل حسابك."],
      ["تنظيم", "وسوم، ملاحظات، مجلدات، بحث، وتصدير CSV."],
      ["تحليل AI", "Hook، عرض، CTA، جمهور، أفكار، ونتيجة."],
      ["تتبع المنافسين", "احفظ صفحات المنافسين وقارن إعلاناتهم."],
    ],
    workflowEyebrow: "طريقة العمل",
    workflowTitle: "من إعلان منافس إلى فكرة اختبار.",
    workflowBody: "بسيطة كـ MVP في 14 يوم، ومفيدة كعرض منتج حقيقي.",
    workflow: [
      ["افتح Meta Ad Library", "ابحث عن إعلان منتج أو صفحة منافس."],
      ["احفظ بالإكستنشن", "SpySave يلتقط اسم الصفحة، النص، الروابط، والmedia."],
      ["حلّل بالذكاء الاصطناعي", "احصل على hook، عرض، CTA، niche، جمهور، وwinning score."],
      ["ابنِ الاختبار التالي", "استعمل أقوى الزوايا في brief الإعلان القادم."],
    ],
    footerLeft: "بحث في الإعلانات العامة. صلاحيات الإكستنشن محدودة.",
    footerLang: "EN / AR / FR",
    footerSwipe: "SaaS لملف الإعلانات",
    footerMvp: "جاهز كـ MVP",
  },
  fr: {
    meta: "Recherche publicitaire Meta",
    navBadge: "Espace de recherche publicitaire",
    heroBadge: "Workspace d'intelligence publicitaire",
    heroTitle: "Analysez les pubs concurrentes avant de lancer.",
    heroBody:
      "SpySave vous aide à sauvegarder des publicités, organiser votre swipe file, analyser les angles créatifs avec l'IA et suivre l'activité des concurrents.",
    tryFree: "Essayer gratuitement",
    seeProduct: "Voir le produit",
    stats: [
      ["Score IA", "Hook, offre, risque de fatigue"],
      ["Swipe file", "Tags, notes, aperçu média"],
      ["Tracking", "Mises à jour concurrents"],
    ],
    screens: {
      dashboard: [
        "Dashboard",
        "Centre de commande",
        "Vue globale des pubs sauvegardées, scores IA, marques suivies, notifications et actions rapides.",
      ],
      savedAds: [
        "Pubs sauvegardées",
        "Swipe file propre",
        "Chaque pub est organisée avec page, tags, notes, aperçu média, score, recherche, filtres et export CSV.",
      ],
      aiDetail: [
        "Détail IA",
        "Analyse créative profonde",
        "Hook, offre, CTA, douleur client, audience, preuves, objections, fatigue publicitaire et idées de réécriture.",
      ],
      tracking: [
        "Tracking",
        "Suivi des concurrents",
        "Ajoutez des pages concurrentes, organisez les niches et reliez leurs pubs à votre recherche.",
      ],
      notifications: [
        "Notifications",
        "Boîte de mises à jour",
        "Un espace clair pour les alertes quand un concurrent suivi a une nouvelle activité.",
      ],
      help: [
        "Aide",
        "Guide de configuration",
        "Installation, workflow, confidentialité et checklist de lancement pour une démo claire.",
      ],
    },
    tryPage: "Essayer cette page",
    betaEyebrow: "Accès bêta",
    betaTitle: "Rejoignez la bêta SpySave et testez avec de vraies pubs.",
    joinBeta: "Rejoindre la bêta",
    bookDemo: "Demander une démo",
    productCards: [
      ["Sauvegarder", "Capturez des publicités Meta publiques dans votre compte."],
      ["Organiser", "Tags, notes, dossiers, recherche et export CSV."],
      ["Analyse IA", "Hook, offre, CTA, audience, idées et score."],
      ["Suivre concurrents", "Sauvegardez des pages concurrentes et comparez leurs pubs."],
    ],
    workflowEyebrow: "Workflow",
    workflowTitle: "De la pub concurrente à l'idée de test.",
    workflowBody:
      "Assez simple pour un MVP en 14 jours, assez utile pour une vraie démo produit.",
    workflow: [
      ["Ouvrir Meta Ad Library", "Trouvez une pub depuis une page produit ou concurrent."],
      ["Sauvegarder avec l'extension", "SpySave capture page, texte, liens et média."],
      ["Analyser avec l'IA", "Obtenez hook, offre, CTA, niche, audience et winning score."],
      ["Créer le prochain test", "Utilisez les meilleurs angles dans votre prochain brief créatif."],
    ],
    footerLeft: "Recherche d'annonces publiques. Permissions d'extension minimales.",
    footerLang: "EN / AR / FR",
    footerSwipe: "Swipe file SaaS",
    footerMvp: "MVP prêt",
  },
} as const;

const heroOverrides = {
  en: {
    badge: "AI creative research, not just screenshots",
    title: "Turn any competitor ad into your next winning creative.",
    body:
      "SpySave saves, scores, and breaks down competitor ads with AI — hook, offer, fatigue risk — so you skip the guesswork and launch faster.",
    footerSwipe: "AI ad research",
    footerMvp: "Public beta",
  },
  ar: {
    badge: "بحث إبداعي بالذكاء الاصطناعي، وليس مجرد screenshots",
    title: "حوّل أي إعلان منافس إلى الكرياتيف الرابح القادم.",
    body:
      "SpySave يحفظ، يقيّم، ويحلل إعلانات المنافسين بالذكاء الاصطناعي — hook، العرض، وخطر fatigue — باش تنقص التخمين وتطلق أسرع.",
    footerSwipe: "بحث إعلانات بالذكاء الاصطناعي",
    footerMvp: "بيتا عامة",
  },
  fr: {
    badge: "Recherche créative IA, pas seulement des screenshots",
    title: "Transformez chaque pub concurrente en votre prochain créatif gagnant.",
    body:
      "SpySave sauvegarde, score et décompose les pubs concurrentes avec l'IA — hook, offre, fatigue risk — pour éviter les suppositions et lancer plus vite.",
    footerSwipe: "Recherche pub IA",
    footerMvp: "Bêta publique",
  },
} as const;

const screenActionOverrides = {
  en: screenActions,
  ar: {
    dashboard: "شاهد مركز التحكم",
    savedAds: "شاهد مثال swipe file",
    aiDetail: "شاهد تحليل إعلان حقيقي",
    tracking: "شاهد تتبع المنافسين",
    notifications: "شاهد التنبيهات",
    help: "شاهد دليل الإعداد",
  },
  fr: {
    dashboard: "Voir le centre de commande",
    savedAds: "Voir un exemple de swipe file",
    aiDetail: "Voir une vraie analyse de pub",
    tracking: "Voir le suivi concurrent",
    notifications: "Voir les notifications",
    help: "Voir le guide de setup",
  },
} as const;

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
      priority={label === "Dashboard" || label === "لوحة التحكم"}
    />
  );
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const copy = translations[locale];
  const hero = heroOverrides[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <main dir={dir} className="aurora-page min-h-screen text-[#101413]">
      <nav className="glass-nav sticky top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3">
          <a href="#" className="flex items-center gap-3">
            <BrandMark size={44} className="shadow-sm" />
            <span>
              <span className="block text-lg font-semibold leading-none">SpySave</span>
              <span className="text-xs font-medium text-[#4f635d]">{copy.meta}</span>
            </span>
          </a>

          <div className="hidden items-center gap-2 rounded-full border border-[#d8e8e1] bg-white/70 px-3 py-2 text-sm font-bold text-[#4f635d] md:flex">
            <ShieldCheck size={15} className="text-[#0f9f7a]" />
            {copy.navBadge}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[#d8e8e1] bg-white/80 p-1 shadow-sm">
            <Languages size={16} className="ms-2 text-[#0f9f7a]" />
            {(["en", "ar", "fr"] as Locale[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLocale(item)}
                className={`h-8 rounded-md px-3 text-xs font-bold uppercase ${
                  locale === item ? "brand-gradient" : "text-[#29423a] hover:bg-[#eaf7f2]"
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
              {hero.badge}
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-[#13231f] md:text-6xl">
              {hero.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-[#4f635d]">
              {hero.body}
            </p>
            <div className="mx-auto mt-5 grid max-w-2xl gap-2 sm:grid-cols-3">
              {copy.stats.map(([title, body]) => (
                <div
                  key={title}
                  className="rounded-lg border border-[#d8e8e1] bg-white/75 px-3 py-3 text-start shadow-sm"
                >
                  <p className="text-sm font-bold text-[#13231f]">{title}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-[#4f635d]">
                    {body}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/app"
                className="brand-gradient inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-bold shadow-sm"
              >
                {copy.tryFree}
                <ChevronRight size={17} />
              </a>
              <a
                href="#product"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#d8e8e1] bg-white px-6 text-sm font-bold text-[#13231f] shadow-sm"
              >
                {copy.seeProduct}
              </a>
            </div>
          </div>

        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-5 py-9">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase text-[#08775d]">
              {copy.workflowEyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-semibold">{copy.workflowTitle}</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#66736d]">
            {copy.workflowBody}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {copy.workflow.map(([title, body], index) => (
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

      <section id="product" className="border-y border-[#dbe7e2] bg-white/70">
        <div className="mx-auto max-w-7xl px-5 py-9">
          <div className="vertical-screens" aria-label="SpySave page previews">
            {screenshots.map((screen) => {
              const Icon = screen.icon;
              const [label, title, description] = copy.screens[screen.key];

              return (
                <article
                  key={screen.key}
                  className="screen-card screen-card-vertical hover-glow"
                  style={{ "--screen-accent": screen.accent } as CSSProperties}
                >
                  <div className="screen-copy">
                    <div className="screen-card-header">
                      <span className="screen-icon">
                        <Icon size={18} />
                      </span>
                      <span className="screen-label">{label}</span>
                    </div>

                    <h3>{title}</h3>
                    <p>{description}</p>

                    <a
                      href="/app"
                      className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#d8e8e1] bg-white px-4 text-sm font-bold text-[#13231f]"
                    >
                      {screenActionOverrides[locale][screen.key]}
                      <ChevronRight size={16} />
                    </a>
                  </div>

                  <div className="screen-browser">
                    <ProductScreenPreview label={label} screenshot={screen.screenshot} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-9">
        <div className="premium-panel flex flex-wrap items-center justify-between gap-3 rounded-xl p-4">
          <div>
            <p className="text-sm font-bold uppercase text-[#08775d]">
              {copy.betaEyebrow}
            </p>
            <h2 className="mt-1 text-2xl font-semibold">{copy.betaTitle}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="/app"
              className="brand-gradient inline-flex h-11 items-center rounded-lg px-4 text-sm font-bold"
            >
              {copy.joinBeta}
            </a>
            <a
              href={DEMO_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-lg border border-[#d8e8e1] bg-white px-4 text-sm font-bold text-[#13231f]"
            >
              {copy.bookDemo}
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-sm font-medium text-[#66736d] md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} />
          {copy.footerLeft}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2">
            <Globe2 size={16} />
            {copy.footerLang}
          </span>
          <span className="inline-flex items-center gap-2">
            <Library size={16} />
            {hero.footerSwipe}
          </span>
          <span className="inline-flex items-center gap-2">
            <Layers3 size={16} />
            {hero.footerMvp}
          </span>
        </div>
      </footer>
    </main>
  );
}
