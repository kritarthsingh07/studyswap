import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpPort === 465,
  auth: env.smtpUser && env.smtpPass ? { user: env.smtpUser, pass: env.smtpPass } : undefined
});

export async function sendMail({ to, subject, text, html }) {
  if (!env.smtpHost) {
    return { skipped: true };
  }

  return transporter.sendMail({
    from: env.emailFrom,
    to,
    subject,
    text,
    html
  });
}
