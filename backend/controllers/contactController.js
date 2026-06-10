import { Contact } from "../models/Contact.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendMail } from "../services/emailService.js";

export const submitContact = asyncHandler(async (req, res) => {
  const contact = await Contact.create(req.body);

  await sendMail({
    to: req.body.email,
    subject: "We received your StudySwap message",
    text: "Thanks for contacting StudySwap. Our team will get back to you soon."
  });

  res.status(201).json({
    success: true,
    message: "Message sent successfully.",
    contact
  });
});
