
import { Song, ChordPosition } from '../types';

// Standard E Tuning MIDI numbers: E2, A2, D3, G3, B3, e4
const STRING_MIDI_BASE = [40, 45, 50, 55, 59, 64];
const TICKS_PER_BEAT = 480;

class MidiWriter {
  private bytes: number[] = [];

  writeString(str: string) {
    for (let i = 0; i < str.length; i++) {
      this.bytes.push(str.charCodeAt(i));
    }
  }

  writeUint8(value: number) {
    this.bytes.push(value & 0xFF);
  }

  writeUint16(value: number) {
    this.bytes.push((value >> 8) & 0xFF);
    this.bytes.push(value & 0xFF);
  }

  writeUint32(value: number) {
    this.bytes.push((value >> 24) & 0xFF);
    this.bytes.push((value >> 16) & 0xFF);
    this.bytes.push((value >> 8) & 0xFF);
    this.bytes.push(value & 0xFF);
  }

  writeVarInt(value: number) {
    let buffer = value & 0x7F;
    while ((value >>= 7)) {
      buffer <<= 8;
      buffer |= ((value & 0x7F) | 0x80);
    }
    while (true) {
      this.bytes.push(buffer & 0xFF);
      if (buffer & 0x80) buffer >>= 8;
      else break;
    }
  }

  writeBytes(bytes: number[]) {
    this.bytes.push(...bytes);
  }

  getBytes() {
    return new Uint8Array(this.bytes);
  }
}

export const exportSongToMidi = (song: Song) => {
  const track = new MidiWriter();
  
  // -- TRACK SETUP --
  
  // 1. Set Track Name (Sequence Name)
  // Delta 0, Meta 0x03, Length, Text
  track.writeVarInt(0);
  track.writeBytes([0xFF, 0x03]);
  track.writeVarInt(song.title.length);
  track.writeString(song.title);

  // 2. Set Tempo
  // MIDI Tempo is microseconds per quarter note. 60,000,000 / BPM
  const microsecondsPerBeat = Math.round(60000000 / song.tempo);
  track.writeVarInt(0);
  track.writeBytes([0xFF, 0x51, 0x03]); // Tempo Meta Event
  track.writeBytes([
    (microsecondsPerBeat >> 16) & 0xFF,
    (microsecondsPerBeat >> 8) & 0xFF,
    microsecondsPerBeat & 0xFF
  ]);

  // 3. Time Signature
  // Delta 0, Meta 0x58, Len 4, NN, DD (power of 2), CC (clocks/tick), BB (32nds/24clocks)
  // Using simplified 4/4 defaults for CC/BB usually works fine
  const num = song.timeSignature[0];
  const den = Math.log2(song.timeSignature[1]);
  track.writeVarInt(0);
  track.writeBytes([0xFF, 0x58, 0x04, num, den, 0x18, 0x08]);

  // 4. Program Change (Instrument)
  // Channel 0, Instrument 24 (Acoustic Guitar Nylon) - 0x18 in hex
  track.writeVarInt(0);
  track.writeBytes([0xC0, 24]); 

  // -- NOTE GENERATION --
  
  // Flatten song structure
  const flatEvents = song.sections.flatMap(section => {
    const repeats = section.repeat || 1;
    return Array.from({ length: repeats }).flatMap((_, rIdx) => 
      section.events.map((evt, eIdx) => ({
        ...evt,
        // Mark the start of a section for annotation
        marker: (rIdx === 0 && eIdx === 0) ? section.name : null
      }))
    );
  });

  // Iterate events
  flatEvents.forEach(event => {
    // 1. Insert Marker if applicable (Annotates section start)
    if (event.marker) {
      track.writeVarInt(0); // Delta 0
      track.writeBytes([0xFF, 0x06]); // Marker Meta Event
      track.writeVarInt(event.marker.length);
      track.writeString(event.marker);
    }

    const durationTicks = event.duration * TICKS_PER_BEAT;
    
    if (event.chord) {
      const position = event.chord.positions[event.positionIndex];
      const notes: number[] = [];

      // Calculate MIDI notes for this chord
      position.frets.forEach((fret, stringIdx) => {
        if (fret !== 'x') {
          notes.push(STRING_MIDI_BASE[stringIdx] + (fret as number));
        }
      });

      // Note ON events (Velocity 100)
      // All notes start at delta 0 relative to this event block start
      notes.forEach((note, idx) => {
        // Delta time: 0 for all simultaneous notes (except potential strum offset, ignored here for compatibility)
        track.writeVarInt(0); 
        track.writeBytes([0x90, note, 100]);
      });

      // Note OFF events
      // The first note off handles the delta time for the duration
      // Subsequent note offs have delta 0
      notes.forEach((note, idx) => {
        track.writeVarInt(idx === 0 ? durationTicks : 0);
        track.writeBytes([0x80, note, 0]);
      });

      // If no notes (empty chord object?), ensure time advances (shouldn't happen with chord check)
      if (notes.length === 0) {
         // Empty Rest (using a dummy event to advance time if chord object existed but had no notes)
         // Not standard path, but fallback.
      }

    } else {
      // REST (Silence)
      // We assume a rest is just time passing without notes.
      // However, we need an event to carry the delta time.
      // We often attach the delta time to the *next* event, but since we are processing linearly,
      // we can write a dummy event or ensure the marker of the NEXT event absorbs this time.
      // Easier strategy for MIDI writers: Write a "dummy" event that does nothing but consumes time? 
      // Or simply append a NO-OP event. 
      // Actually, standard practice: we just wait to write the NEXT delta.
      // BUT, our structure writes [Delta, Event]. 
      // To create a gap, we can't just leave a gap.
      // Solution: The *next* event logic needs to know about previous rest time.
      
      // ALTERNATIVE STRATEGY FOR SIMPLICITY:
      // Always write something. For a rest, we can't "hold" the delta easily in this loop structure 
      // without looking ahead.
      // Exception: We can write a meta event that does nothing, or simply ensure we write the duration into the *next* event's delta.
      // However, complicating the loop.
      
      // SIMPLEST HACK: Write a note with velocity 0 (which is note off) or a dummy controller change.
      // Let's use a dummy Controller Change (e.g., CC 120 All Sound Off - risky, or just Undefined).
      // Better: Just write a dummy Meta Event (Text) with empty string.
      track.writeVarInt(durationTicks); // Wait duration
      track.writeBytes([0xFF, 0x01, 0x00]); // Text Event (Empty) acting as a spacer
    }
  });

  // End of Track
  track.writeVarInt(TICKS_PER_BEAT); // Wait a beat
  track.writeBytes([0xFF, 0x2F, 0x00]);

  // -- FILE CONSTRUCTION --
  const file = new MidiWriter();
  
  // Header Chunk
  file.writeString('MThd');
  file.writeUint32(6); // Chunk length
  file.writeUint16(0); // Format 0 (single track)
  file.writeUint16(1); // 1 Track
  file.writeUint16(TICKS_PER_BEAT);

  // Track Chunk
  const trackBytes = track.getBytes();
  file.writeString('MTrk');
  file.writeUint32(trackBytes.length);
  file.writeBytes(Array.from(trackBytes));

  // Download
  const blob = new Blob([file.getBytes()], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${song.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mid`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
