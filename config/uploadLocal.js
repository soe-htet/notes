import fs from "fs";
import path from "path";
import multer from "multer";

const uploadRoot = process.env.UPLOAD_ROOT || "uploads";
const profileImgUrl = "profileImages";
const absProfileImgDr = path.join(process.cwd(), uploadRoot, profileImgUrl);
if (!fs.existsSync(absProfileImgDr))
  fs.mkdirSync(absProfileImgDr, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, absProfileImgDr),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${req.user._id}_${Date.now()}${ext}`);
  },
});

export const uploadProfileImgLocal = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // max 2MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/"))
      return cb(new Error("Only images allowed"));
    cb(null, true);
  },
});

export function buildProfileUrl(filename, req) {
  const base =
    process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
  return `${base}/static/profileImages/${filename}`;
}
