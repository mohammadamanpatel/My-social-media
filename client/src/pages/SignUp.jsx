import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import OAuth from "../components/OAuth";
const SignUp = () => {
  const [signupDetails, setSignupDetails] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
    bio: "",
    avatar: null,
  });
  const dispatch = useDispatch();
  const [previewImage, setPreviewImage] = useState("");
  const navigate = useNavigate();

  function handleUserInput(event) {
    const { name, value } = event.target;
    setSignupDetails({
      ...signupDetails,
      [name]: value,
    });
  }

  function handleImage(event) {
    const imageData = event.target.files[0];
    setSignupDetails({
      ...signupDetails,
      avatar: imageData,
    });

    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageData);
    fileReader.addEventListener("load", function () {
      setPreviewImage(this.result);
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();

    if (
      !signupDetails.email ||
      !signupDetails.password ||
      !signupDetails.fullName ||
      !signupDetails.username ||
      !signupDetails.bio
    ) {
      toast.error("Please fill all the details");
      return;
    }

    if (signupDetails.fullName.length < 5) {
      toast.error("Name should be at least 5 characters long");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", signupDetails.fullName);
    formData.append("username", signupDetails.username);
    formData.append("email", signupDetails.email);
    formData.append("password", signupDetails.password);
    formData.append("bio", signupDetails.bio);
    formData.append("avatar", signupDetails.avatar);

    try {
      const response = await fetch("/api/v1/auth/signup", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data) {
        toast.success("Account created successfully!");
        setSignupDetails({
          email: "",
          fullName: "",
          username: "",
          password: "",
          bio: "",
          avatar: null,
        });
        setPreviewImage("");
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error(error.message || "Failed to create account");
    }
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="flex flex-col items-center bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg shadow-md w-full max-w-md">
          <form
            noValidate
            onSubmit={onFormSubmit}
            className="flex flex-col gap-4 w-full"
          >
            <label htmlFor="image_uploads" className="cursor-pointer mx-auto">
              {previewImage ? (
                <img
                  className="w-24 h-24 rounded-full mx-auto"
                  src={previewImage}
                  alt="Avatar Preview"
                />
              ) : (
                <BsPersonCircle className="w-24 h-24 rounded-full mx-auto text-gray-400" />
              )}
            </label>
            <input
              onChange={handleImage}
              type="file"
              className="hidden"
              name="image_uploads"
              id="image_uploads"
              accept=".jpg, .jpeg, .png, .svg"
            />

            <div className="flex flex-col gap-2">
              <input
                onChange={handleUserInput}
                value={signupDetails.fullName}
                required
                type="text"
                name="fullName"
                className="bg-gray-50 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Full Name"
                id="fullName"
              />
            </div>

            <div className="flex flex-col gap-2">
              <input
                onChange={handleUserInput}
                value={signupDetails.username}
                required
                type="text"
                name="username"
                className="bg-gray-50 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Username"
                id="username"
              />
            </div>

            <div className="flex flex-col gap-2">
              <input
                onChange={handleUserInput}
                value={signupDetails.email}
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
                value={signupDetails.password}
                required
                type="password"
                name="password"
                className="bg-gray-50 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Password"
                id="password"
              />
            </div>

            <div className="flex flex-col gap-2">
              <textarea
                onChange={handleUserInput}
                value={signupDetails.bio}
                required
                name="bio"
                className="bg-gray-50 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 h-24 resize-none"
                placeholder="Bio"
                id="bio"
              />
            </div>

            <button
              type="submit"
              className="bg-black hover:bg-white text-white hover:text-black py-2 font-semibold rounded-md transition-all duration-300"
            >
              Create Account
            </button>
            <OAuth />
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
