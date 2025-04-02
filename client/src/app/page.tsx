// src/components/LandingPage.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaUsers, FaHandsHelping, FaShieldAlt, FaBolt, FaHeartbeat, FaStore, FaCreditCard, FaIdBadge, FaCheckCircle, FaMoneyCheckAlt, FaClipboardList, FaRegListAlt } from "react-icons/fa";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Head from "next/head";
import LoanTerminal from "./common/LoanTerminal";
import { fetchLoans } from "./models/LoanAPIs";
import { Loan, LoanRequest } from "./models/LoanInterfaces";
import Image from "next/image";

const fadeInUp = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

const stagger = {
	visible: { transition: { staggerChildren: 0.1 } }
};

const Hero = () => {
	const { scrollY } = useScroll();
	const y1 = useTransform(scrollY, [0, 500], [0, 100]);

	return (
		<div className="relative bg-indigo-900 text-white py-32 px-6 overflow-hidden">
			<motion.div 
				className="absolute inset-0 opacity-20" 
				style={{ y: y1 }}
				animate={{ 
					backgroundPosition: ["0% 0%", "100% 100%"] 
				}}
				transition={{ 
					duration: 20, 
					repeat: Infinity, 
					repeatType: "reverse" 
				}}
			>
				<div className="w-full h-full bg-[url('/assets/grid-pattern.svg')]" />
			</motion.div>

			<div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-purple-800/30 to-transparent" />
			
			<motion.div
				className="relative max-w-7xl mx-auto z-10 flex flex-col md:flex-row items-center"
				initial="hidden"
				animate="visible"
				variants={stagger}
			>
				<div className="md:w-3/5 text-left md:pr-12">
					<motion.h1
						className="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
						variants={fadeInUp}
					>
						Go Fund Yourself
					</motion.h1>

					<motion.h2
						className="text-2xl md:text-3xl font-medium mb-8 text-purple-200"
						variants={fadeInUp}
					>
						Financial freedom on your terms
					</motion.h2>

					<motion.p className="text-lg md:text-xl mb-10 text-indigo-100" variants={fadeInUp}>
						Instant, negotiable loans without bank approval over our secure network of peers.
					</motion.p>

					<motion.div variants={fadeInUp} className="flex gap-4">
						<a
							href="/auth"
							className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-4 px-8 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-purple-500/30"
						>
							Get Started →
						</a>
						<a
							href="#features"
							className="inline-block bg-transparent border border-purple-400 text-purple-200 hover:bg-purple-800/20 font-medium py-4 px-8 rounded-lg transition-all duration-300"
						>
							Learn More
						</a>
					</motion.div>
				</div>
				
				<motion.div 
					className="md:w-2/5 mt-12 md:mt-0"
					variants={fadeInUp}
				>
					<div className="bg-indigo-800/50 backdrop-blur-sm p-6 rounded-2xl border border-indigo-700/50 shadow-2xl">
						<LoanTerminal />
					</div>
				</motion.div>
			</motion.div>
			
			<div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-indigo-900 to-transparent" />
		</div>
	);
};

