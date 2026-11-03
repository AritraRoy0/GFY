"use client";

import React from "react";
import { format } from "date-fns";
import { Bell, Clock3 } from "lucide-react";
import { EmptyState } from "../common/ui";
import { formatRelative } from "../common/format";

interface Notification {
  id: string;
  message: string;
  type: "info";
  timestamp: Date;
}

interface NotificationsProps {
  notifications: Notification[];
}

const Notifications: React.FC<NotificationsProps> = ({ notifications }) => {
  if (notifications.length === 0) {
    return <EmptyState icon={<Bell />} title="All caught up" description="Updates on your loan requests appear here." />;
  }

  const sorted = [...notifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <ol className="relative space-y-1">
      <span className="absolute bottom-3 left-[0.9375rem] top-3 w-px bg-line" aria-hidden="true" />
      {sorted.map((notification) => (
        <li key={notification.id} className="relative flex items-start gap-3 rounded-lg py-2.5 pr-2">
          <span className="relative z-10 mt-0.5 flex h-[1.875rem] w-[1.875rem] shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-warning">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-5 text-ink">{notification.message}</p>
            <time
              dateTime={notification.timestamp.toISOString()}
              title={format(notification.timestamp, "PP p")}
              className="num mt-1 block text-[11px] text-ink-muted"
            >
              {formatRelative(notification.timestamp)}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default Notifications;
