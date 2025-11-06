import { useState, useEffect } from 'react';
import { JobList } from '@/components/JobList';
import { dbService } from '@/services/db';
import { CVData } from '@/types';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const JobsPage = () => {
  const [cvData, setCVData] = useState<CVData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCV();
  }, []);

  const loadCV = async () => {
    const latestCV = await dbService.getLatestCV();
    setCVData(latestCV);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Job Listings</h1>
        <p className="text-muted-foreground mt-1">
          Browse and apply to matching job opportunities
        </p>
      </div>

      {!cvData && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Upload your CV first to get personalized match scores</span>
            <Button size="sm" onClick={() => navigate('/cv-upload')}>
              Upload CV
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <JobList cvData={cvData?.parsedData} />
    </div>
  );
};

export default JobsPage;
