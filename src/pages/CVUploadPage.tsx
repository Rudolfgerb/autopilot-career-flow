import { useState, useEffect } from 'react';
import { CVUpload } from '@/components/CVUpload';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dbService } from '@/services/db';
import { CVData } from '@/types';
import { FileText, Mail, Phone, MapPin, Briefcase, GraduationCap } from 'lucide-react';

const CVUploadPage = () => {
  const [cvData, setCVData] = useState<CVData | null>(null);

  useEffect(() => {
    loadCV();
  }, []);

  const loadCV = async () => {
    const latestCV = await dbService.getLatestCV();
    if (latestCV) {
      setCVData(latestCV);
    }
  };

  const handleUploadComplete = (cv: CVData) => {
    setCVData(cv);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">CV Upload & Management</h1>
        <p className="text-muted-foreground mt-1">
          Upload your CV to extract structured data with AI
        </p>
      </div>

      <CVUpload onUploadComplete={handleUploadComplete} />

      {cvData && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Parsed CV Data</h2>

          <Card className="p-6">
            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-7">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Name:</span>
                    <span>{cvData.parsedData.personalInfo.name || 'N/A'}</span>
                  </div>
                  {cvData.parsedData.personalInfo.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{cvData.parsedData.personalInfo.email}</span>
                    </div>
                  )}
                  {cvData.parsedData.personalInfo.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{cvData.parsedData.personalInfo.phone}</span>
                    </div>
                  )}
                  {cvData.parsedData.personalInfo.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{cvData.parsedData.personalInfo.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              {cvData.parsedData.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {cvData.parsedData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {cvData.parsedData.experience.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Experience</h3>
                  </div>
                  <div className="space-y-4 ml-7">
                    {cvData.parsedData.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <h4 className="font-medium">{exp.title}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">{exp.duration}</p>
                        <p className="text-sm mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {cvData.parsedData.education.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Education</h3>
                  </div>
                  <div className="space-y-3 ml-7">
                    {cvData.parsedData.education.map((edu, index) => (
                      <div key={index}>
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CVUploadPage;
