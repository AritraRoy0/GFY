"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebaseConfig";
import { fetchBorrowedLoans } from "../models/LoanAPIs";
import { Loan } from "../models/LoanInterfaces";

interface LendeeProfileData {
  id: string;
  name: string;
  email: string;
  username: string;
}

const OtherLendeeProfile: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Extract ID from URL params

  const [lendeeData, setLendeeData] = useState<LendeeProfileData | null>(null);
  const [borrowedLoans, setBorrowedLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the user's profile data from Firestore
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchLendeeData = async () => {
      try {
        const docRef = doc(firestore, "users", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // Assumes document data has name, email and username fields.
          const data = docSnap.data() as Omit<LendeeProfileData, "id">;
          setLendeeData({ id, ...data });
        } else {
          console.error("No such user document!");
        }
      } catch (error) {
        console.error("Error fetching lendee data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLendeeData();
  }, [id]);

  // Fetch borrowed loans for this user using the provided API call
  useEffect(() => {
    if (!id) return;

    const unsubscribe = fetchBorrowedLoans(
      id,
      setBorrowedLoans,
      (error: unknown) => console.error("Error fetching borrowed loans:", error)
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Lendee Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-xl text-white p-8 mb-12"
          >
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-4xl font-bold">
                {lendeeData?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{lendeeData?.name || "Unknown User"}</h1>
                <p className="text-lg opacity-90">@{lendeeData?.username || "NoUsername"}</p>
              </div>
            </div>
          </motion.div>

          {/* Lendee Public Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Borrower Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  {/* Email Icon */}
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{lendeeData?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Borrowed Loans Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Borrowing History</h3>
            {borrowedLoans.length === 0 ? (
              <p className="text-gray-500">No loans borrowed by this user.</p>
            ) : (
              <div className="space-y-4">
                {borrowedLoans.map((loan) => (
                  <div key={loan.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-700 font-medium">
                          Loan Amount: <span className="text-gray-900 font-bold">${loan.principalAmount}</span>
                        </p>
                        <p className="text-gray-500 text-sm">Interest Rate: {loan.interestRate}%</p>
                        <p className="text-gray-500 text-sm">Term: {loan.termWeeks} weeks</p>
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${loan.paymentsMade ? "text-green-600" : "text-red-600"}`}>
                          {loan.paymentsMade ? "Paid" : "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OtherLendeeProfile;
