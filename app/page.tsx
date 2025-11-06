"use client";

import { useState } from "react";
import { UserInputForm } from "@/components/user-input-form";
import { PriceMismatchTable } from "@/components/price-mismatch-table";
import { PriceMismatch } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ApiResponse {
  totalEvents: number;
  totalMismatches: number;
  mismatches: PriceMismatch[];
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ApiResponse | null>(null);

  const handleSubmit = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`/api/events?user_id=${userId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch events");
      }

      const data: ApiResponse = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-3">
            SquadUp Price Mismatch Analyzer
          </h1>
          <p className="text-lg text-slate-600">
            Identify pricing tier fee discrepancies across your events
          </p>
        </div>

        <div className="space-y-8">
          <UserInputForm onSubmit={handleSubmit} isLoading={isLoading} />

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results && (
            <PriceMismatchTable
              mismatches={results.mismatches}
              totalEvents={results.totalEvents}
            />
          )}
        </div>

        <footer className="mt-16 text-center text-sm text-slate-500">
          <p>Built with Next.js, TypeScript, and shadcn/ui</p>
        </footer>
      </div>
    </div>
  );
}
