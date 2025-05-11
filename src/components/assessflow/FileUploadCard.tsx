
"use client";

import * as React from 'react';
import { UploadCloud, Paperclip, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileUploadCardProps {
  onFileSelect: (file: File | null) => void;
  isLoading: boolean;
  selectedFile: File | null;
}

export function FileUploadCard({ onFileSelect, isLoading, selectedFile }: FileUploadCardProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // Reset the input value to allow selecting the same file again if cleared then re-selected
    if (event.target) {
        event.target.value = '';
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFileClick = () => {
    onFileSelect(null); // Signal to parent to clear the file
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
        <div className="flex flex-col items-start gap-4">
          <Input 
            id="assessment-file-input" 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden" // Visually hide the raw input
            disabled={isLoading}
          />
          <Button
            onClick={handleChooseFileClick}
            disabled={isLoading}
            variant="outline"
            className="w-full sm:w-auto"
            aria-label={selectedFile ? "Change assessment file" : "Choose assessment file"}
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            {selectedFile ? 'Change File' : 'Choose CSV File'}
          </Button>
          
          {selectedFile && (
            <div className="flex items-center justify-between w-full p-3 border rounded-md bg-secondary/20 shadow-sm">
              <div className="flex items-center gap-2 overflow-hidden">
                <Paperclip className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-foreground truncate" title={selectedFile.name}>
                  {selectedFile.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearFileClick}
                disabled={isLoading}
                aria-label="Clear selected file"
                className="h-8 w-8 flex-shrink-0 ml-2"
              >
                <XCircle className="h-5 w-5 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">Max file size: 5MB. Only .csv files are currently supported.</p>
        </div>
      </CardContent>
    </Card>
  );
}
