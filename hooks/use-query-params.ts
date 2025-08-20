"use client";
import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Updater = Record<string, string | null | undefined>;

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = useCallback((k: string) => searchParams.get(k) ?? "", [searchParams]);

  const setMany = useCallback(
    (updates: Updater, { replace = false }: { replace?: boolean } = {}) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v === undefined || v === null || v === "") next.delete(k);
        else next.set(k, String(v));
      }
      // if filters change (but not page itself), reset page
      // Only reset page if the filter values are actually changing, not just being set to null/empty
      const currentQ = searchParams.get("q") || "";
      const currentType = searchParams.get("type") || "";
      const currentFav = searchParams.get("fav") || "";
      const currentSort = searchParams.get("sort") || "";
      const currentDir = searchParams.get("dir") || "";
      
      const qChanged = "q" in updates && (updates.q || "") !== currentQ;
      const typeChanged = "type" in updates && (updates.type || "") !== currentType;
      const favChanged = "fav" in updates && (updates.fav || "") !== currentFav;
      const sortChanged = "sort" in updates && (updates.sort || "") !== currentSort;
      const dirChanged = "dir" in updates && (updates.dir || "") !== currentDir;
      
      const shouldResetPage = (qChanged || typeChanged || favChanged || sortChanged || dirChanged) && !("page" in updates);
      if (shouldResetPage) {
        next.delete("page");
      }
      const url = `${pathname}?${next.toString()}`;
      replace ? router.replace(url) : router.push(url);
    },
    [router, pathname, searchParams]
  );

  return { get, setMany, searchParams };
}
