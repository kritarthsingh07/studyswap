import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const isConfigured = Boolean(env.smtpHost && env.smtpUser && env.smtpPass);

if (!isConfigured) {
  console.warn("[EmailService] SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT, EMAIL_FROM in .env to enable emails.");
}

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
    console.warn(`[EmailService] Skipping email to ${to}: SMTP not configured.`);
    return {
      delivered: false,
      skipped: true,
      reason: "SMTP is not fully configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS."
    };
  }

  try {
    const result = await transporter.sendMail({
      from: env.emailFrom,
      to,
      subject,
      text,
      html
    });

    console.log(`[EmailService] Email sent to ${to}: messageId=${result.messageId}`);
    return {
      delivered: true,
      skipped: false,
      messageId: result.messageId
    };
  } catch (error) {
    console.error(`[EmailService] Failed to send email to ${to}:`, error.message);
    return {
      delivered: false,
      skipped: false,
      error: error.message
    };
  }
}

export async function verifyMailer() {
  if (!transporter) {
    return {
      ready: false,
      reason: "SMTP is not fully configured."
    };
  }

  try {
    await transporter.verify();
    console.log("[EmailService] SMTP connection verified.");
    return { ready: true };
  } catch (error) {
    console.error("[EmailService] SMTP verification failed:", error.message);
    return { ready: false, reason: error.message };
  }
}
