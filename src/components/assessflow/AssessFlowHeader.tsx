import { BarChart3 } from 'lucide-react';

export function AssessFlowHeader() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-semibold">AssessFlow</h1>
          </div>
          {/* Future placeholder for navigation or user profile */}
        </div>
      </div>
    </header>
  );
}
