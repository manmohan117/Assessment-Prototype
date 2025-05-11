"use client";

import type React from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileUploadCardProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export function FileUploadCard({ onFileSelect, isLoading }: FileUploadCardProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UploadCloud className="h-6 w-6 mr-2 text-primary" />
          Upload Assessment File
        </CardTitle>
        <CardDescription>Select a CSV file containing assessment data. Ensure it has 'Assessment Area', 'Question', and 'Score' columns.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="assessment-file" className="sr-only">Assessment File</Label>
          <Input 
            id="assessment-file" 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            disabled={isLoading}
            className="file:text-sm file:font-medium file:bg-accent file:text-accent-foreground hover:file:bg-accent/90 file:rounded-md file:border-0 file:px-4 file:py-2 file:mr-4"
          />
          {/* <Button 
            onClick={() => document.getElementById('assessment-file')?.click()} 
            disabled={isLoading} 
            variant="outline"
            className="w-full"
          >
            <UploadCloud className="mr-2 h-4 w-4" /> {isLoading ? 'Processing...' : 'Select CSV File'}
          </Button> */}
          <p className="text-xs text-muted-foreground mt-1">Max file size: 5MB. Only .csv files are currently supported.</p>
        </div>
      </CardContent>
    </Card>
  );
}
