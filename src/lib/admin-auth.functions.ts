import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { getAdminSessionConfig, type AdminSession } from "./admin-session.server";

function getSessionConfig() {
  return getAdminSessionConfig();
}

function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD || "admin1234admin";
    if (data.username !== "admin" || !passwordMatches(data.password, expected)) {
      return { ok: false as const, error: "Invalid username or password." };
    }
    const session = await useSession<AdminSession>(getSessionConfig());
    await session.update({ authed: true });
    return { ok: true as const };
  });

export const adminCheck = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const session = await useSession<AdminSession>(getSessionConfig());
    return { authed: !!session.data.authed, configured: true };
  } catch (e) {
    return {
      authed: false,
      configured: false,
      error: e instanceof Error ? e.message : "Server not configured",
    };
  }
});

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const session = await useSession<AdminSession>(getSessionConfig());
    await session.clear();
  } catch {
    // ignore
  }
  return { ok: true as const };
});
