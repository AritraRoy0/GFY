// components/AboutUs.tsx

import React from "react";
import { FaPercentage, FaRegMoneyBillAlt, FaShieldAlt, FaHandHoldingUsd } from "react-icons/fa";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Head from "next/head";

const AboutUs: React.FC = () => {
  return (
    <div>
      <Head>
        <title>About Us - Go Fund Yourself</title>
        <meta name="description" content="Invest with confidence and borrow with ease on our peer-to-peer lending platform." />
      </Head>
      <Header />

      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-extrabold mb-4">Invest with Confidence, Borrow with Ease</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              At <span className="font-semibold">Go Fund Yourself</span>, we provide an opportunity for investors to earn higher returns and give borrowers access to flexible, negotiable loans. Everyone wins.
            </p>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Lender Card 1 */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FaRegMoneyBillAlt className="text-green-500 dark:text-green-300 text-6xl mb-4 mx-auto" />
              <h3 className="text-2xl font-bold text-center mb-2">Earn Higher Returns</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Lend to individuals and enjoy returns that outpace traditional savings accounts or CDs.
              </p>
            </div>

            {/* Lender Card 2 */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FaPercentage className="text-blue-500 dark:text-blue-300 text-6xl mb-4 mx-auto" />
              <h3 className="text-2xl font-bold text-center mb-2">Control Your Interest Rates</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Set your own interest rates, giving you complete control over your investments and terms.
              </p>
            </div>

            {/* Lender Card 3 */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FaShieldAlt className="text-purple-500 dark:text-purple-300 text-6xl mb-4 mx-auto" />
              <h3 className="text-2xl font-bold text-center mb-2">Secure & Transparent</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Built-in escrow services and borrower verification ensure your funds are protected.
              </p>
            </div>

            {/* Borrower Card */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <FaHandHoldingUsd className="text-yellow-500 dark:text-yellow-300 text-6xl mb-4 mx-auto" />
              <h3 className="text-2xl font-bold text-center mb-2">Borrow with Flexibility</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Access flexible loans with negotiable terms and interest rates that suit your needs.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <p className="text-lg leading-7 max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
              Whether you're looking to lend or borrow, <span className="font-semibold">Go Fund Yourself</span> empowers you to take control of your financial future. Lenders enjoy higher returns, and borrowers gain access to affordable, flexible loans.
            </p>
            <p className="text-lg leading-7 mt-6 max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
              Start lending or borrowing today, and experience secure, transparent transactions with negotiable terms.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
