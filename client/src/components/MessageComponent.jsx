import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiSend } from "react-icons/fi";

const MessageComponent = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [followedUsers, setFollowedUsers] = useState([]);
  console.log("followedUsers", followedUsers);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      try {
        const response = await fetch("/api/v1/user/users/getMutualFollowedUsers", {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFollowedUsers(data); // Assuming data is an array of mutual followed users including the current user
      } catch (error) {
        console.error("Error fetching mutual followed users:", error);
      }
    };

    fetchFollowedUsers();
  }, [currentUser.token]);

  return (
    <div className="max-w-screen-lg mx-auto mt-8 px-4">
      <h2 className="text-2xl font-semibold mb-4">Messages</h2>

      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/4 mb-4 lg:mb-0 lg:mr-4">
          <h3 className="text-lg font-semibold mb-2">Mutual Followed Users</h3>
          <ul>
            {followedUsers.map((user) => (
              <li key={user._id} className="flex items-center mb-4">
                <Link to={`/messages/${user._id}`} className="flex items-center">
                  <img
                    src={user.avatar.secure_url}
                    alt={`${user.username}'s avatar`}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <p className="text-sm">{user.username}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:w-3/4">
          {/* Placeholder for messages or UserDetails component */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <p>Select a user to start messaging...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
