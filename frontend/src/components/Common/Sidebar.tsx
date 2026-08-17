import React from 'react';
import { 
  LayoutDashboard, 
  Lock, 
  KeyRound, 
  ShieldAlert, 
  BookOpen, 
  FileQuestion, 
  History, 
  GitCompare,
  Fingerprint
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'des', name: 'DES Simulator', icon: KeyRound },
    { id: 'aes', name: 'AES Simulator', icon: Lock },
    { id: 'avalanche', name: 'Avalanche Effect', icon: ShieldAlert },
    { id: 'compare', name: 'Compare DES vs AES', icon: GitCompare },
    { id: 'learning', name: 'Learning Center', icon: BookOpen },
    { id: 'quiz', name: 'Quiz Mode', icon: FileQuestion },
    { id: 'history', name: 'History', icon: History },
  ];

  return (
    <aside className="w-72 bg-[#090d16] border-r border-[#00f2fe]/15 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#00f2fe]/15 flex items-center gap-3">
        <div className="p-2 rounded bg-[#00f2fe]/10 border border-[#00f2fe]/30 animate-pulse">
          <Fingerprint className="w-8 h-8 text-[#00f2fe] text-glow-blue" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wider text-[#00f2fe] font-mono text-glow-blue">
            CRYPTO<span className="text-[#00ff66]">VISION</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">
            Lab Simulator v1.0
          </p>
        </div>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-mono text-sm tracking-wide transition-all duration-300 group text-left ${
                isActive 
                  ? 'bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe] glow-blue' 
                  : 'text-slate-400 border border-transparent hover:bg-slate-900/60 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                isActive ? 'text-[#00f2fe]' : 'text-slate-500 group-hover:text-slate-300'
              }`} />
              <span>{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-ping" />
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-4 border-t border-[#00f2fe]/15 bg-[#05070a]/80 font-mono text-xs text-slate-500 space-y-1">
        <div className="flex justify-between items-center">
          <span>SYSTEM ONLINE</span>
          <span className="flex items-center gap-1.5 text-[#00ff66]">
            <span className="w-2 h-2 rounded-full bg-[#00ff66] inline-block animate-pulse" />
            SECURE
          </span>
        </div>
        <div className="text-[10px] text-slate-600 truncate">
          ADDR: 127.0.0.1:8000
        </div>
      </div>
    </aside>
  );
};
