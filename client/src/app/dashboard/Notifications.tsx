// Notifications.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Mock notifications data
const mockNotifications: string[] = [
  'Your loan #1 payment is due in 7 days.',
  'Loan #2 has been completed.',
  'New loan requests available for funding.',
];

// Spinner Component
const Spinner: React.FC = () => (
  <div style={styles.centerScreen}>
    <div style={styles.spinner} aria-label="Loading"></div>
  </div>
);

// Notification Item Component
interface NotificationItemProps {
  message: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ message }) => (
  <li style={styles.notificationItem}>
    <svg
      style={styles.icon}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.766-1.36 2.68-1.36 3.446 0l5.857 
           10.417C18.12 14.876 17.184 16 15.857 16H4.143c-1.327 
           0-2.263-1.124-1.703-2.484L8.257 3.1zM11 
           14a1 1 0 11-2 0 1 1 0 012 0zm-1-4a1 1 0 
           00-.993.883L9 11v2a1 1 0 
           001.993.117L11 13v-2a1 1 0 
           00-1-1z"
        clipRule="evenodd"
      />
    </svg>
    <span>{message}</span>
  </li>
);

// Main Notifications Component
export const Notifications: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Once user state is defined, stop loading
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
              {mockNotifications.map((notification, index) => (
                <NotificationItem key={index} message={notification} />
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

export default Notifications;

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
    borderLeft: '4px solid #F59E0B',
    padding: '1rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    color: '#000', // Added color to make text black
  },
  icon: {
    width: '24px',
    height: '24px',
    color: '#F59E0B',
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
const keyframes =
  `@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
