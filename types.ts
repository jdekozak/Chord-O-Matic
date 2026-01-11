
export interface ChordPosition {
  frets: (number | 'x')[];
  fingers: (number | null)[];
  barres: number[];
  capo?: boolean;
  baseFret: number;
  midi?: number[];
}

export interface ChordDefinition {
  key: string;
  suffix: string;
  positions: ChordPosition[];
}

export interface ChordLibrary {
  keys: string[];
  suffixes: string[];
  chords: Record<string, ChordDefinition[]>;
}

export interface SongEvent {
  id: string;
  chord: ChordDefinition | null;
  positionIndex: number;
  duration: number; // in beats
}

export interface SongSection {
  id: string;
  name: string;
  events: SongEvent[];
  repeat?: number;
}

export interface Song {
  title: string;
  tempo: number;
  timeSignature: [number, number];
  sections: SongSection[];
}

export enum Tab {
  Editor = 'editor',
  Player = 'player'
}
