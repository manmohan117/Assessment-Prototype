"use client"

import type { ProcessedAssessmentArea } from '@/types/assessment';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

interface AssessmentBarChartProps {
  data: ProcessedAssessmentArea[];
}

const chartConfig = {
  averageScore: {
    label: "Avg. Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function AssessmentBarChart({ data }: AssessmentBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Average Scores by Area</CardTitle>
          <CardDescription>Bar chart visualizing average scores.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available for bar chart.</p>
        </CardContent>
      </Card>
    );
  }
  
  const chartData = data.map(item => ({
    name: item.area,
    averageScore: item.averageScore,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Scores by Area</CardTitle>
        <CardDescription>Comparison of average assessment scores across different areas.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={60} 
                tick={{ fontSize: 10, fill: 'hsl(var(--foreground))' }} 
                interval={0}
              />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent />} 
              />
              <Bar dataKey="averageScore" fill="var(--color-averageScore)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
