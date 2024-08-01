import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  useEffect(() => {
    if (selectedOption === "story") {
      navigate("/create-story");
    }
  }, [selectedOption, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedOption === "story") {
      navigate("/create-story");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("file", file);

    try {
      const response = await fetch("/api/v1/post", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      toast.success("Post created successfully");
      setCaption("");
      setFile(null);
      setPreviewUrl("");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    }
  };

  return (
    <div className="container mx-auto max-w-screen-lg mt-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="caption"
            className="block text-sm font-medium text-gray-700"
          >
            Caption
          </label>
          <input
            type="text"
            id="caption"
            name="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Image/Video
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            accept="image/*, video/*"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            required
          />
          {previewUrl && (
            <div className="mt-2">
              {file.type.startsWith("image") ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded-lg shadow-md"
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  className="w-full max-h-64 object-contain rounded-lg shadow-md"
                ></video>
              )}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="option"
            className="block text-sm font-medium text-gray-700"
          >
            Select Option
          </label>
          <select
            id="option"
            name="option"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900"
          >
            <option value="post">Post</option>
            <option value="story">Story</option>
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
