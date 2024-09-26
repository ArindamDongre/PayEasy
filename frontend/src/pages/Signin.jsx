import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast"; // Import toast functions

export const Signin = () => {
  const [username, setUsername] = useState(""); // Changed from email to username for consistency with backend
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for UX
  const navigate = useNavigate();

  const handleSignin = async () => {
    setLoading(true); // Set loading to true when request starts

    // Basic frontend validation
    if (!username || !password) {
      toast.error("Please fill in both email and password.", {
        duration: 4000,
        position: "top-right",
      });
      setLoading(false);
      return;
    }

    try {
      // Make the API call to the backend signin endpoint
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signin", // Make sure the endpoint matches your backend
        {
          username, // Sending username instead of email
          password,
        }
      );

      if (response.data.token) {
        // Store the token in localStorage
        localStorage.setItem("token", response.data.token);

        // Show success notification
        toast.success("Signin successful!", {
          duration: 4000,
          position: "top-right",
        });

        // Navigate to dashboard on successful sign-in
        navigate("/dashboard");
      }
    } catch (err) {
      // Handle errors and show a message based on server response or fallback message
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Invalid credentials, please try again.";

      // Show error notification
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setLoading(false); // Stop loading state after request completes
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <Toaster /> {/* Place Toaster component here to display notifications */}
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />

          {/* Input fields */}
          <InputBox
            placeholder="John@gmail.com"
            label={"Email"}
            onChange={(e) => setUsername(e.target.value)}
            value={username} // Controlled input for username
          />
          <InputBox
            placeholder="********"
            label={"Password"}
            onChange={(e) => setPassword(e.target.value)}
            value={password} // Controlled input for password
            type="password" // Password masking for security
          />

          {/* Sign-in button with loading state */}
          <div className="pt-4">
            <Button
              label={loading ? "Signing in..." : "Sign in"}
              onClick={handleSignin}
              disabled={loading} // Disable button while loading
            />
          </div>

          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};
