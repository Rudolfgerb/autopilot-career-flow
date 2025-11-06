import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, Database, Bot, Globe } from 'lucide-react';

interface Settings {
  ollamaUrl: string;
  ollamaModel: string;
  autoApply: boolean;
  minMatchScore: number;
  jobSearchKeywords: string;
  language: string;
}

const SettingsPage = () => {
  const [settings, setSettings] = useState<Settings>({
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: 'llama2',
    autoApply: false,
    minMatchScore: 70,
    jobSearchKeywords: '',
    language: 'de',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const saved = localStorage.getItem('jobautopilot_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = () => {
    localStorage.setItem('jobautopilot_settings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
  };

  const testOllamaConnection = async () => {
    try {
      const response = await fetch(`${settings.ollamaUrl}/api/tags`);
      if (response.ok) {
        toast.success('Ollama connection successful!');
      } else {
        toast.error('Failed to connect to Ollama');
      }
    } catch (error) {
      toast.error('Ollama is not running. Start with: ollama serve');
    }
  };

  const clearAllData = async () => {
    if (confirm('Are you sure? This will delete all CVs, jobs, applications, and interviews.')) {
      indexedDB.deleteDatabase('JobAutopilotDB');
      localStorage.clear();
      toast.success('All data cleared. Refresh the page.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure JobAutopilot for your needs
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Ollama Configuration</h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ollama-url">Ollama Server URL</Label>
            <div className="flex gap-2">
              <Input
                id="ollama-url"
                value={settings.ollamaUrl}
                onChange={(e) => setSettings({ ...settings, ollamaUrl: e.target.value })}
                placeholder="http://localhost:11434"
              />
              <Button variant="outline" onClick={testOllamaConnection}>
                Test Connection
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Make sure Ollama is running with: ollama serve
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ollama-model">Ollama Model</Label>
            <Select
              value={settings.ollamaModel}
              onValueChange={(value) => setSettings({ ...settings, ollamaModel: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="llama2">Llama 2 (7B)</SelectItem>
                <SelectItem value="llama2:13b">Llama 2 (13B)</SelectItem>
                <SelectItem value="llama3">Llama 3</SelectItem>
                <SelectItem value="mistral">Mistral</SelectItem>
                <SelectItem value="codellama">Code Llama</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Download models with: ollama pull llama2
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Job Search Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto-Apply to Jobs</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically apply to jobs above minimum match score
                </p>
              </div>
              <Switch
                checked={settings.autoApply}
                onCheckedChange={(checked) => setSettings({ ...settings, autoApply: checked })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Minimum Match Score: {settings.minMatchScore}%</Label>
              </div>
              <Slider
                value={[settings.minMatchScore]}
                onValueChange={([value]) => setSettings({ ...settings, minMatchScore: value })}
                min={0}
                max={100}
                step={5}
              />
              <p className="text-sm text-muted-foreground">
                Only show jobs with match score above this threshold
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Job Search Keywords</Label>
              <Input
                id="keywords"
                value={settings.jobSearchKeywords}
                onChange={(e) => setSettings({ ...settings, jobSearchKeywords: e.target.value })}
                placeholder="e.g., React, TypeScript, Remote"
              />
              <p className="text-sm text-muted-foreground">
                Comma-separated keywords to filter jobs
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">General Settings</h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => setSettings({ ...settings, language: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-destructive">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
          <p className="text-sm text-muted-foreground">
            Irreversible actions that will delete all your data
          </p>
          <Button variant="destructive" onClick={clearAllData}>
            Clear All Data
          </Button>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
