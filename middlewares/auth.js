import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });

    const payload = jwt.verify(token, "access_token_secret");

    const user = await User.findById(payload.sub).select(
      "_id email name profileImage tokenVersion"
    );
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User Not found." });

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
