"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function Filters() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      {/* Search */}
      <div className="flex-1">
        <Input placeholder="Search Pokémon..." />
      </div>

      {/* Type Filter */}
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="electric">Electric</SelectItem>
          <SelectItem value="fire">Fire</SelectItem>
          <SelectItem value="water">Water</SelectItem>
          <SelectItem value="grass">Grass</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Name ↑</SelectItem>
          <SelectItem value="name-desc">Name ↓</SelectItem>
          <SelectItem value="id-asc">ID ↑</SelectItem>
          <SelectItem value="id-desc">ID ↓</SelectItem>
        </SelectContent>
      </Select>

      {/* Favorites toggle (UI only for now) */}
      <Button variant="outline">⭐ Favorites</Button>
    </div>
  );
}
