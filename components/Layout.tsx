
import React from 'react';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
  onLogout: () => void;
  onNav: (view: any) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNav }) => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100">
      <header className="bg-white/60 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => onNav('landing')}
          >
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-600 transition-colors">
              <span className="text-white font-bold text-base">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">PlaceReady</span>
          </div>

          {user ? (
            <div className="flex items-center gap-8">
              <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
                <button onClick={() => onNav('dashboard')} className="hover:text-slate-900 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600">Dashboard</button>
                <button onClick={() => onNav('interview')} className="hover:text-slate-900 transition-colors py-2 border-b-2 border-transparent hover:border-blue-600">Assessment</button>
              </nav>
              <div className="flex items-center gap-4 pl-8 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 leading-none mb-1">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.email.split('@')[0]}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors btn-hover shadow-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
               <button className="text-sm font-semibold text-slate-500 hover:text-slate-900 px-4 py-2 transition-colors">Sign In</button>
               <button className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-all shadow-md btn-hover">
                Get Started
               </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-slate-900/5 backdrop-blur-sm border-t border-slate-200 py-12 mt-24">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
              &copy; {new Date().getFullYear()} PlaceReady • Career Intelligence
            </span>
          </div>
          <div className="flex gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Methodology</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
