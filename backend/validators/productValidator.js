import { body, query } from "express-validator";

export const productValidator = [
  body("title").trim().notEmpty().withMessage("Title is required."),
  body("description").trim().notEmpty().withMessage("Description is required."),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number."),
  body("category").trim().notEmpty().withMessage("Category is required."),
  body("condition").trim().notEmpty().withMessage("Condition is required.")
];

export const productQueryValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive number."),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50.")
];
