import crypto from "crypto";
import { User } from "../models/User.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { refreshCookieOptions } from "../utils/cookies.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/jwt.js";
import { sendMail } from "../services/emailService.js";

function buildAuthPayload(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    college: user.college,
    city: user.city,
    profileImage: user.profileImage,
    emailVerified: user.emailVerified
  };
}

async function issueTokens(user, res) {
  const accessToken = signAccessToken({ userId: user._id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user._id });

  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  return accessToken;
}

export const register = asyncHandler(async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const emailVerificationToken = crypto.randomBytes(24).toString("hex");
  const user = await User.create({
    ...req.body,
    emailVerificationToken
  });

  await sendMail({
    to: user.email,
    subject: "Verify your StudySwap account",
    text: `Your verification token is: ${emailVerificationToken}`
  });

  const accessToken = await issueTokens(user, res);

  res.status(201).json({
    success: true,
    message: "Account created successfully.",
    accessToken,
    user: buildAuthPayload(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const accessToken = await issueTokens(user, res);

  res.json({
    success: true,
    message: "Logged in successfully.",
    accessToken,
    user: buildAuthPayload(user)
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }

  res.clearCookie("refreshToken", refreshCookieOptions);
  res.json({ success: true, message: "Logged out successfully." });
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is missing.");
  }

  const tokenRecord = await RefreshToken.findOne({ token: refreshToken });
  if (!tokenRecord) {
    throw new ApiError(401, "Refresh token is invalid.");
  }

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }

  const accessToken = signAccessToken({ userId: user._id, role: user.role });
  res.json({ success: true, accessToken, user: buildAuthPayload(user) });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new ApiError(404, "No account found for that email.");
  }

  const resetToken = crypto.randomBytes(24).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  await sendMail({
    to: user.email,
    subject: "StudySwap password reset",
    text: `Your password reset token is: ${resetToken}`
  });

  res.json({ success: true, message: "Password reset instructions sent." });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpires: { $gt: new Date() }
  });

  if (!user) {
    throw new ApiError(400, "Reset token is invalid or expired.");
  }

  user.password = req.body.password;
  user.resetPasswordToken = "";
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successfully." });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ emailVerificationToken: req.params.token });
  if (!user) {
    throw new ApiError(400, "Verification token is invalid.");
  }

  user.emailVerified = true;
  user.emailVerificationToken = "";
  await user.save();

  res.json({ success: true, message: "Email verified successfully." });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: buildAuthPayload(req.user) });
});
