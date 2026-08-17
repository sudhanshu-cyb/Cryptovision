import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  HelpCircle, 
  Compass, 
  Award, 
  Cpu, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  algorithm: 'DES' | 'AES' | 'General';
  purpose: string;
  mathLogic: string;
  securityAdvantage: string;
  analogy: string;
  interviewQ: string;
  interviewA: string;
}

export const LearningCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'DES' | 'AES'>('ALL');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const topics: Topic[] = [
    {
      id: 'sbox',
      title: 'S-Box (Substitution Box)',
      algorithm: 'General',
      purpose: 'Replaces specific bit groups with other bits using a non-linear look-up matrix.',
      mathLogic: 'In DES, it maps 6 input bits to 4 output bits. In AES, it acts as a multiplicative inverse in Galois Field GF(2^8) followed by an affine transformation.',
      securityAdvantage: 'Provides "confusion" (Shannon\'s property), breaking linear relations between plaintext and ciphertext. Without S-boxes, ciphers would be basic linear systems solvable by simple matrix algebra.',
      analogy: 'A lock box where you insert a key card of a certain color, and it triggers a mechanical lock to pop out a completely different token.',
      interviewQ: 'Why is the S-Box the most critical component of DES/AES?',
      interviewA: 'It is the ONLY non-linear component. All other operations (XOR, permutations, shifts) are linear. Without non-linearity, any number of rounds could be collapsed into a single linear equation, rendering the cipher trivial to break.'
    },
    {
      id: 'mixcols',
      title: 'MixColumns (AES)',
      algorithm: 'AES',
      purpose: 'Multiplies column vectors of the State Matrix by a fixed matrix polynomial to mix data within columns.',
      mathLogic: 'Treats each column as a 4-term polynomial over GF(2^8) and multiplies it modulo x^4 + 1 by a fixed matrix.',
      securityAdvantage: 'Provides "diffusion", ensuring that bytes in the state mix thoroughly. A change in a single byte propagates to affect all 4 bytes of the column in the next round.',
      analogy: 'Stirring paint colors together inside isolated columns so that separate pigments blend completely.',
      interviewQ: 'Why is MixColumns omitted in the final round of AES?',
      interviewA: 'Omitted to make the decryption process symmetric and matching. Since it doesn\'t add cryptographic strength in the final step (as there is no subsequent SubBytes/ShiftRows to diffuse it further), removing it saves hardware silicon area and processing cycles.'
    },
    {
      id: 'shiftrows',
      title: 'ShiftRows (AES)',
      algorithm: 'AES',
      purpose: 'Cyclically shifts the rows of the State Matrix by different offsets.',
      mathLogic: 'Row 0 is shifted by 0, Row 1 by 1, Row 2 by 2, Row 3 by 3 bytes to the left.',
      securityAdvantage: 'Diffuses bytes horizontally across columns. When combined with MixColumns (which mixes vertically), it ensures that after 2 rounds, every single byte of the state depends on every byte of the original plaintext block.',
      analogy: 'Shifting gears or adjusting rows in a combination dial lock to make sure columns align differently.',
      interviewQ: 'What would happen if ShiftRows was omitted from AES?',
      interviewA: 'The 4x4 matrix would be processed as four independent 4-byte column ciphers. MixColumns only diffuses vertically. Without ShiftRows, a change in column 1 would NEVER propagate to column 2, reducing the security level from a 128-bit block to four independent 32-bit block ciphers.'
    },
    {
      id: 'initial_perm',
      title: 'Initial Permutation (DES)',
      algorithm: 'DES',
      purpose: 'Rearranges the 64-bit plaintext bits into a fixed hardware-friendly layout before Feistel rounds start.',
      mathLogic: 'Permutes bits based on a fixed 1-to-1 table. Bit 58 moves to position 1, bit 50 to position 2, and so on.',
      securityAdvantage: 'Has ZERO cryptographic strength. It was designed in 1977 to ease byte routing through 8-bit bus hardware chips of that era.',
      analogy: 'Re-ordering the wires in a physical cable connector to match the pinout of an adapter plug.',
      interviewQ: 'Does the Initial Permutation (IP) in DES add security?',
      interviewA: 'No. IP is a public, fixed, keyless permutation. Anyone can invert it easily (using the Final Permutation table). It has no effect on cryptanalysis strength.'
    },
    {
      id: 'feistel',
      title: 'Feistel Network Structure',
      algorithm: 'DES',
      purpose: 'Split blocks into left and right halves and apply round functions to encrypt data.',
      mathLogic: 'L_i = R_{i-1}, R_i = L_{i-1} ^ f(R_{i-1}, K_i).',
      securityAdvantage: 'Ensures the round function does not need to be invertible. Decryption is identical to encryption, simply requiring reversing the key schedule. This simplifies hardware implementations.',
      analogy: 'A double-vault gate where you pass tokens back and forth between two compartments to verify keys.',
      interviewQ: 'What is the primary advantage of a Feistel cipher over an SPN cipher?',
      interviewA: 'The round function (F) does not need to be mathematically invertible. This gives designers total freedom when creating S-boxes and expansion tables, whereas SPN ciphers like AES require all operations to be strictly reversible.'
    }
  ];

  const filteredTopics = topics.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'ALL' || t.algorithm === activeTab || (activeTab === 'DES' && t.algorithm === 'General') || (activeTab === 'AES' && t.algorithm === 'General');
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white text-glow-blue flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-[#00f2fe]" />
          CRYPTOGRAPHY LEARNING CENTER
        </h2>
        <p className="text-sm text-slate-400">
          Study the underlying mathematical structures and security rationale behind block ciphers.
        </p>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Tabs */}
        <div className="flex gap-2 bg-[#05070a] p-1 border border-slate-850 rounded-lg">
          {(['ALL', 'DES', 'AES'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded transition-all cursor-pointer ${
                activeTab === tab 
                  ? 'bg-[#00f2fe]/15 text-[#00f2fe]' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab === 'ALL' ? 'ALL SUBJECTS' : tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search concepts (e.g. S-Box)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded pl-10 pr-3 py-2 text-white focus:outline-none focus:border-[#00f2fe] text-xs"
          />
        </div>
      </div>

      {/* Topics List Accordion */}
      <div className="space-y-4">
        {filteredTopics.map((topic) => {
          const isExpanded = expandedTopic === topic.id;
          return (
            <div 
              key={topic.id} 
              className="glass-panel rounded-xl border border-slate-850 overflow-hidden bg-[#090d16]/30 transition-all duration-300"
            >
              {/* Accordion Trigger */}
              <button
                onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-slate-900/10"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 text-[9px] rounded font-bold ${
                    topic.algorithm === 'DES' ? 'bg-[#9d4edd]/10 text-[#9d4edd]' : 
                    topic.algorithm === 'AES' ? 'bg-[#00ff66]/10 text-[#00ff66]' : 'bg-[#00f2fe]/10 text-[#00f2fe]'
                  }`}>
                    {topic.algorithm}
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-wide">{topic.title}</h3>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="p-6 border-t border-slate-900 bg-slate-950/40 space-y-6 text-xs text-slate-300 leading-relaxed font-mono">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left details */}
                    <div className="space-y-4">
                      <div>
                        <span className="text-[#00f2fe] font-bold block mb-1 flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5" /> PURPOSE
                        </span>
                        <p className="text-slate-400">{topic.purpose}</p>
                      </div>
                      
                      <div>
                        <span className="text-[#00ff66] font-bold block mb-1 flex items-center gap-1">
                          <Cpu className="w-3.5 h-3.5" /> MATH LOGIC & OPERATIONS
                        </span>
                        <p className="text-slate-400">{topic.mathLogic}</p>
                      </div>
                    </div>

                    {/* Right details */}
                    <div className="space-y-4">
                      <div>
                        <span className="text-[#f5a623] font-bold block mb-1 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" /> SECURITY ADVANTAGE
                        </span>
                        <p className="text-slate-400">{topic.securityAdvantage}</p>
                      </div>

                      <div>
                        <span className="text-[#9d4edd] font-bold block mb-1 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5" /> REAL-WORLD ANALOGY
                        </span>
                        <p className="text-slate-400">{topic.analogy}</p>
                      </div>
                    </div>
                  </div>

                  {/* Interview Q&A Section */}
                  <div className="pt-4 border-t border-slate-900 bg-[#05070a] p-4 rounded-lg">
                    <span className="text-[#00f2fe] font-bold block mb-1">INTERVIEW PREPARATION QUESTION:</span>
                    <div className="text-white font-bold mb-2">Q: {topic.interviewQ}</div>
                    <div className="text-slate-400 pl-4 border-l border-[#00ff66] italic">
                      A: {topic.interviewA}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredTopics.length === 0 && (
          <div className="text-center py-12 text-slate-600 font-mono text-sm">
            [ NO CRYPTO TOPICS FOUND MATCHING SEARCH QUERY ]
          </div>
        )}
      </div>
    </div>
  );
};
