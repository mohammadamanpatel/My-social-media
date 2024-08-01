import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
const SignIn = () => {
  const [signInDetails, setSignInDetails] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleUserInput(event) {
    const { name, value } = event.target;
    setSignInDetails({
      ...signInDetails,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();

    if (!signInDetails.email || !signInDetails.password) {
      toast.error("Please fill all the details");
      return;
    }

    try {
      dispatch(signInStart());
      const response = await fetch("/api/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signInDetails),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("data", data);
      if (data) {
        dispatch(signInSuccess(data));
        toast.success("Logged in successfully!");
        setSignInDetails({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure());
      console.error("Error signing in:", error);
      toast.error(error.message || "Failed to sign in");
    }
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <form
            noValidate
            onSubmit={onFormSubmit}
            className="flex flex-col gap-4 w-full"
          >
            <div className="flex flex-col gap-2">
              <input
                onChange={handleUserInput}
                value={signInDetails.email}
                required
                type="email"
                name="email"
                className="bg-gray-50 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Email"
                id="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <input
                onChange={handleUserInput}
                value={signInDetails.password}
                required
                type="password"
                name="password"
                className="bg-gray-50 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Password"
                id="password"
              />
            </div>

            <button
              type="submit"
              className="bg-black hover:bg-white text-white hover:text-black py-2 font-semibold rounded-md transition-all duration-300"
            >
              Sign In
            </button>
            <OAuth />
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignIn;
