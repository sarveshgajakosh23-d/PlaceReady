
import React, { useState, useEffect } from 'react';
import { InterviewQuestion, InterviewEvaluation } from '../types';
import { generateInterviewQuestions, evaluateInterview } from '../services/geminiService';

interface InterviewSimulatorProps {
  role: string;
}

const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({ role }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>(['', '']);
  const [currentStep, setCurrentStep] = useState(0);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const q = await generateInterviewQuestions(role);
        setQuestions(q);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [role]);

  const handleSubmit = async () => {
    setIsEvaluating(true);
    try {
      const result = await evaluateInterview(questions, answers);
      setEvaluation(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center">
        <div className="inline-block w-8 h-8 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Curating Assessment Parameters...</p>
      </div>
    );
  }

  if (evaluation) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-6">
        <div className="bg-white rounded-[2.5rem] border border-white/50 shadow-2xl shadow-slate-300/60 overflow-hidden">
          <div className="bg-slate-900 px-8 py-4 flex justify-between items-center">
            <h2 className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">Assessment Scorecard</h2>
            <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Evaluation: GEMINI_PRO_RECRUIT</span>
          </div>
          
          <div className="p-12">
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-100 pb-12 mb-12 gap-8">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Performance Summary</h3>
                <p className="text-slate-500 font-semibold text-sm mt-1">Role Assessment: {role}</p>
              </div>
              <div className="bg-slate-50 px-10 py-6 rounded-2xl border border-slate-200 text-center shadow-inner">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Final Index</p>
                <p className="text-5xl font-extrabold text-slate-900 tracking-tighter">{evaluation.overallScore}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Articulation Quality</p>
                <p className="text-base font-semibold text-slate-800 leading-relaxed italic">"{evaluation.clarity}"</p>
              </div>
              <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Technical Depth</p>
                <p className="text-base font-semibold text-slate-800 leading-relaxed italic">"{evaluation.depth}"</p>
              </div>
            </div>

            <div className="mb-14">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Correction & Growth Gaps</h4>
              <div className="space-y-4">
                {evaluation.suggestions.map((s, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-700 shadow-sm">
                    <span className="text-blue-600 font-extrabold">{i+1}.</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all text-xs uppercase tracking-widest shadow-xl shadow-slate-300 btn-hover"
            >
              Return to Readiness Center
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="mb-10 flex justify-between items-end border-b border-slate-200/50 pb-8">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Live Session</span>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">Diagnostic Interview</h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Challenge {currentStep + 1} of 2</p>
          <div className="w-40 bg-white h-1.5 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-slate-900 transition-all duration-500" style={{ width: `${((currentStep + 1) / 2) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-white/50 p-12 shadow-2xl shadow-slate-300/60">
        <div className="mb-10">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-5 block">Assessment Prompt</span>
          <h3 className="text-2xl font-extrabold text-slate-900 leading-tight mb-8 tracking-tight">{questions[currentStep]?.question}</h3>
          <div className="p-6 bg-slate-50 rounded-xl border-l-4 border-slate-300 text-slate-500 text-xs font-semibold leading-relaxed italic">
             Context: "{questions[currentStep]?.context}"
          </div>
        </div>

        <div className="mb-10">
          <textarea
            className="w-full h-72 p-8 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all resize-none text-slate-800 text-base font-medium leading-relaxed shadow-inner"
            placeholder="Document your technical solution with explicit reasoning..."
            value={answers[currentStep]}
            onChange={(e) => {
              const newAnswers = [...answers];
              newAnswers[currentStep] = e.target.value;
              setAnswers(newAnswers);
            }}
          />
        </div>

        <div className="flex justify-between items-center">
          <button 
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(0)}
            className="text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-slate-900 disabled:opacity-0 transition-colors"
          >
            Step 1
          </button>
          
          <button 
            disabled={(currentStep === 1 && (!answers[1].trim() || isEvaluating)) || (currentStep === 0 && !answers[0].trim())}
            onClick={currentStep === 0 ? () => setCurrentStep(1) : handleSubmit}
            className="px-12 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-20 text-xs uppercase tracking-widest shadow-xl shadow-slate-300 btn-hover"
          >
            {isEvaluating ? 'Syncing...' : (currentStep === 0 ? 'Next Assessment' : 'Finalise Response')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSimulator;
