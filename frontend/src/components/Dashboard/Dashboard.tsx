import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Activity, 
  Terminal, 
  RefreshCw, 
  Lock, 
  KeyRound 
} from 'lucide-react';

interface HistoryItem {
  id: number;
  plaintext: string;
  ciphertext: string;
  algorithm: string;
  timestamp: string;
  execution_time: number;
}

export const Dashboard: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/history');
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const totalCount = history.length;
  const desCount = history.filter(h => h.algorithm === 'DES').length;
  const aesCount = history.filter(h => h.algorithm.startsWith('AES')).length;
  const avgTime = totalCount > 0 
    ? (history.reduce((sum, h) => sum + h.execution_time, 0) / totalCount).toFixed(4)
    : '0.0000';

  // Calculate standard metrics
  const cards = [
    {
      title: 'TOTAL OPERATIONS',
      value: totalCount,
      desc: 'Active encrypt/decrypt cycles',
      icon: Activity,
      color: 'text-[#00f2fe]',
      borderColor: 'border-[#00f2fe]/20',
      bgColor: 'bg-[#00f2fe]/5'
    },
    {
      title: 'DES ENCRYPTIONS',
      value: desCount,
      desc: '64-bit Feistel block cipher',
      icon: KeyRound,
      color: 'text-[#9d4edd]',
      borderColor: 'border-[#9d4edd]/20',
      bgColor: 'bg-[#9d4edd]/5'
    },
    {
      title: 'AES ENCRYPTIONS',
      value: aesCount,
      desc: '128/192/256-bit block size',
      icon: Lock,
      color: 'text-[#00ff66]',
      borderColor: 'border-[#00ff66]/20',
      bgColor: 'bg-[#00ff66]/5'
    },
    {
      title: 'AVG DURATION',
      value: `${avgTime} ms`,
      desc: 'FastAPI execution overhead',
      icon: Zap,
      color: 'text-[#f5a623]',
      borderColor: 'border-[#f5a623]/20',
      bgColor: 'bg-[#f5a623]/5'
    }
  ];

  // Helper to generate SVG path for history speed trend
  const generateChartPath = () => {
    if (history.length < 2) return '';
    const points = history.slice().reverse().slice(-10); // Take last 10 items
    if (points.length < 2) return '';
    
    const width = 800;
    const height = 150;
    const maxVal = Math.max(...points.map(p => p.execution_time), 1);
    const minVal = 0;
    const range = maxVal - minVal;

    const coords = points.map((p, idx) => {
      const x = (idx / (points.length - 1)) * (width - 40) + 20;
      const y = height - ((p.execution_time - minVal) / range) * (height - 30) - 15;
      return `${x},${y}`;
    });

    return `M ${coords.join(' L ')}`;
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-mono tracking-tight text-white text-glow-blue">
            CYBER LAB DASHBOARD
          </h2>
          <p className="text-sm text-slate-400 font-mono">
            Real-time analytics and telemetry of cryptographic executions.
          </p>
        </div>
        <button 
          onClick={fetchHistory}
          className="flex items-center gap-2 px-4 py-2 border border-[#00f2fe]/30 rounded bg-[#00f2fe]/10 text-[#00f2fe] font-mono text-sm hover:bg-[#00f2fe]/20 transition-all cursor-pointer glow-blue"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          REFRESH TELEMETRY
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`glass-panel p-6 rounded-xl border ${card.borderColor} ${card.bgColor} relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className="w-20 h-20 text-white" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{card.title}</span>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div>
                  <h3 className={`text-3xl font-bold font-mono ${card.color}`}>
                    {card.value}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    {card.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SVG Performance Speed Graph */}
      <div className="glass-panel p-6 rounded-xl border border-[#00f2fe]/15 bg-[#090d16]/30">
        <h3 className="text-lg font-mono text-white mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#00f2fe] animate-pulse" />
          ALGORITHM LATENCY TELEMETRY (Last 10 executions)
        </h3>
        
        {history.length < 2 ? (
          <div className="h-44 border border-dashed border-slate-800 rounded-lg flex items-center justify-center font-mono text-slate-600">
            [ WAITING FOR ENCRYPTION DATA TELEMETRY ]
          </div>
        ) : (
          <div className="relative">
            <svg viewBox="0 0 800 150" className="w-full h-44 overflow-visible">
              {/* Horizontal helper grid lines */}
              <line x1="20" y1="20" x2="780" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="20" y1="75" x2="780" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="20" y1="130" x2="780" y2="130" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              
              {/* Glowing Line */}
              <path
                d={generateChartPath()}
                fill="none"
                stroke="#00f2fe"
                strokeWidth="3"
                className="drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]"
              />
              
              {/* Plot points */}
              {history.slice().reverse().slice(-10).map((p, idx, arr) => {
                const width = 800;
                const height = 150;
                const points = arr;
                const maxVal = Math.max(...points.map(x => x.execution_time), 1);
                const minVal = 0;
                const range = maxVal - minVal;

                const x = (idx / (points.length - 1)) * (width - 40) + 20;
                const y = height - ((p.execution_time - minVal) / range) * (height - 30) - 15;
                return (
                  <g key={p.id} className="group/dot cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      fill="#00ff66"
                      stroke="#07090e"
                      strokeWidth="2"
                      className="transition-all hover:r-8 hover:fill-[#00f2fe]"
                    />
                    <text
                      x={x}
                      y={y - 12}
                      fill="#e2e8f0"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="opacity-0 group-hover/dot:opacity-100 transition-opacity bg-slate-900"
                    >
                      {p.execution_time.toFixed(3)} ms
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Laboratory Environment Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-sm">
        {/* Terminal Console log */}
        <div className="glass-panel p-6 rounded-xl border border-[#00ff66]/15 bg-[#090d16]/30">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#00ff66]" />
            LAB CONSOLE STREAMS
          </h3>
          <div className="bg-[#05070a] p-4 rounded-lg border border-slate-900 h-60 overflow-y-auto space-y-2 text-xs">
            <div className="text-slate-500">[SYSTEM] Session initialized successfully.</div>
            <div className="text-slate-500">[SYSTEM] Server listening on 127.0.0.1:8000</div>
            {history.slice(0, 5).map(h => (
              <div key={h.id} className="text-slate-400">
                <span className="text-[#00ff66]">{h.timestamp.split('T')[1].split('.')[0]}</span> - 
                Algorithm <span className="text-[#00f2fe]">{h.algorithm}</span> executed. Result: {h.ciphertext.slice(0, 16)}... ({h.execution_time.toFixed(4)} ms)
              </div>
            ))}
            {history.length === 0 && (
              <div className="text-slate-600">[SYSTEM] Awaiting user encryption commands...</div>
            )}
          </div>
        </div>

        {/* Security Lab Status */}
        <div className="glass-panel p-6 rounded-xl border border-[#9d4edd]/15 bg-[#090d16]/30 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#9d4edd]" />
              SECURITY PROFILE ASSESSMENT
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Based on recent encryption simulations, we calculate the laboratory strength of your cryptographic suite. Double-check your secrets, avoid plain keys, and favor longer block keys for enhanced resilience.
            </p>
          </div>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>AES-256 RESILIENCE</span>
                <span className="text-[#00ff66]">100% (UNBREAKABLE)</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-[#00ff66] rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>DES BRUTE-FORCE RESILIENCE</span>
                <span className="text-rose-500">22% (EXPOSED)</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '22%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
