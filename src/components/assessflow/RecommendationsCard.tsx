
"use client";

import * as React from 'react';
import type { ProcessedAssessmentArea } from '@/types/assessment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react'; // Using Lightbulb for insights, not sparkles

interface RecommendationsCardProps {
  processedData: ProcessedAssessmentArea[];
}

export function RecommendationsCard({ processedData }: RecommendationsCardProps) {
  const [openAccordionItems, setOpenAccordionItems] = React.useState<string[]>([]);

  const getScoreMetadata = (score: number): { variant: "destructive" | "warning" | "accent", label: string, borderColorClass: string, icon: React.ElementType } => {
    if (score < 4) return { variant: "destructive", label: "Needs Improvement", borderColorClass: "border-destructive", icon: AlertTriangle };
    if (score < 7) return { variant: "warning", label: "Review Suggested", borderColorClass: "border-yellow-500", icon: Lightbulb }; 
    return { variant: "accent", label: "Good", borderColorClass: "border-accent", icon: CheckCircle2 };
  };

  const getOverallComment = (averageScore: number): string => {
    if (averageScore < 4) return "This area needs significant attention and improvement based on the average score. Focus on foundational concepts for questions with low scores.";
    if (averageScore < 7) return "While there's a basic understanding, there are clear areas for growth. Review specific question recommendations for targeted improvement.";
    return "Overall performance in this area is good. Maintain this level of understanding and address any specific feedback on individual questions if provided.";
  };
  
  const getQuestionRecommendationText = (score: number, providedRecommendation?: string | null): string => {
    if (providedRecommendation && providedRecommendation.trim() !== "") {
      return providedRecommendation;
    }
    if (score >= 7) return "Performance is satisfactory for this question. No specific recommendation needed.";
    if (score < 4) return "Action recommended. (No specific recommendation provided in the file). Focus on understanding the core concepts related to this question.";
    return "Review suggested. (No specific recommendation provided in the file). Consider additional practice or clarification on this topic.";
  }

  if (processedData.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-6 w-6 mr-2 text-primary" />
          Recommendations & Action Plan
        </CardTitle>
        <CardDescription>
          Insights and suggestions based on your assessment data. Areas are color-coded by average score.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" value={openAccordionItems} onValueChange={setOpenAccordionItems} className="w-full">
          {processedData.map((area) => {
            const scoreMeta = getScoreMetadata(area.averageScore);
            const overallComment = getOverallComment(area.averageScore);
            
            const badgeVariant = scoreMeta.variant === 'warning' ? undefined : scoreMeta.variant;
            const badgeClass = scoreMeta.variant === 'warning' ? 'bg-yellow-500 text-warning-foreground hover:bg-yellow-500/90' : '';


            return (
              <AccordionItem value={area.area} key={area.area}>
                <AccordionTrigger>
                  <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between w-full gap-1 sm:gap-4">
                    <span className="font-medium text-left mr-2">{area.area}</span>
                    <div className="flex items-center space-x-2 self-start sm:self-center">
                       <span className="text-sm text-muted-foreground whitespace-nowrap">Avg: {area.averageScore.toFixed(2)}</span>
                       <Badge variant={badgeVariant} className={`${badgeClass} whitespace-nowrap`}>
                         <scoreMeta.icon className="inline-block h-3 w-3 mr-1"/>
                         {scoreMeta.label}
                       </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <div className="space-y-4">
                    <p className="italic text-foreground bg-secondary/50 p-3 rounded-md">{overallComment}</p>
                    {area.questions.length > 0 ? (
                      <ul className="space-y-3">
                        {area.questions.map((qItem, index) => {
                           const questionScoreMeta = getScoreMetadata(qItem.score);
                           const recommendationText = getQuestionRecommendationText(qItem.score, qItem.recommendation);
                           return (
                            <li key={`${area.area}-q-${index}`} className={`p-3 rounded-md border-l-4 ${questionScoreMeta.borderColorClass} bg-card shadow-sm`}>
                                <p className="font-semibold text-foreground">{qItem.question}</p>
                                <p className="text-xs text-muted-foreground mb-1">Score: {qItem.score}/10</p>
                                <p className="text-sm text-secondary-foreground">{recommendationText}</p>
                            </li>
                           )
                        })}
                      </ul>
                    ) : (
                       <p className="text-sm text-muted-foreground">No questions data available for this area.</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
