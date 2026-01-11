
import { jsPDF } from "jspdf";
import { Song } from '../types';

export const exportSongToPdf = (song: Song) => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = 210;
    const contentWidth = pageWidth - (margin * 2);
    
    let cursorY = 20;

    // Helper: Add Page Check
    const checkPage = (heightNeeded: number) => {
        if (cursorY + heightNeeded > 280) {
            doc.addPage();
            cursorY = 20;
        }
    };

    // Title
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(song.title, pageWidth / 2, cursorY, { align: "center" });
    cursorY += 10;

    // Metadata
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const meta = `Tempo: ${song.tempo} BPM`;
    doc.text(meta, pageWidth / 2, cursorY, { align: "center" });
    cursorY += 20;

    // Drawing Constants
    const staffLineSpacing = 1.5; // mm
    const staffHeight = staffLineSpacing * 4;
    const systemGap = 55; // Increased gap
    const chordBoxHeight = 25; // Space for chord diagram above staff
    const eventWidth = 35; 
    const headerWidth = 15; // Space for Clef/TimeSig
    
    // Flatten events
    const flatEvents = song.sections.flatMap(section => {
        const evts = section.events.map(e => ({ ...e, sectionName: section.name }));
        const repeats = section.repeat || 1;
        
        let result: Array<(typeof evts)[number] & { labelSection?: string | null }> = [];
        
        for(let i=0; i<repeats; i++) {
            const chunk = evts.map((ev, idx) => ({
                ...ev,
                labelSection: (idx === 0 && i === 0) ? section.name : null
            }));
            result = result.concat(chunk);
        }
        return result;
    });

    let currentX = margin + headerWidth;
    let beatCounter = 0;
    const beatsPerBar = song.timeSignature[0];

    // Helper to draw system lines and header
    const drawSystemLines = (y: number) => {
        doc.setLineWidth(0.1);
        doc.setDrawColor(0);
        // Stave Lines
        for (let l = 0; l < 5; l++) {
            const ly = y + (l * staffLineSpacing);
            doc.line(margin, ly, margin + contentWidth, ly);
        }
        // Start Bar
        doc.line(margin, y, margin, y + staffHeight);
        // End Bar
        doc.line(margin + contentWidth, y, margin + contentWidth, y + staffHeight);
        
        // Simulated Treble Clef (Serif 'G')
        doc.setFont("times", "italic");
        doc.setFontSize(30);
        doc.text("G", margin + 2, y + staffHeight - 1.5); 
        
        // Time Signature
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(song.timeSignature[0].toString(), margin + 10, y + 2.5); // Top
        doc.text(song.timeSignature[1].toString(), margin + 10, y + 6.5); // Bottom
    };

    // Initial System
    checkPage(systemGap);
    let staveY = cursorY + chordBoxHeight;
    drawSystemLines(staveY);

    flatEvents.forEach((event, index) => {
        // Check if we fit in current row
        if (currentX + eventWidth > margin + contentWidth) {
            // New System
            cursorY += systemGap;
            checkPage(systemGap);
            staveY = cursorY + chordBoxHeight;
            drawSystemLines(staveY);
            currentX = margin + headerWidth;
        }

        // Center of event slot
        const centerX = currentX + (eventWidth / 2);

        // Draw Chord Diagram & Name
        if (event.chord) {
            const name = `${event.chord.key}${event.chord.suffix}`;
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(name, centerX, staveY - 20, { align: "center" });

            // Mini Diagram
            const diaX = centerX - 5;
            const diaY = staveY - 18;
            const w = 10;
            const h = 12;
            const pos = event.chord.positions[event.positionIndex];
            
            // Strings
            for(let s=0; s<6; s++) {
                const lx = diaX + (s * (w/5));
                doc.setLineWidth(0.1);
                doc.line(lx, diaY, lx, diaY+h);
            }
            // Frets
            for(let f=0; f<=5; f++) {
                const ly = diaY + (f * (h/5));
                doc.setLineWidth(f===0 && pos.baseFret===1 ? 0.5 : 0.1);
                doc.line(diaX, ly, diaX+w, ly);
            }
            // Dots
            pos.frets.forEach((f, sIdx) => {
                if (f === 'x') {
                    doc.setFontSize(5);
                    doc.text('x', diaX + (sIdx*(w/5)), diaY - 0.5, {align:'center'});
                } else if (f === 0) {
                    doc.circle(diaX + (sIdx*(w/5)), diaY - 0.5, 0.4, 'S');
                } else {
                    const rel = (f as number) - pos.baseFret + 1;
                    if(rel >= 1 && rel <= 5) {
                        const cx = diaX + (sIdx*(w/5));
                        const cy = diaY + ((rel-1) * (h/5)) + (h/10);
                        doc.circle(cx, cy, 1, 'F');
                    }
                }
            });
            // Base Fret Label
            if (pos.baseFret > 1) {
                doc.setFontSize(6);
                doc.text(`${pos.baseFret}fr`, diaX - 1, diaY + 2, { align: 'right' });
            }

        } else {
            // Rest
            doc.setFontSize(10);
            doc.text("Rest", centerX, staveY - 5, { align: "center" });
            doc.rect(centerX - 2, staveY + staffLineSpacing, 4, staffLineSpacing, 'F');
        }

        // Section Label (Below Staff)
        if (event.labelSection) {
            doc.setFontSize(9);
            doc.setFont("helvetica", "bolditalic");
            doc.text(event.labelSection, currentX + 2, staveY + staffHeight + 5, { align: "left" });
        }

        // Advance Beat Counter
        beatCounter += event.duration;

        // Draw Bar Line if measure complete
        if (beatCounter % beatsPerBar === 0) {
            const barX = currentX + eventWidth;
            // Only draw if within bounds (system box handles the far right edge usually, but explicit lines are good)
            if (barX <= margin + contentWidth + 1) {
                doc.setLineWidth(0.2);
                doc.line(barX, staveY, barX, staveY + staffHeight);
            }
        }

        currentX += eventWidth;
    });

    doc.save(`${song.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
};
