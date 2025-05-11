"use client"

import type { ProcessedAssessmentArea } from '@/types/assessment';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltipContent } from '@/components/ui/chart'; // Using shadcn's chart tooltip

interface AssessmentBarChartProps {
  data: ProcessedAssessmentArea[];
}

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
            <Bar dataKey="averageScore" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
