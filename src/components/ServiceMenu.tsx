"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { serviceMenu } from "@/lib/services";

export function ServiceMenu() {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-7xl px-5 pb-3">
      <div className="grid gap-2 rounded-xl border border-[#dbe7e2] bg-white/80 p-2 text-sm font-bold shadow-sm backdrop-blur md:flex md:items-center md:justify-center">
        {serviceMenu.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-10 items-center justify-center rounded-lg px-3 text-center transition ${
                isActive
                  ? "brand-gradient"
                  : "border border-[#dbe7e2] bg-white/75 text-[#29423a] hover:bg-[#eff6ff]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
