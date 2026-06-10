import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 8 },
    profileImage: { type: String, default: "" },
    college: { type: String, trim: true },
    city: { type: String, trim: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: "" },
    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
