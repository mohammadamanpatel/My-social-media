import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const DeletePost = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log("id for deletion of posts", id);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/v1/post/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`, // Assuming token is available in currentUser
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.message === "Post deleted") {
        toast.success("Post deleted successfully!");
        navigate("/profile/showallposts");
      } else {
        throw new Error(data.message || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(error.message || "Failed to delete post");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">Delete Post</h2>
        <p className="text-center">Are you sure you want to delete this post?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate("/profile/showallposts")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md mr-2 w-full sm:w-auto"
          >
            No
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePost;
