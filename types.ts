
export enum UserRole {
  ADMIN = 'ADMIN',
  UPLOADER = 'UPLOADER',
  VIEWER = 'VIEWER'
}

export type ContentType = 'video' | 'pdf';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  password?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  description: string;
  storageKey: string; // Base64 data or URL
  allowedRoles: UserRole[];
  uploadedBy: string;
  createdAt: number;
}

export interface AccessLog {
  id: string;
  userId: string;
  userEmail: string;
  contentId: string;
  contentTitle: string;
  timestamp: number;
  action: 'VIEW' | 'DOWNLOAD_ATTEMPT' | 'ACCESS_DENIED';
}

export interface AuthState {
  user: User | null;
  token: string | null;
}
