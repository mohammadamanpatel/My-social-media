import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../components/PostCard";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPosts, setShowPosts] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === currentUser._id) {
      navigate(`/profile/${currentUser._id}`);
    }
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`/api/v1/user/${id}`);
        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user with ID ${id}`);
        }
        const userData = await userResponse.json();
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, currentUser, navigate]);

  const handleShowPost = async (id) => {
    try {
      const response = await fetch(`/api/v1/post/${id}`);
      if (!response.ok) {
        console.log("Network response was not ok");
      }
      const postData = await response.json();
      setCurrentPost(postData);
      setShowPosts(true);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const handleViewPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleUnfollow = async (personid) => {
    console.log("personid", personid);
    dispatch(updateUserStart(true));
    try {
      const response = await fetch(`/api/v1/user/uf/${personid}/unfollow`, {
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
        following: currentUser.following.filter((id) => id !== personid),
      };
      dispatch(updateUserSuccess(updatedUser));
    } catch (error) {
      dispatch(updateUserFailure(error));
      console.error("Error unfollowing user:", error);
    }
  };

  const handleFollow = async (personid) => {
    console.log("personid", personid);
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

  if (loading) {
    return <p>Loading user profile...</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  const isFollowing = currentUser.following.includes(user._id);

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full max-w-sm mx-auto my-20 sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
      <div className="flex flex-col items-center justify-center p-4 -mt-16 sm:-mt-24">
        <a href="#" className="relative block">
          <img
            alt="profile"
            src={user.avatar?.secure_url || "https://via.placeholder.com/150"}
            className="mx-auto object-cover rounded-full h-16 w-16 sm:h-24 sm:w-24 border-2 border-white"
          />
        </a>
        <p className="mt-2 text-xl font-medium text-gray-800">{user.username}</p>
        <p className="mb-4 text-xs text-gray-400">{user.bio}</p>
        <div className="flex gap-4 mb-4">
          <p className="text-0.9 text-gray-600">
            Followers:
            <span className="font-bold text-black"> {user.followers.length}</span>
          </p>
          <p className="text-0.9 text-gray-600">
            Posts:
            <span className="font-bold text-black"> {user.posts.length}</span>
          </p>
        </div>
        <div className="w-full p-2 mt-4 rounded-lg">
          <div className="flex justify-center mb-4">
            {currentUser._id !== user._id &&
              (isFollowing ? (
                <button
                  onClick={() => handleUnfollow(user._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => handleFollow(user._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
                >
                  Follow
                </button>
              ))}
          </div>
          <button
            onClick={() => setShowPosts(!showPosts)}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-full w-full"
          >
            {showPosts ? "Hide Posts" : "Show Posts"}
          </button>
          {showPosts && (
            <div className="mt-4">
              {user.posts.length === 0 ? (
                <p>No posts found.</p>
              ) : (
                <ul className="grid grid-cols-1 gap-4">
                  {user.posts.map((post) => (
                    <li
                      key={post._id}
                      className="bg-gray-100 rounded-lg p-4 shadow-md"
                    >
                      <div
                        className="bg-cover bg-center h-40 w-full rounded-lg"
                        style={{
                          backgroundImage: `url(${
                            post.image && post.image.secure_url ||
                            post.video && post.video.secure_url ||
                            "https://via.placeholder.com/150"
                          })`,
                        }}
                      >
                        <div className="p-4 bg-black bg-opacity-50 rounded-lg flex items-center justify-center h-full">
                          <div>
                            <h4 className="text-lg font-semibold text-white">
                              {post.title}
                            </h4>
                            <p className="text-gray-300">{post.body}</p>
                            <button
                              onClick={() => handleShowPost(post._id)}
                              className="text-blue-300 hover:text-blue-400 mt-2"
                            >
                              Show Post
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      {currentPost && (
        <div className="mt-4 mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <h3 className="text-lg font-semibold mb-2">Current Post</h3>
          <PostCard
            post={currentPost}
            className="w-full h-auto"
            imageHeight="200px"
            imageWidth="100%"
          />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
