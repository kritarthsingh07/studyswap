import { Wishlist } from "../models/Wishlist.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function getOrCreateWishlist(userId) {
  let wishlist = await Wishlist.findOne({ user: userId }).populate("items");
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, items: [] });
  }
  return wishlist;
}

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  await wishlist.populate("items");
  res.json({ success: true, wishlist });
});

export const addWishlistItem = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);

  if (!wishlist.items.some((item) => String(item) === req.body.productId)) {
    wishlist.items.push(req.body.productId);
    await wishlist.save();
  }

  await wishlist.populate("items");
  res.json({ success: true, wishlist });
});

export const removeWishlistItem = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  wishlist.items = wishlist.items.filter((item) => String(item) !== req.params.productId);
  await wishlist.save();
  await wishlist.populate("items");
  res.json({ success: true, wishlist });
});
