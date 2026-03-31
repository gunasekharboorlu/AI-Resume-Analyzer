export interface AnalysisResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  resumeSkills: string[];
  jobSkills: string[];
  suggestions: string[];
}
