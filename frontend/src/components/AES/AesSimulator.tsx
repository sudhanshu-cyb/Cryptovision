import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw, 
  Sliders, 
  Key, 
  Sparkles, 
  Copy,
  Check,
  ArrowRight,
  Grid,
  Binary,
  SkipForward
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────────
   StateMatrixViz – Animated visualization of how AES builds its 4×4 state matrix
   from a 16-byte plaintext using column-major ordering.
   ──────────────────────────────────────────────────────────────────────────── */

// Column-major mapping: byte index → (row, col) in the 4×4 matrix
// AES fills the state matrix column by column: col 0 = bytes 0-3, col 1 = bytes 4-7, etc.
const COL_MAJOR_MAP: [number, number][] = [
  [0,0],[1,0],[2,0],[3,0],  // column 0
  [0,1],[1,1],[2,1],[3,1],  // column 1
  [0,2],[1,2],[2,2],[3,2],  // column 2
  [0,3],[1,3],[2,3],[3,3],  // column 3
];

const PHASE_COLORS = [
  '#00f2fe', '#00d4fe', '#00b8fd', '#009dfc',
  '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd',
  '#00ff66', '#00e85d', '#00d154', '#00ba4a',
  '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a',
];

interface StateMatrixVizProps {
  traceData: any;
  plaintext: string;
}

