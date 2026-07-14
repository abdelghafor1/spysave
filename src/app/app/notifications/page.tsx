"use client";

import { Bell, Check } from "lucide-react";
import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";
import { ServiceMenu } from "@/components/ServiceMenu";
import {
  SpySaveNotification,
  markNotificationRead,
  watchUserNotifications,
} from "@/lib/ads";
import { auth } from "@/lib/firebase";

function formatDate(notification: SpySaveNotification) {
  const value = notification.createdAt?.toDate?.();
  if (!value) return "Just now";
  return value.toLocaleString();
}

export default function NotificationsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<SpySaveNotification[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setNotifications([]);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    return watchUserNotifications(user.uid, setNotifications, (watchError) =>
      setError(watchError.message),
    );
  }, [user]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  return (
    <main className="aurora-page min-h-screen px-5 py-6 text-[#13231f]">
      <ServiceMenu />
      <section className="mx-auto max-w-5xl">
        <section className="premium-panel app-primary-panel rounded-xl p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase text-[#3157d5]">
                Notification center
              </p>
              <h1 className="mt-2 text-4xl font-semibold">Competitor activity</h1>
              <p className="mt-2 text-sm font-semibold text-[#4f635d]">
                Checks from competitor tracking appear here before email delivery is connected.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-[#eef3ff] px-4 py-3 text-sm font-bold text-[#3157d5]">
              <Bell size={18} />
              {unreadCount} unread
            </span>
          </div>

          {error ? <p className="mt-4 text-sm font-bold text-[#b42318]">{error}</p> : null}

          <div className="mt-5 grid gap-3">
            {notifications.length ? (
              notifications.map((notification) => (
                <article
                  key={notification.id}
                  className={`rounded-xl border p-4 ${
                    notification.read
                      ? "border-[#d8e8e1] bg-white"
                      : "border-[#3157d5] bg-[#eff6ff]"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{notification.title}</p>
                      <p className="mt-1 text-sm font-semibold text-[#4f635d]">
                        {notification.competitorName} - {formatDate(notification)}
                      </p>
                    </div>
                    {!notification.read && notification.id ? (
                      <button
                        onClick={() => markNotificationRead(notification.id as string)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#bfdbfe] bg-white px-3 text-sm font-bold text-[#3157d5]"
                      >
                        <Check size={16} />
                        Mark read
                      </button>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-6">
                    {notification.message}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-[#d8e8e1] bg-white/70 p-8 text-center">
                <Bell className="mx-auto text-[#3157d5]" />
                <p className="mt-3 text-sm font-bold text-[#4f635d]">
                  No notifications yet. Run a competitor check to create the first one.
                </p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
