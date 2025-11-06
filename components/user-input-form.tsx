"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";

interface UserInputFormProps {
  onSubmit: (userId: string) => void;
  isLoading: boolean;
}

export function UserInputForm({ onSubmit, isLoading }: UserInputFormProps) {
  const [userId, setUserId] = useState("10089636"); // Default to Colonial

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      onSubmit(userId.trim());
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Price Mismatch Lookup</CardTitle>
        <CardDescription>
          Select a venue to analyze event pricing tiers and identify fee mismatches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1">
            <Select
              value={userId}
              onValueChange={setUserId}
              disabled={isLoading}
            >
              <SelectTrigger className="text-base h-11">
                <SelectValue placeholder="Select a venue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10089636">Colonial</SelectItem>
                <SelectItem value="7867604" disabled>
                  Elysian (Coming Soon)
                </SelectItem>
                <SelectItem value="9987142" disabled>
                  Gotham (Coming Soon)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isLoading || !userId.trim()} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
