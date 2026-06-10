import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5500",
  jwtSecret: process.env.JWT_SECRET || "change-me",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "change-me-too",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  cookieSecure: process.env.COOKIE_SECURE === "true",
  clientUrl: process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5500",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  emailFrom: process.env.EMAIL_FROM || "no-reply@studyswap.local"
};
