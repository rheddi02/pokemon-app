import { Button } from "@/components/ui/button";
export function ErrorState({ msg = "Something went wrong.", onRetry }: { msg?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded border p-6 text-center">
      <p className="mb-3">{msg}</p>
      {onRetry && <Button variant="outline" onClick={onRetry}>Retry</Button>}
    </div>
  );
}
