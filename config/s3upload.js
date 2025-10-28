// /middleware/s3-upload.js

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// --- AWS S3 Client Initialization (v3) ---
// Note: It's best practice to use environment variables for credentials
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION, // e.g., 'us-east-1'
});

// --- File Validation Configuration ---
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    // Reject file and pass an error message
    cb(
      new Error("Invalid file type. Only JPG, PNG, WEBP, or GIF are allowed."),
      false
    );
  }
};

// --- Multer-S3 Storage Configuration ---
const s3Storage = multerS3({
  s3: s3Client, // Pass the S3Client instance
  bucket: process.env.S3_BUCKET_NAME,
  acl: "public-read", // Makes the file publicly accessible via URL
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    // Define the unique S3 file path (Key)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `profileImages/${uniqueSuffix}${fileExtension}`);
  },
});

// --- Multer Initialization ---
export const s3UploadMiddleware = multer({
  storage: s3Storage,
  limits: {
    fileSize: MAX_FILE_SIZE, // Enforce size limit
  },
  fileFilter: fileFilter, // Enforce type limit
}).single("profileImage"); // The expected form field name

// Export the client for use in the controller to handle deletion
export { s3Client, DeleteObjectCommand };
