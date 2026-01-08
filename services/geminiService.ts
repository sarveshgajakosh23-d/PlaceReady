
import { GoogleGenAI, Type } from "@google/genai";
import { ReadinessInsight, InterviewQuestion, InterviewEvaluation, Recommendation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * GEMINI USAGE: Analysis Engine
 * Persona: Strict resume analyst and career architect.
 */
export const analyzeReadiness = async (role: string, academicYear: string, fileName: string, resumeText: string): Promise<ReadinessInsight> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `
You are a career-readiness and roadmap platform for engineering students.
ROLE: Strict resume analyst and career architect.

STRICT RULES:
- Analyze ONLY what is explicitly present in the resume text.
- NEVER assume skills, platforms, or problem counts.
- If a signal is missing, mark it as "Not evident in resume".
- Adjust scores based on evidence density, not assumptions.

INPUT:
Target Role: ${role}
Academic Year: ${academicYear}
Source File: ${fileName}
Content:
${resumeText}

TASKS:
1. Extract structured signals (Technical, Academic, Projects, Internships, Extracurricular, Portfolio).
2. For each, classify as: "Strong Evidence", "Some Evidence", or "Not Mentioned".
3. Generate a Readiness Score (0–100) justified ONLY using resume evidence.
4. Decide roadmap type: "Learning", "Execution", or "Acceleration".
5. Generate a "Resume Trust Statement" explaining what could/could not be inferred.
6. Clearly explain strengths, gaps, and the NEXT BEST ACTION.

OUTPUT must be professional, conservative, and enterprise-grade.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          roadmapType: { type: Type.STRING },
          roadmapDescription: { type: Type.STRING },
          nextBestAction: { type: Type.STRING },
          roleAnalysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                fit: { type: Type.STRING }
              }
            }
          },
          evidenceSignals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                evidenceLevel: { type: Type.STRING, enum: ["Strong Evidence", "Some Evidence", "Not Mentioned"] },
                details: { type: Type.STRING }
              }
            }
          },
          gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          explanation: { type: Type.STRING },
          skillData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                A: { type: Type.NUMBER }
              }
            }
          }
        },
        required: ["score", "roadmapType", "roadmapDescription", "roleAnalysis", "gaps", "strengths", "weaknesses", "explanation", "skillData", "evidenceSignals", "nextBestAction"]
      }
    }
  });

  const parsed = JSON.parse(response.text || '{}');
  return { ...parsed, academicYear };
};

/**
 * GEMINI USAGE: Roadmap Generator
 */
export const generateRecommendations = async (gaps: string[], role: string): Promise<Recommendation[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `
Generate a forward-looking roadmap titled: "WHAT’S NEXT: ACTIONABLE ROADMAP".
Persona: Senior career mentor.

INPUT:
- Identified Gaps: ${gaps.join(", ")}
- Target Role: ${role}

Generate 3-5 concrete steps. 
For each step, provide:
- Priority (Critical, High, Moderate)
- Action title (Professional, no emojis)
- Brief execution description
- Estimated time to complete

OUTPUT MUST BE STRICT JSON ARRAY.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            priority: { type: Type.STRING, enum: ['Critical', 'High', 'Moderate'] },
            action: { type: Type.STRING },
            description: { type: Type.STRING },
            estimatedTime: { type: Type.STRING }
          },
          required: ["priority", "action", "description", "estimatedTime"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

export const generateInterviewQuestions = async (role: string): Promise<InterviewQuestion[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `You are a technical recruiter. Generate 2 interview questions for ${role}. Focus on evidence-based technical depth. JSON ONLY.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            context: { type: Type.STRING }
          },
          required: ["id", "question", "context"]
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const evaluateInterview = async (questions: InterviewQuestion[], answers: string[]): Promise<InterviewEvaluation> => {
  const data = questions.map((q, i) => ({ question: q.question, answer: answers[i] }));
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Evaluate these interview answers: ${JSON.stringify(data)}. Provide scores and professional feedback. JSON ONLY.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          clarity: { type: Type.STRING },
          depth: { type: Type.STRING },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["overallScore", "clarity", "depth", "suggestions"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
