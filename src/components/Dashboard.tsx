import { useState, useEffect } from 'react';
import { FileText, Briefcase, Send, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Application } from '@/types';
import { dbService } from '@/services/db';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    cvUploaded: false,
    totalJobs: 0,
    applications: 0,
    interviews: 0,
  });

  useEffect(() => {
    loadStats();
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
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const statCards = [
    {
      title: 'CV Status',
      value: stats.cvUploaded ? 'Uploaded' : 'Not Uploaded',
      icon: FileText,
      color: stats.cvUploaded ? 'text-primary' : 'text-muted-foreground',
    },
    {
      title: 'Available Jobs',
      value: stats.totalJobs.toString(),
      icon: Briefcase,
      color: 'text-primary',
    },
    {
      title: 'Applications',
      value: stats.applications.toString(),
      icon: Send,
      color: 'text-primary',
    },
    {
      title: 'Interviews',
      value: stats.interviews.toString(),
      icon: Calendar,
      color: 'text-primary',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">JobAutopilot Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered job application automation with local Ollama
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
