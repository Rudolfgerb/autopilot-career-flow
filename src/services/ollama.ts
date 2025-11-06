interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OllamaResponse {
  message: {
    content: string;
  };
}

class OllamaService {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl = 'http://localhost:11434', model = 'llama2') {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async chat(messages: OllamaMessage[]): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data: OllamaResponse = await response.json();
      return data.message.content;
    } catch (error) {
      console.error('Ollama API call failed:', error);
      throw error;
    }
  }

  async parseCV(cvText: string): Promise<any> {
    const prompt = `Extract structured information from this CV/Resume. Return a JSON object with:
- personalInfo (name, email, phone, location)
- skills (array of strings)
- experience (array with title, company, duration, description)
- education (array with degree, institution, year)

CV Text:
${cvText}

Return ONLY valid JSON, no additional text.`;

    const response = await this.chat([
      {
        role: 'system',
        content: 'You are a CV parsing assistant. Extract structured data from resumes and return only valid JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    try {
      return JSON.parse(response);
    } catch {
      // Fallback if JSON parsing fails
      return {
        personalInfo: { name: '', email: '', phone: '', location: '' },
        skills: [],
        experience: [],
        education: [],
      };
    }
  }

  async generateCoverLetter(cvData: any, jobDescription: string): Promise<string> {
    const prompt = `Generate a professional cover letter for this job application.

Candidate Background:
- Name: ${cvData.personalInfo.name}
- Skills: ${cvData.skills.join(', ')}
- Experience: ${cvData.experience.map((exp: any) => `${exp.title} at ${exp.company}`).join(', ')}

Job Description:
${jobDescription}

Write a compelling, personalized cover letter (max 300 words) that highlights relevant experience and skills.`;

    const response = await this.chat([
      {
        role: 'system',
        content: 'You are a professional cover letter writer. Create compelling, ATS-optimized cover letters.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    return response;
  }

  async calculateMatchScore(cvData: any, jobRequirements: string[]): Promise<number> {
    const candidateSkills = cvData.skills.map((s: string) => s.toLowerCase());
    const matches = jobRequirements.filter(req => 
      candidateSkills.some(skill => skill.includes(req.toLowerCase()) || req.toLowerCase().includes(skill))
    );
    return Math.min(100, Math.round((matches.length / jobRequirements.length) * 100));
  }
}

export const ollamaService = new OllamaService();
