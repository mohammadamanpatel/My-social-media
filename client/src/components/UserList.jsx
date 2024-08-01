import React, { useState, useEffect } from "react";
import { FiLogIn } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const UserList = ({ users, currentUser, handleFollow, handleUnfollow }) => {
  console.log("users", users);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userDetails, setUserDetails] = useState([]);

  const fetchUserById = async (id) => {
    try {
      const response = await fetch(`/api/v1/user/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching user details for ID ${id}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const fetchedUsers = new Set();
      const userDetailsArray = await Promise.all(
        users.map(async (user) => {
          if (!fetchedUsers.has(user)) {
            fetchedUsers.add(user);
            try {
              const userDetails = await fetchUserById(user);
              return userDetails;
            } catch (error) {
              console.error(`Error fetching details for user ${user}:`, error);
              return null;
            }
          }
          return null;
        })
      );

      const filteredDetails = userDetailsArray.filter((detail) => detail !== null);
      setUserDetails(filteredDetails);
    };

    if (users.length > 0) {
      fetchUserDetails();
    } else {
      setUserDetails([]);
    }
  }, [users]);

  const handleProfileClick = (id) => {
    navigate(`/userProfile/${id}`);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? userDetails.length - 1 : prevSlide - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === userDetails.length - 1 ? 0 : prevSlide + 1));
  };

  return (
    <div className="relative flex justify-center items-center">
      <div className="hs-carousel relative overflow-hidden w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white rounded-lg shadow-md">
        <div
          className="hs-carousel-body flex transition-transform duration-700"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {userDetails.map((user) => (
            <div key={user._id} className="hs-carousel-slide w-full flex justify-center flex-shrink-0">
              <div className="flex flex-col items-center bg-gray-100 p-6 dark:bg-neutral-900 rounded-lg shadow-md w-full">
                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleProfileClick(user._id)}
                >
                  <img
                    src={user.avatar?.secure_url || "https://via.placeholder.com/150"}
                    alt={`${user.username}'s avatar`}
                    className="w-24 h-24 rounded-full mb-4"
                  />
                  <h2 className="text-xl font-semibold">{user.username}</h2>
                  <p className="text-gray-600">{user.bio}</p>
                </div>
                <div className="mt-4">
                  {currentUser.following.includes(user._id) ? (
                    <button
                      onClick={() => handleUnfollow(user._id)}
                      className="btn bg-white text-black hover:bg-black hover:text-white"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFollow(user._id)}
                      className="btn bg-white text-black hover:bg-black hover:text-white"
                    >
                      Follow
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handlePrevSlide}
          className="hs-carousel-prev absolute inset-y-0 start-0 flex justify-center items-center w-10 h-full text-gray-800 hover:bg-gray-800/10 focus:outline-none focus:bg-gray-800/10 rounded-l-lg"
        >
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="sr-only">Previous</span>
        </button>
        <button
          type="button"
          onClick={handleNextSlide}
          className="hs-carousel-next absolute inset-y-0 end-0 flex justify-center items-center w-10 h-full text-gray-800 hover:bg-gray-800/10 focus:outline-none focus:bg-gray-800/10 rounded-r-lg"
        >
          <span className="sr-only">Next</span>
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="hs-carousel-pagination flex justify-center absolute bottom-3 start-0 end-0 space-x-2">
          {userDetails.map((_, index) => (
            <span
              key={index}
              className={`w-3 h-3 border rounded-full cursor-pointer ${
                currentSlide === index ? "bg-blue-700 border-blue-700" : "border-gray-400"
              }`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
