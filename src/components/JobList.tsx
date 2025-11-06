import { useState, useEffect } from 'react';
import { Briefcase, MapPin, ExternalLink, TrendingUp, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JobListing } from '@/types';
import { dbService } from '@/services/db';
import { ollamaService } from '@/services/ollama';
import { seedMockJobs } from '@/services/mockJobs';
import { toast } from 'sonner';

interface JobListProps {
  cvData: any;
}

export const JobList = ({ cvData }: JobListProps) => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [applying, setApplying] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const storedJobs = await dbService.getJobs();
    setJobs(storedJobs);
  };

  const handleRefreshJobs = async () => {
    setRefreshing(true);
    try {
      toast.info('Fetching jobs...');
      const count = await seedMockJobs(cvData);
      await loadJobs();
      toast.success(`Loaded ${count} job listings!`);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setRefreshing(false);
    }
  };

  const handleApply = async (job: JobListing) => {
    if (!cvData) {
      toast.error('Please upload your CV first');
      return;
    }

    setApplying(job.id);
    try {
      toast.info('Generating cover letter with Ollama...');
      const coverLetter = await ollamaService.generateCoverLetter(cvData, job.description);

      await dbService.addApplication({
        id: `app_${Date.now()}`,
        jobId: job.id,
        status: 'pending',
        coverLetter,
        customizedCV: JSON.stringify(cvData),
        appliedDate: new Date(),
        lastUpdated: new Date(),
      });

      toast.success('Application prepared successfully!');
    } catch (error) {
      console.error('Apply error:', error);
      toast.error('Failed to generate application. Check Ollama connection.');
    } finally {
      setApplying(null);
    }
  };

  const getMatchColor = (score: number | undefined) => {
    if (!score) return 'secondary';
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'outline';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Available Jobs</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefreshJobs}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Jobs
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No jobs found. Click "Refresh Jobs" to search for opportunities.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-primary mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <Badge variant="secondary">{job.source}</Badge>
                    {job.matchScore && (
                      <Badge variant={getMatchColor(job.matchScore)}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {job.matchScore}% Match
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm line-clamp-2">{job.description}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApply(job)}
                    disabled={applying === job.id}
                  >
                    {applying === job.id ? 'Applying...' : 'Quick Apply'}
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
