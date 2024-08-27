import React from 'react';
import Header from "./common/Header";
import Footer from "./common/Footer";
import { FaUserFriends, FaHandshake, FaShieldAlt, FaMobileAlt } from 'react-icons/fa';


const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-20 px-4">
{/*       <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/path-to-your-image.jpg)' }}></div> */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 opacity-75"></div>
      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4 text-black animate-bounce">Go Fund Yourself!</h1>
        <p className="text-xl mb-8 text-black animate-fade-in">
          Instant, negotiable loans without bank approval over our secure network of peers.
        </p>
        <a
          href="/auth"
          className="bg-white text-purple-600 font-semibold py-2 px-6 rounded-md hover:bg-purple-100 transition-transform duration-300 hover:scale-105"
        >
          Get Started
        </a>
      </div>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    { title: 'Among Peers', description: 'No banks involved. Lend money to and borrow from other users.', icon: <FaUserFriends className="text-blue-600 text-4xl" /> },
    { title: 'Negotiable Rates', description: 'Set and negotiate interest rates.', icon: <FaHandshake className="text-blue-600 text-4xl" /> },
    { title: 'Secure Transactions', description: 'Built-in escrow services for safe loans. Secure transactions, guranteeded debt payments, and interest rate caps.', icon: <FaShieldAlt className="text-blue-600 text-4xl" /> },
    { title: 'Instant & no fees', description: 'Blockchain technology allows us to offer transparent, instant cash transactions, with costs below one cent per transaction - no fees for you.', icon: <FaMobileAlt className="text-blue-600 text-4xl" /> },
  ];

  return (
    <div className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-black mb-12">Why Choose Our Platform?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-transform duration-300 hover:scale-105">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-4 text-black">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
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
