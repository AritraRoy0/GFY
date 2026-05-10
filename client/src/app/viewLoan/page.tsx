"use client";

import React from "react";
import ViewLoan from "./viewLoan"

import Header from "../common/Header"
import Footer from "../common/Footer"

const ViewLoanPage: React.FC = () => {

	return (
		<div className="app-page flex min-h-screen flex-col">
			<Header />
			<main className="flex-1">
				<ViewLoan />
			</main>
			<Footer />
		</div>
	)

}

export default ViewLoanPage;
