import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PokemonCardSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-4 flex flex-col items-center">
        <Skeleton className="h-24 w-24 rounded-full mb-4" />
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-4 w-12" />
      </CardContent>
    </Card>
  );
}
