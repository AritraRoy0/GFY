'use client';

import React from 'react';
import Header from '../common/Header'; // Adjust the import path as necessary
import Footer from '../common/Footer'; // Adjust the import path as necessary
import SummarySection from './SummarySection'; // Adjust the import path as necessary
import DashboardTable from './DashboardTable'; // Adjust the import path as necessary
import Notifications from './Notifications'; // Adjust the import path as necessary
import LoanProgress from './LoanProgress'; // Adjust the import path as necessary

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-column w-full p-6">
        <div className="flex-col">
          <section className="bg-white p-6 rounded-lg shadow-md">
            <SummarySection />
          </section>
          <section className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <DashboardTable />
          </section>
          <section className="bg-white p-6 rounded-lg shadow-md">
            <Notifications />
          </section>
          <section className="bg-white p-6 rounded-lg shadow-md">
            <LoanProgress />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;