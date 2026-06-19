import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function DashboardInput({ initialInput, onSubmit }) {
  const [input, setInput] = useState(initialInput || '');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setIsLoading(true);
    // Simulate loading for natural language processing
    setTimeout(() => {
      setIsLoading(false);
      onSubmit(input);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-2xl mx-auto px-6 py-12 md:py-24"
    >
      <h2 className="text-3xl md:text-4xl font-serif text-sakina-text mb-8">
        Selamat pagi. Apa misi kita hari ini?
      </h2>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          placeholder="Ceritakan targetmu hari ini... (Contoh: Saya perlu mendesain landing page, menulis laporan kuartalan, dan belajar tafsir selama dua jam)."
          className="w-full bg-white rounded-2xl p-6 md:p-8 text-lg md:text-xl text-sakina-text/80 shadow-sm border border-sakina-text/5 focus:outline-none focus:ring-2 focus:ring-sakina-primary/30 resize-none overflow-hidden min-h-[160px] transition-shadow"
        />
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className="bg-sakina-primary hover:bg-sakina-primary/90 text-white px-8 py-4 rounded-2xl font-medium text-lg shadow-sm transition-all flex items-center justify-center disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              Menyusun...
            </>
          ) : (
            'Susun Jadwal Saya'
          )}
        </button>
      </div>
    </motion.div>
  );
}
