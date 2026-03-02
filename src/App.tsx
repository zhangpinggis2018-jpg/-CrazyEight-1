import { motion, AnimatePresence } from 'motion/react';
import { Card } from './components/Card';
import { SuitPicker } from './components/SuitPicker';
import { useCrazyEights } from './hooks/useCrazyEights';
import { SUIT_ICONS, SUIT_COLORS } from './types';
import { cn } from './utils';
import { Trophy, RefreshCw, Info, Layers } from 'lucide-react';

export default function App() {
  const {
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
  } = useCrazyEights();

  const handleSuitSelect = (suit: any) => {
    if (pendingCard) {
      playCard(pendingCard, 'player', suit);
      setIsSuitPickerOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-2xl italic shadow-lg shadow-indigo-500/20">
            P
          </div>
          <h1 className="text-xl font-bold tracking-tight">平哥的疯狂8点</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-700 rounded-full text-sm font-medium">
            <Layers size={16} className="text-slate-400" />
            <span>牌堆: {deck.length}</span>
          </div>
          <button 
            onClick={startNewGame}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
            title="重新开始"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 relative flex flex-col items-center justify-between p-4 md:p-8">
        {gameState === 'idle' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-5xl font-black text-white leading-tight">
                准备好开始<span className="text-indigo-500">疯狂</span>了吗？
              </h2>
              <p className="text-slate-400 text-lg">
                匹配花色或点数，巧妙使用8，抢先出完所有牌！
              </p>
              <button
                onClick={startNewGame}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xl shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
              >
                开始游戏
              </button>
            </motion.div>
          </div>
        ) : (
          <>
            {/* AI Hand */}
            <div className="w-full flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium uppercase tracking-widest">
                <span>电脑对手</span>
                <span className="px-2 py-0.5 bg-slate-800 rounded-md border border-slate-700 text-xs">
                  {aiHand.length} 张牌
                </span>
              </div>
              <div className="flex -space-x-12 md:-space-x-16 hover:space-x-2 transition-all duration-500">
                {aiHand.map((card, idx) => (
                  <Card key={card.id} card={card} isFaceUp={false} disabled className="z-0" />
                ))}
              </div>
            </div>

            {/* Center Area: Deck & Discard */}
            <div className="flex items-center justify-center gap-8 md:gap-16 my-8">
              {/* Draw Pile */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-indigo-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div 
                  onClick={() => turn === 'player' && drawCard('player')}
                  className="relative cursor-pointer"
                >
                  {deck.length > 0 ? (
                    <Card card={deck[0]} isFaceUp={false} className="shadow-2xl" />
                  ) : (
                    <div className="w-24 h-36 md:w-32 md:h-48 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-600">
                      Empty
                    </div>
                  )}
                  {deck.length > 1 && (
                    <div className="absolute -top-1 -left-1 w-full h-full bg-indigo-800 rounded-xl -z-10 border border-indigo-700"></div>
                  )}
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                  摸牌
                </div>
              </div>

              {/* Discard Pile */}
              <div className="relative">
                <AnimatePresence mode="popLayout">
                  <Card 
                    key={topCard.id} 
                    card={topCard} 
                    className="shadow-2xl z-10" 
                  />
                </AnimatePresence>
                
                {wildSuit && (
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute -top-4 -right-4 z-20 bg-white p-2 rounded-full shadow-xl border-2 border-slate-100"
                  >
                    {(() => {
                      const Icon = SUIT_ICONS[wildSuit];
                      return <Icon size={24} className={SUIT_COLORS[wildSuit]} />;
                    })()}
                  </motion.div>
                )}
                
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                  弃牌
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="text-center mb-4 min-h-[2rem]">
              <motion.p 
                key={message}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-medium text-slate-300"
              >
                {message}
              </motion.p>
            </div>

            {/* Player Hand */}
            <div className="w-full flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest transition-all",
                  turn === 'player' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/40" : "bg-slate-800 text-slate-500"
                )}>
                  {turn === 'player' ? "你的回合" : "电脑思考中..."}
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 md:gap-4 max-w-5xl">
                {playerHand.map((card) => (
                  <Card 
                    key={card.id} 
                    card={card} 
                    isPlayable={turn === 'player' && isPlayable(card)}
                    onClick={() => playCard(card, 'player')}
                    disabled={turn !== 'player'}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      <SuitPicker 
        isOpen={isSuitPickerOpen} 
        onSelect={handleSuitSelect} 
      />

      <AnimatePresence>
        {gameState === 'gameOver' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-8"
            >
              <div className="flex justify-center">
                <div className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center shadow-2xl",
                  winner === 'player' ? "bg-yellow-500/20 text-yellow-500" : "bg-slate-800 text-slate-400"
                )}>
                  <Trophy size={48} />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white">
                  {winner === 'player' ? "胜利！" : "失败"}
                </h2>
                <p className="text-slate-400 text-lg">
                  {winner === 'player' 
                    ? "你出完了所有的牌！你是疯狂8点大师。" 
                    : "电脑这次稍微快了一点。想再试一次吗？"}
                </p>
              </div>

              <button
                onClick={startNewGame}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xl shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
              >
                再玩一次
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Overlay (Optional) */}
      <div className="fixed bottom-4 right-4 group">
        <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 transition-all shadow-lg border border-slate-700">
          <Info size={20} />
        </button>
        <div className="absolute bottom-full right-0 mb-4 w-64 p-4 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-sm text-slate-300 space-y-2">
          <p className="font-bold text-white mb-2">玩法说明：</p>
          <p>• 匹配顶牌的<span className="text-indigo-400">花色</span>或<span className="text-indigo-400">点数</span>。</p>
          <p>• <span className="text-yellow-500 font-bold">8是万能牌！</span> 随时可以打出并改变花色。</p>
          <p>• 如果无牌可出，请摸一张牌。</p>
          <p>• 最先清空手牌的人获胜！</p>
        </div>
      </div>
    </div>
  );
}
