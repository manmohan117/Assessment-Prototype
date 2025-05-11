"use client";

import type { ParsedAssessmentItem, ProcessedAssessmentArea } from '@/types/assessment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database } from 'lucide-react';

interface DataDisplayCardProps {
  parsedData: ParsedAssessmentItem[];
  processedData: ProcessedAssessmentArea[];
}

export function DataDisplayCard({ parsedData, processedData }: DataDisplayCardProps) {
  if (parsedData.length === 0 && processedData.length === 0) {
    return null; // Don't render if there's no data
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-6 w-6 mr-2 text-primary" />
          Assessment Data
        </CardTitle>
        <CardDescription>View the parsed input and calculated scores for each assessment area.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="processed">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="processed">Processed Scores</TabsTrigger>
            <TabsTrigger value="raw">Parsed Data</TabsTrigger>
          </TabsList>
          <TabsContent value="processed">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assessment Area</TableHead>
                    <TableHead className="text-right">Total Score</TableHead>
                    <TableHead className="text-right">Average Score</TableHead>
                    <TableHead className="text-right">Question Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedData.length > 0 ? processedData.map((area) => (
                    <TableRow key={area.area}>
                      <TableCell className="font-medium">{area.area}</TableCell>
                      <TableCell className="text-right">{area.totalScore}</TableCell>
                      <TableCell className="text-right">{area.averageScore.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{area.questionCount}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">No processed data available.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="raw">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assessment Area</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.length > 0 ? parsedData.slice(0, 100).map((item, index) => ( // Display up to 100 raw items for performance
                    <TableRow key={index}>
                      <TableCell>{item.assessmentArea}</TableCell>
                      <TableCell>{item.question}</TableCell>
                      <TableCell className="text-right">{item.score}</TableCell>
                    </TableRow>
                  )) : (
                     <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">No raw data available or file not yet parsed.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {parsedData.length > 100 && <p className="text-sm text-muted-foreground mt-2">Showing first 100 rows of parsed data.</p>}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
