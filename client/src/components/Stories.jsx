import React, { useState, useEffect } from "react";
import { FaHeart, FaPlayCircle, FaPauseCircle } from "react-icons/fa";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState({});
  const currentUserId = "currentUserId"; // Replace with the actual current user ID

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("/api/v1/story/stories?page=1&limit=10");
        if (!response.ok) {
          throw new Error("Failed to fetch stories");
        }
        const storiesData = await response.json();
        setStories(storiesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleToggleLike = async (storyId) => {
    try {
      const response = await fetch(`/api/v1/story/${storyId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUserId }),
      });

      const data = await response.json();
      if (response.ok) {
        setStories((prevStories) =>
          prevStories.map((story) =>
            story._id === storyId ? { ...story, likes: data.likes } : story
          )
        );
      } else {
        console.error("Failed to like/unlike the story:", data.error);
      }
    } catch (error) {
      console.error("Error liking/unliking the story:", error);
    }
  };

  const handlePlayPause = (storyId) => {
    setPlaying((prevPlaying) => {
      const isPlaying = !prevPlaying[storyId];
      const videoElement = document.getElementById(`video-${storyId}`);
      if (videoElement) {
        if (isPlaying) {
          videoElement.play();
        } else {
          videoElement.pause();
        }
      }
      return { ...prevPlaying, [storyId]: isPlaying };
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-4 max-w-4xl w-full h-[70vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Stories</h2>
        {loading ? (
          <p>Loading stories...</p>
        ) : stories.length === 0 ? (
          <p>No stories found.</p>
        ) : (
          <div className="space-y-4 flex flex-col">
            {stories.map((story) => (
              <div
                key={story._id}
                className="rounded-lg overflow-hidden shadow-md mb-4 flex flex-col justify-center items-center w-full"
              >
                <div className="relative w-full flex flex-col items-center">
                  {story.Storymedia && story.Storymedia.secure_url && (
                    <>
                      {story.Storymedia.secure_url.endsWith(".mp4") ? (
                        <div className="flex justify-center items-center w-full h-64 md:h-96">
                          <video
                            id={`video-${story._id}`}
                            src={story.Storymedia.secure_url}
                            className="object-contain w-full h-full"
                          />
                          <div
                            className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-20"
                            onClick={() => handlePlayPause(story._id)}
                          >
                            {playing[story._id] ? (
                              <FaPauseCircle className="text-white text-6xl cursor-pointer opacity-70" />
                            ) : (
                              <FaPlayCircle className="text-white text-6xl cursor-pointer opacity-70" />
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center items-center w-full h-64 md:h-96">
                          <img
                            src={story.Storymedia.secure_url}
                            alt="Story Media"
                            className="object-contain w-full h-full"
                          />
                        </div>
                      )}
                    </>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white flex items-center justify-between w-full">
                    <div className="flex items-center space-x-5">
                      <FaHeart
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleToggleLike(story._id)}
                      />
                      <span className="text-sm">{story.likes.length} likes</span>
                    </div>
                    <p className="text-sm font-semibold">{story.user.username}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;
