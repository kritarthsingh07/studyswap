import { body } from "express-validator";

export const contactValidator = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("Valid email is required."),
  body("subject").trim().notEmpty().withMessage("Subject is required."),
  body("message").trim().notEmpty().withMessage("Message is required.")
];
