import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Volume2, Music } from 'lucide-react';

export default function FocusMode({ task, onStop }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(true);
  const [activeAudio, setActiveAudio] = useState(null); // 'murottal' or 'nature'
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      className="fixed inset-0 z-[100] bg-sakina-bg flex flex-col items-center justify-center p-6"
    >
      {/* Task Title */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-16"
      >
        <span className="text-sakina-text/50 font-medium tracking-widest uppercase text-sm mb-2 block">
          Sedang Fokus
        </span>
        <h2 className="text-3xl md:text-4xl font-serif text-sakina-text max-w-2xl">
          {task?.title || 'Tugas Tanpa Nama'}
        </h2>
      </motion.div>

      {/* Timer */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="relative flex items-center justify-center mb-16"
      >
        <svg className="w-72 h-72 transform -rotate-90">
          <circle
            cx="144"
            cy="144"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-sakina-text/5"
          />
          <circle
            cx="144"
            cy="144"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-sakina-primary transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-6xl font-light tabular-nums text-sakina-text tracking-tight">
            {formatTime(timeLeft)}
          </span>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center space-x-6"
      >
        <button
          onClick={toggleTimer}
          className="w-16 h-16 rounded-full bg-white shadow-sm border border-sakina-text/5 flex items-center justify-center text-sakina-text hover:bg-sakina-bg transition-colors"
        >
          {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-1 fill-current" />}
        </button>
        <button
          onClick={onStop}
          className="w-16 h-16 rounded-full bg-white shadow-sm border border-sakina-text/5 flex items-center justify-center text-sakina-text/50 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Square className="w-6 h-6 fill-current" />
        </button>
      </motion.div>

      {/* Ambient Audio Bar */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/80 backdrop-blur-xl rounded-full shadow-lg border border-sakina-text/10 p-2 px-4 flex items-center justify-between"
      >
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveAudio(activeAudio === 'murottal' ? null : 'murottal')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
              activeAudio === 'murottal'
                ? 'bg-sakina-primary text-white'
                : 'bg-sakina-text/5 text-sakina-text/70 hover:bg-sakina-text/10'
            }`}
          >
            <Music className="w-4 h-4 mr-2" />
            Murottal Al-Qur'an
          </button>
          <button
            onClick={() => setActiveAudio(activeAudio === 'nature' ? null : 'nature')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
              activeAudio === 'nature'
                ? 'bg-sakina-primary text-white'
                : 'bg-sakina-text/5 text-sakina-text/70 hover:bg-sakina-text/10'
            }`}
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Suara Alam
          </button>
        </div>
        
        {/* Simulated Volume Slider */}
        <AnimatePresence>
          {activeAudio && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 100, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden sm:flex items-center ml-4 overflow-hidden"
            >
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full h-1 bg-sakina-text/20 rounded-lg appearance-none cursor-pointer accent-sakina-primary"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
