/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";

export default function TrustCalculator(props: { initial?: number }) {
  const [userId, setUserId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: Event) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/trust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const json = await res.json();
      setResult(json);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={submit} className="space-y-2">
        <input
          value={userId}
          onInput={(e: any) => setUserId(e.target.value)}
          placeholder="User ID"
          className="border p-2"
        />
        <button disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded">
          {loading ? "Calculating..." : "Calculate Trust"}
        </button>
      </form>
      {result && (
        <pre className="mt-4 bg-gray-100 p-2 rounded">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
