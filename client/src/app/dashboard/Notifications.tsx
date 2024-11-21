// src/components/Notifications.tsx

"use client";

import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { fetchUserLoanRequests } from "../models/LoanRequestAPIs";
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns"; // Ensure date-fns is installed

// Notification Interface
interface Notification {
  id: string;
  message: string;
  type: "info"; // Extend this union if you have other notification types
  timestamp: Date;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Fetch authenticated user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Fetch user's loan requests
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      setNotifications([]); // Clear notifications if no user is logged in
      return;
    }

    const unsubscribe = fetchUserLoanRequests(currentUser.uid, (loanRequests) => {
      if (loanRequests.length > 0) {
        // Sort loan requests by timestamp descending to get the latest
        const sortedRequests = [...loanRequests].sort((a, b) => {
          const dateA = convertToDate(a.timestamp);
          const dateB = convertToDate(b.timestamp);
          return dateB.getTime() - dateA.getTime();
        });

        // Create notifications for each loan request if needed
        const loanNotifications: Notification[] = sortedRequests.map((request) => ({
          id: `loan_${request.id}`, // Ensures unique ID by prefixing
          message: `Your loan request for $${request.principalAmount.toLocaleString()} is pending.`,
          type: "info",
          timestamp: convertToDate(request.timestamp),
        }));

        setNotifications(loanNotifications);
      } else {
        setNotifications([]); // No pending loan requests
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  /**
   * Converts a Timestamp | Date | null to a Date object.
   * If the input is null or invalid, returns the current date.
   * @param timestamp - The timestamp to convert.
   * @returns A Date object.
   */
  const convertToDate = (timestamp: Timestamp | Date | null): Date => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    } else if (timestamp instanceof Date) {
      return timestamp;
    } else {
      return new Date(); // Fallback to current date if invalid
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="text-gray-600 text-xl">Loading Notifications...</div>
        </div>
    );
  }

  return (
      <div className="bg-gray-50 p-6 flex flex-col items-center min-h-screen">
        <div className="max-w-3xl w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>
          {notifications.length > 0 ? (
              <ul className="space-y-4">
                {notifications.map((notification) => (
                    <li
                        key={notification.id}
                        className={`p-5 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center ${
                            notification.type === "info"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800" // Extend for other types if needed
                        }`}
                    >
                      <div className="flex-1">
                        <p className="font-semibold mb-2">{notification.message}</p>
                        <p className="text-sm text-gray-600">
                          {format(notification.timestamp, "PPpp")} {/* Using date-fns for formatting */}
                        </p>
                      </div>
                      {/* Optional: Add an icon for info type */}
                      <div className="mt-3 sm:mt-0 sm:ml-4">
                        {notification.type === "info" && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-blue-600"
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
                      </div>
                    </li>
                ))}
              </ul>
          ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-center text-gray-600 text-lg">
                  No notifications available.
                </p>
              </div>
          )}
        </div>
      </div>
  );
};

export default Notifications;
