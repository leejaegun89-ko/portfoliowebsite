import { v2 as cloudinary } from 'cloudinary';

// Cloudinary 응답 타입 정의
interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file: Buffer, resourceType: 'image' | 'video'): Promise<CloudinaryResponse> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: resourceType,
      folder: 'portfolio-media',
    };

    cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result as CloudinaryResponse);
    }).end(file);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
} 