'use client';

import React from 'react';
import Header from '../common/Header';  // Adjust the path to your Header component
import Footer from '../common/Footer';  // Adjust the path to your Footer component
import  DashboardTable  from './DashboardTable';  // Import the dashboard table component
import  Notifications  from './Notifications';  // Import the notifications component
import LoanProgress from './LoanProgress';
import SummarySection from './SummarySection';

// Remove the unused variable declaration
const DashboardPage: React.FC = () => {
  return (
    <div>
      <Header />
      <SummarySection />
      <DashboardTable />
      <LoanProgress />
      <Notifications />
      <Footer />
    </div>
  );
};

// Make sure to export the page as the default export
export default DashboardPage;
