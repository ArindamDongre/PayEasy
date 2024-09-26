import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useState} from 'react';
import toast, { Toaster } from 'react-hot-toast';  // Import toast functions

export const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const name = searchParams.get('name') || 'Unknown'; // Fallback to "Unknown" if name is null or undefined
  const [amount, setAmount] = useState('');  // Bind amount input state

  const handleTransfer = async () => {
    // Check if the amount is valid
    if (amount <= 0) {
      toast.error('Amount must be greater than zero.', {
        duration: 4000,
        position: 'top-right',
      });
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/account/transfer',
        {
          to: id,
          amount,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );

      // Show success notification with toast
      toast.success(response.data.message || 'Transfer successful!', {
        duration: 4000,
        position: 'top-right',
      });

      // Reset amount input after success
      setAmount('');
    } catch (err) {
      console.error('Transfer failed:', err);

      // Handle server error or fallback error message
      const errorMessage = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Transfer failed. Please try again.';

      // Show error notification with toast
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
      });
    }
  };

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <Toaster /> {/* Place Toaster component here to display notifications */}
      <div className="h-full flex flex-col justify-center">
        <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-3xl font-bold text-center">Send Money</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-2xl text-white">
                  {name ? name[0].toUpperCase() : '?'} {/* Show '?' if name is undefined */}
                </span>
              </div>
              <h3 className="text-2xl font-semibold">{name}</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="amount"
                >
                  Amount (in Rs)
                </label>
                <input
                  value={amount} // Bind the input value to the state
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  id="amount"
                  placeholder="Enter amount"
                />
              </div>
              <button
                onClick={handleTransfer}
                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
              >
                Initiate Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
