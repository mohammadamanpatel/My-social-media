import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const AllComments = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchAllComments = async () => {
      try {
        const response = await fetch(`/api/v1/post/${postId}/comments`);
        const data = await response.json();
        if (response.ok) {
          setComments(data);
        } else {
          console.error("Failed to fetch comments:", data.error);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchAllComments();
  }, [postId]);

  return (
    <div className="w-full max-w-full md:max-w-xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-semibold mb-4 text-center md:text-left">
        All Comments for Post
      </h1>
      {comments.length === 0 && (
        <p className="text-gray-500 text-center">No comments yet.</p>
      )}
      {comments.map((comment, index) => (
        <div key={index} className="flex items-start mb-4">
          {/* Avatar */}
          <img
            src={comment.users[0].avatar.secure_url}
            alt={comment.username}
            className="h-10 w-10 rounded-full object-cover mr-2"
          />
          {/* Comment Content */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex-1">
            <p className="text-gray-800 dark:text-gray-300 font-medium mb-1">
              {comment.username}
            </p>
            <p className="text-gray-700 dark:text-gray-400">{comment.text}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllComments;
