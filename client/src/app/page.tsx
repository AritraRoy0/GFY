// components/LandingPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaHandsHelping,
  FaShieldAlt,
  FaBolt,
  FaStar,
  FaMoneyBillWave,
  FaChartLine,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Head from "next/head";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

// Hero Component with Enhanced Animations
const Hero: React.FC = () => {
  // Define animated elements with thematic relevance
  const animatedElements = [
    {
      id: 1,
      type: "circle",
      color: "rgba(0, 0, 0, 0.2)", // Black with transparency
      size: 200, // Increased size
      initialPosition: { x: -100, y: -100 },
      animate: { x: 100, y: 100, opacity: 0.4 },
      transition: { duration: 15, repeat: Infinity, repeatType: "reverse", delay: 0 },
    },
    {
      id: 2,
      type: "triangle",
      color: "rgba(50, 50, 50, 0.15)", // Dark Gray with transparency
      size: 140, // Increased size
      initialPosition: { x: 200, y: -200 },
      animate: { x: -200, y: 200, opacity: 0.3 },
      transition: { duration: 18, repeat: Infinity, repeatType: "reverse", delay: 3 },
    },
    {
      id: 3,
      type: "square",
      color: "rgba(100, 100, 100, 0.1)", // Light Gray with transparency
      size: 100, // Increased size
      initialPosition: { x: -300, y: 300 },
      animate: { x: 300, y: -300, opacity: 0.2 },
      transition: { duration: 20, repeat: Infinity, repeatType: "reverse", delay: 5 },
    },
    {
      id: 4,
      type: "icon",
      color: "rgba(0, 0, 0, 0.25)", // Black with transparency
      size: 80, // Increased size
      initialPosition: { x: 350, y: 350 },
      animate: { x: -350, y: -350, rotate: 720, opacity: 0.5 }, // Increased rotation
      transition: { duration: 25, repeat: Infinity, repeatType: "loop", delay: 2 },
      icon: <FaMoneyBillWave />,
    },
    {
      id: 5,
      type: "icon",
      color: "rgba(100, 100, 100, 0.25)", // Light Gray with transparency
      size: 70, // Increased size
      initialPosition: { x: -400, y: 150 },
      animate: { x: 400, y: -150, rotate: 720, opacity: 0.5 }, // Increased rotation
      transition: { duration: 22, repeat: Infinity, repeatType: "loop", delay: 4 },
      icon: <FaChartLine />,
    },
    // Additional animated elements to fill empty space
    {
      id: 6,
      type: "circle",
      color: "rgba(50, 50, 50, 0.1)",
      size: 180, // Increased size
      initialPosition: { x: 400, y: -250 },
      animate: { x: -400, y: 250, opacity: 0.15 },
      transition: { duration: 25, repeat: Infinity, repeatType: "reverse", delay: 1 },
    },
    {
      id: 7,
      type: "square",
      color: "rgba(80, 80, 80, 0.15)",
      size: 130, // Increased size
      initialPosition: { x: -350, y: 200 },
      animate: { x: 350, y: -200, opacity: 0.2 },
      transition: { duration: 24, repeat: Infinity, repeatType: "reverse", delay: 2 },
    },
  ];

  return (
    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 text-white py-32 px-6 overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Animated Elements Container */}
      <div className="absolute inset-0">
        {animatedElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute"
            initial={{ x: element.initialPosition.x, y: element.initialPosition.y }}
            animate={{
              x: element.animate.x,
              y: element.animate.y,
              rotate: element.animate.rotate,
              opacity: element.animate.opacity,
            }}
            transition={element.transition}
            style={{
              width: element.size,
              height: element.size,
              backgroundColor: element.type !== "icon" ? element.color : "transparent",
              borderRadius: element.type === "circle" ? "50%" : "0%",
              clipPath:
                element.type === "triangle"
                  ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                  : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: element.color,
              fontSize: element.size / 2,
              pointerEvents: "none", // Prevents interaction
            }}
          >
            {element.type === "icon" && (
              <motion.div
                whileHover={{ scale: 1.3 }}
                transition={{ duration: 0.3 }}
              >
                {element.icon}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto text-center z-10">
        {/* Hero Heading with Bounce Animation */}
        <motion.h1
          className="text-6xl md:text-8xl font-extrabold mb-8 text-white"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: [0, -20, 0] }}
          transition={{
            opacity: { duration: 1 },
            y: {
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            },
          }}
        >
          Go Fund Yourself!!
        </motion.h1>
        <motion.p
          className="text-2xl md:text-3xl mb-12 text-gray-300"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Instant, negotiable loans without bank approval over our secure network of peers.
        </motion.p>
        <motion.a
          href="#auth"
          className="inline-block bg-gray-700 text-white font-semibold py-5 px-14 rounded-full shadow-lg hover:bg-gray-600 transition duration-300 text-xl"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 1, delay: 0.6 }}
          aria-label="Get Started"
        >
          Get Started
        </motion.a>
      </div>
    </div>
  );
};

