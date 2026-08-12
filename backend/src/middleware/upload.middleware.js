import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.js";

const imageParams = {
  folder: "kravionatech/images",
  // Store one optimized canonical asset regardless of the source image type.
  // Cloudinary applies this before persisting the asset, not only at delivery.
  format: "webp",
  transformation: [
    {
      width: 1920,
      height: 1920,
      crop: "limit",
      quality: "auto:good",
    },
  ],
};

const postImageStorage = new CloudinaryStorage({
  cloudinary,
  params: imageParams,
});

const mediaStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder: file.mimetype.startsWith("image/")
      ? "kravionatech/images"
      : "kravionatech/media",
    resource_type: file.mimetype.startsWith("video/")
      ? "video"
      : file.mimetype.startsWith("image/")
        ? "image"
        : "raw",
    ...(file.mimetype.startsWith("image/") ? imageParams : {}),
  }),
});

const allowedMediaTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/x-matroska",
  "video/webm",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
];

const mediaFileFilter = (_req, file, callback) => {
  if (file.mimetype.startsWith("image/") || allowedMediaTypes.includes(file.mimetype)) {
    callback(null, true);
    return;
  }

  callback(new Error("Unsupported file type"), false);
};

export const uploadMiddleware = multer({
  storage: postImageStorage,
  fileFilter: (_req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
      return;
    }

    callback(new Error("Only image files are supported"), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("featuredImage");

// Kept under the existing export name so the media route and its public API
// remain unchanged while files now go straight to Cloudinary.
export const upload = multer({
  storage: mediaStorage,
  fileFilter: mediaFileFilter,
  limits: { fileSize: 1024 * 1024 * 1024 },
});
