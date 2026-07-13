import type { SpySaveAd } from "./ads";

export const demoAds: SpySaveAd[] = [
  {
    id: "demo-skincare-serum",
    userId: "demo",
    pageName: "GlowLab",
    adText:
      "Still hiding texture with filters? Our overnight serum helps smooth the look of uneven skin in 7 days. Dermatologist tested, lightweight, and made for sensitive skin. Try the starter kit today with free shipping.",
    landingPageUrl: "https://example.com/glowlab-serum",
    platform: "Meta",
    tags: ["skincare", "ugc", "possible winner"],
    notes: "Demo ad. Use it to understand the AI workflow before saving your own ads.",
    folder: "Demo swipe file",
    analysis: {
      hook: "Still hiding texture with filters?",
      offer: "Starter kit with free shipping",
      cta: "Try the starter kit today",
      niche: "Skincare / beauty",
      audienceGuess: "Women buying sensitive-skin skincare online",
      painPoint: "Uneven skin texture and lack of confidence without filters.",
      trustSignals: ["Dermatologist tested", "Sensitive skin positioning"],
      objectionHandling: ["Free shipping reduces purchase friction", "Sensitive skin claim lowers risk"],
      adFatigueRisk:
        "Medium risk: strong pain point, but it needs new UGC hooks and before/after variants.",
      weaknesses: ["Needs stronger proof", "Could show clearer timeframe visuals"],
      whyItMayWork:
        "The ad opens with a specific insecurity, gives a simple result promise, and adds a low-friction starter offer.",
      ideasToTest: [
        "UGC routine showing day 1 vs day 7.",
        "Creator-led objection angle for sensitive skin.",
        "Before/after landing page headline matching the hook.",
      ],
      rewriteSuggestions: {
        hook: "Your skin texture is not the problem. Your routine is.",
        cta: "Try the starter kit with free shipping.",
        adCopy:
          "Stop covering texture with filters. Try a lightweight serum designed for sensitive skin and see smoother-looking skin in 7 days.",
      },
      creativeBrief: {
        angle: "Confidence without filters",
        concept: "Creator removes beauty filter, shows texture, then demonstrates serum routine.",
        script:
          "Open with filter-off moment, name the pain, apply serum, show 7-day result montage, close with starter kit offer.",
        visualDirection: "Bathroom mirror UGC, close-up texture shots, clean product macro.",
      },
      testPlan: [
        "Test filter-off hook vs before/after hook.",
        "Test free shipping vs starter kit price anchor.",
        "Test creator testimonial vs product-only demo.",
      ],
      scoreBreakdown: { hook: 22, offer: 20, cta: 16, trust: 18, audienceFit: 22 },
      winningScore: 88,
      verdict: "Possible Winner",
      scoreReasons: ["Specific pain point", "Clear offer", "Trust signal", "Good audience fit"],
    },
  },
  {
    id: "demo-home-organizer",
    userId: "demo",
    pageName: "NestKit",
    adText:
      "Messy kitchen drawers waste time every morning. This adjustable organizer fits any drawer size and keeps utensils visible in seconds. Order today and get 20% off your first set.",
    landingPageUrl: "https://example.com/nestkit-organizer",
    platform: "TikTok",
    tags: ["home gadget", "demo", "offer"],
    notes: "Demo ad for home gadget research.",
    folder: "Demo swipe file",
    analysis: {
      hook: "Messy kitchen drawers waste time every morning.",
      offer: "20% off first set",
      cta: "Order today",
      niche: "Home gadget",
      audienceGuess: "Home organization buyers and apartment owners",
      painPoint: "Daily frustration from cluttered kitchen drawers.",
      trustSignals: ["Functional product demo angle"],
      objectionHandling: ["Adjustable fit handles size concern", "Discount handles price concern"],
      adFatigueRisk:
        "Low to medium risk: the demo angle can be refreshed with many drawer scenarios.",
      weaknesses: ["Needs visual proof of fit", "Could add reviews or quantity sold"],
      whyItMayWork:
        "It turns a common annoyance into a visible before/after result with a simple discount CTA.",
      ideasToTest: [
        "Fast before/after drawer transformation.",
        "Problem-solution hook with timer overlay.",
        "Bundle offer for kitchen plus bathroom drawers.",
      ],
      rewriteSuggestions: {
        hook: "If your drawer looks like this, you are losing time every day.",
        cta: "Get 20% off your first organizer set.",
        adCopy:
          "Turn cluttered drawers into a clean setup in seconds with an adjustable organizer that fits your space.",
      },
      creativeBrief: {
        angle: "Daily clutter solved in seconds",
        concept: "Top-down drawer cleanup with timer and split-screen before/after.",
        script:
          "Show messy drawer, dump organizer in, adjust sections, place utensils, end with discount overlay.",
        visualDirection: "Bright kitchen counter, overhead shots, satisfying organization sequence.",
      },
      testPlan: [
        "Test 5-second transformation vs problem-first hook.",
        "Test 20% discount vs bundle deal.",
        "Test overhead demo vs UGC talking-head intro.",
      ],
      scoreBreakdown: { hook: 20, offer: 18, cta: 16, trust: 12, audienceFit: 19 },
      winningScore: 85,
      verdict: "Possible Winner",
      scoreReasons: ["Common problem", "Clear product demo", "Discount offer", "Easy CTA"],
    },
  },
];
