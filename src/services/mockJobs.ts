import { JobListing } from '@/types';
import { dbService } from './db';
import { ollamaService } from './ollama';

const mockJobs: Omit<JobListing, 'matchScore'>[] = [
  {
    id: 'job_1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp GmbH',
    location: 'Berlin, Germany',
    source: 'linkedin',
    url: 'https://linkedin.com/jobs/1',
    description: 'We are looking for an experienced Frontend Developer with React and TypeScript expertise. You will build modern web applications and work with a talented team.',
    requirements: ['React', 'TypeScript', 'CSS', 'REST API', 'Git'],
    scrapedDate: new Date(),
  },
  {
    id: 'job_2',
    title: 'Full Stack Engineer',
    company: 'StartupX',
    location: 'Munich, Germany',
    source: 'stepstone',
    url: 'https://stepstone.de/jobs/2',
    description: 'Join our startup as Full Stack Engineer. Work with Node.js, React, and PostgreSQL to build scalable applications.',
    requirements: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'AWS'],
    scrapedDate: new Date(),
  },
  {
    id: 'job_3',
    title: 'Backend Developer Python',
    company: 'DataCo',
    location: 'Hamburg, Germany',
    source: 'indeed',
    url: 'https://indeed.com/jobs/3',
    description: 'Python Backend Developer needed for data processing pipelines. Experience with FastAPI and SQLAlchemy required.',
    requirements: ['Python', 'FastAPI', 'SQL', 'Redis', 'Microservices'],
    scrapedDate: new Date(),
  },
  {
    id: 'job_4',
    title: 'DevOps Engineer',
    company: 'CloudSystems AG',
    location: 'Frankfurt, Germany',
    source: 'xing',
    url: 'https://xing.com/jobs/4',
    description: 'DevOps Engineer to manage our Kubernetes infrastructure and CI/CD pipelines. Strong automation skills needed.',
    requirements: ['Kubernetes', 'Docker', 'CI/CD', 'AWS', 'Terraform'],
    scrapedDate: new Date(),
  },
  {
    id: 'job_5',
    title: 'React Native Developer',
    company: 'MobileFirst',
    location: 'Remote, Germany',
    source: 'linkedin',
    url: 'https://linkedin.com/jobs/5',
    description: 'Build cross-platform mobile apps with React Native. Work on exciting consumer-facing products.',
    requirements: ['React Native', 'JavaScript', 'iOS', 'Android', 'Redux'],
    scrapedDate: new Date(),
  },
];

export async function seedMockJobs(cvData?: any) {
  try {
    for (const job of mockJobs) {
      let matchScore = undefined;
      
      if (cvData) {
        matchScore = await ollamaService.calculateMatchScore(cvData, job.requirements);
      }

      const jobWithScore: JobListing = {
        ...job,
        matchScore,
      };

      await dbService.addJob(jobWithScore);
    }
    
    return mockJobs.length;
  } catch (error) {
    console.error('Error seeding mock jobs:', error);
    throw error;
  }
}
