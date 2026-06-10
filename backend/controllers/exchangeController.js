import { Exchange } from "../models/Exchange.js";
import { Product } from "../models/Product.js";
import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const getExchanges = asyncHandler(async (req, res) => {
  const exchanges = await Exchange.find({
    $or: [{ requester: req.user._id }, { owner: req.user._id }]
  })
    .populate("offeredProduct requestedProduct", "title images price")
    .populate("requester owner", "name");

  res.json({ success: true, exchanges });
});

export const createExchange = asyncHandler(async (req, res) => {
  const requestedProduct = await Product.findById(req.body.requestedProduct);
  const offeredProduct = await Product.findById(req.body.offeredProduct);

  if (!requestedProduct || !offeredProduct) {
    throw new ApiError(404, "Both exchange products must exist.");
  }

  const exchange = await Exchange.create({
    requester: req.user._id,
    owner: requestedProduct.seller,
    offeredProduct: req.body.offeredProduct,
    requestedProduct: req.body.requestedProduct
  });

  await Notification.create({
    user: requestedProduct.seller,
    title: "New exchange request",
    message: `${req.user.name} requested an exchange for ${requestedProduct.title}.`,
    type: "exchange"
  });

  res.status(201).json({ success: true, exchange });
});

export const updateExchangeStatus = asyncHandler(async (req, res) => {
  const exchange = await Exchange.findById(req.params.id);
  if (!exchange) {
    throw new ApiError(404, "Exchange not found.");
  }

  if (String(exchange.owner) !== String(req.user._id) && req.user.role !== "admin") {
    throw new ApiError(403, "You cannot update this exchange.");
  }

  exchange.status = req.body.status;
  await exchange.save();

  await Notification.create({
    user: exchange.requester,
    title: `Exchange ${req.body.status}`,
    message: `Your exchange request has been marked as ${req.body.status}.`,
    type: "exchange"
  });

  res.json({ success: true, exchange });
});
