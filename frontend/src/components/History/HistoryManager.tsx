import React, { useState, useEffect } from 'react';
import { 
  History, 
  Trash2, 
  Download, 
  FileText, 
  Database,
  RefreshCw,
  Clock
} from 'lucide-react';

interface HistoryItem {
  id: number;
  plaintext: string;
  ciphertext: string;
  algorithm: string;
  timestamp: string;
  execution_time: number;
}

export const HistoryManager: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

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

  const clearHistory = async () => {
    if (!confirm("Are you sure you want to clear all history records from the lab database?")) return;
    try {
      const response = await fetch('http://127.0.0.1:8000/history', { method: 'DELETE' });
      if (response.ok) {
        setHistory([]);
      }
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `cryptovision_history_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  const exportCSV = () => {
    const headers = ['ID', 'Plaintext', 'Ciphertext', 'Algorithm', 'Timestamp', 'Execution Time (ms)'];
    const rows = history.map(item => [
      item.id,
      `"${item.plaintext}"`,
      `"${item.ciphertext}"`,
      item.algorithm,
      item.timestamp,
      item.execution_time.toFixed(4)
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", encodedUri);
    dlAnchorElem.setAttribute("download", `cryptovision_history_${Date.now()}.csv`);
    dlAnchorElem.click();
  };

  const exportReport = () => {
    let report = `==================================================\n`;
    report += `CRYPTOVISION SIMULATOR LAB REPORT\n`;
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += `==================================================\n\n`;
    
    history.forEach((item, idx) => {
      report += `Record #${idx + 1}\n`;
      report += `--------------------------------------------------\n`;
      report += `Algorithm:      ${item.algorithm}\n`;
      report += `Plaintext:      ${item.plaintext}\n`;
      report += `Ciphertext:     ${item.ciphertext}\n`;
      report += `Execution Time: ${item.execution_time.toFixed(5)} ms\n`;
      report += `Timestamp:      ${item.timestamp}\n\n`;
    });

    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(report);
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `cryptovision_report_${Date.now()}.txt`);
    dlAnchorElem.click();
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white text-glow-blue flex items-center gap-3">
            <History className="w-8 h-8 text-[#00f2fe]" />
            LAB OPERATION HISTORY
          </h2>
          <p className="text-sm text-slate-400">
            Persistent database registry of DES/AES inputs, cipher results, and encryption speed timings.
          </p>
        </div>
        
        {/* Buttons */}
        <div className="flex gap-2.5">
          <button 
            onClick={fetchHistory}
            className="p-2 border border-slate-800 rounded bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
            title="Refresh history"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={clearHistory}
            disabled={history.length === 0}
            className="flex items-center gap-2 px-4 py-2 border border-rose-500/30 rounded bg-rose-500/10 text-rose-500 text-xs font-bold cursor-pointer hover:bg-rose-500/20 disabled:opacity-45 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            CLEAR DATABASE
          </button>
        </div>
      </div>

      {/* Export Toolbar */}
      {history.length > 0 && (
        <div className="glass-panel p-4 rounded-xl border border-slate-850 bg-[#090d16]/30 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-slate-400 flex items-center gap-2">
            <Database className="w-4 h-4 text-[#00f2fe]" />
            EXPORT TELEMETRY DATABASE:
          </span>
          <div className="flex gap-2">
            <button
              onClick={exportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#00f2fe]/30 rounded bg-[#00f2fe]/10 text-[#00f2fe] text-xs font-bold hover:bg-[#00f2fe]/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              JSON
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#00ff66]/30 rounded bg-[#00ff66]/10 text-[#00ff66] text-xs font-bold hover:bg-[#00ff66]/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
            <button
              onClick={exportReport}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#9d4edd]/30 rounded bg-[#9d4edd]/10 text-[#9d4edd] text-xs font-bold hover:bg-[#9d4edd]/20 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              TXT REPORT
            </button>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="glass-panel rounded-xl border border-slate-850 overflow-hidden bg-[#090d16]/30">
        {history.length === 0 ? (
          <div className="p-20 text-center text-slate-600 text-xs">
            [ LAB DATABASE REGISTER EMPTY - RUN ENCRYPTION SIMULATIONS TO START TELEMETRY ]
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-500">
                  <th className="p-4 font-semibold uppercase">ID</th>
                  <th className="p-4 font-semibold uppercase">ALGORITHM</th>
                  <th className="p-4 font-semibold uppercase">PLAINTEXT</th>
                  <th className="p-4 font-semibold uppercase">CIPHERTEXT</th>
                  <th className="p-4 font-semibold uppercase">SPEED</th>
                  <th className="p-4 font-semibold uppercase">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/10">
                    <td className="p-4 text-slate-500">#{item.id}</td>
                    <td className="p-4 text-white font-bold">{item.algorithm}</td>
                    <td className="p-4 text-slate-400 font-mono truncate max-w-[150px]" title={item.plaintext}>
                      {item.plaintext}
                    </td>
                    <td className="p-4 text-[#00f2fe] font-mono truncate max-w-[200px]" title={item.ciphertext}>
                      {item.ciphertext}
                    </td>
                    <td className="p-4 text-[#00ff66] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#00ff66]" />
                      {item.execution_time.toFixed(4)} ms
                    </td>
                    <td className="p-4 text-slate-500 font-mono">
                      {item.timestamp.split('T')[1].split('.')[0]} ({item.timestamp.split('T')[0]})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
