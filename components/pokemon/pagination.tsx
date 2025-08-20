"use client";
import { useQueryParams } from "@/hooks/use-query-params";
import { Button } from "@/components/ui/button";

export function Pagination({ total, pageSize = 24 }: { total: number; pageSize?: number }) {
  const { get, setMany } = useQueryParams();
  const page = Math.max(1, parseInt(get("page") || "1", 10));
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const goto = (p: number) => setMany({ page: p > 1 ? String(p) : null });

  return (
    <nav className="mt-6 flex items-center justify-end gap-5" aria-label="Pagination">
      <span aria-live="polite" className="text-sm">Page {page} of {totalPages}</span>
      <Button variant="outline" disabled={page <= 1} onClick={() => goto(page - 1)}>Prev</Button>
      <Button variant="outline" disabled={page >= totalPages} onClick={() => goto(page + 1)}>Next</Button>
    </nav>
  );
}
