'use client';

import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import SummarySection from './SummarySection';
import Notifications from './Notifications';
import LoanTerminal from './../common/LoanTerminal';
import LoanTable from './LoanTable';
import { useSelector } from 'react-redux'; // Correcting the typo here
import { RootState } from '@/app/store';

const DashboardPage: React.FC = () => {
	const user = useSelector((state: RootState) => state.auth.user);
	const userId = user?.id;

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<Header />

			<main className="flex-1 w-full p-4 md:p-6">
				<div className="flex flex-col space-y-4">
					<section className="bg-white p-4 md:p-6 rounded-lg shadow-md">
						<SummarySection />
					</section>
					<section className="bg-white p-4 md:p-6 rounded-lg shadow-md">
						<LoanTerminal />
					</section>
					<section className="bg-white p-4 md:p-6 rounded-lg shadow-md">
						<Notifications />
					</section>
					<section className="bg-white p-4 md:p-6 rounded-lg shadow-md">
						<LoanTable type="owed" userId={userId} />
					</section>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default DashboardPage;
