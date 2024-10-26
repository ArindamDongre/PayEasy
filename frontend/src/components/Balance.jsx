import { useState, useEffect } from 'react';
import axios from 'axios';

export const Balance = () => {
  const [balance, setBalance] = useState(0); // Initialize balance state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch balance on component mount
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setBalance(response.data.balance); // Set balance state
      } catch (err) {
        setError("Failed to load balance."); // Set error message
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchBalance();
  }, []);

  // Show loading state
  if (loading) return <div>Loading balance...</div>;

  // Show error state
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="my-4 flex items-center space-x-4">
      <div className="text-lg font-bold">Your Balance</div>
      <div className="text-xl text-green-600">
        ₹{balance.toLocaleString()}
      </div>
    </div>
  );
};
