// DashboardTable.tsx
import React from "react";
import loans from "./MockLoans";
import { Loan, Payment } from "../models/Loan";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import {
	Typography,
	Paper,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";


const DashboardTable: React.FC = () => {
	interface WeeklyData {
		week: number;
		projectedIncoming: number;
		projectedPayouts: number;
		net: number;
	}

	const calculateWeeklyData = (loans: Loan[]): WeeklyData[] => {
		const maxTermWeeks = Math.max(...loans.map((loan) => loan.termWeeks));
		const weeks = Array.from({ length: maxTermWeeks }, (_, i) => i + 1);

		const weeklyData: WeeklyData[] = weeks.map((week) => ({
			week,
			projectedIncoming: 0,
			projectedPayouts: 0,
			net: 0,
		}));

		loans.forEach((loan) => {
			weeks.forEach((week) => {
				if (week > loan.termWeeks) return;

				// Determine if a payment was made in this week
				const paymentMade = loan.paymentsMade.find(
					(payment: Payment) => payment.weekNumber === week
				);
				const paymentAmount = paymentMade
					? paymentMade.amount
					: loan.weeklyInstallment;

				if (loan.owner === "owned") {
					weeklyData[week - 1].projectedIncoming += paymentAmount;
				} else if (loan.owner === "owed") {
					weeklyData[week - 1].projectedPayouts += paymentAmount;
				}
			});
		});

		weeklyData.forEach((data) => {
			data.net = data.projectedIncoming - data.projectedPayouts;
		});

		return weeklyData;
	};

	const weeklyData = calculateWeeklyData(loans);

	return (
		<div style={{ padding: "20px" }}>
			<Typography variant="h4" gutterBottom>
				Projected Loan Payments and Payouts
			</Typography>
			<Grid container spacing={4}>
				<Grid item xs={12} md={8}>
					<Paper style={{ padding: "20px" }}>
						<ResponsiveContainer width="100%" height={400}>
							<LineChart data={weeklyData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="week" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Line
									type="monotone"
									dataKey="projectedIncoming"
									name="Projected Incoming"
									stroke="#82ca9d"
									strokeWidth={2}
									dot={{ r: 1 }}
									activeDot={{ r: 4 }}
								/>
								<Line
									type="monotone"
									dataKey="projectedPayouts"
									name="Projected Payouts"
									stroke="#8884d8"
									strokeWidth={2}
									dot={{ r: 1 }}
									activeDot={{ r: 4 }}
								/>
								<Line
									type="monotone"
									dataKey="net"
									name="Net"
									stroke="#ff7300"
									strokeWidth={2}
									dot={{ r: 1 }}
									activeDot={{ r: 4 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>
				<Grid item xs={12} md={4}>
					<Paper style={{ padding: "20px", maxHeight: 400, overflow: "auto" }}>
						<Typography variant="h6" gutterBottom>
							Weekly Data
						</Typography>
						<TableContainer>
							<Table size="small" aria-label="weekly data table">
								<TableHead>
									<TableRow>
										<TableCell>Week</TableCell>
										<TableCell align="right">Incoming</TableCell>
										<TableCell align="right">Payouts</TableCell>
										<TableCell align="right">Net</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{weeklyData.map((row) => (
										<TableRow key={row.week}>
											<TableCell component="th" scope="row">
												{row.week}
											</TableCell>
											<TableCell align="right">
												${row.projectedIncoming.toFixed(2)}
											</TableCell>
											<TableCell align="right">
												${row.projectedPayouts.toFixed(2)}
											</TableCell>
											<TableCell align="right">${row.net.toFixed(2)}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</Grid>
			</Grid>
		</div>
	);
};

export default DashboardTable;
