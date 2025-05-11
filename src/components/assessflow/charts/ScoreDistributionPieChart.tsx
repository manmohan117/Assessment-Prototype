"use client"

import type { ProcessedAssessmentArea } from '@/types/assessment';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'; 


interface ScoreDistributionPieChartProps {
  data: ProcessedAssessmentArea[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(207, 68%, 65%)', // Lighter blue
  'hsl(145, 63%, 60%)', // Lighter green
];

export function ScoreDistributionPieChart({ data }: ScoreDistributionPieChartProps) {
   if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Total Score Distribution</CardTitle>
          <CardDescription>Pie chart visualizing total scores per area.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available for pie chart.</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map(item => ({
    name: item.area,
    value: item.totalScore,
    fill: COLORS[data.indexOf(item) % COLORS.length] // Assign color for legend
  }));

  const chartConfig: ChartConfig = chartData.reduce((acc, item) => {
    acc[item.name] = {
      label: item.name,
      color: item.fill,
    };
    return acc;
  }, {} as ChartConfig);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Score Distribution by Area</CardTitle>
        <CardDescription>Proportion of total scores contributed by each assessment area.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent hideLabel />} />
              <Legend wrapperStyle={{fontSize: "12px"}}/>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
