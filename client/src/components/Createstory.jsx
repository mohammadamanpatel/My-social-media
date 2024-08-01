import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const CreateStory = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/v1/story", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create story");
      }

      toast.success("Story created successfully");
      setFile(null);
      setPreviewUrl("");
    } catch (error) {
      console.error("Error creating story:", error);
      toast.error("Failed to create story");
    }
  };

  return (
    <div className="container mx-auto max-w-screen-lg mt-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleSubmit}>
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
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Story
        </button>
      </form>
    </div>
  );
};

export default CreateStory;
