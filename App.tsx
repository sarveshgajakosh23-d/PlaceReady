
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import InterviewSimulator from './components/InterviewSimulator';
import RecommendationEngine from './components/RecommendationEngine';
import { AppView, UserProfile, ReadinessInsight } from './types';
import { mockAuth } from './services/firebaseService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [insight, setInsight] = useState<ReadinessInsight | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const checkUser = () => {
      const currentUser = mockAuth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setIsAuthLoading(false);
    };
    checkUser();
  }, []);

  const handleLogin = async () => {
    const loggedInUser = await mockAuth.signIn();
    setUser(loggedInUser);
    setView('dashboard');
  };

  const handleLogout = () => {
    mockAuth.signOut();
    setUser(null);
    setInsight(null);
    setView('landing');
  };

  const renderContent = () => {
    if (isAuthLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (view) {
      case 'landing':
        return <LandingPage onGetStarted={user ? () => setView('dashboard') : handleLogin} />;
      case 'dashboard':
        return (
          <>
            <Dashboard 
              user={user!} 
              insight={insight} 
              onAnalysisComplete={(data) => setInsight(data)} 
            />
            {insight && <RecommendationEngine insight={insight} />}
          </>
        );
      case 'interview':
        if (!insight) {
           return (
             <div className="max-w-2xl mx-auto py-20 px-4 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Dashboard first!</h2>
                <p className="text-slate-600 mb-8">You need to upload your preparation data and get an AI insight before you can simulate an interview.</p>
                <button 
                  onClick={() => setView('dashboard')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold"
                >
                  Go to Dashboard
                </button>
             </div>
           );
        }
        return <InterviewSimulator role={insight.roleAnalysis[0].role} />;
      default:
        return <LandingPage onGetStarted={handleLogin} />;
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout} onNav={(v) => setView(v)}>
      {renderContent()}
    </Layout>
  );
};

export default App;
