import { ApiError } from "../utils/apiError.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { User } from "../models/User.js";

export async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, "Authentication required."));
  }

  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    return next(new ApiError(401, "User no longer exists."));
  }

  req.user = user;
  next();
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "You are not allowed to perform this action."));
    }

    next();
  };
}
