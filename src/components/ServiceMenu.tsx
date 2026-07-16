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
import { useLanguage } from "@/components/LanguageProvider";
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
  const { t } = useLanguage();
  const labels: Record<string, string> = { "/app": t("dashboard"), "/app/ads": t("savedAds"), "/app/competitors": t("tracking"), "/app/reports": t("reports"), "/app/notifications": t("notifications"), "/app/billing": t("billing"), "/help": t("help") };

  return (
    <>
      <aside className="app-sidebar">
        <Link href="/app" className="app-menu-brand" aria-label={t("spySaveDashboard")} title={t("spySaveDashboard")}>
          <BrandMark size={30} />
        </Link>
        <nav className="app-menu-links" aria-label={t("productNavigation")}>
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
                aria-label={labels[item.href] ?? item.label}
                data-label={labels[item.href] ?? item.label}
                title={labels[item.href] ?? item.label}
              >
                {Icon ? <Icon size={19} aria-hidden="true" /> : null}
                <span className="sr-only">{labels[item.href] ?? item.label}</span>
              </Link>
            );
          })}
        </nav>
        <Link
          href="/app/settings"
          className={`app-sidebar-settings${pathname === "/app/settings" ? " is-active" : ""}`}
          aria-label={t("settings")}
          data-label={t("settings")}
          title={t("settings")}
        >
          <Settings size={18} aria-hidden="true" />
        </Link>
      </aside>
      {pathname === "/app/settings" || pathname === "/app/account" ? (
        <header className="app-utilitybar" aria-label={t("accountControls")}>
          <div className="app-utilitybar-actions">
            <Link href="/app/settings" className={`app-utility-link${pathname === "/app/settings" ? " is-active" : ""}`}>
              <Settings size={16} aria-hidden="true" /> {t("settings")}
            </Link>
            <Link href="/app/account" className={`app-utility-link${pathname === "/app/account" ? " is-active" : ""}`}>
              <CircleUserRound size={17} aria-hidden="true" /> {t("account")}
            </Link>
          </div>
        </header>
      ) : null}
    </>
  );
}
