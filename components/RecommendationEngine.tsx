
import React, { useState, useEffect } from 'react';
import { Recommendation, ReadinessInsight } from '../types';
import { generateRecommendations } from '../services/geminiService';

interface RecommendationEngineProps {
  insight: ReadinessInsight;
}

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({ insight }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await generateRecommendations(insight.gaps, insight.roleAnalysis[0].role);
        setRecommendations(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [insight]);

  return (
    <div className="max-w-6xl mx-auto py-20 px-6">
      <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-2xl shadow-slate-300/40 overflow-hidden">
        {/* Section Header */}
        <div className="px-12 py-12 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">What’s Next — Your Roadmap</h2>
              <p className="text-slate-500 mt-2 font-bold text-sm uppercase tracking-wide">Structured evolution plan calibrated to your current profile.</p>
            </div>
            <div className="flex-shrink-0">
               <span className="px-5 py-2 bg-white border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-sm">Horizon: 6 Months</span>
            </div>
          </div>
        </div>

        <div className="p-12">
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-white/50 rounded-2xl border border-slate-100 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="relative">
              {/* Professional Timeline Axis */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200 hidden md:block"></div>
              
              <div className="space-y-12">
                {recommendations.map((rec, i) => (
                  <div key={i} className="relative flex flex-col md:flex-row gap-10 pl-0 md:pl-20 group">
                    {/* Circle Indicator */}
                    <div className="absolute left-0 top-0 w-16 h-16 bg-white border border-slate-200 text-slate-900 rounded-full hidden md:flex items-center justify-center font-extrabold text-lg z-10 group-hover:border-blue-600 group-hover:text-blue-600 group-hover:scale-110 transition-all shadow-md">
                      {i + 1}
                    </div>

                    <div className="flex-grow p-10 bg-white border border-slate-100 rounded-[2rem] group-hover:border-blue-100 group-hover:bg-blue-50/10 transition-all shadow-lg group-hover:shadow-xl group-hover:shadow-blue-100/50">
                      <div className="flex flex-wrap items-center gap-4 mb-5">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest shadow-sm ${
                          rec.priority === 'Critical' ? 'bg-slate-900 text-white' : 
                          rec.priority === 'High' ? 'bg-white text-slate-900 border border-slate-200' : 
                          'bg-white text-slate-400 border border-slate-100'
                        }`}>
                          {rec.priority} Priority
                        </span>
                        <div className="h-1.5 w-1.5 bg-slate-300 rounded-full"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rec.estimatedTime} Effort</span>
                      </div>
                      
                      <h4 className="text-slate-900 font-extrabold text-xl tracking-tight mb-3">
                        {rec.action}
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed font-bold">
                        {rec.description}
                      </p>
                      
                      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                        <button className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.25em] hover:text-blue-600 transition-colors flex items-center gap-2">
                          View Resource Guide
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Phase 0{i+1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Insight */}
        <div className="bg-slate-50/80 p-10 border-t border-slate-100">
           <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-2xl shadow-md">📊</div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-2">Diagnostic Inference</p>
                <p className="text-sm font-bold text-slate-700 leading-relaxed italic leading-tight">
                  "Phase 1 execution is critical for your standing. Prioritizing these technical signals is expected to shift your readiness index by 15% within the first month."
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationEngine;
