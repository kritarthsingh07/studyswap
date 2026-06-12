import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import cloudinary from "../config/cloudinary.js";
import { env } from "../config/env.js";

function hasCloudinaryConfig() {
  return Boolean(env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret);
}

function uploadBufferToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "studyswap/products",
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result.secure_url);
      }
    );

    stream.end(file.buffer);
  });
}

async function saveFileLocally(file) {
  const extension = path.extname(file.originalname || "") || ".jpg";
  const fileName = `${randomUUID()}${extension}`;
  const uploadDir = path.resolve(process.cwd(), "uploads");

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, fileName), file.buffer);

  return `${env.serverUrl}/uploads/${fileName}`;
}

export async function uploadFiles(files = []) {
  if (!files.length) {
    return [];
  }

  if (hasCloudinaryConfig()) {
    return Promise.all(files.map((file) => uploadBufferToCloudinary(file)));
  }

  return Promise.all(files.map((file) => saveFileLocally(file)));
}

export function normalizeImageUrls(imageUrls) {
  if (!imageUrls) {
    return [];
  }

  if (Array.isArray(imageUrls)) {
    return imageUrls.flatMap((value) =>
      String(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    );
  }

  return String(imageUrls)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
