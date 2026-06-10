import cloudinary from "../config/cloudinary.js";

export async function uploadImages(imagePayloads = []) {
  if (!imagePayloads.length) {
    return [];
  }

  const uploaded = await Promise.all(
    imagePayloads.map((file) =>
      cloudinary.uploader.upload(file, {
        folder: "studyswap/products"
      })
    )
  );

  return uploaded.map((item) => item.secure_url);
}
