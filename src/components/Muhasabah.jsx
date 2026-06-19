import { motion } from 'framer-motion';

export default function Muhasabah() {
  const progressTask = 75; // 75%
  const progressPrayer = 80; // 4/5

  const CircularProgress = ({ progress, label, sublabel }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-sakina-text/5"
            />
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              className="text-sakina-primary"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-serif text-sakina-text">{sublabel}</span>
          </div>
        </div>
        <span className="mt-4 text-sakina-text/80 font-medium">{label}</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-3xl mx-auto px-6 py-12"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-serif text-sakina-text mb-2">
          Evaluasi Harian
        </h2>
        <p className="text-sakina-text/60">Melihat kembali keseimbangan harimu.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 mb-16">
        <CircularProgress progress={progressTask} label="Tugas Selesai" sublabel="75%" />
        <CircularProgress progress={progressPrayer} label="Salat Tepat Waktu" sublabel="4/5" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-8 rounded-3xl shadow-sm border border-sakina-text/5"
      >
        <p className="text-lg leading-relaxed text-sakina-text/80 font-serif italic text-center">
          "Alhamdulillah, hari ini kamu sangat produktif dalam menyelesaikan laporan. Jangan lupa untuk menjaga ketepatan waktu salat Isya agar istirahatmu malam ini penuh berkah."
        </p>
      </motion.div>
    </motion.div>
  );
}
