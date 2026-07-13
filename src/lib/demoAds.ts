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
      actionPlan: {
        bestNextMove: "Build this as a 15-second UGC routine with a filter-off opening.",
        recommendedFormat: "UGC testimonial",
        hookToTest: "Still hiding your skin texture with filters?",
        ctaToTest: "Try the starter kit while free shipping is active.",
        audienceToTarget: "Women 25-40 interested in skincare, sensitive skin, and beauty routines.",
        platformRecommendation: "Validate on TikTok/Reels, then adapt the winner for Meta retargeting.",
        scriptLength: "15 seconds",
      },
      generatedCreatives: {
        hooks: [
          "Still hiding your skin texture with filters?",
          "I stopped covering texture and changed this one step.",
          "If your skin looks uneven on camera, try this.",
          "This is the serum I wish I found earlier.",
          "Your skin routine might be causing the problem.",
        ],
        ugcScripts: [
          "Open with filter-off skin texture, show serum application, cut to day 7 result, close with starter kit offer.",
          "Creator explains sensitive-skin frustration, applies product, shows texture close-up, ends with free shipping CTA.",
          "Before/after montage with captions: texture, routine, result, starter kit.",
        ],
        tiktokRewrite:
          "Start with a filter-off moment, use fast captions, show the serum texture, then close with day 7 result.",
        metaRewrite:
          "Lead with texture insecurity, add dermatologist-tested proof, show starter kit, and use free shipping CTA.",
        imagePrompts: [
          "Close-up skincare serum bottle on bathroom counter with soft natural light and text overlay about texture.",
          "UGC creator holding serum near mirror with visible product label and clean skincare shelf.",
          "Before/after split layout showing uneven texture and smoother-looking skin with product in center.",
        ],
        videoPrompt:
          "15-second vertical UGC skincare ad with filter-off hook, serum routine, day 7 result montage, and starter kit CTA.",
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
      actionPlan: {
        bestNextMove: "Build a satisfying before/after product demo with a timer overlay.",
        recommendedFormat: "Product demo",
        hookToTest: "If your drawer looks like this, you are losing time every day.",
        ctaToTest: "Get 20% off your first organizer set.",
        audienceToTarget: "Home organization buyers, renters, apartment owners, and kitchen gadget shoppers.",
        platformRecommendation: "Use TikTok for the transformation demo and Meta for discount retargeting.",
        scriptLength: "12-15 seconds",
      },
      generatedCreatives: {
        hooks: [
          "If your drawer looks like this, you are losing time every day.",
          "I fixed my kitchen drawer in 10 seconds.",
          "This drawer organizer is weirdly satisfying.",
          "Stop digging for utensils every morning.",
          "The easiest kitchen upgrade under one minute.",
        ],
        ugcScripts: [
          "Show messy drawer, add organizer, sort utensils, show final clean result, end with 20% offer.",
          "Start with morning frustration, demonstrate adjustable fit, then show before/after split.",
          "Use a timer overlay: 0 seconds messy, 10 seconds organized, finish with discount CTA.",
        ],
        tiktokRewrite:
          "Use a fast transformation hook, overhead demo, satisfying cuts, and a 20% off caption.",
        metaRewrite:
          "Lead with time-saving benefit, show adjustable fit, add discount, and close with order CTA.",
        imagePrompts: [
          "Overhead kitchen drawer before/after split with adjustable organizer and clean utensils.",
          "Bright kitchen counter product shot with organizer compartments and discount badge.",
          "Messy drawer transformed into organized layout with bold text: fixed in seconds.",
        ],
        videoPrompt:
          "12-second vertical product demo: messy drawer, organizer adjustment, clean final result, 20% off CTA.",
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
