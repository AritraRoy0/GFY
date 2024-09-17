"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaHandsHelping, FaShieldAlt, FaBolt } from "react-icons/fa";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Auth from "./auth/Auth";
import Head from "next/head";

// Animation Variants
const container = {
	hidden: { opacity: 0 },
	visible: (i = 1) => ({
		opacity: 1,
		transition: { staggerChildren: 0.2, delayChildren: i * 0.2 },
	}),
};

const fadeInUp = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

// Hero Component
const Hero: React.FC = () => {
	// Animation variants for the waves
	const waveAnimationLeft = {
		animate: {
			x: ["0%", "100%", "0%"],
		},
		transition: {
			x: {
				repeat: Infinity,
				repeatType: "loop",
				duration: 10,
				ease: "easeInOut",
			},
		},
	};

	const waveAnimationRight = {
		animate: {
			x: ["0%", "-100%", "0%"],
		},
		transition: {
			x: {
				repeat: Infinity,
				repeatType: "loop",
				duration: 10,
				ease: "easeInOut",
			},
		},
	};

	return (
		<motion.div
			className="relative bg-gradient-to-br from-purple-700 to-indigo-700 text-white py-32 px-4 overflow-hidden"
			initial="hidden"
			animate="visible"
			variants={fadeInUp}
			transition={{ duration: 1 }}
		>
			<div className="absolute inset-0 bg-black opacity-40"></div>
			<div className="relative max-w-7xl mx-auto text-center z-10">
				<motion.h1
					className="text-5xl md:text-6xl font-extrabold mb-6"
					variants={fadeInUp}
					transition={{ duration: 1, delay: 0.2 }}
				>
					Go Fund Yourself!
				</motion.h1>
				<motion.p
					className="text-xl md:text-2xl mb-8"
					variants={fadeInUp}
					transition={{ duration: 1, delay: 0.4 }}
				>
					Instant, negotiable loans without bank approval over our secure
					network of peers.
				</motion.p>
				<motion.a
					href="#auth"
					className="inline-block bg-white text-purple-700 font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105 text-sm md:text-base lg:text-lg md:py-4 md:px-10"
					variants={fadeInUp}
					transition={{ duration: 1, delay: 0.6 }}
					aria-label="Get Started"
				>
					Get Started
				</motion.a>
			</div>
			{/* Animated Decorative SVG Waves */}
			<motion.div
				className="absolute top-0 left-0 w-full overflow-hidden leading-none"
				{...waveAnimationLeft}
			>
				{/* Top Wave */}
				{/* [SVG content remains unchanged] */}
			</motion.div>
			<motion.div
				className="absolute bottom-0 left-0 w-full overflow-hidden leading-none"
				{...waveAnimationRight}
			>
				{/* Bottom Wave */}
				{/* [SVG content remains unchanged] */}
			</motion.div>
		</motion.div>
	);
};

// Features Component
const Features: React.FC = () => {
	const features = [
		{
			title: "Peer-to-Peer Lending",
			icon: <FaUsers className="text-purple-700 text-6xl mx-auto mb-6" />,
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
				<FaHandsHelping className="text-purple-700 text-6xl mx-auto mb-6" />
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
      icon: <FaShieldAlt className="text-purple-700 text-6xl mx-auto mb-6" />,
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
			icon: <FaBolt className="text-purple-700 text-6xl mx-auto mb-6" />,
			details: (
				<>
					<p className="text-gray-600 mb-4">
						Say goodbye to lengthy approval processes. Our platform offers{" "}
						<strong>quick approvals</strong> so you can access funds or start
						lending without delay.
					</p>
					<p className="text-gray-600">
						Enjoy <strong>instant transactions</strong> with minimal fees,
						thanks to our efficient technology infrastructure.
					</p>
				</>
			),
		},
	];

	// State to manage the active feature
	const [activeFeature, setActiveFeature] = useState(0);

	return (
		<section className="py-24 px-4 bg-gray-50">
			<div className="max-w-7xl mx-auto text-center">
				<h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-12">
					Why Choose Go Fund Yourself?
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
					{features.map((feature, index) => (
						<div
							key={index}
							className={`bg-white shadow-md rounded-lg p-8 hover:shadow-2xl transition-transform duration-300 hover:scale-105 cursor-pointer ${
								activeFeature === index ? "border-2 border-purple-700" : ""
							}`}
							onClick={() => setActiveFeature(index)}
							aria-labelledby={`feature-${index}-title`}
						>
							{feature.icon}
							<h3
								id={`feature-${index}-title`}
								className="text-2xl font-semibold mb-4 text-gray-800"
							>
								{feature.title}
							</h3>
							<p className="text-gray-600">{feature.description}</p>
						</div>
					))}
				</div>

				{/* Detailed Feature Explanation */}
				<div className="mt-16">
					<motion.div
						key={activeFeature}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="bg-white shadow-md rounded-lg p-8 max-w-4xl mx-auto"
					>
						<h3 className="text-3xl font-bold mb-6 text-purple-700">
							{features[activeFeature].title}
						</h3>
						{features[activeFeature].details}
					</motion.div>
				</div>
			</div>
		</section>
	);
};

// Main Landing Page Component with Auth
const LandingPage: React.FC = () => {
	return (
		<>
			<Head>
				<title>Go Fund Yourself</title>
				<meta
					name="description"
					content="Instant, negotiable loans without bank approval over our secure network of peers."
				/>
			</Head>
			<Header />
			<Hero />
			<Features />

			<Footer />
		</>
	);
};

export default LandingPage;
