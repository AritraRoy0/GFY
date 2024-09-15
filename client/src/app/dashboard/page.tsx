// src/app/dashboard/page.tsx

'use client';

import Header from '../common/Header';  // Adjust the path to your Header component
import Footer from '../common/Footer';  // Adjust the path to your Footer component
import { DashboardTable } from './DashboardTable';  // Import the dashboard table component
import { Notifications } from './Notifications';  // Import the notifications component

// Remove the unused variable declaration
const DashboardPage = (): JSX.Element => {
  return (
    <div>
      <Header />
      <DashboardTable />
      <Notifications />
      <Footer />
    </div>
  );
};

// Make sure to export the page as the default export
export default DashboardPage;
