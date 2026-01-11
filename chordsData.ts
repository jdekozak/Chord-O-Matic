import { ChordLibrary, ChordDefinition, ChordPosition } from './types';

// Helper to parse hex-encoded fret strings (0-9, a-f)
// 'x' denotes muted/not played
function parseFrets(fretStr: string): (number | 'x')[] {
  return fretStr.split('').map(char => {
    if (char.toLowerCase() === 'x') return 'x';
    // Use base 16 to handle 'a' (10) through 'f' (15)
    const val = parseInt(char, 16);
    return isNaN(val) ? 'x' : val;
  });
}

// Helper to parse finger strings (0-4)
// 0 usually denotes open string or no finger placed
function parseFingers(fingerStr: string): (number | null)[] {
  return fingerStr.split('').map(char => {
    const val = parseInt(char, 10);
    return (isNaN(val) || val === 0) ? null : val;
  });
}

function processRawData(data: any[]): ChordLibrary {
  const chords: Record<string, ChordDefinition[]> = {};
  const keys = new Set<string>();
  const suffixes = new Set<string>();

  data.forEach(item => {
    // Normalize Key (e.g. C#)
    const key = item.key.replace('sharp', '#');
    // Normalize Suffix
    const suffix = item.suffix;

    keys.add(key);
    suffixes.add(suffix);

    if (!chords[key]) chords[key] = [];

    const positions: ChordPosition[] = item.positions.map((pos: any) => {
      const frets = parseFrets(pos.frets);
      
      // Calculate base fret for rendering
      // Default to 1. If the lowest played fret is > 2, use that as base.
      const numericFrets = frets.filter(f => typeof f === 'number' && f > 0) as number[];
      let baseFret = 1;
      if (numericFrets.length > 0) {
        const minFret = Math.min(...numericFrets);
        if (minFret > 2) baseFret = minFret;
      }

      // Normalize barres to array of numbers
      let barres: number[] = [];
      if (typeof pos.barres === 'number') barres = [pos.barres];
      else if (Array.isArray(pos.barres)) barres = pos.barres;

      return {
        frets,
        fingers: parseFingers(pos.fingers),
        barres,
        capo: pos.capo,
        baseFret
      };
    });

    chords[key].push({
      key,
      suffix,
      positions
    });
  });

  return {
    keys: Array.from(keys).sort(),
    suffixes: Array.from(suffixes).sort(),
    chords
  };
}

