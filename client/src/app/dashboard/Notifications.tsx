'use client';

// Notifications.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Define the shape of a notification
interface Notification {
  id: number;
  message: string;
  iconType: 'paymentDue' | 'loanCompleted' | 'newRequests';
}

// Mock notifications data with iconType
const mockNotifications: Notification[] = [
  {
    id: 1,
    message: 'Your loan #1 payment is due in 7 days.',
    iconType: 'paymentDue',
  },
  {
    id: 2,
    message: 'Loan #2 has been completed.',
    iconType: 'loanCompleted',
  },
  {
    id: 3,
    message: 'New loan requests available for funding.',
    iconType: 'newRequests',
  },
];

// Spinner Component
const Spinner: React.FC = () => (
  <div style={styles.centerScreen}>
    <div style={styles.spinner} aria-label="Loading"></div>
  </div>
);

// Payment Due Icon
const PaymentDueIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    style={{ ...styles.icon, ...style }}
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    {/* Example SVG Path for Payment Due */}
    <path d="M3 3h14v2H3V3zm0 4h14v2H3V7zm0 4h14v2H3v-2zm0 4h14v2H3v-2z" />
  </svg>
);

// Loan Completed Icon
const LoanCompletedIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    style={{ ...styles.icon, ...style }}
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    {/* Example SVG Path for Loan Completed */}
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-11.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

// New Requests Icon
const NewRequestsIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    style={{ ...styles.icon, ...style }}
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    {/* Example SVG Path for New Requests */}
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V7a1 1 0 10-2 0v.5H7a1 1 0 100 2h2.5V13a1 1 0 102 0V11.5H13a1 1 0 100-2h-2.5z"
      clipRule="evenodd"
    />
  </svg>
);

// Notification Item Component
interface NotificationItemProps {
  message: string;
  iconType: 'paymentDue' | 'loanCompleted' | 'newRequests';
}

const NotificationItem: React.FC<NotificationItemProps> = ({ message, iconType }) => {
  // Define color based on iconType
  const iconColor = (() => {
    switch (iconType) {
      case 'paymentDue':
        return '#F59E0B'; // Amber
      case 'loanCompleted':
        return '#10B981'; // Green
      case 'newRequests':
        return '#3B82F6'; // Blue
      default:
        return '#F59E0B';
    }
  })();

  // Select the appropriate icon based on iconType
  const renderIcon = () => {
    switch (iconType) {
      case 'paymentDue':
        return <PaymentDueIcon style={{ color: iconColor }} />;
      case 'loanCompleted':
        return <LoanCompletedIcon style={{ color: iconColor }} />;
      case 'newRequests':
        return <NewRequestsIcon style={{ color: iconColor }} />;
      default:
        return null;
    }
  };

  return (
    <li style={{ ...styles.notificationItem, borderLeftColor: iconColor }}>
      {renderIcon()}
      <span>{message}</span>
    </li>
  );
};

// Main Notifications Component
 const Notifications: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading delay or wait for user data
    if (typeof user !== 'undefined') {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <section style={styles.section}>
          <h1 style={styles.title}>Notifications</h1>
          {mockNotifications.length > 0 ? (
            <ul style={styles.notificationList}>
              {mockNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  message={notification.message}
                  iconType={notification.iconType}
                />
              ))}
            </ul>
          ) : (
            <p style={styles.noNotifications}>You have no notifications.</p>
          )}
        </section>
      </div>
    </div>
  );
};
// Styles Object
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
  },
  innerContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
  },
  section: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#000', // Changed color to black
    marginBottom: '1rem',
  },
  notificationList: {
    listStyleType: 'none',
    padding: 0,
  },
  notificationItem: {
    backgroundColor: '#FEF3C7',
    borderLeft: '4px solid #F59E0B', // Default color, will be overridden
    padding: '1rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    color: '#000', // Text color
  },
  icon: {
    width: '24px',
    height: '24px',
    color: '#F59E0B', // Default color, will be overridden
    marginRight: '1rem',
  },
  noNotifications: {
    color: '#000', // Changed color to black
  },
  centerScreen: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  spinner: {
    width: '64px',
    height: '64px',
    border: '8px solid #f3f3f3',
    borderTop: '8px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Inject Spinner Keyframes
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default Notifications;