import React from 'react';
import { 
  GitCompare, 
  Zap, 
  Lock, 
  KeyRound,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const CompareAlgorithms: React.FC = () => {
  const specs = [
    {
      feature: 'Block Size',
      des: '64 bits (8 bytes)',
      aes: '128 bits (16 bytes)',
      importance: 'Larger blocks prevent birthday bound attacks'
    },
    {
      feature: 'Key Size',
      des: '56 bits (effective)',
      aes: '128, 192, or 256 bits',
      importance: 'Longer keys prevent brute-force attacks'
    },
    {
      feature: 'Number of Rounds',
      des: '16 rounds',
      aes: '10, 12, or 14 rounds (dependent on key size)',
      importance: 'More rounds increase confusion and diffusion complexity'
    },
    {
      feature: 'Mathematical Structure',
      des: 'Feistel Network',
      desDetail: 'Splits block in halves. Only half is modified per round.',
      aes: 'Substitution-Permutation Network (SPN)',
      aesDetail: 'Processes entire block in parallel using S-boxes and linear mixes.',
      importance: 'Feistel is easier to design; SPN is faster and mathematically stronger'
    },
    {
      feature: 'Security Level',
      des: 'Vulnerable (Broken)',
      desStatus: 'fail',
      aes: 'Secure (Standard)',
      aesStatus: 'pass',
      importance: 'Government/industrial standard compliance'
    },
    {
      feature: 'Software Speed',
      des: 'Slow',
      desStatus: 'low',
      aes: 'Very Fast (Hardware accelerated)',
      aesStatus: 'high',
      importance: 'Critical for high-bandwidth web traffic (HTTPS)'
    },
    {
      feature: 'Design Creator',
      des: 'IBM & NSA (1977)',
      aes: 'Joan Daemen & Vincent Rijmen (Rijndael, 2001)',
      importance: 'Open academic contest vs proprietary design'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold font-mono tracking-tight text-white text-glow-blue flex items-center gap-3">
          <GitCompare className="w-8 h-8 text-[#00f2fe]" />
          ALGORITHM SPECIFICATION COMPARISON
        </h2>
        <p className="text-sm text-slate-400 font-mono">
          Analyzing mechanical differences between Feistel networks and Substitution-Permutation structures.
        </p>
      </div>

      {/* Comparative Specification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* DES Overview Card */}
        <div className="glass-panel p-6 rounded-xl border border-[#9d4edd]/20 bg-[#9d4edd]/5 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <KeyRound className="w-6 h-6 text-[#9d4edd]" />
            <h3 className="text-lg font-bold font-mono text-white">DATA ENCRYPTION STANDARD (DES)</h3>
          </div>
          <p className="text-xs text-slate-400 font-mono leading-relaxed mb-4">
            Introduced in the late 1970s, DES split inputs into Left/Right halves and ran them through 16 rounds of a Feistel network. While historically revolutionary, its 56-bit key can be brute-forced in under a day with modern GPUs.
          </p>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-500">Security:</span>
              <span className="text-rose-500 font-bold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> DEPRECATED
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-500">Structure:</span>
              <span className="text-slate-300">Feistel Network</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Key Space:</span>
              <span className="text-slate-300">$2^{56}$ combinations</span>
            </div>
          </div>
        </div>

        {/* AES Overview Card */}
        <div className="glass-panel p-6 rounded-xl border border-[#00ff66]/20 bg-[#00ff66]/5 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-[#00ff66]" />
            <h3 className="text-lg font-bold font-mono text-white">ADVANCED ENCRYPTION STANDARD (AES)</h3>
          </div>
          <p className="text-xs text-slate-400 font-mono leading-relaxed mb-4">
            Designed as a Substitution-Permutation Network, AES operates on the entire 128-bit block in parallel. It utilizes Galois Field GF($2^8$) matrix multiplication to achieve maximum avalanche diffusion. AES remains unbroken today.
          </p>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-500">Security:</span>
              <span className="text-[#00ff66] font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> GOLD STANDARD
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-500">Structure:</span>
              <span className="text-slate-300">SPN (Sub-Perm Network)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Key Space:</span>
              <span className="text-slate-300">$2^{128}$ to $2^{256}$ combinations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Specification Table */}
      <div className="glass-panel rounded-xl border border-slate-850 overflow-hidden bg-[#090d16]/30">
        <div className="p-4 border-b border-slate-850 bg-slate-950 font-mono text-xs text-[#00f2fe] font-bold">
          DETAILED STRUCTURAL COMPARISON TABLE
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-500">
                <th className="p-4 font-semibold uppercase">Feature Specs</th>
                <th className="p-4 font-semibold uppercase">DES Simulator</th>
                <th className="p-4 font-semibold uppercase">AES Simulator</th>
                <th className="p-4 font-semibold uppercase hidden md:table-cell">Importance / Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {specs.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/20">
                  <td className="p-4 text-white font-bold">{row.feature}</td>
                  <td className="p-4 text-slate-300">{row.des}</td>
                  <td className="p-4 text-slate-300">{row.aes}</td>
                  <td className="p-4 text-slate-500 hidden md:table-cell">{row.importance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Speed & Throughput Telemetry graph */}
      <div className="glass-panel p-6 rounded-xl border border-[#00f2fe]/15 bg-[#090d16]/30 space-y-6">
        <h3 className="text-lg font-mono text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#00f2fe] animate-pulse" />
          ESTIMATED THROUGHPUT PERFORMANCE (Hardware Accel vs Software Emulated)
        </h3>

        {/* Custom Visual bars for speed comparison */}
        <div className="space-y-6 max-w-2xl mx-auto font-mono text-xs py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>AES-128 (AES-NI Instructions)</span>
              <span className="text-[#00ff66] font-bold">~4,500 MB/s</span>
            </div>
            <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
              <div className="h-full bg-gradient-to-r from-[#00ff66] to-[#00f2fe] rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>AES-256 (AES-NI Instructions)</span>
              <span className="text-[#00ff66] font-bold">~3,100 MB/s</span>
            </div>
            <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
              <div className="h-full bg-gradient-to-r from-[#00ff66] to-[#00f2fe] rounded-full" style={{ width: '70%' }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>DES (Software Emulated)</span>
              <span className="text-rose-500 font-bold">~80 MB/s</span>
            </div>
            <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: '2.5%' }} />
            </div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 text-center font-mono italic">
          * AES achieves massive performance gains through native AES-NI microprocessor instructions present in modern x86/ARM cores.
        </p>
      </div>
    </div>
  );
};
