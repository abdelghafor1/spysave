import { SpySaveAd } from "@/lib/ads";

export const demoAds: SpySaveAd[] = [
  {
    id: "demo-glowlab",
    userId: "demo",
    pageName: "GlowLab",
    adText:
      "Still hiding acne under makeup? Get clearer-looking skin with our 3-step bundle. Shop today and get 30% off plus free shipping.",
    mediaUrl: "",
    sourceUrl: "https://www.facebook.com/ads/library/",
    landingPageUrl: "https://example.com/glowlab",
    platform: "Meta",
    tags: ["skincare", "before after", "winner"],
    notes: "Strong pain point and simple bundle offer.",
    folder: "Skincare research",
    analysis: {
      hook: "Still hiding acne under makeup?",
      offer: "30% off plus free shipping",
      cta: "Shop today",
      niche: "Skincare / beauty",
      audienceGuess: "Women 18-34 looking for clearer skin",
      whyItMayWork:
        "The ad names a clear insecurity, gives a simple solution, and adds a time-sensitive incentive.",
      ideasToTest: [
        "UGC opener showing the routine.",
        "Before/after creative with the same hook.",
        "Bundle offer against free-shipping offer.",
      ],
      winningScore: 91,
      verdict: "Possible Winner",
      scoreReasons: ["Clear hook", "Strong offer", "Pain point", "Readable length"],
    },
  },
  {
    id: "demo-fitpocket",
    userId: "demo",
    pageName: "FitPocket",
    adText:
      "I stopped skipping workouts after this tiny kit made home training easy. Order now and start with beginner-friendly routines.",
    mediaUrl: "",
    sourceUrl: "https://www.facebook.com/ads/library/",
    landingPageUrl: "https://example.com/fitpocket",
    platform: "Meta",
    tags: ["fitness", "ugc", "habit"],
    notes: "Good lifestyle angle for beginners.",
    folder: "Fitness ideas",
    analysis: {
      hook: "I stopped skipping workouts after this tiny kit made home training easy",
      offer: "Starter kit",
      cta: "Order now",
      niche: "Fitness",
      audienceGuess: "Beginners who want easy home workouts",
      whyItMayWork:
        "It frames the product as a habit fix, not just equipment, which makes the promise more emotional.",
      ideasToTest: [
        "Creator testimonial with a 7-day challenge.",
        "Short version focused on skipping workouts.",
        "Offer a beginner bundle with routines.",
      ],
      winningScore: 84,
      verdict: "Good",
      scoreReasons: ["Clear hook", "Clear CTA", "Result angle"],
    },
  },
  {
    id: "demo-homeease",
    userId: "demo",
    pageName: "HomeEase",
    adText:
      "This tiny kitchen tool saves 20 minutes daily without changing your routine. Buy 2 get 1 free for your home setup.",
    mediaUrl: "",
    sourceUrl: "https://www.facebook.com/ads/library/",
    landingPageUrl: "https://example.com/homeease",
    platform: "Meta",
    tags: ["home gadget", "problem solution"],
    notes: "Simple time-saving promise.",
    folder: "Home gadget tests",
    analysis: {
      hook: "This tiny kitchen tool saves 20 minutes daily",
      offer: "Buy 2 get 1 free",
      cta: "CTA not obvious",
      niche: "Home gadget",
      audienceGuess: "Busy home buyers who like simple tools",
      whyItMayWork:
        "The benefit is easy to understand and the bundle gives a reason to buy more than one.",
      ideasToTest: [
        "Show a 5-second before/after use case.",
        "Test a stronger CTA in the first caption line.",
        "Compare bundle offer against discount offer.",
      ],
      winningScore: 78,
      verdict: "Possible Winner",
      scoreReasons: ["Clear hook", "Clear offer", "Buying incentive"],
    },
  },
];
