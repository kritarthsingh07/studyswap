import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const updateProfile = asyncHandler(async (req, res) => {
  const fields = ["name", "phone", "college", "city", "profileImage"];
  fields.forEach((field) => {
    if (typeof req.body[field] !== "undefined") {
      req.user[field] = req.body[field];
    }
  });

  await req.user.save();
  res.json({ success: true, user: req.user });
});

export const changePassword = asyncHandler(async (req, res) => {
  req.user.password = req.body.password;
  await req.user.save();
  res.json({ success: true, message: "Password updated successfully." });
});

export const getDashboard = asyncHandler(async (req, res) => {
  const [listings, orders] = await Promise.all([
    Product.find({ seller: req.user._id }).populate("category", "name slug"),
    []
  ]);

  res.json({
    success: true,
    dashboard: {
      user: req.user,
      listings,
      orders
    }
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ success: true, users });
});
