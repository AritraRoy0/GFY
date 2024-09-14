'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, </h1>
      {/* Dashboard content here */}
    </div>
  );
};

export default Dashboard;
