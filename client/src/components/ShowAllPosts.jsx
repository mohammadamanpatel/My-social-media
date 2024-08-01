import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";

const ShowAllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
    } else {
      const fetchUserPosts = async () => {
        try {
          const response = await fetch(`/api/v1/user`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setPosts(data.posts);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };

      fetchUserPosts();
    }
  }, [currentUser, navigate]);

  const toggleDropdown = (postId) => {
    setDropdownVisible((prev) => (prev === postId ? null : postId));
  };

  const handleEdit = (id) => {
    navigate(`/profile/showallposts/editPost/${id}`);
  };

  const handleDelete = (id) => {
    navigate(`/profile/showallposts/deletePost/${id}`);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">My Posts</h1>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="mb-4 relative">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{post.caption}</h2>
                <div className="relative">
                  <BsThreeDots
                    className="cursor-pointer"
                    onClick={() => toggleDropdown(post._id)}
                  />
                  {dropdownVisible === post._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                      <button
                        onClick={() => handleEdit(post._id)}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Edit Post
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Delete Post
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {post.image && (
                <div className="mt-2 mx-auto w-full">
                  {post.image.secure_url.endsWith(".mp4") ? (
                    <video controls className="w-full max-w-full rounded-lg">
                      <source src={post.image.secure_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={post.image.secure_url}
                      alt={post.caption}
                      className="w-full max-w-full rounded-lg"
                    />
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default ShowAllPosts;
