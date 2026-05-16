"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bell, BriefcaseBusiness, CheckCircle2, MessageCircle, Wallet } from "lucide-react";

type NotificationType = "booking" | "payment" | "message";

type CustomerNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  unread: boolean;
  href: string;
};

const seedNotifications: CustomerNotification[] = [
  {
    id: "ntf-1",
    type: "booking",
    title: "Booking confirmed",
    body: "Moshood accepted your plumbing request for Saturday.",
    createdAt: "2026-05-15T08:40:00.000Z",
    unread: true,
    href: "/customer/bookings/bk-1022",
  },
  {
    id: "ntf-2",
    type: "booking",
    title: "Booking declined",
    body: "Aisha is unavailable. No payment was taken. Find another artisan.",
    createdAt: "2026-05-14T17:10:00.000Z",
    unread: true,
    href: "/search",
  },
  {
    id: "ntf-3",
    type: "booking",
    title: "You have a quotation",
    body: "Moshood sent a quotation of N38,120 for your job. Review it.",
    createdAt: "2026-05-14T11:05:00.000Z",
    unread: true,
    href: "/customer/bookings/bk-1022/quotation",
  },
  {
    id: "ntf-4",
    type: "booking",
    title: "Revised quotation",
    body: "Moshood revised the quotation to N32,000. Review and respond.",
    createdAt: "2026-05-13T16:00:00.000Z",
    unread: false,
    href: "/customer/bookings/bk-1022/quotation",
  },
  {
    id: "ntf-5",
    type: "message",
    title: "New message from Moshood",
    body: "Moshood replied to your quotation query.",
    createdAt: "2026-05-13T13:00:00.000Z",
    unread: false,
    href: "/customer/bookings/bk-1022/quotation",
  },
  {
    id: "ntf-6",
    type: "payment",
    title: "Wallet funded",
    body: "N50,000 has been added to your Hajo wallet.",
    createdAt: "2026-05-12T10:00:00.000Z",
    unread: false,
    href: "/customer/wallet",
  },
  {
    id: "ntf-7",
    type: "booking",
    title: "Job marked complete",
    body: "Your booking with Moshood has been automatically completed.",
    createdAt: "2026-05-11T18:00:00.000Z",
    unread: false,
    href: "/customer/bookings/bk-1022",
  },
  {
    id: "ntf-8",
    type: "booking",
    title: "How was the job?",
    body: "Leave a review for Moshood to help other customers.",
    createdAt: "2026-05-10T19:30:00.000Z",
    unread: false,
    href: "/customer/bookings/bk-1022",
  },
];

function relativeTime(value: string) {
  const now = Date.now();
  const date = new Date(value).getTime();
  const diffMinutes = Math.max(1, Math.floor((now - date) / (1000 * 60)));

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return "Yesterday";
  }

  return `${diffDays} days ago`;
}

function iconForType(type: NotificationType) {
  if (type === "payment") {
    return Wallet;
  }

  if (type === "message") {
    return MessageCircle;
  }

  return BriefcaseBusiness;
}

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState(seedNotifications);
  const unreadCount = useMemo(() => notifications.filter((item) => item.unread).length, [notifications]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">Notifications</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setNotifications((current) => current.map((item) => ({ ...item, unread: false })))}
          className="rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 text-sm font-semibold text-[var(--foreground)]"
        >
          Mark all as read
        </button>
      </div>

      <section className="space-y-3">
        {notifications.map((item) => {
          const Icon = iconForType(item.type);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-start gap-3 rounded-lg border px-4 py-3 transition ${
                item.unread
                  ? "border-[var(--color-brand)]/40 bg-[#f0fdfa]"
                  : "border-[var(--color-line)] bg-white"
              }`}
            >
              <span className="mt-0.5 rounded-lg bg-[var(--color-surface)] p-2 text-[var(--color-brand)]">
                <Icon className="h-4 w-4" />
              </span>

              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm ${item.unread ? "font-bold text-[var(--foreground)]" : "font-semibold text-[var(--foreground)]"}`}>
                  {item.title}
                </p>
                <p className="mt-1 truncate text-sm text-[var(--color-ink-muted)]">{item.body}</p>
              </div>

              <div className="text-right">
                <p className="text-xs text-[var(--color-ink-muted)]">{relativeTime(item.createdAt)}</p>
                {item.unread ? (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[10px] font-semibold text-[#047857]">
                    <CheckCircle2 className="h-3 w-3" />
                    New
                  </span>
                ) : null}
              </div>
            </Link>
          );
        })}
      </section>

      {notifications.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--color-line)] px-4 py-12 text-center text-sm text-[var(--color-ink-muted)]">
          <Bell className="mx-auto mb-3 h-8 w-8 text-[var(--color-ink-muted)]" />
          No notifications yet.
        </div>
      ) : null}
    </div>
  );
}
