import express from "express";
import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/", getWishlist);
router.post("/", addWishlistItem);
router.delete("/:productId", removeWishlistItem);

export default router;
