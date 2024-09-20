// services/loanService.ts
import { firestore } from '../../../firebaseConfig.js';
import { Loan } from '../models/Loan';

export const createLoan = async (loan: Loan): Promise<void> => {
  const loanRef = firestore.collection('loans').doc(loan.loanId);
  await loanRef.set(loan);
};

export const getLoan = async (loanId: string): Promise<Loan | null> => {
  const loanRef = firestore.collection('loans').doc(loanId);
  const doc = await loanRef.get();
  if (!doc.exists) {
    console.log('No such document!');
    return null;
  } else {
    return doc.data() as Loan;
  }
};
