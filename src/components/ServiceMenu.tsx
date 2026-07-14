"use client";

import {
  BarChart3,
  Bell,
  Bookmark,
  CircleDollarSign,
  CircleHelp,
  House,
  LayoutDashboard,
  Radar,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { serviceMenu } from "@/lib/services";

const menuIcons = {
  "/": House,
  "/app": LayoutDashboard,
  "/app/ads": Bookmark,
  "/app/competitors": Radar,
  "/app/reports": BarChart3,
  "/app/notifications": Bell,
  "/app/workspace": Users,
  "/app/billing": CircleDollarSign,
  "/help": CircleHelp,
} as const;

export function ServiceMenu() {
  const pathname = usePathname();

  return (
    <div className="app-menu-wrap">
      <div className="app-commandbar">
        <Link href="/app" className="app-menu-brand" aria-label="SpySave dashboard">
          <BrandMark size={28} />
          <span>SpySave</span>
        </Link>
        <nav className="app-menu-links" aria-label="Product navigation">
        {serviceMenu.map((item) => {
          const isActive =
            item.href === "/" || item.href === "/app"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = menuIcons[item.href as keyof typeof menuIcons];

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`app-menu-link${isActive ? " is-active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {Icon ? <Icon size={15} aria-hidden="true" /> : null}
              <span>{item.label}</span>
            </Link>
          );
        })}
        </nav>
      </div>
    </div>
  );
}
