import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadImages } from "../services/uploadService.js";

function buildProductFilters(query) {
  const filters = { status: "active" };

  if (query.category) {
    filters.category = query.category;
  }

  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) filters.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filters.price.$lte = Number(query.maxPrice);
  }

  if (query.search) {
    filters.$text = { $search: query.search };
  }

  return filters;
}

export const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 12);
  const skip = (page - 1) * limit;
  const sort = req.query.sort || "-createdAt";
  const filters = buildProductFilters(req.query);

  const [products, total] = await Promise.all([
    Product.find(filters)
      .populate("seller", "name college city")
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filters)
  ]);

  res.json({
    success: true,
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: "active" })
    .populate("category", "name slug")
    .populate("seller", "name")
    .sort({ createdAt: -1 })
    .limit(6);

  res.json({ success: true, products });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("seller", "name college city")
    .populate("category", "name slug");

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  product.views += 1;
  await product.save();

  res.json({ success: true, product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  const images = await uploadImages(req.body.images || []);
  const product = await Product.create({
    ...req.body,
    images: images.length ? images : req.body.images || [],
    seller: req.user._id
  });

  const populated = await product.populate("category", "name slug");
  res.status(201).json({ success: true, product: populated });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  if (String(product.seller) !== String(req.user._id) && req.user.role !== "admin") {
    throw new ApiError(403, "You cannot update this product.");
  }

  Object.assign(product, req.body);
  await product.save();

  const populated = await product.populate("category", "name slug");
  res.json({ success: true, product: populated });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  if (String(product.seller) !== String(req.user._id) && req.user.role !== "admin") {
    throw new ApiError(403, "You cannot delete this product.");
  }

  await product.deleteOne();
  res.json({ success: true, message: "Product deleted successfully." });
});
