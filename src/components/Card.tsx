import React from 'react';
import { motion } from 'motion/react';
import { CardData, SUIT_ICONS, SUIT_COLORS } from '../types';
import { cn } from '../utils';

interface CardProps {
  card: CardData;
  isFaceUp?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  isPlayable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  card,
  isFaceUp = true,
  onClick,
  className,
  disabled = false,
  isPlayable = false,
}) => {
  const Icon = SUIT_ICONS[card.suit];

  return (
    <motion.div
      layoutId={card.id}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={isFaceUp && !disabled && isPlayable ? { y: -20, scale: 1.05 } : {}}
      onClick={!disabled && isPlayable ? onClick : undefined}
      className={cn(
        'relative w-24 h-36 md:w-32 md:h-48 rounded-xl shadow-lg cursor-pointer transition-all duration-300 select-none overflow-hidden border-2',
        isFaceUp ? 'bg-white border-slate-200' : 'bg-indigo-700 border-indigo-500',
        !isFaceUp && 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_var(--tw-gradient-to)_100%)] from-indigo-600 to-indigo-900',
        isPlayable && isFaceUp && 'ring-4 ring-yellow-400 ring-offset-2',
        disabled && 'opacity-80 grayscale-[0.5]',
        className
      )}
    >
      {isFaceUp ? (
        <div className="h-full flex flex-col justify-between p-2 md:p-3">
          <div className={cn('flex flex-col items-start leading-none', SUIT_COLORS[card.suit])}>
            <span className="text-lg md:text-2xl font-bold">{card.rank}</span>
            <Icon size={16} className="md:w-5 md:h-5" />
          </div>
          
          <div className={cn('flex justify-center items-center opacity-20', SUIT_COLORS[card.suit])}>
             <Icon size={48} className="md:w-20 md:h-20" />
          </div>

          <div className={cn('flex flex-col items-end leading-none rotate-180', SUIT_COLORS[card.suit])}>
            <span className="text-lg md:text-2xl font-bold">{card.rank}</span>
            <Icon size={16} className="md:w-5 md:h-5" />
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <div className="w-16 h-24 md:w-20 md:h-32 border-2 border-white/20 rounded-lg flex items-center justify-center">
             <div className="text-white/30 font-bold text-4xl italic">P</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