const RAW_DATA = [
  {
    "key": "A",
    "suffix": "11",
    "positions": [
      {
        "frets": "x00020",
        "fingers": "000020"
      },
      {
        "frets": "540003",
        "fingers": "320001"
      },
      {
        "frets": "555655",
        "fingers": "111211",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "777789",
        "fingers": "111123",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "13",
    "positions": [
      {
        "frets": "x02022",
        "fingers": "001023"
      },
      {
        "frets": "544030",
        "fingers": "423010"
      },
      {
        "frets": "575675",
        "fingers": "131241",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xcbcee",
        "fingers": "021344",
        "barres": 14
      }
    ]
  },
  {
    "key": "A",
    "suffix": "5",
    "positions": [
      {
        "frets": "57xxxx",
        "fingers": "130000"
      },
      {
        "frets": "x02xxx",
        "fingers": "001000"
      },
      {
        "frets": "577xxx",
        "fingers": "134000"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "6",
    "positions": [
      {
        "frets": "x02222",
        "fingers": "001111",
        "barres": 2
      },
      {
        "frets": "5x465x",
        "fingers": "201430"
      },
      {
        "frets": "57x675",
        "fingers": "130241",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xcbbax",
        "fingers": "042310"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "69",
    "positions": [
      {
        "frets": "x04422",
        "fingers": "003411",
        "barres": 2
      },
      {
        "frets": "544455",
        "fingers": "211134",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x77677",
        "fingers": "022134",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xcbbcc",
        "fingers": "021134",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "7#9",
    "positions": [
      {
        "frets": "575688",
        "fingers": "131244",
        "barres": [
          5,
          8
        ],
        "capo": true
      },
      {
        "frets": "xx7688",
        "fingers": "002134"
      },
      {
        "frets": "x0a989",
        "fingers": "004213"
      },
      {
        "frets": "xcbcdx",
        "fingers": "021340"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "7",
    "positions": [
      {
        "frets": "x02020",
        "fingers": "002030"
      },
      {
        "frets": "x02223",
        "fingers": "001112",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "575655",
        "fingers": "131211",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x07989",
        "fingers": "001324"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "7b5",
    "positions": [
      {
        "frets": "x01223",
        "fingers": "001234"
      },
      {
        "frets": "x05645",
        "fingers": "002413"
      },
      {
        "frets": "xx7889",
        "fingers": "001234"
      },
      {
        "frets": "xabcab",
        "fingers": "012413",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "7b9",
    "positions": [
      {
        "frets": "x02323",
        "fingers": "001213",
        "barres": 2
      },
      {
        "frets": "575656",
        "fingers": "141213",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx7686",
        "fingers": "002131",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xcbcbc",
        "fingers": "021314",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "7sus4",
    "positions": [
      {
        "frets": "x02030",
        "fingers": "002030"
      },
      {
        "frets": "575755",
        "fingers": "131411",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x0798a",
        "fingers": "001324"
      },
      {
        "frets": "xcccaa",
        "fingers": "023411",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "9#11",
    "positions": [
      {
        "frets": "x01020",
        "fingers": "001030"
      },
      {
        "frets": "545445",
        "fingers": "213114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx7889",
        "fingers": "001234"
      },
      {
        "frets": "xcbccb",
        "fingers": "021341",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "9",
    "positions": [
      {
        "frets": "542000",
        "fingers": "431000"
      },
      {
        "frets": "x02423",
        "fingers": "001312",
        "barres": 2
      },
      {
        "frets": "575657",
        "fingers": "131214",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xcbccc",
        "fingers": "021333",
        "barres": 12
      }
    ]
  },
  {
    "key": "A",
    "suffix": "9b5",
    "positions": [
      {
        "frets": "x01423",
        "fingers": "001423"
      },
      {
        "frets": "545445",
        "fingers": "213114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x09889",
        "fingers": "002113",
        "barres": 8
      },
      {
        "frets": "xcbccb",
        "fingers": "021341",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "add11",
    "positions": [
      {
        "frets": "x077a9",
        "fingers": "001143",
        "barres": 7
      },
      {
        "frets": "x0b9aa",
        "fingers": "003122",
        "barres": 10
      },
      {
        "frets": "x0c9a9",
        "fingers": "004121",
        "barres": 9
      },
      {
        "frets": "xcb9aa",
        "fingers": "043122",
        "barres": 10
      }
    ]
  },
  {
    "key": "A",
    "suffix": "add9",
    "positions": [
      {
        "frets": "x02420",
        "fingers": "001320"
      },
      {
        "frets": "xx7657",
        "fingers": "003214"
      },
      {
        "frets": "xcb9c9",
        "fingers": "032141",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xcbxcc",
        "fingers": "021034"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "alt",
    "positions": [
      {
        "frets": "x0122x",
        "fingers": "001230"
      },
      {
        "frets": "x07645",
        "fingers": "004312"
      },
      {
        "frets": "x0b8a9",
        "fingers": "004132"
      },
      {
        "frets": "xcdeex",
        "fingers": "012340"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "aug",
    "positions": [
      {
        "frets": "x03221",
        "fingers": "004231"
      },
      {
        "frets": "54322x",
        "fingers": "432110",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "5x7665",
        "fingers": "104231",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xcbaax",
        "fingers": "032110",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "aug7",
    "positions": [
      {
        "frets": "x03021",
        "fingers": "003021"
      },
      {
        "frets": "x03223",
        "fingers": "002113",
        "barres": 2
      },
      {
        "frets": "x05665",
        "fingers": "001231",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx7a89",
        "fingers": "001423"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "aug9",
    "positions": [
      {
        "frets": "x03423",
        "fingers": "002413"
      },
      {
        "frets": "543005",
        "fingers": "321004"
      },
      {
        "frets": "x05667",
        "fingers": "001234"
      },
      {
        "frets": "xcbc0d",
        "fingers": "021304"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "dim",
    "positions": [
      {
        "frets": "x0121x",
        "fingers": "001320"
      },
      {
        "frets": "53x43x",
        "fingers": "310420"
      },
      {
        "frets": "xx78x8",
        "fingers": "001203"
      },
      {
        "frets": "xcaxab",
        "fingers": "041023"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "dim7",
    "positions": [
      {
        "frets": "x01212",
        "fingers": "001324"
      },
      {
        "frets": "5x454x",
        "fingers": "201310",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "567575",
        "fingers": "123141",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x07878",
        "fingers": "001324",
        "barres": 7
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m11",
    "positions": [
      {
        "frets": "x00010",
        "fingers": "000010"
      },
      {
        "frets": "535433",
        "fingers": "314211",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "555557",
        "fingers": "111114",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xcacca",
        "fingers": "021341",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m6",
    "positions": [
      {
        "frets": "x02212",
        "fingers": "002314"
      },
      {
        "frets": "5x4555",
        "fingers": "201334",
        "barres": 5
      },
      {
        "frets": "577575",
        "fingers": "123141",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x77978",
        "fingers": "011312",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m69",
    "positions": [
      {
        "frets": "x04500",
        "fingers": "002400"
      },
      {
        "frets": "577577",
        "fingers": "122134",
        "barres": [
          5,
          7
        ],
        "capo": true
      },
      {
        "frets": "807977",
        "fingers": "201311",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xcabcc",
        "fingers": "031244",
        "barres": 12
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m7",
    "positions": [
      {
        "frets": "x02010",
        "fingers": "002010"
      },
      {
        "frets": "x02213",
        "fingers": "002314"
      },
      {
        "frets": "5x555x",
        "fingers": "203330"
      },
      {
        "frets": "x05555",
        "fingers": "001111",
        "barres": 5
      },
      {
        "frets": "575555",
        "fingers": "131111",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x77988",
        "fingers": "011423",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m7b5",
    "positions": [
      {
        "frets": "x0101x",
        "fingers": "002030"
      },
      {
        "frets": "5x554x",
        "fingers": "203410"
      },
      {
        "frets": "567585",
        "fingers": "123141",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx7888",
        "fingers": "001222",
        "barres": 8
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m9",
    "positions": [
      {
        "frets": "x02413",
        "fingers": "002413"
      },
      {
        "frets": "575557",
        "fingers": "131114",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "809080",
        "fingers": "103020"
      },
      {
        "frets": "xcaccc",
        "fingers": "021344",
        "barres": 12
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m9_C",
    "positions": [
      {
        "frets": "877987",
        "fingers": "211431",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "8x7987",
        "fingers": "201431",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m9_G",
    "positions": [
      {
        "frets": "302000",
        "fingers": "201000"
      },
      {
        "frets": "302003",
        "fingers": "201003"
      },
      {
        "frets": "302200",
        "fingers": "301200"
      },
      {
        "frets": "302400",
        "fingers": "201300"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "madd9",
    "positions": [
      {
        "frets": "x02410",
        "fingers": "002410"
      },
      {
        "frets": "xx7557",
        "fingers": "003114",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx7908",
        "fingers": "001302"
      },
      {
        "frets": "xca9cx",
        "fingers": "032140"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "maj11",
    "positions": [
      {
        "frets": "x00120",
        "fingers": "000120"
      },
      {
        "frets": "x00224",
        "fingers": "000114",
        "barres": 2
      },
      {
        "frets": "556657",
        "fingers": "112314",
        "barres": 5
      },
      {
        "frets": "a09999",
        "fingers": "201111",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "maj13",
    "positions": [
      {
        "frets": "x02122",
        "fingers": "002134"
      },
      {
        "frets": "544454",
        "fingers": "211131",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x06677",
        "fingers": "001134",
        "barres": 6
      },
      {
        "frets": "xcbb99",
        "fingers": "042311",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "maj7#5",
    "positions": [
      {
        "frets": "x03121",
        "fingers": "003121",
        "barres": 1
      },
      {
        "frets": "x03224",
        "fingers": "002113",
        "barres": 2
      },
      {
        "frets": "x06665",
        "fingers": "002341"
      },
      {
        "frets": "9cba99",
        "fingers": "043211",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "maj7",
    "positions": [
      {
        "frets": "x02120",
        "fingers": "002130"
      },
      {
        "frets": "x02224",
        "fingers": "001114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "576655",
        "fingers": "142311",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x07999",
        "fingers": "001333",
        "barres": 9
      }
    ]
  },
  {
    "key": "A",
    "suffix": "maj7b5",
    "positions": [
      {
        "frets": "x01124",
        "fingers": "001124",
        "barres": 1
      },
      {
        "frets": "x01224",
        "fingers": "001224",
        "barres": 2
      },
      {
        "frets": "5666xx",
        "fingers": "123400"
      },
      {
        "frets": "x07899",
        "fingers": "001234"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "maj7sus2",
    "positions": [
      {
        "frets": "x02100",
        "fingers": "002100"
      },
      {
        "frets": "x02104",
        "fingers": "002104"
      },
      {
        "frets": "x02204",
        "fingers": "001204"
      },
      {
        "frets": "x02404",
        "fingers": "001304"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "maj9",
    "positions": [
      {
        "frets": "x02424",
        "fingers": "001314",
        "barres": 2
      },
      {
        "frets": "546450",
        "fingers": "214130",
        "barres": 4
      },
      {
        "frets": "x06657",
        "fingers": "002314"
      },
      {
        "frets": "ccbdcx",
        "fingers": "221430",
        "barres": 12
      }
    ]
  },
  {
    "key": "A",
    "suffix": "major",
    "positions": [
      {
        "frets": "x02220",
        "fingers": "001230"
      },
      {
        "frets": "x02225",
        "fingers": "001114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "577655",
        "fingers": "134211",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x079a9",
        "fingers": "001243"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "minor",
    "positions": [
      {
        "frets": "x02210",
        "fingers": "002310"
      },
      {
        "frets": "x02555",
        "fingers": "001444",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "577555",
        "fingers": "134111",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x079a8",
        "fingers": "001342"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "mmaj11",
    "positions": [
      {
        "frets": "x00110",
        "fingers": "000120"
      },
      {
        "frets": "556557",
        "fingers": "112114",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x07798",
        "fingers": "001132",
        "barres": 7
      },
      {
        "frets": "xcadca",
        "fingers": "021431",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "mmaj7",
    "positions": [
      {
        "frets": "x02110",
        "fingers": "003120"
      },
      {
        "frets": "576555",
        "fingers": "132111",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x77998",
        "fingers": "011342",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xca99x",
        "fingers": "042110",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "mmaj7b5",
    "positions": [
      {
        "frets": "x01114",
        "fingers": "001114",
        "barres": 1
      },
      {
        "frets": "5665x5",
        "fingers": "123101",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx7898",
        "fingers": "001243"
      },
      {
        "frets": "bcdddx",
        "fingers": "123330",
        "barres": 13
      }
    ]
  },
  {
    "key": "A",
    "suffix": "mmaj9",
    "positions": [
      {
        "frets": "536400",
        "fingers": "314200"
      },
      {
        "frets": "x06504",
        "fingers": "003201"
      },
      {
        "frets": "576557",
        "fingers": "132114",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x09998",
        "fingers": "002341"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m_Ab",
    "positions": [
      {
        "frets": "432255",
        "fingers": "321144",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "432555",
        "fingers": "321444",
        "barres": 5
      },
      {
        "frets": "xx6555",
        "fingers": "002111",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "43225x",
        "fingers": "321140",
        "barres": 2,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m_B",
    "positions": [
      {
        "frets": "x22210",
        "fingers": "023410"
      },
      {
        "frets": "x22555",
        "fingers": "011444",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "777555",
        "fingers": "234111",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "7779a8",
        "fingers": "111342",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m_Bb",
    "positions": [
      {
        "frets": "x12210",
        "fingers": "013420"
      },
      {
        "frets": "677555",
        "fingers": "234111",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx8555",
        "fingers": "004111",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx89a8",
        "fingers": "001231",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m_C#",
    "positions": [
      {
        "frets": "x42555",
        "fingers": "031444",
        "barres": 5
      },
      {
        "frets": "xxb9a8",
        "fingers": "004231"
      },
      {
        "frets": "xxbedc",
        "fingers": "001432"
      },
      {
        "frets": "9ca9xx",
        "fingers": "142100",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m_C",
    "positions": [
      {
        "frets": "x32210",
        "fingers": "042310"
      },
      {
        "frets": "x32255",
        "fingers": "021144",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x32555",
        "fingers": "021444",
        "barres": 5
      },
      {
        "frets": "877555",
        "fingers": "423111",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m_D",
    "positions": [
      {
        "frets": "xx0210",
        "fingers": "000210"
      },
      {
        "frets": "xx0555",
        "fingers": "000111",
        "barres": 5
      },
      {
        "frets": "x57555",
        "fingers": "013111",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x57558",
        "fingers": "013114",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m_E",
    "positions": [
      {
        "frets": "002210",
        "fingers": "002310"
      },
      {
        "frets": "032210",
        "fingers": "042310"
      },
      {
        "frets": "032255",
        "fingers": "021144",
        "barres": 2
      },
      {
        "frets": "032555",
        "fingers": "021444",
        "barres": 5
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m_Eb",
    "positions": [
      {
        "frets": "xx1210",
        "fingers": "001320"
      },
      {
        "frets": "x67555",
        "fingers": "023111",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x67558",
        "fingers": "023114",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x6755x",
        "fingers": "023110",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m_F#",
    "positions": [
      {
        "frets": "202210",
        "fingers": "203410"
      },
      {
        "frets": "xx4210",
        "fingers": "004210"
      },
      {
        "frets": "232255",
        "fingers": "121144",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "232555",
        "fingers": "121444",
        "barres": 2,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m_F",
    "positions": [
      {
        "frets": "xx3210",
        "fingers": "003210"
      },
      {
        "frets": "xx3555",
        "fingers": "001333",
        "barres": 5
      },
      {
        "frets": "x87555",
        "fingers": "043111",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x8a9a8",
        "fingers": "013241",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m_G#",
    "positions": [
      {
        "frets": "432555",
        "fingers": "321444",
        "barres": 5
      },
      {
        "frets": "432255",
        "fingers": "321144",
        "barres": 2
      }
    ]
  },
  {
    "key": "A",
    "suffix": "m_G",
    "positions": [
      {
        "frets": "302210",
        "fingers": "402310"
      },
      {
        "frets": "xx5555",
        "fingers": "001111",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "30221x",
        "fingers": "402310"
      },
      {
        "frets": "xaa9ax",
        "fingers": "023140"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "sus",
    "positions": [
      {
        "frets": "x00230",
        "fingers": "000120"
      },
      {
        "frets": "x02230",
        "fingers": "001230"
      },
      {
        "frets": "x02235",
        "fingers": "001124",
        "barres": 2
      },
      {
        "frets": "x07755",
        "fingers": "003411",
        "barres": 5
      }
    ]
  },
  {
    "key": "A",
    "suffix": "sus2",
    "positions": [
      {
        "frets": "x02200",
        "fingers": "002300"
      },
      {
        "frets": "x02400",
        "fingers": "001400"
      },
      {
        "frets": "7779a7",
        "fingers": "111341",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "x09900",
        "fingers": "001200"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "sus2sus4",
    "positions": [
      {
        "frets": "x00200",
        "fingers": "000100"
      },
      {
        "frets": "557757",
        "fingers": "112314",
        "barres": [
          5
        ],
        "capo": true
      },
      {
        "frets": "5524xx",
        "fingers": "341200"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "sus4",
    "positions": [
      {
        "frets": "x02230",
        "fingers": "001230"
      },
      {
        "frets": "x00x30",
        "fingers": "000010"
      },
      {
        "frets": "577755",
        "fingers": "133411",
        "barres": [
          5,
          7
        ],
        "capo": true
      },
      {
        "frets": "x779aa",
        "fingers": "011234",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "_Ab",
    "positions": [
      {
        "frets": "442225",
        "fingers": "231114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "442255",
        "fingers": "231144",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx6655",
        "fingers": "002311",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xbb9a9",
        "fingers": "034121",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "_B",
    "positions": [
      {
        "frets": "x22220",
        "fingers": "012340"
      },
      {
        "frets": "x22225",
        "fingers": "011114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "7779a9",
        "fingers": "111243",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xx99a9",
        "fingers": "001121",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "_Bb",
    "positions": [
      {
        "frets": "x12220",
        "fingers": "012340"
      },
      {
        "frets": "xx8655",
        "fingers": "004211",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx89a9",
        "fingers": "001243"
      },
      {
        "frets": "x1222x",
        "fingers": "012220",
        "barres": 2
      }
    ]
  },
  {
    "key": "A",
    "suffix": "_C#",
    "positions": [
      {
        "frets": "x42225",
        "fingers": "031114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x42255",
        "fingers": "031144",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "9cb9a9",
        "fingers": "143121",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "9xx9a9",
        "fingers": "111121",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "_C",
    "positions": [
      {
        "frets": "x32220",
        "fingers": "041230"
      },
      {
        "frets": "x32225",
        "fingers": "021114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xxa9a9",
        "fingers": "002131",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "x3222x",
        "fingers": "021110",
        "barres": 2,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "_D",
    "positions": [
      {
        "frets": "xx0220",
        "fingers": "000120"
      },
      {
        "frets": "xx0655",
        "fingers": "000211",
        "barres": 5
      },
      {
        "frets": "x57655",
        "fingers": "013211",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx09a9",
        "fingers": "000121",
        "barres": 9
      }
    ]
  },
  {
    "key": "A",
    "suffix": "_E",
    "positions": [
      {
        "frets": "002220",
        "fingers": "001230"
      },
      {
        "frets": "042225",
        "fingers": "031114",
        "barres": 2
      },
      {
        "frets": "042255",
        "fingers": "031144",
        "barres": 2
      },
      {
        "frets": "xx2220",
        "fingers": "001230"
      }
    ]
  },
  {
    "key": "A",
    "suffix": "_Eb",
    "positions": [
      {
        "frets": "xx1220",
        "fingers": "001230"
      },
      {
        "frets": "x67655",
        "fingers": "024311",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x6765x",
        "fingers": "024310"
      },
      {
        "frets": "bceeex",
        "fingers": "124440",
        "barres": 14
      }
    ]
  },
  {
    "key": "A",
    "suffix": "_F#",
    "positions": [
      {
        "frets": "202220",
        "fingers": "102340"
      },
      {
        "frets": "xx4220",
        "fingers": "004120"
      },
      {
        "frets": "242225",
        "fingers": "131114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "242255",
        "fingers": "131144",
        "barres": 2,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "_F",
    "positions": [
      {
        "frets": "102220",
        "fingers": "102340"
      },
      {
        "frets": "xx3220",
        "fingers": "003120"
      },
      {
        "frets": "xx3655",
        "fingers": "001423"
      },
      {
        "frets": "x87655",
        "fingers": "043211",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "A",
    "suffix": "_G#",
    "positions": [
      {
        "frets": "442255",
        "fingers": "231144",
        "barres": 2
      },
      {
        "frets": "442225",
        "fingers": "231114",
        "barres": 2
      },
      {
        "frets": "xx6655",
        "fingers": "002311",
        "barres": 5
      }
    ]
  },
  {
    "key": "A",
    "suffix": "_G",
    "positions": [
      {
        "frets": "302220",
        "fingers": "401230"
      },
      {
        "frets": "342225",
        "fingers": "231114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "342255",
        "fingers": "231144",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx5655",
        "fingers": "001211",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "11",
    "positions": [
      {
        "frets": "444544",
        "fingers": "111211",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "666678",
        "fingers": "111123",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xbab99",
        "fingers": "032411",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xbbbdb",
        "fingers": "011131",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "13",
    "positions": [
      {
        "frets": "413112",
        "fingers": "413112",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "464564",
        "fingers": "131241",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "444566",
        "fingers": "111234",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xbabdd",
        "fingers": "021344",
        "barres": 13
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "5",
    "positions": [
      {
        "frets": "46xxxx",
        "fingers": "130000"
      },
      {
        "frets": "xbdxxx",
        "fingers": "013000"
      },
      {
        "frets": "466xxx",
        "fingers": "134000"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "6",
    "positions": [
      {
        "frets": "x31111",
        "fingers": "031111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "4x354x",
        "fingers": "201430"
      },
      {
        "frets": "x66868",
        "fingers": "011314",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xbaa9x",
        "fingers": "042310"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "69",
    "positions": [
      {
        "frets": "x11111",
        "fingers": "011111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "433344",
        "fingers": "211134",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx6566",
        "fingers": "002134"
      },
      {
        "frets": "xbaabb",
        "fingers": "021134",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "7#9",
    "positions": [
      {
        "frets": "434444",
        "fingers": "213334",
        "barres": 4
      },
      {
        "frets": "464577",
        "fingers": "131244",
        "barres": [
          4,
          7
        ],
        "capo": true
      },
      {
        "frets": "xx6577",
        "fingers": "003144",
        "barres": 7
      },
      {
        "frets": "xbabcx",
        "fingers": "021340"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "7",
    "positions": [
      {
        "frets": "xx1112",
        "fingers": "001112",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "464544",
        "fingers": "131211",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x66878",
        "fingers": "011324",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bbdbdb",
        "fingers": "113141",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "7b5",
    "positions": [
      {
        "frets": "4x453x",
        "fingers": "203410"
      },
      {
        "frets": "xx6778",
        "fingers": "001234"
      },
      {
        "frets": "x9ab9a",
        "fingers": "012413",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xbcbdx",
        "fingers": "012130",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "7b9",
    "positions": [
      {
        "frets": "x01112",
        "fingers": "001112",
        "barres": 1
      },
      {
        "frets": "xx4545",
        "fingers": "101213",
        "barres": 4
      },
      {
        "frets": "xx6575",
        "fingers": "002131",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xbabab",
        "fingers": "021314",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "7sus4",
    "positions": [
      {
        "frets": "xx1122",
        "fingers": "001122",
        "barres": [
          1,
          2
        ],
        "capo": true
      },
      {
        "frets": "464644",
        "fingers": "131411",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xbbb99",
        "fingers": "023411",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "bbdbeb",
        "fingers": "113141",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "9#11",
    "positions": [
      {
        "frets": "4x453x",
        "fingers": "203410"
      },
      {
        "frets": "xx6778",
        "fingers": "001234"
      },
      {
        "frets": "xbabba",
        "fingers": "021341",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "xbcbdb",
        "fingers": "012131",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "9",
    "positions": [
      {
        "frets": "43434x",
        "fingers": "213140",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "464546",
        "fingers": "131214",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx6576",
        "fingers": "002143"
      },
      {
        "frets": "bbabbb",
        "fingers": "221334",
        "barres": 11
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "9b5",
    "positions": [
      {
        "frets": "4303x2",
        "fingers": "420301"
      },
      {
        "frets": "434334",
        "fingers": "213114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "4545x6",
        "fingers": "121304",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xbabba",
        "fingers": "021341",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "add11",
    "positions": [
      {
        "frets": "xba899",
        "fingers": "043122",
        "barres": 9
      },
      {
        "frets": "43112x",
        "fingers": "431120",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "4366xx",
        "fingers": "214400",
        "barres": 6
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "add9",
    "positions": [
      {
        "frets": "43x34x",
        "fingers": "310240"
      },
      {
        "frets": "xx6546",
        "fingers": "003214"
      },
      {
        "frets": "xba8b8",
        "fingers": "032141",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xbaxbb",
        "fingers": "021034"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "alt",
    "positions": [
      {
        "frets": "xx6534",
        "fingers": "004312"
      },
      {
        "frets": "xx6798",
        "fingers": "001243"
      },
      {
        "frets": "xbadda",
        "fingers": "021441",
        "barres": [
          10,
          13
        ],
        "capo": true
      },
      {
        "frets": "xbcddx",
        "fingers": "012340"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "aug",
    "positions": [
      {
        "frets": "43211x",
        "fingers": "432110",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "4x655x",
        "fingers": "104230"
      },
      {
        "frets": "xx655x",
        "fingers": "002110",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xba99x",
        "fingers": "032110",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "aug7",
    "positions": [
      {
        "frets": "4x4550",
        "fingers": "102340"
      },
      {
        "frets": "xx6978",
        "fingers": "001423"
      },
      {
        "frets": "xbab90",
        "fingers": "032410"
      },
      {
        "frets": "xbebdc",
        "fingers": "014132",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "aug9",
    "positions": [
      {
        "frets": "212112",
        "fingers": "213114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "434350",
        "fingers": "213140",
        "barres": 3
      },
      {
        "frets": "xx4556",
        "fingers": "001234"
      },
      {
        "frets": "xbabb0",
        "fingers": "021340"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "dim",
    "positions": [
      {
        "frets": "42x43x",
        "fingers": "310420"
      },
      {
        "frets": "xx67x7",
        "fingers": "001203"
      },
      {
        "frets": "xb9x9a",
        "fingers": "041023"
      },
      {
        "frets": "xbcdcx",
        "fingers": "012430"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "dim7",
    "positions": [
      {
        "frets": "xx0101",
        "fingers": "000102"
      },
      {
        "frets": "4x3434",
        "fingers": "201314",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx6767",
        "fingers": "001324"
      },
      {
        "frets": "abcaca",
        "fingers": "123141",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m11",
    "positions": [
      {
        "frets": "424322",
        "fingers": "314211",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "444446",
        "fingers": "111114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx6677",
        "fingers": "001123",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xb9bb9",
        "fingers": "031341",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m6",
    "positions": [
      {
        "frets": "4x344x",
        "fingers": "201340"
      },
      {
        "frets": "466464",
        "fingers": "123141",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x66867",
        "fingers": "011312",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xb9a9b",
        "fingers": "031214",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m69",
    "positions": [
      {
        "frets": "4x3446",
        "fingers": "201334",
        "barres": 4
      },
      {
        "frets": "466466",
        "fingers": "122134",
        "barres": [
          4,
          6
        ],
        "capo": true
      },
      {
        "frets": "766866",
        "fingers": "211311",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xb9abb",
        "fingers": "031244",
        "barres": 11
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m7",
    "positions": [
      {
        "frets": "4x444x",
        "fingers": "203330"
      },
      {
        "frets": "464444",
        "fingers": "131111",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x66877",
        "fingers": "011423",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xb9b9x",
        "fingers": "021310",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "bbdbcb",
        "fingers": "113121",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m7b5",
    "positions": [
      {
        "frets": "xx0102",
        "fingers": "000103"
      },
      {
        "frets": "4x443x",
        "fingers": "203410"
      },
      {
        "frets": "xx6777",
        "fingers": "001222",
        "barres": 7
      },
      {
        "frets": "xbcbcx",
        "fingers": "013240"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m9",
    "positions": [
      {
        "frets": "411102",
        "fingers": "411203",
        "barres": 1
      },
      {
        "frets": "464446",
        "fingers": "131114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "798897",
        "fingers": "132241",
        "barres": 8
      },
      {
        "frets": "xb9bbb",
        "fingers": "021344",
        "barres": 11
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m9_B",
    "positions": [
      {
        "frets": "766876",
        "fingers": "211431",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "7x6876",
        "fingers": "201431",
        "barres": 6,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m9_F#",
    "positions": [
      {
        "frets": "x96876",
        "fingers": "041321",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "ebdbbb",
        "fingers": "413111",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "ebddbb",
        "fingers": "412311",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "ebdbbx",
        "fingers": "413110",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "madd9",
    "positions": [
      {
        "frets": "42x34x",
        "fingers": "310240"
      },
      {
        "frets": "xx6446",
        "fingers": "003114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "466446",
        "fingers": "123114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xb98bx",
        "fingers": "032140"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "maj11",
    "positions": [
      {
        "frets": "43102x",
        "fingers": "431020"
      },
      {
        "frets": "445544",
        "fingers": "112311",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx6688",
        "fingers": "001134",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bbbcdb",
        "fingers": "111231",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "maj13",
    "positions": [
      {
        "frets": "433343",
        "fingers": "211131",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "445564",
        "fingers": "112341",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xbaa88",
        "fingers": "042311",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xbbcdd",
        "fingers": "011234",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "maj7#5",
    "positions": [
      {
        "frets": "432010",
        "fingers": "432010"
      },
      {
        "frets": "435050",
        "fingers": "213040"
      },
      {
        "frets": "8ba988",
        "fingers": "143211",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xbecdx",
        "fingers": "014230"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "maj7",
    "positions": [
      {
        "frets": "465544",
        "fingers": "142311",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x66888",
        "fingers": "011333",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xbac9x",
        "fingers": "032410"
      },
      {
        "frets": "bbdcdb",
        "fingers": "113241",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "maj7b5",
    "positions": [
      {
        "frets": "435533",
        "fingers": "213411",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "4555xx",
        "fingers": "123400"
      },
      {
        "frets": "006788",
        "fingers": "001234",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xbccdx",
        "fingers": "012240",
        "barres": 12
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "maj7sus2",
    "positions": [
      {
        "frets": "xx6343",
        "fingers": "004121",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx6886",
        "fingers": "001341",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xbdcbb",
        "fingers": "013211",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "xb888x",
        "fingers": "041110",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "maj9",
    "positions": [
      {
        "frets": "x11113",
        "fingers": "011114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "435343",
        "fingers": "214131",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "465546",
        "fingers": "132214",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "bbacbx",
        "fingers": "221430",
        "barres": 11
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "major",
    "positions": [
      {
        "frets": "43111x",
        "fingers": "321110",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "466544",
        "fingers": "134211",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x66898",
        "fingers": "011243",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "8ba898",
        "fingers": "143121",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "minor",
    "positions": [
      {
        "frets": "466444",
        "fingers": "134111",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx6897",
        "fingers": "001342"
      },
      {
        "frets": "xx9897",
        "fingers": "003241"
      },
      {
        "frets": "bbddcb",
        "fingers": "113421",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "mmaj11",
    "positions": [
      {
        "frets": "445446",
        "fingers": "112114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x66687",
        "fingers": "011132",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xb9cb9",
        "fingers": "021431",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "bbbccb",
        "fingers": "111231",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "mmaj7",
    "positions": [
      {
        "frets": "x21143",
        "fingers": "021143",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "465444",
        "fingers": "132111",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x66887",
        "fingers": "011342",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xbdccb",
        "fingers": "014231",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "mmaj7b5",
    "positions": [
      {
        "frets": "4554x4",
        "fingers": "123101",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx6787",
        "fingers": "001243"
      },
      {
        "frets": "abcccx",
        "fingers": "123330",
        "barres": 12
      },
      {
        "frets": "xbcccx",
        "fingers": "012340"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "mmaj9",
    "positions": [
      {
        "frets": "4x5304",
        "fingers": "204103"
      },
      {
        "frets": "465446",
        "fingers": "132114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "666887",
        "fingers": "111342",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xb9cbx",
        "fingers": "021430"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m_A",
    "positions": [
      {
        "frets": "x01104",
        "fingers": "001204"
      },
      {
        "frets": "x01444",
        "fingers": "001444",
        "barres": 4
      },
      {
        "frets": "x06444",
        "fingers": "003111",
        "barres": 4
      },
      {
        "frets": "x06447",
        "fingers": "003114",
        "barres": 4
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m_B",
    "positions": [
      {
        "frets": "x21144",
        "fingers": "021144",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x21444",
        "fingers": "021444",
        "barres": 4
      },
      {
        "frets": "766444",
        "fingers": "423111",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx9897",
        "fingers": "003241"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m_Bb",
    "positions": [
      {
        "frets": "x11444",
        "fingers": "011444",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "666444",
        "fingers": "234111",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "666897",
        "fingers": "111342",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx8897",
        "fingers": "002341"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m_C#",
    "positions": [
      {
        "frets": "x46444",
        "fingers": "013111",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x46447",
        "fingers": "013114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xxbdcb",
        "fingers": "001321",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "x4110x",
        "fingers": "041200"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m_C",
    "positions": [
      {
        "frets": "x31444",
        "fingers": "031444",
        "barres": 4
      },
      {
        "frets": "xxa897",
        "fingers": "004231"
      },
      {
        "frets": "xxadcb",
        "fingers": "001432"
      },
      {
        "frets": "x3110x",
        "fingers": "041200"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m_D",
    "positions": [
      {
        "frets": "xx0444",
        "fingers": "000111",
        "barres": 4
      },
      {
        "frets": "x56444",
        "fingers": "023111",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x56447",
        "fingers": "023114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx0897",
        "fingers": "000231"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m_E",
    "positions": [
      {
        "frets": "021144",
        "fingers": "021144",
        "barres": 1
      },
      {
        "frets": "021444",
        "fingers": "021444",
        "barres": 4
      },
      {
        "frets": "xx2444",
        "fingers": "001333",
        "barres": 4
      },
      {
        "frets": "066444",
        "fingers": "034111",
        "barres": 4
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m_Eb",
    "positions": [
      {
        "frets": "xx1104",
        "fingers": "001204"
      },
      {
        "frets": "xx1444",
        "fingers": "001444",
        "barres": 4
      },
      {
        "frets": "x66444",
        "fingers": "034111",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x66447",
        "fingers": "023114",
        "barres": 4,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m_F#",
    "positions": [
      {
        "frets": "xx4444",
        "fingers": "001111",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "22110x",
        "fingers": "341200"
      },
      {
        "frets": "x9989x",
        "fingers": "023140"
      },
      {
        "frets": "2211xx",
        "fingers": "231100",
        "barres": 1,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m_F",
    "positions": [
      {
        "frets": "121144",
        "fingers": "121144",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "121444",
        "fingers": "121444",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3444",
        "fingers": "001222",
        "barres": 4
      },
      {
        "frets": "12110x",
        "fingers": "142300"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "m_G",
    "positions": [
      {
        "frets": "321144",
        "fingers": "321144",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "321444",
        "fingers": "321444",
        "barres": 4
      },
      {
        "frets": "xx5444",
        "fingers": "002111",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "32110x",
        "fingers": "431200"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "sus",
    "positions": [
      {
        "frets": "446644",
        "fingers": "113411",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "466644",
        "fingers": "123411",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx6644",
        "fingers": "003411",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx6899",
        "fingers": "001344",
        "barres": 9
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "sus2",
    "positions": [
      {
        "frets": "4xx344",
        "fingers": "200134"
      },
      {
        "frets": "466x46",
        "fingers": "123014",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "666896",
        "fingers": "111341",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bbddbb",
        "fingers": "113411",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "sus4",
    "positions": [
      {
        "frets": "xx1124",
        "fingers": "001124",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "466644",
        "fingers": "123411",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x66899",
        "fingers": "011234",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bbddeb",
        "fingers": "112341",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "_A",
    "positions": [
      {
        "frets": "x01114",
        "fingers": "001114",
        "barres": 1
      },
      {
        "frets": "x06544",
        "fingers": "003211",
        "barres": 4
      },
      {
        "frets": "xx7544",
        "fingers": "004211",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x06898",
        "fingers": "001243"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "_B",
    "positions": [
      {
        "frets": "x21114",
        "fingers": "021114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx9898",
        "fingers": "002131",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "x2111x",
        "fingers": "021110",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "7665xx",
        "fingers": "423100"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "_Bb",
    "positions": [
      {
        "frets": "x11114",
        "fingers": "011114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "666898",
        "fingers": "111243",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx8898",
        "fingers": "001121",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "x1111x",
        "fingers": "011110",
        "barres": 1,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "_C#",
    "positions": [
      {
        "frets": "x46544",
        "fingers": "013211",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xxb898",
        "fingers": "004121",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxbddb",
        "fingers": "001341",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "x4111x",
        "fingers": "041110",
        "barres": 1,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "_C",
    "positions": [
      {
        "frets": "x31114",
        "fingers": "031114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x31144",
        "fingers": "031144",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "8ba898",
        "fingers": "143121",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "8xx898",
        "fingers": "111121",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "_D",
    "positions": [
      {
        "frets": "xx0544",
        "fingers": "000211",
        "barres": 4
      },
      {
        "frets": "x56544",
        "fingers": "024311",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx0898",
        "fingers": "000121",
        "barres": 8
      },
      {
        "frets": "xx0ddb",
        "fingers": "000341"
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "_E",
    "positions": [
      {
        "frets": "031114",
        "fingers": "031114",
        "barres": 1
      },
      {
        "frets": "031144",
        "fingers": "031144",
        "barres": 1
      },
      {
        "frets": "xx2544",
        "fingers": "001423"
      },
      {
        "frets": "066544",
        "fingers": "034211",
        "barres": 4
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "_Eb",
    "positions": [
      {
        "frets": "xx1114",
        "fingers": "001114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x66544",
        "fingers": "034211",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x66898",
        "fingers": "011243",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bbdddb",
        "fingers": "112341",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "_F#",
    "positions": [
      {
        "frets": "231114",
        "fingers": "231114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "231144",
        "fingers": "231144",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx4544",
        "fingers": "001211",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x9a898",
        "fingers": "024131",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "_F",
    "positions": [
      {
        "frets": "131114",
        "fingers": "131114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "131144",
        "fingers": "131144",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3544",
        "fingers": "001423"
      },
      {
        "frets": "x8a898",
        "fingers": "013121",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "Ab",
    "suffix": "_G",
    "positions": [
      {
        "frets": "331114",
        "fingers": "231114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "331144",
        "fingers": "231144",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx5544",
        "fingers": "002311",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xaa898",
        "fingers": "034121",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "11",
    "positions": [
      {
        "frets": "x21200",
        "fingers": "021300"
      },
      {
        "frets": "222242",
        "fingers": "111131",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "777877",
        "fingers": "111211",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "9999ab",
        "fingers": "111123",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "13",
    "positions": [
      {
        "frets": "x21244",
        "fingers": "021344",
        "barres": 4
      },
      {
        "frets": "222244",
        "fingers": "111134",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "746445",
        "fingers": "413112",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "777899",
        "fingers": "111234",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "5",
    "positions": [
      {
        "frets": "79xxxx",
        "fingers": "130000"
      },
      {
        "frets": "x24xxx",
        "fingers": "013000"
      },
      {
        "frets": "799xxx",
        "fingers": "134000"
      }
    ]
  },
  {
    "key": "B",
    "suffix": "6",
    "positions": [
      {
        "frets": "x2110x",
        "fingers": "031200"
      },
      {
        "frets": "x24444",
        "fingers": "013333",
        "barres": 4
      },
      {
        "frets": "7x989x",
        "fingers": "103240"
      },
      {
        "frets": "xx9b9b",
        "fingers": "001314",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "69",
    "positions": [
      {
        "frets": "x21122",
        "fingers": "021134",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "766677",
        "fingers": "211134",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x99899",
        "fingers": "022134",
        "barres": 9
      },
      {
        "frets": "xebdcb",
        "fingers": "041321",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "7#9",
    "positions": [
      {
        "frets": "x2123x",
        "fingers": "021340"
      },
      {
        "frets": "760705",
        "fingers": "320401"
      },
      {
        "frets": "7978aa",
        "fingers": "131244",
        "barres": [
          7,
          10
        ],
        "capo": true
      },
      {
        "frets": "xx98aa",
        "fingers": "002134"
      }
    ]
  },
  {
    "key": "B",
    "suffix": "7",
    "positions": [
      {
        "frets": "x21202",
        "fingers": "021304"
      },
      {
        "frets": "224242",
        "fingers": "113141",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4445",
        "fingers": "001112",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "797877",
        "fingers": "131211",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "7b5",
    "positions": [
      {
        "frets": "x21201",
        "fingers": "031402"
      },
      {
        "frets": "x2324x",
        "fingers": "012130"
      },
      {
        "frets": "7x786x",
        "fingers": "203410"
      },
      {
        "frets": "xx9aab",
        "fingers": "001234"
      }
    ]
  },
  {
    "key": "B",
    "suffix": "7b9",
    "positions": [
      {
        "frets": "x21212",
        "fingers": "021314",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "7675xx",
        "fingers": "324100"
      },
      {
        "frets": "7x7878",
        "fingers": "101213",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xx98a8",
        "fingers": "002131",
        "barres": 8
      }
    ]
  },
  {
    "key": "B",
    "suffix": "7sus4",
    "positions": [
      {
        "frets": "x22200",
        "fingers": "012300"
      },
      {
        "frets": "224252",
        "fingers": "113141",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4455",
        "fingers": "001122",
        "barres": [
          4,
          5
        ],
        "capo": true
      },
      {
        "frets": "797977",
        "fingers": "131411",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "9#11",
    "positions": [
      {
        "frets": "x21221",
        "fingers": "021341",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x23242",
        "fingers": "012131",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "7x786x",
        "fingers": "203410"
      },
      {
        "frets": "xx9aab",
        "fingers": "001234"
      }
    ]
  },
  {
    "key": "B",
    "suffix": "9",
    "positions": [
      {
        "frets": "x21222",
        "fingers": "021334",
        "barres": 2
      },
      {
        "frets": "744645",
        "fingers": "411312",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "797879",
        "fingers": "131214",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xx98a9",
        "fingers": "002143"
      }
    ]
  },
  {
    "key": "B",
    "suffix": "9b5",
    "positions": [
      {
        "frets": "x21221",
        "fingers": "021341",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "767667",
        "fingers": "213114",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "7878x9",
        "fingers": "121304",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xedeed",
        "fingers": "021341",
        "barres": 13,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "add11",
    "positions": [
      {
        "frets": "x21400",
        "fingers": "021400"
      },
      {
        "frets": "xedbcc",
        "fingers": "043122",
        "barres": 12
      },
      {
        "frets": "76445x",
        "fingers": "431120",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "7699xx",
        "fingers": "214400",
        "barres": 9
      }
    ]
  },
  {
    "key": "B",
    "suffix": "add9",
    "positions": [
      {
        "frets": "x21x22",
        "fingers": "021034"
      },
      {
        "frets": "76x677",
        "fingers": "310244",
        "barres": 7
      },
      {
        "frets": "xx9879",
        "fingers": "003214"
      },
      {
        "frets": "xedbeb",
        "fingers": "032141",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "alt",
    "positions": [
      {
        "frets": "x2344x",
        "fingers": "012340"
      },
      {
        "frets": "xx9867",
        "fingers": "004312"
      },
      {
        "frets": "78980x",
        "fingers": "124300"
      },
      {
        "frets": "xx9a0b",
        "fingers": "001203"
      }
    ]
  },
  {
    "key": "B",
    "suffix": "aug",
    "positions": [
      {
        "frets": "x2100x",
        "fingers": "021000"
      },
      {
        "frets": "xx5443",
        "fingers": "004231"
      },
      {
        "frets": "7x988x",
        "fingers": "104230"
      },
      {
        "frets": "xedcc0",
        "fingers": "032110",
        "barres": 12,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "aug7",
    "positions": [
      {
        "frets": "x21203",
        "fingers": "021304"
      },
      {
        "frets": "x25243",
        "fingers": "002113",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "7x788x",
        "fingers": "102340"
      },
      {
        "frets": "xx9cab",
        "fingers": "001423"
      }
    ]
  },
  {
    "key": "B",
    "suffix": "aug9",
    "positions": [
      {
        "frets": "x21223",
        "fingers": "021334",
        "barres": 2
      },
      {
        "frets": "545445",
        "fingers": "213114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "76768x",
        "fingers": "213140",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bcbccb",
        "fingers": "121341",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "dim",
    "positions": [
      {
        "frets": "x20x01",
        "fingers": "030002"
      },
      {
        "frets": "x2343x",
        "fingers": "012430"
      },
      {
        "frets": "75x76x",
        "fingers": "310420"
      },
      {
        "frets": "xx9axa",
        "fingers": "001203"
      }
    ]
  },
  {
    "key": "B",
    "suffix": "dim7",
    "positions": [
      {
        "frets": "x23131",
        "fingers": "023141",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3434",
        "fingers": "001324"
      },
      {
        "frets": "7x676x",
        "fingers": "301420"
      },
      {
        "frets": "789797",
        "fingers": "123141",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m11",
    "positions": [
      {
        "frets": "x20220",
        "fingers": "010230"
      },
      {
        "frets": "757655",
        "fingers": "314211",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "777779",
        "fingers": "111114",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xx99aa",
        "fingers": "001123",
        "barres": [
          9,
          10
        ],
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m6",
    "positions": [
      {
        "frets": "220102",
        "fingers": "230104"
      },
      {
        "frets": "xx4434",
        "fingers": "002314"
      },
      {
        "frets": "7x677x",
        "fingers": "201340"
      },
      {
        "frets": "799797",
        "fingers": "123141",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m69",
    "positions": [
      {
        "frets": "x20122",
        "fingers": "020134"
      },
      {
        "frets": "x56677",
        "fingers": "012233",
        "barres": [
          6,
          7
        ]
      },
      {
        "frets": "799799",
        "fingers": "122134",
        "barres": [
          7,
          9
        ],
        "capo": true
      },
      {
        "frets": "ax9b99",
        "fingers": "201311",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m7",
    "positions": [
      {
        "frets": "7x777x",
        "fingers": "203330"
      },
      {
        "frets": "224232",
        "fingers": "113121",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4435",
        "fingers": "002314"
      },
      {
        "frets": "797777",
        "fingers": "131111",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "x99baa",
        "fingers": "011423",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m7b5",
    "positions": [
      {
        "frets": "x2323x",
        "fingers": "013240"
      },
      {
        "frets": "7x776x",
        "fingers": "203410"
      },
      {
        "frets": "7897a7",
        "fingers": "123141",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xx9aaa",
        "fingers": "001222",
        "barres": 10
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m9",
    "positions": [
      {
        "frets": "x20222",
        "fingers": "010234"
      },
      {
        "frets": "x44435",
        "fingers": "023314",
        "barres": 4
      },
      {
        "frets": "797779",
        "fingers": "131114",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "acbbca",
        "fingers": "132241",
        "barres": [
          10,
          11
        ],
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m9_A",
    "positions": [
      {
        "frets": "524222",
        "fingers": "413111",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "524422",
        "fingers": "412311",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xc9ba9",
        "fingers": "041321",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "52422x",
        "fingers": "413110",
        "barres": 2,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m9_D",
    "positions": [
      {
        "frets": "a99ba9",
        "fingers": "211431",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "ax9ba9",
        "fingers": "201431",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "madd9",
    "positions": [
      {
        "frets": "x5442x",
        "fingers": "042310"
      },
      {
        "frets": "75067x",
        "fingers": "310240"
      },
      {
        "frets": "xx9779",
        "fingers": "003114",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xecbex",
        "fingers": "032140"
      }
    ]
  },
  {
    "key": "B",
    "suffix": "maj11",
    "positions": [
      {
        "frets": "x21300",
        "fingers": "021300"
      },
      {
        "frets": "222342",
        "fingers": "111231",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "778879",
        "fingers": "112213",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xx99bb",
        "fingers": "001134",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "maj13",
    "positions": [
      {
        "frets": "x22344",
        "fingers": "011234",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "766676",
        "fingers": "211131",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "778897",
        "fingers": "112341",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xeddbb",
        "fingers": "042311",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "maj7#5",
    "positions": [
      {
        "frets": "x21303",
        "fingers": "021304"
      },
      {
        "frets": "x2534x",
        "fingers": "014230"
      },
      {
        "frets": "76808x",
        "fingers": "213030"
      },
      {
        "frets": "bedcbb",
        "fingers": "143211",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "maj7",
    "positions": [
      {
        "frets": "224342",
        "fingers": "113241",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4446",
        "fingers": "001114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "798877",
        "fingers": "142311",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "x99bbb",
        "fingers": "011333",
        "barres": [
          9,
          11
        ],
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "maj7b5",
    "positions": [
      {
        "frets": "x2334x",
        "fingers": "012340"
      },
      {
        "frets": "768866",
        "fingers": "213411",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "78880x",
        "fingers": "123400"
      },
      {
        "frets": "xx9abb",
        "fingers": "001234"
      }
    ]
  },
  {
    "key": "B",
    "suffix": "maj7sus2",
    "positions": [
      {
        "frets": "x24322",
        "fingers": "013211",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx9676",
        "fingers": "004121",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx9bb9",
        "fingers": "001341",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "x2432x",
        "fingers": "013210",
        "barres": 2,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "maj9",
    "positions": [
      {
        "frets": "22132x",
        "fingers": "221430",
        "barres": 2
      },
      {
        "frets": "xx4646",
        "fingers": "001314",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "76867x",
        "fingers": "214130",
        "barres": 6
      },
      {
        "frets": "xx98b9",
        "fingers": "002143"
      }
    ]
  },
  {
    "key": "B",
    "suffix": "major",
    "positions": [
      {
        "frets": "224442",
        "fingers": "112341",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4447",
        "fingers": "001114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "799877",
        "fingers": "134211",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "x99bcb",
        "fingers": "011243",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "minor",
    "positions": [
      {
        "frets": "224432",
        "fingers": "113421",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "799777",
        "fingers": "134111",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xx9bca",
        "fingers": "001342"
      },
      {
        "frets": "xxcbca",
        "fingers": "003241"
      }
    ]
  },
  {
    "key": "B",
    "suffix": "mmaj11",
    "positions": [
      {
        "frets": "x20320",
        "fingers": "010320"
      },
      {
        "frets": "222332",
        "fingers": "111231",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "778779",
        "fingers": "112114",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "x999ba",
        "fingers": "011132",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "mmaj7",
    "positions": [
      {
        "frets": "x20302",
        "fingers": "010302"
      },
      {
        "frets": "224332",
        "fingers": "114231",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "798777",
        "fingers": "132111",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "x99bba",
        "fingers": "011342",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "mmaj7b5",
    "positions": [
      {
        "frets": "x2333x",
        "fingers": "012340"
      },
      {
        "frets": "78x766",
        "fingers": "240311",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "7887x7",
        "fingers": "123101",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xx9aba",
        "fingers": "001243"
      }
    ]
  },
  {
    "key": "B",
    "suffix": "mmaj9",
    "positions": [
      {
        "frets": "x20322",
        "fingers": "010423"
      },
      {
        "frets": "75860x",
        "fingers": "314200"
      },
      {
        "frets": "798779",
        "fingers": "132114",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xecfex",
        "fingers": "031430"
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m_A",
    "positions": [
      {
        "frets": "x04432",
        "fingers": "003421"
      },
      {
        "frets": "x00402",
        "fingers": "000301"
      },
      {
        "frets": "x00432",
        "fingers": "000321"
      },
      {
        "frets": "x04777",
        "fingers": "001444",
        "barres": 7
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m_Ab",
    "positions": [
      {
        "frets": "4x443x",
        "fingers": "203410"
      },
      {
        "frets": "454477",
        "fingers": "121144",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "454777",
        "fingers": "121444",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx6777",
        "fingers": "001222",
        "barres": 7
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m_Bb",
    "positions": [
      {
        "frets": "x10402",
        "fingers": "010402"
      },
      {
        "frets": "654477",
        "fingers": "321144",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "654777",
        "fingers": "321444",
        "barres": 7
      },
      {
        "frets": "xx8777",
        "fingers": "002111",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m_C#",
    "positions": [
      {
        "frets": "x40402",
        "fingers": "030401"
      },
      {
        "frets": "x40432",
        "fingers": "030421"
      },
      {
        "frets": "x44777",
        "fingers": "011444",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "999777",
        "fingers": "234111",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m_C",
    "positions": [
      {
        "frets": "x30402",
        "fingers": "020301"
      },
      {
        "frets": "x30432",
        "fingers": "020431"
      },
      {
        "frets": "899777",
        "fingers": "234111",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xxa777",
        "fingers": "004111",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m_D",
    "positions": [
      {
        "frets": "xx0402",
        "fingers": "000301"
      },
      {
        "frets": "xx0432",
        "fingers": "000321"
      },
      {
        "frets": "xx0477",
        "fingers": "000144",
        "barres": 7
      },
      {
        "frets": "x54477",
        "fingers": "021144",
        "barres": 4,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m_E",
    "positions": [
      {
        "frets": "020402",
        "fingers": "010402"
      },
      {
        "frets": "024432",
        "fingers": "013421",
        "barres": 2
      },
      {
        "frets": "xx2432",
        "fingers": "001321",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "054477",
        "fingers": "021144",
        "barres": 4
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m_Eb",
    "positions": [
      {
        "frets": "xx1432",
        "fingers": "001432"
      },
      {
        "frets": "x64777",
        "fingers": "031444",
        "barres": 7
      },
      {
        "frets": "xxdbca",
        "fingers": "004231"
      },
      {
        "frets": "becbxx",
        "fingers": "142100",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m_F#",
    "positions": [
      {
        "frets": "224432",
        "fingers": "113421",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4432",
        "fingers": "003421"
      },
      {
        "frets": "xx4777",
        "fingers": "001444",
        "barres": 7
      },
      {
        "frets": "x99777",
        "fingers": "034111",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m_F",
    "positions": [
      {
        "frets": "xx3432",
        "fingers": "002431"
      },
      {
        "frets": "x89777",
        "fingers": "023111",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "x8977a",
        "fingers": "023114",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "x8977x",
        "fingers": "023110",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "m_G",
    "positions": [
      {
        "frets": "xx5432",
        "fingers": "004321"
      },
      {
        "frets": "xx5777",
        "fingers": "001333",
        "barres": 7
      },
      {
        "frets": "xa9777",
        "fingers": "043111",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xacbca",
        "fingers": "013241",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "sus",
    "positions": [
      {
        "frets": "x24400",
        "fingers": "013400"
      },
      {
        "frets": "x22452",
        "fingers": "011341",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x24452",
        "fingers": "012341",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "779977",
        "fingers": "113411",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "sus2",
    "positions": [
      {
        "frets": "224422",
        "fingers": "113411",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "7xx677",
        "fingers": "200134"
      },
      {
        "frets": "999bc9",
        "fingers": "111341",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xebbce",
        "fingers": "031124",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "sus2sus4",
    "positions": [
      {
        "frets": "x22422",
        "fingers": "011311",
        "barres": [
          2
        ],
        "capo": true
      },
      {
        "frets": "779979",
        "fingers": "112314",
        "barres": [
          7
        ],
        "capo": true
      },
      {
        "frets": "7746xx",
        "fingers": "341200"
      }
    ]
  },
  {
    "key": "B",
    "suffix": "sus4",
    "positions": [
      {
        "frets": "224452",
        "fingers": "112341",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4457",
        "fingers": "001124",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "799977",
        "fingers": "123411",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "x99bcc",
        "fingers": "011344",
        "barres": [
          9,
          12
        ],
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "_A",
    "positions": [
      {
        "frets": "x01402",
        "fingers": "001402"
      },
      {
        "frets": "x04442",
        "fingers": "002341"
      },
      {
        "frets": "x04447",
        "fingers": "001114",
        "barres": 4
      },
      {
        "frets": "564447",
        "fingers": "231114",
        "barres": 4,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "_Ab",
    "positions": [
      {
        "frets": "464447",
        "fingers": "131114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "464477",
        "fingers": "131144",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx6877",
        "fingers": "001423"
      },
      {
        "frets": "xbdbcb",
        "fingers": "013121",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "_Bb",
    "positions": [
      {
        "frets": "664447",
        "fingers": "231114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "664477",
        "fingers": "231144",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx8877",
        "fingers": "002311",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xddbcb",
        "fingers": "034121",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "_C#",
    "positions": [
      {
        "frets": "x44447",
        "fingers": "011114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "999bcb",
        "fingers": "111243",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xxbbcb",
        "fingers": "001121",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "x4444x",
        "fingers": "011110",
        "barres": 4,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "_C",
    "positions": [
      {
        "frets": "x31402",
        "fingers": "031402"
      },
      {
        "frets": "xxa877",
        "fingers": "004211",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xxabcb",
        "fingers": "001243"
      },
      {
        "frets": "x3444x",
        "fingers": "012220",
        "barres": 4
      }
    ]
  },
  {
    "key": "B",
    "suffix": "_D",
    "positions": [
      {
        "frets": "xx0442",
        "fingers": "000341"
      },
      {
        "frets": "x54447",
        "fingers": "021114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx0877",
        "fingers": "000211",
        "barres": 7
      },
      {
        "frets": "xx0bcb",
        "fingers": "000121",
        "barres": 11
      }
    ]
  },
  {
    "key": "B",
    "suffix": "_E",
    "positions": [
      {
        "frets": "024442",
        "fingers": "012341",
        "barres": 2
      },
      {
        "frets": "xx2442",
        "fingers": "001341",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "064447",
        "fingers": "031114",
        "barres": 4
      },
      {
        "frets": "064477",
        "fingers": "031144",
        "barres": 4
      }
    ]
  },
  {
    "key": "B",
    "suffix": "_Eb",
    "positions": [
      {
        "frets": "xx1402",
        "fingers": "001402"
      },
      {
        "frets": "x64447",
        "fingers": "031114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x64477",
        "fingers": "031144",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "bedbcb",
        "fingers": "143121",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "_F#",
    "positions": [
      {
        "frets": "224442",
        "fingers": "112341",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4442",
        "fingers": "002341"
      },
      {
        "frets": "xx4447",
        "fingers": "001114",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x99877",
        "fingers": "034211",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "B",
    "suffix": "_F",
    "positions": [
      {
        "frets": "xx3442",
        "fingers": "002341"
      },
      {
        "frets": "x89877",
        "fingers": "024311",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "12444x",
        "fingers": "124440",
        "barres": 4
      },
      {
        "frets": "x8987x",
        "fingers": "024310"
      }
    ]
  },
  {
    "key": "B",
    "suffix": "_G",
    "positions": [
      {
        "frets": "xx5442",
        "fingers": "004231"
      },
      {
        "frets": "xx5877",
        "fingers": "001423"
      },
      {
        "frets": "xa9877",
        "fingers": "043211",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "32444x",
        "fingers": "213330",
        "barres": 4
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "11",
    "positions": [
      {
        "frets": "x11131",
        "fingers": "011131",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "650544",
        "fingers": "420311",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "88889a",
        "fingers": "111123",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xdcdbb",
        "fingers": "032411",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "13",
    "positions": [
      {
        "frets": "x10133",
        "fingers": "010244",
        "barres": 3
      },
      {
        "frets": "650044",
        "fingers": "320011",
        "barres": 4
      },
      {
        "frets": "666788",
        "fingers": "111234",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xdcdff",
        "fingers": "021344",
        "barres": 15
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "5",
    "positions": [
      {
        "frets": "68xxxx",
        "fingers": "130000"
      },
      {
        "frets": "x13xxx",
        "fingers": "013000"
      },
      {
        "frets": "688xxx",
        "fingers": "134000"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "6",
    "positions": [
      {
        "frets": "x13333",
        "fingers": "013333",
        "barres": 3
      },
      {
        "frets": "650066",
        "fingers": "210034"
      },
      {
        "frets": "68x786",
        "fingers": "130240",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xdbbax",
        "fingers": "042310"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "69",
    "positions": [
      {
        "frets": "x10011",
        "fingers": "010023"
      },
      {
        "frets": "655566",
        "fingers": "211134",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x88788",
        "fingers": "022134",
        "barres": 8
      },
      {
        "frets": "xdccdd",
        "fingers": "021134",
        "barres": 12,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "7#9",
    "positions": [
      {
        "frets": "x1012x",
        "fingers": "010230"
      },
      {
        "frets": "686799",
        "fingers": "131244",
        "barres": [
          6,
          9
        ],
        "capo": true
      },
      {
        "frets": "xx8799",
        "fingers": "002134"
      },
      {
        "frets": "xdcdex",
        "fingers": "021340"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "7",
    "positions": [
      {
        "frets": "x13131",
        "fingers": "013141",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "686766",
        "fingers": "131211",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x88a9a",
        "fingers": "011324",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xdcdbx",
        "fingers": "032410"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "7b5",
    "positions": [
      {
        "frets": "x1213x",
        "fingers": "012130",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "6x6750",
        "fingers": "203410"
      },
      {
        "frets": "xx899a",
        "fingers": "001234"
      },
      {
        "frets": "xdcdb0",
        "fingers": "032410"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "7b9",
    "positions": [
      {
        "frets": "x10101",
        "fingers": "010203"
      },
      {
        "frets": "6564xx",
        "fingers": "324100"
      },
      {
        "frets": "6x6767",
        "fingers": "101213",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xdcdcd",
        "fingers": "021314",
        "barres": 12,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "7sus4",
    "positions": [
      {
        "frets": "x13141",
        "fingers": "013141",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3344",
        "fingers": "001122",
        "barres": [
          3,
          4
        ],
        "capo": true
      },
      {
        "frets": "686866",
        "fingers": "131411",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx8a9b",
        "fingers": "001324"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "9#11",
    "positions": [
      {
        "frets": "x10110",
        "fingers": "010230"
      },
      {
        "frets": "65655x",
        "fingers": "213110",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx899a",
        "fingers": "001234"
      },
      {
        "frets": "xdcddc",
        "fingers": "021341",
        "barres": 12,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "9",
    "positions": [
      {
        "frets": "x10111",
        "fingers": "010234"
      },
      {
        "frets": "65656x",
        "fingers": "213140",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "686768",
        "fingers": "131214",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xdcddd",
        "fingers": "021333",
        "barres": 13
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "9b5",
    "positions": [
      {
        "frets": "x10110",
        "fingers": "010230"
      },
      {
        "frets": "6x0554",
        "fingers": "400231"
      },
      {
        "frets": "656556",
        "fingers": "213114",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xdcdd0",
        "fingers": "021340"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "add11",
    "positions": [
      {
        "frets": "xdcabb",
        "fingers": "043122",
        "barres": 11
      },
      {
        "frets": "x1034x",
        "fingers": "010340"
      },
      {
        "frets": "65334x",
        "fingers": "431120",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "6588xx",
        "fingers": "214400",
        "barres": 8
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "add9",
    "positions": [
      {
        "frets": "x10311",
        "fingers": "010423"
      },
      {
        "frets": "xx8768",
        "fingers": "003214"
      },
      {
        "frets": "xx87x8",
        "fingers": "002103"
      },
      {
        "frets": "xdcada",
        "fingers": "032141",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "alt",
    "positions": [
      {
        "frets": "x12330",
        "fingers": "012340"
      },
      {
        "frets": "670750",
        "fingers": "230410"
      },
      {
        "frets": "6707x6",
        "fingers": "130402"
      },
      {
        "frets": "xx89ba",
        "fingers": "001243"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "aug",
    "positions": [
      {
        "frets": "x1433x",
        "fingers": "014230"
      },
      {
        "frets": "65433x",
        "fingers": "432110",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx8776",
        "fingers": "004231"
      },
      {
        "frets": "xx877x",
        "fingers": "002110",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "aug7",
    "positions": [
      {
        "frets": "x14132",
        "fingers": "014132",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "6x677x",
        "fingers": "102340"
      },
      {
        "frets": "xx8b9a",
        "fingers": "001423"
      },
      {
        "frets": "xdcdxe",
        "fingers": "021304"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "aug9",
    "positions": [
      {
        "frets": "x10112",
        "fingers": "010234"
      },
      {
        "frets": "434334",
        "fingers": "213114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "65657x",
        "fingers": "213140",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "6x6778",
        "fingers": "101234",
        "barres": 6,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "dim",
    "positions": [
      {
        "frets": "x1232x",
        "fingers": "012430"
      },
      {
        "frets": "64x65x",
        "fingers": "310420"
      },
      {
        "frets": "xx89x9",
        "fingers": "001203"
      },
      {
        "frets": "xdbxbc",
        "fingers": "041023"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "dim7",
    "positions": [
      {
        "frets": "x12020",
        "fingers": "012030"
      },
      {
        "frets": "xx2323",
        "fingers": "001324"
      },
      {
        "frets": "678686",
        "fingers": "123141",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx8989",
        "fingers": "001324"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m11",
    "positions": [
      {
        "frets": "646544",
        "fingers": "314211",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "666668",
        "fingers": "111114",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx8899",
        "fingers": "001123",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xdbddb",
        "fingers": "021341",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m6",
    "positions": [
      {
        "frets": "x13x23",
        "fingers": "013024"
      },
      {
        "frets": "x4536x",
        "fingers": "023140"
      },
      {
        "frets": "6x5666",
        "fingers": "201334",
        "barres": 6
      },
      {
        "frets": "688686",
        "fingers": "123141",
        "barres": 6,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m69",
    "positions": [
      {
        "frets": "6x5668",
        "fingers": "201334",
        "barres": 6
      },
      {
        "frets": "6x8688",
        "fingers": "102134",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "9x8a88",
        "fingers": "201411",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xdbcdx",
        "fingers": "031240"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m7",
    "positions": [
      {
        "frets": "5x555x",
        "fingers": "203330"
      },
      {
        "frets": "x13121",
        "fingers": "013121",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3324",
        "fingers": "002314"
      },
      {
        "frets": "686666",
        "fingers": "131111",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x88a99",
        "fingers": "011423",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m7b5",
    "positions": [
      {
        "frets": "x1212x",
        "fingers": "013240"
      },
      {
        "frets": "xx2324",
        "fingers": "001214",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "6x665x",
        "fingers": "203410"
      },
      {
        "frets": "xx8999",
        "fingers": "001222",
        "barres": 9
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m9",
    "positions": [
      {
        "frets": "xx3524",
        "fingers": "002413"
      },
      {
        "frets": "64x564",
        "fingers": "310241",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "686668",
        "fingers": "131114",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xdbddx",
        "fingers": "021340"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m9_Ab",
    "positions": [
      {
        "frets": "413111",
        "fingers": "413111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "413311",
        "fingers": "412311",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xb8a98",
        "fingers": "041321",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "41311x",
        "fingers": "413110",
        "barres": 1,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m9_C#",
    "positions": [
      {
        "frets": "988a98",
        "fingers": "211431",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "9x8a98",
        "fingers": "201431",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "madd9",
    "positions": [
      {
        "frets": "x4331x",
        "fingers": "042310"
      },
      {
        "frets": "64x56x",
        "fingers": "310240"
      },
      {
        "frets": "xx8668",
        "fingers": "003114",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xdbadx",
        "fingers": "032140"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "maj11",
    "positions": [
      {
        "frets": "x11231",
        "fingers": "011231",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "6x0545",
        "fingers": "400213"
      },
      {
        "frets": "667766",
        "fingers": "112311",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx88aa",
        "fingers": "001134",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "maj13",
    "positions": [
      {
        "frets": "x11233",
        "fingers": "011234",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "655565",
        "fingers": "211131",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "667786",
        "fingers": "112341",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xdccaa",
        "fingers": "042311",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "maj7#5",
    "positions": [
      {
        "frets": "x10232",
        "fingers": "010243"
      },
      {
        "frets": "xx4335",
        "fingers": "002114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "6x777x",
        "fingers": "102340"
      },
      {
        "frets": "adcbaa",
        "fingers": "143211",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "maj7",
    "positions": [
      {
        "frets": "x13231",
        "fingers": "013241",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3335",
        "fingers": "001114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "687766",
        "fingers": "142311",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x88aaa",
        "fingers": "011333",
        "barres": [
          8,
          10
        ],
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "maj7b5",
    "positions": [
      {
        "frets": "x1223x",
        "fingers": "012340"
      },
      {
        "frets": "657755",
        "fingers": "213411",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "6777x0",
        "fingers": "123400"
      },
      {
        "frets": "xx89aa",
        "fingers": "001234"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "maj7sus2",
    "positions": [
      {
        "frets": "x13211",
        "fingers": "013211",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx8565",
        "fingers": "004121",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx8aa8",
        "fingers": "001341",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "x1321x",
        "fingers": "013210",
        "barres": 1,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "maj9",
    "positions": [
      {
        "frets": "11021x",
        "fingers": "110320",
        "barres": 1
      },
      {
        "frets": "633335",
        "fingers": "411113",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "65756x",
        "fingers": "214130",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "687768",
        "fingers": "132214",
        "barres": [
          6,
          7
        ],
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "major",
    "positions": [
      {
        "frets": "x13331",
        "fingers": "012341",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "65333x",
        "fingers": "431110",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "688766",
        "fingers": "134211",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x88aba",
        "fingers": "011243",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "minor",
    "positions": [
      {
        "frets": "x13321",
        "fingers": "013421",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "688666",
        "fingers": "134111",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx8666",
        "fingers": "003111",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx8ab9",
        "fingers": "001342"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "mmaj11",
    "positions": [
      {
        "frets": "x11221",
        "fingers": "011231",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "667668",
        "fingers": "112114",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x888a9",
        "fingers": "011132",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xdbedb",
        "fingers": "021431",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "mmaj7",
    "positions": [
      {
        "frets": "x13221",
        "fingers": "014231",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "687666",
        "fingers": "132111",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x88aa9",
        "fingers": "011342",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xdbaax",
        "fingers": "042110",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "mmaj7b5",
    "positions": [
      {
        "frets": "x12220",
        "fingers": "012340"
      },
      {
        "frets": "67x655",
        "fingers": "240311",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "6776x6",
        "fingers": "123101",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx89a9",
        "fingers": "001243"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "mmaj9",
    "positions": [
      {
        "frets": "64x565",
        "fingers": "310242",
        "barres": 5
      },
      {
        "frets": "6475xx",
        "fingers": "314200"
      },
      {
        "frets": "687668",
        "fingers": "132114",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "888aa9",
        "fingers": "111342",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m_A",
    "positions": [
      {
        "frets": "x03321",
        "fingers": "003421"
      },
      {
        "frets": "x03666",
        "fingers": "001444",
        "barres": 6
      },
      {
        "frets": "543366",
        "fingers": "321144",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "543666",
        "fingers": "321444",
        "barres": 6
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m_Ab",
    "positions": [
      {
        "frets": "xx6666",
        "fingers": "001111",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xbbabx",
        "fingers": "023140"
      },
      {
        "frets": "4433xx",
        "fingers": "231100",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "4x3666",
        "fingers": "201444",
        "barres": 6
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m_B",
    "positions": [
      {
        "frets": "788666",
        "fingers": "234111",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx9666",
        "fingers": "004111",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx9ab9",
        "fingers": "001231",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "x2332x",
        "fingers": "012310",
        "barres": 2,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m_C#",
    "positions": [
      {
        "frets": "x43366",
        "fingers": "021144",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x43666",
        "fingers": "021444",
        "barres": 6
      },
      {
        "frets": "988666",
        "fingers": "423111",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xxbab9",
        "fingers": "003241"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m_C",
    "positions": [
      {
        "frets": "x33666",
        "fingers": "011444",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "888666",
        "fingers": "234111",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "888ab9",
        "fingers": "111342",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxaab9",
        "fingers": "002341"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m_D",
    "positions": [
      {
        "frets": "xx0321",
        "fingers": "000321"
      },
      {
        "frets": "x53666",
        "fingers": "031444",
        "barres": 6
      },
      {
        "frets": "xx0666",
        "fingers": "000111",
        "barres": 6
      },
      {
        "frets": "xx0ab9",
        "fingers": "000231"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m_E",
    "positions": [
      {
        "frets": "013321",
        "fingers": "013421",
        "barres": 1
      },
      {
        "frets": "xx2321",
        "fingers": "002431"
      },
      {
        "frets": "043366",
        "fingers": "021144",
        "barres": 3
      },
      {
        "frets": "043666",
        "fingers": "021444",
        "barres": 6
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m_Eb",
    "positions": [
      {
        "frets": "xx1321",
        "fingers": "001321",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x68666",
        "fingers": "013111",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x68669",
        "fingers": "013114",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x6866x",
        "fingers": "013110",
        "barres": 6,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m_F#",
    "positions": [
      {
        "frets": "xx4321",
        "fingers": "004321"
      },
      {
        "frets": "xx4666",
        "fingers": "001333",
        "barres": 6
      },
      {
        "frets": "x98666",
        "fingers": "043111",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x9bab9",
        "fingers": "013241",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m_F",
    "positions": [
      {
        "frets": "113321",
        "fingers": "113421",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3321",
        "fingers": "003421"
      },
      {
        "frets": "xx3666",
        "fingers": "001444",
        "barres": 6
      },
      {
        "frets": "x88666",
        "fingers": "034111",
        "barres": 6,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "m_G",
    "positions": [
      {
        "frets": "343366",
        "fingers": "121144",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "343666",
        "fingers": "121444",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5666",
        "fingers": "001222",
        "barres": 6
      },
      {
        "frets": "34336x",
        "fingers": "121140",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "sus",
    "positions": [
      {
        "frets": "x11341",
        "fingers": "011341",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x13341",
        "fingers": "012341",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "668866",
        "fingers": "113411",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "688866",
        "fingers": "123411",
        "barres": 6,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "sus2",
    "positions": [
      {
        "frets": "113311",
        "fingers": "113411",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "63356x",
        "fingers": "311240",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "888ab8",
        "fingers": "111341",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xdaabd",
        "fingers": "031124",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "sus2sus4",
    "positions": [
      {
        "frets": "x11311",
        "fingers": "011311",
        "barres": [
          1
        ],
        "capo": true
      },
      {
        "frets": "668868",
        "fingers": "112314",
        "barres": [
          6
        ],
        "capo": true
      },
      {
        "frets": "6635xx",
        "fingers": "341200"
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "sus4",
    "positions": [
      {
        "frets": "x13341",
        "fingers": "012341",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3346",
        "fingers": "001124",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "688866",
        "fingers": "133311",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x88abb",
        "fingers": "011234",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "_A",
    "positions": [
      {
        "frets": "x00331",
        "fingers": "000341"
      },
      {
        "frets": "x03331",
        "fingers": "002341"
      },
      {
        "frets": "x03336",
        "fingers": "001114",
        "barres": 3
      },
      {
        "frets": "553336",
        "fingers": "231114",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "_Ab",
    "positions": [
      {
        "frets": "453336",
        "fingers": "231114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "453366",
        "fingers": "231144",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx6766",
        "fingers": "001211",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xbcaba",
        "fingers": "024131",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "_B",
    "positions": [
      {
        "frets": "x20331",
        "fingers": "020341"
      },
      {
        "frets": "xx9766",
        "fingers": "004211",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx9aba",
        "fingers": "001243"
      },
      {
        "frets": "x2333x",
        "fingers": "012220",
        "barres": 3
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "_C#",
    "positions": [
      {
        "frets": "x40331",
        "fingers": "040231"
      },
      {
        "frets": "x43336",
        "fingers": "021114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xxbaba",
        "fingers": "002131",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "x4333x",
        "fingers": "021110",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "_C",
    "positions": [
      {
        "frets": "x30331",
        "fingers": "020341"
      },
      {
        "frets": "x33336",
        "fingers": "011114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "888aba",
        "fingers": "111243",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxaaba",
        "fingers": "001121",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "_D",
    "positions": [
      {
        "frets": "xx0331",
        "fingers": "000341"
      },
      {
        "frets": "xx0366",
        "fingers": "000144",
        "barres": 6
      },
      {
        "frets": "x53336",
        "fingers": "031114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x53366",
        "fingers": "031144",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "_E",
    "positions": [
      {
        "frets": "013331",
        "fingers": "012341",
        "barres": 1
      },
      {
        "frets": "xx2331",
        "fingers": "002341"
      },
      {
        "frets": "053336",
        "fingers": "031114",
        "barres": 3
      },
      {
        "frets": "053366",
        "fingers": "031144",
        "barres": 3
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "_Eb",
    "positions": [
      {
        "frets": "xx1331",
        "fingers": "001341",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x68766",
        "fingers": "013211",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xxdaba",
        "fingers": "004121",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "x6333x",
        "fingers": "041110",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "_F#",
    "positions": [
      {
        "frets": "xx4331",
        "fingers": "004231"
      },
      {
        "frets": "xx4766",
        "fingers": "001423"
      },
      {
        "frets": "x98766",
        "fingers": "043211",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "21333x",
        "fingers": "213330",
        "barres": 3
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "_F",
    "positions": [
      {
        "frets": "113331",
        "fingers": "112341",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3331",
        "fingers": "002341"
      },
      {
        "frets": "xx3336",
        "fingers": "001114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x88766",
        "fingers": "034211",
        "barres": 6,
        "capo": true
      }
    ]
  },
  {
    "key": "Bb",
    "suffix": "_G",
    "positions": [
      {
        "frets": "353336",
        "fingers": "131114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "353366",
        "fingers": "131144",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5766",
        "fingers": "001423"
      },
      {
        "frets": "xacaba",
        "fingers": "013121",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "11",
    "positions": [
      {
        "frets": "x32311",
        "fingers": "032411",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x33353",
        "fingers": "011131",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "870066",
        "fingers": "320011",
        "barres": 6
      },
      {
        "frets": "888988",
        "fingers": "111211",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "13",
    "positions": [
      {
        "frets": "x32355",
        "fingers": "021344",
        "barres": 5
      },
      {
        "frets": "333355",
        "fingers": "111134",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "877786",
        "fingers": "322241",
        "barres": 7
      },
      {
        "frets": "8a89a8",
        "fingers": "131241",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "5",
    "positions": [
      {
        "frets": "8axxxx",
        "fingers": "130000"
      },
      {
        "frets": "x35xxx",
        "fingers": "013000"
      },
      {
        "frets": "8aaxxx",
        "fingers": "134000"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "6",
    "positions": [
      {
        "frets": "x32210",
        "fingers": "042310"
      },
      {
        "frets": "x35555",
        "fingers": "013334",
        "barres": 5
      },
      {
        "frets": "8x798x",
        "fingers": "201430"
      },
      {
        "frets": "8xa9a8",
        "fingers": "103241",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "69",
    "positions": [
      {
        "frets": "x32233",
        "fingers": "031134",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x30055",
        "fingers": "010034"
      },
      {
        "frets": "877788",
        "fingers": "211134",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xaa9aa",
        "fingers": "022134",
        "barres": 10
      }
    ]
  },
  {
    "key": "C",
    "suffix": "7#9",
    "positions": [
      {
        "frets": "x3234x",
        "fingers": "021340"
      },
      {
        "frets": "x35340",
        "fingers": "013120",
        "barres": 3
      },
      {
        "frets": "8a898b",
        "fingers": "131214",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxa9bb",
        "fingers": "002134"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "7",
    "positions": [
      {
        "frets": "x32310",
        "fingers": "032410"
      },
      {
        "frets": "x35353",
        "fingers": "013141",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5556",
        "fingers": "001112",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "8a8988",
        "fingers": "131211",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "7b5",
    "positions": [
      {
        "frets": "xx2312",
        "fingers": "002413"
      },
      {
        "frets": "x3435x",
        "fingers": "012130",
        "barres": 3
      },
      {
        "frets": "8x8970",
        "fingers": "203410"
      },
      {
        "frets": "xxabbc",
        "fingers": "001234"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "7b9",
    "positions": [
      {
        "frets": "x32323",
        "fingers": "021314",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "8786xx",
        "fingers": "324100"
      },
      {
        "frets": "8x8989",
        "fingers": "101213",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxa9b9",
        "fingers": "003142"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "7sus4",
    "positions": [
      {
        "frets": "x33311",
        "fingers": "023411",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "335363",
        "fingers": "113141",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5566",
        "fingers": "001123",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "8a8a88",
        "fingers": "131411",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "7_G",
    "positions": [
      {
        "frets": "3323xx",
        "fingers": "231400"
      },
      {
        "frets": "312010",
        "fingers": "423010"
      },
      {
        "frets": "335353",
        "fingers": "113141",
        "barres": 3
      }
    ]
  },
  {
    "key": "C",
    "suffix": "9#11",
    "positions": [
      {
        "frets": "x32332",
        "fingers": "021341",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x34353",
        "fingers": "012131",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "878778",
        "fingers": "213114",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xxabbc",
        "fingers": "001234"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "9",
    "positions": [
      {
        "frets": "032030",
        "fingers": "023040"
      },
      {
        "frets": "332333",
        "fingers": "221334",
        "barres": 3
      },
      {
        "frets": "878788",
        "fingers": "213144",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "8a878a",
        "fingers": "131214",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxa9ba",
        "fingers": "002143"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "9b5",
    "positions": [
      {
        "frets": "x32332",
        "fingers": "021341",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x34330",
        "fingers": "014230"
      },
      {
        "frets": "878778",
        "fingers": "213114",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "8989xa",
        "fingers": "121304",
        "barres": 8
      }
    ]
  },
  {
    "key": "C",
    "suffix": "add11",
    "positions": [
      {
        "frets": "x32011",
        "fingers": "032011",
        "barres": 1
      },
      {
        "frets": "87556x",
        "fingers": "431120",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "87aaxx",
        "fingers": "214400",
        "barres": 10
      }
    ]
  },
  {
    "key": "C",
    "suffix": "add9",
    "positions": [
      {
        "frets": "x32030",
        "fingers": "021030"
      },
      {
        "frets": "x30030",
        "fingers": "010030"
      },
      {
        "frets": "870080",
        "fingers": "210030"
      },
      {
        "frets": "xxa98a",
        "fingers": "003214"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "alt",
    "positions": [
      {
        "frets": "x32552",
        "fingers": "021341",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x34550",
        "fingers": "012340"
      },
      {
        "frets": "xxa978",
        "fingers": "004312"
      },
      {
        "frets": "xxabdc",
        "fingers": "001243"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "aug",
    "positions": [
      {
        "frets": "x3211x",
        "fingers": "032110",
        "barres": 1
      },
      {
        "frets": "x3655x",
        "fingers": "014230"
      },
      {
        "frets": "87655x",
        "fingers": "432110",
        "barres": 5
      },
      {
        "frets": "xxa998",
        "fingers": "004231"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "aug7",
    "positions": [
      {
        "frets": "x323x4",
        "fingers": "021304"
      },
      {
        "frets": "x36354",
        "fingers": "014132",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "8x8990",
        "fingers": "102340"
      },
      {
        "frets": "xxadbc",
        "fingers": "001423"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "aug9",
    "positions": [
      {
        "frets": "x32334",
        "fingers": "021334",
        "barres": 3
      },
      {
        "frets": "x30354",
        "fingers": "010243"
      },
      {
        "frets": "656556",
        "fingers": "213114",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "87879x",
        "fingers": "213140",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "dim",
    "positions": [
      {
        "frets": "x31x12",
        "fingers": "041023"
      },
      {
        "frets": "x3454x",
        "fingers": "012430"
      },
      {
        "frets": "86x87x",
        "fingers": "310420"
      },
      {
        "frets": "xxabxb",
        "fingers": "001203"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "dim7",
    "positions": [
      {
        "frets": "xx1212",
        "fingers": "001324"
      },
      {
        "frets": "x34242",
        "fingers": "023141",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "8x787x",
        "fingers": "201310",
        "barres": 7
      },
      {
        "frets": "xxabab",
        "fingers": "001314",
        "barres": 10
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m11",
    "positions": [
      {
        "frets": "x31331",
        "fingers": "021341",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x33343",
        "fingers": "011121",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "868766",
        "fingers": "314211",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "88888a",
        "fingers": "111114",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m6",
    "positions": [
      {
        "frets": "x31213",
        "fingers": "031214",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x35x45",
        "fingers": "013024"
      },
      {
        "frets": "8x7888",
        "fingers": "201334",
        "barres": 8
      },
      {
        "frets": "8aa8a8",
        "fingers": "123141",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m69",
    "positions": [
      {
        "frets": "x31233",
        "fingers": "031244",
        "barres": 3
      },
      {
        "frets": "x30045",
        "fingers": "010024"
      },
      {
        "frets": "8677xx",
        "fingers": "412300"
      },
      {
        "frets": "xaa8aa",
        "fingers": "022134",
        "barres": 10
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m7",
    "positions": [
      {
        "frets": "8x888x",
        "fingers": "203330"
      },
      {
        "frets": "x3134x",
        "fingers": "021340"
      },
      {
        "frets": "335343",
        "fingers": "113121",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5546",
        "fingers": "002314"
      },
      {
        "frets": "8a8888",
        "fingers": "131111",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m7b5",
    "positions": [
      {
        "frets": "x3434x",
        "fingers": "013240"
      },
      {
        "frets": "xx4546",
        "fingers": "001214",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "89a8b8",
        "fingers": "123141",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxabbb",
        "fingers": "001333",
        "barres": 11
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m9",
    "positions": [
      {
        "frets": "x31333",
        "fingers": "021344",
        "barres": 3
      },
      {
        "frets": "x30343",
        "fingers": "010243"
      },
      {
        "frets": "x68788",
        "fingers": "013244",
        "barres": 8
      },
      {
        "frets": "8a888a",
        "fingers": "131114",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m9_Bb",
    "positions": [
      {
        "frets": "635333",
        "fingers": "413111",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "635533",
        "fingers": "412311",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xdacba",
        "fingers": "041321",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "63533x",
        "fingers": "413110",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m9_Eb",
    "positions": [
      {
        "frets": "baacba",
        "fingers": "211431",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "bxacba",
        "fingers": "201431",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "madd9",
    "positions": [
      {
        "frets": "x31033",
        "fingers": "021034"
      },
      {
        "frets": "x30543",
        "fingers": "010432"
      },
      {
        "frets": "860788",
        "fingers": "310244",
        "barres": 8
      },
      {
        "frets": "xxa88a",
        "fingers": "003114",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "maj11",
    "positions": [
      {
        "frets": "x32001",
        "fingers": "032001"
      },
      {
        "frets": "x33000",
        "fingers": "011000",
        "barres": 3
      },
      {
        "frets": "879060",
        "fingers": "324010"
      },
      {
        "frets": "889988",
        "fingers": "112311",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "maj13",
    "positions": [
      {
        "frets": "x32201",
        "fingers": "042301"
      },
      {
        "frets": "x33455",
        "fingers": "011234",
        "barres": 3
      },
      {
        "frets": "877787",
        "fingers": "211131",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "8899a8",
        "fingers": "112341",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "maj7#5",
    "positions": [
      {
        "frets": "x32100",
        "fingers": "032100"
      },
      {
        "frets": "x36450",
        "fingers": "014230"
      },
      {
        "frets": "876500",
        "fingers": "432100"
      },
      {
        "frets": "8ba900",
        "fingers": "143200"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "maj7",
    "positions": [
      {
        "frets": "332000",
        "fingers": "231000"
      },
      {
        "frets": "335453",
        "fingers": "113241",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5557",
        "fingers": "001114",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xxaccc",
        "fingers": "001333",
        "barres": 12
      }
    ]
  },
  {
    "key": "C",
    "suffix": "maj7b5",
    "positions": [
      {
        "frets": "x32402",
        "fingers": "031402"
      },
      {
        "frets": "x3445x",
        "fingers": "012340"
      },
      {
        "frets": "879977",
        "fingers": "213411",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xxabcc",
        "fingers": "001234"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "maj7sus2",
    "positions": [
      {
        "frets": "x30413",
        "fingers": "020413"
      },
      {
        "frets": "x30003",
        "fingers": "010002"
      },
      {
        "frets": "x30403",
        "fingers": "010302"
      },
      {
        "frets": "x35433",
        "fingers": "013211",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "maj9",
    "positions": [
      {
        "frets": "x30000",
        "fingers": "030000"
      },
      {
        "frets": "33243x",
        "fingers": "221430",
        "barres": 3
      },
      {
        "frets": "055557",
        "fingers": "011113",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "8x998a",
        "fingers": "102314",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "minor",
    "positions": [
      {
        "frets": "x31013",
        "fingers": "032014"
      },
      {
        "frets": "335543",
        "fingers": "113421",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "8655xx",
        "fingers": "421100",
        "barres": 5
      },
      {
        "frets": "8aa888",
        "fingers": "134111",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "mmaj11",
    "positions": [
      {
        "frets": "x31001",
        "fingers": "031002"
      },
      {
        "frets": "333443",
        "fingers": "111231",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "88988a",
        "fingers": "112114",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxaacb",
        "fingers": "001132",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "mmaj7",
    "positions": [
      {
        "frets": "x3100x",
        "fingers": "031000"
      },
      {
        "frets": "335443",
        "fingers": "114231",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "8a9888",
        "fingers": "132111",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxaccb",
        "fingers": "001342"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "mmaj7b5",
    "positions": [
      {
        "frets": "x3x442",
        "fingers": "020341"
      },
      {
        "frets": "x3444x",
        "fingers": "012340"
      },
      {
        "frets": "8998x8",
        "fingers": "123101",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxabcb",
        "fingers": "001243"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "mmaj9",
    "positions": [
      {
        "frets": "x3143x",
        "fingers": "021430"
      },
      {
        "frets": "x30443",
        "fingers": "010342"
      },
      {
        "frets": "86x708",
        "fingers": "310204"
      },
      {
        "frets": "8a988a",
        "fingers": "132114",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m_A",
    "positions": [
      {
        "frets": "x01013",
        "fingers": "001024"
      },
      {
        "frets": "x05543",
        "fingers": "003421"
      },
      {
        "frets": "x05888",
        "fingers": "001444",
        "barres": 8
      },
      {
        "frets": "565588",
        "fingers": "121144",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m_Ab",
    "positions": [
      {
        "frets": "xx6543",
        "fingers": "004321"
      },
      {
        "frets": "xx6888",
        "fingers": "001333",
        "barres": 8
      },
      {
        "frets": "xba888",
        "fingers": "043111",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xbdcdb",
        "fingers": "013241",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m_B",
    "positions": [
      {
        "frets": "x21013",
        "fingers": "031024"
      },
      {
        "frets": "765588",
        "fingers": "321144",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "765888",
        "fingers": "321444",
        "barres": 8
      },
      {
        "frets": "xx9888",
        "fingers": "002111",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m_Bb",
    "positions": [
      {
        "frets": "xx8888",
        "fingers": "001111",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "x1101x",
        "fingers": "012030"
      },
      {
        "frets": "6655xx",
        "fingers": "231100",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "6x5888",
        "fingers": "201444",
        "barres": 8
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m_C#",
    "positions": [
      {
        "frets": "9aa888",
        "fingers": "234111",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxb888",
        "fingers": "004111",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxbcdb",
        "fingers": "001231",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "x4101x",
        "fingers": "041020"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m_D",
    "positions": [
      {
        "frets": "xx0543",
        "fingers": "000321"
      },
      {
        "frets": "x55888",
        "fingers": "011444",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx0888",
        "fingers": "000111",
        "barres": 8
      },
      {
        "frets": "aaa888",
        "fingers": "234111",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m_E",
    "positions": [
      {
        "frets": "xx2543",
        "fingers": "001432"
      },
      {
        "frets": "035543",
        "fingers": "013421",
        "barres": 3
      },
      {
        "frets": "065588",
        "fingers": "021144",
        "barres": 5
      },
      {
        "frets": "065888",
        "fingers": "021444",
        "barres": 8
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m_Eb",
    "positions": [
      {
        "frets": "xx1013",
        "fingers": "001024"
      },
      {
        "frets": "x65588",
        "fingers": "021144",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x65888",
        "fingers": "021444",
        "barres": 8
      },
      {
        "frets": "baa888",
        "fingers": "423111",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m_F#",
    "positions": [
      {
        "frets": "xx4543",
        "fingers": "002431"
      },
      {
        "frets": "x9a888",
        "fingers": "023111",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "x9a88b",
        "fingers": "023114",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "23101x",
        "fingers": "341020"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m_F",
    "positions": [
      {
        "frets": "xx3543",
        "fingers": "001321",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x8a888",
        "fingers": "013111",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "x8a88b",
        "fingers": "013114",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "x8a88x",
        "fingers": "013110",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "m_G",
    "positions": [
      {
        "frets": "335543",
        "fingers": "113421",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5543",
        "fingers": "003421"
      },
      {
        "frets": "xx5888",
        "fingers": "001444",
        "barres": 8
      },
      {
        "frets": "xaa888",
        "fingers": "034111",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "sus",
    "positions": [
      {
        "frets": "x33011",
        "fingers": "034011",
        "barres": 1
      },
      {
        "frets": "x33013",
        "fingers": "023014"
      },
      {
        "frets": "x33563",
        "fingers": "011341",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x35563",
        "fingers": "012341",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "sus2",
    "positions": [
      {
        "frets": "x30013",
        "fingers": "030014"
      },
      {
        "frets": "x30033",
        "fingers": "010023"
      },
      {
        "frets": "335533",
        "fingers": "113411",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "8x0788",
        "fingers": "200134"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "sus2sus4",
    "positions": [
      {
        "frets": "x33033",
        "fingers": "012034"
      },
      {
        "frets": "x30011",
        "fingers": "030011",
        "barres": [
          1
        ]
      },
      {
        "frets": "x33533",
        "fingers": "011311",
        "barres": [
          3
        ],
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "sus4",
    "positions": [
      {
        "frets": "x33011",
        "fingers": "034011",
        "barres": 1
      },
      {
        "frets": "335563",
        "fingers": "112341",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "88x068",
        "fingers": "230014"
      },
      {
        "frets": "8aaa88",
        "fingers": "123411",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "_A",
    "positions": [
      {
        "frets": "x02010",
        "fingers": "002010"
      },
      {
        "frets": "x02013",
        "fingers": "002013"
      },
      {
        "frets": "x05553",
        "fingers": "002341"
      },
      {
        "frets": "x05558",
        "fingers": "001114",
        "barres": 5
      }
    ]
  },
  {
    "key": "C",
    "suffix": "_Ab",
    "positions": [
      {
        "frets": "432010",
        "fingers": "432010"
      },
      {
        "frets": "xx6553",
        "fingers": "004231"
      },
      {
        "frets": "xx6988",
        "fingers": "001423"
      },
      {
        "frets": "xba988",
        "fingers": "043211",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "_B",
    "positions": [
      {
        "frets": "x22010",
        "fingers": "023010"
      },
      {
        "frets": "x22013",
        "fingers": "023014"
      },
      {
        "frets": "775558",
        "fingers": "231114",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "775588",
        "fingers": "231144",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "_Bb",
    "positions": [
      {
        "frets": "x12010",
        "fingers": "013020"
      },
      {
        "frets": "x12013",
        "fingers": "013024"
      },
      {
        "frets": "675558",
        "fingers": "231114",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "675588",
        "fingers": "231144",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "_C#",
    "positions": [
      {
        "frets": "x42010",
        "fingers": "042010"
      },
      {
        "frets": "x42013",
        "fingers": "042013"
      },
      {
        "frets": "xxb988",
        "fingers": "004211",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxbcdc",
        "fingers": "001243"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "_D",
    "positions": [
      {
        "frets": "xx0010",
        "fingers": "000010"
      },
      {
        "frets": "xx0553",
        "fingers": "000341"
      },
      {
        "frets": "x55558",
        "fingers": "011114",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx0988",
        "fingers": "000211",
        "barres": 8
      }
    ]
  },
  {
    "key": "C",
    "suffix": "_E",
    "positions": [
      {
        "frets": "032010",
        "fingers": "032010"
      },
      {
        "frets": "032013",
        "fingers": "032014"
      },
      {
        "frets": "xx2010",
        "fingers": "002010"
      },
      {
        "frets": "xx2013",
        "fingers": "002013"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "_Eb",
    "positions": [
      {
        "frets": "xx1010",
        "fingers": "001020"
      },
      {
        "frets": "x65558",
        "fingers": "021114",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x6555x",
        "fingers": "021110",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "baa9xx",
        "fingers": "423100"
      }
    ]
  },
  {
    "key": "C",
    "suffix": "_F#",
    "positions": [
      {
        "frets": "232010",
        "fingers": "243010"
      },
      {
        "frets": "xx4010",
        "fingers": "004010"
      },
      {
        "frets": "xx4553",
        "fingers": "002341"
      },
      {
        "frets": "x9a988",
        "fingers": "024311",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "_F",
    "positions": [
      {
        "frets": "xx3010",
        "fingers": "003010"
      },
      {
        "frets": "xx3553",
        "fingers": "001341",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x8a988",
        "fingers": "013211",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "x8555x",
        "fingers": "041110",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "C",
    "suffix": "_G",
    "positions": [
      {
        "frets": "332010",
        "fingers": "342010"
      },
      {
        "frets": "335553",
        "fingers": "112341",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5553",
        "fingers": "002341"
      },
      {
        "frets": "xx5558",
        "fingers": "001114",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "11",
    "positions": [
      {
        "frets": "x43004",
        "fingers": "021003"
      },
      {
        "frets": "x45464",
        "fingers": "012131",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "989889",
        "fingers": "213114",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "9a9a99",
        "fingers": "121311",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "13",
    "positions": [
      {
        "frets": "x43302",
        "fingers": "042301"
      },
      {
        "frets": "444466",
        "fingers": "111134",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "988897",
        "fingers": "322241",
        "barres": 8
      },
      {
        "frets": "999abb",
        "fingers": "111234",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "5",
    "positions": [
      {
        "frets": "9bxxxx",
        "fingers": "130000"
      },
      {
        "frets": "x46xxx",
        "fingers": "013000"
      },
      {
        "frets": "9bbxxx",
        "fingers": "134000"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "6",
    "positions": [
      {
        "frets": "x4332x",
        "fingers": "042310"
      },
      {
        "frets": "x46666",
        "fingers": "013333",
        "barres": 6
      },
      {
        "frets": "988666",
        "fingers": "423111",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "9xbab9",
        "fingers": "103241",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "69",
    "positions": [
      {
        "frets": "x41321",
        "fingers": "041321",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x43344",
        "fingers": "021134",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "988899",
        "fingers": "211134",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxbabb",
        "fingers": "002134"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "7#9",
    "positions": [
      {
        "frets": "x43420",
        "fingers": "032410"
      },
      {
        "frets": "x4345x",
        "fingers": "021340"
      },
      {
        "frets": "x89999",
        "fingers": "012234",
        "barres": 9
      },
      {
        "frets": "9b9a9c",
        "fingers": "131214",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "7",
    "positions": [
      {
        "frets": "x4342x",
        "fingers": "032410"
      },
      {
        "frets": "x46464",
        "fingers": "013141",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "986667",
        "fingers": "431112",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "9b9a99",
        "fingers": "131211",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "7b5",
    "positions": [
      {
        "frets": "x43001",
        "fingers": "043001"
      },
      {
        "frets": "x4546x",
        "fingers": "012130",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "9x9a8x",
        "fingers": "203410"
      },
      {
        "frets": "xxcdde",
        "fingers": "001234"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "7b9",
    "positions": [
      {
        "frets": "x43434",
        "fingers": "021314",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x40467",
        "fingers": "010234"
      },
      {
        "frets": "98970x",
        "fingers": "324100"
      },
      {
        "frets": "xx9a9a",
        "fingers": "001324"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "7sus4",
    "positions": [
      {
        "frets": "x44422",
        "fingers": "023411",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "446474",
        "fingers": "113141",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xxx677",
        "fingers": "000123"
      },
      {
        "frets": "9b9b99",
        "fingers": "131411",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "9#11",
    "positions": [
      {
        "frets": "x32003",
        "fingers": "021003"
      },
      {
        "frets": "x45464",
        "fingers": "012131",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "989889",
        "fingers": "213114",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "9a9a99",
        "fingers": "121311",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "9",
    "positions": [
      {
        "frets": "443444",
        "fingers": "221334",
        "barres": 4
      },
      {
        "frets": "9898xx",
        "fingers": "314200"
      },
      {
        "frets": "9b9a9b",
        "fingers": "131214",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xxbacb",
        "fingers": "002143"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "9b5",
    "positions": [
      {
        "frets": "x43443",
        "fingers": "021341",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "989889",
        "fingers": "213114",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "9axa0b",
        "fingers": "120304"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "add11",
    "positions": [
      {
        "frets": "x43122",
        "fingers": "043122",
        "barres": 2
      },
      {
        "frets": "98667x",
        "fingers": "431120",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "98bbxx",
        "fingers": "214400",
        "barres": 11
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "add9",
    "positions": [
      {
        "frets": "x43141",
        "fingers": "032141",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x43x44",
        "fingers": "021034"
      },
      {
        "frets": "98x89x",
        "fingers": "310240"
      },
      {
        "frets": "xxba9b",
        "fingers": "003214"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "alt",
    "positions": [
      {
        "frets": "x43021",
        "fingers": "043021"
      },
      {
        "frets": "x45063",
        "fingers": "023041"
      },
      {
        "frets": "x4566x",
        "fingers": "012340"
      },
      {
        "frets": "xxba89",
        "fingers": "004312"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "aug",
    "positions": [
      {
        "frets": "x44422",
        "fingers": "023411",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "446474",
        "fingers": "113141",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "98766x",
        "fingers": "432110",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "9xbaa9",
        "fingers": "104231",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "aug7",
    "positions": [
      {
        "frets": "x43201",
        "fingers": "043201"
      },
      {
        "frets": "x47465",
        "fingers": "014132",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "987x07",
        "fingers": "431002"
      },
      {
        "frets": "9x9aax",
        "fingers": "102340"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "aug9",
    "positions": [
      {
        "frets": "x43445",
        "fingers": "021334",
        "barres": 4
      },
      {
        "frets": "98780x",
        "fingers": "421300"
      },
      {
        "frets": "9898ax",
        "fingers": "213140",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "9c9a0b",
        "fingers": "141203",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "dim",
    "positions": [
      {
        "frets": "x42x23",
        "fingers": "041023"
      },
      {
        "frets": "x4565x",
        "fingers": "012430"
      },
      {
        "frets": "97x98x",
        "fingers": "310420"
      },
      {
        "frets": "xxbcxc",
        "fingers": "001203"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "dim7",
    "positions": [
      {
        "frets": "xx2323",
        "fingers": "001324"
      },
      {
        "frets": "x45353",
        "fingers": "023141",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "9x898x",
        "fingers": "201310",
        "barres": 8
      },
      {
        "frets": "xxbcbc",
        "fingers": "001324"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m11",
    "positions": [
      {
        "frets": "x42422",
        "fingers": "021311",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "979877",
        "fingers": "314211",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "99999b",
        "fingers": "111114",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xxbbcc",
        "fingers": "001123",
        "barres": 11
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m6",
    "positions": [
      {
        "frets": "x42324",
        "fingers": "031214",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx6656",
        "fingers": "002314"
      },
      {
        "frets": "9x899x",
        "fingers": "201340"
      },
      {
        "frets": "9bb9b9",
        "fingers": "123141",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m69",
    "positions": [
      {
        "frets": "x41320",
        "fingers": "041320"
      },
      {
        "frets": "x4234x",
        "fingers": "031240"
      },
      {
        "frets": "9788x0",
        "fingers": "412300"
      },
      {
        "frets": "xbb9bb",
        "fingers": "022134",
        "barres": 11
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m7",
    "positions": [
      {
        "frets": "9x999x",
        "fingers": "203330"
      },
      {
        "frets": "x46454",
        "fingers": "013121",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx6657",
        "fingers": "002314"
      },
      {
        "frets": "9b9999",
        "fingers": "141111",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xxbdcc",
        "fingers": "001423"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m7b5",
    "positions": [
      {
        "frets": "x4545x",
        "fingers": "013240"
      },
      {
        "frets": "xx5657",
        "fingers": "001214",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "9x998x",
        "fingers": "203410"
      },
      {
        "frets": "xxbccc",
        "fingers": "001222",
        "barres": 12
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m9",
    "positions": [
      {
        "frets": "x42444",
        "fingers": "021344",
        "barres": 4
      },
      {
        "frets": "x66657",
        "fingers": "022314",
        "barres": 6
      },
      {
        "frets": "x79899",
        "fingers": "013244",
        "barres": 9
      },
      {
        "frets": "9b999b",
        "fingers": "131114",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m9_B",
    "positions": [
      {
        "frets": "746444",
        "fingers": "413111",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "746644",
        "fingers": "412311",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xebdcb",
        "fingers": "041321",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "74644x",
        "fingers": "413110",
        "barres": 4,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m9_E",
    "positions": [
      {
        "frets": "cbbdcb",
        "fingers": "211431",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "cxbdcb",
        "fingers": "201431",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "madd9",
    "positions": [
      {
        "frets": "x4214x",
        "fingers": "032140"
      },
      {
        "frets": "x46640",
        "fingers": "013420"
      },
      {
        "frets": "97x890",
        "fingers": "310240"
      },
      {
        "frets": "xxb99b",
        "fingers": "003114",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "maj11",
    "positions": [
      {
        "frets": "x43522",
        "fingers": "032411",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "444564",
        "fingers": "111231",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "98xx78",
        "fingers": "420013"
      },
      {
        "frets": "99aa99",
        "fingers": "112311",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "maj13",
    "positions": [
      {
        "frets": "x41311",
        "fingers": "042301"
      },
      {
        "frets": "x44566",
        "fingers": "011234",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "988898",
        "fingers": "211131",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "99aab9",
        "fingers": "112341",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "maj7#5",
    "positions": [
      {
        "frets": "143211",
        "fingers": "143211",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x4756x",
        "fingers": "014230"
      },
      {
        "frets": "xxbaa8",
        "fingers": "004231"
      },
      {
        "frets": "xxbedd",
        "fingers": "001423"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "maj7",
    "positions": [
      {
        "frets": "x43111",
        "fingers": "043111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "446564",
        "fingers": "113241",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xxx668",
        "fingers": "000113",
        "barres": 6
      },
      {
        "frets": "9xaa9x",
        "fingers": "103420"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "maj7b5",
    "positions": [
      {
        "frets": "x43563",
        "fingers": "021341",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x4556x",
        "fingers": "012340"
      },
      {
        "frets": "98aa88",
        "fingers": "213411",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxbcdd",
        "fingers": "001234"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "maj7sus2",
    "positions": [
      {
        "frets": "x46544",
        "fingers": "013211",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xxb898",
        "fingers": "004121",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxbddb",
        "fingers": "001341",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "x4111x",
        "fingers": "041110",
        "barres": 1,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "maj9",
    "positions": [
      {
        "frets": "x41111",
        "fingers": "041111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x4354x",
        "fingers": "021430"
      },
      {
        "frets": "98a898",
        "fingers": "214131",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxbadb",
        "fingers": "002143"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "major",
    "positions": [
      {
        "frets": "x43121",
        "fingers": "043121",
        "barres": 1
      },
      {
        "frets": "446664",
        "fingers": "112341",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "986669",
        "fingers": "321114",
        "barres": 6
      },
      {
        "frets": "9bba99",
        "fingers": "134211",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "minor",
    "positions": [
      {
        "frets": "x4212x",
        "fingers": "042130"
      },
      {
        "frets": "446654",
        "fingers": "113421",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "9766x9",
        "fingers": "321104",
        "barres": 6
      },
      {
        "frets": "9bb999",
        "fingers": "134111",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "mmaj11",
    "positions": [
      {
        "frets": "x42542",
        "fingers": "031431",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "444554",
        "fingers": "111231",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "99a99b",
        "fingers": "112114",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xxbbdc",
        "fingers": "001132",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "mmaj7",
    "positions": [
      {
        "frets": "x4211x",
        "fingers": "042110",
        "barres": 1
      },
      {
        "frets": "446554",
        "fingers": "114231",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "9ba999",
        "fingers": "132111",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xbbddc",
        "fingers": "011342",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "mmaj7b5",
    "positions": [
      {
        "frets": "x42010",
        "fingers": "042010"
      },
      {
        "frets": "x4555x",
        "fingers": "012340"
      },
      {
        "frets": "9aa9x9",
        "fingers": "122101",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xxbcdc",
        "fingers": "001243"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "mmaj9",
    "positions": [
      {
        "frets": "x41110",
        "fingers": "041110",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x42540",
        "fingers": "021430"
      },
      {
        "frets": "446540",
        "fingers": "114320",
        "barres": 4
      },
      {
        "frets": "9ba99b",
        "fingers": "132114",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m_A",
    "positions": [
      {
        "frets": "x02120",
        "fingers": "002130"
      },
      {
        "frets": "x06654",
        "fingers": "003421"
      },
      {
        "frets": "xx7654",
        "fingers": "004321"
      },
      {
        "frets": "x06999",
        "fingers": "001444",
        "barres": 9
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m_Ab",
    "positions": [
      {
        "frets": "446654",
        "fingers": "113421",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx6654",
        "fingers": "003421"
      },
      {
        "frets": "xx6999",
        "fingers": "001444",
        "barres": 9
      },
      {
        "frets": "xbb999",
        "fingers": "034111",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m_B",
    "positions": [
      {
        "frets": "x22120",
        "fingers": "023140"
      },
      {
        "frets": "xx9999",
        "fingers": "001111",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "x2212x",
        "fingers": "023140"
      },
      {
        "frets": "7766xx",
        "fingers": "231100",
        "barres": 6,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m_Bb",
    "positions": [
      {
        "frets": "x12120",
        "fingers": "013240"
      },
      {
        "frets": "676699",
        "fingers": "121144",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "676999",
        "fingers": "121444",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx8999",
        "fingers": "001222",
        "barres": 9
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m_C",
    "positions": [
      {
        "frets": "x32120",
        "fingers": "042130"
      },
      {
        "frets": "876699",
        "fingers": "321144",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "876999",
        "fingers": "321444",
        "barres": 9
      },
      {
        "frets": "xxa999",
        "fingers": "002111",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m_D",
    "positions": [
      {
        "frets": "xx0120",
        "fingers": "000120"
      },
      {
        "frets": "xx0654",
        "fingers": "000321"
      },
      {
        "frets": "xx0999",
        "fingers": "000111",
        "barres": 9
      },
      {
        "frets": "abb999",
        "fingers": "234111",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m_E",
    "positions": [
      {
        "frets": "xx2120",
        "fingers": "002130"
      },
      {
        "frets": "046654",
        "fingers": "013421",
        "barres": 4
      },
      {
        "frets": "076699",
        "fingers": "021144",
        "barres": 6
      },
      {
        "frets": "076999",
        "fingers": "021444",
        "barres": 9
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m_Eb",
    "positions": [
      {
        "frets": "xx1120",
        "fingers": "001230"
      },
      {
        "frets": "x66999",
        "fingers": "011444",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bbb999",
        "fingers": "234111",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "bbbdec",
        "fingers": "111342",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m_F#",
    "positions": [
      {
        "frets": "xx4120",
        "fingers": "004120"
      },
      {
        "frets": "xx4654",
        "fingers": "001321",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x9b999",
        "fingers": "013111",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "x9b99c",
        "fingers": "013114",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m_F",
    "positions": [
      {
        "frets": "xx3120",
        "fingers": "003120"
      },
      {
        "frets": "xx3654",
        "fingers": "001432"
      },
      {
        "frets": "x86999",
        "fingers": "031444",
        "barres": 9
      },
      {
        "frets": "1421xx",
        "fingers": "142100",
        "barres": 1,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "m_G",
    "positions": [
      {
        "frets": "xx5654",
        "fingers": "002431"
      },
      {
        "frets": "xab999",
        "fingers": "023111",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xab99c",
        "fingers": "023114",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xab99x",
        "fingers": "023110",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "sus",
    "positions": [
      {
        "frets": "x44674",
        "fingers": "011341",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x46674",
        "fingers": "012341",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "99bb99",
        "fingers": "113411",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "9bbb99",
        "fingers": "123411",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "sus2",
    "positions": [
      {
        "frets": "446644",
        "fingers": "113411",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "96689x",
        "fingers": "010023",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "9bbx9b",
        "fingers": "123014",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "bbbdeb",
        "fingers": "111341",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "sus2sus4",
    "positions": [
      {
        "frets": "x44644",
        "fingers": "011311",
        "barres": [
          4
        ],
        "capo": true
      },
      {
        "frets": "99bb9b",
        "fingers": "112314",
        "barres": [
          9
        ],
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "sus4",
    "positions": [
      {
        "frets": "x4412x",
        "fingers": "034120"
      },
      {
        "frets": "446674",
        "fingers": "112341",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "9x6679",
        "fingers": "230014"
      },
      {
        "frets": "9bbb99",
        "fingers": "123411",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "_A",
    "positions": [
      {
        "frets": "x03121",
        "fingers": "003121",
        "barres": 1
      },
      {
        "frets": "x03124",
        "fingers": "003124"
      },
      {
        "frets": "x06664",
        "fingers": "002341"
      },
      {
        "frets": "xx7664",
        "fingers": "004231"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "_Ab",
    "positions": [
      {
        "frets": "446664",
        "fingers": "112341",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx6664",
        "fingers": "002341"
      },
      {
        "frets": "xx6669",
        "fingers": "001114",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xbba99",
        "fingers": "034211",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "_B",
    "positions": [
      {
        "frets": "x23121",
        "fingers": "024131",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "786669",
        "fingers": "231114",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "786699",
        "fingers": "231144",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx9a99",
        "fingers": "001211",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "_Bb",
    "positions": [
      {
        "frets": "x13121",
        "fingers": "013121",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x13124",
        "fingers": "013124",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "686669",
        "fingers": "131114",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "686699",
        "fingers": "131144",
        "barres": 6,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "_C",
    "positions": [
      {
        "frets": "x33121",
        "fingers": "034121",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "886669",
        "fingers": "231114",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "886699",
        "fingers": "231144",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xxaa99",
        "fingers": "002311",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "_D",
    "positions": [
      {
        "frets": "xx0121",
        "fingers": "000121",
        "barres": 1
      },
      {
        "frets": "xx0664",
        "fingers": "000341"
      },
      {
        "frets": "xx0a99",
        "fingers": "000211",
        "barres": 9
      },
      {
        "frets": "xxca99",
        "fingers": "004211",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "_E",
    "positions": [
      {
        "frets": "043121",
        "fingers": "043121",
        "barres": 1
      },
      {
        "frets": "xx2121",
        "fingers": "002131",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "046664",
        "fingers": "012341",
        "barres": 4
      },
      {
        "frets": "086669",
        "fingers": "031114",
        "barres": 6
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "_Eb",
    "positions": [
      {
        "frets": "xx1121",
        "fingers": "001121",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x66669",
        "fingers": "011114",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bbbded",
        "fingers": "111243",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "x6666x",
        "fingers": "011110",
        "barres": 6,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "_F#",
    "positions": [
      {
        "frets": "xx4121",
        "fingers": "004121",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx4664",
        "fingers": "001341",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x9ba99",
        "fingers": "013211",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "x9666x",
        "fingers": "041110",
        "barres": 6,
        "capo": true
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "_F",
    "positions": [
      {
        "frets": "143121",
        "fingers": "143121",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "1xx121",
        "fingers": "111121",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3121",
        "fingers": "003121",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3124",
        "fingers": "003124"
      }
    ]
  },
  {
    "key": "C#",
    "suffix": "_G",
    "positions": [
      {
        "frets": "xx5664",
        "fingers": "002341"
      },
      {
        "frets": "xaba99",
        "fingers": "024311",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "34666x",
        "fingers": "124440",
        "barres": 6
      },
      {
        "frets": "xaba9x",
        "fingers": "024310"
      }
    ]
  },
  {
    "key": "D",
    "suffix": "11",
    "positions": [
      {
        "frets": "xx0012",
        "fingers": "000012"
      },
      {
        "frets": "x54533",
        "fingers": "032411",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x55575",
        "fingers": "011131",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x97788",
        "fingers": "111211",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "13",
    "positions": [
      {
        "frets": "xx0412",
        "fingers": "000412"
      },
      {
        "frets": "555577",
        "fingers": "111134",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "a90908",
        "fingers": "420301"
      },
      {
        "frets": "axabcx",
        "fingers": "102340"
      }
    ]
  },
  {
    "key": "D",
    "suffix": "5",
    "positions": [
      {
        "frets": "acxxxx",
        "fingers": "130000"
      },
      {
        "frets": "x57xxx",
        "fingers": "013000"
      },
      {
        "frets": "accxxx",
        "fingers": "134000"
      }
    ]
  },
  {
    "key": "D",
    "suffix": "6",
    "positions": [
      {
        "frets": "xx0202",
        "fingers": "000203"
      },
      {
        "frets": "x5443x",
        "fingers": "042310"
      },
      {
        "frets": "x57777",
        "fingers": "013334",
        "barres": 7
      },
      {
        "frets": "7977a7",
        "fingers": "131141",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "69",
    "positions": [
      {
        "frets": "x54200",
        "fingers": "043100"
      },
      {
        "frets": "x54455",
        "fingers": "021134",
        "barres": 4
      },
      {
        "frets": "a999aa",
        "fingers": "211134",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xccbcc",
        "fingers": "022134",
        "barres": 12
      }
    ]
  },
  {
    "key": "D",
    "suffix": "7#9",
    "positions": [
      {
        "frets": "x5456x",
        "fingers": "021340"
      },
      {
        "frets": "000a78",
        "fingers": "000412"
      },
      {
        "frets": "x87778",
        "fingers": "021113",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "acabad",
        "fingers": "131214",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "7",
    "positions": [
      {
        "frets": "xx0212",
        "fingers": "000213"
      },
      {
        "frets": "x5453x",
        "fingers": "032410"
      },
      {
        "frets": "557575",
        "fingers": "113141",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "acabaa",
        "fingers": "131211",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "7b5",
    "positions": [
      {
        "frets": "xx0112",
        "fingers": "000112",
        "barres": 1
      },
      {
        "frets": "xx4534",
        "fingers": "002413"
      },
      {
        "frets": "x5657x",
        "fingers": "012130",
        "barres": 5
      },
      {
        "frets": "axab9x",
        "fingers": "203410"
      }
    ]
  },
  {
    "key": "D",
    "suffix": "7b9",
    "positions": [
      {
        "frets": "xx0542",
        "fingers": "000431"
      },
      {
        "frets": "x54545",
        "fingers": "021314",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x60575",
        "fingers": "020141",
        "barres": 5
      },
      {
        "frets": "a9a8xx",
        "fingers": "324100"
      }
    ]
  },
  {
    "key": "D",
    "suffix": "7sus4",
    "positions": [
      {
        "frets": "xx0213",
        "fingers": "000214"
      },
      {
        "frets": "x5553x",
        "fingers": "023410"
      },
      {
        "frets": "557585",
        "fingers": "113141",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "acacaa",
        "fingers": "131411",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "9#11",
    "positions": [
      {
        "frets": "xx0112",
        "fingers": "000123"
      },
      {
        "frets": "x54554",
        "fingers": "021341",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x90798",
        "fingers": "030142"
      },
      {
        "frets": "a9a99a",
        "fingers": "213114",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "9",
    "positions": [
      {
        "frets": "554555",
        "fingers": "221334",
        "barres": 5
      },
      {
        "frets": "x70778",
        "fingers": "010234"
      },
      {
        "frets": "a9a9ax",
        "fingers": "213140",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "acabac",
        "fingers": "131214",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "9b5",
    "positions": [
      {
        "frets": "x54554",
        "fingers": "021341",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x56570",
        "fingers": "013240"
      },
      {
        "frets": "a9a99a",
        "fingers": "213114",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "ababxc",
        "fingers": "121304",
        "barres": 10
      }
    ]
  },
  {
    "key": "D",
    "suffix": "add11",
    "positions": [
      {
        "frets": "x54233",
        "fingers": "043122",
        "barres": 3
      },
      {
        "frets": "xx0b8a",
        "fingers": "000413"
      },
      {
        "frets": "a9778x",
        "fingers": "431120",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "a9ccxx",
        "fingers": "214400",
        "barres": 12
      }
    ]
  },
  {
    "key": "D",
    "suffix": "add9",
    "positions": [
      {
        "frets": "x54252",
        "fingers": "032141",
        "barres": 2
      },
      {
        "frets": "x57770",
        "fingers": "012340"
      },
      {
        "frets": "xx097a",
        "fingers": "000314"
      },
      {
        "frets": "xxcbac",
        "fingers": "003214"
      }
    ]
  },
  {
    "key": "D",
    "suffix": "alt",
    "positions": [
      {
        "frets": "xx0132",
        "fingers": "000132"
      },
      {
        "frets": "x54x34",
        "fingers": "042013"
      },
      {
        "frets": "x5677x",
        "fingers": "012340"
      },
      {
        "frets": "xb0b9a",
        "fingers": "030412"
      }
    ]
  },
  {
    "key": "D",
    "suffix": "aug",
    "positions": [
      {
        "frets": "xx0332",
        "fingers": "000231"
      },
      {
        "frets": "x5433x",
        "fingers": "032110",
        "barres": 3
      },
      {
        "frets": "a9877x",
        "fingers": "432110",
        "barres": 7
      },
      {
        "frets": "axcbbx",
        "fingers": "104230"
      }
    ]
  },
  {
    "key": "D",
    "suffix": "aug7",
    "positions": [
      {
        "frets": "xx0312",
        "fingers": "000412"
      },
      {
        "frets": "x545x6",
        "fingers": "021304"
      },
      {
        "frets": "x58576",
        "fingers": "014132",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "axabbx",
        "fingers": "102340"
      }
    ]
  },
  {
    "key": "D",
    "suffix": "aug9",
    "positions": [
      {
        "frets": "x54556",
        "fingers": "021334",
        "barres": 5
      },
      {
        "frets": "x70576",
        "fingers": "030142"
      },
      {
        "frets": "a9a9bx",
        "fingers": "213140",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "axabb0",
        "fingers": "102340"
      }
    ]
  },
  {
    "key": "D",
    "suffix": "dim",
    "positions": [
      {
        "frets": "xx01x1",
        "fingers": "000102"
      },
      {
        "frets": "x53x34",
        "fingers": "041023"
      },
      {
        "frets": "x5676x",
        "fingers": "012430"
      },
      {
        "frets": "a8xa9x",
        "fingers": "310420"
      }
    ]
  },
  {
    "key": "D",
    "suffix": "dim7",
    "positions": [
      {
        "frets": "xx0101",
        "fingers": "000203"
      },
      {
        "frets": "x56464",
        "fingers": "023141",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x80a97",
        "fingers": "020431"
      },
      {
        "frets": "abcaca",
        "fingers": "123141",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m11",
    "positions": [
      {
        "frets": "xx0011",
        "fingers": "000011",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x53553",
        "fingers": "021341",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "a8a988",
        "fingers": "314211",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "aaaaac",
        "fingers": "111114",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m6",
    "positions": [
      {
        "frets": "xx0201",
        "fingers": "000201"
      },
      {
        "frets": "x53435",
        "fingers": "031214",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x57x67",
        "fingers": "013024"
      },
      {
        "frets": "ax9aaa",
        "fingers": "201333",
        "barres": 10
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m69",
    "positions": [
      {
        "frets": "x53200",
        "fingers": "042100"
      },
      {
        "frets": "x53450",
        "fingers": "031240"
      },
      {
        "frets": "x70767",
        "fingers": "020314"
      },
      {
        "frets": "xccacc",
        "fingers": "022134",
        "barres": 12
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m7",
    "positions": [
      {
        "frets": "axaaax",
        "fingers": "203330"
      },
      {
        "frets": "xx0211",
        "fingers": "000211",
        "barres": 1
      },
      {
        "frets": "x57565",
        "fingers": "013121",
        "barres": 5
      },
      {
        "frets": "xx7768",
        "fingers": "002314"
      },
      {
        "frets": "acaaaa",
        "fingers": "131111",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m7b5",
    "positions": [
      {
        "frets": "xx0111",
        "fingers": "000111",
        "barres": 1
      },
      {
        "frets": "x53534",
        "fingers": "031412",
        "barres": 3
      },
      {
        "frets": "x5656x",
        "fingers": "013240"
      },
      {
        "frets": "x80a98",
        "fingers": "010432"
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m9",
    "positions": [
      {
        "frets": "100210",
        "fingers": "100320"
      },
      {
        "frets": "x53555",
        "fingers": "021344",
        "barres": 5
      },
      {
        "frets": "x57560",
        "fingers": "014230"
      },
      {
        "frets": "acaaac",
        "fingers": "131114",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m9_C",
    "positions": [
      {
        "frets": "x30210",
        "fingers": "030210"
      },
      {
        "frets": "x30230",
        "fingers": "020130"
      },
      {
        "frets": "857555",
        "fingers": "413111",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "857755",
        "fingers": "412311",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m9_F",
    "positions": [
      {
        "frets": "100210",
        "fingers": "100320"
      },
      {
        "frets": "130230",
        "fingers": "130240"
      },
      {
        "frets": "1x0210",
        "fingers": "100320"
      }
    ]
  },
  {
    "key": "D",
    "suffix": "madd9",
    "positions": [
      {
        "frets": "x53230",
        "fingers": "042130"
      },
      {
        "frets": "x5325x",
        "fingers": "032140"
      },
      {
        "frets": "x57760",
        "fingers": "013420"
      },
      {
        "frets": "xxcaac",
        "fingers": "003114",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "maj11",
    "positions": [
      {
        "frets": "xx0022",
        "fingers": "000011",
        "barres": 2
      },
      {
        "frets": "555675",
        "fingers": "111231",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x90789",
        "fingers": "030124"
      },
      {
        "frets": "aabbaa",
        "fingers": "112311",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "maj13",
    "positions": [
      {
        "frets": "xx0422",
        "fingers": "000311",
        "barres": 2
      },
      {
        "frets": "x54420",
        "fingers": "042310"
      },
      {
        "frets": "x55677",
        "fingers": "011234",
        "barres": 5
      },
      {
        "frets": "a999a9",
        "fingers": "211131",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "maj7#5",
    "positions": [
      {
        "frets": "xx0322",
        "fingers": "000423"
      },
      {
        "frets": "254322",
        "fingers": "143211",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x50676",
        "fingers": "010243"
      },
      {
        "frets": "xx0bb9",
        "fingers": "000231"
      }
    ]
  },
  {
    "key": "D",
    "suffix": "maj7",
    "positions": [
      {
        "frets": "xx0222",
        "fingers": "000111",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x54222",
        "fingers": "043111",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "557675",
        "fingers": "113241",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx7779",
        "fingers": "001114",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "maj7b5",
    "positions": [
      {
        "frets": "xx0122",
        "fingers": "000123"
      },
      {
        "frets": "x5667x",
        "fingers": "012340"
      },
      {
        "frets": "a9bb99",
        "fingers": "213411",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "abbbxa",
        "fingers": "123401",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "maj7sus2",
    "positions": [
      {
        "frets": "xx0220",
        "fingers": "000120"
      },
      {
        "frets": "xx0655",
        "fingers": "000211",
        "barres": 5
      },
      {
        "frets": "x57655",
        "fingers": "013211",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx09a9",
        "fingers": "000121",
        "barres": 9
      }
    ]
  },
  {
    "key": "D",
    "suffix": "maj9",
    "positions": [
      {
        "frets": "x52222",
        "fingers": "041111",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x5464x",
        "fingers": "021430"
      },
      {
        "frets": "x90979",
        "fingers": "020314"
      },
      {
        "frets": "axbbac",
        "fingers": "102314",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "major",
    "positions": [
      {
        "frets": "xx0232",
        "fingers": "000132"
      },
      {
        "frets": "x54232",
        "fingers": "043121",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x57775",
        "fingers": "012341",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "accbaa",
        "fingers": "134211",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "minor",
    "positions": [
      {
        "frets": "xx0231",
        "fingers": "000231"
      },
      {
        "frets": "557765",
        "fingers": "113421",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x8776x",
        "fingers": "042310"
      },
      {
        "frets": "accaaa",
        "fingers": "134111",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "mmaj11",
    "positions": [
      {
        "frets": "xx0021",
        "fingers": "000021"
      },
      {
        "frets": "x53653",
        "fingers": "021431",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "555775",
        "fingers": "111231",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "aabaac",
        "fingers": "112114",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "mmaj7",
    "positions": [
      {
        "frets": "xx0221",
        "fingers": "000231"
      },
      {
        "frets": "x53220",
        "fingers": "042110",
        "barres": 2
      },
      {
        "frets": "557665",
        "fingers": "114231",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "acbaaa",
        "fingers": "132111",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "mmaj7b5",
    "positions": [
      {
        "frets": "xx0121",
        "fingers": "000132"
      },
      {
        "frets": "45666x",
        "fingers": "123330",
        "barres": 6
      },
      {
        "frets": "x5666x",
        "fingers": "012340"
      },
      {
        "frets": "abbaxa",
        "fingers": "122101",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "mmaj9",
    "positions": [
      {
        "frets": "x53650",
        "fingers": "021430"
      },
      {
        "frets": "x70665",
        "fingers": "040231"
      },
      {
        "frets": "x809a9",
        "fingers": "010243"
      },
      {
        "frets": "acbaac",
        "fingers": "132114",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m_A",
    "positions": [
      {
        "frets": "x00231",
        "fingers": "000231"
      },
      {
        "frets": "x03231",
        "fingers": "003241"
      },
      {
        "frets": "x07765",
        "fingers": "003421"
      },
      {
        "frets": "557765",
        "fingers": "113421",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m_Ab",
    "positions": [
      {
        "frets": "400231",
        "fingers": "400231"
      },
      {
        "frets": "xx6765",
        "fingers": "002431"
      },
      {
        "frets": "xbcaaa",
        "fingers": "023111",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "xbcaad",
        "fingers": "023114",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m_B",
    "positions": [
      {
        "frets": "x20231",
        "fingers": "020341"
      },
      {
        "frets": "7877aa",
        "fingers": "121144",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "787aaa",
        "fingers": "121444",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xx9aaa",
        "fingers": "001222",
        "barres": 10
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m_Bb",
    "positions": [
      {
        "frets": "x13231",
        "fingers": "013241",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx8765",
        "fingers": "004321"
      },
      {
        "frets": "xx8aaa",
        "fingers": "001333",
        "barres": 10
      },
      {
        "frets": "xdcaaa",
        "fingers": "043111",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m_C#",
    "positions": [
      {
        "frets": "x40231",
        "fingers": "040231"
      },
      {
        "frets": "9877aa",
        "fingers": "321144",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "987aaa",
        "fingers": "321444",
        "barres": 10
      },
      {
        "frets": "xxbaaa",
        "fingers": "002111",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m_C",
    "positions": [
      {
        "frets": "x30231",
        "fingers": "030241"
      },
      {
        "frets": "xxaaaa",
        "fingers": "001111",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "x3323x",
        "fingers": "023140"
      },
      {
        "frets": "8877xx",
        "fingers": "231100",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m_E",
    "positions": [
      {
        "frets": "000231",
        "fingers": "000231"
      },
      {
        "frets": "003231",
        "fingers": "003241"
      },
      {
        "frets": "xx2231",
        "fingers": "002341"
      },
      {
        "frets": "057765",
        "fingers": "013421",
        "barres": 5
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m_Eb",
    "positions": [
      {
        "frets": "xx1231",
        "fingers": "001231",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "bccaaa",
        "fingers": "234111",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "xxdaaa",
        "fingers": "004111",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "x6776x",
        "fingers": "012310",
        "barres": 6,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m_F#",
    "positions": [
      {
        "frets": "200231",
        "fingers": "200341"
      },
      {
        "frets": "xx4231",
        "fingers": "004231"
      },
      {
        "frets": "xx4765",
        "fingers": "001432"
      },
      {
        "frets": "x97aaa",
        "fingers": "031444",
        "barres": 10
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m_F",
    "positions": [
      {
        "frets": "xx3231",
        "fingers": "003241"
      },
      {
        "frets": "x877aa",
        "fingers": "021144",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "x87aaa",
        "fingers": "021444",
        "barres": 10
      },
      {
        "frets": "dccaaa",
        "fingers": "423111",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "m_G",
    "positions": [
      {
        "frets": "300231",
        "fingers": "300241"
      },
      {
        "frets": "xx5765",
        "fingers": "001321",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xacaaa",
        "fingers": "013111",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "xacaad",
        "fingers": "013114",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "sus",
    "positions": [
      {
        "frets": "xx0233",
        "fingers": "000122",
        "barres": 3
      },
      {
        "frets": "xx0785",
        "fingers": "000341"
      },
      {
        "frets": "x55785",
        "fingers": "011341",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x57785",
        "fingers": "012341",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "sus2",
    "positions": [
      {
        "frets": "xx0230",
        "fingers": "000230"
      },
      {
        "frets": "xx2235",
        "fingers": "001124",
        "barres": 2
      },
      {
        "frets": "557755",
        "fingers": "113411",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x777aa",
        "fingers": "011144",
        "barres": [
          7,
          10
        ],
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "sus2sus4",
    "positions": [
      {
        "frets": "x55755",
        "fingers": "011311",
        "barres": [
          5
        ],
        "capo": true
      },
      {
        "frets": "x52233",
        "fingers": "041122",
        "barres": [
          2,
          3
        ]
      },
      {
        "frets": "aaccac",
        "fingers": "112314",
        "barres": [
          10
        ],
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "sus4",
    "positions": [
      {
        "frets": "xx0233",
        "fingers": "000123"
      },
      {
        "frets": "x50035",
        "fingers": "030014"
      },
      {
        "frets": "557785",
        "fingers": "112341",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "acccaa",
        "fingers": "123411",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "_A",
    "positions": [
      {
        "frets": "x00232",
        "fingers": "000121",
        "barres": 2
      },
      {
        "frets": "x04232",
        "fingers": "003121",
        "barres": 2
      },
      {
        "frets": "x04235",
        "fingers": "003124"
      },
      {
        "frets": "x07775",
        "fingers": "002341"
      }
    ]
  },
  {
    "key": "D",
    "suffix": "_Ab",
    "positions": [
      {
        "frets": "400232",
        "fingers": "300121",
        "barres": 2
      },
      {
        "frets": "404232",
        "fingers": "304121",
        "barres": 2
      },
      {
        "frets": "xx6775",
        "fingers": "002341"
      },
      {
        "frets": "xbcbaa",
        "fingers": "024311",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "_B",
    "positions": [
      {
        "frets": "x24232",
        "fingers": "013121",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x24235",
        "fingers": "013124",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "79777a",
        "fingers": "131114",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "7977aa",
        "fingers": "131144",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "_Bb",
    "positions": [
      {
        "frets": "x10232",
        "fingers": "010243"
      },
      {
        "frets": "xx8775",
        "fingers": "004231"
      },
      {
        "frets": "xx8baa",
        "fingers": "001423"
      },
      {
        "frets": "xdcbaa",
        "fingers": "043211",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "_C#",
    "positions": [
      {
        "frets": "x40232",
        "fingers": "030121",
        "barres": 2
      },
      {
        "frets": "x44232",
        "fingers": "034121",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "99777a",
        "fingers": "231114",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "9977aa",
        "fingers": "231144",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "_C",
    "positions": [
      {
        "frets": "x30232",
        "fingers": "020131",
        "barres": 2
      },
      {
        "frets": "x34232",
        "fingers": "024131",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "89777a",
        "fingers": "231114",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "8977aa",
        "fingers": "231144",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "_E",
    "positions": [
      {
        "frets": "000232",
        "fingers": "000121",
        "barres": 2
      },
      {
        "frets": "004232",
        "fingers": "003121",
        "barres": 2
      },
      {
        "frets": "054232",
        "fingers": "043121",
        "barres": 2
      },
      {
        "frets": "xx2232",
        "fingers": "001121",
        "barres": 2,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "_Eb",
    "positions": [
      {
        "frets": "xx1232",
        "fingers": "001243"
      },
      {
        "frets": "xxdbaa",
        "fingers": "004211",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "x6777x",
        "fingers": "012220",
        "barres": 7
      },
      {
        "frets": "bccbxx",
        "fingers": "123100",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "D",
    "suffix": "_F#",
    "positions": [
      {
        "frets": "254232",
        "fingers": "143121",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "2xx232",
        "fingers": "111121",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4232",
        "fingers": "003121",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4235",
        "fingers": "003124"
      }
    ]
  },
  {
    "key": "D",
    "suffix": "_F",
    "positions": [
      {
        "frets": "100232",
        "fingers": "100243"
      },
      {
        "frets": "xx3232",
        "fingers": "002131",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x8777a",
        "fingers": "021114",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "10423x",
        "fingers": "104230"
      }
    ]
  },
  {
    "key": "D",
    "suffix": "_G",
    "positions": [
      {
        "frets": "300232",
        "fingers": "200131",
        "barres": 2
      },
      {
        "frets": "304232",
        "fingers": "204131",
        "barres": 2
      },
      {
        "frets": "xx5232",
        "fingers": "004121",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx5775",
        "fingers": "001341",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "11",
    "positions": [
      {
        "frets": "000100",
        "fingers": "000100"
      },
      {
        "frets": "004434",
        "fingers": "002314"
      },
      {
        "frets": "x76755",
        "fingers": "032411",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x77797",
        "fingers": "011131",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "13",
    "positions": [
      {
        "frets": "020120",
        "fingers": "020130"
      },
      {
        "frets": "000122",
        "fingers": "000123"
      },
      {
        "frets": "056650",
        "fingers": "013420"
      },
      {
        "frets": "777799",
        "fingers": "111134",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "5",
    "positions": [
      {
        "frets": "cexxxx",
        "fingers": "130000"
      },
      {
        "frets": "x79xxx",
        "fingers": "013000"
      },
      {
        "frets": "ceexxx",
        "fingers": "134000"
      },
      {
        "frets": "022xxx",
        "fingers": "023000"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "6",
    "positions": [
      {
        "frets": "022120",
        "fingers": "023140"
      },
      {
        "frets": "022424",
        "fingers": "011314",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x7665x",
        "fingers": "042310"
      },
      {
        "frets": "x79999",
        "fingers": "013333",
        "barres": 9
      }
    ]
  },
  {
    "key": "E",
    "suffix": "69",
    "positions": [
      {
        "frets": "022122",
        "fingers": "022134",
        "barres": 2
      },
      {
        "frets": "x76677",
        "fingers": "021134",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x99999",
        "fingers": "011111",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "0bbbcc",
        "fingers": "011134",
        "barres": 11
      }
    ]
  },
  {
    "key": "E",
    "suffix": "7#9",
    "positions": [
      {
        "frets": "020103",
        "fingers": "020104"
      },
      {
        "frets": "050034",
        "fingers": "030012"
      },
      {
        "frets": "x7678x",
        "fingers": "021340"
      },
      {
        "frets": "0a999a",
        "fingers": "021113",
        "barres": 9
      }
    ]
  },
  {
    "key": "E",
    "suffix": "7",
    "positions": [
      {
        "frets": "020100",
        "fingers": "020100"
      },
      {
        "frets": "x7675x",
        "fingers": "032410"
      },
      {
        "frets": "779797",
        "fingers": "113141",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xx999a",
        "fingers": "001112",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "7b5",
    "positions": [
      {
        "frets": "010130",
        "fingers": "010240"
      },
      {
        "frets": "xx2334",
        "fingers": "001234"
      },
      {
        "frets": "xx6756",
        "fingers": "002413"
      },
      {
        "frets": "x7879x",
        "fingers": "012130",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "7b9",
    "positions": [
      {
        "frets": "020101",
        "fingers": "030102"
      },
      {
        "frets": "050464",
        "fingers": "030141",
        "barres": 4
      },
      {
        "frets": "x76767",
        "fingers": "021314",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "cbcaxx",
        "fingers": "324100"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "7sus4",
    "positions": [
      {
        "frets": "020200",
        "fingers": "020300"
      },
      {
        "frets": "x77755",
        "fingers": "023411",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "7797a7",
        "fingers": "113141",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xx99aa",
        "fingers": "001123",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "9#11",
    "positions": [
      {
        "frets": "010100",
        "fingers": "010200"
      },
      {
        "frets": "050354",
        "fingers": "030142"
      },
      {
        "frets": "x76776",
        "fingers": "021341",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "cbcbbc",
        "fingers": "213114",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "9",
    "positions": [
      {
        "frets": "020102",
        "fingers": "020103"
      },
      {
        "frets": "4x2432",
        "fingers": "301421",
        "barres": 2
      },
      {
        "frets": "776777",
        "fingers": "221334",
        "barres": 7
      },
      {
        "frets": "09999a",
        "fingers": "011112",
        "barres": 9
      }
    ]
  },
  {
    "key": "E",
    "suffix": "9b5",
    "positions": [
      {
        "frets": "012132",
        "fingers": "012143",
        "barres": 1
      },
      {
        "frets": "054334",
        "fingers": "042113",
        "barres": 3
      },
      {
        "frets": "x76776",
        "fingers": "021341",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "098790",
        "fingers": "032140"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "add11",
    "positions": [
      {
        "frets": "022254",
        "fingers": "011143",
        "barres": 2
      },
      {
        "frets": "076455",
        "fingers": "043122",
        "barres": 5
      },
      {
        "frets": "x76455",
        "fingers": "043122",
        "barres": 5
      },
      {
        "frets": "077997",
        "fingers": "011341",
        "barres": 7
      }
    ]
  },
  {
    "key": "E",
    "suffix": "add9",
    "positions": [
      {
        "frets": "022102",
        "fingers": "023104"
      },
      {
        "frets": "x76474",
        "fingers": "032141",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x76x77",
        "fingers": "021034"
      },
      {
        "frets": "xxedce",
        "fingers": "003214"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "alt",
    "positions": [
      {
        "frets": "0121xx",
        "fingers": "013200"
      },
      {
        "frets": "xx2354",
        "fingers": "001243"
      },
      {
        "frets": "076x56",
        "fingers": "042013"
      },
      {
        "frets": "078990",
        "fingers": "012340"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "aug",
    "positions": [
      {
        "frets": "032110",
        "fingers": "043120"
      },
      {
        "frets": "x7655x",
        "fingers": "032110",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x7a99x",
        "fingers": "432110"
      },
      {
        "frets": "cba990",
        "fingers": "432110",
        "barres": 9
      }
    ]
  },
  {
    "key": "E",
    "suffix": "aug7",
    "positions": [
      {
        "frets": "030110",
        "fingers": "040120"
      },
      {
        "frets": "xx2534",
        "fingers": "001423"
      },
      {
        "frets": "x7a798",
        "fingers": "014132",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "cxcddx",
        "fingers": "102340"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "aug9",
    "positions": [
      {
        "frets": "030132",
        "fingers": "030142"
      },
      {
        "frets": "054554",
        "fingers": "021341",
        "barres": 4
      },
      {
        "frets": "x76778",
        "fingers": "021334",
        "barres": 7
      },
      {
        "frets": "09a99a",
        "fingers": "012113",
        "barres": 9
      }
    ]
  },
  {
    "key": "E",
    "suffix": "dim",
    "positions": [
      {
        "frets": "xx23x3",
        "fingers": "001203"
      },
      {
        "frets": "x75x56",
        "fingers": "041023"
      },
      {
        "frets": "x7898x",
        "fingers": "012430"
      },
      {
        "frets": "caxcbx",
        "fingers": "310420"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "dim7",
    "positions": [
      {
        "frets": "012020",
        "fingers": "012030"
      },
      {
        "frets": "xx2323",
        "fingers": "001324"
      },
      {
        "frets": "x7868x",
        "fingers": "023140"
      },
      {
        "frets": "cxbcbx",
        "fingers": "201310",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m11",
    "positions": [
      {
        "frets": "000002",
        "fingers": "000001"
      },
      {
        "frets": "005430",
        "fingers": "003210"
      },
      {
        "frets": "x75775",
        "fingers": "021341",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "cacbaa",
        "fingers": "314211",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m6",
    "positions": [
      {
        "frets": "022020",
        "fingers": "012030"
      },
      {
        "frets": "022423",
        "fingers": "011312",
        "barres": 2
      },
      {
        "frets": "x75657",
        "fingers": "031214",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx9989",
        "fingers": "002314"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m69",
    "positions": [
      {
        "frets": "022022",
        "fingers": "011023",
        "barres": 2
      },
      {
        "frets": "3x2422",
        "fingers": "201311",
        "barres": 2
      },
      {
        "frets": "x75677",
        "fingers": "031244",
        "barres": 7
      },
      {
        "frets": "0abbc0",
        "fingers": "012340"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m7",
    "positions": [
      {
        "frets": "0x000x",
        "fingers": "203330"
      },
      {
        "frets": "cxcccx",
        "fingers": "203330"
      },
      {
        "frets": "022030",
        "fingers": "023040"
      },
      {
        "frets": "020000",
        "fingers": "020000"
      },
      {
        "frets": "022433",
        "fingers": "011423",
        "barres": 2
      },
      {
        "frets": "779787",
        "fingers": "113121",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xx998a",
        "fingers": "002314"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m7b5",
    "positions": [
      {
        "frets": "012333",
        "fingers": "012333",
        "barres": 3
      },
      {
        "frets": "x7878x",
        "fingers": "013240"
      },
      {
        "frets": "xx898a",
        "fingers": "001214",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "cxccbx",
        "fingers": "203410"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m9",
    "positions": [
      {
        "frets": "020002",
        "fingers": "020004"
      },
      {
        "frets": "022032",
        "fingers": "012043"
      },
      {
        "frets": "x75777",
        "fingers": "021344",
        "barres": 7
      },
      {
        "frets": "0acbca",
        "fingers": "013241",
        "barres": 10
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m9_D",
    "positions": [
      {
        "frets": "x52432",
        "fingers": "041321",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "a79777",
        "fingers": "413111",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "a79977",
        "fingers": "412311",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "a7977x",
        "fingers": "413110",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m9_G",
    "positions": [
      {
        "frets": "322432",
        "fingers": "211431",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "3x2032",
        "fingers": "301042"
      },
      {
        "frets": "3x2432",
        "fingers": "201431",
        "barres": 2,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "madd9",
    "positions": [
      {
        "frets": "xx3113",
        "fingers": "003114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x8658x",
        "fingers": "032140"
      },
      {
        "frets": "x86068",
        "fingers": "031024"
      },
      {
        "frets": "x8a098",
        "fingers": "014032"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "maj11",
    "positions": [
      {
        "frets": "001100",
        "fingers": "001200"
      },
      {
        "frets": "006445",
        "fingers": "003112",
        "barres": 4
      },
      {
        "frets": "777897",
        "fingers": "111231",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "0b99ab",
        "fingers": "031124",
        "barres": 9
      }
    ]
  },
  {
    "key": "E",
    "suffix": "maj13",
    "positions": [
      {
        "frets": "021122",
        "fingers": "021134",
        "barres": 1
      },
      {
        "frets": "x76644",
        "fingers": "042311",
        "barres": 4
      },
      {
        "frets": "x77899",
        "fingers": "011234",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "cbbbcb",
        "fingers": "211131",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "maj7#5",
    "positions": [
      {
        "frets": "032144",
        "fingers": "032144",
        "barres": 4
      },
      {
        "frets": "476544",
        "fingers": "143211",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x7a89x",
        "fingers": "014230"
      },
      {
        "frets": "0ba99b",
        "fingers": "032114",
        "barres": 9
      }
    ]
  },
  {
    "key": "E",
    "suffix": "maj7",
    "positions": [
      {
        "frets": "021100",
        "fingers": "031200"
      },
      {
        "frets": "xx2444",
        "fingers": "001333",
        "barres": 4
      },
      {
        "frets": "x76444",
        "fingers": "043111",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "779897",
        "fingers": "113241",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "maj7b5",
    "positions": [
      {
        "frets": "011140",
        "fingers": "011140",
        "barres": 1
      },
      {
        "frets": "xx2344",
        "fingers": "001234"
      },
      {
        "frets": "x7889x",
        "fingers": "012340"
      },
      {
        "frets": "0bddbb",
        "fingers": "013411",
        "barres": 11
      }
    ]
  },
  {
    "key": "E",
    "suffix": "maj7sus2",
    "positions": [
      {
        "frets": "022442",
        "fingers": "011341",
        "barres": 2
      },
      {
        "frets": "024442",
        "fingers": "012341",
        "barres": 2
      },
      {
        "frets": "xx2442",
        "fingers": "001341",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "064447",
        "fingers": "031114",
        "barres": 4
      }
    ]
  },
  {
    "key": "E",
    "suffix": "maj9",
    "positions": [
      {
        "frets": "021102",
        "fingers": "031204"
      },
      {
        "frets": "422442",
        "fingers": "211341",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x7687x",
        "fingers": "021430"
      },
      {
        "frets": "xx9b9b",
        "fingers": "001314",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "major",
    "positions": [
      {
        "frets": "022100",
        "fingers": "023100"
      },
      {
        "frets": "xx2454",
        "fingers": "001243"
      },
      {
        "frets": "x76454",
        "fingers": "043121",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x79997",
        "fingers": "012341",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "minor",
    "positions": [
      {
        "frets": "022000",
        "fingers": "023000"
      },
      {
        "frets": "022453",
        "fingers": "011342",
        "barres": 2
      },
      {
        "frets": "x79987",
        "fingers": "013421",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "ca99xx",
        "fingers": "431200"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "mmaj11",
    "positions": [
      {
        "frets": "001002",
        "fingers": "001003"
      },
      {
        "frets": "x22243",
        "fingers": "011132",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x75875",
        "fingers": "021431",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "777887",
        "fingers": "111231",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "mmaj7",
    "positions": [
      {
        "frets": "021000",
        "fingers": "021000"
      },
      {
        "frets": "022443",
        "fingers": "011342",
        "barres": 2
      },
      {
        "frets": "x7544x",
        "fingers": "042110",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "779887",
        "fingers": "114231",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "mmaj7b5",
    "positions": [
      {
        "frets": "0110x0",
        "fingers": "012000"
      },
      {
        "frets": "xx2343",
        "fingers": "001243"
      },
      {
        "frets": "67888x",
        "fingers": "123330",
        "barres": 8
      },
      {
        "frets": "x7888x",
        "fingers": "012340"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "mmaj9",
    "positions": [
      {
        "frets": "021002",
        "fingers": "021003"
      },
      {
        "frets": "0x4443",
        "fingers": "002241",
        "barres": 4
      },
      {
        "frets": "0a9870",
        "fingers": "043210"
      },
      {
        "frets": "cedcce",
        "fingers": "132114",
        "barres": 12,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m_A",
    "positions": [
      {
        "frets": "x02000",
        "fingers": "001000"
      },
      {
        "frets": "x02003",
        "fingers": "001002"
      },
      {
        "frets": "x02403",
        "fingers": "001302"
      },
      {
        "frets": "x02453",
        "fingers": "001342"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m_Ab",
    "positions": [
      {
        "frets": "422000",
        "fingers": "412000"
      },
      {
        "frets": "422003",
        "fingers": "412003"
      },
      {
        "frets": "xx6453",
        "fingers": "004231"
      },
      {
        "frets": "xx6987",
        "fingers": "001432"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m_B",
    "positions": [
      {
        "frets": "x22000",
        "fingers": "012000"
      },
      {
        "frets": "x22003",
        "fingers": "012003"
      },
      {
        "frets": "x22403",
        "fingers": "012403"
      },
      {
        "frets": "x22453",
        "fingers": "011342",
        "barres": 2,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m_Bb",
    "positions": [
      {
        "frets": "x12000",
        "fingers": "012000"
      },
      {
        "frets": "x12003",
        "fingers": "012003"
      },
      {
        "frets": "x12403",
        "fingers": "012403"
      },
      {
        "frets": "xx8987",
        "fingers": "002431"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m_C#",
    "positions": [
      {
        "frets": "x42000",
        "fingers": "031000"
      },
      {
        "frets": "x42003",
        "fingers": "031002"
      },
      {
        "frets": "x42403",
        "fingers": "031402"
      },
      {
        "frets": "9a99cc",
        "fingers": "121144",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m_C",
    "positions": [
      {
        "frets": "x32000",
        "fingers": "021000"
      },
      {
        "frets": "x32003",
        "fingers": "021003"
      },
      {
        "frets": "x32403",
        "fingers": "021403"
      },
      {
        "frets": "x35453",
        "fingers": "013241",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m_D#",
    "positions": [
      {
        "frets": "xx1000",
        "fingers": "001000"
      },
      {
        "frets": "x6545x",
        "fingers": "042130"
      },
      {
        "frets": "x6998x",
        "fingers": "013420"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m_D",
    "positions": [
      {
        "frets": "xx0000",
        "fingers": "000000"
      },
      {
        "frets": "xx0453",
        "fingers": "000231"
      },
      {
        "frets": "xx0987",
        "fingers": "000321"
      },
      {
        "frets": "x5545x",
        "fingers": "023140"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m_Eb",
    "positions": [
      {
        "frets": "xx1000",
        "fingers": "001000"
      },
      {
        "frets": "ba99cc",
        "fingers": "321144",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "ba9ccc",
        "fingers": "321444",
        "barres": 12
      },
      {
        "frets": "x6545x",
        "fingers": "042130"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m_F#",
    "positions": [
      {
        "frets": "222000",
        "fingers": "123000"
      },
      {
        "frets": "222003",
        "fingers": "123004"
      },
      {
        "frets": "222453",
        "fingers": "111342",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4453",
        "fingers": "002341"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m_F",
    "positions": [
      {
        "frets": "122000",
        "fingers": "123000"
      },
      {
        "frets": "122003",
        "fingers": "123004"
      },
      {
        "frets": "xx3000",
        "fingers": "001000"
      },
      {
        "frets": "xx3453",
        "fingers": "001231",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m_G#",
    "positions": [
      {
        "frets": "422000",
        "fingers": "412000"
      },
      {
        "frets": "47545x",
        "fingers": "142130",
        "barres": 4
      },
      {
        "frets": "xx6453",
        "fingers": "004231"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "m_G",
    "positions": [
      {
        "frets": "322000",
        "fingers": "312000"
      },
      {
        "frets": "322003",
        "fingers": "312004"
      },
      {
        "frets": "322400",
        "fingers": "312400"
      },
      {
        "frets": "xx5453",
        "fingers": "003241"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "sus",
    "positions": [
      {
        "frets": "002200",
        "fingers": "001200"
      },
      {
        "frets": "002400",
        "fingers": "001300"
      },
      {
        "frets": "022200",
        "fingers": "012300"
      },
      {
        "frets": "xx2200",
        "fingers": "001200"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "sus2",
    "positions": [
      {
        "frets": "222452",
        "fingers": "111341",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "079977",
        "fingers": "013411",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "099900",
        "fingers": "012300"
      },
      {
        "frets": "ceexce",
        "fingers": "134014",
        "barres": 12,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "sus2sus4",
    "positions": [
      {
        "frets": "002202",
        "fingers": "001203"
      },
      {
        "frets": "022202",
        "fingers": "012304"
      },
      {
        "frets": "x77977",
        "fingers": "011311",
        "barres": [
          7
        ],
        "capo": true
      },
      {
        "frets": "x74455",
        "fingers": "041122",
        "barres": [
          4,
          5
        ]
      }
    ]
  },
  {
    "key": "E",
    "suffix": "sus4",
    "positions": [
      {
        "frets": "022200",
        "fingers": "023400"
      },
      {
        "frets": "022455",
        "fingers": "011234",
        "barres": 2
      },
      {
        "frets": "7799a7",
        "fingers": "112341",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xx99a0",
        "fingers": "001120",
        "barres": 9
      }
    ]
  },
  {
    "key": "E",
    "suffix": "_A",
    "positions": [
      {
        "frets": "x02100",
        "fingers": "002100"
      },
      {
        "frets": "x02104",
        "fingers": "002104"
      },
      {
        "frets": "x02404",
        "fingers": "001304"
      },
      {
        "frets": "x02454",
        "fingers": "001243"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "_Ab",
    "positions": [
      {
        "frets": "476454",
        "fingers": "143121",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "4xx454",
        "fingers": "111121",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx6454",
        "fingers": "003121",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx6457",
        "fingers": "003124"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "_B",
    "positions": [
      {
        "frets": "x22100",
        "fingers": "023100"
      },
      {
        "frets": "x22454",
        "fingers": "011243",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "779997",
        "fingers": "112341",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xx9997",
        "fingers": "002341"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "_Bb",
    "positions": [
      {
        "frets": "x12100",
        "fingers": "013200"
      },
      {
        "frets": "xx8997",
        "fingers": "002341"
      },
      {
        "frets": "x1210x",
        "fingers": "013200"
      },
      {
        "frets": "67999x",
        "fingers": "124440",
        "barres": 9
      }
    ]
  },
  {
    "key": "E",
    "suffix": "_C#",
    "positions": [
      {
        "frets": "x42100",
        "fingers": "042100"
      },
      {
        "frets": "x46454",
        "fingers": "013121",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x46457",
        "fingers": "013124",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "9b999c",
        "fingers": "131114",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "_C",
    "positions": [
      {
        "frets": "x32100",
        "fingers": "032100"
      },
      {
        "frets": "x32104",
        "fingers": "032104"
      },
      {
        "frets": "x32404",
        "fingers": "021304"
      },
      {
        "frets": "xxa997",
        "fingers": "004231"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "_D#",
    "positions": [
      {
        "frets": "xx1100",
        "fingers": "001200"
      },
      {
        "frets": "x66454",
        "fingers": "034121",
        "barres": 4
      },
      {
        "frets": "bb99cc",
        "fingers": "231144",
        "barres": 9
      }
    ]
  },
  {
    "key": "E",
    "suffix": "_D",
    "positions": [
      {
        "frets": "xx0100",
        "fingers": "000100"
      },
      {
        "frets": "xx0454",
        "fingers": "000121",
        "barres": 4
      },
      {
        "frets": "x56454",
        "fingers": "024131",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx0997",
        "fingers": "000341"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "_Eb",
    "positions": [
      {
        "frets": "xx1100",
        "fingers": "001200"
      },
      {
        "frets": "x66454",
        "fingers": "034121",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "bb999c",
        "fingers": "231114",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "bb99cc",
        "fingers": "231144",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "_F#",
    "positions": [
      {
        "frets": "222100",
        "fingers": "234100"
      },
      {
        "frets": "xx4100",
        "fingers": "004100"
      },
      {
        "frets": "222454",
        "fingers": "111243",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4454",
        "fingers": "001121",
        "barres": 4,
        "capo": true
      }
    ]
  },
  {
    "key": "E",
    "suffix": "_F",
    "positions": [
      {
        "frets": "122100",
        "fingers": "134200"
      },
      {
        "frets": "xx3100",
        "fingers": "003100"
      },
      {
        "frets": "xx3454",
        "fingers": "001243"
      },
      {
        "frets": "12210x",
        "fingers": "134200"
      }
    ]
  },
  {
    "key": "E",
    "suffix": "_G#",
    "positions": [
      {
        "frets": "xxx100",
        "fingers": "000100"
      },
      {
        "frets": "422100",
        "fingers": "423100"
      },
      {
        "frets": "476454",
        "fingers": "143121",
        "barres": 4
      },
      {
        "frets": "42245x",
        "fingers": "211340",
        "barres": 2
      }
    ]
  },
  {
    "key": "E",
    "suffix": "_G",
    "positions": [
      {
        "frets": "322100",
        "fingers": "423100"
      },
      {
        "frets": "xx5454",
        "fingers": "002131",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xa999c",
        "fingers": "021114",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "32210x",
        "fingers": "423100"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "11",
    "positions": [
      {
        "frets": "111123",
        "fingers": "111123",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x65644",
        "fingers": "032411",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "066686",
        "fingers": "011131",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bbbcbb",
        "fingers": "111211",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "13",
    "positions": [
      {
        "frets": "x65688",
        "fingers": "021344",
        "barres": 8
      },
      {
        "frets": "666688",
        "fingers": "111134",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "baa099",
        "fingers": "423011",
        "barres": 9
      },
      {
        "frets": "bbbcdd",
        "fingers": "111234",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "5",
    "positions": [
      {
        "frets": "bdxxxx",
        "fingers": "130000"
      },
      {
        "frets": "x68xxx",
        "fingers": "013000"
      },
      {
        "frets": "bddxxx",
        "fingers": "134000"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "6",
    "positions": [
      {
        "frets": "xx1313",
        "fingers": "001314",
        "barres": 1
      },
      {
        "frets": "x6554x",
        "fingers": "042310"
      },
      {
        "frets": "x68888",
        "fingers": "013333",
        "barres": 8
      },
      {
        "frets": "bxacbx",
        "fingers": "201430"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "69",
    "positions": [
      {
        "frets": "xx1011",
        "fingers": "002034"
      },
      {
        "frets": "x33343",
        "fingers": "011121",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x65566",
        "fingers": "021134",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "baaabb",
        "fingers": "211134",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "7#9",
    "positions": [
      {
        "frets": "xx1022",
        "fingers": "002034"
      },
      {
        "frets": "x6567x",
        "fingers": "021340"
      },
      {
        "frets": "x98889",
        "fingers": "021113",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "babbxx",
        "fingers": "213400"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "7",
    "positions": [
      {
        "frets": "xx1323",
        "fingers": "001324"
      },
      {
        "frets": "x68686",
        "fingers": "013141",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx8889",
        "fingers": "001112",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "bdbcbb",
        "fingers": "131211",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "7b5",
    "positions": [
      {
        "frets": "xx1223",
        "fingers": "001234"
      },
      {
        "frets": "xx5645",
        "fingers": "002413"
      },
      {
        "frets": "x67686",
        "fingers": "012130",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bxbcax",
        "fingers": "203410"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "7b9",
    "positions": [
      {
        "frets": "xx1020",
        "fingers": "002040"
      },
      {
        "frets": "x65656",
        "fingers": "021314",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x68680",
        "fingers": "013140",
        "barres": 6
      },
      {
        "frets": "bab9xx",
        "fingers": "324100"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "7sus4",
    "positions": [
      {
        "frets": "xx1324",
        "fingers": "001324"
      },
      {
        "frets": "x66644",
        "fingers": "023411",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "668696",
        "fingers": "113141",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bdbdbb",
        "fingers": "131411",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "9#11",
    "positions": [
      {
        "frets": "xx1223",
        "fingers": "001234"
      },
      {
        "frets": "x65665",
        "fingers": "021341",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x6768x",
        "fingers": "012130",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "babaab",
        "fingers": "213114",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "9",
    "positions": [
      {
        "frets": "xx1021",
        "fingers": "001032"
      },
      {
        "frets": "x65666",
        "fingers": "021334",
        "barres": 6
      },
      {
        "frets": "babaxx",
        "fingers": "314200"
      },
      {
        "frets": "bdbcbd",
        "fingers": "131214",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "9b5",
    "positions": [
      {
        "frets": "x65665",
        "fingers": "021341",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x67069",
        "fingers": "013024"
      },
      {
        "frets": "babaab",
        "fingers": "120304",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "bcbcxd",
        "fingers": "121304",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "add11",
    "positions": [
      {
        "frets": "xx1044",
        "fingers": "001044",
        "barres": 4
      },
      {
        "frets": "x65344",
        "fingers": "043122",
        "barres": 4
      },
      {
        "frets": "ba889x",
        "fingers": "431120",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "baddxx",
        "fingers": "214400",
        "barres": 13
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "add9",
    "positions": [
      {
        "frets": "x65363",
        "fingers": "032141",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x65066",
        "fingers": "021034"
      },
      {
        "frets": "baxabx",
        "fingers": "310240"
      },
      {
        "frets": "xxdcbd",
        "fingers": "003214"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "alt",
    "positions": [
      {
        "frets": "xx1243",
        "fingers": "001243"
      },
      {
        "frets": "x65045",
        "fingers": "042013"
      },
      {
        "frets": "x6708x",
        "fingers": "012030"
      },
      {
        "frets": "baxcab",
        "fingers": "210413",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "aug",
    "positions": [
      {
        "frets": "xx5443",
        "fingers": "004231"
      },
      {
        "frets": "x6544x",
        "fingers": "032110",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "ba988x",
        "fingers": "432110",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "bxdccx",
        "fingers": "104230"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "aug7",
    "positions": [
      {
        "frets": "xx1423",
        "fingers": "001423"
      },
      {
        "frets": "x69687",
        "fingers": "014132",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bab009",
        "fingers": "324001"
      },
      {
        "frets": "bxbccx",
        "fingers": "102340"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "aug9",
    "positions": [
      {
        "frets": "343443",
        "fingers": "121341",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x65667",
        "fingers": "021334",
        "barres": 6
      },
      {
        "frets": "baxa09",
        "fingers": "420301"
      },
      {
        "frets": "babacx",
        "fingers": "213140",
        "barres": 10
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "dim",
    "positions": [
      {
        "frets": "xx12x2",
        "fingers": "001203"
      },
      {
        "frets": "x64x45",
        "fingers": "041023"
      },
      {
        "frets": "x6787x",
        "fingers": "012430"
      },
      {
        "frets": "b9xbax",
        "fingers": "310420"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "dim7",
    "positions": [
      {
        "frets": "xx1212",
        "fingers": "001324"
      },
      {
        "frets": "x67575",
        "fingers": "023141",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx7878",
        "fingers": "001324"
      },
      {
        "frets": "bxabax",
        "fingers": "201310",
        "barres": 10
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m11",
    "positions": [
      {
        "frets": "xx1122",
        "fingers": "001134",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x64664",
        "fingers": "021341",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "b9ba99",
        "fingers": "314211",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "bbbbbd",
        "fingers": "111114",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m6",
    "positions": [
      {
        "frets": "x11312",
        "fingers": "011312",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x64546",
        "fingers": "031214",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx8878",
        "fingers": "002314"
      },
      {
        "frets": "bddbdb",
        "fingers": "123141",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m69",
    "positions": [
      {
        "frets": "2x1311",
        "fingers": "201311",
        "barres": 1
      },
      {
        "frets": "x6456x",
        "fingers": "031240"
      },
      {
        "frets": "b9aa99",
        "fingers": "412300",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xxdbdd",
        "fingers": "002134"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m7",
    "positions": [
      {
        "frets": "bxbbbx",
        "fingers": "203330"
      },
      {
        "frets": "xx1322",
        "fingers": "001423"
      },
      {
        "frets": "668676",
        "fingers": "113121",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx8879",
        "fingers": "002314"
      },
      {
        "frets": "bdbbbb",
        "fingers": "141111",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m7b5",
    "positions": [
      {
        "frets": "xx1222",
        "fingers": "001222",
        "barres": 2
      },
      {
        "frets": "x6767x",
        "fingers": "013240"
      },
      {
        "frets": "xx7879",
        "fingers": "001214",
        "barres": 7
      },
      {
        "frets": "bxbbax",
        "fingers": "203410"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m9",
    "positions": [
      {
        "frets": "x64666",
        "fingers": "021344",
        "barres": 6
      },
      {
        "frets": "xx8a79",
        "fingers": "002413"
      },
      {
        "frets": "x9babb",
        "fingers": "013244",
        "barres": 11
      },
      {
        "frets": "bdbbbd",
        "fingers": "131114",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m9_C#",
    "positions": [
      {
        "frets": "x41321",
        "fingers": "041321",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "968666",
        "fingers": "413111",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "968866",
        "fingers": "412311",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "96866x",
        "fingers": "413110",
        "barres": 6,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m9_F#",
    "positions": [
      {
        "frets": "211321",
        "fingers": "211431",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "2x1321",
        "fingers": "201431",
        "barres": 1,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "madd9",
    "positions": [
      {
        "frets": "xx4341",
        "fingers": "003241"
      },
      {
        "frets": "x6436x",
        "fingers": "032140"
      },
      {
        "frets": "x64x66",
        "fingers": "021034"
      },
      {
        "frets": "xxdbbd",
        "fingers": "003114",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "maj11",
    "positions": [
      {
        "frets": "xx1133",
        "fingers": "001134",
        "barres": 1
      },
      {
        "frets": "x65744",
        "fingers": "032411",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "666786",
        "fingers": "111231",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bbccbb",
        "fingers": "112311",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "maj13",
    "positions": [
      {
        "frets": "x3103x",
        "fingers": "031040"
      },
      {
        "frets": "x65533",
        "fingers": "042311",
        "barres": 3
      },
      {
        "frets": "x66788",
        "fingers": "011234",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "baaaba",
        "fingers": "211131",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "maj7#5",
    "positions": [
      {
        "frets": "365433",
        "fingers": "143211",
        "barres": 3
      },
      {
        "frets": "x657x7",
        "fingers": "021304"
      },
      {
        "frets": "x6978x",
        "fingers": "014230"
      },
      {
        "frets": "bxcccb",
        "fingers": "102341",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "maj7",
    "positions": [
      {
        "frets": "x11333",
        "fingers": "011333",
        "barres": [
          1,
          3
        ],
        "capo": true
      },
      {
        "frets": "x65333",
        "fingers": "043111",
        "barres": 3
      },
      {
        "frets": "668786",
        "fingers": "113241",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx888a",
        "fingers": "001114",
        "barres": 8
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "maj7b5",
    "positions": [
      {
        "frets": "xx1233",
        "fingers": "001234"
      },
      {
        "frets": "x67786",
        "fingers": "012240",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "baccaa",
        "fingers": "213411",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "bcccxb",
        "fingers": "122201",
        "barres": [
          11,
          12
        ],
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "maj7sus2",
    "positions": [
      {
        "frets": "xx1331",
        "fingers": "001341",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x68766",
        "fingers": "013211",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xxdaba",
        "fingers": "004121",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "x6333x",
        "fingers": "041110",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "maj9",
    "positions": [
      {
        "frets": "x63333",
        "fingers": "041111",
        "barres": 3
      },
      {
        "frets": "x6576x",
        "fingers": "021430"
      },
      {
        "frets": "x8888a",
        "fingers": "011114",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxccbd",
        "fingers": "002314"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "major",
    "positions": [
      {
        "frets": "xx1343",
        "fingers": "001243"
      },
      {
        "frets": "x65343",
        "fingers": "043121",
        "barres": 3
      },
      {
        "frets": "x68886",
        "fingers": "012341",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx888b",
        "fingers": "001114",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "minor",
    "positions": [
      {
        "frets": "xx1342",
        "fingers": "001342"
      },
      {
        "frets": "xx4342",
        "fingers": "003241"
      },
      {
        "frets": "668876",
        "fingers": "113421",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bddbbb",
        "fingers": "134111",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "mmaj11",
    "positions": [
      {
        "frets": "x11132",
        "fingers": "011132",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x64764",
        "fingers": "031431",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "666776",
        "fingers": "111231",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bbcbbd",
        "fingers": "112114",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "mmaj7",
    "positions": [
      {
        "frets": "xx1332",
        "fingers": "001342"
      },
      {
        "frets": "x6433x",
        "fingers": "043120"
      },
      {
        "frets": "x68776",
        "fingers": "014231",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bdcbbb",
        "fingers": "132111",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "mmaj7b5",
    "positions": [
      {
        "frets": "xx1232",
        "fingers": "001243"
      },
      {
        "frets": "56777x",
        "fingers": "123330",
        "barres": 7
      },
      {
        "frets": "x6777x",
        "fingers": "012340"
      },
      {
        "frets": "bccbxb",
        "fingers": "122101",
        "barres": [
          11,
          12
        ],
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "mmaj9",
    "positions": [
      {
        "frets": "x6476x",
        "fingers": "021430"
      },
      {
        "frets": "698766",
        "fingers": "143211",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "b9caxx",
        "fingers": "314200"
      },
      {
        "frets": "bdcbbd",
        "fingers": "132114",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m_A",
    "positions": [
      {
        "frets": "x01342",
        "fingers": "001342"
      },
      {
        "frets": "x04342",
        "fingers": "003241"
      },
      {
        "frets": "x08876",
        "fingers": "003421"
      },
      {
        "frets": "xx7876",
        "fingers": "002431"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m_Ab",
    "positions": [
      {
        "frets": "xx6876",
        "fingers": "001321",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xbdbbb",
        "fingers": "013111",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "xbdbbe",
        "fingers": "013114",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "xbdbbx",
        "fingers": "013110",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m_B",
    "positions": [
      {
        "frets": "x24342",
        "fingers": "013241",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx9876",
        "fingers": "004321"
      },
      {
        "frets": "xx9bbb",
        "fingers": "001333",
        "barres": 11
      },
      {
        "frets": "xedbbb",
        "fingers": "043111",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m_Bb",
    "positions": [
      {
        "frets": "x11342",
        "fingers": "011342",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "668876",
        "fingers": "113421",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx8876",
        "fingers": "003421"
      },
      {
        "frets": "xx8bbb",
        "fingers": "001444",
        "barres": 11
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m_C#",
    "positions": [
      {
        "frets": "xxbbbb",
        "fingers": "001111",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "x4434x",
        "fingers": "023140"
      },
      {
        "frets": "9988xx",
        "fingers": "231100",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "x4x342",
        "fingers": "030241"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m_C",
    "positions": [
      {
        "frets": "8988bb",
        "fingers": "121144",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "898bbb",
        "fingers": "121444",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxabbb",
        "fingers": "001222",
        "barres": 11
      },
      {
        "frets": "x3434x",
        "fingers": "012130",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m_D",
    "positions": [
      {
        "frets": "xx0342",
        "fingers": "000231"
      },
      {
        "frets": "xx0876",
        "fingers": "000321"
      },
      {
        "frets": "a988bb",
        "fingers": "321144",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "a98bbb",
        "fingers": "321444",
        "barres": 11
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m_E",
    "positions": [
      {
        "frets": "011342",
        "fingers": "011342",
        "barres": 1
      },
      {
        "frets": "xx2342",
        "fingers": "001231",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "068876",
        "fingers": "013421",
        "barres": 6
      },
      {
        "frets": "0988bb",
        "fingers": "021144",
        "barres": 8
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m_F#",
    "positions": [
      {
        "frets": "xx4342",
        "fingers": "003241"
      },
      {
        "frets": "x988bb",
        "fingers": "021144",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "x98bbb",
        "fingers": "021444",
        "barres": 11
      },
      {
        "frets": "eddbbb",
        "fingers": "423111",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m_F",
    "positions": [
      {
        "frets": "111342",
        "fingers": "111342",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3342",
        "fingers": "002341"
      },
      {
        "frets": "x88bbb",
        "fingers": "011444",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "dddbbb",
        "fingers": "234111",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "m_G",
    "positions": [
      {
        "frets": "xx5342",
        "fingers": "004231"
      },
      {
        "frets": "xx5876",
        "fingers": "001432"
      },
      {
        "frets": "xa8bbb",
        "fingers": "031444",
        "barres": 11
      },
      {
        "frets": "3643xx",
        "fingers": "142100",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "sus",
    "positions": [
      {
        "frets": "xx1344",
        "fingers": "001344",
        "barres": 4
      },
      {
        "frets": "x66896",
        "fingers": "011341",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x68896",
        "fingers": "012341",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bbddbb",
        "fingers": "113411",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "sus2",
    "positions": [
      {
        "frets": "111341",
        "fingers": "111341",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "668866",
        "fingers": "113411",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "b88abx",
        "fingers": "311240",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "bddxbd",
        "fingers": "123014",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "sus2sus4",
    "positions": [
      {
        "frets": "x66866",
        "fingers": "011311",
        "barres": [
          6
        ],
        "capo": true
      },
      {
        "frets": "x63344",
        "fingers": "041122",
        "barres": [
          3,
          4
        ]
      },
      {
        "frets": "bbddbd",
        "fingers": "112314",
        "barres": [
          11
        ],
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "sus4",
    "positions": [
      {
        "frets": "xx1344",
        "fingers": "001234"
      },
      {
        "frets": "668896",
        "fingers": "112341",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx889x",
        "fingers": "001120",
        "barres": 8
      },
      {
        "frets": "bdddbb",
        "fingers": "123411",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "_A",
    "positions": [
      {
        "frets": "x01343",
        "fingers": "001243"
      },
      {
        "frets": "x05343",
        "fingers": "003121",
        "barres": 3
      },
      {
        "frets": "x05346",
        "fingers": "003124"
      },
      {
        "frets": "x08886",
        "fingers": "002341"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "_Ab",
    "positions": [
      {
        "frets": "xx6343",
        "fingers": "004121",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx6886",
        "fingers": "001341",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xbdcbb",
        "fingers": "013211",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "xb888x",
        "fingers": "041110",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "_B",
    "positions": [
      {
        "frets": "xx9886",
        "fingers": "004231"
      },
      {
        "frets": "xx9cbb",
        "fingers": "001423"
      },
      {
        "frets": "xedcbb",
        "fingers": "043211",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "x2534x",
        "fingers": "014230"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "_Bb",
    "positions": [
      {
        "frets": "x11343",
        "fingers": "011243",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "668886",
        "fingers": "112341",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx8886",
        "fingers": "002341"
      },
      {
        "frets": "xx888b",
        "fingers": "001114",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "_C#",
    "positions": [
      {
        "frets": "x45343",
        "fingers": "024131",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "9a888b",
        "fingers": "231114",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "9a88bb",
        "fingers": "231144",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxbcbb",
        "fingers": "001211",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "_C",
    "positions": [
      {
        "frets": "x35343",
        "fingers": "013121",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x35346",
        "fingers": "013124",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "8a888b",
        "fingers": "131114",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "8a88bb",
        "fingers": "131144",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "_D",
    "positions": [
      {
        "frets": "xx0343",
        "fingers": "000121",
        "barres": 3
      },
      {
        "frets": "x55343",
        "fingers": "034121",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx0886",
        "fingers": "000341"
      },
      {
        "frets": "aa888b",
        "fingers": "231114",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "_E",
    "positions": [
      {
        "frets": "011343",
        "fingers": "011243",
        "barres": 1
      },
      {
        "frets": "xx2343",
        "fingers": "001243"
      },
      {
        "frets": "065343",
        "fingers": "043121",
        "barres": 3
      },
      {
        "frets": "068886",
        "fingers": "012341",
        "barres": 6
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "_F#",
    "positions": [
      {
        "frets": "xx4343",
        "fingers": "002131",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x9888b",
        "fingers": "021114",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "x9888x",
        "fingers": "021110",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "2110xx",
        "fingers": "312000"
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "_F",
    "positions": [
      {
        "frets": "111343",
        "fingers": "111243",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3343",
        "fingers": "001121",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x8888b",
        "fingers": "011114",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "x8888x",
        "fingers": "011110",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "Eb",
    "suffix": "_G",
    "positions": [
      {
        "frets": "365343",
        "fingers": "143121",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "3xx343",
        "fingers": "111121",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5343",
        "fingers": "003121",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5346",
        "fingers": "003124"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "11",
    "positions": [
      {
        "frets": "111211",
        "fingers": "111211",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "333345",
        "fingers": "111123",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x87866",
        "fingers": "032411",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x888a8",
        "fingers": "011131",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "13",
    "positions": [
      {
        "frets": "131231",
        "fingers": "131241",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "111233",
        "fingers": "111234",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x878aa",
        "fingers": "021344",
        "barres": 10
      },
      {
        "frets": "8888aa",
        "fingers": "111134",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "5",
    "positions": [
      {
        "frets": "13xxxx",
        "fingers": "130000"
      },
      {
        "frets": "x8axxx",
        "fingers": "013000"
      },
      {
        "frets": "133xxx",
        "fingers": "134000"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "6",
    "positions": [
      {
        "frets": "1x3231",
        "fingers": "103241",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x33535",
        "fingers": "011314",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x8776x",
        "fingers": "042310"
      },
      {
        "frets": "88aaaa",
        "fingers": "113333",
        "barres": [
          8,
          10
        ]
      }
    ]
  },
  {
    "key": "F",
    "suffix": "69",
    "positions": [
      {
        "frets": "100011",
        "fingers": "100023"
      },
      {
        "frets": "xx3233",
        "fingers": "002134"
      },
      {
        "frets": "x55565",
        "fingers": "011121",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x87788",
        "fingers": "021134",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "7#9",
    "positions": [
      {
        "frets": "131214",
        "fingers": "131214",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3244",
        "fingers": "002134"
      },
      {
        "frets": "x8789x",
        "fingers": "021340"
      },
      {
        "frets": "xbaaab",
        "fingers": "021113",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "7",
    "positions": [
      {
        "frets": "131211",
        "fingers": "131211",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x33545",
        "fingers": "011324",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "88a8a8",
        "fingers": "113141",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxaaab",
        "fingers": "001112",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "7b5",
    "positions": [
      {
        "frets": "101201",
        "fingers": "102403"
      },
      {
        "frets": "xx3445",
        "fingers": "001234"
      },
      {
        "frets": "xx7867",
        "fingers": "002413"
      },
      {
        "frets": "x898ax",
        "fingers": "012130",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "7b9",
    "positions": [
      {
        "frets": "131212",
        "fingers": "141213",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3242",
        "fingers": "002131",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x87878",
        "fingers": "021314",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "dcdbxx",
        "fingers": "324100"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "7sus4",
    "positions": [
      {
        "frets": "131311",
        "fingers": "131411",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "688866",
        "fingers": "123411",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "88a8b8",
        "fingers": "113141",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxaabb",
        "fingers": "001134",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "9#11",
    "positions": [
      {
        "frets": "101001",
        "fingers": "102003"
      },
      {
        "frets": "xx3445",
        "fingers": "001234"
      },
      {
        "frets": "x87887",
        "fingers": "021341",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "x898a8",
        "fingers": "012131",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "9",
    "positions": [
      {
        "frets": "131213",
        "fingers": "131214",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3243",
        "fingers": "002143"
      },
      {
        "frets": "887888",
        "fingers": "221334",
        "barres": 8
      },
      {
        "frets": "xaaaab",
        "fingers": "011112",
        "barres": 10
      }
    ]
  },
  {
    "key": "F",
    "suffix": "9b5",
    "positions": [
      {
        "frets": "101001",
        "fingers": "102003"
      },
      {
        "frets": "x87887",
        "fingers": "021341",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "x890ab",
        "fingers": "012034"
      },
      {
        "frets": "dcd00d",
        "fingers": "212003",
        "barres": 13
      }
    ]
  },
  {
    "key": "F",
    "suffix": "add11",
    "positions": [
      {
        "frets": "x87566",
        "fingers": "043122",
        "barres": 6
      },
      {
        "frets": "dcaabx",
        "fingers": "431120",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "add9",
    "positions": [
      {
        "frets": "xx3213",
        "fingers": "003214"
      },
      {
        "frets": "xx3065",
        "fingers": "001043"
      },
      {
        "frets": "x87585",
        "fingers": "032141",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x87088",
        "fingers": "021034"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "alt",
    "positions": [
      {
        "frets": "12320x",
        "fingers": "124300"
      },
      {
        "frets": "xx3405",
        "fingers": "001203"
      },
      {
        "frets": "x89aax",
        "fingers": "012340"
      },
      {
        "frets": "dcxecd",
        "fingers": "210413",
        "barres": 12,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "aug",
    "positions": [
      {
        "frets": "xx3221",
        "fingers": "004231"
      },
      {
        "frets": "x8766x",
        "fingers": "032110",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x8xaa9",
        "fingers": "010342"
      },
      {
        "frets": "dcbaax",
        "fingers": "432110",
        "barres": 10
      }
    ]
  },
  {
    "key": "F",
    "suffix": "aug7",
    "positions": [
      {
        "frets": "10122x",
        "fingers": "102340"
      },
      {
        "frets": "xx3645",
        "fingers": "001423"
      },
      {
        "frets": "x8b8a9",
        "fingers": "014132",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "dcdxex",
        "fingers": "213040"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "aug9",
    "positions": [
      {
        "frets": "101021",
        "fingers": "102043"
      },
      {
        "frets": "565665",
        "fingers": "121341",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x87889",
        "fingers": "021334",
        "barres": 8
      },
      {
        "frets": "dcdcex",
        "fingers": "213140",
        "barres": 12,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "dim",
    "positions": [
      {
        "frets": "xx34x4",
        "fingers": "001203"
      },
      {
        "frets": "x86x67",
        "fingers": "041023"
      },
      {
        "frets": "x89a9x",
        "fingers": "012430"
      },
      {
        "frets": "dbxdcx",
        "fingers": "310420"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "dim7",
    "positions": [
      {
        "frets": "1x0101",
        "fingers": "100203"
      },
      {
        "frets": "xx3434",
        "fingers": "001314",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "789797",
        "fingers": "123141",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "dxcdcx",
        "fingers": "301420"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m11",
    "positions": [
      {
        "frets": "111113",
        "fingers": "111114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3344",
        "fingers": "001123",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x86886",
        "fingers": "021341",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "dbdcbb",
        "fingers": "314211",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m6",
    "positions": [
      {
        "frets": "1x0111",
        "fingers": "100234"
      },
      {
        "frets": "xx3534",
        "fingers": "001312",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x86768",
        "fingers": "031214",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xxaa9a",
        "fingers": "002314"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m69",
    "positions": [
      {
        "frets": "133133",
        "fingers": "122134",
        "barres": [
          1,
          3
        ],
        "capo": true
      },
      {
        "frets": "4x3533",
        "fingers": "201311",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x8678x",
        "fingers": "031240"
      },
      {
        "frets": "dbc0dx",
        "fingers": "312040"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m7",
    "positions": [
      {
        "frets": "1x111x",
        "fingers": "203330"
      },
      {
        "frets": "dxdddx",
        "fingers": "203330"
      },
      {
        "frets": "131111",
        "fingers": "131111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3544",
        "fingers": "001423"
      },
      {
        "frets": "88a898",
        "fingers": "113121",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxaa9b",
        "fingers": "002314"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m7b5",
    "positions": [
      {
        "frets": "1x110x",
        "fingers": "102300"
      },
      {
        "frets": "xx3444",
        "fingers": "001222",
        "barres": 4
      },
      {
        "frets": "x8989x",
        "fingers": "013240"
      },
      {
        "frets": "dbdd0x",
        "fingers": "213400"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m9",
    "positions": [
      {
        "frets": "131113",
        "fingers": "131114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x33044",
        "fingers": "012034"
      },
      {
        "frets": "x86888",
        "fingers": "021344",
        "barres": 8
      },
      {
        "frets": "dbd0dd",
        "fingers": "213044",
        "barres": 13
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m9_Ab",
    "positions": [
      {
        "frets": "433543",
        "fingers": "211431",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "4x3543",
        "fingers": "201431",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m9_Eb",
    "positions": [
      {
        "frets": "x63543",
        "fingers": "041321",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "b8a888",
        "fingers": "413111",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "b8aa88",
        "fingers": "412311",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "b8a88x",
        "fingers": "413110",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "madd9",
    "positions": [
      {
        "frets": "xx3113",
        "fingers": "003114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x8658x",
        "fingers": "032140"
      },
      {
        "frets": "x86068",
        "fingers": "031024"
      },
      {
        "frets": "x8a098",
        "fingers": "014032"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "maj11",
    "positions": [
      {
        "frets": "112211",
        "fingers": "112311",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3355",
        "fingers": "001134",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "8889a8",
        "fingers": "111231",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "dce0b0",
        "fingers": "324010"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "maj13",
    "positions": [
      {
        "frets": "100010",
        "fingers": "100020"
      },
      {
        "frets": "xx3230",
        "fingers": "002130"
      },
      {
        "frets": "x87755",
        "fingers": "042311",
        "barres": 5
      },
      {
        "frets": "x889aa",
        "fingers": "011234",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "maj7#5",
    "positions": [
      {
        "frets": "102220",
        "fingers": "102340"
      },
      {
        "frets": "587655",
        "fingers": "143211",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x8b9ax",
        "fingers": "014230"
      },
      {
        "frets": "xxfeec",
        "fingers": "004231"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "maj7",
    "positions": [
      {
        "frets": "xx3210",
        "fingers": "003210"
      },
      {
        "frets": "132211",
        "fingers": "142311",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x33555",
        "fingers": "011333",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "88a9a8",
        "fingers": "113241",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "maj7b5",
    "positions": [
      {
        "frets": "102200",
        "fingers": "102300"
      },
      {
        "frets": "xx3455",
        "fingers": "001234"
      },
      {
        "frets": "x899ax",
        "fingers": "012340"
      },
      {
        "frets": "dceecc",
        "fingers": "213411",
        "barres": 12,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "maj7sus2",
    "positions": [
      {
        "frets": "xx3010",
        "fingers": "003010"
      },
      {
        "frets": "xx3553",
        "fingers": "001341",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x8a988",
        "fingers": "013211",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "x8555x",
        "fingers": "041110",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "maj9",
    "positions": [
      {
        "frets": "102010",
        "fingers": "103020"
      },
      {
        "frets": "xx2213",
        "fingers": "002314"
      },
      {
        "frets": "x8798x",
        "fingers": "021430"
      },
      {
        "frets": "xxacac",
        "fingers": "001314",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "major",
    "positions": [
      {
        "frets": "133211",
        "fingers": "134211",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3211",
        "fingers": "xx3211",
        "barres": 1
      },
      {
        "frets": "xx3565",
        "fingers": "001243"
      },
      {
        "frets": "x87565",
        "fingers": "043121",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x8aaa8",
        "fingers": "012341",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "minor",
    "positions": [
      {
        "frets": "133111",
        "fingers": "134111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3564",
        "fingers": "001342"
      },
      {
        "frets": "x8aa98",
        "fingers": "013421",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "dbaaxx",
        "fingers": "421100",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "mmaj11",
    "positions": [
      {
        "frets": "112113",
        "fingers": "112114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x33354",
        "fingers": "011132",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x86986",
        "fingers": "021431",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "888998",
        "fingers": "111231",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "mmaj7",
    "positions": [
      {
        "frets": "132111",
        "fingers": "132111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3554",
        "fingers": "001342"
      },
      {
        "frets": "88a998",
        "fingers": "114231",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxfddc",
        "fingers": "004231"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "mmaj7b5",
    "positions": [
      {
        "frets": "122100",
        "fingers": "123100",
        "barres": 1
      },
      {
        "frets": "xx3454",
        "fingers": "001243"
      },
      {
        "frets": "78999x",
        "fingers": "123330",
        "barres": 9
      },
      {
        "frets": "x8999x",
        "fingers": "012340"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "mmaj9",
    "positions": [
      {
        "frets": "132113",
        "fingers": "132114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3054",
        "fingers": "001042"
      },
      {
        "frets": "x8698x",
        "fingers": "021430"
      },
      {
        "frets": "dbxcd0",
        "fingers": "310240"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m_A",
    "positions": [
      {
        "frets": "x03111",
        "fingers": "003111",
        "barres": 1
      },
      {
        "frets": "x03114",
        "fingers": "003114",
        "barres": 1
      },
      {
        "frets": "x03564",
        "fingers": "001342"
      },
      {
        "frets": "x06564",
        "fingers": "003241"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m_Ab",
    "positions": [
      {
        "frets": "433111",
        "fingers": "423111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx6564",
        "fingers": "003241"
      },
      {
        "frets": "xbaadd",
        "fingers": "021144",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "xbaddd",
        "fingers": "021444",
        "barres": 13
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m_B",
    "positions": [
      {
        "frets": "x23111",
        "fingers": "023111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x23114",
        "fingers": "023114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx9a98",
        "fingers": "002431"
      },
      {
        "frets": "x2311x",
        "fingers": "023110",
        "barres": 1,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m_Bb",
    "positions": [
      {
        "frets": "x13111",
        "fingers": "013111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x13114",
        "fingers": "013114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx8a98",
        "fingers": "001321",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "x1311x",
        "fingers": "013110",
        "barres": 1,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m_C#",
    "positions": [
      {
        "frets": "x43111",
        "fingers": "043111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x46564",
        "fingers": "013241",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xxba98",
        "fingers": "004321"
      },
      {
        "frets": "xxbddd",
        "fingers": "001333",
        "barres": 13
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m_C",
    "positions": [
      {
        "frets": "x33111",
        "fingers": "034111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x33114",
        "fingers": "023114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x33564",
        "fingers": "011342",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "88aa98",
        "fingers": "113421",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m_D",
    "positions": [
      {
        "frets": "xx0111",
        "fingers": "000111",
        "barres": 1
      },
      {
        "frets": "xx0564",
        "fingers": "000231"
      },
      {
        "frets": "xx0a98",
        "fingers": "000321"
      },
      {
        "frets": "abaadd",
        "fingers": "121144",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m_E",
    "positions": [
      {
        "frets": "033111",
        "fingers": "034111",
        "barres": 1
      },
      {
        "frets": "033114",
        "fingers": "023114",
        "barres": 1
      },
      {
        "frets": "xx2111",
        "fingers": "002111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "033564",
        "fingers": "011342",
        "barres": 3
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m_Eb",
    "positions": [
      {
        "frets": "xx1111",
        "fingers": "001111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x6656x",
        "fingers": "023140"
      },
      {
        "frets": "bbaaxx",
        "fingers": "231100",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "x6x564",
        "fingers": "030241"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m_F#",
    "positions": [
      {
        "frets": "233111",
        "fingers": "234111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx4111",
        "fingers": "004111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx4564",
        "fingers": "001231",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "23311x",
        "fingers": "234110",
        "barres": 1,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "m_G",
    "positions": [
      {
        "frets": "333111",
        "fingers": "234111",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "333564",
        "fingers": "111342",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5564",
        "fingers": "002341"
      },
      {
        "frets": "xaaddd",
        "fingers": "011444",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "sus",
    "positions": [
      {
        "frets": "113311",
        "fingers": "113411",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "133311",
        "fingers": "123411",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3311",
        "fingers": "003411",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3566",
        "fingers": "001344",
        "barres": 6
      }
    ]
  },
  {
    "key": "F",
    "suffix": "sus2",
    "positions": [
      {
        "frets": "133x13",
        "fingers": "123014",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "333563",
        "fingers": "111341",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "88aa88",
        "fingers": "113411",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "daacdx",
        "fingers": "311240",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "sus2sus4",
    "positions": [
      {
        "frets": "113313",
        "fingers": "112314",
        "barres": [
          1
        ]
      },
      {
        "frets": "x88a88",
        "fingers": "011311",
        "barres": [
          8
        ]
      },
      {
        "frets": "x85566",
        "fingers": "041122",
        "barres": [
          5,
          6
        ]
      }
    ]
  },
  {
    "key": "F",
    "suffix": "sus4",
    "positions": [
      {
        "frets": "133311",
        "fingers": "123411",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx3566",
        "fingers": "001234"
      },
      {
        "frets": "88aab8",
        "fingers": "112341",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxaabx",
        "fingers": "001120",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "_A",
    "positions": [
      {
        "frets": "x03211",
        "fingers": "003211",
        "barres": 1
      },
      {
        "frets": "x03565",
        "fingers": "001243"
      },
      {
        "frets": "x07565",
        "fingers": "003121",
        "barres": 5
      },
      {
        "frets": "x07568",
        "fingers": "003124"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "_Ab",
    "positions": [
      {
        "frets": "403211",
        "fingers": "403211",
        "barres": 1
      },
      {
        "frets": "xx6565",
        "fingers": "002131",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xbaaad",
        "fingers": "021114",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "40321x",
        "fingers": "403210"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "_B",
    "positions": [
      {
        "frets": "x23211",
        "fingers": "024311",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx9aa8",
        "fingers": "002341"
      },
      {
        "frets": "x2321x",
        "fingers": "024310"
      },
      {
        "frets": "78aaax",
        "fingers": "124440",
        "barres": 10
      }
    ]
  },
  {
    "key": "F",
    "suffix": "_Bb",
    "positions": [
      {
        "frets": "x13211",
        "fingers": "013211",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx8565",
        "fingers": "004121",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xx8aa8",
        "fingers": "001341",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "x1321x",
        "fingers": "013210",
        "barres": 1,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "_C#",
    "positions": [
      {
        "frets": "x43211",
        "fingers": "043211",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xxbaa8",
        "fingers": "004231"
      },
      {
        "frets": "xxbedd",
        "fingers": "001423"
      },
      {
        "frets": "x4321x",
        "fingers": "043210"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "_C",
    "positions": [
      {
        "frets": "x33211",
        "fingers": "034211",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x33565",
        "fingers": "011243",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "88aaa8",
        "fingers": "112341",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xxaaa8",
        "fingers": "002341"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "_D#",
    "positions": [
      {
        "frets": "xx1211",
        "fingers": "001211",
        "barres": 1
      },
      {
        "frets": "x67565",
        "fingers": "024131",
        "barres": 5
      },
      {
        "frets": "x63565",
        "fingers": "031242",
        "barres": 5
      }
    ]
  },
  {
    "key": "F",
    "suffix": "_D",
    "positions": [
      {
        "frets": "xx0211",
        "fingers": "000211",
        "barres": 1
      },
      {
        "frets": "xx0565",
        "fingers": "000121",
        "barres": 5
      },
      {
        "frets": "x57565",
        "fingers": "013121",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "x57568",
        "fingers": "013124",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "_E",
    "positions": [
      {
        "frets": "003211",
        "fingers": "003211",
        "barres": 1
      },
      {
        "frets": "033211",
        "fingers": "034211",
        "barres": 1
      },
      {
        "frets": "xx2211",
        "fingers": "002311",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "033565",
        "fingers": "011243",
        "barres": 3
      }
    ]
  },
  {
    "key": "F",
    "suffix": "_Eb",
    "positions": [
      {
        "frets": "xx1211",
        "fingers": "001211",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x67565",
        "fingers": "024131",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "bcaaad",
        "fingers": "231114",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "bcaadd",
        "fingers": "231144",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "F",
    "suffix": "_F#",
    "positions": [
      {
        "frets": "203211",
        "fingers": "204311",
        "barres": 1
      },
      {
        "frets": "xx4211",
        "fingers": "004211",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx4565",
        "fingers": "001243"
      },
      {
        "frets": "20321x",
        "fingers": "204310"
      }
    ]
  },
  {
    "key": "F",
    "suffix": "_G",
    "positions": [
      {
        "frets": "303211",
        "fingers": "304211",
        "barres": 1
      },
      {
        "frets": "333565",
        "fingers": "111243",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5565",
        "fingers": "001121",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xaaaad",
        "fingers": "011114",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "11",
    "positions": [
      {
        "frets": "212100",
        "fingers": "314200"
      },
      {
        "frets": "444456",
        "fingers": "111123",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x98977",
        "fingers": "032411",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "x999b9",
        "fingers": "011131",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "13",
    "positions": [
      {
        "frets": "221300",
        "fingers": "231400"
      },
      {
        "frets": "222344",
        "fingers": "111234",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x98870",
        "fingers": "042310"
      },
      {
        "frets": "9999bb",
        "fingers": "111134",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "5",
    "positions": [
      {
        "frets": "24xxxx",
        "fingers": "130000"
      },
      {
        "frets": "x9bxxx",
        "fingers": "013000"
      },
      {
        "frets": "244xxx",
        "fingers": "134000"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "6",
    "positions": [
      {
        "frets": "2x132x",
        "fingers": "201430"
      },
      {
        "frets": "2x4342",
        "fingers": "103241",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x44646",
        "fingers": "011314",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x9bbbb",
        "fingers": "013333",
        "barres": 11
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "69",
    "positions": [
      {
        "frets": "211122",
        "fingers": "211134",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx4344",
        "fingers": "002134"
      },
      {
        "frets": "x66676",
        "fingers": "011121",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x98899",
        "fingers": "021134",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "7#9",
    "positions": [
      {
        "frets": "212222",
        "fingers": "213334",
        "barres": 2
      },
      {
        "frets": "242325",
        "fingers": "131214",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4355",
        "fingers": "002134"
      },
      {
        "frets": "x989ax",
        "fingers": "021340"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "7",
    "positions": [
      {
        "frets": "242322",
        "fingers": "131211",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x44656",
        "fingers": "011324",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x9897x",
        "fingers": "032410"
      },
      {
        "frets": "99b9b9",
        "fingers": "113141",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "7b5",
    "positions": [
      {
        "frets": "2x231x",
        "fingers": "203410"
      },
      {
        "frets": "xx4556",
        "fingers": "001234"
      },
      {
        "frets": "x78978",
        "fingers": "012413",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "x9a9b0",
        "fingers": "012130",
        "barres": 9
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "7b9",
    "positions": [
      {
        "frets": "212020",
        "fingers": "213040"
      },
      {
        "frets": "xx4353",
        "fingers": "002131",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x98989",
        "fingers": "021314",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "edecxx",
        "fingers": "324100"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "7sus4",
    "positions": [
      {
        "frets": "242422",
        "fingers": "131411",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4657",
        "fingers": "001324"
      },
      {
        "frets": "x99977",
        "fingers": "023411",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "99b9c9",
        "fingers": "113141",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "9#11",
    "positions": [
      {
        "frets": "212112",
        "fingers": "213114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx4556",
        "fingers": "001234"
      },
      {
        "frets": "x98998",
        "fingers": "021341",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "x9a9b9",
        "fingers": "012131",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "9",
    "positions": [
      {
        "frets": "242324",
        "fingers": "131214",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4354",
        "fingers": "002143"
      },
      {
        "frets": "998999",
        "fingers": "221334",
        "barres": 9
      },
      {
        "frets": "xbbbbc",
        "fingers": "011112",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "9b5",
    "positions": [
      {
        "frets": "212112",
        "fingers": "213114",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "212110",
        "fingers": "213110",
        "barres": 1
      },
      {
        "frets": "x34354",
        "fingers": "012143",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x98998",
        "fingers": "021341",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "add11",
    "positions": [
      {
        "frets": "x98677",
        "fingers": "043122",
        "barres": 7
      },
      {
        "frets": "21430x",
        "fingers": "214300"
      },
      {
        "frets": "24430x",
        "fingers": "134200"
      },
      {
        "frets": "edbbcx",
        "fingers": "431120",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "add9",
    "positions": [
      {
        "frets": "21x122",
        "fingers": "310244",
        "barres": 2
      },
      {
        "frets": "xx4324",
        "fingers": "003214"
      },
      {
        "frets": "x98696",
        "fingers": "032141",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x98x99",
        "fingers": "021034"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "alt",
    "positions": [
      {
        "frets": "xx4312",
        "fingers": "004312"
      },
      {
        "frets": "2343x2",
        "fingers": "124301",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4576",
        "fingers": "001243"
      },
      {
        "frets": "x9abb9",
        "fingers": "012340",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "aug",
    "positions": [
      {
        "frets": "xx4332",
        "fingers": "004231"
      },
      {
        "frets": "xx433x",
        "fingers": "002110",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x9877x",
        "fingers": "032110",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "edcbbx",
        "fingers": "432110",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "aug7",
    "positions": [
      {
        "frets": "2x233x",
        "fingers": "102340"
      },
      {
        "frets": "xx4756",
        "fingers": "001423"
      },
      {
        "frets": "x98770",
        "fingers": "043120"
      },
      {
        "frets": "x9c9ba",
        "fingers": "014132",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "aug9",
    "positions": [
      {
        "frets": "212130",
        "fingers": "213140",
        "barres": 1
      },
      {
        "frets": "x98790",
        "fingers": "032140"
      },
      {
        "frets": "x9899a",
        "fingers": "021334",
        "barres": 9
      },
      {
        "frets": "excdb0",
        "fingers": "402310"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "dim",
    "positions": [
      {
        "frets": "20x21x",
        "fingers": "200310"
      },
      {
        "frets": "xx45x5",
        "fingers": "001203"
      },
      {
        "frets": "x97x78",
        "fingers": "041023"
      },
      {
        "frets": "x9abax",
        "fingers": "012430"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "dim7",
    "positions": [
      {
        "frets": "2x121x",
        "fingers": "201310",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "234242",
        "fingers": "123141",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4545",
        "fingers": "001324"
      },
      {
        "frets": "89a8a8",
        "fingers": "123141",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m11",
    "positions": [
      {
        "frets": "202100",
        "fingers": "203100"
      },
      {
        "frets": "222224",
        "fingers": "111114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4455",
        "fingers": "001123",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x97997",
        "fingers": "021341",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m6",
    "positions": [
      {
        "frets": "2x1222",
        "fingers": "201334",
        "barres": 2
      },
      {
        "frets": "x44645",
        "fingers": "011312",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x97879",
        "fingers": "031214",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "x9b8ax",
        "fingers": "024130"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m69",
    "positions": [
      {
        "frets": "201122",
        "fingers": "201134",
        "barres": 1
      },
      {
        "frets": "244244",
        "fingers": "122134",
        "barres": 4
      },
      {
        "frets": "544644",
        "fingers": "211311",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x9789x",
        "fingers": "031240"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m7",
    "positions": [
      {
        "frets": "2x222x",
        "fingers": "203330"
      },
      {
        "frets": "exeeex",
        "fingers": "203330"
      },
      {
        "frets": "242222",
        "fingers": "131111",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4655",
        "fingers": "001423"
      },
      {
        "frets": "99b9a9",
        "fingers": "113121",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xxbbac",
        "fingers": "002314"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m7b5",
    "positions": [
      {
        "frets": "202210",
        "fingers": "203410"
      },
      {
        "frets": "xx4555",
        "fingers": "001222",
        "barres": 5
      },
      {
        "frets": "x9a9ax",
        "fingers": "013240"
      },
      {
        "frets": "xxabac",
        "fingers": "001214",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m9",
    "positions": [
      {
        "frets": "202120",
        "fingers": "203140"
      },
      {
        "frets": "242224",
        "fingers": "121113",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x97999",
        "fingers": "021344",
        "barres": 9
      },
      {
        "frets": "xxbdac",
        "fingers": "002413"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m9_A",
    "positions": [
      {
        "frets": "544654",
        "fingers": "211431",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "5x4654",
        "fingers": "201431",
        "barres": 4,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m9_E",
    "positions": [
      {
        "frets": "004224",
        "fingers": "003114",
        "barres": 2
      },
      {
        "frets": "044224",
        "fingers": "023114",
        "barres": 2
      },
      {
        "frets": "x74654",
        "fingers": "041321",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "c9b999",
        "fingers": "413111",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "madd9",
    "positions": [
      {
        "frets": "xx4224",
        "fingers": "003114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "244224",
        "fingers": "123114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x9769x",
        "fingers": "032140"
      },
      {
        "frets": "x97x99",
        "fingers": "021034"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "maj11",
    "positions": [
      {
        "frets": "223322",
        "fingers": "112311",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4466",
        "fingers": "001134",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x98a09",
        "fingers": "021403"
      },
      {
        "frets": "999ab9",
        "fingers": "111241",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "maj13",
    "positions": [
      {
        "frets": "211121",
        "fingers": "211131",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "x64466",
        "fingers": "021134",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x98866",
        "fingers": "042311",
        "barres": 6
      },
      {
        "frets": "x99abb",
        "fingers": "011234",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "maj7#5",
    "positions": [
      {
        "frets": "2x333x",
        "fingers": "102340"
      },
      {
        "frets": "698766",
        "fingers": "143211",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x9cabx",
        "fingers": "014230"
      },
      {
        "frets": "xxcbbd",
        "fingers": "002114",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "maj7",
    "positions": [
      {
        "frets": "243322",
        "fingers": "142311",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x44666",
        "fingers": "011333",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x98666",
        "fingers": "043111",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "99bab9",
        "fingers": "113241",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "maj7b5",
    "positions": [
      {
        "frets": "213311",
        "fingers": "213411",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx4566",
        "fingers": "001234"
      },
      {
        "frets": "x98ab8",
        "fingers": "021341",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "x9aabx",
        "fingers": "012340"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "maj7sus2",
    "positions": [
      {
        "frets": "xx4121",
        "fingers": "004121",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "xx4664",
        "fingers": "001341",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x9ba99",
        "fingers": "013211",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "x9666x",
        "fingers": "041110",
        "barres": 6,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "maj9",
    "positions": [
      {
        "frets": "213121",
        "fingers": "214131",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "2x3324",
        "fingers": "102314",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4364",
        "fingers": "002143"
      },
      {
        "frets": "998a9x",
        "fingers": "221430",
        "barres": 9
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "major",
    "positions": [
      {
        "frets": "244322",
        "fingers": "134211",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x44676",
        "fingers": "011243",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "698676",
        "fingers": "143121",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "99bbb9",
        "fingers": "112341",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "minor",
    "positions": [
      {
        "frets": "244222",
        "fingers": "134111",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x44675",
        "fingers": "011342",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx7675",
        "fingers": "003241"
      },
      {
        "frets": "99bba9",
        "fingers": "113421",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "mmaj11",
    "positions": [
      {
        "frets": "223224",
        "fingers": "112114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x44465",
        "fingers": "011132",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x97a97",
        "fingers": "021431",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "999aa9",
        "fingers": "111231",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "mmaj7",
    "positions": [
      {
        "frets": "243222",
        "fingers": "132111",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x44665",
        "fingers": "011342",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "x9766x",
        "fingers": "042110",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "99baa9",
        "fingers": "114231",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "mmaj7b5",
    "positions": [
      {
        "frets": "2332x2",
        "fingers": "123101",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4565",
        "fingers": "001243"
      },
      {
        "frets": "89aaax",
        "fingers": "123330",
        "barres": 10
      },
      {
        "frets": "x9aaax",
        "fingers": "012340"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "mmaj9",
    "positions": [
      {
        "frets": "203121",
        "fingers": "204131",
        "barres": 1
      },
      {
        "frets": "20312x",
        "fingers": "204130"
      },
      {
        "frets": "243224",
        "fingers": "132114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x97a9x",
        "fingers": "021430"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m_A",
    "positions": [
      {
        "frets": "x04222",
        "fingers": "003111",
        "barres": 2
      },
      {
        "frets": "x04225",
        "fingers": "003114",
        "barres": 2
      },
      {
        "frets": "544222",
        "fingers": "423111",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x04675",
        "fingers": "001342"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m_Ab",
    "positions": [
      {
        "frets": "404222",
        "fingers": "304111",
        "barres": 2
      },
      {
        "frets": "444222",
        "fingers": "234111",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "444675",
        "fingers": "111342",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx6675",
        "fingers": "002341"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m_B",
    "positions": [
      {
        "frets": "x24222",
        "fingers": "013111",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x24225",
        "fingers": "013114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx9ba9",
        "fingers": "001321",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "x2422x",
        "fingers": "013110",
        "barres": 2,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m_Bb",
    "positions": [
      {
        "frets": "xx8675",
        "fingers": "004231"
      },
      {
        "frets": "xx8ba9",
        "fingers": "001432"
      },
      {
        "frets": "xdbeee",
        "fingers": "031444",
        "barres": 14
      },
      {
        "frets": "6976xx",
        "fingers": "142100",
        "barres": 6,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m_C#",
    "positions": [
      {
        "frets": "x44222",
        "fingers": "034111",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x44225",
        "fingers": "023114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x44675",
        "fingers": "011342",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "99bba9",
        "fingers": "113421",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m_C",
    "positions": [
      {
        "frets": "x34222",
        "fingers": "023111",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x34225",
        "fingers": "023114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xxaba9",
        "fingers": "002431"
      },
      {
        "frets": "x3422x",
        "fingers": "023110",
        "barres": 2,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m_D",
    "positions": [
      {
        "frets": "xx0222",
        "fingers": "000111",
        "barres": 2
      },
      {
        "frets": "x54222",
        "fingers": "043111",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx0675",
        "fingers": "000231"
      },
      {
        "frets": "x57675",
        "fingers": "013241",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m_E",
    "positions": [
      {
        "frets": "004222",
        "fingers": "003111",
        "barres": 2
      },
      {
        "frets": "044222",
        "fingers": "034111",
        "barres": 2
      },
      {
        "frets": "044225",
        "fingers": "023114",
        "barres": 2
      },
      {
        "frets": "xx2222",
        "fingers": "001111",
        "barres": 2,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m_Eb",
    "positions": [
      {
        "frets": "xx1222",
        "fingers": "001222",
        "barres": 2
      },
      {
        "frets": "bcbbee",
        "fingers": "121144",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "bcbeee",
        "fingers": "121444",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "x6767x",
        "fingers": "012130",
        "barres": 6,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m_F",
    "positions": [
      {
        "frets": "xx3222",
        "fingers": "002111",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "dcbbee",
        "fingers": "321144",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "dcbeee",
        "fingers": "321444",
        "barres": 14
      },
      {
        "frets": "x8767x",
        "fingers": "042130"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "m_G",
    "positions": [
      {
        "frets": "304222",
        "fingers": "203111",
        "barres": 2
      },
      {
        "frets": "344222",
        "fingers": "234111",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx5222",
        "fingers": "004111",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx5675",
        "fingers": "001231",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "sus",
    "positions": [
      {
        "frets": "224422",
        "fingers": "113411",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "244422",
        "fingers": "123411",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4422",
        "fingers": "003411",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4677",
        "fingers": "001344",
        "barres": 7
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "sus2",
    "positions": [
      {
        "frets": "2xx122",
        "fingers": "200134"
      },
      {
        "frets": "444674",
        "fingers": "111341",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "99bb99",
        "fingers": "113411",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "ebbdex",
        "fingers": "311240",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "sus2sus4",
    "positions": [
      {
        "frets": "224424",
        "fingers": "112314",
        "barres": 2
      },
      {
        "frets": "x99b99",
        "fingers": "011311",
        "barres": 9
      },
      {
        "frets": "x96677",
        "fingers": "041122",
        "barres": [
          6,
          7
        ]
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "sus4",
    "positions": [
      {
        "frets": "244422",
        "fingers": "123411",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x44677",
        "fingers": "011234",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "99bbc9",
        "fingers": "112341",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xxbbce",
        "fingers": "001124",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "_A",
    "positions": [
      {
        "frets": "x04322",
        "fingers": "003211",
        "barres": 2
      },
      {
        "frets": "x04676",
        "fingers": "001243"
      },
      {
        "frets": "x08676",
        "fingers": "003121",
        "barres": 6
      },
      {
        "frets": "x08679",
        "fingers": "003124"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "_Ab",
    "positions": [
      {
        "frets": "444676",
        "fingers": "111243",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xx6676",
        "fingers": "001121",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xbbbbe",
        "fingers": "011114",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "xbbbbx",
        "fingers": "011110",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "_B",
    "positions": [
      {
        "frets": "x24322",
        "fingers": "013211",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx9676",
        "fingers": "004121",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx9bb9",
        "fingers": "001341",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "x2432x",
        "fingers": "013210",
        "barres": 2,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "_Bb",
    "positions": [
      {
        "frets": "698676",
        "fingers": "143121",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "6xx676",
        "fingers": "111121",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx8676",
        "fingers": "003121",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xx8679",
        "fingers": "003124"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "_C#",
    "positions": [
      {
        "frets": "x44322",
        "fingers": "034211",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x44676",
        "fingers": "011243",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "99bbb9",
        "fingers": "112341",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xxbbb9",
        "fingers": "002341"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "_C",
    "positions": [
      {
        "frets": "x34322",
        "fingers": "024311",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xxabb9",
        "fingers": "002341"
      },
      {
        "frets": "x3432x",
        "fingers": "024310"
      },
      {
        "frets": "89bbbx",
        "fingers": "124440",
        "barres": 11
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "_D",
    "positions": [
      {
        "frets": "xx0322",
        "fingers": "000211",
        "barres": 2
      },
      {
        "frets": "x54322",
        "fingers": "043211",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx0676",
        "fingers": "000121",
        "barres": 6
      },
      {
        "frets": "xx0bb9",
        "fingers": "000341"
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "_E",
    "positions": [
      {
        "frets": "044322",
        "fingers": "034211",
        "barres": 2
      },
      {
        "frets": "xx2322",
        "fingers": "001211",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "044676",
        "fingers": "011243",
        "barres": 4
      },
      {
        "frets": "098676",
        "fingers": "043121",
        "barres": 6
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "_Eb",
    "positions": [
      {
        "frets": "xx1322",
        "fingers": "001423"
      },
      {
        "frets": "x68676",
        "fingers": "013121",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "x68679",
        "fingers": "013124",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "bdbbbe",
        "fingers": "131114",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "_F",
    "positions": [
      {
        "frets": "xx3322",
        "fingers": "002311",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x88676",
        "fingers": "034121",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "ddbbbe",
        "fingers": "231114",
        "barres": 11,
        "capo": true
      },
      {
        "frets": "ddbbee",
        "fingers": "231144",
        "barres": 11,
        "capo": true
      }
    ]
  },
  {
    "key": "F#",
    "suffix": "_G",
    "positions": [
      {
        "frets": "xx5322",
        "fingers": "004211",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx5676",
        "fingers": "001243"
      },
      {
        "frets": "xabbbx",
        "fingers": "012220",
        "barres": 11
      },
      {
        "frets": "3443xx",
        "fingers": "123100",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "11",
    "positions": [
      {
        "frets": "320011",
        "fingers": "320011",
        "barres": 1
      },
      {
        "frets": "555567",
        "fingers": "111123",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xa9a88",
        "fingers": "032411",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "xaaaca",
        "fingers": "011131",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "13",
    "positions": [
      {
        "frets": "302001",
        "fingers": "302001"
      },
      {
        "frets": "3x3455",
        "fingers": "101234",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "353453",
        "fingers": "131241",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xa9aac",
        "fingers": "021334",
        "barres": 10
      }
    ]
  },
  {
    "key": "G",
    "suffix": "5",
    "positions": [
      {
        "frets": "35xxxx",
        "fingers": "130000"
      },
      {
        "frets": "xacxxx",
        "fingers": "013000"
      },
      {
        "frets": "355xxx",
        "fingers": "134000"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "6",
    "positions": [
      {
        "frets": "320000",
        "fingers": "210000"
      },
      {
        "frets": "3x243x",
        "fingers": "201430"
      },
      {
        "frets": "x55757",
        "fingers": "011314",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xacccc",
        "fingers": "013334",
        "barres": 12
      }
    ]
  },
  {
    "key": "G",
    "suffix": "69",
    "positions": [
      {
        "frets": "300000",
        "fingers": "100000"
      },
      {
        "frets": "322233",
        "fingers": "211134",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "x55455",
        "fingers": "022134",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xa99aa",
        "fingers": "021134",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "7#9",
    "positions": [
      {
        "frets": "320301",
        "fingers": "320401"
      },
      {
        "frets": "353466",
        "fingers": "131244",
        "barres": [
          3,
          6
        ],
        "capo": true
      },
      {
        "frets": "x55466",
        "fingers": "023144",
        "barres": 6
      },
      {
        "frets": "xa9abx",
        "fingers": "021340"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "7",
    "positions": [
      {
        "frets": "320001",
        "fingers": "320001"
      },
      {
        "frets": "353433",
        "fingers": "131211",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x55767",
        "fingers": "011324",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "aacaca",
        "fingers": "113141",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "7b5",
    "positions": [
      {
        "frets": "3x342x",
        "fingers": "203410"
      },
      {
        "frets": "xx5667",
        "fingers": "001234"
      },
      {
        "frets": "xa9a09",
        "fingers": "031402"
      },
      {
        "frets": "xabacx",
        "fingers": "012130",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "7b9",
    "positions": [
      {
        "frets": "320131",
        "fingers": "320141",
        "barres": 1
      },
      {
        "frets": "3x3434",
        "fingers": "101213",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5464",
        "fingers": "002131",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xa9a9a",
        "fingers": "021314",
        "barres": 9,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "7sus4",
    "positions": [
      {
        "frets": "330011",
        "fingers": "230011",
        "barres": 1,
        "capo": true
      },
      {
        "frets": "353533",
        "fingers": "131411",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xaaa88",
        "fingers": "023411",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "aacada",
        "fingers": "113141",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "9#11",
    "positions": [
      {
        "frets": "323223",
        "fingers": "213114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx5667",
        "fingers": "001234"
      },
      {
        "frets": "xa9aa9",
        "fingers": "021341",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xabaca",
        "fingers": "012131",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "9",
    "positions": [
      {
        "frets": "300001",
        "fingers": "300001"
      },
      {
        "frets": "32323x",
        "fingers": "213140",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "353435",
        "fingers": "131214",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "aa9aaa",
        "fingers": "221334",
        "barres": 10
      }
    ]
  },
  {
    "key": "G",
    "suffix": "9b5",
    "positions": [
      {
        "frets": "323223",
        "fingers": "213114",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "343405",
        "fingers": "121304",
        "barres": 3
      },
      {
        "frets": "xa9aa9",
        "fingers": "021341",
        "barres": 9,
        "capo": true
      },
      {
        "frets": "xcb00d",
        "fingers": "021003"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "add11",
    "positions": [
      {
        "frets": "320013",
        "fingers": "320014"
      },
      {
        "frets": "xa9788",
        "fingers": "043122",
        "barres": 8
      },
      {
        "frets": "32001x",
        "fingers": "320010"
      },
      {
        "frets": "32041x",
        "fingers": "320410"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "add9",
    "positions": [
      {
        "frets": "300203",
        "fingers": "200103"
      },
      {
        "frets": "xx3214",
        "fingers": "003214"
      },
      {
        "frets": "xa97a7",
        "fingers": "032141",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xa90aa",
        "fingers": "021034"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "alt",
    "positions": [
      {
        "frets": "32x023",
        "fingers": "310024"
      },
      {
        "frets": "xx5607",
        "fingers": "001203"
      },
      {
        "frets": "xa9009",
        "fingers": "031002"
      },
      {
        "frets": "xabccx",
        "fingers": "012340"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "aug",
    "positions": [
      {
        "frets": "32100x",
        "fingers": "321000"
      },
      {
        "frets": "3x544x",
        "fingers": "104230"
      },
      {
        "frets": "xx544x",
        "fingers": "002110",
        "barres": 4,
        "capo": true
      },
      {
        "frets": "xa988x",
        "fingers": "032110",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "aug7",
    "positions": [
      {
        "frets": "321001",
        "fingers": "431002"
      },
      {
        "frets": "3x344x",
        "fingers": "102340"
      },
      {
        "frets": "xx5867",
        "fingers": "001423"
      },
      {
        "frets": "xadacb",
        "fingers": "014132",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "aug9",
    "positions": [
      {
        "frets": "301001",
        "fingers": "302001"
      },
      {
        "frets": "32324x",
        "fingers": "213140"
      },
      {
        "frets": "xa9aab",
        "fingers": "021334",
        "barres": 10
      },
      {
        "frets": "xcd0cd",
        "fingers": "013024"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "dim",
    "positions": [
      {
        "frets": "31x32x",
        "fingers": "310420"
      },
      {
        "frets": "xx56x6",
        "fingers": "001203"
      },
      {
        "frets": "xa8x89",
        "fingers": "012430"
      },
      {
        "frets": "xabcbx",
        "fingers": "012430"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "dim7",
    "positions": [
      {
        "frets": "31x320",
        "fingers": "310420"
      },
      {
        "frets": "3x2320",
        "fingers": "301420"
      },
      {
        "frets": "345353",
        "fingers": "123141",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5656",
        "fingers": "001324"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m11",
    "positions": [
      {
        "frets": "3x331x",
        "fingers": "203410"
      },
      {
        "frets": "333335",
        "fingers": "111114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5577",
        "fingers": "001123",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xa8aa8",
        "fingers": "021341",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m6",
    "positions": [
      {
        "frets": "3x2333",
        "fingers": "201344",
        "barres": 3
      },
      {
        "frets": "355353",
        "fingers": "123141",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x55756",
        "fingers": "011312",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xa898a",
        "fingers": "031214",
        "barres": 8,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m69",
    "positions": [
      {
        "frets": "310230",
        "fingers": "310240"
      },
      {
        "frets": "x55355",
        "fingers": "022134",
        "barres": 5
      },
      {
        "frets": "655755",
        "fingers": "211311",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xa89aa",
        "fingers": "031244",
        "barres": 10
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m7",
    "positions": [
      {
        "frets": "3x333x",
        "fingers": "203330"
      },
      {
        "frets": "353333",
        "fingers": "131111",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x55766",
        "fingers": "011423",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xa8a8a",
        "fingers": "021314",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "aacaba",
        "fingers": "113121",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m7b5",
    "positions": [
      {
        "frets": "3xx321",
        "fingers": "300421"
      },
      {
        "frets": "3x332x",
        "fingers": "203410"
      },
      {
        "frets": "xx5666",
        "fingers": "001222",
        "barres": 6
      },
      {
        "frets": "xababx",
        "fingers": "013240"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m9",
    "positions": [
      {
        "frets": "300331",
        "fingers": "200341"
      },
      {
        "frets": "353335",
        "fingers": "131114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx7066",
        "fingers": "002011",
        "barres": 6
      },
      {
        "frets": "xa8aaa",
        "fingers": "021344",
        "barres": 10
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m9_Bb",
    "positions": [
      {
        "frets": "655765",
        "fingers": "211431",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "6x5765",
        "fingers": "201431",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m9_F",
    "positions": [
      {
        "frets": "x85765",
        "fingers": "041321",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "dacaaa",
        "fingers": "413111",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "daccaa",
        "fingers": "412311",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "dacaax",
        "fingers": "413110",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "madd9",
    "positions": [
      {
        "frets": "310233",
        "fingers": "310244",
        "barres": 3
      },
      {
        "frets": "xx5335",
        "fingers": "003114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx7086",
        "fingers": "002031"
      },
      {
        "frets": "xa87ax",
        "fingers": "032140"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "maj11",
    "positions": [
      {
        "frets": "320012",
        "fingers": "420013"
      },
      {
        "frets": "334433",
        "fingers": "112311",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx9078",
        "fingers": "003012"
      },
      {
        "frets": "aaabca",
        "fingers": "111231",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "maj13",
    "positions": [
      {
        "frets": "322232",
        "fingers": "311131",
        "barres": [
          2,
          3
        ],
        "capo": true
      },
      {
        "frets": "334453",
        "fingers": "112341",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xa9977",
        "fingers": "042311",
        "barres": 7
      },
      {
        "frets": "xaabcc",
        "fingers": "011234",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "maj7#5",
    "positions": [
      {
        "frets": "xx1002",
        "fingers": "001003"
      },
      {
        "frets": "3x444x",
        "fingers": "102340"
      },
      {
        "frets": "7a9877",
        "fingers": "143211",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "xadbcx",
        "fingers": "014230"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "maj7",
    "positions": [
      {
        "frets": "320002",
        "fingers": "320001"
      },
      {
        "frets": "354433",
        "fingers": "142311",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x55777",
        "fingers": "011333",
        "barres": [
          5,
          7
        ],
        "capo": true
      },
      {
        "frets": "xacbca",
        "fingers": "013241",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "maj7b5",
    "positions": [
      {
        "frets": "324422",
        "fingers": "213411",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "3444xx",
        "fingers": "123400"
      },
      {
        "frets": "xx5677",
        "fingers": "001234"
      },
      {
        "frets": "xabbcx",
        "fingers": "012340"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "maj7sus2",
    "positions": [
      {
        "frets": "300032",
        "fingers": "200031"
      },
      {
        "frets": "300232",
        "fingers": "200131",
        "barres": 2
      },
      {
        "frets": "304032",
        "fingers": "204031"
      },
      {
        "frets": "304232",
        "fingers": "204131",
        "barres": 2
      }
    ]
  },
  {
    "key": "G",
    "suffix": "maj9",
    "positions": [
      {
        "frets": "300002",
        "fingers": "200001"
      },
      {
        "frets": "324232",
        "fingers": "214131",
        "barres": 2,
        "capo": true
      },
      {
        "frets": "xx4435",
        "fingers": "002314"
      },
      {
        "frets": "xa9bax",
        "fingers": "021430"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "major",
    "positions": [
      {
        "frets": "320003",
        "fingers": "210003"
      },
      {
        "frets": "320003",
        "fingers": "320004"
      },
      {
        "frets": "355433",
        "fingers": "134211",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5787",
        "fingers": "001243"
      },
      {
        "frets": "7a9787",
        "fingers": "143121",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "minor",
    "positions": [
      {
        "frets": "310033",
        "fingers": "210034"
      },
      {
        "frets": "355333",
        "fingers": "134111",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5786",
        "fingers": "001342"
      },
      {
        "frets": "aaccba",
        "fingers": "113421",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "mmaj11",
    "positions": [
      {
        "frets": "334335",
        "fingers": "112114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x55576",
        "fingers": "011132",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xa8ba8",
        "fingers": "021431",
        "barres": 8,
        "capo": true
      },
      {
        "frets": "aaabba",
        "fingers": "111231",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "mmaj7",
    "positions": [
      {
        "frets": "310032",
        "fingers": "310042"
      },
      {
        "frets": "354333",
        "fingers": "132111",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x55776",
        "fingers": "011342",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xacbba",
        "fingers": "014231",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "mmaj7b5",
    "positions": [
      {
        "frets": "3443x3",
        "fingers": "123101",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5676",
        "fingers": "001243"
      },
      {
        "frets": "9abbbx",
        "fingers": "123330",
        "barres": 11
      },
      {
        "frets": "xabbbx",
        "fingers": "012340"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "mmaj9",
    "positions": [
      {
        "frets": "300332",
        "fingers": "200341"
      },
      {
        "frets": "354335",
        "fingers": "132114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx7076",
        "fingers": "002031"
      },
      {
        "frets": "xa8bax",
        "fingers": "021430"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m_A",
    "positions": [
      {
        "frets": "x00333",
        "fingers": "000111",
        "barres": 3
      },
      {
        "frets": "x05333",
        "fingers": "003111",
        "barres": 3
      },
      {
        "frets": "x05336",
        "fingers": "003114",
        "barres": 3
      },
      {
        "frets": "555333",
        "fingers": "234111",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m_Ab",
    "positions": [
      {
        "frets": "455333",
        "fingers": "234111",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx6333",
        "fingers": "004111",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx6786",
        "fingers": "001231",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "41003x",
        "fingers": "410030"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m_B",
    "positions": [
      {
        "frets": "x20333",
        "fingers": "010222",
        "barres": 3
      },
      {
        "frets": "xx9786",
        "fingers": "004231"
      },
      {
        "frets": "xx9cba",
        "fingers": "001432"
      },
      {
        "frets": "7a87xx",
        "fingers": "142100",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m_Bb",
    "positions": [
      {
        "frets": "x1003x",
        "fingers": "010030"
      },
      {
        "frets": "655333",
        "fingers": "423111",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx8786",
        "fingers": "003241"
      },
      {
        "frets": "65533x",
        "fingers": "423110",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m_C#",
    "positions": [
      {
        "frets": "x40333",
        "fingers": "020111",
        "barres": 3
      },
      {
        "frets": "x45333",
        "fingers": "023111",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x45336",
        "fingers": "023114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xxbcba",
        "fingers": "002431"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m_C",
    "positions": [
      {
        "frets": "x35333",
        "fingers": "013111",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x35336",
        "fingers": "013114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xxacba",
        "fingers": "001321",
        "barres": 10,
        "capo": true
      },
      {
        "frets": "x3533x",
        "fingers": "013110",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m_D",
    "positions": [
      {
        "frets": "xx0333",
        "fingers": "000111",
        "barres": 3
      },
      {
        "frets": "x55333",
        "fingers": "034111",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x55336",
        "fingers": "023114",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x55786",
        "fingers": "011342",
        "barres": 5,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m_E",
    "positions": [
      {
        "frets": "xx2333",
        "fingers": "001222",
        "barres": 3
      },
      {
        "frets": "055333",
        "fingers": "034111",
        "barres": 3
      },
      {
        "frets": "055336",
        "fingers": "023114",
        "barres": 3
      },
      {
        "frets": "055786",
        "fingers": "011342",
        "barres": 5
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m_Eb",
    "positions": [
      {
        "frets": "xx1333",
        "fingers": "001333",
        "barres": 3
      },
      {
        "frets": "x65333",
        "fingers": "043111",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x68786",
        "fingers": "013241",
        "barres": 6,
        "capo": true
      },
      {
        "frets": "xxdcba",
        "fingers": "004321"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m_F#",
    "positions": [
      {
        "frets": "xx4333",
        "fingers": "002111",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "21003x",
        "fingers": "210030"
      },
      {
        "frets": "x9878x",
        "fingers": "042130"
      },
      {
        "frets": "2100xx",
        "fingers": "210000"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "m_F",
    "positions": [
      {
        "frets": "110033",
        "fingers": "120044",
        "barres": 3
      },
      {
        "frets": "110333",
        "fingers": "120444",
        "barres": 3
      },
      {
        "frets": "xx3333",
        "fingers": "001111",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "11003x",
        "fingers": "120040"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "sus",
    "positions": [
      {
        "frets": "330013",
        "fingers": "230014"
      },
      {
        "frets": "335533",
        "fingers": "113411",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "355533",
        "fingers": "123411",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx5533",
        "fingers": "003411",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "sus2",
    "positions": [
      {
        "frets": "300033",
        "fingers": "100023"
      },
      {
        "frets": "555785",
        "fingers": "111341",
        "barres": 5,
        "capo": true
      },
      {
        "frets": "xa778a",
        "fingers": "031124",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "aaccaa",
        "fingers": "113411",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "sus2sus4",
    "positions": [
      {
        "frets": "33021x",
        "fingers": "340210"
      },
      {
        "frets": "33023x",
        "fingers": "230140"
      },
      {
        "frets": "300213",
        "fingers": "300214"
      },
      {
        "frets": "335535",
        "fingers": "112314",
        "barres": 3
      },
      {
        "frets": "xaacaa",
        "fingers": "011311",
        "barres": 10
      }
    ]
  },
  {
    "key": "G",
    "suffix": "sus4",
    "positions": [
      {
        "frets": "330013",
        "fingers": "230014"
      },
      {
        "frets": "355533",
        "fingers": "123411",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x55788",
        "fingers": "011344",
        "barres": [
          5,
          8
        ],
        "capo": true
      },
      {
        "frets": "aaccda",
        "fingers": "112341",
        "barres": 10,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "_A",
    "positions": [
      {
        "frets": "x00003",
        "fingers": "000001"
      },
      {
        "frets": "x00403",
        "fingers": "000201"
      },
      {
        "frets": "x00433",
        "fingers": "000211",
        "barres": 3
      },
      {
        "frets": "x05433",
        "fingers": "003211",
        "barres": 3
      }
    ]
  },
  {
    "key": "G",
    "suffix": "_Ab",
    "positions": [
      {
        "frets": "420003",
        "fingers": "310002"
      },
      {
        "frets": "420033",
        "fingers": "310022",
        "barres": 3
      },
      {
        "frets": "xx6433",
        "fingers": "004211",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xx6787",
        "fingers": "001243"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "_B",
    "positions": [
      {
        "frets": "x20003",
        "fingers": "010002"
      },
      {
        "frets": "x20033",
        "fingers": "010022",
        "barres": 3
      },
      {
        "frets": "x20403",
        "fingers": "010302"
      },
      {
        "frets": "x20433",
        "fingers": "010423"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "_Bb",
    "positions": [
      {
        "frets": "x10003",
        "fingers": "010003"
      },
      {
        "frets": "x10403",
        "fingers": "010403"
      },
      {
        "frets": "xx8787",
        "fingers": "002131",
        "barres": 7,
        "capo": true
      },
      {
        "frets": "x1000x",
        "fingers": "010000"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "_C#",
    "positions": [
      {
        "frets": "x40003",
        "fingers": "020001"
      },
      {
        "frets": "x40403",
        "fingers": "020301"
      },
      {
        "frets": "x40433",
        "fingers": "020311",
        "barres": 3
      },
      {
        "frets": "x45433",
        "fingers": "024311",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "_C",
    "positions": [
      {
        "frets": "x30003",
        "fingers": "010002"
      },
      {
        "frets": "x30403",
        "fingers": "010302"
      },
      {
        "frets": "x35433",
        "fingers": "013211",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xxa787",
        "fingers": "004121",
        "barres": 7,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "_D",
    "positions": [
      {
        "frets": "xx0003",
        "fingers": "000001"
      },
      {
        "frets": "xx0403",
        "fingers": "000201"
      },
      {
        "frets": "xx0433",
        "fingers": "000211",
        "barres": 3
      },
      {
        "frets": "x55433",
        "fingers": "034211",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "_E",
    "positions": [
      {
        "frets": "020003",
        "fingers": "010002"
      },
      {
        "frets": "020033",
        "fingers": "010022",
        "barres": 3
      },
      {
        "frets": "020403",
        "fingers": "010302"
      },
      {
        "frets": "020433",
        "fingers": "010423"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "_Eb",
    "positions": [
      {
        "frets": "xx1433",
        "fingers": "001423"
      },
      {
        "frets": "x65433",
        "fingers": "043211",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "xxdcca",
        "fingers": "004231"
      },
      {
        "frets": "x6543x",
        "fingers": "043210"
      }
    ]
  },
  {
    "key": "G",
    "suffix": "_F#",
    "positions": [
      {
        "frets": "220003",
        "fingers": "120003"
      },
      {
        "frets": "220033",
        "fingers": "120033",
        "barres": 3
      },
      {
        "frets": "220403",
        "fingers": "120403"
      },
      {
        "frets": "xx4433",
        "fingers": "002311",
        "barres": 3,
        "capo": true
      }
    ]
  },
  {
    "key": "G",
    "suffix": "_F",
    "positions": [
      {
        "frets": "120003",
        "fingers": "120003"
      },
      {
        "frets": "120403",
        "fingers": "120403"
      },
      {
        "frets": "xx3433",
        "fingers": "001211",
        "barres": 3,
        "capo": true
      },
      {
        "frets": "x89787",
        "fingers": "024131",
        "barres": 7,
        "capo": true
      }
    ]
  }
];

export const localChordLibrary = processRawData(RAW_DATA);
