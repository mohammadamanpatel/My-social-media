import React, { useState, useEffect } from "react";
import { FaHeart, FaComment } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const PostCard = ({ post, imageHeight = "auto", imageWidth = "100%", className }) => {
  console.log("post", post);
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/v1/post/${post._id}/comments`);
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

    fetchComments();
  }, [post._id]);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/v1/post/${post._id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "currentUserId" }), // Replace with actual user ID
      });
      const data = await response.json();
      if (response.ok) {
        setLikes(data.likes);
      } else {
        console.error("Failed to like post:", data.error);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/v1/post/${post._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment }),
      });
      const data = await response.json();
      if (response.ok) {
        setComments([...comments, data]);
        setNewComment("");
      } else {
        console.error("Failed to add comment:", data.error);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className={`block rounded-lg bg-white shadow-md dark:bg-gray-800 mb-8 ${className}`}>
      {/* Post Header */}
      <div className="flex items-center p-4 border-b border-gray-300 dark:border-gray-700">
        <img
          src={post.user.avatar.secure_url}
          alt={post.user.username}
          className="w-12 h-12 rounded-full object-cover mr-3"
        />
        <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
          {post.user.username}
        </p>
      </div>
      {/* Post Media */}
      <div className="relative bg-cover bg-no-repeat" style={{ height: imageHeight, width: imageWidth }}>
        {post.image ? (
          <img
            src={post.image.secure_url}
            alt="Post"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : post.video ? (
          <video
            src={post.video.secure_url}
            controls
            className="w-full h-full object-cover rounded-lg"
          ></video>
        ) : null}
      </div>
      {/* Post Content */}
      <div className="p-4 text-gray-800 dark:text-gray-200">
        {/* Post Title */}
        <h5 className="mb-2 text-xl font-medium">{post.title}</h5>
        {/* Post Description */}
        <p className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {post.caption || "Some quick example text to build on the card title and make up the bulk of the card's content."}
        </p>
        {/* Like and Comment Section */}
        <div className="flex items-center mt-4 space-x-4">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleLike}
            className="text-sm text-gray-600 flex items-center"
          >
            <FaHeart className="h-5 w-5 mr-1" />
            {likes.length} Likes
          </button>
          {/* Comment Button */}
          <button
            type="button"
            className="text-sm text-gray-600 flex items-center"
          >
            <FaComment className="h-5 w-5 mr-1" />
            {comments ? comments.length : 0} Comments
          </button>
        </div>
        {/* Comment Section */}
        <div className="mt-4">
          {Array.isArray(comments) && comments.length > 0 ? (
            comments.slice(0, 1).map((comment, index) => (
              <div key={index} className="flex items-center mb-2">
                <img
                  src={comment.users[0].avatar.secure_url}
                  alt={comment.users[0].username}
                  className="h-6 w-6 rounded-full mr-2 object-cover"
                />
                <span className="font-medium">{comment.users[0].username}</span>
                <span className="ml-2">{comment.text}</span>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
          {/* Toggle Show All Comments Button */}
          {Array.isArray(comments) && comments.length > 1 && (
            <Link
              to={`/comments/${post._id}`}
              className="text-blue-600 font-medium focus:outline-none mt-2"
            >
              See all comments
            </Link>
          )}
          <form onSubmit={handleCommentSubmit} className="flex items-center mt-2">
            <input
              type="text"
              className="flex-1 py-1 px-2 rounded-md border border-gray-300 focus:outline-none"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button type="submit" className="ml-2 text-blue-600 font-medium focus:outline-none">
              Post
            </button>
          </form>
        </div>

        {/* Post Details */}
        <div className="text-xs text-gray-600 mt-4">
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
