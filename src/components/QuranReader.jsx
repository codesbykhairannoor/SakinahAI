import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, BookOpen, Loader2, Search } from 'lucide-react';

export default function QuranReader() {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [surahLoading, setSurahLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Audio state
  const [playingAyahId, setPlayingAyahId] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Fetch list of Surahs
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        setSurahs(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch surahs:", err);
        setLoading(false);
      });
  }, []);

  const loadSurah = (surahNumber) => {
    setSurahLoading(true);
    // Fetch Arabic text, Indonesian translation, and audio
    Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/id.indonesian`),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`)
    ])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(([arabicRes, indoRes, audioRes]) => {
      const combinedAyahs = arabicRes.data.ayahs.map((ayah, index) => ({
        number: ayah.numberInSurah,
        arabic: ayah.text,
        translation: indoRes.data.ayahs[index].text,
        audioUrl: audioRes.data.ayahs[index].audio,
        id: ayah.number
      }));
      setAyahs(combinedAyahs);
      setSelectedSurah(arabicRes.data);
      setSurahLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(err => {
      console.error("Failed to fetch surah details:", err);
      setSurahLoading(false);
    });
  };

  const handlePlayAudio = (ayahUrl, ayahId) => {
    if (playingAyahId === ayahId) {
      // Pause
      audioRef.current.pause();
      setPlayingAyahId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = ayahUrl;
        audioRef.current.play();
        setPlayingAyahId(ayahId);
        
        audioRef.current.onended = () => {
          setPlayingAyahId(null);
        };
      }
    }
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.name.includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-sakina-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-8"
    >
      <audio ref={audioRef} />

      <AnimatePresence mode="wait">
        {!selectedSurah ? (
          <motion.div
            key="surah-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-sakina-text mb-4">
                Bacaan Al-Qur'an
              </h2>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sakina-text/40" />
                <input
                  type="text"
                  placeholder="Cari Surah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white rounded-full py-3 pl-12 pr-6 text-sakina-text/80 shadow-sm border border-sakina-text/5 focus:outline-none focus:ring-2 focus:ring-sakina-primary/30 transition-shadow"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredSurahs.map((surah) => (
                <button
                  key={surah.number}
                  onClick={() => loadSurah(surah.number)}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-sakina-text/5 hover:border-sakina-primary/30 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-sakina-bg flex items-center justify-center text-sakina-primary font-medium text-sm group-hover:bg-sakina-primary group-hover:text-white transition-colors">
                      {surah.number}
                    </div>
                    <div>
                      <h3 className="font-medium text-sakina-text">{surah.englishName}</h3>
                      <p className="text-xs text-sakina-text/50">{surah.englishNameTranslation} • {surah.numberOfAyahs} Ayat</p>
                    </div>
                  </div>
                  <span className="font-serif text-lg text-sakina-text/80">{surah.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="surah-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-8 sticky top-20 z-40 bg-sakina-bg/90 backdrop-blur-md py-4 border-b border-sakina-text/5 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedSurah(null);
                  setPlayingAyahId(null);
                  if (audioRef.current) audioRef.current.pause();
                }}
                className="text-sakina-text/60 hover:text-sakina-text flex items-center font-medium transition-colors"
              >
                ← Kembali
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-serif text-sakina-text">{selectedSurah.englishName}</h2>
                <p className="text-sm text-sakina-text/60">{selectedSurah.name}</p>
              </div>
              <div className="w-20" /> {/* Spacer */}
            </div>

            {surahLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-sakina-primary" />
              </div>
            ) : (
              <div className="space-y-8">
                {selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
                  <div className="text-center text-2xl md:text-3xl font-serif text-sakina-text/90 py-8 border-b border-sakina-text/5">
                    بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </div>
                )}
                
                {ayahs.map((ayah) => (
                  <div key={ayah.id} className="p-6 bg-white rounded-3xl shadow-sm border border-sakina-text/5 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-10 h-10 rounded-full bg-sakina-bg flex items-center justify-center text-sakina-primary text-sm font-medium">
                        {ayah.number}
                      </div>
                      <button
                        onClick={() => handlePlayAudio(ayah.audioUrl, ayah.id)}
                        className={`p-3 rounded-full transition-colors flex-shrink-0 ml-4 ${
                          playingAyahId === ayah.id 
                            ? 'bg-sakina-primary text-white shadow-md' 
                            : 'bg-sakina-bg text-sakina-text/60 hover:text-sakina-primary hover:bg-sakina-primary/10'
                        }`}
                      >
                        {playingAyahId === ayah.id ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
                      </button>
                    </div>
                    <div className="text-right text-2xl md:text-4xl font-serif text-sakina-text leading-[2.5] md:leading-[2.5] mb-8" dir="rtl">
                      {ayah.arabic}
                    </div>
                    <div className="text-sakina-text/80 text-sm md:text-base leading-relaxed">
                      {ayah.translation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
