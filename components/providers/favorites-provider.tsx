'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { STORAGE_KEYS } from "@/lib/constants";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (pokemonName: string) => void;
  isFavorite: (pokemonName: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[];
        setFavorites(parsed);
      } catch (error) {
        console.error("Error parsing favorites from localStorage:", error);
        setFavorites([]);
      }
    }
  }, []);

  const toggleFavorite = useCallback((pokemonName: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(pokemonName)
        ? prev.filter((name) => name !== pokemonName)
        : [...prev, pokemonName];
      
      // Save to localStorage immediately in the state update
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback(
    (pokemonName: string) => favorites.includes(pokemonName),
    [favorites],
  );

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
