
import React from 'react';
import { ChordPosition } from '../types';

interface ChordDiagramProps {
  position: ChordPosition;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({ position, label, size = 'md' }) => {
  const { frets, fingers, barres, baseFret } = position;
  
  // Increased widths to accommodate larger padding for fret label
  const width = size === 'sm' ? 120 : size === 'md' ? 160 : 240;
  const height = size === 'sm' ? 130 : size === 'md' ? 180 : 260;
  
  // Increased horizontal padding to ensure "Xfr" text fits
  const padding = { x: 36, y: 30 };
  const gridWidth = width - padding.x * 2;
  const gridHeight = height - padding.y * 1.5;
  const stringSpacing = gridWidth / 5;
  const fretSpacing = gridHeight / 5;

  const getX = (stringIdx: number) => padding.x + stringIdx * stringSpacing;
  const getY = (fretIdx: number) => padding.y + fretIdx * fretSpacing;

  return (
    <div className={`flex flex-col items-center bg-slate-800 p-3 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer group shadow-lg ${size === 'sm' ? 'min-w-[120px]' : ''}`}>
      {label && <span className="text-sm font-bold mb-2 group-hover:text-blue-400 text-center truncate w-full px-2">{label}</span>}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Render base fret indicator if not 1 */}
        {baseFret > 1 && (
          <text 
            x={padding.x - 6} 
            y={padding.y + fretSpacing / 2 + 4} 
            textAnchor="end"
            className="text-[10px] fill-slate-400 font-bold font-mono"
          >
            {baseFret}fr
          </text>
        )}

        {/* Frets */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={`fret-${i}`}
            x1={padding.x}
            y1={getY(i)}
            x2={padding.x + gridWidth}
            y2={getY(i)}
            stroke={i === 0 && baseFret === 1 ? "#f8fafc" : "#64748b"}
            strokeWidth={i === 0 && baseFret === 1 ? 4 : 1}
          />
        ))}

        {/* Strings */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={`string-${i}`}
            x1={getX(i)}
            y1={padding.y}
            x2={getX(i)}
            y2={padding.y + gridHeight}
            stroke="#64748b"
            strokeWidth={1}
          />
        ))}

        {/* Markers (X, O) */}
        {frets.map((fret, i) => {
          if (fret === 'x') {
            return (
              <text key={`marker-${i}`} x={getX(i)} y={padding.y - 8} textAnchor="middle" className="text-[12px] fill-red-500 font-bold">✕</text>
            );
          }
          if (fret === 0) {
            return (
              <circle key={`marker-${i}`} cx={getX(i)} cy={padding.y - 12} r="3.5" fill="none" stroke="#f8fafc" strokeWidth="1.5" />
            );
          }
          return null;
        })}

        {/* Barres */}
        {barres.map((fret, idx) => {
            const fretIdx = fret - baseFret + 1;
            if (fretIdx <= 0 || fretIdx > 5) return null;
            
            // Find start and end string for the barre
            const stringPositions = frets.map((f, i) => f === fret ? i : -1).filter(i => i !== -1);
            if (stringPositions.length < 2) return null;
            const start = Math.min(...stringPositions);
            const end = Math.max(...stringPositions);

            return (
                <rect 
                    key={`barre-${idx}`}
                    x={getX(start) - 6}
                    y={getY(fretIdx) - fretSpacing/2 - 6}
                    width={getX(end) - getX(start) + 12}
                    height={12}
                    rx={6}
                    fill="#3b82f6"
                />
            );
        })}

        {/* Fingering Dots */}
        {frets.map((fret, stringIdx) => {
          if (fret === 'x' || fret === 0) return null;
          const relativeFret = Number(fret) - baseFret + 1;
          if (relativeFret <= 0 || relativeFret > 5) return null;

          const finger = fingers[stringIdx];

          return (
            <g key={`dot-${stringIdx}`}>
              <circle
                cx={getX(stringIdx)}
                cy={getY(relativeFret) - fretSpacing / 2}
                r={size === 'sm' ? 6.5 : size === 'md' ? 8 : 10}
                fill="#3b82f6"
              />
              {finger && (
                <text
                  x={getX(stringIdx)}
                  y={getY(relativeFret) - fretSpacing / 2 + 4}
                  textAnchor="middle"
                  className={`${size === 'sm' ? 'text-[9px]' : 'text-[11px]'} fill-white font-bold pointer-events-none font-mono`}
                >
                  {finger}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ChordDiagram;