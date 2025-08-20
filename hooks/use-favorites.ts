"use client";
import { useEffect, useRef, useState } from "react";

const KEY = "favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const mounted = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
    mounted.current = true;
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) {
        try {
          setFavorites(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isFavorite = (name: string) => favorites.includes(name);
  const toggleFavorite = (name: string) => {
    setFavorites((prev) => {
      const next = prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return { favorites, isFavorite, toggleFavorite, ready: mounted.current };
}
