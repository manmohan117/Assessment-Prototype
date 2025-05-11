"use client";

import { useState, useEffect } from 'react';
import type { ParsedAssessmentItem, ProcessedAssessmentArea } from '@/types/assessment';
import { parseCSV, processAssessmentData } from '@/lib/parser';
import { AssessFlowHeader } from '@/components/assessflow/AssessFlowHeader';
import { FileUploadCard } from '@/components/assessflow/FileUploadCard';
import { DataDisplayCard } from '@/components/assessflow/DataDisplayCard';
import { VisualizationCard } from '@/components/assessflow/VisualizationCard';
import { ExportCard } from '@/components/assessflow/ExportCard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AssessFlowPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedAssessmentItem[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedAssessmentArea[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!file) return;

    const processFile = async () => {
      setIsLoading(true);
      setError(null);
      setParsedData([]);
      setProcessedData([]);

      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const text = e.target?.result as string;
            if (!text) {
              throw new Error("File content is empty or could not be read.");
            }
            const parsed = parseCSV(text);
            if (parsed.length === 0) {
              throw new Error("No valid data found in the CSV. Please check the file format and content.");
            }
            setParsedData(parsed);
            
            const processed = processAssessmentData(parsed);
            setProcessedData(processed);
            toast({
              title: "File Processed Successfully",
              description: `${parsed.length} records parsed and ${processed.length} assessment areas analyzed.`,
            });
          } catch (parseError: any) {
            console.error("Parsing/Processing error:", parseError);
            setError(parseError.message || "Failed to parse or process the file.");
            toast({
              title: "Processing Error",
              description: parseError.message || "An unexpected error occurred.",
              variant: "destructive",
            });
          } finally {
            setIsLoading(false);
          }
        };
        reader.onerror = () => {
          console.error("File reading error");
          setError("Failed to read the file.");
          toast({
              title: "File Read Error",
              description: "Could not read the uploaded file.",
              variant: "destructive",
            });
          setIsLoading(false);
        };
        reader.readAsText(file);
      } catch (err: any) {
        console.error("File processing setup error:", err);
        setError(err.message || "An unexpected error occurred during file processing setup.");
        toast({
          title: "Error",
          description: err.message || "An unexpected error occurred.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    processFile();
  }, [file, toast]);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size exceeds 5MB. Please upload a smaller file.");
        toast({
          title: "File Too Large",
          description: "Maximum file size is 5MB.",
          variant: "destructive",
        });
        return;
    }
    if (!selectedFile.name.endsWith('.csv')) {
        setError("Invalid file type. Please upload a .csv file.");
        toast({
          title: "Invalid File Type",
          description: "Only .csv files are supported.",
          variant: "destructive",
        });
        return;
    }
    setFile(selectedFile);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AssessFlowHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <FileUploadCard onFileSelect={handleFileSelect} isLoading={isLoading} />

          {isLoading && (
            <div className="flex items-center justify-center p-6 bg-card rounded-lg shadow-lg">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
              <p className="text-lg text-foreground">Processing your file, please wait...</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="shadow-lg">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {(parsedData.length > 0 || processedData.length > 0) && !isLoading && !error && (
            <>
              <DataDisplayCard parsedData={parsedData} processedData={processedData} />
              <VisualizationCard processedData={processedData} />
              <ExportCard processedData={processedData} />
            </>
          )}
          
          {!file && !isLoading && !error && (
             <Card className="shadow-lg">
                <CardContent className="p-10 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-spreadsheet mx-auto mb-4 text-muted-foreground"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h1v4"/><path d="M12 13h1v4"/><path d="M16 13h1v4"/><path d="M3 8h18"/></svg>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Welcome to AssessFlow</h3>
                  <p className="text-muted-foreground">Upload your CSV assessment file to get started. Visualize scores, identify trends, and export your findings with ease.</p>
                </CardContent>
              </Card>
          )}

        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} AssessFlow. All rights reserved.
      </footer>
    </div>
  );
}
