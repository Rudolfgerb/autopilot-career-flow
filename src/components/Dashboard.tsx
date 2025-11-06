import { useState, useEffect } from 'react';
import { FileText, Briefcase, Send, Calendar, TrendingUp, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { StatsCard } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Application } from '@/types';
import { dbService } from '@/services/db';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    cvUploaded: false,
    totalJobs: 0,
    applications: 0,
    interviews: 0,
    pending: 0,
    sent: 0,
  });

  const [recentActivity, setRecentActivity] = useState<Application[]>([]);

  useEffect(() => {
    loadStats();
    loadRecentActivity();
  }, []);

  const loadStats = async () => {
    try {
      const cv = await dbService.getLatestCV();
      const jobs = await dbService.getJobs();
      const applications = await dbService.getApplications();

      setStats({
        cvUploaded: !!cv,
        totalJobs: jobs.length,
        applications: applications.length,
        interviews: applications.filter((a: Application) => a.status === 'interviewing').length,
        pending: applications.filter((a: Application) => a.status === 'pending').length,
        sent: applications.filter((a: Application) => a.status === 'sent').length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const applications = await dbService.getApplications();
      const sorted = applications
        .sort((a: Application, b: Application) => 
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        )
        .slice(0, 5);
      setRecentActivity(sorted);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to JobAutopilot - Your AI-powered job search assistant
          </p>
        </div>
        {!stats.cvUploaded && (
          <Button onClick={() => navigate('/cv-upload')}>
            <FileText className="h-4 w-4 mr-2" />
            Upload CV
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="CV Status"
          value={stats.cvUploaded ? 'Ready' : 'Missing'}
          icon={FileText}
          trend={stats.cvUploaded ? { value: 100, isPositive: true } : undefined}
        />
        <StatsCard
          title="Available Jobs"
          value={stats.totalJobs}
          icon={Briefcase}
        />
        <StatsCard
          title="Applications"
          value={stats.applications}
          icon={Send}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Interviews"
          value={stats.interviews}
          icon={Calendar}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/cv-upload')}
            >
              <FileText className="h-4 w-4 mr-2" />
              {stats.cvUploaded ? 'Update CV' : 'Upload CV'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/jobs')}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Browse Jobs
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/applications')}
            >
              <Send className="h-4 w-4 mr-2" />
              View Applications
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/settings')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Start applying to jobs to see activity here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((app) => (
                <div key={app.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">Application to {app.jobId}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(app.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    app.status === 'sent' ? 'bg-primary/10 text-primary' :
                    app.status === 'interviewing' ? 'bg-accent/10 text-accent-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {!stats.cvUploaded && (
        <Card className="p-6 bg-accent/5 border-accent">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-accent/20 p-3">
              <FileText className="h-6 w-6 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Get Started with JobAutopilot</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Upload your CV to unlock AI-powered job matching, automatic cover letter generation, and smart application tracking.
              </p>
              <Button onClick={() => navigate('/cv-upload')}>
                Upload Your CV Now
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
