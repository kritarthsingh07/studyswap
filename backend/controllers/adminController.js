import { Contact } from "../models/Contact.js";
import { Exchange } from "../models/Exchange.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAdminOverview = asyncHandler(async (req, res) => {
  const [users, products, exchanges, contacts] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Exchange.countDocuments(),
    Contact.countDocuments()
  ]);

  res.json({
    success: true,
    analytics: {
      users,
      products,
      exchanges,
      contacts
    }
  });
});
