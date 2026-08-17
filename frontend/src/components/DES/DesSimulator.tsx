import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw, 
  Sliders, 
  Key, 
  Sparkles,
  ArrowRightLeft,
  Copy,
  Check
} from 'lucide-react';

const E = [
  32, 1, 2, 3, 4, 5,
  4, 5, 6, 7, 8, 9,
  8, 9, 10, 11, 12, 13,
  12, 13, 14, 15, 16, 17,
  16, 17, 18, 19, 20, 21,
  20, 21, 22, 23, 24, 25,
  24, 25, 26, 27, 28, 29,
  28, 29, 30, 31, 32, 1
];

const P = [
  16, 7, 20, 21, 29, 12, 28, 17,
  1, 15, 23, 26, 5, 18, 31, 10,
  2, 8, 24, 14, 32, 27, 3, 9,
  19, 13, 30, 6, 22, 11, 4, 25
];

const S_BOXES = [
  [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
  ],
  [
    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
  ],
  [
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
  ],
  [
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
  ],
  [
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
  ],
  [
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
  ],
  [
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
  ],
  [
    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
  ]
];


// Standard DES Initial Permutation table (1-based indices)
const IP_TABLE = [
  58,50,42,34,26,18,10,2,
  60,52,44,36,28,20,12,4,
  62,54,46,38,30,22,14,6,
  64,56,48,40,32,24,16,8,
  57,49,41,33,25,17,9,1,
  59,51,43,35,27,19,11,3,
  61,53,45,37,29,21,13,5,
  63,55,47,39,31,23,15,7
];

