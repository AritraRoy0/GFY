"use client";

import React from "react";
import ViewLoan from "./viewLoan"

import Header from "../common/Header"
import Footer from "../common/Footer"

const ViewLoanPage: React.FC = () => {

	return (
		<div>
			<Header />
			<div className="flex items-center justify-center w-full">
				<ViewLoan />
			</div>
			<Footer />
		</div>
	)

}

export default ViewLoanPage;
