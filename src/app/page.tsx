
"use client";

import { useState, useEffect } from 'react';
import type { ParsedAssessmentItem, ProcessedAssessmentArea } from '@/types/assessment';
import { parseCSV, processAssessmentData } from '@/lib/parser';
import { AssessFlowHeader } from '@/components/assessflow/AssessFlowHeader';
import { FileUploadCard } from '@/components/assessflow/FileUploadCard';
import { DataDisplayCard } from '@/components/assessflow/DataDisplayCard';
import { VisualizationCard } from '@/components/assessflow/VisualizationCard';
import { ExportCard } from '@/components/assessflow/ExportCard';
import { RecommendationsCard } from '@/components/assessflow/RecommendationsCard'; // Added
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertTriangle, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AssessFlowPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedAssessmentItem[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedAssessmentArea[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      setParsedData([]);
      setProcessedData([]);
      setError(null);
      setProgress(0);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size exceeds 5MB. Please upload a smaller file.");
        toast({
          title: "File Too Large",
          description: "Maximum file size is 5MB.",
          variant: "destructive",
        });
        setFile(null); // Clear invalid file
        return;
    }
    if (!selectedFile.name.endsWith('.csv')) {
        setError("Invalid file type. Please upload a .csv file.");
        toast({
          title: "Invalid File Type",
          description: "Only .csv files are supported.",
          variant: "destructive",
        });
        setFile(null); // Clear invalid file
        return;
    }
    setFile(selectedFile);
    setParsedData([]); // Clear previous data
    setProcessedData([]);
    setError(null); // Clear previous error
    setProgress(0); // Reset progress
  };

  const handlePerformAssessment = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file first to perform an assessment.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setParsedData([]);
    setProcessedData([]);
    setProgress(10);

    // Short delay to ensure UI updates before intensive work
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          setProgress(50); // File reading complete
          await new Promise(resolve => setTimeout(resolve, 200)); // Simulate parsing time

          const text = e.target?.result as string;
          if (!text) {
            throw new Error("File content is empty or could not be read.");
          }
          const parsed = parseCSV(text);
          setProgress(75); // Parsing complete
          await new Promise(resolve => setTimeout(resolve, 200)); // Simulate processing time

          if (parsed.length === 0) {
            throw new Error("No valid data found in the CSV. Please check the file format and content.");
          }
          setParsedData(parsed);
          
          const processed = processAssessmentData(parsed);
          setProcessedData(processed);
          setProgress(100); // Processing complete
           await new Promise(resolve => setTimeout(resolve, 100)); // Short delay for UI to show 100%

          toast({
            title: "Assessment Complete",
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
          setProgress(0);
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
        setProgress(0);
        setIsLoading(false);
      };
      
      reader.readAsText(file);
      setProgress(30); // Reading initiated
      
    } catch (err: any) {
      console.error("File processing setup error:", err);
      setError(err.message || "An unexpected error occurred during file processing setup.");
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setProgress(0);
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AssessFlowHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <FileUploadCard 
            onFileSelect={handleFileSelect} 
            isLoading={isLoading}
            selectedFile={file} 
          />

          {file && !isLoading && (parsedData.length === 0 && processedData.length === 0) && !error && (
            <Card className="shadow-md">
              <CardContent className="p-6 text-center">
                <Button onClick={handlePerformAssessment} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <BarChart3 className="mr-2 h-5 w-5" /> Perform Assessment
                </Button>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <Card className="shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                  <p className="text-lg text-foreground">Performing assessment, please wait...</p>
                </div>
                <Progress value={progress} className="w-full h-3" />
                <p className="text-center text-sm text-muted-foreground">{progress}% complete</p>
              </CardContent>
            </Card>
          )}

          {error && !isLoading && (
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
              <RecommendationsCard processedData={processedData} /> {/* Added */}
              <ExportCard processedData={processedData} />
            </>
          )}
          
          {!file && !isLoading && !error && (
             <Card className="shadow-lg">
                <CardContent className="p-10 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-spreadsheet mx-auto mb-4 text-muted-foreground"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h1v4"/><path d="M12 13h1v4"/><path d="M16 13h1v4"/><path d="M3 8h18"/></svg>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Welcome to AssessFlow</h3>
                  <p className="text-muted-foreground">Upload your CSV assessment file to get started. Click "Perform Assessment" to visualize scores, identify trends, get recommendations, and export your findings.</p>
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

