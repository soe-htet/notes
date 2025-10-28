import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(401)
      .json({ success: false, message: "Email and Password required" });

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "Invalid Credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok)
    return res
      .status(404)
      .json({ success: false, message: "Invalid Credentials" });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  return res.status(200).json({
    success: true,
    message: "Login Success",
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage,
    },
    accessToken,
    refreshToken,
  });
};

export const register = async (req, res) => {
  const { email, password, name = "" } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Email and Password required" });

  const existing = await User.findOne({ email });
  if (existing)
    return res
      .status(409)
      .json({ success: false, message: "Email Already In used" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash, name });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  return res.status(201).json({
    success: true,
    message: "Registeration Success",
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage,
    },
    accessToken,
    refreshToken,
  });
};

export const logout = async (req, res) => {
  const { userId } = req.body;
  if (!userId)
    return res
      .status(400)
      .json({ success: false, message: "UserId is required" });

  try {
    await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
    return res.status(200).json({ success: true, message: "Logout Success" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  try {
    const payload = jwt.verify(refreshToken, "refresh_token_sercret");
    const user = await User.findById(payload.sub);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    if (user.tokenVersion !== payload.tv)
      return res
        .status(401)
        .json({ success: false, message: " token revoked" });
    const newAccess = signAccessToken(user);
    const newRefresh = signRefreshToken(user); // rotation
    return res.json({
      success: true,
      message: "Token refreshed",
      accessToken: newAccess,
      refreshToken: newRefresh,
    });
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: " Something Wrong" });
  }
};
