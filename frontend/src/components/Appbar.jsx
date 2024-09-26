import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import for navigation

export const Appbar = () => {
  const [userName, setUserName] = useState('');
  const [userInitial, setUserInitial] = useState('');
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUserName(`${response.data.firstName} ${response.data.lastName}`);
        setUserInitial(response.data.firstName[0].toUpperCase()); // Get the initial of the first name
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown); // Toggle dropdown menu
  };

  const handleLogout = () => {
    // Clear the token and navigate to the signin page
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const handleProfileNavigate = () => {
    navigate('/profile'); // Navigate to profile page
  };

  return (
    <div className="shadow h-14 flex justify-between items-center bg-white px-4">
      <div className="flex flex-col justify-center h-full text-xl font-semibold">
        PayEasy
      </div>

      {/* Menu for larger screens */}
      <div className="flex items-center">
        <div className="flex flex-col justify-center h-full mr-4 text-lg">
          {userName} {/* Display the user's name */}
        </div>
        <div
          className="relative"
          onClick={handleProfileClick} // Toggle the dropdown
        >
          <div
            className="rounded-full h-10 w-10 bg-slate-200 flex justify-center items-center cursor-pointer"
          >
            <div className="text-xl">
              {userInitial} {/* Display the user's initial */}
            </div>
          </div>

          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg z-10">
              <div
                className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={handleProfileNavigate}
              >
                Profile
              </div>
              <div
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
