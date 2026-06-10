import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import hpp from "hpp";
import xss from "xss-clean";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import exchangeRoutes from "./routes/exchangeRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "StudySwap API is healthy." });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/exchange", exchangeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
