import React from 'react';
import Header from './common/Header';
import Footer from './common/Footer';
import { FaUserFriends, FaHandshake, FaShieldAlt, FaMobileAlt } from 'react-icons/fa';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-purple-600 to-indigo-600 text-white py-32 px-4">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeInUp">
          Go Fund Yourself!
        </h1>
        <p className="text-xl md:text-2xl mb-8 animate-fadeInUp delay-200">
          Instant, negotiable loans without bank approval over our secure network of peers.
        </p>
        <a
          href="/auth?tab=signup"
          className="inline-block bg-white text-purple-600 font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105 animate-fadeInUp delay-400"
        >
          Get Started
        </a>
      </div>
      {/* Decorative SVG Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-20 md:h-32"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M0,0V46.29c47.31,22,103.65,29.39,158.16,23.07,70.77-8.19,136.88-35.62,207.67-40.29C429.92,23.28,492,44.19,561,58.77c70.84,14.95,140.29,6.15,209.26-13.58,60.87-17.65,115.75-45.46,177-54.74C996.63-18,1077.43-5.3,1155,16.55V0Z"
            opacity=".25"
            fill="#ffffff"
          />
          <path
            d="M0,0V15.81C44.13,5.59,88.57-.87,132.72.1c64.51,1.47,127.05,16.81,191.56,23.81,60.5,6.56,119.75,1.49,178.44-10.61C556.81,1.23,617.69-5,678,1.51c57.6,6.21,112.08,24.41,169.75,29.36,59.23,5.09,116.48-6.71,173.13-18.16,55.06-11.1,111.22-22.21,166.12-9.25V0Z"
            opacity=".5"
            fill="#ffffff"
          />
          <path
            d="M0,0V5.63C43,15.27,86,22.41,129.15,27c65.94,7.19,132.13,6.85,197.81-.91,55.71-6.55,111.19-18.85,166.89-24.42C554.44-3.23,611.39-2.32,668.26,3.07c60.8,5.92,121,16.87,181.34,22.99,63.08,6.46,126.48,6.31,189.61-1.8,51.85-6.36,103.85-17.47,155.79-25.26V0Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      title: 'Peer-to-Peer Lending',
      description: 'Connect directly with other users to lend or borrow money without intermediaries.',
      icon: <FaUserFriends className="text-purple-600 text-6xl mx-auto mb-6" />,
    },
    {
      title: 'Flexible Rates',
      description: 'Negotiate interest rates that suit both parties for a fair lending experience.',
      icon: <FaHandshake className="text-purple-600 text-6xl mx-auto mb-6" />,
    },
    {
      title: 'Secure & Reliable',
      description:
        'Utilize our built-in escrow services and security measures for safe transactions.',
      icon: <FaShieldAlt className="text-purple-600 text-6xl mx-auto mb-6" />,
    },
    {
      title: 'Instant Transactions',
      description:
        'Experience fast and transparent transactions with minimal fees using blockchain technology.',
      icon: <FaMobileAlt className="text-purple-600 text-6xl mx-auto mb-6" />,
    },
  ];

  return (
    <div className="py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 animate-fadeInUp">
          Why Choose Our Platform?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fadeInUp"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {feature.icon}
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Landing: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Footer />
    </>
  );
};

export default Landing;
