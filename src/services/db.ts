import { CVData, JobListing, Application, Interview } from '@/types';

const DB_NAME = 'JobAutopilotDB';
const DB_VERSION = 1;

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('cvs')) {
          db.createObjectStore('cvs', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('jobs')) {
          const jobStore = db.createObjectStore('jobs', { keyPath: 'id' });
          jobStore.createIndex('matchScore', 'matchScore', { unique: false });
        }
        if (!db.objectStoreNames.contains('applications')) {
          const appStore = db.createObjectStore('applications', { keyPath: 'id', autoIncrement: true });
          appStore.createIndex('jobId', 'jobId', { unique: false });
          appStore.createIndex('status', 'status', { unique: false });
        }
        if (!db.objectStoreNames.contains('interviews')) {
          db.createObjectStore('interviews', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async addCV(cv: CVData): Promise<string> {
    const transaction = this.db!.transaction(['cvs'], 'readwrite');
    const store = transaction.objectStore('cvs');
    const request = store.add(cv);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as string);
      request.onerror = () => reject(request.error);
    });
  }

  async getLatestCV(): Promise<CVData | null> {
    const transaction = this.db!.transaction(['cvs'], 'readonly');
    const store = transaction.objectStore('cvs');
    const request = store.openCursor(null, 'prev');
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const cursor = request.result;
        resolve(cursor ? cursor.value : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async addJob(job: JobListing): Promise<void> {
    const transaction = this.db!.transaction(['jobs'], 'readwrite');
    const store = transaction.objectStore('jobs');
    await store.put(job);
  }

  async getJobs(limit = 50): Promise<JobListing[]> {
    const transaction = this.db!.transaction(['jobs'], 'readonly');
    const store = transaction.objectStore('jobs');
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result.slice(0, limit));
      request.onerror = () => reject(request.error);
    });
  }

  async addApplication(application: Application): Promise<string> {
    const transaction = this.db!.transaction(['applications'], 'readwrite');
    const store = transaction.objectStore('applications');
    const request = store.add(application);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as string);
      request.onerror = () => reject(request.error);
    });
  }

  async getApplications(): Promise<Application[]> {
    const transaction = this.db!.transaction(['applications'], 'readonly');
    const store = transaction.objectStore('applications');
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateApplication(id: string, updates: Partial<Application>): Promise<void> {
    const transaction = this.db!.transaction(['applications'], 'readwrite');
    const store = transaction.objectStore('applications');
    const getRequest = store.get(id);
    
    return new Promise((resolve, reject) => {
      getRequest.onsuccess = () => {
        const app = getRequest.result;
        if (app) {
          const updated = { ...app, ...updates, lastUpdated: new Date() };
          store.put(updated);
          resolve();
        } else {
          reject(new Error('Application not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }
}

export const dbService = new IndexedDBService();
