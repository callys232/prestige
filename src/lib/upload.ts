import { Readable } from "stream";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary"; // 👈 import UploadApiResponse here

/**
 * Uploads a single file buffer to Cloudinary.
 */
export const uploadSingleFile = async (
  fileBuffer: Buffer,
  filename?: string,
  folder = "",
  resourceType: "auto" | "image" | "raw" | "video" = "auto"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: filename, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("No result from Cloudinary"));
        resolve(result); // ✅ already typed
      }
    );

    Readable.from(fileBuffer).pipe(stream);
  });
};

/**
 * Uploads multiple file buffers to Cloudinary.
 */
export const uploadMultipleFiles = async (
  files: { buffer: Buffer; filename?: string }[],
  folder = "",
  resourceType: "auto" | "image" | "raw" | "video" = "auto"
): Promise<UploadApiResponse[]> => {
  const uploadPromises = files.map((file) =>
    uploadSingleFile(file.buffer, file.filename, folder, resourceType)
  );

  return Promise.all(uploadPromises);
};
