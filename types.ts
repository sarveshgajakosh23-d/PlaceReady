
export interface EvidenceSignal {
  category: string;
  evidenceLevel: 'Strong Evidence' | 'Some Evidence' | 'Not Mentioned';
  details: string;
}

export interface ReadinessInsight {
  score: number;
  roleAnalysis: {
    role: string;
    fit: string;
  }[];
  gaps: string[];
  strengths: string[];
  weaknesses: string[];
  explanation: string;
  roadmapDescription: string;
  skillData: {
    subject: string;
    A: number;
  }[];
  roadmapType: string;
  academicYear: string;
  evidenceSignals: EvidenceSignal[];
  nextBestAction: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  context: string;
}

export interface InterviewEvaluation {
  overallScore: number;
  clarity: string;
  depth: string;
  suggestions: string[];
}

export interface Recommendation {
  priority: 'Critical' | 'High' | 'Moderate';
  action: string;
  description: string;
  estimatedTime: string;
}

export type AppView = 'landing' | 'dashboard' | 'interview' | 'results';

export interface UserProfile {
  name: string;
  email: string;
  academicYear?: string;
  uploadedFile?: string;
}
