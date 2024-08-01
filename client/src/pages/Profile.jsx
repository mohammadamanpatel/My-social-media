import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import UserList from "../components/UserList";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [profile, setProfile] = useState({
    email: "",
    fullName: "",
    username: "",
    bio: "",
    avatar: currentUser.avatar.secure_url || "",
    followers: [],
    following: [],
    posts: [],
  });
  const [editing, setEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [userList, setUserList] = useState([]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/v1/user/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProfile(data);
      setPreviewImage(data.avatar.secure_url || "");
      const mergedList = [...data.following, ...data.followers];
      setUserList(mergedList);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(error.message || "Failed to fetch profile");
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
    } else {
      fetchUserProfile();
    }
  }, [currentUser, id, navigate]);

  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleImage = (event) => {
    const imageData = event.target.files[0];
    setProfile({
      ...profile,
      avatar: imageData,
    });

    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageData);
    fileReader.addEventListener("load", function () {
      setPreviewImage(this.result);
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", profile.fullName);
    formData.append("username", profile.username);
    formData.append("email", profile.email);
    formData.append("bio", profile.bio);
    if (profile.avatar) formData.append("avatar", profile.avatar);
    dispatch(updateUserStart());
    try {
      const response = await fetch(`/api/v1/user/users/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data) {
        dispatch(updateUserSuccess(data));
        toast.success("Profile updated successfully!");
        setEditing(false);
        fetchUserProfile();
      }
    } catch (error) {
      dispatch(updateUserFailure(error));
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleLogout = async () => {
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
      toast.error("Failed to logout");
    }
  };

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
      const updatedUser = {
        ...currentUser,
        following: [...currentUser.following, personid],
      };
      dispatch(updateUserSuccess(updatedUser));
    } catch (error) {
      dispatch(updateUserFailure(error));
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
      const updatedUser = {
        ...currentUser,
        following: currentUser.following.filter((id) => id !== personid),
      };
      dispatch(updateUserSuccess(updatedUser));
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  if (profile.message === "token not found") {
    navigate("/signin");
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <div className="flex flex-col items-center mb-6">
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
            {editing && (
              <input
                onChange={handleImage}
                type="file"
                className="hidden"
                name="image_uploads"
                id="image_uploads"
                accept=".jpg, .jpeg, .png, .svg"
              />
            )}
          </div>

          {editing ? (
            <form
              noValidate
              onSubmit={handleProfileUpdate}
              className="flex flex-col gap-4 w-full"
            >
              <div className="flex flex-col gap-2">
                <input
                  onChange={handleUserInput}
                  value={profile.fullName}
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
                  value={profile.username}
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
                  value={profile.email}
                  required
                  type="email"
                  name="email"
                  className="bg-gray-50 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                  placeholder="Email"
                  id="email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <textarea
                  onChange={handleUserInput}
                  value={profile.bio}
                  name="bio"
                  className="bg-gray-50 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                  placeholder="Bio"
                  id="bio"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-black hover:bg-white text-white hover:text-black px-6 py-2 rounded-md transition-colors duration-300"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                type="button"
                className="bg-black hover:bg-white text-white hover:text-black px-6 py-2 rounded-md transition-colors duration-300"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-2xl font-semibold">{profile.username}</h2>
              <p className="text-gray-500">{profile.bio}</p>
              <div className="flex justify-between w-full my-4">
                <div className="flex flex-col items-center">
                  <span className="font-semibold">{profile.posts.length}</span>
                  <span className="text-gray-500">Posts</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold">
                    {profile.followers.length}
                  </span>
                  <span className="text-gray-500">Followers</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold">
                    {profile.following.length}
                  </span>
                  <span className="text-gray-500">Following</span>
                </div>
              </div>
              {currentUser && currentUser._id === id ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-black hover:bg-white text-white hover:text-black px-6 py-2 rounded-md transition-colors duration-300"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex justify-between w-full">
                  {currentUser &&
                  currentUser.following.includes(profile._id) ? (
                    <button
                      onClick={() => handleUnfollow(profile._id)}
                      className="bg-black hover:bg-white text-white hover:text-black px-6 py-2 rounded-md transition-colors duration-300"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFollow(profile._id)}
                      className="bg-black hover:bg-white text-white hover:text-black px-6 py-2 rounded-md transition-colors duration-300"
                    >
                      Follow
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <h3 className="text-xl font-semibold mb-4">User List</h3>
          <UserList
            users={userList.filter((id) => id !== currentUser._id)} // Exclude current user
            currentUser={currentUser}
            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
          />
        </div>
        {currentUser && currentUser._id === id && (
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="bg-black hover:bg-white text-white hover:text-black px-6 py-2 rounded-md transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
