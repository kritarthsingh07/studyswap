import { env } from "../config/env.js";

export const refreshCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.cookieSecure,
  maxAge: 7 * 24 * 60 * 60 * 1000
};
