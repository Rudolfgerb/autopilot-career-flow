export interface CVData {
  id?: string;
  fileName: string;
  uploadDate: Date;
  parsedData: {
    personalInfo: {
      name: string;
      email: string;
      phone?: string;
      location?: string;
    };
    skills: string[];
    experience: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
    education: Array<{
      degree: string;
      institution: string;
      year: string;
    }>;
  };
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  source: 'linkedin' | 'indeed' | 'stepstone' | 'xing';
  url: string;
  description: string;
  requirements: string[];
  matchScore?: number;
  scrapedDate: Date;
}

export interface Application {
  id: string;
  jobId: string;
  status: 'pending' | 'sent' | 'interviewing' | 'rejected' | 'accepted';
  coverLetter: string;
  customizedCV: string;
  appliedDate: Date;
  lastUpdated: Date;
}

export interface Interview {
  id: string;
  applicationId: string;
  scheduledDate?: Date;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}
