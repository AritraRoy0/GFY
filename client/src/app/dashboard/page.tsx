"use client";

import React from "react";
import Header from "../common/Header"; // Adjust the path to your Header component
import Footer from "../common/Footer"; // Adjust the path to your Footer component
import DashboardTable from "./DashboardTable"; // Import the dashboard table component
import Notifications from "./Notifications"; // Import the notifications component
import LoanProgress from "./LoanProgress";
import SummarySection from "./SummarySection";

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow w-full p-6 bg-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <section className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2 xl:col-span-3">
            <SummarySection />
          </section>
          <section className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2 xl:col-span-3">
            <DashboardTable />
          </section>
          <section className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-1 xl:col-span-1">
            <LoanProgress />
          </section>
          <section className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-1 xl:col-span-1">
            <Notifications />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};


// Make sure to export the page as the default export
export default DashboardPage;
