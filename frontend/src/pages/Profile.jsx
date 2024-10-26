import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Import toast

export const Profile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState(''); // Password state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/user/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
      } catch (error) {
        toast.error('Error fetching user data.', {
          duration: 4000,
          position: 'top-right',
        });
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    
    // Validate password length
    if (password && password.length < 6) {
        toast.error('Password must be 6+ characters', {
            duration: 4000,
            position: 'top-right',
        });
        setLoading(false);
        return; // Exit early if validation fails
    }

    try {
        const response = await axios.put(
            'http://localhost:3000/api/v1/user',
            { firstName, lastName, password },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        toast.success(response.data.message || 'Profile updated successfully!', {
            duration: 4000,
            position: 'top-right',
        });
        
        // Optionally reset password field
        setPassword('');
    } catch (error) {
        console.error('Error updating profile:', error);

        const errorMessage =
            error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : 'Failed to update profile. Please try again.';

        toast.error(errorMessage, {
            duration: 4000,
            position: 'top-right',
        });
    } finally {
        setLoading(false);
    }
};


  const handleCancel = () => {
    navigate('/dashboard'); // Navigate back to dashboard
  };

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <Toaster /> {/* To display toast notifications */}
      <div className="h-full flex flex-col justify-center">
        <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-center">Edit Profile</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="firstName">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="lastName">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Enter new password"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleCancel}
                className="bg-gray-400 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-green-500 text-white py-2 px-4 rounded-md"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
