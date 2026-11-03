"use client";

import React from "react";
import { useSelector } from "react-redux";
import ViewLoan from "./viewLoan"
import AppShell from "../common/AppShell"
import { RootState } from "../store";
import { shortId } from "../common/format";

const ViewLoanPage: React.FC = () => {
	const loanId = useSelector((state: RootState) => state.loanRequest.id);

	return (
		<AppShell
			breadcrumbs={[
				{ label: "Marketplace", href: "/loanRequests" },
				{ label: loanId ? `Request #${shortId(loanId)}` : "Review" },
			]}
		>
			<ViewLoan />
		</AppShell>
	)

}

export default ViewLoanPage;