const StateMatrixViz: React.FC<StateMatrixVizProps> = ({ traceData, plaintext }) => {
  const [activeByte, setActiveByte]     = useState<number>(-1);   // -1 = show all done
  const [isPlaying, setIsPlaying]       = useState(false);
  const [speed, setSpeed]               = useState(900);
  const [phase, setPhase]               = useState<'idle'|'bytes'|'done'>('idle');
  const [revealedCells, setRevealedCells] = useState<Set<number>>(new Set());
  const timerRef = useRef<any>(null);

  // Parse hex string into 16 byte pairs
  const hexBytes = traceData.plaintext_hex
    ? (traceData.plaintext_hex.match(/.{1,2}/g) || []).slice(0, 16)
    : [];

  // Flat initial state for lookup
  const flatMatrix: string[] = [];
  if (traceData.initial_state) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        flatMatrix[r * 4 + c] = traceData.initial_state[r][c];
      }
    }
  }

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setIsPlaying(false);
    setActiveByte(-1);
    setPhase('idle');
    setRevealedCells(new Set());
  }, []);

  const startAnimation = useCallback(() => {
    reset();
    setTimeout(() => {
      setPhase('bytes');
      setActiveByte(0);
      setRevealedCells(new Set([0]));
      setIsPlaying(true);
    }, 100);
  }, [reset]);

  useEffect(() => {
    if (isPlaying && phase === 'bytes') {
      timerRef.current = setInterval(() => {
        setActiveByte(prev => {
          const next = prev + 1;
          if (next >= 16) {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            setPhase('done');
            return 15;
          }
          setRevealedCells(cells => new Set([...cells, next]));
          return next;
        });
      }, speed);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, phase, speed]);

  const stepForward = () => {
    if (phase === 'idle') { setPhase('bytes'); setActiveByte(0); setRevealedCells(new Set([0])); return; }
    if (phase === 'bytes' && activeByte < 15) {
      const next = activeByte + 1;
      setActiveByte(next);
      setRevealedCells(cells => new Set([...cells, next]));
      if (next === 15) setPhase('done');
    }
  };

  const showAll = () => {
    clearInterval(timerRef.current);
    setIsPlaying(false);
    setActiveByte(15);
    setPhase('done');
    setRevealedCells(new Set([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]));
  };

  // Matrix cell — col-major position from byte index `bi`
  const [activeRow, activeCol] = activeByte >= 0 ? COL_MAJOR_MAP[activeByte] : [-1, -1];

  return (
    <div className="space-y-5 font-mono select-none">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">State Matrix Construction</h4>
          <p className="text-[11px] text-slate-400 max-w-lg leading-relaxed">
            AES reads the 16 plaintext bytes and fills a <span className="text-[#00f2fe]">4×4 matrix</span> in{' '}
            <span className="text-[#00ff66]">column-major order</span> — byte <span className="text-[#00f2fe]">0</span> goes to{' '}
            <span className="text-[#00f2fe]">S[0][0]</span>, byte <span className="text-[#00f2fe]">1</span> to{' '}
            <span className="text-[#00f2fe]">S[1][0]</span> … filling each column top-to-bottom before advancing right.
          </p>
        </div>
        {/* Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={reset}
            title="Reset"
            className="p-2 rounded border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={stepForward}
            disabled={phase === 'done'}
            title="Step forward"
            className="p-2 rounded border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-all cursor-pointer disabled:opacity-40"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={showAll}
            title="Show all at once"
            className="p-2 rounded border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => isPlaying ? (clearInterval(timerRef.current), setIsPlaying(false)) : startAnimation()}
            className={`flex items-center gap-1.5 px-3 py-2 rounded border text-xs font-bold cursor-pointer transition-all ${
              isPlaying
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : 'bg-[#00f2fe]/10 border-[#00f2fe]/40 text-[#00f2fe] hover:bg-[#00f2fe]/20'
            }`}
          >
            {isPlaying ? <><Pause className="w-3 h-3 fill-rose-400" /> PAUSE</> : <><Play className="w-3 h-3 fill-[#00f2fe]" /> ANIMATE</>}
          </button>
        </div>
      </div>

      {/* ── Speed slider ── */}
      <div className="flex items-center gap-3 text-[10px] text-slate-500">
        <span>SPEED</span>
        <input
          type="range" min="200" max="1800" step="100" value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          className="w-28 accent-[#00f2fe] cursor-pointer"
        />
        <span className="text-[#00f2fe] font-bold">{(speed / 1000).toFixed(1)}s/byte</span>
      </div>

      {/* ── Main 3-column layout: Bytes → Arrow → Matrix ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-center">

        {/* LEFT: Byte stream */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-3">
            <Binary className="w-3 h-3" />
            <span>Plaintext Bytes</span>
          </div>

          {/* ASCII row */}
          <div>
            <div className="text-[9px] text-slate-600 mb-1 pl-1">ASCII Characters</div>
            <div className="flex flex-wrap gap-1">
              {Array.from(plaintext.slice(0, 16)).map((ch, i) => (
                <div
                  key={i}
                  className={`w-9 h-8 flex items-center justify-center rounded text-[11px] font-bold border transition-all duration-300 ${
                    activeByte === i
                      ? 'bg-[#00f2fe]/25 border-[#00f2fe] text-[#00f2fe] scale-110 shadow-[0_0_10px_#00f2fe55]'
                      : revealedCells.has(i)
                      ? `border-transparent text-slate-300`
                      : 'border-slate-800 text-slate-600'
                  }`}
                  style={revealedCells.has(i) && activeByte !== i ? { color: PHASE_COLORS[i], borderColor: PHASE_COLORS[i] + '40' } : {}}
                >
                  {ch}
                </div>
              ))}
            </div>
          </div>

          {/* Hex row */}
          <div>
            <div className="text-[9px] text-slate-600 mb-1 pl-1">Hex Encoding</div>
            <div className="flex flex-wrap gap-1">
              {hexBytes.map((hb: string, i: number) => (
                <div
                  key={i}
                  className={`w-9 h-8 flex items-center justify-center rounded text-[10px] font-bold border transition-all duration-300 ${
                    activeByte === i
                      ? 'bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66] scale-110 shadow-[0_0_10px_#00ff6655]'
                      : revealedCells.has(i)
                      ? 'border-transparent text-slate-400'
                      : 'border-slate-900 text-slate-700'
                  }`}
                  style={revealedCells.has(i) && activeByte !== i ? { color: PHASE_COLORS[i] + 'cc', borderColor: PHASE_COLORS[i] + '30' } : {}}
                >
                  {revealedCells.has(i) ? hb.toUpperCase() : '??'}
                </div>
              ))}
            </div>
          </div>

          {/* Byte index row */}
          <div>
            <div className="text-[9px] text-slate-600 mb-1 pl-1">Byte Index</div>
            <div className="flex flex-wrap gap-1">
              {hexBytes.map((_: string, i: number) => (
                <div
                  key={i}
                  className={`w-9 h-5 flex items-center justify-center rounded text-[9px] transition-all ${
                    activeByte === i ? 'text-[#00f2fe] font-bold' : 'text-slate-700'
                  }`}
                >
                  b{i}
                </div>
              ))}
            </div>
          </div>

          {/* Active byte detail card */}
          {activeByte >= 0 && phase !== 'idle' && (
            <div
              className="mt-3 rounded-lg border p-3 text-xs space-y-2 transition-all duration-300"
              style={{ borderColor: PHASE_COLORS[activeByte] + '50', background: PHASE_COLORS[activeByte] + '08' }}
            >
              <div className="text-[10px] uppercase tracking-wider" style={{ color: PHASE_COLORS[activeByte] }}>
                ▶ Processing Byte {activeByte}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-0.5">
                  <div className="text-[9px] text-slate-600">ASCII</div>
                  <div className="text-white font-bold">{plaintext[activeByte] || '–'}</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[9px] text-slate-600">HEX</div>
                  <div className="font-bold" style={{ color: PHASE_COLORS[activeByte] }}>
                    0x{hexBytes[activeByte]?.toUpperCase() || '??'}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[9px] text-slate-600">Position</div>
                  <div className="font-bold text-[#00ff66]">
                    S[{COL_MAJOR_MAP[activeByte][0]}][{COL_MAJOR_MAP[activeByte][1]}]
                  </div>
                </div>
              </div>
              <div className="text-[9px] text-slate-500">
                Column {COL_MAJOR_MAP[activeByte][1]}, Row {COL_MAJOR_MAP[activeByte][0]}
                {' '}→ fills column-by-column
              </div>
            </div>
          )}
        </div>

        {/* CENTER: Animated arrow */}
        <div className="hidden lg:flex flex-col items-center gap-3">
          <div className="text-[9px] text-slate-600 uppercase tracking-widest">Column-Major</div>
          <div
            className={`flex flex-col items-center gap-1 transition-all duration-500 ${
              phase !== 'idle' ? 'opacity-100' : 'opacity-30'
            }`}
          >
            {[0,1,2].map(i => (
              <ArrowRight
                key={i}
                className={`w-5 h-5 transition-all duration-200 ${
                  phase !== 'idle'
                    ? 'text-[#00f2fe]'
                    : 'text-slate-700'
                }`}
                style={{
                  animationName: phase !== 'idle' ? 'pulse' : 'none',
                  animationDelay: `${i * 150}ms`,
                  animationDuration: '1s',
                  animationIterationCount: 'infinite',
                  opacity: phase !== 'idle' ? 1 - i * 0.25 : 0.2,
                }}
              />
            ))}
          </div>
          {activeByte >= 0 && phase !== 'idle' && (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300"
              style={{
                borderColor: PHASE_COLORS[activeByte],
                backgroundColor: PHASE_COLORS[activeByte] + '20',
                color: PHASE_COLORS[activeByte],
                boxShadow: `0 0 16px ${PHASE_COLORS[activeByte]}55`
              }}
            >
              b{activeByte}
            </div>
          )}
        </div>

        {/* RIGHT: 4×4 State Matrix */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-3">
            <Grid className="w-3 h-3" />
            <span>4×4 State Matrix</span>
          </div>

          {/* Column labels */}
          <div className="flex items-center gap-1 ml-10 mb-1">
            {[0,1,2,3].map(c => (
              <div key={c} className="w-14 text-center text-[9px] text-slate-600">Col {c}</div>
            ))}
          </div>

          {/* Matrix grid with row labels */}
          <div className="space-y-1">
            {[0,1,2,3].map(r => (
              <div key={r} className="flex items-center gap-1">
                <div className="text-[9px] text-slate-600 w-8 flex-shrink-0 text-right pr-1">Row {r}</div>
                {[0,1,2,3].map(c => {
                  // Which byte index maps to (r, c) in column-major?
                  const byteIdx = c * 4 + r;
                  const isActive = activeRow === r && activeCol === c;
                  const isRevealed = revealedCells.has(byteIdx);
                  const cellColor = PHASE_COLORS[byteIdx];
                  const flatIdx = r * 4 + c;
                  const cellVal = flatMatrix[flatIdx] || '??';

                  return (
                    <div
                      key={c}
                      className={`w-14 h-12 flex flex-col items-center justify-center rounded border text-[10px] transition-all duration-400 relative overflow-hidden ${
                        isActive
                          ? 'scale-115 z-10'
                          : isRevealed
                          ? 'scale-100'
                          : 'scale-95 opacity-40'
                      }`}
                      style={{
                        borderColor: isActive
                          ? cellColor
                          : isRevealed
                          ? cellColor + '60'
                          : '#1e293b',
                        backgroundColor: isActive
                          ? cellColor + '25'
                          : isRevealed
                          ? cellColor + '0d'
                          : '#030712',
                        boxShadow: isActive ? `0 0 18px ${cellColor}60` : 'none',
                        transform: isActive ? 'scale(1.12)' : 'scale(1)',
                      }}
                    >
                      {/* Pulse ring for active cell */}
                      {isActive && (
                        <div
                          className="absolute inset-0 rounded border-2 animate-ping"
                          style={{ borderColor: cellColor, opacity: 0.4 }}
                        />
                      )}
                      <div
                        className="font-bold text-[11px] leading-none"
                        style={{ color: isRevealed ? cellColor : '#334155' }}
                      >
                        {isRevealed ? cellVal.toUpperCase() : '·'}
                      </div>
                      <div className="text-[8px] mt-0.5" style={{ color: isRevealed ? cellColor + 'aa' : '#1e293b' }}>
                        S[{r}][{c}]
                      </div>
                      <div className="text-[7px]" style={{ color: isRevealed ? '#475569' : '#0f172a' }}>
                        b{byteIdx}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Progress indicator */}
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[9px] text-slate-600">
              <span>Bytes placed</span>
              <span className="text-[#00f2fe]">{revealedCells.size} / 16</span>
            </div>
            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(revealedCells.size / 16) * 100}%`,
                  background: 'linear-gradient(to right, #00f2fe, #00ff66)',
                }}
              />
            </div>
          </div>

          {phase === 'done' && (
            <div className="text-[10px] text-[#00ff66] text-center py-1 animate-pulse">
              ✓ State Matrix Complete — 128-bit block ready for AES rounds
            </div>
          )}
        </div>
      </div>

      {/* ── Column-major order reference table ── */}
      <div className="border border-slate-900 rounded-lg bg-[#05070a] overflow-hidden">
        <div className="px-4 py-2 border-b border-slate-900 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">Column-Major Order Reference</span>
          <span className="text-[10px] text-slate-600">byte index → matrix position S[row][col]</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b border-slate-900">
                <th className="px-3 py-1.5 text-left text-slate-600 font-normal">Byte #</th>
                {hexBytes.map((_: string, i: number) => (
                  <th
                    key={i}
                    className="px-2 py-1.5 text-center font-bold transition-all"
                    style={{ color: revealedCells.has(i) ? PHASE_COLORS[i] : '#334155' }}
                  >
                    {i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-900/50">
                <td className="px-3 py-1.5 text-slate-600">ASCII</td>
                {Array.from(plaintext.slice(0, 16)).map((ch, i) => (
                  <td key={i} className="px-2 py-1.5 text-center"
                    style={{ color: revealedCells.has(i) ? PHASE_COLORS[i] : '#334155' }}>
                    {ch}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-900/50">
                <td className="px-3 py-1.5 text-slate-600">Hex</td>
                {hexBytes.map((hb: string, i: number) => (
                  <td key={i} className="px-2 py-1.5 text-center font-bold"
                    style={{ color: revealedCells.has(i) ? PHASE_COLORS[i] : '#1e293b' }}>
                    {revealedCells.has(i) ? hb.toUpperCase() : '·'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-slate-600">S[r][c]</td>
                {COL_MAJOR_MAP.map(([r, c], i) => (
                  <td key={i} className="px-2 py-1.5 text-center"
                    style={{ color: revealedCells.has(i) ? PHASE_COLORS[i] + 'cc' : '#1e293b' }}>
                    [{r}][{c}]
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const AesSimulator: React.FC = () => {
  // Input states
  const [plaintext, setPlaintext] = useState('CYBERSECURITYLAB');
  const [secretKey, setSecretKey] = useState('MYSECRETKEY12345');
  const [keySize, setKeySize] = useState<128 | 192 | 256>(128);
  const [isEncrypt, setIsEncrypt] = useState(true);
  const [copied, setCopied] = useState(false);

  // Simulation trace data
  const [traceData, setTraceData] = useState<any>(null);
  const [keySchedule, setKeySchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Wizard state control
  const [activeStep, setActiveStep] = useState(1);
  const [activeRound, setActiveRound] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1200);

  const timerRef = useRef<any>(null);

  // Initial load
  useEffect(() => {
    handleRunSimulation();
  }, []);

  // Autoplay management
  useEffect(() => {
    if (isPlaying && traceData) {
      const maxRounds = (keySize === 128 ? 10 : keySize === 192 ? 12 : 14) - 1;
      timerRef.current = setInterval(() => {
        setActiveRound((prev) => {
          if (prev >= maxRounds) {
            setIsPlaying(false);
            return maxRounds;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, keySize, traceData]);

  // Adjust activeRound when keySize changes
  useEffect(() => {
    const limit = (keySize === 128 ? 10 : keySize === 192 ? 12 : 14) - 1;
    if (activeRound > limit) {
      setActiveRound(limit);
    }
  }, [keySize]);

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const endpoint = isEncrypt ? 'encrypt' : 'decrypt';
      const body = isEncrypt 
        ? { plaintext, key: secretKey, key_size: keySize }
        : { ciphertext: plaintext, key: secretKey, key_size: keySize };

      const response = await fetch(`http://127.0.0.1:8000/${endpoint}/aes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const data = await response.json();
        setTraceData(data.trace);
        setKeySchedule(data.key_schedule);
      } else {
        alert("Failed to run AES simulation. Verify key format.");
      }
    } catch (error) {
      console.error("AES Simulation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let len = keySize === 128 ? 16 : keySize === 192 ? 24 : 32;
    let res = '';
    for (let i = 0; i < len; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSecretKey(res);
  };

  const generateRandomPlaintext = () => {
    const samples = [
      'CYBERSECURITYLAB', 
      'AESBLOCKCIPHER99', 
      'TOPSECRETCONTENT', 
      'ENCRYPTMEQUICKLY', 
      'COMPUTERSCIENCE1'
    ];
    const sel = samples[Math.floor(Math.random() * samples.length)];
    setPlaintext(sel);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { id: 1, title: 'State Matrix Mapping', desc: '4x4 column-major mapping' },
    { id: 2, title: 'Key Expansion Schedule', desc: 'Rijndael word generation' },
    { id: 3, title: 'Initial AddRoundKey', desc: 'Original key XOR blending' },
    { id: 4, title: 'SubBytes Substitution', desc: 'AES S-box byte lookup' },
    { id: 5, title: 'ShiftRows Offsets', desc: 'Cyclic row-wise shifting' },
    { id: 6, title: 'MixColumns Matrix', desc: 'GF(2^8) linear combination' },
    { id: 7, title: 'AddRoundKey XOR', desc: 'Round key XOR blending' },
    { id: 8, title: 'Main AES Rounds', desc: 'Rounds loop execution' },
    { id: 9, title: 'Final Round & Cipher', desc: 'No MixColumns final block' }
  ];

  // Helper to render 4x4 matrix
  const renderStateMatrix = (matrix: string[][], highlightCell?: (r: number, c: number) => boolean, colorClass: string = 'text-[#00f2fe] border-[#00f2fe]/20') => {
    if (!matrix) return null;
    return (
      <div className="grid grid-cols-4 gap-2 w-56 mx-auto">
        {matrix.map((row, rIdx) => 
          row.map((val, cIdx) => {
            const highlight = highlightCell ? highlightCell(rIdx, cIdx) : false;
            return (
              <div 
                key={`${rIdx}-${cIdx}`}
                className={`h-12 flex items-center justify-center border font-mono text-sm rounded bg-slate-950/80 transition-all ${
                  highlight 
                    ? 'bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66] font-bold scale-105' 
                    : colorClass
                }`}
              >
                {val.toUpperCase()}
              </div>
            );
          })
        )}
      </div>
    );
  };

  const getMaxRounds = () => (keySize === 128 ? 10 : keySize === 192 ? 12 : 14);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Controls Column */}
      <div className="lg:col-span-4 space-y-6">
        <div className="glass-panel p-6 rounded-xl border border-[#00f2fe]/15 bg-[#090d16]/30">
          <h3 className="text-lg font-mono text-white mb-6 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#00f2fe]" />
            AES PARAMETERS
          </h3>

          <div className="space-y-4 font-mono text-sm">
            {/* Encrypt / Decrypt Toggle */}
            <div>
              <label className="block text-slate-400 mb-2 text-xs">MODE</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setIsEncrypt(true); setPlaintext('CYBERSECURITYLAB'); }}
                  className={`py-2 px-4 rounded border text-xs cursor-pointer transition-all ${
                    isEncrypt 
                      ? 'bg-[#00f2fe]/15 border-[#00f2fe] text-[#00f2fe] glow-blue' 
                      : 'border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  ENCRYPT
                </button>
                <button
                  onClick={() => { setIsEncrypt(false); setPlaintext('290C503FF7B901C2A5F899D463B18F9C'); }}
                  className={`py-2 px-4 rounded border text-xs cursor-pointer transition-all ${
                    !isEncrypt 
                      ? 'bg-[#9d4edd]/15 border-[#9d4edd] text-[#9d4edd] glow-purple' 
                      : 'border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  DECRYPT
                </button>
              </div>
            </div>

            {/* Key Size Selection */}
            <div>
              <label className="block text-slate-400 mb-2 text-xs">AES KEY STRENGTH</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[128, 192, 256].map((size) => (
                  <button
                    key={size}
                    onClick={() => { setKeySize(size as any); }}
                    className={`py-2 border text-xs rounded cursor-pointer transition-all ${
                      keySize === size
                        ? 'bg-[#00ff66]/10 border-[#00ff66] text-[#00ff66] glow-green'
                        : 'border-slate-850 text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    {size}-BIT
                  </button>
                ))}
              </div>
            </div>

            {/* Plaintext input */}
            <div>
              <label className="block text-slate-400 mb-1.5 text-xs">
                {isEncrypt ? 'PLAINTEXT (16 chars / ASCII)' : 'CIPHERTEXT (32 hex chars)'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-850 rounded px-3 py-2 text-white focus:outline-none focus:border-[#00f2fe] text-sm"
                  maxLength={isEncrypt ? 16 : 32}
                />
                <button
                  onClick={generateRandomPlaintext}
                  className="px-3 border border-slate-800 rounded bg-slate-900 text-slate-400 hover:text-white text-xs cursor-pointer"
                  title="Random input"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Key input */}
            <div>
              <label className="block text-slate-400 mb-1.5 text-xs">SECRET KEY STRING</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded pl-10 pr-3 py-2 text-white focus:outline-none focus:border-[#00f2fe] text-sm"
                  />
                </div>
                <button
                  onClick={generateRandomKey}
                  className="px-3 border border-slate-800 rounded bg-slate-900 text-slate-400 hover:text-white text-xs cursor-pointer"
                  title="Random key"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Trigger Simulation */}
            <button
              onClick={handleRunSimulation}
              disabled={loading}
              className="w-full py-3 bg-[#00f2fe]/10 border border-[#00f2fe]/30 hover:bg-[#00f2fe]/20 rounded text-[#00f2fe] font-bold text-xs tracking-wider transition-all cursor-pointer glow-blue mt-4"
            >
              {loading ? 'CALCULATING GALOIS FIELDS...' : 'RUN VISUALIZATION'}
            </button>
          </div>
        </div>

        {/* Steps Selection Wizard */}
        <div className="glass-panel p-4 rounded-xl border border-[#00f2fe]/15 bg-[#090d16]/30">
          <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4 px-2">STEPS TIMELINE</h4>
          <div className="space-y-1">
            {steps.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveStep(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded font-mono text-xs text-left cursor-pointer transition-all ${
                  activeStep === s.id
                    ? 'bg-[#00f2fe]/10 border-l-2 border-[#00f2fe] text-white'
                    : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  activeStep === s.id ? 'bg-[#00f2fe] text-black font-bold' : 'bg-slate-900 text-slate-500'
                }`}>
                  {s.id}
                </span>
                <div>
                  <div className="font-bold">{s.title}</div>
                  <div className="text-[10px] text-slate-500">{s.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulator panel */}
      <div className="lg:col-span-8 space-y-6">
        <div className="glass-panel p-6 rounded-xl border border-[#00f2fe]/15 min-h-[600px] flex flex-col justify-between">
          {!traceData ? (
            <div className="flex-1 flex flex-col items-center justify-center font-mono text-slate-500 py-20">
              <RefreshCw className="w-12 h-12 text-[#00f2fe] animate-spin mb-4" />
              <span>AWAITING ENCRYPTION INPUTS...</span>
            </div>
          ) : (
            <div className="space-y-6 flex-1">
              {/* Header */}
              <div className="border-b border-[#00f2fe]/15 pb-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-[#00f2fe]/10 text-[#00f2fe] px-2.5 py-1 rounded">
                    AES-{keySize} STEP {activeStep} / 9
                  </span>
                  <h3 className="text-xl font-bold font-mono text-white mt-2">
                    {steps[activeStep - 1].title}
                  </h3>
                </div>
                
                <div className="flex gap-2">
                  <button
                    disabled={activeStep === 1}
                    onClick={() => setActiveStep(prev => prev - 1)}
                    className="p-2 border border-slate-800 rounded bg-slate-900/60 text-slate-400 hover:text-white cursor-pointer disabled:opacity-45"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={activeStep === 9}
                    onClick={() => setActiveStep(prev => prev + 1)}
                    className="p-2 border border-slate-800 rounded bg-slate-900/60 text-slate-400 hover:text-white cursor-pointer disabled:opacity-45"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Screens */}
              <div className="py-4 flex-1 font-mono">
                {/* STEP 1: State Matrix Mapping — Full Animated Visualization */}
                {activeStep === 1 && (
                  <StateMatrixViz traceData={traceData} plaintext={plaintext} />
                )}

                {/* STEP 2: Key Expansion Schedule */}
                {activeStep === 2 && (
                  <div className="space-y-6">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The cipher key is expanded into a schedule of round keys using the Rijndael Key Schedule. 
                      Each round key consists of 4 words ($w_i$), generated through byte rotation (RotWord), S-box lookups (SubWord), and round constant XORs (Rcon).
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-slate-850 rounded-lg p-4 bg-[#05070a] h-[280px] overflow-y-auto space-y-1">
                        <span className="text-xs text-slate-500 block mb-2 px-1">EXPANDED WORD SCHEDULE</span>
                        {keySchedule.map((word) => (
                          <div
                            key={word.idx}
                            className={`flex items-center justify-between px-3 py-1.5 rounded text-xs border border-transparent ${
                              word.idx < (keySize/32) ? 'text-[#00ff66] bg-[#00ff66]/5' : 'text-slate-400'
                            }`}
                          >
                            <span>w{word.idx.toString().padStart(2, '0')}</span>
                            <span className="font-bold">0x{word.val.toUpperCase()}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border border-slate-850 rounded-lg p-4 bg-[#05070a] flex flex-col justify-between">
                        <div>
                          <span className="text-xs text-slate-500 block mb-3">KEY SCHEDULE FACTS</span>
                          <div className="space-y-3 text-xs text-slate-400">
                            <div>
                              <span className="text-white block font-semibold">Key size: {keySize} bits</span>
                              <span>Requires {getMaxRounds() + 1} round keys (total {(getMaxRounds() + 1) * 4} words).</span>
                            </div>
                            <div>
                              <span className="text-white block font-semibold">Rcon Constants:</span>
                              <span>Used to break symmetry in the key schedule generation loop.</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 leading-normal border-t border-slate-900 pt-3">
                          * Green rows indicate words copied directly from the original secret key.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Initial AddRoundKey */}
                {activeStep === 3 && (
                  <div className="space-y-6">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      In the initial round, the State Matrix is combined with the original key matrix ($K_0$) using a bitwise **XOR ($\oplus$)** operation.
                    </p>
                    
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-2">
                      <div className="space-y-2">
                        <span className="text-xs text-slate-500 block text-center">STATE IN</span>
                        {renderStateMatrix(traceData.initial_round.state_in, undefined, 'text-slate-400 border-slate-800')}
                      </div>
                      <div className="text-xl font-bold text-slate-600">&oplus;</div>
                      <div className="space-y-2">
                        <span className="text-xs text-[#9d4edd] block text-center">ROUND KEY ($K_0$)</span>
                        {renderStateMatrix(traceData.initial_round.round_key, undefined, 'text-[#9d4edd] border-[#9d4edd]/20')}
                      </div>
                      <div className="text-xl font-bold text-slate-600">=</div>
                      <div className="space-y-2">
                        <span className="text-xs text-[#00ff66] block text-center">STATE OUT</span>
                        {renderStateMatrix(traceData.initial_round.state_out, undefined, 'text-[#00ff66] border-[#00ff66]/20')}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: SubBytes Substitution */}
                {activeStep === 4 && (
                  <div className="space-y-6">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Each byte of the State Matrix is replaced with another byte from the non-linear **AES S-Box table**. This substitution provides confusion to prevent algebraic analysis of the cipher.
                    </p>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-center py-2">
                      <div className="space-y-2">
                        <span className="text-xs text-slate-500 block text-center">STATE IN (Round {activeRound})</span>
                        {renderStateMatrix(traceData.rounds[activeRound-1].sub_bytes.state_in, undefined, 'text-slate-400 border-slate-800')}
                      </div>
                      
                      <div className="border border-slate-850 rounded-lg p-4 bg-[#05070a] max-w-sm space-y-3 text-xs">
                        <span className="text-[#00f2fe] font-bold block mb-1">S-BOX LOOKUP PREVIEW</span>
                        <div className="space-y-2 text-slate-400">
                          <div>Hovering over state matrix cells looks up S-Box indexes.</div>
                          <div className="pt-2 border-t border-slate-900">
                            <span className="text-white font-bold">Example byte replacement:</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="bg-slate-900 px-2 py-1 rounded text-red-400">
                                0x{traceData.rounds[activeRound-1].sub_bytes.lookups[0].in}
                              </span>
                              <span>&rarr; S-Box &rarr;</span>
                              <span className="bg-[#00ff66]/10 px-2 py-1 rounded text-[#00ff66] font-bold">
                                0x{traceData.rounds[activeRound-1].sub_bytes.lookups[0].out}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs text-[#00ff66] block text-center">SUBSTITUTED OUT</span>
                        {renderStateMatrix(traceData.rounds[activeRound-1].sub_bytes.state_out, undefined, 'text-[#00ff66] border-[#00ff66]/20')}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: ShiftRows Offsets */}
                {activeStep === 5 && (
                  <div className="space-y-6">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The rows of the State Matrix are shifted cyclically to the left by offsets:
                      Row 0 is **not shifted**, Row 1 shifts **left by 1 byte**, Row 2 shifts **left by 2 bytes**, and Row 3 shifts **left by 3 bytes**.
                    </p>

                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center py-2">
                      <div className="space-y-2">
                        <span className="text-xs text-slate-500 block text-center">STATE IN</span>
                        {renderStateMatrix(traceData.rounds[activeRound-1].shift_rows.state_in, undefined, 'text-slate-400 border-slate-800')}
                      </div>

                      <div className="border border-slate-850 rounded-lg p-4 bg-[#05070a] text-xs space-y-3">
                        <span className="text-[#00f2fe] font-bold block">SHIFT SCHEME</span>
                        <div className="space-y-1 text-[11px] text-slate-500">
                          <div>Row 0: Shift &larr; 0 bytes</div>
                          <div>Row 1: Shift &larr; 1 byte</div>
                          <div>Row 2: Shift &larr; 2 bytes</div>
                          <div>Row 3: Shift &larr; 3 bytes</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs text-[#00ff66] block text-center">SHIFTED OUT</span>
                        {renderStateMatrix(traceData.rounds[activeRound-1].shift_rows.state_out, undefined, 'text-[#00ff66] border-[#00ff66]/20')}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: MixColumns Matrix */}
                {activeStep === 6 && (
                  <div className="space-y-6">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Each column of the State Matrix is treated as a polynomial over GF($2^8$) and multiplied modulo $x^4 + 1$ by a fixed matrix. This mixes the bytes in each column, providing diffusion.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 items-center justify-center py-2">
                      <div className="space-y-2">
                        <span className="text-xs text-slate-500 block text-center">STATE IN</span>
                        {renderStateMatrix(traceData.rounds[activeRound-1].mix_columns.state_in, undefined, 'text-slate-400 border-slate-800')}
                      </div>

                      {/* Galois equations box */}
                      <div className="border border-slate-850 rounded-lg p-4 bg-[#05070a] max-w-sm space-y-2 text-xs">
                        <span className="text-[#9d4edd] font-bold block">GF($2^8$) LINEAR CALCULATION</span>
                        <div className="space-y-1.5 text-slate-400 text-[10px] font-mono leading-normal max-h-40 overflow-y-auto">
                          {traceData.rounds[activeRound-1].mix_columns.equations.map((eq: string, idx: number) => (
                            <div key={idx}>{eq}</div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs text-[#00ff66] block text-center">MIXED OUT</span>
                        {renderStateMatrix(traceData.rounds[activeRound-1].mix_columns.state_out, undefined, 'text-[#00ff66] border-[#00ff66]/20')}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: AddRoundKey XOR */}
                {activeStep === 7 && (
                  <div className="space-y-6">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The State Matrix is XORed with the Round Key generated for this specific round.
                    </p>
                    
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-2">
                      <div className="space-y-2">
                        <span className="text-xs text-slate-500 block text-center">STATE IN</span>
                        {renderStateMatrix(traceData.rounds[activeRound-1].add_round_key.state_in, undefined, 'text-slate-400 border-slate-800')}
                      </div>
                      <div className="text-xl font-bold text-slate-600">&oplus;</div>
                      <div className="space-y-2">
                        <span className="text-xs text-[#9d4edd] block text-center">ROUND KEY ($K_{activeRound}$)</span>
                        {renderStateMatrix(traceData.rounds[activeRound-1].add_round_key.round_key, undefined, 'text-[#9d4edd] border-[#9d4edd]/20')}
                      </div>
                      <div className="text-xl font-bold text-slate-600">=</div>
                      <div className="space-y-2">
                        <span className="text-xs text-[#00ff66] block text-center">STATE OUT</span>
                        {renderStateMatrix(traceData.rounds[activeRound-1].add_round_key.state_out, undefined, 'text-[#00ff66] border-[#00ff66]/20')}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 8: Main AES Rounds */}
                {activeStep === 8 && (
                  <div className="space-y-6">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      AES loops through these main operations (SubBytes, ShiftRows, MixColumns, AddRoundKey) for multiple rounds depending on the key size.
                    </p>

                    {/* Autoplay Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-4 rounded-lg border border-slate-850">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className={`p-3 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                            isPlaying 
                              ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40' 
                              : 'bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/40 glow-green'
                          }`}
                        >
                          {isPlaying ? <Pause className="w-5 h-5 fill-rose-500" /> : <Play className="w-5 h-5 fill-[#00ff66]" />}
                        </button>
                        
                        <div>
                          <span className="text-xs text-slate-500 block font-mono">ROUND CONTROLLER</span>
                          <span className="text-white text-sm font-bold font-mono">
                            ROUND {activeRound} / {getMaxRounds() - 1}
                          </span>
                        </div>
                      </div>

                      {/* Speed Slider */}
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-[10px] text-slate-500 uppercase">SPEED</span>
                        <input
                          type="range"
                          min="400"
                          max="2200"
                          step="100"
                          value={playbackSpeed}
                          onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                          className="w-24 accent-[#00f2fe] cursor-pointer"
                        />
                        <span className="text-[10px] text-[#00f2fe] font-bold">{(playbackSpeed/1000).toFixed(1)}s</span>
                      </div>

                      <div className="flex gap-1.5 font-mono">
                        {[1, 3, 6, 9].map((r) => (
                          <button
                            key={r}
                            onClick={() => { setIsPlaying(false); setActiveRound(r); }}
                            className={`px-2.5 py-1 border text-[10px] rounded cursor-pointer ${
                              activeRound === r
                                ? 'bg-[#00f2fe]/20 border-[#00f2fe] text-[#00f2fe]'
                                : 'border-slate-850 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            R{r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="border border-slate-850 rounded-lg p-4 bg-[#05070a] space-y-2">
                        <span className="text-xs text-slate-500 block text-center">ROUND {activeRound} STATE IN</span>
                        {renderStateMatrix(traceData.rounds[activeRound-1].state_in, undefined, 'text-slate-400 border-slate-800')}
                      </div>
                      <div className="border border-slate-850 rounded-lg p-4 bg-[#05070a] space-y-2">
                        <span className="text-xs text-[#00ff66] block text-center">ROUND {activeRound} STATE OUT</span>
                        {renderStateMatrix(traceData.rounds[activeRound-1].add_round_key.state_out, undefined, 'text-[#00ff66] border-[#00ff66]/20')}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 9: Final Round & Ciphertext */}
                {activeStep === 9 && (
                  <div className="space-y-6">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The final round of AES does **not include the MixColumns operation**. It performs SubBytes, ShiftRows, and AddRoundKey, outputting the final encrypted Ciphertext.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 items-center justify-center py-2">
                      <div className="space-y-2">
                        <span className="text-xs text-slate-500 block text-center">STATE IN (Round {getMaxRounds()})</span>
                        {renderStateMatrix(traceData.final_round.state_in, undefined, 'text-slate-400 border-slate-800')}
                      </div>

                      <div className="text-slate-500 text-xs text-center">&rarr; SubBytes &rarr; ShiftRows &rarr; AddRoundKey &rarr;</div>

                      <div className="space-y-2">
                        <span className="text-xs text-[#00ff66] block text-center">FINAL STATE MATRIX</span>
                        {renderStateMatrix(traceData.final_round.add_round_key.state_out, undefined, 'text-[#00ff66] border-[#00ff66]/20')}
                      </div>
                    </div>

                    <div className="border border-[#00f2fe]/20 bg-[#00f2fe]/5 rounded-lg p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">AES CIPHERTEXT HEX</span>
                        <div className="text-2xl font-bold text-[#00f2fe] tracking-wider">
                          0x{traceData.ciphertext_hex.toUpperCase()}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(traceData.ciphertext_hex)}
                        className="flex items-center gap-2 px-4 py-2 border border-[#00f2fe]/30 rounded bg-[#00f2fe]/10 text-[#00f2fe] text-xs font-bold cursor-pointer hover:bg-[#00f2fe]/20 active:scale-95 transition-all"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-[#00ff66]" />
                            <span>COPIED!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>COPY CIPHERTEXT</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="pt-4 border-t border-slate-850">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mb-1">
                  <span>ROUND PROGRESSION</span>
                  <span>{activeRound} / {getMaxRounds()}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00f2fe] to-[#00ff66] transition-all duration-300"
                    style={{ width: `${(activeRound / getMaxRounds()) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
