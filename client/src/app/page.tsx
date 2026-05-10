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
		<div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-32 px-6 overflow-hidden">
			<motion.div
				className="absolute inset-0 opacity-10"
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

			{/* Floating geometric shapes */}
			<motion.div
				className="absolute top-20 left-20 w-20 h-20 bg-white/10 rounded-full animate-float"
				animate={{ rotate: 360 }}
				transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
			/>
			<motion.div
				className="absolute top-40 right-32 w-16 h-16 bg-white/10 rounded-lg animate-float"
				style={{ animationDelay: "2s" }}
			/>
			<motion.div
				className="absolute bottom-32 left-32 w-12 h-12 bg-white/10 rounded-full animate-float"
				style={{ animationDelay: "4s" }}
			/>

			<div className="relative max-w-6xl mx-auto px-6 text-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<h1 className="text-5xl md:text-7xl font-bold mb-6">
						Go Fund <span className="text-gradient">Yourself!!</span>
					</h1>
					<p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
						Instant, negotiable loans without bank approval over our secure network of peers.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="btn-primary text-lg px-8 py-4 rounded-xl font-semibold shadow-lg"
							onClick={() => window.location.href = '/auth'}
						>
							Get Started
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="glass-card text-white border border-white/30 text-lg px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
							onClick={() => window.location.href = '/about'}
						>
							Learn More
						</motion.button>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3 }}
					className="mt-16"
				>
					<div className="glass-card p-6 rounded-3xl border border-white/30 shadow-2xl animate-float">
						<LoanTerminal />
					</div>
				</motion.div>
			</div>
			<div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-indigo-900 to-transparent" />
		</div>
	);
};

