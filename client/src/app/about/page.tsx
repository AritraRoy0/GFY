'use client';

import React from "react";
import {
	FaPercentage,
	FaRegMoneyBillAlt,
	FaShieldAlt,
	FaHandHoldingUsd,
	FaBan,
	FaExchangeAlt,
	FaHandshake,
	FaDollarSign,
} from "react-icons/fa";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Head from "next/head";
import { motion } from "framer-motion";

const AboutUs: React.FC = () => {
	return (
		<div className="text-gray-800 dark:text-gray-100 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
			<Head>
				<title>About Us - Go Fund Yourself</title>
				<meta
					name="description"
					content="Invest with confidence and borrow with ease on our peer-to-peer lending platform."
				/>
			</Head>

			<Header />

			{/* Main Hero Section */}
			<section className="relative py-16 px-6 lg:px-12 overflow-hidden">
				<div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-30 z-0" />
				<div className="relative z-10 max-w-7xl mx-auto text-center">
					<h2 className="text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white mb-4">
						Invest with Confidence, Borrow with Ease
					</h2>
					<p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-12">
						At <span className="font-semibold">Go Fund Yourself</span>, we
						connect investors with borrowers directly, offering better returns
						and flexible loan terms without traditional financial intermediaries.
					</p>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
						{[
							{
								Icon: FaRegMoneyBillAlt,
								title: 'Maximize Your Returns',
								desc: 'Earn higher returns compared to traditional savings accounts by lending directly.',
								color: 'text-green-500 dark:text-green-300',
							},
							{
								Icon: FaPercentage,
								title: 'Set Your Own Rates',
								desc: 'Take control by setting interest rates and defining your portfolio terms.',
								color: 'text-blue-500 dark:text-blue-300',
							},
							{
								Icon: FaShieldAlt,
								title: 'Secure & Transparent',
								desc: 'Built-in escrow services and verified borrowers ensure safety and transparency.',
								color: 'text-purple-500 dark:text-purple-300',
							},
							{
								Icon: FaHandHoldingUsd,
								title: 'Flexible Loan Options',
								desc: 'Access loans with customizable terms and interest rates tailored to you.',
								color: 'text-yellow-500 dark:text-yellow-300',
							},
						].map((card, idx) => (
							<motion.div
								key={idx}
								className="p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-transform duration-300"
								whileHover={{ scale: 1.05 }}
							>
								<card.Icon className={`${card.color} text-6xl mb-4 mx-auto`} />
								<h3 className="text-2xl font-bold text-center mb-2">
									{card.title}
								</h3>
								<p className="text-gray-600 dark:text-gray-400 text-center">
									{card.desc}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Why Bypass Banks Section */}
			<section className="bg-gray-50 dark:bg-gray-900 py-16 px-6 lg:px-12">
				<div className="max-w-7xl mx-auto text-center">
					<h2 className="text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white mb-4">
						Why Bypass Banks?
					</h2>
					<p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-12">
						Cutting out the middleman means better terms for everyone. Here’s why
						it matters:
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{[
							{
								Icon: FaBan,
								title: 'Save on Fees',
								desc: 'By avoiding banks, enjoy cost-effective transactions with no hidden fees.',
								color: 'text-red-500 dark:text-red-300',
							},
							{
								Icon: FaExchangeAlt,
								title: 'Faster Transactions',
								desc: 'Direct transactions allow for quicker approvals and a streamlined process.',
								color: 'text-green-500 dark:text-green-300',
							},
							{
								Icon: FaHandshake,
								title: 'Customizable Agreements',
								desc: 'Negotiate terms directly with lenders or borrowers to meet your needs.',
								color: 'text-blue-500 dark:text-blue-300',
							},
							{
								Icon: FaDollarSign,
								title: 'Competitive Rates',
								desc: 'Benefit from competitive rates on both lending and borrowing.',
								color: 'text-yellow-500 dark:text-yellow-300',
							},
						].map((benefit, idx) => (
							<motion.div
								key={idx}
								className="p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-transform duration-300"
								whileHover={{ scale: 1.05 }}
							>
								<benefit.Icon
									className={`${benefit.color} text-6xl mb-4 mx-auto`}
								/>
								<h3 className="text-2xl font-bold text-center mb-2">
									{benefit.title}
								</h3>
								<p className="text-gray-600 dark:text-gray-400 text-center">
									{benefit.desc}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default AboutUs;
