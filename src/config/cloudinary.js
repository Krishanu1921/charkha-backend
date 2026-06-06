import "./loadEnv.js";
import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"

cloudinary.config(
  {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  }
)

export default cloudinary;

const uploadOnCloudinary = async (localFilePath)=>{
  try {
    // console.log(process.env.CLOUDINARY_CLOUD_NAME);
    // console.log(process.env.CLOUDINARY_API_KEY);
    // console.log(process.env.CLOUDINARY_API_SECRET);

    if(!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type : "auto"
    });
    console.log("File is uploaded on Cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;

  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.log(error);
    return null;
  }
};

export {uploadOnCloudinary};