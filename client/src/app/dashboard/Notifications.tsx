// src/components/Notifications.tsx
"use client";
import React from "react";
import { format } from "date-fns";

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
	return (
		<div className="flex flex-row">
			<div className="max-w-xl w-full">
				<h1 className="text-xl font-semibold text-gray-800 mb-3">Notifications</h1>
				{notifications.length > 0 ? (
					<ul className="space-y-2">
						{notifications.map((notification) => (
							<li
								key={notification.id}
								className={`p-2 rounded-lg shadow-sm flex items-center justify-between space-x-2 ${
									notification.type === "info" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
								}`}
							>
								<div className="flex-1">
									<p className="font-semibold text-xs">{notification.message}</p>
									<p className="text-xxs text-gray-500">{format(notification.timestamp, "PPpp")}</p>
								</div>
								{notification.type === "info" && (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-blue-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.418-3.582 8-8 8a8 8 0 100-16 8 8 0 008 8z"
										/>
									</svg>
								)}
							</li>
						))}
					</ul>
				) : (
					<div className="flex justify-center items-center h-32">
						<p className="text-center text-gray-600 text-xs">No notifications available.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Notifications;
