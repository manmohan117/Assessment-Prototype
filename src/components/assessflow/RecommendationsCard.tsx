
"use client";

import * as React from 'react';
import type { ProcessedAssessmentArea } from '@/types/assessment';
import type { GenerateRecommendationsInput, GenerateRecommendationsOutput } from '@/ai/flows/generate-recommendations-flow';
import { generateRecommendations } from '@/ai/flows/generate-recommendations-flow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RecommendationsCardProps {
  processedData: ProcessedAssessmentArea[];
}

interface AreaRecommendationState {
  isLoading: boolean;
  error: string | null;
  data: GenerateRecommendationsOutput | null;
}

export function RecommendationsCard({ processedData }: RecommendationsCardProps) {
  const { toast } = useToast();
  const [recommendationsMap, setRecommendationsMap] = React.useState<Map<string, AreaRecommendationState>>(new Map());
  const [openAccordionItems, setOpenAccordionItems] = React.useState<string[]>([]);

  const fetchRecommendationsForArea = async (area: ProcessedAssessmentArea) => {
    if (recommendationsMap.get(area.area)?.isLoading || recommendationsMap.get(area.area)?.data) {
      return; // Already loading or loaded
    }

    setRecommendationsMap(prev => new Map(prev).set(area.area, { isLoading: true, error: null, data: null }));

    try {
      const input: GenerateRecommendationsInput = {
        assessmentAreaName: area.area,
        averageScore: area.averageScore,
        questionsAndScores: area.questions.map(q => ({ question: q.question, score: q.score })),
      };
      const result = await generateRecommendations(input);
      setRecommendationsMap(prev => new Map(prev).set(area.area, { isLoading: false, error: null, data: result }));
    } catch (err: any) {
      console.error(`Failed to generate recommendations for ${area.area}:`, err);
      const errorMessage = err.message || `Failed to load recommendations for ${area.area}.`;
      setRecommendationsMap(prev => new Map(prev).set(area.area, { isLoading: false, error: errorMessage, data: null }));
      toast({
        title: `Error: ${area.area}`,
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleAccordionChange = (value: string[]) => {
    setOpenAccordionItems(value);
    value.forEach(areaName => {
      const area = processedData.find(a => a.area === areaName);
      // Fetch recommendations if area score is not green (>=7) and not already fetched/loading
      if (area && area.averageScore < 7) {
         if (!recommendationsMap.has(areaName) || (!recommendationsMap.get(areaName)?.isLoading && !recommendationsMap.get(areaName)?.data && !recommendationsMap.get(areaName)?.error)) {
            fetchRecommendationsForArea(area);
        }
      }
    });
  };

  const getScoreMetadata = (score: number): { variant: "destructive" | "warning" | "accent", label: string, borderColorClass: string } => {
    if (score < 4) return { variant: "destructive", label: "Needs Improvement", borderColorClass: "border-destructive" };
    if (score < 7) return { variant: "warning", label: "Review Suggested", borderColorClass: "border-yellow-500" }; 
    return { variant: "accent", label: "Good", borderColorClass: "border-accent" };
  };

  if (processedData.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-6 w-6 mr-2 text-primary" />
          Recommendations & Action Plan
        </CardTitle>
        <CardDescription>
          Personalized insights and suggestions to enhance understanding and performance. Areas are color-coded by average score.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" value={openAccordionItems} onValueChange={handleAccordionChange} className="w-full">
          {processedData.map((area) => {
            const areaState = recommendationsMap.get(area.area);
            const scoreMeta = getScoreMetadata(area.averageScore);
            
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
                         {scoreMeta.label}
                       </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  {area.averageScore >= 7 ? (
                    <p className="text-sm text-muted-foreground">Performance in this area is satisfactory. Focus on maintaining this level of understanding.</p>
                  ) : areaState?.isLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                      <p>Loading recommendations...</p>
                    </div>
                  ) : areaState?.error ? (
                     <div className="flex items-center text-destructive p-4">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      <p>Error: {areaState.error}</p>
                    </div>
                  ) : areaState?.data ? (
                    <div className="space-y-4">
                      <p className="italic text-foreground bg-secondary/50 p-3 rounded-md">{areaState.data.overallComment}</p>
                      <ul className="space-y-3">
                        {areaState.data.recommendations.map((recItem, index) => {
                           const questionScoreMeta = getScoreMetadata(recItem.score);
                           return (
                            <li key={`${area.area}-q-${index}`} className={`p-3 rounded-md border-l-4 ${questionScoreMeta.borderColorClass} bg-card shadow-sm`}>
                                <p className="font-semibold text-foreground">{recItem.question}</p>
                                <p className="text-xs text-muted-foreground mb-1">Score: {recItem.score}/10</p>
                                <p className="text-sm text-secondary-foreground">{recItem.recommendationText}</p>
                            </li>
                           )
                        })}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Expand to load recommendations for this area.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
