import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  await cart.populate("items.product");
  res.json({ success: true, cart });
});

export const addToCart = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.body.productId);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find((item) => String(item.product) === req.body.productId);

  if (existingItem) {
    existingItem.quantity += Number(req.body.quantity || 1);
  } else {
    cart.items.push({
      product: req.body.productId,
      quantity: Number(req.body.quantity || 1)
    });
  }

  await cart.save();
  await cart.populate("items.product");
  res.json({ success: true, cart });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);
  if (!item) {
    throw new ApiError(404, "Cart item not found.");
  }

  item.quantity = Number(req.body.quantity || 1);
  await cart.save();
  await cart.populate("items.product");
  res.json({ success: true, cart });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);
  if (!item) {
    throw new ApiError(404, "Cart item not found.");
  }

  item.deleteOne();
  await cart.save();
  await cart.populate("items.product");
  res.json({ success: true, cart });
});
