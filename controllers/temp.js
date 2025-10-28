// middleware/s3-upload.js

import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Configure AWS SDK
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // e.g., 'us-east-1'
});

// --- File Validation Configuration ---
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes
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
    // Reject file and throw an error for Multer
    cb(
      new Error("Invalid file type, only JPG, PNG, WEBP, or GIF is allowed."),
      false
    );
  }
};

// --- Multer-S3 Configuration ---
const s3Storage = multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET_NAME,
  acl: "public-read", // Sets the file permission to public-read (optional)
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    // Create a unique file name using a timestamp and original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `profileImages/${uniqueSuffix}${fileExtension}`); // Key (S3 file path)
  },
});

// --- Multer Initialization ---
export const s3Upload = multer({
  storage: s3Storage,
  limits: {
    fileSize: MAX_FILE_SIZE, // Global size limit
  },
  fileFilter: fileFilter, // Global type limit
}).single("profileImage"); // The field name in your form-data
