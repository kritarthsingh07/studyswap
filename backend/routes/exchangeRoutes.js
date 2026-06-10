import express from "express";
import {
  createExchange,
  getExchanges,
  updateExchangeStatus
} from "../controllers/exchangeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/", getExchanges);
router.post("/", createExchange);
router.patch("/:id", updateExchangeStatus);

export default router;
