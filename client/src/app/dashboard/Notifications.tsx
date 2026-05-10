"use client";

import React from "react";
import { format } from "date-fns";
import { Bell, Info } from "lucide-react";

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
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <Bell className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
        <p className="mt-4 text-sm font-semibold text-slate-800">No notifications</p>
        <p className="mt-1 text-sm text-slate-500">Loan request updates will appear here.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {notifications.map((notification) => (
        <li key={notification.id} className="flex items-start gap-3 py-4">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-700">
            <Info className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900">{notification.message}</p>
            <p className="mt-1 text-xs text-slate-500">{format(notification.timestamp, "PP p")}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Notifications;
