import cloudinary from "cloudinary";

async function deleteVideoFromCloudinary(publicId) {
  const result = await cloudinary.v2.uploader.destroy(publicId, {
    resource_type: "video",
  });
  if(result){
    console.log(`video file deleted from cloudinary`);
  }
  else{
    console.log(`video file not deleted from cloudinary`);
  }
}

export default deleteVideoFromCloudinary;
