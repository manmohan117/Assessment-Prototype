"use client";

import type { ProcessedAssessmentArea } from '@/types/assessment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AssessmentBarChart } from './charts/AssessmentBarChart';
import { ScoreDistributionPieChart } from './charts/ScoreDistributionPieChart';
import { Lightbulb } from 'lucide-react';

interface VisualizationCardProps {
  processedData: ProcessedAssessmentArea[];
}

function generateInsights(data: ProcessedAssessmentArea[]): string[] {
  if (!data || data.length === 0) return ["No data to generate insights."];

  const insights: string[] = [];
  
  const sortedByAvgScore = [...data].sort((a, b) => b.averageScore - a.averageScore);
  if (sortedByAvgScore.length > 0) {
    insights.push(`Highest average score: ${sortedByAvgScore[0].area} (${sortedByAvgScore[0].averageScore.toFixed(2)})`);
    if (sortedByAvgScore.length > 1) {
      insights.push(`Lowest average score: ${sortedByAvgScore[sortedByAvgScore.length - 1].area} (${sortedByAvgScore[sortedByAvgScore.length - 1].averageScore.toFixed(2)})`);
    }
  }

  const sortedByTotalScore = [...data].sort((a, b) => b.totalScore - a.totalScore);
   if (sortedByTotalScore.length > 0) {
    insights.push(`Highest total score: ${sortedByTotalScore[0].area} (${sortedByTotalScore[0].totalScore})`);
   }

  if (insights.length === 0) return ["Sufficient data not available for detailed insights."];
  return insights;
}


export function VisualizationCard({ processedData }: VisualizationCardProps) {
  if (processedData.length === 0) {
    return null; 
  }
  const insights = generateInsights(processedData);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-horizontal-big h-6 w-6 mr-2 text-primary"><path d="M3 3v18h18"/><path d="M7 16h12"/><path d="M7 11h8"/><path d="M7 6h3"/></svg>
          Data Visualizations
        </CardTitle>
        <CardDescription>Interactive charts representing your assessment data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <AssessmentBarChart data={processedData} />
          <ScoreDistributionPieChart data={processedData} />
        </div>
        {insights.length > 0 && (
          <Card className="bg-secondary/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm text-secondary-foreground">
                {insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
