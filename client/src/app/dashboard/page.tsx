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

			<main className="flex-1 w-full p-4 md:p-5">
				<div className="flex flex-col space-y-2">
					<section className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
						<SummarySection />
					</section>
					<section className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
						<LoanTerminal />
					</section>
					<section className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
						<Notifications />
					</section>
					<section className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
						<LoanTable type="owed" userId={userId} />
					</section>
					<section className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
						<LoanTable type="owned" userId={userId} />
					</section>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default DashboardPage;