const Features = () => {
	const features = [
		{
			title: "Peer-to-Peer Lending",
			icon: <FaUsers className="w-8 h-8 text-emerald-400" />,
			bg: "bg-gray-900",
		},
		{
			title: "Flexible & Customizable",
			icon: <FaHandsHelping className="w-8 h-8 text-cyan-400" />,
			bg: "bg-gray-900",
		},
		{
			title: "Secure & Transparent",
			icon: <FaShieldAlt className="w-8 h-8 text-emerald-400" />,
			bg: "bg-gray-900",
		},
		{
			title: "Fast Transactions",
			icon: <FaBolt className="w-8 h-8 text-cyan-400" />,
			bg: "bg-gray-900",
		},
	];

	return (
		<section className="py-20 px-6 bg-gray-950">
			<div className="max-w-7xl mx-auto">
				<motion.div className="text-center mb-20" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
						Why choose to Go Fund Yourself?
					</h2>
					<p className="text-lg text-gray-400 max-w-2xl mx-auto">
						Take control of your financial agreements with our community-driven platform
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((feature, index) => (
						<motion.div
							key={index}
							variants={fadeInUp}
							initial="hidden"
							whileInView="visible"
							className={`${feature.bg} p-8 rounded-xl border border-gray-800 hover:border-emerald-400/30 transition-colors`}
						>
							<div className="mb-6">{feature.icon}</div>
							<h3 className="text-2xl font-semibold text-gray-100 mb-4">
								{feature.title}
							</h3>
							<p className="text-gray-400">
								{feature.title === "Peer-to-Peer Lending" && "Direct connections between lenders and borrowers with transparent transactions"}
								{feature.title === "Flexible & Customizable" && "Negotiate terms that meet your specific financial needs"}
								{feature.title === "Secure & Transparent" && "Built-in escrow services and advanced security protocols"}
								{feature.title === "Fast Transactions" && "Quick approvals and instant transactions with minimal fees"}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

const Stats = () => {
	const [totalLoanVolume, setTotalLoanVolume] = useState<number>(0);
	const [totalInterestEarned, setTotalInterestEarned] = useState<number>(0);
	const [totalLoans, setTotalLoans] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [loans, setLoans] = useState<Loan[]>([]);
	const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);

	useEffect(() => {
		const unsubscribeLoans = fetchLoans(
			(fetchedLoans) => setLoans(fetchedLoans),
			(error) => setError("Failed to load loans.")
		);


		return () => {
			unsubscribeLoans();
		};
	}, []);

	useEffect(() => {
		if (loans.length > 0 || loanRequests.length > 0) {
			const loanVolume = loans.reduce((acc, loan) => acc + loan.principalAmount, 0);
			const interestEarned = loans.reduce((acc, loan) => acc + (loan.principalAmount * loan.interestRate) / 100, 0);

			setTotalLoanVolume(loanVolume);
			setTotalInterestEarned(interestEarned);
			setTotalLoans(loans.length + loanRequests.length);
			setLoading(false);
		}
	}, [loans, loanRequests]);

	if (loading) return <div className="text-center py-20">Loading statistics...</div>;
	if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

	return (
		<section className="py-20 bg-gray-900">
			<div className="max-w-7xl mx-auto px-6">
				<motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
					<h2 className="text-4xl font-bold text-gray-100 mb-4">Platform Statistics</h2>
					<p className="text-lg text-gray-400">Real-time financial insights</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<motion.div variants={fadeInUp} initial="hidden" whileInView="visible" className="p-8 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700">
						<FaMoneyCheckAlt className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
						<div className="text-4xl font-bold text-gray-100 mb-2">
							${totalLoanVolume.toLocaleString()}+
						</div>
						<div className="text-lg text-gray-400">Total Loan Volume</div>
					</motion.div>

					<motion.div variants={fadeInUp} initial="hidden" whileInView="visible" className="p-8 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700">
						<FaClipboardList className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
						<div className="text-4xl font-bold text-gray-100 mb-2">
							${totalInterestEarned.toLocaleString()}+
						</div>
						<div className="text-lg text-gray-400">Total Interest Earned</div>
					</motion.div>

					<motion.div variants={fadeInUp} initial="hidden" whileInView="visible" className="p-8 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700">
						<FaRegListAlt className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
						<div className="text-4xl font-bold text-gray-100 mb-2">
							{totalLoans.toLocaleString()}+
						</div>
						<div className="text-lg text-gray-400">Total Loans</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

const Testimonials = () => {
	const testimonials = [
		{
			name: "Carlos M.",
			role: "Nurse",
			text: "When unexpected medical bills came up, Go Fund Yourself helped me get the funds quickly and stress-free.",
			initial: "C",
			icon: <FaHeartbeat className="w-full h-full" />,
		},
		{
			name: "Emily R.",
			role: "Business Owner",
			text: "Secured a loan to start my coffee shop through peer-to-peer lending. Made it possible!",
			initial: "E",
			icon: <FaStore className="w-full h-full" />,
		},
		{
			name: "Sophia L.",
			role: "Student",
			text: "Consolidated my credit card debt with a flexible loan. The process was seamless!",
			initial: "S",
			icon: <FaCreditCard className="w-full h-full" />,
		},
	];

	return (
		<section className="py-20 bg-gray-950">
			<div className="max-w-7xl mx-auto px-6">
				<motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
					<h2 className="text-4xl font-bold text-gray-100 mb-4">What Our Users Say</h2>
					<p className="text-lg text-gray-400">Verified community experiences</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={index}
							variants={fadeInUp}
							initial="hidden"
							whileInView="visible"
							className="p-8 rounded-xl bg-gray-900 border border-gray-800 hover:border-emerald-400/20 transition-colors"
						>
							<div className="flex items-center mb-6">
								<div className="w-12 h-12 rounded-full bg-emerald-400/10 flex items-center justify-center">
									{testimonial.icon}
								</div>
								<div className="ml-4">
									<div className="font-medium text-gray-100">{testimonial.name}</div>
									<div className="text-sm text-gray-400">{testimonial.role}</div>
								</div>
							</div>
							<p className="text-gray-300 italic">&quot{testimonial.text}&quot</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

const PoweredBy = () => {
	const partners = [
		{ name: "Google", logo: "/google.svg" },
		{ name: "Stripe", logo: "/stripe.svg" },
		{ name: "Identity Verification", icon: <FaIdBadge className="text-blue-400" /> },
		{ name: "Repayment Guarantee", icon: <FaCheckCircle className="text-green-400" /> },
	];

	return (
		<section className="py-20 bg-gray-900">
			<div className="max-w-7xl mx-auto px-6 text-center">
				<motion.h2 className="text-3xl font-bold text-gray-100 mb-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
					Powered By
				</motion.h2>
				<div className="flex flex-wrap justify-center gap-12">
					{partners.map((partner, index) => (
						<motion.div
							key={index}
							className="flex items-center justify-center"
							variants={fadeInUp}
							initial="hidden"
							whileInView="visible"
						>
							{partner.logo ? (
								<Image
									src={partner.logo}
									alt={partner.name}
									width={80}
									height={80}
									className="object-contain grayscale hover:grayscale-0 transition-all"
								/>
							) : (
								<div className="text-4xl">
									{partner.icon}
									<p className="text-sm text-gray-400 mt-2">{partner.name}</p>
								</div>
							)}
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

const CallToAction = () => {
	return (
		<section className="relative py-32 bg-gray-800">
			<div className="relative max-w-7xl mx-auto px-6 text-center">
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					whileInView={{ scale: 1, opacity: 1 }}
					className="inline-block p-8 rounded-2xl bg-gray-700/30 backdrop-blur-sm border border-gray-600"
				>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
						Ready to Get Started?
					</h2>
					<p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
						Join Go Fund Yourself today and take control of your financial future
					</p>
					<div className="flex justify-center gap-4">
						<a
							href="/auth"
							className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-lg font-medium transition-colors shadow-xl hover:shadow-emerald-900/20"
						>
							Join Now
						</a>
						<a
							href="/about"
							className="border-2 border-gray-600 hover:border-emerald-400/30 text-gray-300 hover:text-white px-8 py-4 rounded-lg font-medium transition-all"
						>
							Learn More
						</a>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

const LandingPage = () => {
	return (
		<>
			<Head>
				<title>Go Fund Yourself!! - Peer-to-Peer Lending Platform</title>
				<meta name="description" content="Instant, negotiable loans without bank approval over our secure network of peers." />
			</Head>

			<Header />
			<Hero />
			<LoanTerminal />
			<Stats />
			<Features />
			<PoweredBy />
			<Testimonials />
			<CallToAction />
			<Footer />
		</>
	);
};

export default LandingPage;