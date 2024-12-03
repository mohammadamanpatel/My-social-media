import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleLogout = async () => {
    dispatch(signOutUserStart());
    try {
      const response = await fetch("/api/v1/auth/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }
      dispatch(signOutUserSuccess(currentUser));
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(signOutUserFailure(error));
      // Display an error message without using toast notifications
      alert("Failed to logout");
    }
  };

  return (
    <header className="w-full bg-gray-100 border-b border-gray-300 flex justify-center items-center py-2.5">
      <div className="w-11/12 max-w-6xl flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="https://cdn.leonardo.ai/users/9a2817bf-ec11-4373-b4a0-d006ffd18472/generations/3a23e17f-663a-4ed4-8acf-15a59c1af30f/Leonardo_Phoenix_Design_a_modern_eyecatching_logo_for_a_social_2.jpg"
            alt="Fun Flow"
            onClick={() => navigate("/")}
            className="h-10 w-10 mr-4 cursor-pointer"
          />
          <h1
            className="text-2xl font-bold text-gray-800 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Timeline Social
          </h1>
        </div>
        {currentUser && (
          <div className="flex items-center space-x-4 cursor-pointer">
            <img
              src={currentUser.avatar.secure_url}
              alt={currentUser.username}
              onClick={() => navigate(`/userProfile/${currentUser._id}`)}
              className="hidden md:block w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            />
            <input
              type="text"
              placeholder="Create Post"
              onClick={() => navigate("/postCreate")}
              className="hidden md:block border border-gray-300 rounded-full py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 sm:w-80" // Adjust width for different screens
            />
            <FaEnvelope
            size={24}
            className="text-gray-600 cursor-pointer transition duration-300 ease-in-out hover:text-gray-900"
            onClick={() => navigate("/messages")}
          />
          </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="bg-blue-500 text-white border-none py-2 px-4 text-base cursor-pointer rounded transition duration-300 ease-in-out hover:bg-blue-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
