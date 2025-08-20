import { Badge } from "@/components/ui/badge";

const typeColors: Record<string, string> = {
  normal: '#A8A878',
  fighting: '#C03028',
  flying: '#A890F0',
  poison: '#A040A0',
  ground: '#E0C068',
  rock: '#B8A038',
  bug: '#A8B820',
  ghost: '#705898',
  steel: '#B8B8D0',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  psychic: '#F85888',
  ice: '#98D8D8',
  dragon: '#7038F8',
  dark: '#705848',
  fairy: '#EE99AC',
};

interface TypeBadgeProps {
  type: string;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const color = typeColors[type] || typeColors.normal;
  
  return (
    <Badge
      className={`type-badge type-badge-${type} capitalize text-white ${className}`}
      style={{ 
        '--type-color': color,
      } as React.CSSProperties}
    >
      {type}
    </Badge>
  );
}