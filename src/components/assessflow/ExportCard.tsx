"use client";

import type { ProcessedAssessmentArea } from '@/types/assessment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DownloadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportCardProps {
  processedData: ProcessedAssessmentArea[];
  // chartRefs: React.RefObject<HTMLElement>[]; // For chart export, pass refs to chart containers
}

export function ExportCard({ processedData }: ExportCardProps) {
  const { toast } = useToast();

  const handleExportSummaryCSV = () => {
    if (processedData.length === 0) {
      toast({ title: "No Data", description: "No processed data to export.", variant: "destructive" });
      return;
    }
    const headers = "Assessment Area,Total Score,Average Score,Question Count\n";
    const csvContent = processedData.map(area => 
      `"${area.area}",${area.totalScore},${area.averageScore.toFixed(2)},${area.questionCount}`
    ).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "assessment_summary_report.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Export Successful", description: "Summary report downloaded as CSV." });
    } else {
       toast({ title: "Export Failed", description: "Your browser does not support this feature.", variant: "destructive" });
    }
  };

  const handleExportChart = (chartName: string) => {
    // Placeholder for chart export functionality
    // This would typically involve a library like html-to-image or dom-to-image
    // Example:
    // const chartElement = chartRefs.find(ref => ref.current?.dataset.chartName === chartName)?.current;
    // if (chartElement) {
    //   toPng(chartElement).then((dataUrl) => { /* download logic */ });
    // }
    toast({ title: "Chart Export", description: `${chartName} export is a placeholder. A library like 'html-to-image' would be needed.`, variant: "default"});
    console.log(`Exporting ${chartName} as PNG/JPG... (placeholder)`);
  };
  
  if (processedData.length === 0) {
    return null; // Don't render if there's no data to export
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <DownloadCloud className="h-6 w-6 mr-2 text-primary" />
          Export Results
        </CardTitle>
        <CardDescription>Download summary reports and visual charts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-md font-medium mb-2">Summary Report</h3>
          <Button onClick={handleExportSummaryCSV} variant="outline" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
            <DownloadCloud className="mr-2 h-4 w-4" /> Download Summary (CSV)
          </Button>
        </div>
        <div>
          <h3 className="text-md font-medium mb-2">Charts</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => handleExportChart('Bar Chart')} variant="outline" className="w-full sm:w-auto">
              <DownloadCloud className="mr-2 h-4 w-4" /> Export Bar Chart (PNG/JPG)
            </Button>
            <Button onClick={() => handleExportChart('Pie Chart')} variant="outline" className="w-full sm:w-auto">
              <DownloadCloud className="mr-2 h-4 w-4" /> Export Pie Chart (PNG/JPG)
            </Button>
          </div>
           <p className="text-xs text-muted-foreground mt-2">Chart export requires additional libraries for image conversion.</p>
        </div>
      </CardContent>
    </Card>
  );
}
