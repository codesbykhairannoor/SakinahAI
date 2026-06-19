import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, CheckCircle2, Play } from 'lucide-react';

export default function TimelineView({ tasks, prayerTimes, onStartTask, onMarkDone }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [nextPrayerName, setNextPrayerName] = useState('');

  useEffect(() => {
    if (!prayerTimes) return;

    const calculateNextPrayer = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeStr = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;

      const prayers = [
        { name: 'Subuh', time: prayerTimes.Fajr },
        { name: 'Zuhur', time: prayerTimes.Dhuhr },
        { name: 'Asar', time: prayerTimes.Asr },
        { name: 'Magrib', time: prayerTimes.Maghrib },
        { name: 'Isya', time: prayerTimes.Isha }
      ];

      let next = prayers.find(p => p.time > currentTimeStr);
      let isTomorrow = false;
      
      if (!next) {
        next = prayers[0];
        isTomorrow = true;
      }

      setNextPrayerName(next.name);

      const [nextHours, nextMinutes] = next.time.split(':').map(Number);
      
      let targetDate = new Date(now);
      targetDate.setHours(nextHours, nextMinutes, 0, 0);
      if (isTomorrow) {
        targetDate.setDate(targetDate.getDate() + 1);
      }

      const diffMs = targetDate - now;
      if (diffMs > 0) {
        const h = Math.floor(diffMs / 1000 / 60 / 60);
        const m = Math.floor((diffMs / 1000 / 60) % 60);
        const s = Math.floor((diffMs / 1000) % 60);
        setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
      }
    };

    calculateNextPrayer();
    const timer = setInterval(calculateNextPrayer, 1000);
    
    return () => clearInterval(timer);
  }, [prayerTimes]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-2xl mx-auto px-4 sm:px-6 py-8"
    >
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md py-4 mb-8 rounded-2xl shadow-sm border border-sakina-text/5 flex justify-center items-center">
        {prayerTimes ? (
          <span className="text-sakina-text/80 font-medium tracking-wide">
            Menuju {nextPrayerName}: <span className="font-bold text-sakina-text">{timeLeft}</span>
          </span>
        ) : (
          <span className="text-sakina-text/80 font-medium tracking-wide animate-pulse">
            Memuat jadwal salat...
          </span>
        )}
      </div>

      <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-sakina-text/10 before:to-transparent">
        {tasks.map((item, index) => (
          <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Timeline dot */}
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-sakina-bg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${item.type === 'prayer' ? 'bg-sakina-primary text-white' : 'bg-white text-sakina-text/40'}`}>
              {item.type === 'prayer' ? <Moon className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-sakina-text/20" />}
            </div>

            {/* Card */}
            <motion.div
              layout
              className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl shadow-sm border border-sakina-text/5 transition-all ${
                item.type === 'prayer' ? 'bg-sakina-primary/10' : 'bg-white'
              } ${item.done ? 'opacity-50' : ''}`}
            >
              {item.type === 'prayer' ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif font-bold text-sakina-primary text-lg">{item.title}</h3>
                    <p className="text-sm text-sakina-primary/70">{item.time}</p>
                  </div>
                  <button className="px-4 py-2 bg-sakina-primary text-white text-sm font-medium rounded-xl hover:bg-sakina-primary/90 transition-colors w-full sm:w-auto text-center">
                    Tandai Hadir
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className={`font-medium text-sakina-text text-lg transition-all ${item.done ? 'line-through text-sakina-text/60' : ''}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-sakina-text/50">{item.time}</p>
                  </div>
                  <div className="flex space-x-2 w-full sm:w-auto">
                    {!item.done && (
                      <button
                        onClick={() => onStartTask(item)}
                        className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-sakina-text/5 hover:bg-sakina-text/10 text-sakina-text text-sm font-medium rounded-xl transition-colors"
                      >
                        <Play className="w-4 h-4 mr-1.5" />
                        Mulai
                      </button>
                    )}
                    <button
                      onClick={() => onMarkDone(item.id)}
                      className={`flex-1 sm:flex-none flex items-center justify-center p-2 rounded-xl transition-colors ${
                        item.done ? 'text-sakina-primary bg-sakina-primary/10' : 'text-sakina-text/40 hover:bg-sakina-text/5 hover:text-sakina-text'
                      }`}
                    >
                      <motion.div
                        initial={false}
                        animate={{ scale: item.done ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </motion.div>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
