import { useState, useEffect } from 'react';
import { Application } from '@/types';
import { dbService } from '@/services/db';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Calendar, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    const apps = await dbService.getApplications();
    setApplications(apps);
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'sent':
        return 'default';
      case 'interviewing':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'accepted':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const filterByStatus = (status: Application['status'] | 'all') => {
    if (status === 'all') return applications;
    return applications.filter((app) => app.status === status);
  };

  const ApplicationCard = ({ app }: { app: Application }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">Job ID: {app.jobId}</h3>
            <p className="text-sm text-muted-foreground">
              Applied: {new Date(app.appliedDate).toLocaleDateString()}
            </p>
          </div>
          <Badge variant={getStatusColor(app.status)}>{app.status}</Badge>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" onClick={() => setSelectedApp(app)}>
                <FileText className="h-4 w-4 mr-1" />
                View Cover Letter
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cover Letter</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  value={app.coverLetter}
                  readOnly
                  className="min-h-[400px] font-mono text-sm"
                />
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date(app.lastUpdated).toLocaleString()}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {app.status === 'interviewing' && (
            <Button size="sm" variant="outline">
              <Calendar className="h-4 w-4 mr-1" />
              Schedule Interview
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Applications</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage your job applications
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{applications.length}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">
            {applications.filter((a) => a.status === 'pending').length}
          </div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">
            {applications.filter((a) => a.status === 'sent').length}
          </div>
          <div className="text-sm text-muted-foreground">Sent</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">
            {applications.filter((a) => a.status === 'interviewing').length}
          </div>
          <div className="text-sm text-muted-foreground">Interviewing</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">
            {applications.filter((a) => a.status === 'accepted').length}
          </div>
          <div className="text-sm text-muted-foreground">Accepted</div>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="interviewing">Interviewing</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {applications.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No applications yet. Start applying to jobs!</p>
            </Card>
          ) : (
            applications.map((app) => <ApplicationCard key={app.id} app={app} />)
          )}
        </TabsContent>

        {['pending', 'sent', 'interviewing', 'accepted', 'rejected'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-3">
            {filterByStatus(status as Application['status']).map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ApplicationsPage;
