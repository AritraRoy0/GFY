// src/components/LandingPage.tsx

"use client";

import React, {useState, useEffect} from "react";
import {
	FaUsers,
	FaHandsHelping,
	FaShieldAlt,
	FaBolt,
	FaHeartbeat,
	FaStore,
	FaCreditCard,
	FaIdBadge,
	FaCheckCircle,
	FaMoneyCheckAlt,
	FaClipboardList,
	FaRegListAlt,
} from "react-icons/fa";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Head from "next/head";
import Image from "next/image";
import LoanTerminal from "./common/LoanTerminal";

// Import API functions
import {
	fetchLoanRequests,
} from "./models/LoanRequestAPIs"; // Adjust the path as needed

import { Loan, LoanRequest} from "./models/LoanInterfaces";

import {
	fetchLoans
} from "./models/LoanAPIs"


// Hero Component without animations
const Hero: React.FC = () => {
	return (
		<div className="relative bg-gradient-to-br from-gray-800 to-gray-900 text-white py-24 px-6 overflow-hidden">
			{/* Content */}
			<div className="relative max-w-4xl mx-auto text-center z-10">
				{/* Hero Heading */}
				<h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-tight">
					Go Fund Yourself!!
				</h1>

				{/* Hero Subheading */}
				<h2 className="text-3xl md:text-5xl font-semibold mb-6 text-gray-200">
					Where you can do you
				</h2>

				{/* Hero Subtitle */}
				<p className="text-lg md:text-xl mb-10 text-gray-300">
					Instant, negotiable loans without bank approval over our secure network
					of peers.
				</p>

				{/* Get Started Button */}
				<a
					href="/auth"
					className="inline-block bg-gray-700 text-white font-semibold py-4 px-10 rounded-full shadow-lg hover:bg-gray-600 transition duration-300 text-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
					aria-label="Get Started"
				>
					Get Started
				</a>
			</div>
		</div>
	);
};

