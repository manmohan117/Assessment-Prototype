export interface RawAssessmentData {
  'Assessment Area': string;
  'Question': string;
  'Score': string; // Keep as string initially from CSV, then parse to number
  'Recommendation'?: string; // Optional recommendation column
  [key: string]: string; // Allow other potential columns
}

export interface ParsedAssessmentItem {
  assessmentArea: string;
  question: string;
  score: number;
  recommendation?: string | null; // Optional recommendation
}

export interface ProcessedAssessmentArea {
  area: string;
  totalScore: number;
  averageScore: number;
  questionCount: number;
  questions: Array<{ question: string; score: number; recommendation?: string | null }>;
}
