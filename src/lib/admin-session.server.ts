// Server-only shared admin session config.
import { createHash } from "node:crypto";

export type AdminSession = { authed?: boolean };

export function getAdminSessionConfig() {
  const pw = process.env.ADMIN_PASSWORD || "admin1234admin";
  const password = createHash("sha256")
    .update(`${pw}::session-secret::v1`)
    .digest("hex");
  const isProd = process.env.NODE_ENV === "production";
  return {
    password,
    name: "admin-session",
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: (isProd ? "none" : "lax") as "none" | "lax",
      path: "/",
    },
  };
}
