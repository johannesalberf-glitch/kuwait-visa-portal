import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { findVisa, type VisaRecord } from "@/lib/visa-storage";
import { VisaResult } from "@/components/VisaResult";

export const Route = createFileRoute("/visa/$id")({
  head: () => ({
    meta: [
      { title: "Visa Details — Ministry Visa Lookup" },
      { name: "description", content: "Visa record details." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VisaDetailsPage,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-xl p-8 text-center text-red-600">{error instanceof Error ? error.message : "Something went wrong."}</div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl p-8 text-center text-gray-700">Visa not found.</div>
  ),
});

function VisaDetailsPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const [record, setRecord] = useState<VisaRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    findVisa(id)
      .then((r) => {
        if (!alive) return;
        if (!r) setError("Visa Record Not Found");
        else setRecord(r);
      })
      .catch(() => {
        if (alive) setError("Lookup failed. Please try again.");
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto mb-6 flex max-w-2xl items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <button
          onClick={() => router.history.back()}
          className="text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
      </div>

      {loading && (
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center text-gray-600 shadow">
          Loading visa record…
        </div>
      )}
      {error && !loading && (
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center text-red-600 shadow">
          {error}
        </div>
      )}
      {record && !loading && <VisaResult record={record} />}
    </div>
  );
}
