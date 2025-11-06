import { useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { dbService } from '@/services/db';
import { ollamaService } from '@/services/ollama';
import { CVData } from '@/types';

interface CVUploadProps {
  onUploadComplete?: (cv: CVData) => void;
}

export const CVUpload = ({ onUploadComplete }: CVUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const text = await file.text();
      
      toast.info('Parsing CV with Ollama...');
      const parsedData = await ollamaService.parseCV(text);

      const cvData: CVData = {
        fileName: file.name,
        uploadDate: new Date(),
        parsedData,
      };

      await dbService.addCV(cvData);
      setUploaded(true);
      toast.success('CV uploaded and parsed successfully!');
      onUploadComplete?.(cvData);
    } catch (error) {
      console.error('CV upload error:', error);
      toast.error('Failed to parse CV. Make sure Ollama is running on localhost:11434');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Upload Your CV</h3>
        </div>
        
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
          <input
            type="file"
            id="cv-upload"
            className="hidden"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label htmlFor="cv-upload" className="cursor-pointer">
            {uploaded ? (
              <div className="flex flex-col items-center gap-2 text-primary">
                <CheckCircle className="h-12 w-12" />
                <p className="font-medium">CV Uploaded Successfully!</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-12 w-12 text-muted-foreground" />
                <p className="font-medium">
                  {uploading ? 'Processing...' : 'Click to upload your CV'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports TXT, PDF, DOC, DOCX
                </p>
              </div>
            )}
          </label>
        </div>

        {uploading && (
          <div className="text-sm text-muted-foreground text-center">
            Parsing CV with local Ollama model...
          </div>
        )}
      </div>
    </Card>
  );
};
