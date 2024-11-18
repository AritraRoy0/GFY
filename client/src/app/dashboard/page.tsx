'use client';

import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import SummarySection from './SummarySection';
import DashboardTable from './DashboardTable';
import Notifications from './Notifications';
import LoanProgress from './LoanProgress';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-full p-4 md:p-6">
        <div className="flex flex-col space-y-4">
          <section className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <SummarySection />
          </section>
          <section className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <DashboardTable />
          </section>
          <section className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <Notifications />
          </section>
          <section className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <LoanProgress />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
