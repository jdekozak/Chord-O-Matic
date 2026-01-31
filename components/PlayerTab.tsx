
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Song, SongEvent, SongSection } from '../types';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Volume2, Bell, BellOff, Timer, Layers, ChevronRight, Repeat, Square, ChevronsLeft, ChevronsRight, Ban, SlidersHorizontal, Music2, Plus } from 'lucide-react';
import ChordDiagram from './ChordDiagram';
import { audioEngine } from '../services/AudioEngine';

interface PlayerTabProps {
  song: Song;
  setSong: React.Dispatch<React.SetStateAction<Song>>;
}

const PlayerTab: React.FC<PlayerTabProps> = ({ song, setSong }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMetronomeEnabled, setIsMetronomeEnabled] = useState(false);
  const [activeFlatIndex, setActiveFlatIndex] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [showMixer, setShowMixer] = useState(false);
  const [volumes, setVolumes] = useState({ song: 0.75, click: 0.75 });

  const playbackRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastEventIdRef = useRef<string | null>(null);
  const lastBeatRef = useRef<number>(-1);

  // Initialize volumes on mount
  useEffect(() => {
    audioEngine.setSongVolume(volumes.song);
    audioEngine.setClickVolume(volumes.click);
  }, []);

  const handleVolumeChange = (type: 'song' | 'click', value: number) => {
    const newVol = parseFloat(value.toString());
    setVolumes(prev => ({ ...prev, [type]: newVol }));
    if (type === 'song') audioEngine.setSongVolume(newVol);
    else audioEngine.setClickVolume(newVol);
  };

  // Flatten the events considering repetitions
  const flattenedEvents = useMemo(() => {
    return song.sections.flatMap((section, sIdx) => {
      const repeats = section.repeat || 1;
      return Array.from({ length: repeats }).flatMap((_, rIdx) =>
        section.events.map((event, eIdx) => ({
          ...event,
          // Generate a purely unique ID for playback tracking
          uniqueId: `${section.id}-${rIdx}-${event.id}-${eIdx}`,
          sectionName: section.name,
          sectionIndex: sIdx,
          eventIndexInSection: eIdx,
          repeatIndex: rIdx,
          totalRepeats: repeats
        }))
      );
    });
  }, [song.sections]);

  // Pre-calculate timing for all flattened events to avoid loop lookups in animation frame
  const timedEvents = useMemo(() => {
    let accumulatedBeats = 0;
    return flattenedEvents.map(e => {
      const start = accumulatedBeats;
      accumulatedBeats += e.duration;
      return { ...e, start, end: accumulatedBeats };
    });
  }, [flattenedEvents]);

  const totalBeats = useMemo(() => {
    if (timedEvents.length === 0) return 0;
    return timedEvents[timedEvents.length - 1].end;
  }, [timedEvents]);

  const stopPlayback = useCallback(() => {
    if (playbackRef.current) {
      cancelAnimationFrame(playbackRef.current);
      playbackRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const jumpToEvent = useCallback((index: number) => {
    if (timedEvents.length === 0) return;
    // Clamp index
    const targetIdx = Math.max(0, Math.min(index, timedEvents.length - 1));
    const event = timedEvents[targetIdx];
    const targetBeats = event.start;

    // Update State
    setActiveFlatIndex(targetIdx);
    const newProgress = (targetBeats / totalBeats) * 100;
    setProgress(newProgress);

    // If playing, adjust the time reference so the loop continues seamlessly from new spot
    if (isPlaying) {
      const newSeconds = (targetBeats * 60) / song.tempo;
      startTimeRef.current = performance.now() - (newSeconds * 1000);
      // Reset last event trigger so if we jump to an event, it plays immediately
      lastEventIdRef.current = null;
      lastBeatRef.current = -1;
    }
  }, [timedEvents, totalBeats, song.tempo, isPlaying]);

  const handleReset = useCallback(() => {
    stopPlayback();
    lastEventIdRef.current = null;
    lastBeatRef.current = -1;
    setActiveFlatIndex(0);
    setProgress(0);
  }, [stopPlayback]);

  // Stop Button Logic:
  // If Playing -> Stop (Pause)
  // If Not Playing -> Reset to Start
  const handleStop = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      handleReset();
    }
  };

  const handlePrevBar = () => {
    jumpToEvent(activeFlatIndex - 1);
  };

  const handleNextBar = () => {
    jumpToEvent(activeFlatIndex + 1);
  };

  const handlePrevSection = () => {
    const currentEvt = timedEvents[activeFlatIndex];
    if (!currentEvt) return;

    const currentSectionIdx = currentEvt.sectionIndex;
    // Find start index of current section
    const currentSectionStartIdx = timedEvents.findIndex(e => e.sectionIndex === currentSectionIdx);

    // If we are deeper than the first chord of the section, jump to start of current section
    // Otherwise jump to start of previous section
    if (activeFlatIndex > currentSectionStartIdx) {
      jumpToEvent(currentSectionStartIdx);
    } else {
      // Find start of previous section
      const prevSectionIdx = Math.max(0, currentSectionIdx - 1);
      const prevSectionStartIdx = timedEvents.findIndex(e => e.sectionIndex === prevSectionIdx);
      jumpToEvent(prevSectionStartIdx);
    }
  };

  const handleNextSection = () => {
    const currentEvt = timedEvents[activeFlatIndex];
    if (!currentEvt) return;

    const currentSectionIdx = currentEvt.sectionIndex;
    // Find first event with a higher section index
    const nextSectionStartIdx = timedEvents.findIndex(e => e.sectionIndex > currentSectionIdx);

    if (nextSectionStartIdx !== -1) {
      jumpToEvent(nextSectionStartIdx);
    } else {
      // If no next section, assume user wants to finish or go to end
      jumpToEvent(timedEvents.length - 1);
    }
  };

  useEffect(() => {
    if (!isPlaying || totalBeats === 0) return;

    audioEngine.init();
    // Adjust start time if we are resuming from a paused state (progress > 0)
    const startOffsetSeconds = (progress / 100) * ((totalBeats * 60) / song.tempo);
    startTimeRef.current = performance.now() - (startOffsetSeconds * 1000);

    const tick = () => {
      const now = performance.now();
      const elapsedSeconds = (now - startTimeRef.current) / 1000;
      const bpm = song.tempo;
      const beatsPerSecond = bpm / 60;
      const beatsPerMeasure = song.timeSignature[0];
      const beatsElapsed = elapsedSeconds * beatsPerSecond;
      const currentBeat = Math.floor(beatsElapsed);

      // Handle Metronome
      if (currentBeat > lastBeatRef.current) {
        if (isMetronomeEnabled) {
          audioEngine.playClick((currentBeat % beatsPerMeasure) === 0);
        }
        lastBeatRef.current = currentBeat;
      }

      // Find current event
      const currentEventIdx = timedEvents.findIndex(e => beatsElapsed >= e.start && beatsElapsed < e.end);

      if (currentEventIdx !== -1) {
        const event = timedEvents[currentEventIdx];

        // Trigger Audio on first entry to this specific event instance
        if (lastEventIdRef.current !== event.uniqueId) {
          if (event.chord) {
            const durationSeconds = (event.duration * 60) / song.tempo;
            audioEngine.playChord(event.chord.positions[event.positionIndex], durationSeconds);
          }
          lastEventIdRef.current = event.uniqueId;
          setActiveFlatIndex(currentEventIdx);
        }
      }

      // Check if finished
      if (beatsElapsed >= totalBeats) {
        setIsPlaying(false);
        lastEventIdRef.current = null;
        lastBeatRef.current = -1;
        setActiveFlatIndex(0);
        setProgress(0);
        return;
      }

      setProgress(Math.min((beatsElapsed / totalBeats) * 100, 100));
      playbackRef.current = requestAnimationFrame(tick);
    };

    playbackRef.current = requestAnimationFrame(tick);
    return () => {
      if (playbackRef.current) cancelAnimationFrame(playbackRef.current);
    };
  }, [isPlaying, isMetronomeEnabled, song.tempo, song.timeSignature, totalBeats, timedEvents]);

  const handlePlayPause = () => {
    if (!isPlaying && totalBeats > 0) {
      if (progress >= 100) {
        handleReset();
        setTimeout(() => setIsPlaying(true), 0);
      } else {
        setIsPlaying(true);
      }
    }
    else setIsPlaying(false);
  };

  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0 && val < 400) {
      setSong(prev => ({ ...prev, tempo: val }));
    }
  };

  const currentEvent = flattenedEvents[activeFlatIndex];

  const nextSectionName = useMemo(() => {
    if (!currentEvent) return null;
    // Find the next event that has a different section name
    const nextDiffSection = flattenedEvents.slice(activeFlatIndex + 1).find(e => e.sectionName !== currentEvent.sectionName);
    return nextDiffSection ? nextDiffSection.sectionName : null;
  }, [flattenedEvents, activeFlatIndex, currentEvent]);

  return (
    <div className="flex-1 flex flex-col p-4 items-center justify-center gap-4 bg-slate-950 overflow-hidden relative">

      {/* Mixer Toggle - Mobile Only */}
      <button
        onClick={() => setShowMixer(!showMixer)}
        className="fixed top-[72px] right-4 z-50 p-3 bg-slate-900 border border-slate-800 rounded-full shadow-2xl text-blue-500 md:hidden"
      >
        <SlidersHorizontal size={20} />
      </button>

      {/* Mixer Panel */}
      <div className={`
        fixed md:absolute top-[72px] md:top-4 right-4 z-40 w-64 bg-slate-900/90 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4 shadow-2xl flex flex-col gap-4
        transition-all duration-300 ease-in-out
        ${showMixer ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-8 opacity-0 scale-95 pointer-events-none md:translate-x-0 md:opacity-100 md:scale-100 md:pointer-events-auto md:relative lg:absolute'}
        md:w-56 md:bg-slate-900/80 md:backdrop-blur-md md:rounded-xl md:shadow-xl
      `}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/50">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={12} className="text-slate-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Audio Mixer</span>
          </div>
          <button onClick={() => setShowMixer(false)} className="md:hidden text-slate-500">
            <Plus size={16} className="rotate-45" />
          </button>
        </div>

        {/* Song Level */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-300">
            <div className="flex items-center gap-2">
              <Music2 size={12} className="text-blue-500" />
              <span>Song Volume</span>
            </div>
            <span>{Math.round(volumes.song * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volumes.song}
            onChange={(e) => handleVolumeChange('song', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Click Level */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-300">
            <div className="flex items-center gap-2">
              <Bell size={12} className={isMetronomeEnabled ? "text-blue-500" : "text-slate-500"} />
              <span>Metronome</span>
            </div>
            <span>{Math.round(volumes.click * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volumes.click}
            onChange={(e) => handleVolumeChange('click', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col items-center gap-6 h-full justify-between py-4">

        {/* Current Section Indicator */}
        <div className="flex flex-col items-center gap-4 h-16 justify-center">
          {flattenedEvents.length > 0 && currentEvent && (
            <div className="flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 bg-blue-600 border border-blue-500 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                <Layers size={14} className="text-white" />
                <span className="text-xs font-black tracking-[0.3em] text-white uppercase">{currentEvent.sectionName || 'Composition'}</span>
                {currentEvent.totalRepeats > 1 && (
                  <div className="flex items-center gap-1 ml-2 pl-3 border-l border-blue-400/50">
                    <Repeat size={10} className="text-blue-200" />
                    <span className="text-[10px] font-bold text-blue-100">
                      {currentEvent.repeatIndex + 1}/{currentEvent.totalRepeats}
                    </span>
                  </div>
                )}
              </div>

              {nextSectionName && (
                <div className="hidden md:flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                  <ChevronRight size={14} className="text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next: {nextSectionName}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CURRENT CHORD DISPLAY */}
        <div className="relative w-full flex-1 flex flex-col justify-center items-center overflow-hidden min-h-[350px]">
          {flattenedEvents.length > 0 ? (
            <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-16 w-full max-w-4xl px-4">

              {/* Previous Chord - Small hint on mobile */}
              <div className={`hidden sm:block transition-all duration-700 transform ${activeFlatIndex > 0 ? 'opacity-20 scale-75' : 'opacity-0 scale-50'}`}>
                {activeFlatIndex > 0 && (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[8px] uppercase tracking-widest text-slate-600 font-bold">Prev</span>
                    {flattenedEvents[activeFlatIndex - 1].chord ? (
                      <ChordDiagram
                        position={flattenedEvents[activeFlatIndex - 1].chord!.positions[flattenedEvents[activeFlatIndex - 1].positionIndex]}
                        label=""
                        size="sm"
                      />
                    ) : (
                      <div className="w-[80px] h-[90px] border border-slate-700 rounded-lg flex items-center justify-center bg-slate-800/50">
                        <Ban size={20} className="text-slate-600" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Active Chord */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`absolute -inset-32 bg-blue-600/10 blur-[100px] rounded-full transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
                <div className={`transform transition-all duration-300 ease-out flex flex-col items-center ${isPlaying ? 'scale-105 sm:scale-110' : 'scale-100'}`}>
                  {flattenedEvents[activeFlatIndex]?.chord ? (
                    <>
                      <div className="bg-slate-900/40 p-6 md:p-8 rounded-[40px] border border-slate-800/50 backdrop-blur-sm shadow-2xl overflow-visible">
                        <ChordDiagram
                          position={flattenedEvents[activeFlatIndex].chord!.positions[flattenedEvents[activeFlatIndex].positionIndex]}
                          label={`${flattenedEvents[activeFlatIndex].chord!.key} ${flattenedEvents[activeFlatIndex].chord!.suffix}`}
                          size="lg"
                        />
                      </div>
                      <div className="mt-6 md:mt-8 text-center">
                        <div className="text-5xl sm:text-7xl font-black text-white tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] flex items-baseline justify-center">
                          {flattenedEvents[activeFlatIndex].chord!.key}
                          <span className="text-blue-500 ml-1 text-4xl sm:text-6xl">{flattenedEvents[activeFlatIndex].chord!.suffix}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-[200px] h-[220px] sm:w-[240px] sm:h-[260px] border-4 border-slate-700 border-dashed rounded-[40px] flex flex-col items-center justify-center bg-slate-900/50 shadow-2xl backdrop-blur-sm">
                        <Ban size={60} className="text-slate-700 mb-4" />
                        <span className="text-xl sm:text-2xl font-black text-slate-600 uppercase tracking-[0.4em]">REST</span>
                      </div>
                      <div className="mt-6 md:mt-8 h-12 sm:h-20"></div>
                    </div>
                  )}

                  <div className="mt-4 text-slate-500 font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full shadow-lg">
                      <span className="text-slate-600">BEATS</span>
                      <span className="text-blue-400 font-bold">{flattenedEvents[activeFlatIndex]?.duration}</span>
                    </div>
                    {isMetronomeEnabled && isPlaying && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Next Chord - Small hint on mobile */}
              <div className={`hidden sm:block transition-all duration-700 transform ${activeFlatIndex < flattenedEvents.length - 1 ? 'opacity-20 scale-75' : 'opacity-0 scale-50'}`}>
                {activeFlatIndex < flattenedEvents.length - 1 && (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[8px] uppercase tracking-widest text-slate-600 font-bold">Next</span>
                    {flattenedEvents[activeFlatIndex + 1].chord ? (
                      <ChordDiagram
                        position={flattenedEvents[activeFlatIndex + 1].chord!.positions[flattenedEvents[activeFlatIndex + 1].positionIndex]}
                        label=""
                        size="sm"
                      />
                    ) : (
                      <div className="w-[80px] h-[90px] border border-slate-700 rounded-lg flex items-center justify-center bg-slate-800/50">
                        <Ban size={20} className="text-slate-600" />
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="text-slate-600 italic text-xl flex flex-col items-center gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-dashed border-slate-800 rounded-full flex items-center justify-center">
                <Play size={32} className="opacity-10" />
              </div>
              <p className="font-bold tracking-widest uppercase text-[10px] opacity-50">Timeline is Empty</p>
            </div>
          )}
        </div>

        {/* COMPACT Transport Controls Area */}
        <div className="w-full max-w-4xl bg-slate-900/90 backdrop-blur-xl rounded-[40px] p-4 md:p-6 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20">
          <div className="w-full h-2.5 bg-slate-950 rounded-full mb-6 relative group overflow-hidden border border-slate-800/50 cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const perc = Math.max(0, Math.min(100, (x / rect.width) * 100));
              const total = totalBeats;
              const targetBeat = (perc / 100) * total;
              const evtIdx = timedEvents.findIndex(ev => ev.end > targetBeat);
              if (evtIdx !== -1) jumpToEvent(evtIdx);
            }}>
            <div
              className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 transition-all duration-150 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">

            {/* Left Group: Settings */}
            <div className="flex items-center gap-3 sm:gap-4 order-2 sm:order-1 w-full sm:w-auto justify-center sm:justify-start">
              <button
                onClick={handleReset}
                className="p-3 text-slate-500 hover:text-white hover:bg-slate-800 rounded-2xl transition-all active:scale-90"
                title="Reset to Start"
              >
                <RotateCcw size={20} />
              </button>

              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 shadow-inner">
                <Timer size={16} className="text-blue-500" />
                <input
                  type="number"
                  value={song.tempo}
                  onChange={handleTempoChange}
                  className="bg-transparent text-white font-black text-sm w-10 text-center focus:outline-none [appearance:textfield]"
                />
                <span className="text-[10px] font-black text-slate-600 uppercase">BPM</span>
              </div>

              <button
                onClick={() => setIsMetronomeEnabled(!isMetronomeEnabled)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all border text-[10px] font-black uppercase tracking-widest ${isMetronomeEnabled ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
              >
                {isMetronomeEnabled ? <Bell size={16} /> : <BellOff size={16} />}
                <span className="hidden xs:inline">Metronome</span>
              </button>
            </div>

            {/* Center Group: Transport */}
            <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2 w-full sm:w-auto justify-center shrink-0">
              <button
                onClick={handlePrevSection}
                className="p-2.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full transition-colors active:scale-90"
              >
                <ChevronsLeft size={24} />
              </button>

              <button
                onClick={handlePrevBar}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors active:scale-90"
              >
                <SkipBack size={24} />
              </button>

              <button
                onClick={handleStop}
                className={`w-14 h-14 rounded-2xl transition-all flex items-center justify-center active:scale-90 ${!isPlaying && activeFlatIndex === 0 ? 'text-slate-800 bg-slate-950 border border-slate-800' : 'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20'}`}
              >
                <Square size={24} fill="currentColor" />
              </button>

              <button
                onClick={handlePlayPause}
                disabled={totalBeats === 0}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:opacity-20 text-white rounded-3xl flex items-center justify-center shadow-xl transform transition-all active:scale-95 hover:scale-105"
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </button>

              <button
                onClick={handleNextBar}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors active:scale-90"
              >
                <SkipForward size={24} />
              </button>

              <button
                onClick={handleNextSection}
                className="p-2.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full transition-colors active:scale-90"
              >
                <ChevronsRight size={24} />
              </button>
            </div>

            {/* Right Group: Info */}
            <div className="hidden lg:flex items-center gap-4 order-3 flex-1 justify-end">
              <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-white font-black text-2xl leading-none">{activeFlatIndex + 1}</span>
                  <span className="text-slate-600 text-xs font-bold">/ {flattenedEvents.length}</span>
                </div>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest mt-1">Chord Index</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerTab;
