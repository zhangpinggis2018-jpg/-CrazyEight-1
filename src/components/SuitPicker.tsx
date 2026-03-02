import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Suit, SUITS, SUIT_ICONS, SUIT_COLORS } from '../types';

interface SuitPickerProps {
  isOpen: boolean;
  onSelect: (suit: Suit) => void;
}

export const SuitPicker: React.FC<SuitPickerProps> = ({ isOpen, onSelect }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">选择一个花色</h2>
            <div className="grid grid-cols-2 gap-4">
              {SUITS.map((suit) => {
                const Icon = SUIT_ICONS[suit];
                const suitNames: Record<Suit, string> = { hearts: '红心', diamonds: '方块', clubs: '梅花', spades: '黑桃' };
                return (
                  <button
                    key={suit}
                    onClick={() => onSelect(suit)}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                  >
                    <Icon size={48} className={SUIT_COLORS[suit]} />
                    <span className="mt-2 font-semibold text-slate-600 capitalize group-hover:text-indigo-600">
                      {suitNames[suit]}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
