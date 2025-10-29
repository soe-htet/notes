import { buildProfileUrl } from "../config/uploadLocal.js";
import User from "../models/User.js";

import fs from "fs/promises";
import path from "path";

import {
  s3UploadMiddleware,
  s3Client,
  DeleteObjectCommand,
} from "../config/s3upload.js";
import multer from "multer";
import { URL } from "url";

export const getMe = async (req, res) => {
  // handle in middleware
  console.log(req.user);
  return res.status(200).json({
    success: true,
    message: "Profile Success",
    user: req.user,
  });
};

export const updateMe = async (req, res) => {
  // handle in middleware

  const { name } = req.body;

  if (!name)
    return res
      .status(401)
      .json({ success: false, message: "Name is required" });

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Profile Updating Success",
      user: updateUser,
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Something Wrong" });
  }
};

export const updateProfileImage = async (req, res) => {
  // 'f' (file) is expected to be populated by a middleware like Multer.
  const f = req.file;

  // 1. Initial file check (validation should ideally be done in middleware)
  if (!f) {
    return res
      .status(400)
      .json({ error: "No file provided or upload failed." });
  }

  // Store the temporary file path for cleanup later
  const newFilePath = f.path;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      // If the user isn't found, delete the newly uploaded file
      await fs.unlink(newFilePath).catch(() => {});
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Delete the old profile image from disk
    if (user.profileImage) {
      // Safely extract filename from the URL stored in the DB
      const oldFilename = path.basename(user.profileImage);
      const oldFilePath = path.join(
        process.cwd(),
        "uploads",
        "profileImages", // Ensure this matches your upload directory
        oldFilename
      );

      // Use fs.unlink with a catch block to ignore errors
      // if the old file is already missing (e.g., deleted manually).
      await fs.unlink(oldFilePath).catch(() => {});
    }

    // 3. Update the database record
    user.profileImage = buildProfileUrl(f.filename, req);
    await user.save(); // CRITICAL: If this fails, the file needs to be cleaned up!

    // 4. Success response
    res.json({ profileImageUrl: user.profileImage });
  } catch (err) {
    console.error(`Profile upload error for user ${req.user._id}:`, err);

    // 5. CRITICAL CLEANUP: Delete the new file if the database update failed.
    // This runs if any error occurs (DB save failed, user lookup failed, etc.)
    // We use the stored path 'newFilePath' from the temporary upload location.
    await fs.unlink(newFilePath).catch(() => {});

    // 6. Send error response
    res
      .status(500)
      .json({ error: "Profile image update failed due to a server error." });
  }
};

export const updateProfileImg = (req, res) => {
  // Execute the Multer-S3 middleware
  s3UploadMiddleware(req, res, async (err) => {
    // --- 1. Handle Upload Errors (Size/Type Limits) ---
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "File size limit exceeded (Max 5MB)." });
      }
      return res
        .status(400)
        .json({ error: `File upload failed: ${err.message}` });
    } else if (err) {
      // Handle custom errors from fileFilter
      return res.status(400).json({ error: err.message });
    }

    const f = req.file; // optional file
    const { name } = req.body; // The uploaded file object from multer-s3

    if (!f && !(typeof name === "string" && name.trim())) {
      return res.status(400).json({ error: "No changes provided." });
    }

    try {
      // The Key for the newly uploaded file (used for cleanup if DB fails)

      const user = await User.findById(req.user._id);
      if (!user) {
        // If user not found, delete the new file from S3 immediately
        if (f?.key) await deleteS3Object(f.key).catch(() => {});
        return res.status(404).json({ error: "User not found." });
      }

      if (f) {
        if (user.profileImage) {
          // Extract the S3 Key from the stored URL
          try {
            const oldFileKey = new URL(user.profileImage).pathname.substring(1);
            await deleteS3Object(oldFileKey);
          } catch {}
        }
        user.profileImage = f.location;
      }

      if (typeof name === "string" && name.trim()) {
        user.name = name.trim();
      }
      await user.save();

      // Success
      res.json({
        success: true,
        user: user,
        profileImageUrl: user.profileImage || "",
      });
    } catch (dbErr) {
      console.error(`Profile upload failed for user ${req.user._id}:`, dbErr);

      // --- 4. CRITICAL CLEANUP: Delete the new file if DB save failed ---
      // This ensures no orphaned files are left on S3 if the transaction fails
      if (f && f.key) {
        await deleteS3Object(f.key);
      }

      res
        .status(500)
        .json({ error: "Profile image update failed due to a server error." });
    }
  });
};

/**
 * Helper function to safely delete an object from S3 using the v3 SDK Command pattern.
 * Ignores errors to ensure the main flow is not blocked if the file is already gone.
 */
async function deleteS3Object(key) {
  if (!key) return;
  try {
    const deleteParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };
    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    // Log the deletion error but allow the application to continue
    console.warn(
      `S3 Deletion Warning: Failed to delete object with key ${key}. Error: ${error.message}`
    );
  }
}
