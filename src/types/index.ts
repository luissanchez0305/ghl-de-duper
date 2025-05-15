export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastActivity: string;
  tags: string[];
  address?: string;
  notes?: string;
  company?: string;
  position?: string;
}

export interface DuplicateGroup {
  id: string;
  contacts: Contact[];
  matchType: 'email' | 'phone' | 'both';
  similarity: number;
}

export interface MergeEvent {
  id: string;
  accountId: string;
  accountName: string;
  timestamp: string;
  duplicatesFound: number;
  mergedContacts: number;
  status: 'completed' | 'failed' | 'partial';
  user: string;
}

export interface MatchingSettings {
  emailThreshold: number;
  phoneThreshold: number;
  nameThreshold: number;
  useEmail: boolean;
  usePhone: boolean;
  useName: boolean;
}

export interface MergeOptions {
  keepNotes: boolean;
  keepTags: boolean;
}

export interface DuplicateGroupSelection extends DuplicateGroup {
  masterContactId: string;
  mergeOptions: MergeOptions;
}