import { useState } from 'react';
import { firestore } from './../../../firebaseConfig'; // Assume your firebase setup is in a file one level up
import { collection, addDoc } from 'firebase/firestore';
import MockLoans from './MockLoans';

const useUploadMockLoans = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadLoans = async () => {
    setLoading(true);
    setError(null);

    try {
      const loansCollection = collection(firestore, 'mockLoans');
      for (const loan of MockLoans) {
        await addDoc(loansCollection, loan);
      }
    } catch (err) {
      setError('Failed to upload mock loans');
    } finally {
      setLoading(false);
    }
  };

  return { uploadLoans, loading, error };
};

export default useUploadMockLoans;
