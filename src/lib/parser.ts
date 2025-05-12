import type { RawAssessmentData, ParsedAssessmentItem, ProcessedAssessmentArea } from '@/types/assessment';

export const parseCSV = (csvText: string): ParsedAssessmentItem[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error("CSV must have a header row and at least one data row.");
  }

  const headerLine = lines[0].trim();
  const headers = headerLine.split(',').map(h => h.trim());
  
  const areaHeader = headers.find(h => h.toLowerCase().includes('assessment area'));
  const questionHeader = headers.find(h => h.toLowerCase().includes('question'));
  const scoreHeader = headers.find(h => h.toLowerCase().includes('score'));
  const recommendationHeader = headers.find(h => h.toLowerCase().includes('recommendation'));

  if (!areaHeader || !questionHeader || !scoreHeader) {
    throw new Error("CSV must contain 'Assessment Area', 'Question', and 'Score' columns.");
  }
  
  const dataRows = lines.slice(1);
  const parsedData: ParsedAssessmentItem[] = [];

  dataRows.forEach((line, index) => {
    const values = line.trim().split(',');
    const rowData: RawAssessmentData = {
      'Assessment Area': '', // Initialize with default values
      'Question': '',
      'Score': '',
    };

    headers.forEach((header, i) => {
      rowData[header] = values[i] ? values[i].trim() : '';
    });
    
    const score = parseFloat(rowData[scoreHeader]);
    if (isNaN(score)) {
      console.warn(`Invalid score at row ${index + 1}: '${rowData[scoreHeader]}'. Skipping this row.`);
      return;
    }

    const recommendation = recommendationHeader ? (rowData[recommendationHeader] || null) : null;

    parsedData.push({
      assessmentArea: rowData[areaHeader],
      question: rowData[questionHeader],
      score: score,
      recommendation: recommendation,
    });
  });

  return parsedData;
};

export const processAssessmentData = (parsedData: ParsedAssessmentItem[]): ProcessedAssessmentArea[] => {
  const areaMap: Map<string, { totalScore: number; questions: Array<{ question: string; score: number; recommendation?: string | null }> }> = new Map();

  parsedData.forEach(item => {
    if (!areaMap.has(item.assessmentArea)) {
      areaMap.set(item.assessmentArea, { totalScore: 0, questions: [] });
    }
    const areaData = areaMap.get(item.assessmentArea)!;
    areaData.totalScore += item.score;
    areaData.questions.push({ question: item.question, score: item.score, recommendation: item.recommendation });
  });

  const processedAreas: ProcessedAssessmentArea[] = [];
  areaMap.forEach((data, area) => {
    const questionCount = data.questions.length;
    processedAreas.push({
      area,
      totalScore: data.totalScore,
      averageScore: questionCount > 0 ? parseFloat((data.totalScore / questionCount).toFixed(2)) : 0,
      questionCount,
      questions: data.questions,
    });
  });

  return processedAreas.sort((a, b) => a.area.localeCompare(b.area));
};