// Features Component without animations
const Features: React.FC = () => {
	const features = [
		{
			title: "Peer-to-Peer Lending",
			icon: <FaUsers className="text-gray-700 text-7xl mx-auto mb-6"/>,
			details: (
				<>
					<p className="text-gray-600 mb-4">
						Our platform enables <strong>direct connections</strong> between
						lenders and borrowers, eliminating the need for traditional banking
						intermediaries. This means you can <strong>save on fees</strong> and
						enjoy <strong>better rates</strong>.
					</p>
					<p className="text-gray-600">
						By fostering a community-driven approach, we ensure that both
						parties benefit from <strong>transparent</strong> and{" "}
						<strong>fair transactions</strong>.
					</p>
				</>
			),
		},
		{
			title: "Flexible & Customizable",
			icon: (
				<FaHandsHelping className="text-gray-700 text-7xl mx-auto mb-6"/>
			),
			details: (
				<>
					<p className="text-gray-600 mb-4">
						Take control of your financial agreements by{" "}
						<strong>negotiating terms</strong> that meet your specific needs.
						Our platform allows for <strong>customizable interest rates</strong>{" "}
						and loan durations.
					</p>
					<p className="text-gray-600">
						This flexibility ensures that both lenders and borrowers can find
						mutually beneficial arrangements.
					</p>
				</>
			),
		},
		{
			title: "Secure & Transparent",
			icon: <FaShieldAlt className="text-gray-700 text-7xl mx-auto mb-6"/>,
			details: (
				<>
					<p className="text-gray-600 mb-4">
						Your security is our priority. We offer{" "}
						<strong>built-in escrow services</strong> that protect both parties
						during transactions.
					</p>
					<p className="text-gray-600">
						Our platform uses advanced encryption and{" "}
						<strong>security protocols</strong> to ensure your data and funds
						are always safe.
					</p>
				</>
			),
		},
		{
			title: "Fast Transactions",
			icon: <FaBolt className="text-gray-700 text-7xl mx-auto mb-6"/>,
			details: (
				<>
					<p className="text-gray-600 mb-4">
						Say goodbye to lengthy approval processes. Our platform offers{" "}
						<strong>quick approvals</strong> so you can access funds or start
						lending without delay.
					</p>
					<p className="text-gray-600">
						Enjoy <strong>instant transactions</strong> with minimal fees,
						thanking to our efficient technology infrastructure.
					</p>
				</>
			),
		},
	];

	return (
		<section className="py-20 px-6 bg-gray-200">
			<div className="max-w-7xl mx-auto text-center">
				<h2 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-12">
					Why choose to
				</h2>
				<h2 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-12">
					Go Fund Yourself?
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
					{features.map((feature, index) => (
						<div
							key={index}
							className="bg-white shadow-md rounded-lg p-8 hover:shadow-2xl transition duration-500 cursor-pointer"
							aria-labelledby={`feature-${index}-title`}
						>
							<div className="mb-6">{feature.icon}</div>
							<h3
								id={`feature-${index}-title`}
								className="text-3xl font-semibold mb-4 text-gray-800"
							>
								{feature.title}
							</h3>
							{/* Optionally, you can add brief details here */}
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

// Statistics Component without animations
const Stats: React.FC = () => {
	const [totalLoanVolume, setTotalLoanVolume] = useState<number>(0);
	const [totalInterestEarned, setTotalInterestEarned] = useState<number>(0);
	const [totalLoans, setTotalLoans] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Temporary storage for loans and loan requests
	const [loans, setLoans] = useState<Loan[]>([]);
	const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);

	// Fetch loans data using API
	useEffect(() => {
		const unsubscribeLoans = fetchLoans(
			(fetchedLoans) => {
				setLoans(fetchedLoans);
			},
			(error) => {
				setError("Failed to load loans.");
				console.error(error);
			}
		);

		return () => unsubscribeLoans();
	}, []);

	// Fetch loan requests data using API
	useEffect(() => {
		const unsubscribeLoanRequests = fetchLoanRequests(
			(fetchedLoanRequests) => {
				setLoanRequests(fetchedLoanRequests);
			},
			(error) => {
				setError("Failed to load loan requests.");
				console.error(error);
			}
		);

		return () => unsubscribeLoanRequests();
	}, []);

	// Aggregate data once both loans and loan requests are fetched
	useEffect(() => {
		if (loans.length === 0 && loanRequests.length === 0) {
			// Assuming there's at least one loan or loan request
			setLoading(true);
			return;
		}

		// Calculate Total Loan Volume
		const loanVolume = loans.reduce((acc, loan) => acc + loan.principalAmount, 0);
		setTotalLoanVolume(loanVolume);

		// Calculate Total Interest Earned
		const interestEarnedLoans = loans.reduce(
			(acc, loan) => acc + loan.principalAmount * loan.interestRate / 100,
			0
		);

		setTotalInterestEarned(interestEarnedLoans);

		// Calculate Total Loans
		setTotalLoans(loans.length + loanRequests.length);

		setLoading(false);
	}, [loans, loanRequests]);

	if (loading) {
		return (
			<section className="py-20 px-6 bg-white">
				<div className="max-w-7xl mx-auto text-center">
					<h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-12">
						Platform Statistics
					</h2>
					<p className="text-gray-600">Loading statistics...</p>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="py-20 px-6 bg-white">
				<div className="max-w-7xl mx-auto text-center">
					<h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-12">
						Platform Statistics
					</h2>
					<p className="text-red-600">{error}</p>
				</div>
			</section>
		);
	}

	return (
		<section className="py-20 px-6 bg-white">
			<div className="max-w-7xl mx-auto text-center">
				<h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-12">
					Platform Statistics
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
					{/* Total Loan Volume */}
					<div className="bg-gray-100 p-8 rounded-lg shadow-md">
						<FaMoneyCheckAlt className="text-blue-600 w-12 h-12 mx-auto mb-4"/>
						<p className="text-3xl font-bold text-gray-800">
							${totalLoanVolume.toLocaleString() + "+"}

						</p>
						<p className="text-gray-600 mt-2">Total Loan Volume</p>
					</div>

					{/* Total Interest Earned */}
					<div className="bg-gray-100 p-8 rounded-lg shadow-md">
						<FaClipboardList className="text-green-600 w-12 h-12 mx-auto mb-4"/>
						<p className="text-3xl font-bold text-gray-800">
							${totalInterestEarned.toLocaleString() + "+"}
						</p>
						<p className="text-gray-600 mt-2">Total Interest Earned</p>
					</div>

					{/* Total Loans (Loans + Loan Requests) */}
					<div className="bg-gray-100 p-8 rounded-lg shadow-md">
						<FaRegListAlt className="text-purple-600 w-12 h-12 mx-auto mb-4"/>
						<p className="text-3xl font-bold text-gray-800">
							{totalLoans.toLocaleString() + "+"}
						</p>
						<p className="text-gray-600 mt-2">Total Loans</p>
					</div>
				</div>
			</div>
		</section>
	);
};



import React, { useEffect, useState } from "react";
import { fetchLoans } from "../models/LoanAPIs"; // Importing the helper function to fetch loans

/**
 * The Stats component is responsible for calculating and displaying key platform statistics.
 * It focuses on two metrics:
 * 1. National Interest Rate: A hardcoded value representing the general market rate.
 * 2. Platform Average APR: Dynamically calculated by averaging interest rates from loans in the database.
 *
 * Note: This component handles calculations and backend interactions, leaving UI/animations to the frontend team.
 */
const Stats: React.FC = () => {
  // Hardcoded value for the national interest rate (static for now; can be made dynamic if needed)
  const NATIONAL_INTEREST_RATE = 4.33; // As of Jan. 11, 2025

  // State to store the calculated Platform Average APR
  const [platformAverage, setPlatformAverage] = useState<number | null>(null);

  // State to handle the loading status while data is being fetched
  const [loading, setLoading] = useState(true);

  /**
   * Fetch and calculate the Platform Average APR.
   * This uses the `fetchLoans` helper function to retrieve all loans from the Firestore database.
   */
  useEffect(() => {
    // Define an async function to fetch loans and calculate the average APR
    const fetchPlatformAverage = async () => {
      try {
        // Step 1: Fetch all loans from Firestore using the helper function
        fetchLoans(
          (loans) => {
            console.log("Raw Loan Data:", loans); // Log raw loan data for debugging purposes

            // Step 2: Check if there are any loans returned
            if (loans.length > 0) {
              // Step 3: Calculate the total interest rate from all loans
              const totalInterestRate = loans.reduce((sum, loan) => {
                return sum + (loan.interestRate || 0); // Add interest rate, default to 0 if undefined
              }, 0);

              // Step 4: Calculate the average APR by dividing the total interest rate by the number of loans
              const averageAPR = totalInterestRate / loans.length;

              console.log("Platform Average APR:", averageAPR); // Log the calculated APR for verification

              // Step 5: Update the state with the calculated average APR
              setPlatformAverage(averageAPR);
            } else {
              // Handle the case where no loans are present in the database
              console.log("No loans found.");
              setPlatformAverage(0); // Default to 0 if no loans exist
            }
          },
          (error) => {
            // Handle errors during data fetching
            console.error("Error fetching loans:", error);
            setPlatformAverage(null); // Set to null to indicate failure
          }
        );
      } catch (error) {
        // Catch and log unexpected errors (e.g., network issues)
        console.error("Unexpected error:", error);
        setPlatformAverage(null); // Set to null to indicate failure
      } finally {
        // Ensure the loading state is turned off once processing is complete
        setLoading(false);
      }
    };

    // Invoke the data-fetching function
    fetchPlatformAverage();
  }, []); // The empty dependency array ensures this runs only once when the component mounts

  /**
   * Render the loading state if data is still being fetched.
   */
  if (loading) {
    return (
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-12">
            Platform Statistics
          </h2>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </section>
    );
  }

  /**
   * Render the calculated statistics once data has been fetched and processed.
   * Display:
   * 1. National Interest Rate
   * 2. Platform Average APR
   */
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-12">
          Platform Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* National Interest Rate */}
          <div className="bg-gray-100 p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">National Interest Rate</h3>
            <p className="text-3xl font-bold text-blue-600">{NATIONAL_INTEREST_RATE}%</p>
          </div>

          {/* Platform Average APR */}
          <div className="bg-gray-100 p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">Platform Average APR</h3>
            <p className="text-3xl font-bold text-green-600">
              {platformAverage !== null ? `${platformAverage.toFixed(2)}%` : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;





// Testimonials Component without animations
const Testimonials: React.FC = () => {
	const testimonials = [
		{
			name: "Carlos M.",
			title: "Nurse",
			quote:
				"When unexpected medical bills came up, Go Fund Yourself helped me get the funds I needed quickly and stress-free.",
			icon: <FaHeartbeat className="text-gray-700 w-full h-full"/>,
		},
		{
			name: "Emily R.",
			title: "Small Business Owner",
			quote:
				"Thanks to Go Fund Yourself, I secured a loan to start my own coffee shop. The peer-to-peer lending made it possible!",
			icon: <FaStore className="text-gray-700 w-full h-full"/>,
		},
		{
			name: "Sophia L.",
			title: "Graduate Student",
			quote:
				"I consolidated my credit card debt with a flexible loan from Go Fund Yourself. The process was seamless!",
			icon: <FaCreditCard className="text-gray-700 w-full h-full"/>,
		},
	];

	return (
		<section className="py-20 px-6 bg-gray-100">
			<div className="max-w-7xl mx-auto text-center">
				<h2 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-12">
					What Our Users Say
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
					{testimonials.map((testimonial, index) => (
						<div key={index} className="bg-gray-50 shadow-md rounded-lg p-8">
							<div className="w-24 h-24 mx-auto mb-6">{testimonial.icon}</div>
							<p className="italic text-gray-600 mb-6">
								&quot;{testimonial.quote}&quot;
							</p>
							<h4 className="text-2xl font-semibold text-gray-800">
								{testimonial.name}
							</h4>
							<p className="text-gray-500">{testimonial.title}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

// Call to Action Component without animations
const CallToAction: React.FC = () => {
	return (
		<section className="py-20 px-6 bg-gray-800 text-white">
			<div className="max-w-7xl mx-auto text-center">
				<h2 className="text-5xl md:text-6xl font-extrabold mb-8">
					Ready to Get Started?
				</h2>

				<p className="text-2xl md:text-3xl mb-10">
					Join Go Fund Yourself today and take control of your financial future.
				</p>
				<a
					href="/auth"
					className="inline-block bg-gray-700 text-white font-semibold py-5 px-16 rounded-full shadow-lg hover:bg-gray-600 transition duration-300 text-2xl focus:outline-none focus:ring-2 focus:ring-gray-500"
					aria-label="Join Now"
				>
					Join Now
				</a>
			</div>
		</section>
	);
};

// PoweredBy Component without animations
const PoweredBy: React.FC = () => {
	// Define the features to display
	const features = [
		{
			name: "Google",
			href: "https://google.com/",
			iconPath: "/google.svg",
			ariaLabel: "Google",
		},
		{
			name: "Identity Verification",
			href: "#",
			icon: <FaIdBadge className="text-blue-600 w-12 h-12 mx-auto mb-4"/>,
			ariaLabel: "Stripe Identity Verification",
		},
		{
			name: "Stripe",
			href: "https://stripe.com/",
			iconPath: "/stripe.svg",
			ariaLabel: "Stripe",
		},
		{
			name: "Repayment Guarantee",
			href: "#",
			icon: <FaCheckCircle className="text-green-600 w-12 h-12 mx-auto mb-4"/>,
			ariaLabel: "Money Repayment Guarantees",
		},
	];

	return (
		<div className="container flex-grow mx-auto py-12 bg-gray-50 dark:bg-gray-800">
			<h2 className="text-center text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">
				Powered By
			</h2>
			<div className="flex flex-wrap items-center justify-center gap-10">
				{features.map((feature, index) => (
					<a
						key={index}
						href={feature.href}
						aria-label={feature.ariaLabel}
						className="group"
						target="_blank"
						rel="noopener noreferrer"
					>
						{/* For Image-based features like Google and Stripe */}
						{feature.iconPath ? (
							<div className="relative w-16 h-16">
								<Image
									src={feature.iconPath}
									alt={feature.name}
									fill
									style={{objectFit: "contain"}}
									className="transition-transform duration-300 group-hover:scale-110"
								/>
							</div>
						) : (
							// For Icon-based features like Identity Verification and Repayment Guarantee
							<div className="transition-transform duration-300 group-hover:scale-110">
								{feature.icon}
								<span className="mt-2 block text-gray-700 dark:text-gray-300 text-sm">
									{feature.name}
								</span>
							</div>
						)}
					</a>
				))}
			</div>
		</div>
	);
};

// Main Landing Page Component
const LandingPage: React.FC = () => {
	return (
		<>
			<Head>
				<title>Go Fund Yourself!!</title>
				<meta
					name="description"
					content="Instant, negotiable loans without bank approval over our secure network of peers."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1"/>
			</Head>
			<Header/>
			<Hero/>
			<LoanTerminal/>
			<Stats/> {/* Integrated Stats Component */}
			<Features/>
			<PoweredBy/>
			<Testimonials/>
			<CallToAction/>
			<Footer/>
		</>
	);
};

export default LandingPage;
