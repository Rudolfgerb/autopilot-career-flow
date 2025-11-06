import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { CVUpload } from '@/components/CVUpload';
import { JobList } from '@/components/JobList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dbService } from '@/services/db';
import { CVData } from '@/types';
import { toast } from 'sonner';

const Index = () => {
  const [cvData, setCVData] = useState<CVData | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await dbService.init();
      const latestCV = await dbService.getLatestCV();
      if (latestCV) {
        setCVData(latestCV);
      }
    } catch (error) {
      console.error('Initialization error:', error);
      toast.error('Failed to initialize app');
    }
  };

  const handleCVUpload = (cv: CVData) => {
    setCVData(cv);
    setActiveTab('jobs');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="cv">CV Upload</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="cv" className="space-y-6">
            <CVUpload onUploadComplete={handleCVUpload} />
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <JobList cvData={cvData?.parsedData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
