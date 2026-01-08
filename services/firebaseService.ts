
import { UserProfile, ReadinessInsight } from "../types";

/**
 * MOCK FIREBASE IMPLEMENTATION
 * In a real scenario, this would use the Firebase JS SDK.
 */

export const mockAuth = {
  signIn: async (): Promise<UserProfile> => {
    // Simulate Firebase Auth delay
    await new Promise(r => setTimeout(r, 800));
    const user = { name: "Demo Student", email: "student@university.edu" };
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  },
  signOut: () => {
    localStorage.removeItem("user");
  },
  getCurrentUser: (): UserProfile | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
};

export const mockFirestore = {
  saveAnalysis: async (userId: string, data: ReadinessInsight) => {
    console.log(`[Firestore Mock] Saving analysis for ${userId}`, data);
    localStorage.setItem(`analysis_${userId}`, JSON.stringify(data));
    return { id: "mock-doc-id" };
  },
  getLatestAnalysis: (userId: string): ReadinessInsight | null => {
    const data = localStorage.getItem(`analysis_${userId}`);
    return data ? JSON.parse(data) : null;
  }
};
