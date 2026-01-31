
import React, { useState, useMemo, useRef } from 'react';
import { ChordDefinition, Song, SongEvent, ChordLibrary, SongSection } from '../types';
import ChordDiagram from './ChordDiagram';
import { Plus, Trash2, Music, Search, Filter, Layers, Type, ChevronDown, Save, Upload, Repeat, PanelLeft, Pause, Ban, FileAudio, FileText } from 'lucide-react';
import { audioEngine } from '../services/AudioEngine';
import { exportSongToMidi } from '../services/MidiExporter';
import { exportSongToPdf } from '../services/PdfExporter';

interface EditorTabProps {
  song: Song;
  setSong: React.Dispatch<React.SetStateAction<Song>>;
  chordLibrary: ChordLibrary;
}

const PREDEFINED_SECTIONS = ['Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Bridge', 'Solo', 'Outro'];

// Enharmonic mapping to handle data inconsistencies in common chord databases
const ENHARMONIC_MAP: Record<string, string> = {
  'C#': 'Db', 'Db': 'C#',
  'D#': 'Eb', 'Eb': 'D#',
  'F#': 'Gb', 'Gb': 'F#',
  'G#': 'Ab', 'Ab': 'G#',
  'A#': 'Bb', 'Bb': 'A#',
};

const EditorTab: React.FC<EditorTabProps> = ({ song, setSong, chordLibrary }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>(song.sections[0]?.id || '');
  const [showLibrary, setShowLibrary] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const keys = useMemo(() => chordLibrary.keys, [chordLibrary]);

  const displayedChords = useMemo(() => {
    let list: ChordDefinition[] = [];

    if (selectedKey) {
      const tryKeys = [
        selectedKey,
        selectedKey.replace('#', 'sharp'),
        selectedKey.replace('b', 'flat'),
        ENHARMONIC_MAP[selectedKey],
        ENHARMONIC_MAP[selectedKey]?.replace('#', 'sharp'),
        ENHARMONIC_MAP[selectedKey]?.replace('b', 'flat'),
      ].filter(Boolean) as string[];

      for (const k of tryKeys) {
        if (chordLibrary.chords[k] && chordLibrary.chords[k].length > 0) {
          list = chordLibrary.chords[k];
          break;
        }
      }
    } else {
      Object.keys(chordLibrary.chords).forEach(key => {
        list.push(...chordLibrary.chords[key]);
      });
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      list = list.filter(c =>
        `${c.key}${c.suffix}`.toLowerCase().includes(lowerSearch) ||
        `${c.key} ${c.suffix}`.toLowerCase().includes(lowerSearch)
      );
    }

    return list;
  }, [chordLibrary, selectedKey, searchTerm]);

  const addToSection = (chord: ChordDefinition | null, positionIndex: number = 0) => {
    if (!activeSectionId) {
      alert("Please create or select a section first");
      return;
    }

    const newEvent: SongEvent = {
      id: Math.random().toString(36).substr(2, 9),
      chord,
      positionIndex: positionIndex,
      duration: 4,
    };

    setSong(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === activeSectionId ? { ...s, events: [...s.events, newEvent] } : s
      )
    }));

    if (chord) {
      audioEngine.init();
      audioEngine.playChord(chord.positions[positionIndex]);
    }
  };

  const addNewSection = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newSection: SongSection = {
      id: newId,
      name: 'Verse',
      events: [],
      repeat: 1
    };
    setSong(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setActiveSectionId(newId);
  };

  const removeSection = (id: string) => {
    setSong(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id)
    }));
    if (activeSectionId === id) {
      setActiveSectionId(song.sections.find(s => s.id !== id)?.id || '');
    }
  };

  const updateSectionName = (id: string, name: string) => {
    setSong(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, name } : s)
    }));
  };

  const updateSectionRepeat = (id: string, repeat: number) => {
    const r = Math.max(1, Math.min(99, repeat));
    setSong(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, repeat: r } : s)
    }));
  };

  const removeChordFromSection = (sectionId: string, eventId: string) => {
    setSong(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, events: s.events.filter(e => e.id !== eventId) } : s
      )
    }));
  };

  const updateChordDuration = (sectionId: string, eventId: string, duration: number) => {
    setSong(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, events: s.events.map(e => e.id === eventId ? { ...e, duration } : e) } : s
      )
    }));
  };

  const handleSaveSong = () => {
    const dataStr = JSON.stringify(song, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${song.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleMidiExport = () => {
    exportSongToMidi(song);
  };

  const handlePdfExport = () => {
    exportSongToPdf(song);
  };

  const handleLoadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loadedSong = JSON.parse(event.target?.result as string);
        // Basic validation
        if (loadedSong && Array.isArray(loadedSong.sections)) {
          setSong(loadedSong);
          // Set active section to first if available
          if (loadedSong.sections.length > 0) {
            setActiveSectionId(loadedSong.sections[0].id);
          }
        } else {
          alert('Invalid song file structure.');
        }
      } catch (err) {
        console.error('Error parsing song file:', err);
        alert('Failed to load song file.');
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be loaded again if needed
    e.target.value = '';
  };

  return (
    <div className="flex h-full flex-col md:flex-row gap-0 md:gap-6 p-0 md:p-4 overflow-hidden relative">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Sidebar: Chord Library */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[85vw] sm:w-80 md:relative md:w-96 md:z-0
        transform transition-transform duration-300 ease-in-out bg-slate-900 border-r md:border-l md:border-r border-slate-800 p-4 shadow-2xl flex flex-col overflow-hidden
        ${showLibrary ? 'translate-x-0' : '-translate-x-full md:hidden'}
      `}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Music className="text-blue-500" size={20} />
            <h2 className="text-lg font-bold text-slate-100">Chord Library</h2>
          </div>
          <div className="flex items-center gap-2">
            {displayedChords.length > 0 && (
              <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-500 font-bold">
                {displayedChords.reduce((acc, c) => acc + c.positions.length, 0)} VARIANTS
              </span>
            )}
            <button
              onClick={() => setShowLibrary(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <Plus size={20} className="rotate-45" />
            </button>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search chords..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => { addToSection(null); if (window.innerWidth < 768) setShowLibrary(false); }}
          className="w-full mb-4 py-3 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-lg text-slate-400 font-bold text-xs uppercase tracking-widest transition-all group"
        >
          <Ban size={16} className="text-red-500 group-hover:scale-110 transition-transform" /> Insert Rest
        </button>

        <div className="flex flex-wrap gap-1 mb-4 max-h-24 overflow-y-auto custom-scrollbar">
          <button
            onClick={() => setSelectedKey(null)}
            className={`px-2 py-1 text-[10px] font-bold rounded transition-colors border ${!selectedKey ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
          >
            ALL
          </button>
          {keys.map(k => (
            <button
              key={k}
              onClick={() => setSelectedKey(k)}
              className={`px-2 py-1 text-[10px] font-bold rounded transition-colors border ${selectedKey === k ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 gap-3">
            {displayedChords.map((chord) => (
              chord.positions.map((position, posIdx) => (
                <div
                  key={`${chord.key}-${chord.suffix}-${posIdx}`}
                  onClick={() => { addToSection(chord, posIdx); if (window.innerWidth < 768) setShowLibrary(false); }}
                  className="cursor-pointer"
                >
                  <ChordDiagram
                    position={position}
                    label={`${chord.key}${chord.suffix}`}
                    size="sm"
                  />
                </div>
              ))
            ))}
          </div>
          {displayedChords.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 opacity-50">
              <Filter size={32} className="mb-2" />
              <p className="text-xs font-bold uppercase tracking-widest">No chords found</p>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {showLibrary && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setShowLibrary(false)}
        />
      )}

      {/* Main Area: Section-based Timeline */}
      <div className="flex-1 flex flex-col bg-slate-900 md:rounded-xl md:border border-slate-800 p-4 md:p-6 shadow-2xl relative overflow-hidden transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLibrary(!showLibrary)}
              className={`p-2 rounded-lg border transition-all ${showLibrary ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'}`}
              title={showLibrary ? "Hide Chord Library" : "Show Chord Library"}
            >
              <PanelLeft size={18} />
            </button>
            <div className="flex-1 flex items-center gap-3 min-w-0">
              <input
                type="text"
                value={song.title}
                onChange={(e) => setSong({ ...song, title: e.target.value })}
                className="text-xl md:text-2xl font-bold text-slate-100 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 -ml-1 placeholder-slate-600 w-full truncate"
                placeholder="Song Title..."
              />
              <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-700 tracking-widest uppercase whitespace-nowrap hidden xs:inline-block">
                {song.timeSignature[0]}/{song.timeSignature[1]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            <button
              onClick={handlePdfExport}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-pink-400 hover:text-pink-200 rounded-lg text-[10px] sm:text-xs font-bold border border-slate-700 transition-all whitespace-nowrap"
            >
              <FileText size={14} /> PDF
            </button>
            <button
              onClick={handleMidiExport}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-200 rounded-lg text-[10px] sm:text-xs font-bold border border-slate-700 transition-all whitespace-nowrap"
            >
              <FileAudio size={14} /> MIDI
            </button>
            <div className="w-px h-6 bg-slate-700 mx-1 shrink-0"></div>
            <button
              onClick={handleSaveSong}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[10px] sm:text-xs font-bold border border-slate-700 transition-all whitespace-nowrap"
            >
              <Save size={14} /> Save
            </button>
            <button
              onClick={handleLoadClick}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[10px] sm:text-xs font-bold border border-slate-700 transition-all whitespace-nowrap"
            >
              <Upload size={14} /> Load
            </button>
            <div className="w-px h-6 bg-slate-700 mx-1 shrink-0"></div>
            <button
              onClick={addNewSection}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] sm:text-sm font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus size={16} /> <span className="hidden xs:inline">Section</span><span className="xs:hidden">New</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 md:space-y-8 md:pr-2 custom-scrollbar pb-10 md:pb-0">
          {song.sections.map((section, sIdx) => (
            <div
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              className={`relative flex flex-col bg-slate-800/40 rounded-xl md:rounded-2xl border transition-all p-3 md:p-4 ${activeSectionId === section.id ? 'border-blue-500/50 bg-slate-800/80 shadow-lg' : 'border-slate-700/50 hover:bg-slate-800/60'}`}
            >
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4 pb-4 border-b border-slate-700/50 gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className={`p-1.5 md:p-2 rounded-lg shrink-0 ${activeSectionId === section.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                    <Layers size={14} />
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="relative group/select flex-1 sm:flex-none">
                      <select
                        value={PREDEFINED_SECTIONS.includes(section.name) ? section.name : 'Custom'}
                        onChange={(e) => {
                          if (e.target.value !== 'Custom') updateSectionName(section.id, e.target.value);
                        }}
                        className="w-full appearance-none bg-slate-800 border border-slate-700 rounded-lg pl-3 pr-8 py-1 text-sm md:text-base font-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer hover:border-blue-500 transition-all uppercase tracking-wider"
                      >
                        {PREDEFINED_SECTIONS.map(p => (
                          <option key={p} value={p} className="bg-slate-900 text-white py-2">
                            {p.toUpperCase()}
                          </option>
                        ))}
                        <option value="Custom" className="bg-slate-900 text-white py-2 font-bold italic">CUSTOM...</option>
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <ChevronDown size={14} />
                      </div>
                    </div>

                    {!PREDEFINED_SECTIONS.includes(section.name) && (
                      <div className="flex items-center gap-2 bg-slate-700 px-2 py-1 rounded-lg border border-slate-600 shadow-inner min-w-0 max-w-[120px]">
                        <Type size={12} className="text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={section.name}
                          onChange={(e) => updateSectionName(section.id, e.target.value)}
                          className="bg-transparent text-[10px] md:text-xs font-bold text-blue-400 w-full focus:outline-none"
                          placeholder="Name..."
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-end sm:justify-start">
                  <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-2 py-1 border border-slate-700/50">
                    <Repeat size={12} className="text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">x</span>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={section.repeat || 1}
                      onChange={(e) => updateSectionRepeat(section.id, parseInt(e.target.value) || 1)}
                      className="bg-slate-700 border border-slate-600 rounded w-8 py-0.5 text-center text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="hidden sm:block w-px h-6 bg-slate-700"></div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                    className="p-1.5 md:p-2 text-slate-500 hover:text-red-400 transition-colors bg-slate-700/50 rounded-lg hover:bg-slate-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Chords in Section */}
              <div className="flex items-start gap-4 overflow-x-auto pt-3 pb-2 custom-scrollbar no-scrollbar-mobile">
                {section.events.map((event, eIdx) => (
                  <div key={event.id} className="relative group flex flex-col items-center shrink-0">
                    <div className={`absolute -top-1 left-1/2 -translate-x-1/2 px-1.5 rounded-full text-[7px] font-black z-10 border shadow-lg ${event.chord ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-600 border-slate-500 text-slate-200'}`}>
                      {eIdx + 1}
                    </div>
                    {event.chord ? (
                      <ChordDiagram
                        position={event.chord.positions[event.positionIndex]}
                        label={`${event.chord.key}${event.chord.suffix}`}
                        size="sm"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center bg-slate-800/30 p-2 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer group shadow-lg min-w-[100px] h-[110px]">
                        <Ban size={24} className="text-slate-600 mb-1 opacity-50" />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Rest</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeChordFromSection(section.id, event.id); }}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-400"
                    >
                      <Trash2 size={8} />
                    </button>

                    <div className="relative mt-2 w-full">
                      <select
                        value={event.duration}
                        onChange={(e) => updateChordDuration(section.id, event.id, parseInt(e.target.value))}
                        className="appearance-none w-full bg-slate-800 text-[8px] font-black text-slate-300 rounded-md border border-slate-700 pl-1 pr-4 py-0.5 hover:border-blue-500 transition-all focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value={1} className="bg-slate-900">1B</option>
                        <option value={2} className="bg-slate-900">2B</option>
                        <option value={4} className="bg-slate-900">4B</option>
                        <option value={8} className="bg-slate-900">8B</option>
                      </select>
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 scale-50">
                        <ChevronDown size={12} />
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  onClick={() => { setActiveSectionId(section.id); setShowLibrary(true); }}
                  className="min-w-[70px] h-[90px] border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center text-slate-600 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-500/5 transition-all cursor-pointer group/add shrink-0"
                >
                  <Plus size={20} className="group-hover/add:scale-110 transition-transform" />
                </div>
              </div>
            </div>
          ))}

          {song.sections.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 py-20 bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-800 mx-4">
              <Layers size={48} className="opacity-10 mb-4" />
              <p className="font-bold uppercase tracking-widest text-xs opacity-50 text-center px-4">Add your first section to start composing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorTab;
