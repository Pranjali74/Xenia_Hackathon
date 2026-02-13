
import { User, ContentItem, AccessLog, UserRole } from '../types';

const STORAGE_KEYS = {
  USERS: 'secureshield_users',
  CONTENT: 'secureshield_content',
  LOGS: 'secureshield_logs'
};

// Initial Data Seed
const DEFAULT_USERS: User[] = [
  { id: '1', email: 'admin@enterprise.com', role: UserRole.ADMIN, password: 'password123' },
  { id: '2', email: 'uploader@enterprise.com', role: UserRole.UPLOADER, password: 'password123' },
  { id: '3', email: 'viewer@enterprise.com', role: UserRole.VIEWER, password: 'password123' }
];

const DEFAULT_CONTENT: ContentItem[] = [
  {
    id: 'c1',
    title: 'Executive Strategic Review Q4',
    type: 'video',
    description: 'Internal video briefing on Q4 performance and 2024 projections.',
    storageKey: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    allowedRoles: [UserRole.ADMIN, UserRole.UPLOADER, UserRole.VIEWER],
    uploadedBy: '2',
    createdAt: Date.now() - 86400000
  },
  {
    id: 'c2',
    title: 'Confidential Product Roadmap',
    type: 'pdf',
    description: 'Highly confidential document outlining product launches for the next 18 months.',
    storageKey: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    allowedRoles: [UserRole.ADMIN, UserRole.UPLOADER],
    uploadedBy: '2',
    createdAt: Date.now() - 172800000
  }
];

export const getDB = <T,>(key: string, initial: T[]): T[] => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const saveDB = <T,>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const DB = {
  getUsers: () => getDB<User>(STORAGE_KEYS.USERS, DEFAULT_USERS),
  getContent: () => getDB<ContentItem>(STORAGE_KEYS.CONTENT, DEFAULT_CONTENT),
  getLogs: () => getDB<AccessLog>(STORAGE_KEYS.LOGS, []),
  
  saveUsers: (users: User[]) => saveDB(STORAGE_KEYS.USERS, users),
  saveContent: (content: ContentItem[]) => saveDB(STORAGE_KEYS.CONTENT, content),
  saveLogs: (logs: AccessLog[]) => saveDB(STORAGE_KEYS.LOGS, logs),
};
