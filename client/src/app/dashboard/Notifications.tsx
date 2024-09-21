import React, { useState, useEffect } from 'react';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: Date;
}

export const mockNotifications: Notification[] = [
  {
    id: 1,
    message: 'Your loan application has been approved.',
    type: 'success',
    timestamp: new Date(),
  },
  {
    id: 2,
    message: 'Your payment is due in 3 days.',
    type: 'warning',
    timestamp: new Date(),
  },
  {
    id: 3,
    message: 'Your profile has been updated successfully.',
    type: 'info',
    timestamp: new Date(),
  },
  {
    id: 4,
    message: 'Your loan application has been rejected.',
    type: 'error',
    timestamp: new Date(),
  },
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching notifications
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-black mb-4">Notifications</h1>
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-4 rounded-lg shadow-md ${
                  notification.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : notification.type === 'warning'
                    ? 'bg-yellow-100 text-yellow-800'
                    : notification.type === 'info'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <p className="font-semibold">{notification.message}</p>
                <p className="text-sm">{notification.timestamp.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;