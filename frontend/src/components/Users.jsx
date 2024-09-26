import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = () => {
  const [users, setUsers] = useState([]); // Initialize users as an empty array
  const [filter, setFilter] = useState(""); // Search input state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // Hook for navigation

  // Function to fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Set loading to true while fetching
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/user/bulk",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
            },
          }
        );
        setUsers(response.data.users || []); // Set users or fallback to empty array
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.response?.data?.message || "Failed to load users."); // Provide better error details if available
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUsers(); // Call fetchUsers function inside useEffect
  }, []); // Empty dependency array ensures fetchUsers runs once on mount

  // Filter users based on search input (filter)
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase(); // Create full name dynamically
    const searchFilter = filter.toLowerCase(); // Convert search input to lowercase

    // Check if the search filter matches first name, last name, or full name
    return (
      user.firstName.toLowerCase().includes(searchFilter) || // Match first name
      user.lastName.toLowerCase().includes(searchFilter) || // Match last name
      fullName.includes(searchFilter) // Match full name (firstName + lastName)
    );
  });

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          value={filter} // Bind the filter state to the input value
          onChange={(e) => setFilter(e.target.value)} // Update filter state on input change
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        />
      </div>
      <div className="space-y-4"> {/* Add vertical spacing between users */}
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <User key={user._id} user={user} navigate={navigate} /> // Pass navigate as prop
          )) // Render filtered users
        ) : (
          <div>No users found.</div> // Fallback if no users are found
        )}
      </div>
    </>
  );
};

// User Component to display user info
function User({ user, navigate }) {
  return (
    <div className="flex justify-between items-center py-2 border-b">
      <div className="flex items-center">
        <div className="rounded-full h-10 w-10 bg-slate-200 flex justify-center items-center mr-4">
          <div className="text-xl">
            {user?.firstName ? user.firstName[0].toUpperCase() : ""}
          </div>
        </div>
        <div className="flex flex-col justify-center h-full">
          <div>
            {user?.firstName} {user?.lastName}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-full">
        <Button
          onClick={() =>
            navigate(`/send?id=${user._id}&name=${user.firstName} ${user.lastName}`)
          } // Navigate to send money
          label={"Send Money"}
        />
      </div>
    </div>
  );
}
