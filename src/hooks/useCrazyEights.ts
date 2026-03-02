import { useState, useCallback, useEffect } from 'react';
import { CardData, Suit, Rank, SUITS, RANKS } from '../types';

const createDeck = (): CardData[] => {
  const deck: CardData[] = [];
  SUITS.forEach((suit) => {
    RANKS.forEach((rank) => {
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
      });
    });
  });
  return shuffle(deck);
};

const shuffle = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const useCrazyEights = () => {
  const [deck, setDeck] = useState<CardData[]>([]);
  const [playerHand, setPlayerHand] = useState<CardData[]>([]);
  const [aiHand, setAiHand] = useState<CardData[]>([]);
  const [discardPile, setDiscardPile] = useState<CardData[]>([]);
  const [turn, setTurn] = useState<'player' | 'ai'>('player');
  const [wildSuit, setWildSuit] = useState<Suit | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle');
  const [winner, setWinner] = useState<'player' | 'ai' | null>(null);
  const [isSuitPickerOpen, setIsSuitPickerOpen] = useState(false);
  const [pendingCard, setPendingCard] = useState<CardData | null>(null);
  const [message, setMessage] = useState<string>('欢迎来到平哥的疯狂8点！');

  const startNewGame = useCallback(() => {
    const newDeck = createDeck();
    const pHand = newDeck.splice(0, 8);
    const aHand = newDeck.splice(0, 8);
    
    // Ensure first discard is not an 8
    let firstDiscardIndex = 0;
    while (newDeck[firstDiscardIndex].rank === '8') {
      firstDiscardIndex++;
    }
    const firstDiscard = newDeck.splice(firstDiscardIndex, 1)[0];

    setDeck(newDeck);
    setPlayerHand(pHand);
    setAiHand(aHand);
    setDiscardPile([firstDiscard]);
    setTurn('player');
    setWildSuit(null);
    setGameState('playing');
    setWinner(null);
    setMessage('轮到你了！匹配花色或点数。');
  }, []);

  const topCard = discardPile[discardPile.length - 1];

  const isPlayable = (card: CardData) => {
    if (card.rank === '8') return true;
    const currentSuit = wildSuit || topCard.suit;
    return card.suit === currentSuit || card.rank === topCard.rank;
  };

  const playCard = (card: CardData, from: 'player' | 'ai', chosenSuit?: Suit) => {
    if (card.rank === '8') {
      if (from === 'player' && !chosenSuit) {
        setPendingCard(card);
        setIsSuitPickerOpen(true);
        return;
      }
      setWildSuit(chosenSuit || null);
      const suitNames: Record<Suit, string> = { hearts: '红心', diamonds: '方块', clubs: '梅花', spades: '黑桃' };
      setMessage(`${from === 'player' ? '你' : '电脑'}打出了8并选择了${chosenSuit ? suitNames[chosenSuit] : ''}！`);
    } else {
      setWildSuit(null);
      const suitNames: Record<Suit, string> = { hearts: '红心', diamonds: '方块', clubs: '梅花', spades: '黑桃' };
      setMessage(`${from === 'player' ? '你' : '电脑'}打出了${suitNames[card.suit]}${card.rank}。`);
    }

    if (from === 'player') {
      setPlayerHand(prev => prev.filter(c => c.id !== card.id));
    } else {
      setAiHand(prev => prev.filter(c => c.id !== card.id));
    }

    setDiscardPile(prev => [...prev, card]);
    
    // Check win condition
    const handSize = from === 'player' ? playerHand.length - 1 : aiHand.length - 1;
    if (handSize === 0) {
      setGameState('gameOver');
      setWinner(from);
      setMessage(from === 'player' ? '恭喜！你赢了！' : '电脑赢了！下次好运。');
      return;
    }

    setTurn(from === 'player' ? 'ai' : 'player');
  };

  const drawCard = (from: 'player' | 'ai') => {
    if (deck.length === 0) {
      // If deck is empty, reshuffle discard pile (except top card)
      if (discardPile.length > 1) {
        const newDeck = shuffle(discardPile.slice(0, -1));
        setDeck(newDeck);
        setDiscardPile([topCard]);
        setMessage('牌堆已重新洗牌！');
      } else {
        setMessage('没有更多牌可以摸了！跳过回合。');
        setTurn(from === 'player' ? 'ai' : 'player');
        return;
      }
    }

    const newCard = deck[0];
    const remainingDeck = deck.slice(1);
    setDeck(remainingDeck);

    if (from === 'player') {
      setPlayerHand(prev => [...prev, newCard]);
      setMessage('你摸了一张牌。');
    } else {
      setAiHand(prev => [...prev, newCard]);
      setMessage('电脑摸了一张牌。');
    }

    // After drawing, check if the drawn card is playable. 
    // In some variations, you can play it immediately. 
    // Let's stick to simple: draw and end turn if not playable, or just end turn.
    // Actually, common rule: draw until you can play, or just draw one.
    // Let's do: draw one, if playable, player can play, otherwise turn ends.
    // Wait, let's simplify: draw one and turn ends for AI, player gets to decide.
    if (from === 'ai') {
        setTurn('player');
    }
  };

  // AI Logic
  useEffect(() => {
    if (gameState === 'playing' && turn === 'ai') {
      const timer = setTimeout(() => {
        const playableCards = aiHand.filter(isPlayable);
        if (playableCards.length > 0) {
          // AI Strategy: Play an 8 if it has to, or just play first playable
          const nonEight = playableCards.find(c => c.rank !== '8');
          const cardToPlay = nonEight || playableCards[0];
          
          if (cardToPlay.rank === '8') {
            // AI chooses most frequent suit in its hand
            const suitCounts: Record<Suit, number> = { hearts: 0, diamonds: 0, clubs: 0, spades: 0 };
            aiHand.forEach(c => suitCounts[c.suit]++);
            const bestSuit = (Object.keys(suitCounts) as Suit[]).reduce((a, b) => suitCounts[a] > suitCounts[b] ? a : b);
            playCard(cardToPlay, 'ai', bestSuit);
          } else {
            playCard(cardToPlay, 'ai');
          }
        } else {
          drawCard('ai');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [turn, aiHand, gameState, wildSuit, topCard]);

  return {
    playerHand,
    aiHand,
    discardPile,
    deck,
    turn,
    wildSuit,
    gameState,
    winner,
    message,
    isSuitPickerOpen,
    setIsSuitPickerOpen,
    pendingCard,
    startNewGame,
    playCard,
    drawCard,
    isPlayable,
    topCard,
  };
};
