import React from 'react';

interface LoanProgressProps {
    loanAmount: number;
    paidAmount: number;
}

const Progress: React.FC<LoanProgressProps> = ({ loanAmount, paidAmount }) => {
    const progressPercentage = (paidAmount / loanAmount) * 100;

    return (
        <div>
            <h2>Loan Progress</h2>
            <p>Loan Amount: ${loanAmount}</p>
            <p>Paid Amount: ${paidAmount}</p>
            <div style={{ width: '100%', backgroundColor: '#f0f0f0', height: '20px' }}>
                <div
                    style={{
                        width: `${progressPercentage}%`,
                        backgroundColor: '#007bff',
                        height: '100%',
                    }}
                />
            </div>
            <p>Progress: {progressPercentage.toFixed(2)}%</p>
        </div>
    );
};

// Mock data for testing
const mockLoanAmount = 10000;
const mockPaidAmount = 5000;
const mockLoanAmount2 = 15000;
const mockPaidAmount2 = 10000;
const mockLoanAmount3 = 20000;
const mockPaidAmount3 = 15000;
const mockLoanAmount4 = 25000;
const mockPaidAmount4 = 20000;

const LoanProgress: React.FC = () => {
    return (
        <div>
            <Progress loanAmount={mockLoanAmount} paidAmount={mockPaidAmount} />
            <Progress loanAmount={mockLoanAmount2} paidAmount={mockPaidAmount2} />
            <Progress loanAmount={mockLoanAmount3} paidAmount={mockPaidAmount3} />
            <Progress loanAmount={mockLoanAmount4} paidAmount={mockPaidAmount4} />
        </div>
    );
};

export default LoanProgress;