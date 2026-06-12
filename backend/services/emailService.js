import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const isConfigured = Boolean(env.smtpHost && env.smtpUser && env.smtpPass);

const transporter = isConfigured
  ? nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: { user: env.smtpUser, pass: env.smtpPass }
    })
  : null;

export async function sendMail({ to, subject, text, html }) {
  if (!transporter) {
    return {
      delivered: false,
      skipped: true,
      reason: "SMTP is not fully configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS."
    };
  }

  const result = await transporter.sendMail({
    from: env.emailFrom,
    to,
    subject,
    text,
    html
  });

  return {
    delivered: true,
    skipped: false,
    messageId: result.messageId
  };
}

export async function verifyMailer() {
  if (!transporter) {
    return {
      ready: false,
      reason: "SMTP is not fully configured."
    };
  }

  await transporter.verify();
  return { ready: true };
}
