
import React, { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer
} from 'recharts';
import { ReadinessInsight, UserProfile } from '../types';
import { analyzeReadiness } from '../services/geminiService';
import { mockFirestore } from '../services/firebaseService';

interface DashboardProps {
  user: UserProfile;
  onAnalysisComplete: (data: ReadinessInsight) => void;
  insight: ReadinessInsight | null;
}

const ROLES = ["Software Development Engineer", "Backend Developer", "Data Scientist", "Frontend Specialist"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const Dashboard: React.FC<DashboardProps> = ({ user, onAnalysisComplete, insight }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [selectedYear, setSelectedYear] = useState(YEARS[3]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const mockResumeText = `
      Name: Demo Student
      Education: B.Tech Computer Science, 2025 Grad
      Experience: Summer Internship at TechCorp (Worked on React and Node.js)
      Projects: Personal E-commerce site using MongoDB, Flask, and React.
      Skills: JavaScript, Python, C++, AWS Foundations Certification.
      No mentioned LeetCode link. No mentioned GitHub profile.
      `;
      const result = await analyzeReadiness(selectedRole, selectedYear, file.name, mockResumeText);
      await mockFirestore.saveAnalysis(user.email, result);
      onAnalysisComplete(result);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please check your credentials.");
    } finally {
      setUploading(false);
    }
  };

  if (!insight) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-6">
        <div className="bg-white rounded-[2rem] border border-white/50 p-12 shadow-2xl shadow-slate-300/60">
          <div className="mb-12 pb-10 border-b border-slate-100">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Diagnostic Initiation</h1>
            <p className="text-slate-500 mt-3 text-base font-medium">Select your professional parameters to begin the assessment.</p>
          </div>

          <div className="space-y-12">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-6">Target Specialization</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`p-6 rounded-2xl border text-left transition-all btn-hover ${
                      selectedRole === role 
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600 shadow-lg shadow-blue-100' 
                        : 'border-slate-200 text-slate-500 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-sm leading-tight">{role}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 p-8 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-white/60">
              <div className="text-sm">
                <h4 className="font-bold text-slate-900">Academic Standing</h4>
                <p className="text-slate-500 text-xs mt-1.5 font-medium">Benchmarks are calibrated to your standing.</p>
              </div>
              <div className="flex gap-2.5 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
                {YEARS.map(y => (
                  <button 
                    key={y}
                    onClick={() => setSelectedYear(y)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                      selectedYear === y 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-12 text-center border-t border-slate-100">
              <label className={`inline-flex items-center px-12 py-4 bg-slate-900 text-white rounded-2xl font-bold text-base cursor-pointer hover:bg-slate-800 transition-all shadow-xl shadow-slate-400/20 btn-hover ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {uploading ? 'Generating Report...' : 'Upload Audit Source'}
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.txt,.docx" />
              </label>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mt-10 flex items-center justify-center gap-3 italic">
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                Powered by Gemini AI Engine
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-6">
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200/50 pb-12 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
             <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.25em]">Audit Profile v1.0.4</span>
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">{insight.roadmapType} Evaluation</h1>
          <p className="text-slate-500 font-bold text-base mt-3">
            {insight.roleAnalysis[0].role} • {insight.academicYear} Student
          </p>
        </div>
        <button 
          onClick={() => onAnalysisComplete(null as any)}
          className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all shadow-md btn-hover"
        >
          Reset Audit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
        {/* Score Card */}
        <div className="lg:col-span-4 bg-white p-12 rounded-[2rem] border border-white/50 shadow-2xl shadow-slate-300/40 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-12">Readiness Index</span>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="88" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
              <circle 
                cx="96" cy="96" r="88" fill="transparent" 
                stroke="#2563eb" strokeWidth="12" 
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - insight.score / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-7xl font-extrabold text-slate-900 tracking-tighter leading-none">{insight.score}</span>
              <span className="text-slate-400 font-bold text-[10px] tracking-widest mt-2 uppercase">%</span>
            </div>
          </div>
          <div className="mt-12 px-8 py-2.5 rounded-xl bg-slate-900 text-[10px] font-bold uppercase text-white tracking-[0.2em] shadow-xl shadow-slate-300">
            {insight.score > 75 ? "Optimal" : insight.score > 50 ? "Progressive" : "Developmental"}
          </div>
        </div>

        {/* Skill Chart */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[2rem] border border-white/50 shadow-2xl shadow-slate-300/40">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-12 border-b border-slate-100 pb-5">Technical Benchmarking</h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={insight.skillData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                <Radar name="Skills" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.08} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evidence Logs */}
        <div className="lg:col-span-12 bg-white/70 backdrop-blur-md p-10 rounded-[2rem] border border-white/60 shadow-2xl shadow-slate-300/40">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-10 flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-slate-900 rounded-full"></span>
            Diagnostic Signals Extracted
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insight.evidenceSignals.map((signal, i) => (
              <div key={i} className="p-6 border border-slate-200/50 rounded-2xl bg-white hover:bg-slate-50 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{signal.category}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${
                    signal.evidenceLevel === 'Strong Evidence' ? 'bg-slate-900 text-white border-slate-900' :
                    signal.evidenceLevel === 'Some Evidence' ? 'bg-slate-50 text-slate-900 border-slate-200' :
                    'bg-slate-50 text-slate-400 border-slate-100'
                  }`}>
                    {signal.evidenceLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-bold leading-relaxed italic">"{signal.details || "Inconclusive evidence."}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnostic Narrative */}
        <div className="lg:col-span-12 bg-white border border-white/50 rounded-[2.5rem] shadow-2xl shadow-slate-300/50 overflow-hidden">
          <div className="bg-slate-900 px-10 py-6 flex justify-between items-center">
            <h3 className="text-white text-[11px] font-bold uppercase tracking-[0.3em]">AI Reasoning Core • Synthesis Report</h3>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest hidden sm:block">Model: GEMINI-3-PRO-AUDIT</span>
          </div>
          <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="space-y-16">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-8">Validated Strengths</p>
                <div className="space-y-4">
                  {insight.strengths.map((s, i) => (
                    <div key={i} className="flex items-center gap-5 text-sm font-bold text-slate-800 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-12 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-8">Expert Justification</p>
                <p className="text-3xl font-extrabold text-slate-900 leading-[1.2] tracking-tight italic">"{insight.explanation}"</p>
              </div>
            </div>
            
            <div className="bg-slate-50/50 backdrop-blur-sm p-12 rounded-[2rem] border border-white relative shadow-inner">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-12">Calibrated Market Alignment</p>
              
              <div className="space-y-8">
                {insight.roleAnalysis.map((role, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-base font-bold text-slate-900 tracking-tight">{role.role}</p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Matched</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed italic">"{role.fit}"</p>
                  </div>
                ))}
              </div>

              <div className="mt-16 p-8 bg-slate-900 rounded-2xl border border-slate-800 text-white shadow-2xl shadow-slate-400/50 transform rotate-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Priority Recommendation</p>
                <p className="text-base font-bold leading-tight italic">"{insight.nextBestAction}"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
