import express from "express";
import {
  createProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductById,
  getProducts,
  updateProduct
} from "../controllers/productController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { productQueryValidator, productValidator } from "../validators/productValidator.js";

const router = express.Router();

router.get("/", productQueryValidator, validate, getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);
router.post("/", protect, productValidator, validate, createProduct);
router.put("/:id", protect, productValidator, validate, updateProduct);
router.delete("/:id", protect, authorize("admin", "user"), deleteProduct);

export default router;
