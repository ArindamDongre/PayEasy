import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";  // Import toast functions

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);  // Loading state for better UX
  const navigate = useNavigate();

  // Function to handle signup
  const handleSignup = async () => {
    setLoading(true);  // Set loading state
  
    // Frontend validation for required fields, email format, and password length
    if (!firstName || !lastName || !username || !password) {
      toast.error("All fields are required", {
        duration: 4000,
        position: "top-right",
      });
      setLoading(false);
      return;
    }
  
    if (!/\S+@\S+\.\S+/.test(username)) {
      toast.error("Invalid email format", {
        duration: 4000,
        position: "top-right",
      });
      setLoading(false);
      return;
    }
  
    if (password.length < 6) {
      toast.error("Password must be 6+ characters", {
        duration: 4000,
        position: "top-right",
      });
      setLoading(false);
      return;
    }
  
    try {
      // Proceed with signup API call
      const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
        username,
        firstName,
        lastName,
        password
      });
  
      // Show success toast notification
      toast.success("Signup successful!", {
        duration: 4000,
        position: "top-right",
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err.response && err.response.data
          ? err.response.data.message
          : "Signup failed. Please try again.";

      // Show error toast notification
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setLoading(false);  // Stop the loading indicator
    }
  };  

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <Toaster /> {/* Place Toaster component here to display notifications */}
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your information to create an account"} />

          <InputBox
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            label={"First Name"}
          />
          <InputBox
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            label={"Last Name"}
          />
          <InputBox
            onChange={(e) => setUsername(e.target.value)}
            placeholder="John@gmail.com"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            label={"Password"}
            type="password"  // Password masking
          />

          <div className="pt-4">
            <Button
              onClick={handleSignup}
              label={loading ? "Signing up..." : "Sign up"}  // Loading state for button
              disabled={loading}  // Disable button while loading
            />
          </div>

          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};
