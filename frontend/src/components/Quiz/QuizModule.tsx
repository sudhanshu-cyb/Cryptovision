import React, { useState } from 'react';
import { 
  FileQuestion, 
  Award, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number; // Index of correct option
  explanation: string;
}

export const QuizModule: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: 'What is the primary function of the S-Box (Substitution Box) in DES/AES ciphers?',
      options: [
        'To add keys to the state matrix via bitwise XOR operations',
        'To perform cyclical shifts on state block columns',
        'To introduce non-linear mapping for Shannon\'s confusion property',
        'To expand the size of blocks to match key lengths'
      ],
      answer: 2,
      explanation: 'S-Boxes provide non-linear substitution. This is the only non-linear component of DES/AES and is essential to prevent simple linear algebraic cryptanalysis.'
    },
    {
      id: 2,
      question: 'Which mathematical field is used to perform calculations in the AES MixColumns step?',
      options: [
        'Modulo 10 Arithmetic',
        'Galois Field GF(2^8) Finite Field',
        'Elliptic Curve Prime Fields',
        'Standard Real Number Matrices'
      ],
      answer: 1,
      explanation: 'AES processes MixColumns using matrix multiplication in Galois Field GF(2^8) modulo the irreducible polynomial x^8 + x^4 + x^3 + x + 1.'
    },
    {
      id: 3,
      question: 'How many round keys are generated in the AES-128 key expansion schedule?',
      options: [
        '10 Round Keys',
        '11 Round Keys (including original key)',
        '16 Round Keys',
        '12 Round Keys'
      ],
      answer: 1,
      explanation: 'AES-128 consists of 10 main rounds. The expansion schedule produces 11 round keys in total (K_0 for initial XOR, followed by 10 keys for the rounds).'
    },
    {
      id: 4,
      question: 'Why is the Initial Permutation (IP) in DES not considered cryptographically secure?',
      options: [
        'It uses a key size smaller than 40 bits',
        'It is a fixed, public permutation with no secret key involved',
        'It can only process alphabetic characters',
        'It alters block sizes from 64 to 48 bits'
      ],
      answer: 1,
      explanation: 'The IP table is public, fixed, and contains no secret key bits. Any attacker can invert it easily using the Final Permutation (FP) table.'
    },
    {
      id: 5,
      question: 'What occurs during the ShiftRows operation of AES?',
      options: [
        'Rows are swapped with columns diagonally',
        'Bytes in row i are shifted cyclically left by i bytes offset',
        'The key schedule is circular-shifted by 1 or 2 bits',
        'Bytes are replaced by lookup values in the S-box'
      ],
      answer: 1,
      explanation: 'ShiftRows shifts row 0 by 0 bytes, row 1 by 1 byte, row 2 by 2 bytes, and row 3 by 3 bytes cyclically to the left.'
    }
  ];

  const handleSelectOption = (idx: number) => {
    if (answered) return;
    setSelectedOpt(idx);
  };

  const handleNext = () => {
    // Save score if correct
    if (selectedOpt === questions[currentIdx].answer) {
      setScore(prev => prev + 1);
    }
    
    // Go next
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const activeQuestion = questions[currentIdx];

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-mono">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white text-glow-blue flex items-center gap-3">
          <FileQuestion className="w-8 h-8 text-[#00f2fe]" />
          CRYPTOGRAPHY MCQ QUIZ
        </h2>
        <p className="text-sm text-slate-400">
          Verify your comprehension of Feistel structures, SPNs, Rijndael schedules, and S-Boxes.
        </p>
      </div>

      {quizFinished ? (
        /* Quiz Finished View */
        <div className="glass-panel p-8 rounded-xl border border-[#00ff66]/20 bg-[#00ff66]/5 text-center space-y-6">
          <Award className="w-16 h-16 text-[#00ff66] mx-auto drop-shadow-[0_0_8px_rgba(0,255,102,0.4)]" />
          <div>
            <h3 className="text-2xl font-bold text-white">QUIZ COMPLETED</h3>
            <p className="text-sm text-slate-400 mt-2">
              You scored <span className="text-[#00ff66] font-bold">{score}</span> out of <span className="text-white">{questions.length}</span> questions.
            </p>
          </div>

          <div className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {score === questions.length 
              ? 'Flawless score! You have successfully mastered the mechanics of DES and AES ciphers.' 
              : 'Keep practicing! Review steps inside the simulators and consult the Learning Center to bolster your cryptography knowledge.'}
          </div>

          <button
            onClick={resetQuiz}
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#00ff66]/30 rounded bg-[#00ff66]/10 text-[#00ff66] text-xs font-bold cursor-pointer hover:bg-[#00ff66]/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            START OVER
          </button>
        </div>
      ) : (
        /* Quiz Active View */
        <div className="glass-panel p-6 rounded-xl border border-slate-850 bg-[#090d16]/30 space-y-6">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
              <span>QUESTION PROGRESS</span>
              <span>{currentIdx + 1} / {questions.length}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
              <div 
                className="h-full bg-[#00f2fe] transition-all duration-300"
                style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <span className="text-xs text-slate-500">QUESTION {currentIdx + 1}:</span>
            <h3 className="text-base font-bold text-white leading-relaxed">
              {activeQuestion.question}
            </h3>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {activeQuestion.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrect = idx === activeQuestion.answer;
              
              let optClass = 'border-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200';
              if (answered) {
                if (isCorrect) {
                  optClass = 'border-[#00ff66] bg-[#00ff66]/5 text-[#00ff66] font-bold';
                } else if (isSelected) {
                  optClass = 'border-rose-500 bg-rose-500/5 text-rose-500';
                } else {
                  optClass = 'border-slate-900 text-slate-600 opacity-60';
                }
              } else if (isSelected) {
                optClass = 'border-[#00f2fe] bg-[#00f2fe]/5 text-[#00f2fe] font-bold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full flex items-center justify-between p-4 border rounded-lg text-xs font-mono text-left cursor-pointer transition-all ${optClass}`}
                >
                  <span>{opt}</span>
                  {answered && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#00ff66] shrink-0" />}
                  {answered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Check / Next Controls */}
          <div className="flex justify-end pt-4 border-t border-slate-900">
            {!answered ? (
              <button
                disabled={selectedOpt === null}
                onClick={() => setAnswered(true)}
                className="px-6 py-2.5 bg-[#00f2fe]/10 border border-[#00f2fe]/30 hover:bg-[#00f2fe]/20 text-[#00f2fe] font-bold text-xs rounded cursor-pointer disabled:opacity-45 disabled:pointer-events-none transition-all glow-blue"
              >
                SUBMIT ANSWER
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00ff66]/10 border border-[#00ff66]/30 hover:bg-[#00ff66]/20 text-[#00ff66] font-bold text-xs rounded cursor-pointer transition-all glow-green"
              >
                <span>{currentIdx === questions.length - 1 ? 'FINISH QUIZ' : 'NEXT QUESTION'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Explanation panel */}
          {answered && (
            <div className="p-4 rounded-lg bg-[#05070a] border border-slate-900 text-xs leading-relaxed text-slate-400 space-y-2">
              <span className="font-bold text-[#00f2fe] flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> EXPLANATION:
              </span>
              <p className="italic">{activeQuestion.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
