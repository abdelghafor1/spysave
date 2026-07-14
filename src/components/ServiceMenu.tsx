"use client";

import {
  BarChart3,
  Bell,
  Bookmark,
  CircleDollarSign,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Radar,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { auth } from "@/lib/firebase";
import { serviceMenu } from "@/lib/services";
import { signOut } from "firebase/auth";

const menuIcons = {
  "/app": LayoutDashboard,
  "/app/ads": Bookmark,
  "/app/competitors": Radar,
  "/app/reports": BarChart3,
  "/app/notifications": Bell,
  "/app/billing": CircleDollarSign,
  "/help": CircleHelp,
} as const;

export function ServiceMenu() {
  const pathname = usePathname();

  return (
    <aside className="app-sidebar">
      <Link href="/app" className="app-menu-brand" aria-label="SpySave dashboard" title="SpySave dashboard">
        <BrandMark size={30} />
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
              aria-label={item.label}
              data-label={item.label}
              title={item.label}
            >
              {Icon ? <Icon size={19} aria-hidden="true" /> : null}
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        className="app-sidebar-logout"
        aria-label="Logout"
        data-label="Logout"
        title="Logout"
        onClick={() => signOut(auth)}
      >
        <LogOut size={18} aria-hidden="true" />
      </button>
    </aside>
  );
}