// Features Component with Enhanced Animations and Navigation Arrows
const Features: React.FC = () => {
  const features = [
    {
      title: "Peer-to-Peer Lending",
      icon: <FaUsers className="text-gray-700 text-7xl mx-auto mb-6" />,
      details: (
        <>
          <p className="text-gray-600 mb-4">
            Our platform enables <strong>direct connections</strong> between lenders and borrowers, eliminating the need for traditional banking intermediaries. This means you can <strong>save on fees</strong> and enjoy <strong>better rates</strong>.
          </p>
          <p className="text-gray-600">
            By fostering a community-driven approach, we ensure that both parties benefit from <strong>transparent</strong> and <strong>fair transactions</strong>.
          </p>
        </>
      ),
    },
    {
      title: "Flexible & Customizable",
      icon: <FaHandsHelping className="text-gray-700 text-7xl mx-auto mb-6" />,
      details: (
        <>
          <p className="text-gray-600 mb-4">
            Take control of your financial agreements by <strong>negotiating terms</strong> that meet your specific needs. Our platform allows for <strong>customizable interest rates</strong> and loan durations.
          </p>
          <p className="text-gray-600">
            This flexibility ensures that both lenders and borrowers can find mutually beneficial arrangements.
          </p>
        </>
      ),
    },
    {
      title: "Secure & Transparent",
      icon: <FaShieldAlt className="text-gray-700 text-7xl mx-auto mb-6" />,
      details: (
        <>
          <p className="text-gray-600 mb-4">
            Your security is our priority. We offer <strong>built-in escrow services</strong> that protect both parties during transactions.
          </p>
          <p className="text-gray-600">
            Our platform uses advanced encryption and <strong>security protocols</strong> to ensure your data and funds are always safe.
          </p>
        </>
      ),
    },
    {
      title: "Fast Transactions",
      icon: <FaBolt className="text-gray-700 text-7xl mx-auto mb-6" />,
      details: (
        <>
          <p className="text-gray-600 mb-4">
            Say goodbye to lengthy approval processes. Our platform offers <strong>quick approvals</strong> so you can access funds or start lending without delay.
          </p>
          <p className="text-gray-600">
            Enjoy <strong>instant transactions</strong> with minimal fees, thanks to our efficient technology infrastructure.
          </p>
        </>
      ),
    },
  ];

  // State to manage the active feature
  const [activeFeature, setActiveFeature] = useState(0);

  // Auto-cycle through features every 6 seconds
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setActiveFeature((prevIndex) => (prevIndex + 1) % features.length);
    }, 6000); // Change feature every 6 seconds

    return () => clearInterval(cycleInterval); // Cleanup on unmount
  }, [features.length]);

  // Handler for navigating to the previous feature
  const handlePrev = () => {
    setActiveFeature((prevIndex) =>
      prevIndex === 0 ? features.length - 1 : prevIndex - 1
    );
  };

  // Handler for navigating to the next feature
  const handleNext = () => {
    setActiveFeature((prevIndex) => (prevIndex + 1) % features.length);
  };

  return (
    <section className="py-20 px-6 bg-gray-200">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-12">
          Why Choose Go Fund Yourself?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`bg-white shadow-md rounded-lg p-8 hover:shadow-2xl transition duration-500 cursor-pointer ${
                activeFeature === index
                  ? "shadow-2xl transform scale-105"
                  : ""
              }`}
              onClick={() => setActiveFeature(index)}
              aria-labelledby={`feature-${index}-title`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3
                id={`feature-${index}-title`}
                className="text-3xl font-semibold mb-4 text-gray-800"
              >
                {feature.title}
              </h3>
              {/* Optionally, you can add brief details here */}
            </motion.div>
          ))}
        </div>

        {/* Detailed Feature Explanation with Navigation Arrows */}
        <div className="mt-16 relative">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-600 transition duration-300"
            aria-label="Previous Feature"
          >
            <FaArrowLeft />
          </button>

          {/* Detailed Feature Content */}
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white shadow-lg rounded-lg p-10 max-w-4xl mx-auto"
          >
            <h3 className="text-3xl font-bold mb-6 text-gray-700">
              {features[activeFeature].title}
            </h3>
            {features[activeFeature].details}
          </motion.div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-600 transition duration-300"
            aria-label="Next Feature"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

// Testimonials Component with Enhanced Animations
const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "John Doe",
      title: "Entrepreneur",
      quote: "Got my loan super quick, no bank hassles! This peer-to-peer thing rocks!",
    },
    {
      name: "Jane Smith",
      title: "Freelancer",
      quote: "Loved lending on my own terms! So easy and secure.",
    },
    {
      name: "Mike Johnson",
      title: "Investor",
      quote: "Diversified my investments easily. Flexibility is awesome!",
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
            <motion.div
              key={index}
              className="bg-gray-50 shadow-md rounded-lg p-8"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-24 h-24 mx-auto mb-6">
                {/* You can add user avatars or icons here */}
                <FaStar className="text-gray-700 w-full h-full animate-spin-slow" />
              </div>
              <p className="italic text-gray-600 mb-6">"{testimonial.quote}"</p>
              <h4 className="text-2xl font-semibold text-gray-800">{testimonial.name}</h4>
              <p className="text-gray-500">{testimonial.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Call to Action Component with Enhanced Animations
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
        <motion.a
          href="#auth"
          className="inline-block bg-gray-700 text-white font-semibold py-5 px-16 rounded-full shadow-lg hover:bg-gray-600 transition duration-300 text-2xl"
          aria-label="Join Now"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          Join Now
        </motion.a>
      </div>
    </section>
  );
};

// Main Landing Page Component
const LandingPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Go Fund Yourself</title>
        <meta
          name="description"
          content="Instant, negotiable loans without bank approval over our secure network of peers."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </>
  );
};

export default LandingPage;
