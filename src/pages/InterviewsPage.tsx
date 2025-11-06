import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Video, Phone, Building } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InterviewMock {
  id: string;
  company: string;
  position: string;
  date?: Date;
  time?: string;
  type: 'video' | 'phone' | 'onsite';
  location?: string;
  status: 'scheduled' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState<InterviewMock[]>([
    {
      id: '1',
      company: 'TechCorp GmbH',
      position: 'Senior Frontend Developer',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      time: '10:00 AM',
      type: 'video',
      status: 'scheduled',
      notes: 'Bring portfolio and be ready to discuss React projects',
    },
    {
      id: '2',
      company: 'StartupX',
      position: 'Full Stack Engineer',
      type: 'phone',
      status: 'pending',
      notes: 'Waiting for confirmation',
    },
  ]);

  const getTypeIcon = (type: InterviewMock['type']) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'onsite':
        return <Building className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: InterviewMock['status']) => {
    switch (status) {
      case 'scheduled':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
    }
  };

  const upcomingInterviews = interviews.filter((i) => i.status === 'scheduled');
  const pendingInterviews = interviews.filter((i) => i.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Interviews</h1>
        <p className="text-muted-foreground mt-1">
          Manage your interview schedule and preparation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{upcomingInterviews.length}</div>
          <div className="text-sm text-muted-foreground">Scheduled</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{pendingInterviews.length}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">
            {interviews.filter((i) => i.status === 'completed').length}
          </div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </Card>
      </div>

      {upcomingInterviews.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Upcoming Interviews</h2>
          {upcomingInterviews.map((interview) => (
            <Card key={interview.id} className="p-5">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{interview.position}</h3>
                    <p className="text-muted-foreground">{interview.company}</p>
                  </div>
                  <Badge variant={getStatusColor(interview.status)}>{interview.status}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {interview.date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{interview.date.toLocaleDateString()}</span>
                    </div>
                  )}
                  {interview.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{interview.time}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {getTypeIcon(interview.type)}
                    <span className="capitalize">{interview.type}</span>
                  </div>
                  {interview.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{interview.location}</span>
                    </div>
                  )}
                </div>

                {interview.notes && (
                  <Alert>
                    <AlertDescription>{interview.notes}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Reschedule
                  </Button>
                  <Button size="sm" variant="outline">
                    Add to Calendar
                  </Button>
                  <Button size="sm" variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {pendingInterviews.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Pending Interviews</h2>
          {pendingInterviews.map((interview) => (
            <Card key={interview.id} className="p-5">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{interview.position}</h3>
                    <p className="text-muted-foreground">{interview.company}</p>
                  </div>
                  <Badge variant={getStatusColor(interview.status)}>{interview.status}</Badge>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {getTypeIcon(interview.type)}
                  <span className="capitalize">{interview.type} Interview</span>
                </div>

                {interview.notes && (
                  <Alert>
                    <AlertDescription>{interview.notes}</AlertDescription>
                  </Alert>
                )}

                <Button size="sm" variant="outline">
                  Propose Time Slots
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {interviews.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No interviews scheduled yet. Keep applying to jobs!
          </p>
        </Card>
      )}
    </div>
  );
};

export default InterviewsPage;
