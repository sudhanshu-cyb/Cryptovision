import { useState } from 'react';
import { Sidebar } from './components/Common/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { DesSimulator } from './components/DES/DesSimulator';
import { AesSimulator } from './components/AES/AesSimulator';
import { CompareAlgorithms } from './components/Visualizer/CompareAlgorithms';
import { AvalancheEffect } from './components/Visualizer/AvalancheEffect';
import { LearningCenter } from './components/Learning/LearningCenter';
import { QuizModule } from './components/Quiz/QuizModule';
import { HistoryManager } from './components/History/HistoryManager';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'des':
        return <DesSimulator />;
      case 'aes':
        return <AesSimulator />;
      case 'avalanche':
        return <AvalancheEffect />;
      case 'compare':
        return <CompareAlgorithms />;
      case 'learning':
        return <LearningCenter />;
      case 'quiz':
        return <QuizModule />;
      case 'history':
        return <HistoryManager />;
      default:
        return <Dashboard />;
    }
  };

  // Generate binary rain coordinates for aesthetic background
  const streams = [
    { left: '10%', delay: '0s', text: '01001000' },
    { left: '25%', delay: '4s', text: '01000101' },
    { left: '40%', delay: '2s', text: '01001100' },
    { left: '55%', delay: '8s', text: '01001100' },
    { left: '70%', delay: '5s', text: '01001111' },
    { left: '85%', delay: '3s', text: '01010011' }
  ];

  return (
    <div className="flex bg-[#07090e] min-h-screen text-slate-200 cyber-grid scanline relative">
      {/* Background Matrix Rain */}
      {streams.map((stream, idx) => (
        <div
          key={idx}
          className="matrix-stream font-mono"
          style={{
            left: stream.left,
            animationDelay: stream.delay,
            top: '-150px'
          }}
        >
          {stream.text}
        </div>
      ))}

      {/* Sidebar Component */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Lab Screen */}
      <main className="flex-1 p-8 overflow-y-auto z-10">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
