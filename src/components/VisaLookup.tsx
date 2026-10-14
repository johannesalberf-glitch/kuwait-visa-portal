import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { findVisa } from "@/lib/visa-storage";

export function VisaLookup() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = (inputRef.current?.value ?? "").trim();
    if (!query) {
      setError("Please enter a valid OTP code, Tracking code, or Passport number.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const found = await findVisa(query);
      if (!found) {
        setError("Visa Record Not Found");
        setLoading(false);
        return;
      }
      await navigate({ to: "/visa/$id", params: { id: found.id } });
    } catch {
      setError("Lookup failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl animate-in fade-in duration-300 rounded-2xl bg-white p-8 shadow-xl">
      <h3 className="text-center text-2xl font-bold text-[#0b2a6b]">OTP or Tracking Code</h3>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input
          ref={inputRef}
          name="otp"
          type="text"
          defaultValue=""
          placeholder="Enter 6-Digit OTP or Tracking Code"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base tracking-widest text-gray-900 outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-200"
        />
        {error && (
          <p className="animate-in fade-in duration-300 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 disabled:opacity-60"
        >
          {loading ? "Checking…" : "Submit"}
        </button>
      </form>
    </div>
  );
}
