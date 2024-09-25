// Import necessary hooks and components
import React, { useMemo } from "react";
import loans from "./MockLoans";
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
  Container,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  calculateWeeklyData,
  calculateCumulativeWeeklyData,
  CumulativeWeeklyData,
  getLoanSummary,
} from "./utils/loanUtils";

const DashboardTable: React.FC = () => {
  // Define theme and isMobile for responsive styles
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Memoize calculations for performance
  const weeklyData = useMemo(() => calculateWeeklyData(loans), []);
  const cumulativeWeeklyData: CumulativeWeeklyData[] = useMemo(
    () => calculateCumulativeWeeklyData(loans),
    []
  );
  const loanSummary = useMemo(() => getLoanSummary(loans), []);

  return (
    <Container maxWidth="lg" sx={{ paddingY: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" gutterBottom>
        Projected Loan Payments and Payouts
      </Typography>
      <Grid container spacing={isMobile ? 2 : 4}>
        {/* Cumulative Projections Chart */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              padding: { xs: theme.spacing(2), md: theme.spacing(3) },
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ marginBottom: theme.spacing(2) }}
            >
              Cumulative Projections
            </Typography>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 400}>
              <LineChart data={cumulativeWeeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="week"
                  label={{
                    value: "Week",
                    position: "insideBottomRight",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "Amount ($)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{
                    fontSize: "14px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="cumulativeIncoming"
                  name="Cumulative Incoming"
                  stroke={theme.palette.success.main}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="cumulativePayouts"
                  name="Cumulative Payouts"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeNet"
                  name="Cumulative Net"
                  stroke={theme.palette.warning.main}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Weekly Data Table */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              padding: { xs: theme.spacing(2), md: theme.spacing(3) },
              backgroundColor: theme.palette.background.paper,
              maxHeight: isMobile ? 300 : 400,
              overflow: "auto",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ marginBottom: theme.spacing(2) }}
            >
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
                  {weeklyData.map((row: any) => (
                    <TableRow key={row.week}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ color: theme.palette.text.primary }}
                      >
                        {row.week}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: theme.palette.text.primary }}
                      >
                        ${row.projectedIncoming.toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: theme.palette.text.primary }}
                      >
                        ${row.projectedPayouts.toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color:
                            row.net >= 0
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                        }}
                      >
                        ${row.net.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Summary Section */}
      <div style={{ marginTop: theme.spacing(6) }}>
        <Typography variant="h5" gutterBottom>
          Loan Summary
        </Typography>
        <Grid container spacing={isMobile ? 2 : 4}>
          {/* Owned Loans Summary */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                padding: { xs: theme.spacing(2), md: theme.spacing(3) },
                backgroundColor: theme.palette.background.paper,
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ marginBottom: theme.spacing(2) }}
              >
                Owned Loans
              </Typography>
              <Table size="small" aria-label="owned loans summary">
                <TableBody>
                  <TableRow>
                    <TableCell>Total Owned</TableCell>
                    <TableCell align="right">
                      ${loanSummary.totalOwned.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Amount to be Paid</TableCell>
                    <TableCell align="right">
                      ${loanSummary.totalAmountToBePaidOwned.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Interest Expected</TableCell>
                    <TableCell align="right">
                      ${loanSummary.totalInterestExpected.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Average Interest Rate</TableCell>
                    <TableCell align="right">
                      {loanSummary.averageInterestRateOwned.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          {/* Owed Loans Summary */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                padding: { xs: theme.spacing(2), md: theme.spacing(3) },
                backgroundColor: theme.palette.background.paper,
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ marginBottom: theme.spacing(2) }}
              >
                Owed Loans
              </Typography>
              <Table size="small" aria-label="owed loans summary">
                <TableBody>
                  <TableRow>
                    <TableCell>Total Owed</TableCell>
                    <TableCell align="right">
                      ${loanSummary.totalOwed.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Amount to be Paid</TableCell>
                    <TableCell align="right">
                      ${loanSummary.totalAmountToBePaidOwed.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Interest to Pay</TableCell>
                    <TableCell align="right">
                      ${loanSummary.totalInterestToPay.toLocaleString()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Average Interest Rate</TableCell>
                    <TableCell align="right">
                      {loanSummary.averageInterestRateOwed.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>

        {/* Net Credit and Total Reserves */}
        <Grid
          container
          spacing={isMobile ? 2 : 4}
          sx={{ marginTop: theme.spacing(4) }}
        >
          {/* Net Credit */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                padding: { xs: theme.spacing(2), md: theme.spacing(3) },
                backgroundColor: theme.palette.background.paper,
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ marginBottom: theme.spacing(2) }}
              >
                Net Credit
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color:
                    loanSummary.netCredit >= 0
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                }}
              >
                <strong>Net Credit:</strong> $
                {loanSummary.netCredit.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>

          {/* Total Reserves */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                padding: { xs: theme.spacing(2), md: theme.spacing(3) },
                backgroundColor: theme.palette.background.paper,
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ marginBottom: theme.spacing(2) }}
              >
                Total Reserves
              </Typography>
              <Typography variant="body1">
                <strong>Total Reserves (Interest):</strong> $
                {loanSummary.totalReserves.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default DashboardTable;
