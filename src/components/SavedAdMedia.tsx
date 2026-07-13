"use client";

import { ExternalLink, ImageIcon } from "lucide-react";
import { useState } from "react";

type SavedAdMediaProps = {
  mediaUrl?: string;
  label?: string;
};

function looksLikeVideo(url: string) {
  return /\.(mp4|webm|mov)(\?|#|$)/i.test(url) || /\/video\//i.test(url);
}

export function SavedAdMedia({
  mediaUrl,
  label = "Saved creative",
}: SavedAdMediaProps) {
  const [failed, setFailed] = useState(false);
  const cleanUrl = mediaUrl?.trim();

  if (!cleanUrl) return null;

  return (
    <div className="mt-4 rounded-lg border border-[#dbe7e2] bg-white p-3">
      <div className="flex items-center gap-3">
        <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-md bg-[#f6f3ed] text-[#d25f3f]">
          {failed ? (
            <ImageIcon size={18} />
          ) : looksLikeVideo(cleanUrl) ? (
            <video
              src={cleanUrl}
              muted
              playsInline
              className="h-full w-full object-cover"
              onError={() => setFailed(true)}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cleanUrl}
              alt="Saved ad product creative"
              className="h-full w-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setFailed(true)}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase text-[#4f635d]">{label}</p>
          <p className="mt-1 truncate text-sm font-bold text-[#625d53]">
            {failed ? "Preview unavailable" : "Product media detected"}
          </p>
        </div>

        <a
          href={cleanUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#dbe7e2] px-2 py-1 text-xs font-bold text-[#3157d5]"
        >
          Open
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
