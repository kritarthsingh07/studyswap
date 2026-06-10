import express from "express";
import {
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  register,
  resetPassword,
  verifyEmail
} from "../controllers/authController.js";
import {
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator
} from "../validators/authValidator.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/logout", logout);
router.get("/refresh", refresh);
router.post("/forgot-password", forgotPasswordValidator, validate, forgotPassword);
router.post("/reset-password", resetPasswordValidator, validate, resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.get("/me", protect, me);

export default router;
