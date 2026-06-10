import express from "express";
import { getAdminOverview } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/overview", getAdminOverview);

export default router;
