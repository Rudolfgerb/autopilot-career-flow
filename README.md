# JobAutopilot

AI-powered job application automation with local Ollama LLM and IndexedDB storage.

## Features

- 🤖 **Local AI**: Uses Ollama for CV parsing and cover letter generation
- 💾 **Local Storage**: All data stored in browser IndexedDB (no cloud/login required)
- 📄 **CV Parsing**: Extract structured data from uploaded CVs
- 🎯 **Job Matching**: Calculate match scores based on skills
- ✍️ **Auto Cover Letters**: Generate personalized cover letters with AI
- 📊 **Dashboard**: Track applications and interview progress

## Prerequisites

### 1. Install Ollama

```bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Or download from https://ollama.com/download
```

### 2. Pull a Model

```bash
# Recommended: Llama 2 (7B)
ollama pull llama2

# Or use a smaller model for faster responses
ollama pull llama2:7b-chat

# For better quality (requires more RAM)
ollama pull llama3
```

### 3. Start Ollama Server

```bash
ollama serve
```

Ollama will run on `http://localhost:11434` by default.

## Setup

1. Clone and install dependencies:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open the app in your browser

## Usage

### 1. Upload CV
- Go to "CV Upload" tab
- Upload a .txt, .pdf, .doc, or .docx file
- Ollama will parse and extract structured data

### 2. Browse Jobs
- Go to "Jobs" tab
- Click "Refresh Jobs" to load mock job listings
- View jobs with AI-calculated match scores
- Click "Quick Apply" to generate cover letter

### 3. Track Applications
- View statistics on Dashboard
- Monitor application status

## Configuration

### Change Ollama Model

Edit `src/services/ollama.ts`:

```typescript
constructor(baseUrl = 'http://localhost:11434', model = 'llama3') {
  // Change 'llama3' to your preferred model
}
```

### Add Real Job Sources

Currently uses mock data. To add real job scraping:

1. Implement scrapers for LinkedIn, Indeed, StepStone, XING
2. Add to `src/services/jobScraper.ts`
3. Update JobList component to call real APIs

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **AI**: Ollama (local LLM)
- **Storage**: IndexedDB (browser-native)
- **State**: React Query + React hooks

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### "Failed to parse CV" error
- Ensure Ollama is running: `ollama serve`
- Check Ollama is on port 11434
- Try: `curl http://localhost:11434/api/tags`

### CV parsing returns empty data
- Model might be too small - try llama3
- Upload simpler text format first
- Check Ollama logs for errors

### Slow response times
- Use smaller model (llama2:7b-chat)
- Reduce CV/job description length
- Upgrade to GPU-accelerated Ollama

## Privacy

All data stays local:
- CVs stored in browser IndexedDB
- AI processing via local Ollama
- No cloud services or external APIs
- No user accounts or authentication

## Deployment

Deploy via Lovable: [Project Link](https://lovable.dev/projects/4ecc0547-63f3-4c23-8adf-4da57ebf412c)

## Future Enhancements

- [ ] Real job scraping APIs
- [ ] Calendar integration (Google/Outlook)
- [ ] Email automation
- [ ] Interview scheduling
- [ ] Multi-language support (DE/EN)
- [ ] Export applications to PDF
- [ ] ATS optimization
- [ ] Follow-up automation

## License

MIT
