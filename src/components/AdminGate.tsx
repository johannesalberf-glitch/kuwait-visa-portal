import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminCheck, adminLogin, adminLogout } from "@/lib/admin-auth.functions";

export function AdminGate({ children }: { children: (logout: () => void) => ReactNode }) {
  const check = useServerFn(adminCheck);
  const login = useServerFn(adminLogin);
  const logout = useServerFn(adminLogout);

  const [status, setStatus] = useState<
    | { state: "loading" }
    | { state: "unauthed" }
    | { state: "authed" }
    | { state: "misconfigured"; error: string }
  >({ state: "loading" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    check()
      .then((r) => {
        if (!alive) return;
        if (!r.configured) {
          setStatus({ state: "misconfigured", error: r.error ?? "Server not configured" });
        } else if (r.authed) {
          setStatus({ state: "authed" });
        } else {
          setStatus({ state: "unauthed" });
        }
      })
      .catch(() => {
        if (!alive) return;
        setStatus({ state: "unauthed" });
      });
    return () => {
      alive = false;
    };
  }, [check]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const username = String(fd.get("username") ?? "");
    const password = String(fd.get("password") ?? "");
    const res = await login({ data: { username, password } });
    setBusy(false);
    if (res.ok) {
      setStatus({ state: "authed" });
    } else {
      setError(res.error);
    }
  }

  async function onLogout() {
    await logout({ data: undefined as never });
    setStatus({ state: "unauthed" });
  }

  if (status.state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600">
        Checking session…
      </div>
    );
  }

  if (status.state === "misconfigured") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 shadow">
          <h1 className="text-lg font-bold text-red-700">Admin unavailable</h1>
          <p className="mt-2 text-sm text-gray-700">{status.error}</p>
        </div>
      </div>
    );
  }

  if (status.state === "unauthed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-xl"
        >
          <h1 className="text-center text-2xl font-bold text-[#0b2a6b]">Admin Login</h1>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Username</label>
            <input
              name="username"
              autoComplete="username"
              defaultValue="admin"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-blue-800 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-blue-900 disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return <>{children(onLogout)}</>;
}
