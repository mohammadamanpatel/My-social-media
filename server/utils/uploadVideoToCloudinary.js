import cloudinary from "cloudinary";

const uploadVideoToCloudinary = async (filePath, folder) => {
  const result = await cloudinary.v2.uploader.upload(filePath, {
    resource_type: "video",
    folder,
  });
  return result;
};

export default uploadVideoToCloudinary;
