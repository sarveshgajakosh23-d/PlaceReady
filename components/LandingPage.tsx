
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-40">
      <div className="text-center mb-32">
        <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-[0.25em] rounded-full mb-10 border border-blue-100 shadow-sm">
          Factual Engineering Diagnostics
        </div>
        <h1 className="text-6xl md:text-8xl font-extrabold text-slate-900 tracking-tight mb-10 max-w-5xl mx-auto leading-[0.95]">
          Know your <span className="text-slate-400 font-bold">real</span> readiness.
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
          Professional career-readiness analysis for students. Evidence-based assessment, structured gap mapping, and industry-calibrated roadmaps.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={onGetStarted}
            className="px-12 py-4 bg-slate-900 text-white font-bold text-lg rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 btn-hover"
          >
            Start Diagnostic Audit
          </button>
          <button className="px-12 py-4 bg-white text-slate-700 border border-slate-200 font-bold text-lg rounded-xl hover:bg-slate-50 transition-all shadow-sm btn-hover">
            View Example Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-slate-200 pt-24">
        <div>
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-6 text-slate-900 font-bold border border-slate-200 shadow-sm">01</div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Evidence Extraction</h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">Automated analysis of resumes and prep logs. We identify explicit technical signals and project depth without assumptions.</p>
        </div>
        <div>
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-6 text-slate-900 font-bold border border-slate-200 shadow-sm">02</div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Market Calibration</h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">Benchmarks derived from active industry hiring metrics. Evaluation adjusted by academic year to provide relevant growth targets.</p>
        </div>
        <div>
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-6 text-slate-900 font-bold border border-slate-200 shadow-sm">03</div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Reasoned Roadmaps</h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">Not just scores, but justifications. Receive a conservative action plan focused on bridging identified market gaps.</p>
        </div>
      </div>

      {/* Trust Quote Section */}
      <div className="mt-40 p-16 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          <div className="md:w-3/5">
            <p className="text-3xl font-bold text-slate-800 leading-tight tracking-tight mb-12">
              "The shift from academic credentials to verified project evidence is the core of modern placement success."
            </p>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-slate-100 rounded-full border border-slate-200"></div>
              <div>
                <p className="text-base font-bold text-slate-900">Sarah Drasner</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">VP Engineering • Lead Mentor</p>
              </div>
            </div>
          </div>
          <div className="md:w-2/5 w-full bg-slate-50 p-10 rounded-xl border border-slate-200">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Internal Model Status</h4>
            <div className="space-y-4">
              <div className="h-2 w-full bg-white rounded-full border border-slate-100 overflow-hidden">
                <div className="h-full bg-blue-600 w-3/4"></div>
              </div>
              <div className="h-2 w-5/6 bg-white rounded-full border border-slate-100 overflow-hidden">
                <div className="h-full bg-blue-600 w-1/2"></div>
              </div>
              <p className="text-[10px] text-blue-600 font-bold mt-6 tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                Analysis Core: Validated
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
