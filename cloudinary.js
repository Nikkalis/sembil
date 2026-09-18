import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const cloudinaryUploadImage = async (fileToUpload, uid) => {
    
    const options = {
      resource_type: "auto",
      public_id: `${uid}_profile-picture`,
      unique_filename: false,
      overwrite: true,
      upload_preset: "sembil_pfp_signed"
    };
    
    try {
      const data = await cloudinary.uploader.upload(fileToUpload, options);
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Internal Server Error (cloudinary)");
    }
  };

  const cloudinaryRemoveImage = async (imagePublicId) => {
    try {
      const result = await cloudinary.uploader.destroy(imagePublicId);
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Internal Server Error (cloudinary)");
    }
  };

  const cloudinaryRemoveMultipleImage = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds)
    return result;
  } catch (error) {
    console.log(error);
      throw new Error("Internal Server Error (cloudinary)");
  }
};

export { cloudinaryUploadImage, cloudinaryRemoveImage, cloudinaryRemoveMultipleImage };