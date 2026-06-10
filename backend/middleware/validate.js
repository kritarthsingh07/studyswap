import { validationResult } from "express-validator";
import { ApiError } from "../utils/apiError.js";

export function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new ApiError(422, errors.array().map((item) => item.msg).join(", ")));
  }

  next();
}
