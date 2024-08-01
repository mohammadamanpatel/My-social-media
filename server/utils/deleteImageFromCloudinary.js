import cloudinary from "cloudinary";

// Function to delete an image from Cloudinary using its public ID
async function deleteImageFromCloudinary(publicId) {
  if (!publicId) {
    console.error("No public ID provided for image deletion");
    return;
  }

  console.log("publicId in deleteImageFromCloudinary:", publicId);
    // Call the Cloudinary destroy method to delete the image by its public ID
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("result", result);
    // Check if the image was successfully deleted
    if (result) {
      console.log(`Image with public ID ${publicId} deleted from Cloudinary`);
    } else {
      console.error(
        `Failed to delete image with public ID ${publicId} from Cloudinary. Result: ${result}`
      );
    }
}

export default deleteImageFromCloudinary;