const Features = () => {
	const features = [
		{
			title: "Peer-to-Peer Lending",
			icon: <FaUsers className="w-8 h-8 text-emerald-400" />,
			description: "Direct connections between lenders and borrowers with transparent transactions",
		},
		{
			title: "Secure & Private",
			icon: <FaShieldAlt className="w-8 h-8 text-blue-400" />,
			description: "Bank-level encryption and privacy protection for all your financial data",
		},
		{
			title: "Instant Approval",
			icon: <FaBolt className="w-8 h-8 text-yellow-400" />,
			description: "Get loan approvals in minutes, not days. No lengthy paperwork required",
		},
		{
			title: "Flexible Terms",
			icon: <FaHandsHelping className="w-8 h-8 text-purple-400" />,
			description: "Negotiate loan terms directly with peers. Customize interest rates and repayment schedules",
		},
	];

	return (
		<section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
			<div className="max-w-6xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
						Why Choose <span className="text-gradient">Go Fund Yourself</span>?
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						Experience the future of lending with our innovative peer-to-peer platform designed for the modern borrower and lender.
					</p>
				</motion.div>

				<motion.div
					variants={stagger}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
				>
					{features.map((feature, index) => (
						<motion.div
							key={index}
							variants={fadeInUp}
							whileHover={{ y: -5 }}
							className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
						>
							<div className="mb-4">{feature.icon}</div>
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
								{feature.title}
							</h3>
							<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
								{feature.description}
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};

const Stats = () => {
	const stats = [
		{ number: "10K+", label: "Active Users", icon: <FaUsers className="w-6 h-6" /> },
		{ number: "$2M+", label: "Loans Funded", icon: <FaMoneyCheckAlt className="w-6 h-6" /> },
		{ number: "95%", label: "Success Rate", icon: <FaCheckCircle className="w-6 h-6" /> },
		{ number: "24/7", label: "Support", icon: <FaHeartbeat className="w-6 h-6" /> },
	];

	return (
		<section className="py-20 px-6 bg-white dark:bg-gray-800">
			<div className="max-w-6xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
						Trusted by <span className="text-gradient">Thousands</span>
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						Join a growing community of successful borrowers and lenders who trust our platform.
					</p>
				</motion.div>

				<motion.div
					variants={stagger}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid grid-cols-2 lg:grid-cols-4 gap-8"
				>
					{stats.map((stat, index) => (
						<motion.div
							key={index}
							variants={fadeInUp}
							className="text-center"
						>
							<div className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300">
								<div className="text-green-500 mb-2 flex justify-center">{stat.icon}</div>
								<div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
									{stat.number}
								</div>
								<div className="text-gray-600 dark:text-gray-300 font-medium">
									{stat.label}
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};

const Testimonials = () => {
	const testimonials = [
		{
			name: "Sarah Johnson",
			role: "Small Business Owner",
			content: "Go Fund Yourself helped me secure the funding I needed to expand my bakery. The process was incredibly smooth and the terms were fair.",
			rating: 5,
			avatar: "SJ"
		},
		{
			name: "Michael Chen",
			role: "Software Developer",
			content: "As a lender, I've found this platform to be transparent and rewarding. The returns are competitive and the borrowers are vetted properly.",
			rating: 5,
			avatar: "MC"
		},
		{
			name: "Emily Rodriguez",
			role: "Graduate Student",
			content: "I was able to get a loan for my education without the hassle of traditional banks. The peer-to-peer approach made it personal and fast.",
			rating: 5,
			avatar: "ER"
		}
	];

	return (
		<section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
			<div className="max-w-6xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
						What Our <span className="text-gradient">Users Say</span>
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						Real stories from real users who have transformed their financial futures with our platform.
					</p>
				</motion.div>

				<motion.div
					variants={stagger}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid grid-cols-1 md:grid-cols-3 gap-8"
				>
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={index}
							variants={fadeInUp}
							className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300"
						>
							<div className="flex items-center mb-4">
								<div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold mr-4">
									{testimonial.avatar}
								</div>
								<div>
									<h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
									<p className="text-gray-600 dark:text-gray-300 text-sm">{testimonial.role}</p>
								</div>
							</div>
							<div className="flex mb-4">
								{[...Array(testimonial.rating)].map((_, i) => (
									<FaCheckCircle key={i} className="w-5 h-5 text-yellow-400" />
								))}
							</div>
							<p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
								"{testimonial.content}"
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};

const PoweredBy = () => {
	const technologies = [
		{ name: "Next.js", icon: <FaBolt className="w-8 h-8" />, color: "text-black dark:text-white" },
		{ name: "Firebase", icon: <FaStore className="w-8 h-8" />, color: "text-orange-500" },
		{ name: "Tailwind CSS", icon: <FaCreditCard className="w-8 h-8" />, color: "text-blue-500" },
		{ name: "React", icon: <FaIdBadge className="w-8 h-8" />, color: "text-blue-400" },
	];

	return (
		<section className="py-20 px-6 bg-white dark:bg-gray-800">
			<div className="max-w-6xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
						Powered by <span className="text-gradient">Modern Technology</span>
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						Built with cutting-edge technologies to ensure security, speed, and reliability.
					</p>
				</motion.div>

				<motion.div
					variants={stagger}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					className="grid grid-cols-2 lg:grid-cols-4 gap-8"
				>
					{technologies.map((tech, index) => (
						<motion.div
							key={index}
							variants={fadeInUp}
							whileHover={{ scale: 1.05 }}
							className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 text-center"
						>
							<div className={`mb-4 flex justify-center ${tech.color}`}>{tech.icon}</div>
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
								{tech.name}
							</h3>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};

const CallToAction = () => {
	return (
		<section className="py-20 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
			<div className="max-w-4xl mx-auto text-center">
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					whileInView={{ scale: 1, opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="glass-card p-12 rounded-3xl border border-white/20 shadow-2xl"
				>
					<h2 className="text-4xl md:text-5xl font-bold mb-6">
						Ready to Take Control of Your <span className="text-gradient">Financial Future?</span>
					</h2>
					<p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
						Join thousands of users who have already transformed their financial lives. Start your journey today.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="btn-primary text-lg px-8 py-4 rounded-xl font-semibold shadow-lg"
							onClick={() => window.location.href = '/auth'}
						>
							Get Started Now
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="glass-card text-white border border-white/30 text-lg px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
							onClick={() => window.location.href = '/about'}
						>
							Learn More
						</motion.button>
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
			<Features />
			<Stats />
			<Testimonials />
			<PoweredBy />
			<CallToAction />
			<Footer />
		</>
	);
};

export default LandingPage;