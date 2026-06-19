export default function Navigation({ activeTab, setActiveTab }) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white/50 backdrop-blur-md sticky top-0 z-50 border-b border-sakina-text/5">
      <div className="flex items-center">
        <h1 className="text-2xl font-serif font-bold text-sakina-text">Sakina</h1>
      </div>
      <div className="flex space-x-2 bg-sakina-bg p-1 rounded-full border border-sakina-text/5">
        <button
          onClick={() => setActiveTab('perencanaan')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'perencanaan'
              ? 'bg-white shadow-sm text-sakina-text'
              : 'text-sakina-text/60 hover:text-sakina-text'
          }`}
        >
          Perencanaan
        </button>
        <button
          onClick={() => setActiveTab('muhasabah')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'muhasabah'
              ? 'bg-white shadow-sm text-sakina-text'
              : 'text-sakina-text/60 hover:text-sakina-text'
          }`}
        >
          Muhasabah
        </button>
      </div>
    </nav>
  );
}
