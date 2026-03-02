import { LucideIcon, Heart, Diamond, Club, Spade } from 'lucide-react';

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface CardData {
  id: string;
  suit: Suit;
  rank: Rank;
}

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const SUIT_ICONS: Record<Suit, LucideIcon> = {
  hearts: Heart,
  diamonds: Diamond,
  clubs: Club,
  spades: Spade,
};

export const SUIT_COLORS: Record<Suit, string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-400',
  clubs: 'text-slate-800',
  spades: 'text-slate-900',
};
