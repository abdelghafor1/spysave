import { NextResponse } from "next/server";
import { analyzeWithNvidia, analyzeWithOpenAI, cleanAnalysis } from "@/app/api/ads/route";

type GeneratePayload = {
  mode?: "hooks" | "ugc" | "tiktok" | "meta" | "image" | "video";
  adText?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as GeneratePayload;
  const adText = payload.adText?.trim() || "";
  const mode = payload.mode || "hooks";

  if (!adText) {
    return NextResponse.json(
      { error: "Ad text is required for generation." },
      { status: 400 },
    );
  }

  const analysis =
    (await analyzeWithNvidia(adText)) ||
    (await analyzeWithOpenAI(adText)) ||
    cleanAnalysis({}, adText);

  const creatives = analysis.generatedCreatives;
  const output = {
    hooks: creatives.hooks,
    ugc: creatives.ugcScripts,
    tiktok: [creatives.tiktokRewrite],
    meta: [creatives.metaRewrite],
    image: creatives.imagePrompts,
    video: [creatives.videoPrompt],
  }[mode];

  return NextResponse.json({
    mode,
    output,
    actionPlan: analysis.actionPlan,
  });
}
