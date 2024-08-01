import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const EditPost = () => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [originalPost, setOriginalPost] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`/api/v1/post/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post data");
        }
        const data = await response.json();
        setOriginalPost(data);
        setCaption(data.caption);
        setPreviewUrl(data.image?.secure_url || data.video?.secure_url);
      } catch (error) {
        console.error("Error fetching post data:", error);
        toast.error("Failed to fetch post data");
      }
    };

    fetchPostData();
  }, [id]);

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
    formData.append("caption", caption);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch(`/api/v1/post/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      toast.success("Post updated successfully");
      navigate("/profile/showallposts");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    }
  };

  if (!originalPost) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-screen-lg mt-8 p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={handleSubmit} className="space-y-6">
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
            className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
          />
          {previewUrl && (
            <div className="mt-2">
              {originalPost.image ? (
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
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditPost;
