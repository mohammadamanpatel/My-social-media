import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai";

import PostCard from "../components/PostCard";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const currentUser = useSelector((state) => state.user.currentUser);
  const following = currentUser ? currentUser.following : [];
  const dispatch = useDispatch();
  const [fetchError, setFetchError] = useState(false);
  const navigate = useNavigate();
  console.log("currentUser", currentUser);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/v1/post");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setFetchError(true);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/v1/user/users");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        dispatch(updateUserFailure(error));
        console.error("Error fetching users:", error);
        setFetchError(true);
      }
    };

    if (!currentUser) {
      navigate("/signin");
    } else {
      fetchPosts();
      fetchUsers();
    }
  }, [currentUser, dispatch, navigate]);

  const handleFollow = async (personid) => {
    dispatch(updateUserStart(true));
    try {
      const response = await fetch(`/api/v1/user/f/${personid}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.log("Network response was not ok");
      }
      const data = await response.json();
      console.log(data.message);

      const updatedUser = {
        ...currentUser,
        following: [...currentUser.following, personid],
      };
      dispatch(updateUserSuccess(updatedUser));
    } catch (error) {
      dispatch(updateUserFailure(error));
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (personid) => {
    dispatch(updateUserStart(true));
    try {
      const response = await fetch(`/api/v1/user/uf/${personid}/unfollow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.log("response was not ok");
      }
      const data = await response.json();
      console.log(data.message);

      const updatedUser = {
        ...currentUser,
        following: currentUser.following.filter((id) => id !== personid),
      };
      dispatch(updateUserSuccess(updatedUser));
    } catch (error) {
      dispatch(updateUserFailure(error));
      console.error("Error unfollowing user:", error);
    }
  };

  const renderFollowSuggestions = () => {
    if (fetchError) {
      return <Link to="/signin" />;
    }

    if (following.length === 0 && users.length > 0) {
      return (
        <div className="text-center mt-4">
          <p className="text-gray-600">
            You haven't followed anyone yet. Follow some users to see their
            posts!
          </p>
          <div className="flex flex-wrap justify-center">
            {users.map((user) => (
              <div
                key={user._id}
                className="m-2 p-4 border border-gray-300 rounded-md bg-gray-800"
              >
                <img
                  src={user.avatar.secure_url}
                  alt={user.username}
                  className="w-16 h-16 rounded-full object-cover mb-2"
                />
                <p className="text-lg text-center text-white">
                  {user.username}
                </p>
                {currentUser &&
                  (following.includes(user._id) ? (
                    <button
                      className="mt-2 px-4 py-2 text-white bg-red-500 rounded"
                      onClick={() => handleUnfollow(user._id)}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      className="mt-2 px-4 py-2 text-white bg-blue-500 rounded"
                      onClick={() => handleFollow(user._id)}
                    >
                      Follow
                    </button>
                  ))}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const leftShiftHandler = () => {
    if (index - 1 >= 0) {
      setIndex(index - 1);
    } else {
      setIndex(users.length - 1);
    }
  };

  const rightShiftHandler = () => {
    if (index + 1 < users.length) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto mt-8 px-4 relative">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Sidebar */}
        <div className="lg:w-1/4 p-4 border border-gray-300 rounded-md bg-gray-800 h-auto lg:h-3/4">
          {/* User Profile Overview */}
          {currentUser && (
            <div
              className="mb-8 text-white text-center cursor-pointer"
              onClick={() => navigate(`/userProfile/${currentUser._id}`)}
            >
              <img
                src={currentUser.avatar.secure_url}
                alt={currentUser.username}
                className="w-16 h-16 rounded-full object-cover mb-2 mx-auto"
              />
              <p className="text-lg">{currentUser.username}</p>
              <p>{`No. of Connections: ${currentUser.followers.length}`}</p>
            </div>
          )}
          {/* Social Media Links */}
          <div className="mb-8 text-center">
            <p className="text-lg text-white">Follow me on:</p>
            <div className="flex justify-center space-x-4">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white mx-2"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white mx-2"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white mx-2"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white mx-2"
              >
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
          {/* Contact Email and Bio Section */}
          <div className="mb-8 bg-gray-900 p-4 rounded-md">
            <div className="mb-6">
              <h2 className="text-lg text-white mb-2">Contact Email:</h2>
              <p className="text-white">{currentUser && currentUser.email}</p>
            </div>
            <div>
              <h2 className="text-lg text-white mb-2">Bio:</h2>
              <p className="text-white">{currentUser && currentUser.bio}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-2/4 p-4">
          {/* Follow slider */}
          {following.length === 0 && posts.length === 0 ? (
            <div className="mb-8" style={{ minHeight: "300px" }}>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Followed Users
              </h2>
              <div className="flex flex-col items-center justify-center mb-4 border border-gray-300 p-4 rounded-md">
                <div className="relative w-[300px] h-[300px] flex flex-col items-center justify-center bg-gray-900 rounded-md p-4">
                  {users.length > 0 && (
                    <div className="hs-carousel">
                      <div className="hs-carousel-slide">
                        <img
                          src={users[index].avatar.secure_url}
                          alt={users[index].username}
                          className="w-16 h-16 rounded-full object-cover mb-2"
                        />
                        <p className="text-white">{users[index].username}</p>
                      </div>
                      <button
                        onClick={leftShiftHandler}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full"
                      >
                        <FiChevronLeft size={24} />
                      </button>
                      <button
                        onClick={rightShiftHandler}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full"
                      >
                        <FiChevronRight size={24} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {renderFollowSuggestions()}
            </div>
          ) : null}

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">Posts</h2>
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  className="w-full h-auto"
                  imageHeight="200px"
                  imageWidth="100%"
                />
              ))
            ) : (
              <p className="text-lg text-gray-600">No posts available</p>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-1/4 p-4 border border-gray-300 rounded-md bg-gray-800 h-auto lg:h-3/4">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Followed Users
          </h2>
          <ul className="space-y-4">
            {following.map((followedUserId) => {
              const followedUser = users.find(
                (user) => user._id === followedUserId
              );
              return (
                followedUser && (
                  <li
                    key={followedUser._id}
                    className="flex items-center justify-between p-2 bg-gray-900 cursor-pointer rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={followedUser.avatar.secure_url}
                        alt={followedUser.username}
                        onClick={() =>
                          navigate(`/userProfile/${followedUser._id}`)
                        }
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span
                        className="text-white"
                        onClick={() =>
                          navigate(`/userProfile/${followedUser._id}`)
                        }
                      >
                        {followedUser.username}
                      </span>
                    </div>
                    <button
                      onClick={() => handleUnfollow(followedUser._id)}
                      className="p-2 text-red-500 bg-gray-700 rounded-full"
                    >
                      <AiOutlineUserDelete size={24} />
                    </button>
                  </li>
                )
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
