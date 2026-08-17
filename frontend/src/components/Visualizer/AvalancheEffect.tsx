import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  Activity
} from 'lucide-react';

export const AvalancheEffect: React.FC = () => {
  const [plaintext1, setPlaintext1] = useState('HELLOTEST123456');
  const [plaintext2, setPlaintext2] = useState('HELLoTEST123456'); // 'O' vs 'o' (differs by 1 bit in binary)
  const [secretKey, setSecretKey] = useState('MYSECRETKEY99');
  const [algorithm, setAlgorithm] = useState<'DES' | 'AES-128'>('AES-128');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    bin1: string;
    bin2: string;
    hex1: string;
    hex2: string;
    flippedCount: number;
    totalBits: number;
    percentage: number;
  } | null>(null);

  useEffect(() => {
    runAvalancheTest();
  }, []);

  const runAvalancheTest = async () => {
    setLoading(true);
    try {
      let endpoint1 = '';
      let body1: any = {};
      let body2: any = {};

      if (algorithm === 'DES') {
        endpoint1 = 'encrypt/des';
        // DES operates on blocks of 8 characters
        body1 = { plaintext: plaintext1.slice(0, 8), key: secretKey.slice(0, 8) };
        body2 = { plaintext: plaintext2.slice(0, 8), key: secretKey.slice(0, 8) };
      } else {
        endpoint1 = 'encrypt/aes';
        body1 = { plaintext: plaintext1.slice(0, 16), key: secretKey, key_size: 128 };
        body2 = { plaintext: plaintext2.slice(0, 16), key: secretKey, key_size: 128 };
      }

      const [res1, res2] = await Promise.all([
        fetch(`http://127.0.0.1:8000/${endpoint1}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body1)
        }),
        fetch(`http://127.0.0.1:8000/${endpoint1}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body2)
        })
      ]);

      if (res1.ok && res2.ok) {
        const data1 = await res1.json();
        const data2 = await res2.json();

        // Convert ciphertexts to binary streams
        const hexToBin = (hexStr: string) => {
          return hexStr.split('').map(char => 
            parseInt(char, 16).toString(2).padStart(4, '0')
          ).join('');
        };

        const bin1 = hexToBin(data1.ciphertext);
        const bin2 = hexToBin(data2.ciphertext);

        let flipped = 0;
        const length = Math.min(bin1.length, bin2.length);

        for (let i = 0; i < length; i++) {
          if (bin1[i] !== bin2[i]) {
            flipped++;
          }
        }

        setResult({
          bin1,
          bin2,
          hex1: data1.ciphertext,
          hex2: data2.ciphertext,
          flippedCount: flipped,
          totalBits: length,
          percentage: Number(((flipped / length) * 100).toFixed(2))
        });
      }
    } catch (error) {
      console.error("Error computing avalanche effect:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white text-glow-blue flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-[#00f2fe]" />
          AVALANCHE EFFECT ANALYZER
        </h2>
        <p className="text-sm text-slate-400">
          Observe how changing a single bit in the input plaintext leads to complete modification of the ciphertext.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-[#00f2fe]/15 bg-[#090d16]/30 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              TEST INPUTS
            </h3>

            {/* Algorithm Select */}
            <div>
              <label className="block text-slate-500 mb-1.5 text-xs">ALGORITHM TO TEST</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setAlgorithm('DES'); setPlaintext1('HELLO_D1'); setPlaintext2('HELLO_d1'); }}
                  className={`py-2 border text-xs rounded cursor-pointer transition-all ${
                    algorithm === 'DES'
                      ? 'bg-[#00f2fe]/15 border-[#00f2fe] text-[#00f2fe] glow-blue'
                      : 'border-slate-850 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  DES
                </button>
                <button
                  onClick={() => { setAlgorithm('AES-128'); setPlaintext1('HELLOTEST123456'); setPlaintext2('HELLoTEST123456'); }}
                  className={`py-2 border text-xs rounded cursor-pointer transition-all ${
                    algorithm === 'AES-128'
                      ? 'bg-[#00ff66]/15 border-[#00ff66] text-[#00ff66] glow-green'
                      : 'border-slate-850 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  AES-128
                </button>
              </div>
            </div>

            {/* Plaintext 1 */}
            <div>
              <label className="block text-slate-500 mb-1 text-xs">ORIGINAL PLAINTEXT</label>
              <input
                type="text"
                value={plaintext1}
                onChange={(e) => setPlaintext1(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-white focus:outline-none focus:border-[#00f2fe] text-xs"
                maxLength={algorithm === 'DES' ? 8 : 16}
              />
            </div>

            {/* Plaintext 2 */}
            <div>
              <label className="block text-slate-500 mb-1 text-xs">MODIFIED PLAINTEXT (Differ by 1 char)</label>
              <input
                type="text"
                value={plaintext2}
                onChange={(e) => setPlaintext2(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-white focus:outline-none focus:border-[#00f2fe] text-xs"
                maxLength={algorithm === 'DES' ? 8 : 16}
              />
            </div>

            {/* Key */}
            <div>
              <label className="block text-slate-500 mb-1 text-xs">TEST SECRET KEY</label>
              <input
                type="text"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-white focus:outline-none focus:border-[#00f2fe] text-xs"
              />
            </div>

            <button
              onClick={runAvalancheTest}
              disabled={loading}
              className="w-full py-3 bg-[#00f2fe]/10 border border-[#00f2fe]/30 hover:bg-[#00f2fe]/20 rounded text-[#00f2fe] font-bold text-xs tracking-wider transition-all cursor-pointer glow-blue mt-4"
            >
              {loading ? 'CALCULATING DIFFS...' : 'COMPUTE AVALANCHE'}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-6">
          {!result ? (
            <div className="glass-panel p-6 rounded-xl border border-slate-850 h-[400px] flex items-center justify-center text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin mr-3 text-[#00f2fe]" />
              <span>AWAITING COMPUTATION...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Heatmap Grid */}
              <div className="glass-panel p-6 rounded-xl border border-slate-850 bg-[#090d16]/30">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#00f2fe]" />
                    OUTPUT CIPHERTEXT BIT DIFF HEATMAP
                  </h4>
                  <span className="text-xs text-slate-400">
                    Total: {result.totalBits} Bits
                  </span>
                </div>

                {/* Heatmap Grid Cells */}
                <div className={`grid gap-1.5 p-3 rounded-lg bg-slate-950 border border-slate-900 mx-auto max-w-lg ${
                  algorithm === 'DES' ? 'grid-cols-8' : 'grid-cols-16'
                }`}>
                  {[...Array(result.totalBits)].map((_, idx) => {
                    const isFlipped = result.bin1[idx] !== result.bin2[idx];
                    return (
                      <div
                        key={idx}
                        className={`h-7 rounded flex items-center justify-center text-[8px] font-bold border transition-all ${
                          isFlipped
                            ? 'bg-rose-500/20 border-rose-500 text-rose-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.5)]'
                            : 'bg-slate-900/60 border-slate-950 text-slate-600'
                        }`}
                        title={`Bit index ${idx}: Original=${result.bin1[idx]}, Modified=${result.bin2[idx]}`}
                      >
                        {isFlipped ? '1' : '0'}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-center gap-6 mt-6 text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-rose-500/20 border border-rose-500 inline-block" />
                    <span>Flipped Output Bit (Differs)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-950 inline-block" />
                    <span>Unchanged Output Bit (Identical)</span>
                  </div>
                </div>
              </div>

              {/* Avalanche Metrics Board */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-5 rounded-xl border border-slate-850 text-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">BIT DIFF COUNT</span>
                  <div className="text-3xl font-bold text-[#00f2fe] text-glow-blue font-mono">
                    {result.flippedCount} / {result.totalBits}
                  </div>
                </div>
                
                <div className="glass-panel p-5 rounded-xl border border-[#00ff66]/20 bg-[#00ff66]/5 text-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">AVALANCHE PERCENTAGE</span>
                  <div className="text-3xl font-bold text-[#00ff66] text-glow-green font-mono">
                    {result.percentage}%
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-slate-850 text-center flex flex-col justify-center items-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">DIFF DIAGNOSIS</span>
                  <div className="text-xs font-bold text-slate-300 font-mono">
                    {result.percentage >= 45 && result.percentage <= 55 
                      ? 'IDEAL DIFFUSION (~50%)' 
                      : 'SUBOPTIMAL DIFFUSION'}
                  </div>
                </div>
              </div>

              {/* Hex and Byte stream comparators */}
              <div className="glass-panel p-5 rounded-xl border border-slate-850 bg-slate-950 space-y-4">
                <span className="text-xs text-slate-500 block mb-1">CIPHERTEXT SPECS</span>
                <div className="space-y-3 text-xs text-slate-400">
                  <div className="flex flex-col md:flex-row md:items-center justify-between py-1 border-b border-slate-900 pb-2">
                    <span className="font-semibold text-slate-500">Original Cipher:</span>
                    <span className="text-[#00f2fe] tracking-wider">0x{result.hex1.toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between py-1">
                    <span className="font-semibold text-slate-500">Modified Cipher:</span>
                    <span className="text-rose-400 tracking-wider">0x{result.hex2.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
