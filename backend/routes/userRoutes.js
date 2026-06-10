import express from "express";
import {
  changePassword,
  getDashboard,
  listUsers,
  updateProfile
} from "../controllers/userController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/dashboard", getDashboard);
router.put("/profile", updateProfile);
router.put("/password", changePassword);
router.get("/", authorize("admin"), listUsers);

export default router;
