export const services = [
  {
    slug: "save-ads",
    title: "Save Ads",
    menuLabel: "Save Ads",
    eyebrow: "Chrome extension + manual save",
    description:
      "Capture public Meta ads with page name, ad text, media URL, landing page, tags, notes, and folders.",
    bullets: [
      "Save ads from Meta Ad Library or Facebook pages.",
      "Keep media, source links, landing pages, and notes in one place.",
      "Organize research by tags and folders for faster creative planning.",
    ],
    stats: ["Manual save", "Media links", "Tags & notes"],
  },
  {
    slug: "ai-analysis",
    title: "AI Analysis",
    menuLabel: "AI Analysis",
    eyebrow: "Creative breakdown",
    description:
      "Turn every saved ad into a clear analysis with hook, offer, CTA, audience guess, niche, ideas, and winning score.",
    bullets: [
      "Extract the hook, promise, pain point, offer, and CTA.",
      "Generate test ideas based on the strongest angle.",
      "Score ads so good creatives are easy to find again.",
    ],
    stats: ["Hook", "CTA", "Winning Score"],
  },
  {
    slug: "competitors",
    title: "Competitor Tracking",
    menuLabel: "Competitors",
    eyebrow: "Tracking lite",
    description:
      "Save competitor pages, connect ads to those brands, and compare average and best winning scores.",
    bullets: [
      "Create a competitor list with Meta Library links.",
      "Filter saved ads by competitor page.",
      "Compare competitor ad count, average score, and best score.",
    ],
    stats: ["Tracked pages", "Best score", "Avg score"],
  },
  {
    slug: "reports",
    title: "Reports",
    menuLabel: "Reports",
    eyebrow: "Export and share",
    description:
      "Export filtered ads and prepare weekly summaries for product research, media buying, and client updates.",
    bullets: [
      "Export saved ads to CSV.",
      "Review best hooks, offers, niches, and competitors.",
      "Prepare agency reports after the beta gets stable.",
    ],
    stats: ["CSV", "Weekly view", "Client ready"],
  },
];

export const serviceMenu = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/app" },
  { label: "Saved Ads", href: "/app/ads" },
  { label: "Tracking", href: "/app/competitors" },
  { label: "Reports", href: "/app/reports" },
  { label: "Notifications", href: "/app/notifications" },
  { label: "Workspace", href: "/app/workspace" },
  { label: "Billing", href: "/app/billing" },
  { label: "Help", href: "/help" },
];
