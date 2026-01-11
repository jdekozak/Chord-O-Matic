
import React, { useState, useMemo } from 'react';
import { Tab, Song, ChordLibrary } from './types';
import EditorTab from './components/EditorTab';
import PlayerTab from './components/PlayerTab';
import { Play, Edit3, Music2 } from 'lucide-react';
import { localChordLibrary } from './chordsData';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Editor);
  const [chordLibrary] = useState<ChordLibrary>(localChordLibrary);

  const [song, setSong] = useState<Song>({
    title: 'New Rock Anthem',
    tempo: 120,
    timeSignature: [4, 4],
    sections: [
      { id: 'initial-section', name: 'Intro', events: [], repeat: 1 }
    ]
  });

  const totalBeats = useMemo(() => {
    return song.sections.reduce((acc, section) => {
      const sectionDuration = section.events.reduce((sacc, ev) => sacc + ev.duration, 0);
      return acc + (sectionDuration * (section.repeat || 1));
    }, 0);
  }, [song.sections]);

  const totalSeconds = Math.ceil((totalBeats * 60) / song.tempo);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 shadow-xl z-20">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/20">
            <Music2 className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">CHORD-O-MATIC</h1>
            <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Rock Engine</p>
          </div>
        </div>

        <nav className="flex bg-slate-800 p-1 rounded-xl shadow-inner border border-slate-700/50">
          <button
            onClick={() => setActiveTab(Tab.Editor)}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === Tab.Editor 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Edit3 size={18} />
            Editor
          </button>
          <button
            onClick={() => setActiveTab(Tab.Player)}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === Tab.Player 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Play size={18} />
            Player
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.1),transparent)] pointer-events-none" />
        
        {activeTab === Tab.Editor ? (
          <EditorTab song={song} setSong={setSong} chordLibrary={chordLibrary} />
        ) : (
          <PlayerTab song={song} setSong={setSong} />
        )}
      </main>

      {/* Status Bar */}
      <footer className="px-6 py-2 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between items-center z-20">
        <div className="flex gap-4">
          <span>{totalBeats} BEATS</span>
          <span>•</span>
          <span>{Math.floor(totalSeconds / 60)}:{(totalSeconds % 60).toString().padStart(2, '0')} DURATION</span>
        </div>
        <div>
          <span>READY</span>
        </div>
      </footer>
    </div>
  );
};

export default App;