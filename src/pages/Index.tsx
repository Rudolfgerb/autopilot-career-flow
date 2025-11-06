import { useEffect } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { dbService } from '@/services/db';
import { toast } from 'sonner';

const Index = () => {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await dbService.init();
    } catch (error) {
      console.error('Initialization error:', error);
      toast.error('Failed to initialize app');
    }
  };

  return <Dashboard />;
};

export default Index;