/* ── IpViz: Initial Permutation Visualization ── */
const IpViz: React.FC<{ traceData: any; formatBin: (s: string, g?: number) => string }> = ({ traceData, formatBin }) => {
  const [hoveredOut, setHoveredOut] = useState<number | null>(null);
  const [animBit, setAnimBit]       = useState<number | null>(null);
  const [tab, setTab]               = useState<'table'|'flow'>('table');
  const timerRef = useRef<any>(null);

  const inputBits  = traceData.initial_permutation.input.split('') as string[];
  const outputBits = traceData.initial_permutation.output.split('') as string[];

  // For hovered output position i, the source input bit is IP_TABLE[i]-1
  const srcIdx = hoveredOut !== null ? IP_TABLE[hoveredOut] - 1 : null;

  const startAnim = () => {
    let i = 0;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setAnimBit(i);
      i++;
      if (i >= 64) { clearInterval(timerRef.current); setAnimBit(null); }
    }, 60);
  };

  return (
    <div className="space-y-4 font-mono">
      <div>
        <h4 className="text-sm font-bold text-white mb-1">Initial Permutation (IP)</h4>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          DES shuffles all 64 bits via a fixed <span className="text-[#00f2fe]">IP table</span>.
          Output bit <span className="text-[#00f2fe]">i</span> is taken from input bit position{' '}
          <span className="text-[#00ff66]">IP[i]</span>. Hover any output cell to trace its source.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        {(['table','flow'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1 text-[10px] rounded border cursor-pointer transition-all uppercase tracking-wider ${
              tab === t ? 'bg-[#00f2fe]/10 border-[#00f2fe] text-[#00f2fe]' : 'border-slate-800 text-slate-500 hover:border-slate-700'
            }`}>
            {t === 'table' ? 'IP Table' : 'Bit Flow'}
          </button>
        ))}
        <button onClick={startAnim}
          className="px-3 py-1 text-[10px] rounded border border-[#00ff66]/40 text-[#00ff66] bg-[#00ff66]/5 cursor-pointer hover:bg-[#00ff66]/10 uppercase tracking-wider">
          ▶ Animate
        </button>
      </div>

      {tab === 'table' && (
        <div className="space-y-4">
          {/* Input bits strip */}
          <div>
            <div className="text-[9px] text-slate-600 mb-1">INPUT BITS (position 1–64) — hover output to highlight source</div>
            <div className="flex flex-wrap gap-0.5">
              {inputBits.map((b, i) => (
                <div key={i}
                  className={`w-7 h-7 flex items-center justify-center rounded text-[9px] font-bold border transition-all duration-150 ${
                    srcIdx === i
                      ? 'bg-[#00ff66]/30 border-[#00ff66] text-[#00ff66] scale-125 z-10 shadow-[0_0_8px_#00ff6688]'
                      : animBit === i
                      ? 'bg-[#00f2fe]/20 border-[#00f2fe] text-[#00f2fe]'
                      : 'border-slate-900 text-slate-600 bg-slate-950'
                  }`}
                  title={`Input bit ${i+1}`}
                >
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* IP permutation table — 8×8 grid */}
          <div>
            <div className="text-[9px] text-slate-600 mb-1">IP LOOKUP TABLE — each cell = "take from input position #"</div>
            <div className="grid grid-cols-8 gap-1">
              {IP_TABLE.map((srcPos, outIdx) => {
                const isHov = hoveredOut === outIdx;
                return (
                  <div key={outIdx}
                    onMouseEnter={() => setHoveredOut(outIdx)}
                    onMouseLeave={() => setHoveredOut(null)}
                    className={`h-9 flex flex-col items-center justify-center rounded border cursor-default transition-all duration-150 ${
                      isHov
                        ? 'bg-[#00f2fe]/20 border-[#00f2fe] scale-110 z-10 shadow-[0_0_10px_#00f2fe44]'
                        : 'border-slate-900 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <span className={`text-[9px] font-bold ${isHov ? 'text-[#00f2fe]' : 'text-slate-500'}`}>{srcPos}</span>
                    <span className={`text-[7px] ${isHov ? 'text-[#00f2fe]/70' : 'text-slate-700'}`}>→{outIdx+1}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Output bits strip */}
          <div>
            <div className="text-[9px] text-slate-600 mb-1">OUTPUT BITS (after permutation)</div>
            <div className="flex flex-wrap gap-0.5">
              {outputBits.map((b, i) => (
                <div key={i}
                  onMouseEnter={() => setHoveredOut(i)}
                  onMouseLeave={() => setHoveredOut(null)}
                  className={`w-7 h-7 flex items-center justify-center rounded text-[9px] font-bold border cursor-default transition-all duration-150 ${
                    hoveredOut === i
                      ? 'bg-[#00f2fe]/30 border-[#00f2fe] text-[#00f2fe] scale-125 z-10 shadow-[0_0_8px_#00f2fe88]'
                      : 'border-slate-800 text-[#00f2fe]/70 bg-[#00f2fe]/5'
                  }`}
                  title={`Output bit ${i+1} ← from input bit ${IP_TABLE[i]}`}
                >
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* Live hover info */}
          {hoveredOut !== null && (
            <div className="border border-[#00f2fe]/30 bg-[#00f2fe]/5 rounded-lg p-3 text-xs flex gap-8">
              <div><div className="text-[9px] text-slate-500">OUTPUT POSITION</div><div className="text-[#00f2fe] font-bold text-base">{hoveredOut+1}</div></div>
              <div><div className="text-[9px] text-slate-500">← TAKEN FROM INPUT</div><div className="text-[#00ff66] font-bold text-base">Bit #{IP_TABLE[hoveredOut]}</div></div>
              <div><div className="text-[9px] text-slate-500">BIT VALUE</div><div className="text-white font-bold text-base">{inputBits[IP_TABLE[hoveredOut]-1]}</div></div>
            </div>
          )}
        </div>
      )}

      {tab === 'flow' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-[10px] text-slate-500 uppercase">Before IP (Input)</div>
              <div className="bg-slate-950 border border-slate-900 rounded p-3 text-[10px] text-slate-400 font-mono break-all leading-5 select-all">
                {formatBin(traceData.initial_permutation.input, 8)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] text-[#00f2fe] uppercase">After IP (Output)</div>
              <div className="bg-[#00f2fe]/5 border border-[#00f2fe]/20 rounded p-3 text-[10px] text-[#00f2fe] font-mono break-all leading-5 select-all">
                {formatBin(traceData.initial_permutation.output, 8)}
              </div>
            </div>
          </div>

          {/* Bit diff visual */}
          <div>
            <div className="text-[9px] text-slate-600 mb-2">BIT POSITION CHANGES — green = bit moved, grey = same position</div>
            <div className="flex flex-wrap gap-0.5">
              {IP_TABLE.map((srcPos, outIdx) => {
                const moved = srcPos !== outIdx + 1;
                return (
                  <div key={outIdx}
                    className={`w-7 h-5 flex items-center justify-center rounded text-[8px] border transition-all ${
                      moved ? 'bg-[#00ff66]/10 border-[#00ff66]/40 text-[#00ff66]' : 'border-slate-900 text-slate-700'
                    }`}
                    title={`Out[${outIdx+1}] ← In[${srcPos}]`}
                  >
                    {outputBits[outIdx]}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-2 text-[9px]">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#00ff66]/20 border border-[#00ff66]/40 inline-block"/><span className="text-slate-500">Bit moved ({IP_TABLE.filter((s,i)=>s!==i+1).length} bits)</span></span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-slate-800 inline-block"/><span className="text-slate-500">Same position ({IP_TABLE.filter((s,i)=>s===i+1).length} bits)</span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── BlockSplitViz: 64-bit → L0 + R0 Visualization ── */
const BlockSplitViz: React.FC<{ traceData: any; formatBin: (s: string, g?: number) => string }> = ({ traceData, formatBin }) => {
  const [revealed, setRevealed] = useState<'none'|'all'|'left'|'right'>('none');
  const [animStep, setAnimStep] = useState(0);
  const timerRef = useRef<any>(null);

  const permBits  = traceData.initial_permutation.output.split('') as string[];
  const leftBits  = traceData.rounds[0].left_in.split('')  as string[];
  const rightBits = traceData.rounds[0].right_in.split('') as string[];

  const animate = () => {
    setRevealed('none'); setAnimStep(0);
    let step = 0;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      step++;
      setAnimStep(step);
      if (step === 1) setRevealed('left');
      if (step === 2) setRevealed('all');
      if (step >= 3)  clearInterval(timerRef.current);
    }, 700);
  };

  return (
    <div className="space-y-5 font-mono">
      <div>
        <h4 className="text-sm font-bold text-white mb-1">Block Splitting L0 / R0</h4>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          After IP, the 64-bit block is sliced exactly in half.
          Bits <span className="text-[#00f2fe]">1–32</span> form <span className="text-[#00f2fe]">L₀</span> (Left),
          bits <span className="text-[#9d4edd]">33–64</span> form <span className="text-[#9d4edd]">R₀</span> (Right).
          Both 32-bit halves enter the 16 Feistel rounds.
        </p>
      </div>

      {/* Animate button */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={animate}
          className="px-3 py-1.5 text-[10px] rounded border border-[#00f2fe]/40 text-[#00f2fe] bg-[#00f2fe]/5 cursor-pointer hover:bg-[#00f2fe]/10 uppercase tracking-wider">
          ▶ Animate Split
        </button>
        <button onClick={() => setRevealed('all')}
          className="px-3 py-1.5 text-[10px] rounded border border-slate-800 text-slate-400 cursor-pointer hover:border-slate-700 uppercase tracking-wider">
          Show All
        </button>
        <button onClick={() => { setRevealed('none'); setAnimStep(0); clearInterval(timerRef.current); }}
          className="px-3 py-1.5 text-[10px] rounded border border-slate-800 text-slate-400 cursor-pointer hover:border-slate-700 uppercase tracking-wider">
          Reset
        </button>
      </div>

      {/* 64-bit block with split indicator */}
      <div className="space-y-2">
        <div className="text-[9px] text-slate-600">64-BIT PERMUTED BLOCK (IP output) — split at bit 32 ↓</div>
        <div className="flex flex-wrap gap-0.5 relative">
          {permBits.map((b, i) => {
            const isLeft  = i < 32;
            const isRight = i >= 32;
            const showL   = revealed === 'left' || revealed === 'all';
            const showR   = revealed === 'all';
            return (
              <div key={i}
                className={`w-7 h-8 flex flex-col items-center justify-center rounded text-[9px] font-bold border transition-all duration-300 ${
                  isLeft && showL
                    ? 'bg-[#00f2fe]/15 border-[#00f2fe]/60 text-[#00f2fe]'
                    : isRight && showR
                    ? 'bg-[#9d4edd]/15 border-[#9d4edd]/60 text-[#9d4edd]'
                    : 'border-slate-900 text-slate-500 bg-slate-950'
                } ${i === 31 ? 'mr-2' : ''}`}
                title={`Bit ${i+1}`}
              >
                <span>{b}</span>
                <span className="text-[6px] opacity-50">{i+1}</span>
              </div>
            );
          })}
          {/* Split line */}
          <div className="absolute top-0 bottom-0 flex items-center" style={{ left: `calc(32 * (1.75rem + 0.125rem) + 0.25rem)` }}>
            <div className={`w-0.5 h-full rounded transition-all duration-500 ${animStep >= 1 ? 'bg-yellow-400 shadow-[0_0_8px_#facc15]' : 'bg-slate-800'}`} />
          </div>
        </div>

        {/* Labels under the split */}
        <div className="flex gap-2">
          <div className={`flex-1 text-center text-[9px] py-1 rounded border transition-all duration-500 ${animStep >= 1 ? 'border-[#00f2fe]/40 text-[#00f2fe] bg-[#00f2fe]/5' : 'border-slate-900 text-slate-700'}`}>
            L₀ — bits 1–32
          </div>
          <div className={`flex-1 text-center text-[9px] py-1 rounded border transition-all duration-500 ${animStep >= 2 ? 'border-[#9d4edd]/40 text-[#9d4edd] bg-[#9d4edd]/5' : 'border-slate-900 text-slate-700'}`}>
            R₀ — bits 33–64
          </div>
        </div>
      </div>

      {/* Two halves detail cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`border rounded-lg p-4 space-y-2 transition-all duration-500 ${animStep >= 1 ? 'border-[#00f2fe]/30 bg-[#00f2fe]/5' : 'border-slate-900 bg-slate-950/40 opacity-40'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[#00f2fe] font-bold text-xs">L₀ — Left Half</span>
            <span className="text-[9px] text-slate-500">32 bits</span>
          </div>
          <div className="text-[10px] text-slate-300 break-all select-all leading-5">
            {formatBin(traceData.rounds[0].left_in, 8)}
          </div>
          <div className="text-[9px] text-slate-600">Becomes L₁ (passed directly to next round)</div>
          {/* Mini bit grid */}
          <div className="flex flex-wrap gap-0.5 mt-1">
            {leftBits.map((b, i) => (
              <div key={i} className={`w-5 h-5 flex items-center justify-center rounded text-[8px] border ${b === '1' ? 'border-[#00f2fe]/50 text-[#00f2fe] bg-[#00f2fe]/10' : 'border-slate-900 text-slate-700'}`}>{b}</div>
            ))}
          </div>
          <div className="text-[9px] text-slate-600 mt-1">
            Ones: {leftBits.filter(b=>b==='1').length} &nbsp;|&nbsp; Zeros: {leftBits.filter(b=>b==='0').length}
          </div>
        </div>

        <div className={`border rounded-lg p-4 space-y-2 transition-all duration-500 ${animStep >= 2 ? 'border-[#9d4edd]/30 bg-[#9d4edd]/5' : 'border-slate-900 bg-slate-950/40 opacity-40'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[#9d4edd] font-bold text-xs">R₀ — Right Half</span>
            <span className="text-[9px] text-slate-500">32 bits</span>
          </div>
          <div className="text-[10px] text-slate-300 break-all select-all leading-5">
            {formatBin(traceData.rounds[0].right_in, 8)}
          </div>
          <div className="text-[9px] text-slate-600">Enters Feistel function f(R₀, K₁)</div>
          <div className="flex flex-wrap gap-0.5 mt-1">
            {rightBits.map((b, i) => (
              <div key={i} className={`w-5 h-5 flex items-center justify-center rounded text-[8px] border ${b === '1' ? 'border-[#9d4edd]/50 text-[#9d4edd] bg-[#9d4edd]/10' : 'border-slate-900 text-slate-700'}`}>{b}</div>
            ))}
          </div>
          <div className="text-[9px] text-slate-600 mt-1">
            Ones: {rightBits.filter(b=>b==='1').length} &nbsp;|&nbsp; Zeros: {rightBits.filter(b=>b==='0').length}
          </div>
        </div>
      </div>

      {/* Flow summary */}
      <div className="border border-slate-900 rounded-lg bg-[#05070a] p-3 text-[10px] text-slate-500 flex items-center gap-3">
        <div className="text-center"><div className="text-white font-bold">64</div><div>IP Output</div></div>
        <div className="flex-1 h-px bg-slate-800 relative"><div className="absolute inset-0 flex items-center justify-center text-[9px] text-yellow-400">split ÷2</div></div>
        <div className="text-center"><div className="text-[#00f2fe] font-bold">32</div><div>L₀</div></div>
        <div className="text-[10px] text-slate-700">+</div>
        <div className="text-center"><div className="text-[#9d4edd] font-bold">32</div><div>R₀</div></div>
        <div className="flex-1 h-px bg-slate-800 relative"><div className="absolute inset-0 flex items-center justify-center text-[9px] text-slate-600">→ rounds</div></div>
        <div className="text-center"><div className="text-[#00ff66] font-bold">16×</div><div>Feistel</div></div>
      </div>
    </div>
  );
};

export const DesSimulator: React.FC = () => {

  // Input states
  const [plaintext, setPlaintext] = useState('CRYPTO12');
  const [secretKey, setSecretKey] = useState('MYKEY123');
  const [isEncrypt, setIsEncrypt] = useState(true);
  const [copied, setCopied] = useState(false);

  // Trace data from API
  const [traceData, setTraceData] = useState<any>(null);
  const [keySchedule, setKeySchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Visualization control states
  const [activeStep, setActiveStep] = useState(1);
  const [activeRound, setActiveRound] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per step
  const [selectedSbox, setSelectedSbox] = useState(0);

  const timerRef = useRef<any>(null);

  // Load initial simulation trace
  useEffect(() => {
    handleRunSimulation();
  }, []);

  // Handle Play/Pause autoplay
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setActiveRound((prev) => {
          if (prev >= 16) {
            setIsPlaying(false);
            return 16;
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
  }, [isPlaying, playbackSpeed]);

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const endpoint = isEncrypt ? 'encrypt' : 'decrypt';
      const body = isEncrypt 
        ? { plaintext, key: secretKey }
        : { ciphertext: plaintext, key: secretKey };

      const response = await fetch(`http://127.0.0.1:8000/${endpoint}/des`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const data = await response.json();
        setTraceData(data.trace);
        setKeySchedule(data.key_schedule);
      } else {
        alert("Failed to run DES simulation. Ensure key is 8 characters long.");
      }
    } catch (error) {
      console.error("DES Simulation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let res = '';
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSecretKey(res);
  };

  const generateRandomPlaintext = () => {
    const samples = ['SECURE64', 'CYBERLAB', 'LOCKDESK', 'MYSECRET', 'HACKER99', 'CODEWORD'];
    const sel = samples[Math.floor(Math.random() * samples.length)];
    setPlaintext(sel);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to split a bitstring into readable 8-bit blocks
  const formatBin = (binStr: string, groupSize: number = 8) => {
    if (!binStr) return '';
    const regex = new RegExp(`.{1,${groupSize}}`, 'g');
    return binStr.match(regex)?.join(' ') || binStr;
  };

  // Steps definition for simulator UI
  const steps = [
    { id: 1, title: 'Plaintext Conversion', desc: 'Binary Block creation' },
    { id: 2, title: 'Initial Permutation (IP)', desc: 'Re-arranging block bits' },
    { id: 3, title: 'Block Splitting', desc: 'Left and Right 32-bit halves' },
    { id: 4, title: 'Key Generation Schedule', desc: 'Circular shifts & PC-2' },
    { id: 5, title: 'Feistel: Expansion (E)', desc: 'Scaling right half to 48-bit' },
    { id: 6, title: 'Feistel: Round Key XOR', desc: 'Adding confusion value' },
    { id: 7, title: 'Feistel: S-Box Substitution', desc: 'Non-linear mapping matrix' },
    { id: 8, title: 'Feistel: Permutation (P)', desc: 'Diffusing bits' },
    { id: 9, title: 'Block Swap', desc: 'Crossing left & right output' },
    { id: 10, title: 'Feistel Rounds Execution', desc: 'Play 16 Rounds engine' },
    { id: 11, title: 'Final Permutation (FP)', desc: 'Reversing IP to get Ciphertext' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Control Panel (Left column) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="glass-panel p-6 rounded-xl border border-[#00f2fe]/15 bg-[#090d16]/30">
          <h3 className="text-lg font-mono text-white mb-6 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#00f2fe]" />
            SIMULATOR INPUTS
          </h3>

          <div className="space-y-4 font-mono text-sm">
            {/* Algorithm Mode Selection */}
            <div>
              <label className="block text-slate-400 mb-2 text-xs">ALGORITHM MODE</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setIsEncrypt(true); setPlaintext('CRYPTO12'); }}
                  className={`py-2 px-4 rounded border text-xs cursor-pointer transition-all ${
                    isEncrypt 
                      ? 'bg-[#00f2fe]/15 border-[#00f2fe] text-[#00f2fe] glow-blue' 
                      : 'border-slate-850 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  ENCRYPT
                </button>
                <button
                  onClick={() => { setIsEncrypt(false); setPlaintext('D4B2C84A9E24F530'); }}
                  className={`py-2 px-4 rounded border text-xs cursor-pointer transition-all ${
                    !isEncrypt 
                      ? 'bg-[#9d4edd]/15 border-[#9d4edd] text-[#9d4edd] glow-purple' 
                      : 'border-slate-850 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  DECRYPT
                </button>
              </div>
            </div>

            {/* Input string */}
            <div>
              <label className="block text-slate-400 mb-1.5 text-xs">
                {isEncrypt ? 'PLAINTEXT (8 chars / ASCII)' : 'CIPHERTEXT (16 hex chars)'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-850 rounded px-3 py-2 text-white focus:outline-none focus:border-[#00f2fe] text-sm"
                  maxLength={isEncrypt ? 8 : 16}
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
              <label className="block text-slate-400 mb-1.5 text-xs">SECRET KEY (8 characters)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded pl-10 pr-3 py-2 text-white focus:outline-none focus:border-[#00f2fe] text-sm"
                    maxLength={8}
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

            {/* Trigger Simulation button */}
            <button
              onClick={handleRunSimulation}
              disabled={loading}
              className="w-full py-3 bg-[#00f2fe]/10 border border-[#00f2fe]/30 hover:bg-[#00f2fe]/20 rounded text-[#00f2fe] font-bold text-xs tracking-wider transition-all cursor-pointer glow-blue mt-4"
            >
              {loading ? 'SIMULATING BITSTREAMS...' : 'RUN VISUALIZATION'}
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

      {/* Interactive Simulation Dashboard (Right column) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Simulator Content Area */}
        <div className="glass-panel p-6 rounded-xl border border-[#00f2fe]/15 min-h-[600px] flex flex-col justify-between">
          {!traceData ? (
            <div className="flex-1 flex flex-col items-center justify-center font-mono text-slate-500 py-20">
              <RefreshCw className="w-12 h-12 text-[#00f2fe] animate-spin mb-4" />
              <span>AWAITING ENCRYPTION INPUTS...</span>
            </div>
          ) : (
            <div className="space-y-6 flex-1">
              {/* Active Step Banner */}
              <div className="border-b border-[#00f2fe]/15 pb-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-[#00f2fe]/10 text-[#00f2fe] px-2.5 py-1 rounded">
                    STEP {activeStep} / 11
                  </span>
                  <h3 className="text-xl font-bold font-mono text-white mt-2">
                    {steps[activeStep - 1].title}
                  </h3>
                </div>
                
                {/* Navigation controls */}
                <div className="flex gap-2">
                  <button
                    disabled={activeStep === 1}
                    onClick={() => setActiveStep(prev => prev - 1)}
                    className="p-2 border border-slate-800 rounded bg-slate-900/60 text-slate-400 hover:text-white cursor-pointer disabled:opacity-45"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={activeStep === 11}
                    onClick={() => setActiveStep(prev => prev + 1)}
                    className="p-2 border border-slate-800 rounded bg-slate-900/60 text-slate-400 hover:text-white cursor-pointer disabled:opacity-45"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Step Visualization Screens */}
              <div className="py-4 flex-1">
                {/* STEP 1: Conversion */}
                {activeStep === 1 && (
                  <div className="space-y-6 font-mono">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      DES operates on 64-bit binary blocks. The input plaintext string is converted character-by-character into ASCII values, and then mapped into 8-bit binary strings.
                    </p>
                    <div className="grid grid-cols-8 gap-4 border border-slate-850 p-4 rounded-lg bg-[#05070a]">
                      {plaintext.split('').map((char, idx) => (
                        <div key={idx} className="text-center p-2 border border-slate-900 rounded bg-slate-950">
                          <div className="text-[#00ff66] font-bold text-lg">{char}</div>
                          <div className="text-[10px] text-slate-500 mt-1">ASCII {char.charCodeAt(0)}</div>
                          <div className="text-[9px] text-[#00f2fe] mt-2 font-mono break-all">
                            {char.charCodeAt(0).toString(2).padStart(8, '0')}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs text-slate-400">ASSEMBLED 64-BIT BINARY BLOCK:</h4>
                      <div className="bg-slate-950 p-4 rounded border border-slate-900 text-xs font-mono text-glow-green text-[#00ff66] break-all leading-normal tracking-widest select-all">
                        {formatBin(traceData.plaintext_binary, 8)}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Initial Permutation (IP) — Rich Visualization */}
                {activeStep === 2 && (
                  <IpViz traceData={traceData} formatBin={formatBin} />
                )}

                {/* STEP 3: Block Splitting — Rich Visualization */}
                {activeStep === 3 && (
                  <BlockSplitViz traceData={traceData} formatBin={formatBin} />
                )}

                {/* STEP 4: Key Generation Schedule */}
                {activeStep === 4 && (
                  <div className="space-y-6 font-mono">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The 64-bit secret key is compressed to 56 bits (excluding parity bits) via Permuted Choice 1 (PC-1). It is split into two 28-bit halves, left-shifted by 1 or 2 bits depending on the round, and permuted via Permuted Choice 2 (PC-2) to produce sixteen 48-bit **Round Keys (K1 to K16)**.
                    </p>
                    
                    {/* Interactive round key table */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-slate-850 rounded-lg p-4 bg-[#05070a] h-[320px] overflow-y-auto space-y-1">
                        <span className="text-xs text-slate-500 block mb-2 px-1">SELECT ROUND KEY (Ki)</span>
                        {keySchedule.map((key) => (
                          <button
                            key={key.round}
                            onClick={() => setActiveRound(key.round)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs cursor-pointer transition-all ${
                              activeRound === key.round 
                                ? 'bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-white' 
                                : 'text-slate-400 hover:bg-slate-900/60'
                            }`}
                          >
                            <span>ROUND {key.round.toString().padStart(2, '0')}</span>
                            <span className="text-[#00f2fe] font-bold">0x{key.round_key_hex}</span>
                          </button>
                        ))}
                      </div>
                      
                      <div className="border border-slate-850 rounded-lg p-4 bg-[#05070a] flex flex-col justify-between">
                        <div>
                          <span className="text-xs text-slate-500 block mb-3">INSPECTING ROUND {activeRound} KEY</span>
                          <div className="space-y-3 text-xs">
                            <div>
                              <span className="text-slate-500 block">Left Shifted 28-bit (C_shift):</span>
                              <span className="text-slate-300 font-mono break-all">{keySchedule[activeRound - 1]?.c_shift}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block">Right Shifted 28-bit (D_shift):</span>
                              <span className="text-slate-300 font-mono break-all">{keySchedule[activeRound - 1]?.d_shift}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-900">
                              <span className="text-[#00ff66] block font-bold">PC-2 Output (48-bit Round Key):</span>
                              <span className="text-[#00ff66] font-mono break-all font-bold">
                                {formatBin(keySchedule[activeRound - 1]?.round_key, 6)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 leading-normal border-t border-slate-900 pt-3">
                          * Shift Schedule: Rounds 1, 2, 9, 16 use 1 shift. All others use 2.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Feistel Expansion (E) */}
                {activeStep === 5 && (
                  <div className="space-y-6 font-mono">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      In the Feistel function, the 32-bit Right half (Ri-1) is expanded to 48 bits using the **Expansion (E) Table**. This is done so its size matches the 48-bit round key. Some bits are duplicated.
                    </p>
                    <div className="space-y-4">
                      <div className="border border-slate-850 rounded-lg p-4 bg-[#05070a]">
                        <span className="text-xs text-slate-500 block mb-1">RIGHT HALF INPUT (32-bit):</span>
                        <span className="text-slate-300 break-all">{formatBin(traceData.rounds[activeRound-1].right_in, 8)}</span>
                      </div>
                      <div className="border border-[#00f2fe]/20 rounded-lg p-4 bg-[#00f2fe]/5">
                        <span className="text-xs text-[#00f2fe] font-bold block mb-1">EXPANDED OUTPUT (48-bit):</span>
                        <span className="text-[#00f2fe] font-bold break-all">
                          {formatBin(traceData.rounds[activeRound-1].expanded_right, 6)}
                        </span>
                      </div>
                    </div>
                    {/* E permutation table */}
                    <div className="space-y-2">
                      <span className="text-xs text-slate-500">EXPANSION MATRIX (E):</span>
                      <div className="grid grid-cols-12 gap-1 text-center text-[9px] text-slate-500 bg-slate-950 p-2.5 rounded border border-slate-900">
                        {E.map((val, idx) => (
                          <div key={idx} className="p-0.5 border border-slate-900 bg-slate-950 rounded hover:border-[#00f2fe] transition-all">
                            {val}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: Feistel Round Key XOR */}
                {activeStep === 6 && (
                  <div className="space-y-6 font-mono">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The 48-bit expanded right block is mixed with the 48-bit Round Key (Ki) using the bitwise **XOR** operation. This introduces the key value into the cipher text.
                    </p>
                    <div className="space-y-3 text-xs bg-slate-950 p-5 rounded-lg border border-slate-900">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-slate-500">EXPANDED R block:</span>
                        <span className="text-slate-300 break-all">{formatBin(traceData.rounds[activeRound-1].expanded_right, 6)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-900 pb-2">
                        <span className="text-[#00f2fe] font-bold">ROUND KEY (K_activeRound):</span>
                        <span className="text-[#00f2fe] font-mono font-bold">{formatBin(traceData.rounds[activeRound-1].round_key, 6)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 text-[#00ff66] font-bold">
                        <span>XOR RESULT:</span>
                        <span className="text-glow-green font-mono">{formatBin(traceData.rounds[activeRound-1].xor_result, 6)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: Feistel S-Box Substitution */}
                {activeStep === 7 && (
                  <div className="space-y-6 font-mono">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The 48-bit XOR result is divided into eight 6-bit chunks. Each chunk is passed into one of **8 S-Boxes (Substitution Boxes)**. Each S-Box replaces the 6-bit input with a 4-bit output, shrinking the stream back to 32 bits. This provides the crucial non-linear mapping of DES.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Sbox Selector */}
                      <div className="border border-slate-850 rounded-lg p-4 bg-[#05070a] space-y-2">
                        <span className="text-xs text-slate-500 block mb-2">SELECT S-BOX TO INSPECT</span>
                        <div className="grid grid-cols-4 gap-2">
                          {[...Array(8)].map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedSbox(idx)}
                              className={`py-2 border rounded text-xs font-bold cursor-pointer transition-all ${
                                selectedSbox === idx
                                  ? 'bg-[#00f2fe]/10 border-[#00f2fe] text-[#00f2fe] glow-blue'
                                  : 'border-slate-850 text-slate-500 hover:border-slate-700'
                              }`}
                            >
                              S-BOX {idx + 1}
                            </button>
                          ))}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-900 space-y-2 text-xs">
                          <div>
                            <span className="text-slate-500 block">6-bit Input:</span>
                            <span className="text-slate-300 font-bold">
                              {traceData.rounds[activeRound-1].sbox_details[selectedSbox].input}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-500 block">Row Selector (bit 1 & 6):</span>
                              <span className="text-slate-300 font-bold">
                                {traceData.rounds[activeRound-1].sbox_details[selectedSbox].input[0]}
                                {traceData.rounds[activeRound-1].sbox_details[selectedSbox].input[5]} &rarr; Row {traceData.rounds[activeRound-1].sbox_details[selectedSbox].row}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500 block">Col Selector (bits 2-5):</span>
                              <span className="text-slate-300 font-bold">
                                {traceData.rounds[activeRound-1].sbox_details[selectedSbox].input.slice(1,5)} &rarr; Col {traceData.rounds[activeRound-1].sbox_details[selectedSbox].col}
                              </span>
                            </div>
                          </div>
                          <div className="pt-2">
                            <span className="text-[#00ff66] font-bold block">4-bit Output value:</span>
                            <span className="text-[#00ff66] font-bold">
                              {traceData.rounds[activeRound-1].sbox_details[selectedSbox].output} (Decimal {traceData.rounds[activeRound-1].sbox_details[selectedSbox].val_decimal})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Selected Sbox Matrix Visualizer */}
                      <div className="border border-slate-850 rounded-lg p-4 bg-[#05070a] flex flex-col justify-between">
                        <span className="text-xs text-slate-500 block mb-2">S-BOX {selectedSbox + 1} STATE TABLE (4x16 Matrix)</span>
                        <div className="grid grid-cols-16 gap-1 text-[8px] font-mono text-center">
                          {S_BOXES[selectedSbox].map((rowArr, rIdx) => 
                            rowArr.map((val, cIdx) => {
                              const detail = traceData.rounds[activeRound-1].sbox_details[selectedSbox];
                              const isSelected = detail.row === rIdx && detail.col === cIdx;
                              return (
                                <div
                                  key={`${rIdx}-${cIdx}`}
                                  className={`p-0.5 border transition-all rounded ${
                                    isSelected
                                      ? 'bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66] font-bold scale-110'
                                      : 'border-slate-900 bg-slate-950 text-slate-600'
                                  }`}
                                  title={`Row ${rIdx}, Col ${cIdx}`}
                                >
                                  {val}
                                </div>
                              );
                            })
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 leading-normal border-t border-slate-900 pt-3 mt-4">
                          * Highlighted cell matches row/column lookup based on current round bitstream.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 8: Feistel Permutation P */}
                {activeStep === 8 && (
                  <div className="space-y-6 font-mono">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The 32-bit output from the S-Boxes is permuted according to the **Permutation P Table**. This shuffles the output of the S-Boxes so that bits from one S-Box affect different S-Boxes in the next round, spreading the diffusion.
                    </p>
                    <div className="space-y-4">
                      <div className="border border-slate-850 rounded-lg p-4 bg-[#05070a]">
                        <span className="text-xs text-slate-500 block mb-1">S-BOX SUBSTITUTION OUTPUT:</span>
                        <span className="text-slate-300 break-all">{formatBin(traceData.rounds[activeRound-1].p_permutation_in, 8)}</span>
                      </div>
                      <div className="border border-[#00f2fe]/20 rounded-lg p-4 bg-[#00f2fe]/5">
                        <span className="text-xs text-[#00f2fe] font-bold block mb-1">PERMUTED P OUTPUT (32-bit):</span>
                        <span className="text-[#00f2fe] font-bold break-all">
                          {formatBin(traceData.rounds[activeRound-1].p_permutation_out, 8)}
                        </span>
                      </div>
                    </div>
                    {/* P table */}
                    <div className="space-y-2">
                      <span className="text-xs text-slate-500">P PERMUTATION MATRIX:</span>
                      <div className="grid grid-cols-8 gap-1.5 text-center text-[10px] text-slate-500 bg-slate-950 p-2.5 rounded border border-slate-900">
                        {P.map((val, idx) => (
                          <div key={idx} className="p-1 border border-slate-900 bg-slate-950 rounded hover:border-[#00f2fe] transition-all">
                            {val}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 9: Block Swap */}
                {activeStep === 9 && (
                  <div className="space-y-6 font-mono">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      To complete the Feistel round, the Left half (Li-1) is XORed with the Permuted P output of the right block to become the **new Right Half (Ri)**. The original Right half (Ri-1) simply becomes the **new Left Half (Li)**.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-slate-850 rounded-lg p-4 bg-[#05070a]">
                        <span className="text-xs text-slate-500 block mb-2 text-center">LEFT IN &rarr; RIGHT OUT</span>
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2 text-xs">
                          <span>Left Half (L_activeRound-1):</span>
                          <span>{formatBin(traceData.rounds[activeRound-1].left_in, 8)}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 text-xs text-[#00ff66] font-bold">
                          <span>XORed Right (R_activeRound):</span>
                          <span>{formatBin(traceData.rounds[activeRound-1].right_out, 8)}</span>
                        </div>
                      </div>
                      <div className="border border-slate-850 rounded-lg p-4 bg-[#05070a]">
                        <span className="text-xs text-slate-500 block mb-2 text-center">RIGHT IN &rarr; LEFT OUT</span>
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2 text-xs">
                          <span>Right Half (R_activeRound-1):</span>
                          <span>{formatBin(traceData.rounds[activeRound-1].right_in, 8)}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 text-xs text-[#00f2fe] font-bold">
                          <span>New Left (L_activeRound):</span>
                          <span>{formatBin(traceData.rounds[activeRound-1].left_out, 8)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center py-4">
                      <ArrowRightLeft className="w-12 h-12 text-[#00f2fe]/40 animate-pulse" />
                    </div>
                  </div>
                )}

                {/* STEP 10: Feistel Rounds Execution */}
                {activeStep === 10 && (
                  <div className="space-y-6 font-mono">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      DES repeats this Feistel process for **16 rounds**. In decryption, the round keys are applied in reverse order (K16 to K1).
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
                          <span className="text-xs text-slate-500 block">ROUND CONTROLLER</span>
                          <span className="text-white text-sm font-bold">
                            ROUND {activeRound} / 16
                          </span>
                        </div>
                      </div>

                      {/* Speed Slider */}
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500 uppercase">SPEED</span>
                        <input
                          type="range"
                          min="300"
                          max="2000"
                          step="100"
                          value={playbackSpeed}
                          onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                          className="w-24 accent-[#00f2fe] cursor-pointer"
                        />
                        <span className="text-[10px] text-[#00f2fe] font-bold">{(playbackSpeed/1000).toFixed(1)}s</span>
                      </div>

                      {/* Jump to round selection */}
                      <div className="flex gap-1.5">
                        {[1, 4, 8, 12, 16].map((r) => (
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

                    {/* Round Details view */}
                    <div className="border border-slate-850 rounded-lg p-5 bg-[#05070a] space-y-4">
                      <div className="flex justify-between items-center text-xs border-b border-slate-900 pb-2">
                        <span className="text-slate-500">ROUND {activeRound} LEFT HALF (L_activeRound):</span>
                        <span className="text-slate-300 break-all">{formatBin(traceData.rounds[activeRound-1].left_out, 8)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-b border-slate-900 pb-2">
                        <span className="text-slate-500">ROUND {activeRound} RIGHT HALF (R_activeRound):</span>
                        <span className="text-slate-300 break-all">{formatBin(traceData.rounds[activeRound-1].right_out, 8)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-[#00f2fe] font-bold">
                        <span>ROUND KEY APPLIED:</span>
                        <span>0x{traceData.rounds[activeRound-1].round_key_hex}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 11: Final Permutation (FP) */}
                {activeStep === 11 && (
                  <div className="space-y-6 font-mono">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      After Round 16, the Left and Right blocks are swapped back (to R16 + L16) and passed into the **Final Permutation (FP / IP^-1) Table**. This is the exact mathematical inverse of the Initial Permutation. The output bits represent the final Ciphertext.
                    </p>

                    <div className="space-y-4 bg-slate-950 p-5 rounded-lg border border-slate-900">
                      <div>
                        <span className="text-xs text-slate-500 block mb-1">PRE-FP BLOCK INPUT (R16 + L16):</span>
                        <div className="text-xs text-slate-400 break-all font-mono">
                          {formatBin(traceData.final_permutation.input, 8)}
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-900">
                        <span className="text-[#00ff66] font-bold text-xs block mb-1">FINAL CIPHERTEXT BINARY:</span>
                        <div className="text-xs text-glow-green text-[#00ff66] break-all font-mono font-bold">
                          {formatBin(traceData.final_permutation.output, 8)}
                        </div>
                      </div>
                    </div>

                    {/* Final Output Display Card */}
                    <div className="border border-[#00f2fe]/20 bg-[#00f2fe]/5 rounded-lg p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">RESULT CIPHERTEXT (HEX)</span>
                        <div className="text-2xl font-bold text-[#00f2fe] tracking-wider font-mono">
                          0x{traceData.ciphertext_hex}
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
                  <span>{activeRound} / 16</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00f2fe] to-[#00ff66] transition-all duration-300"
                    style={{ width: `${(activeRound / 16) * 100}%` }}
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
