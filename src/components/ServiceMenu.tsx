"use client";

import {
  BarChart3,
  Bell,
  Bookmark,
  CircleDollarSign,
  CircleHelp,
  CircleUserRound,
  LayoutDashboard,
  Radar,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { serviceMenu } from "@/lib/services";

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
    <>
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
        <Link
          href="/app/settings"
          className={`app-sidebar-settings${pathname === "/app/settings" ? " is-active" : ""}`}
          aria-label="Settings"
          data-label="Settings"
          title="Settings"
        >
          <Settings size={18} aria-hidden="true" />
        </Link>
      </aside>
      {pathname === "/app/settings" || pathname === "/app/account" ? (
        <header className="app-utilitybar" aria-label="Account controls">
          <div className="app-utilitybar-title">Account settings</div>
          <div className="app-utilitybar-actions">
            <Link href="/app/settings" className={`app-utility-link${pathname === "/app/settings" ? " is-active" : ""}`} title="Settings" aria-label="Settings">
              <Settings size={17} aria-hidden="true" />
            </Link>
            <Link href="/app/account" className={`app-utility-link${pathname === "/app/account" ? " is-active" : ""}`} title="Account" aria-label="Account">
              <CircleUserRound size={18} aria-hidden="true" />
            </Link>
          </div>
        </header>
      ) : null}
    </>
  );
}
