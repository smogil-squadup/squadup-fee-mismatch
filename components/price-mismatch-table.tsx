"use client";

import { PriceMismatch } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface PriceMismatchTableProps {
  mismatches: PriceMismatch[];
  totalEvents: number;
}

export function PriceMismatchTable({
  mismatches,
  totalEvents,
}: PriceMismatchTableProps) {
  if (mismatches.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            All Clear!
          </CardTitle>
          <CardDescription>
            Analyzed {totalEvents} {totalEvents === 1 ? "event" : "events"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900">
              No pricing mismatches found. All price tiers follow the correct
              fee structure.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          Price Mismatches Found
        </CardTitle>
        <CardDescription>
          Found {mismatches.length}{" "}
          {mismatches.length === 1 ? "mismatch" : "mismatches"} across{" "}
          {totalEvents} {totalEvents === 1 ? "event" : "events"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead className="text-center">Event ID</TableHead>
                <TableHead>Price Tier</TableHead>
                <TableHead className="text-center">Tier ID</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Current Fee</TableHead>
                <TableHead className="text-right">Expected Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mismatches.map((mismatch) => (
                <TableRow
                  key={`${mismatch.eventId}-${mismatch.priceTierId}`}
                  className="hover:bg-amber-50/50">
                  <TableCell className="font-medium max-w-md">
                    <div className="truncate" title={mismatch.eventName}>
                      {mismatch.eventName}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                      {mismatch.eventId}
                    </code>
                  </TableCell>
                  <TableCell>{mismatch.priceTierName}</TableCell>
                  <TableCell className="text-center">
                    <a
                      href={`https://www.squadup.com/admin/price_tiers/${mismatch.priceTierId}/edit`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 transition-colors inline-block font-mono text-blue-600 hover:text-blue-800 underline decoration-dotted underline-offset-2">
                      {mismatch.priceTierId}
                    </a>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${(mismatch.price ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="destructive" className="font-mono">
                      ${(mismatch.squadupFeeDollar ?? 0).toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className="font-mono border-green-600 text-green-700">
                      ${(mismatch.expectedFee ?? 0).toFixed(2)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p className="font-medium mb-1">Fee Rules:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Price ≤ $12.00 → SquadUp fee should be $1.00</li>
            <li>Price &gt; $12.00 → SquadUp fee should be $2.00</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
