export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  ENGAGED = 'engaged',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  CLOSED_WON = 'closed-won',
  CLOSED_LOST = 'closed-lost',
  ON_HOLD = 'on-hold',
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  companySize?: string;
  status: LeadStatus;
  engagementScore?: number;
  tags?: string[];
  metadata?: Record<string, any>;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilterLeadsDto {
  page?: number;
  limit?: number;
  search?: string;
  company?: string;
  industry?: string;
  companySize?: string;
  jobTitle?: string;
  status?: LeadStatus;
  ownerId?: string;
  tags?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minEngagementScore?: number;
  maxEngagementScore?: number;
  includeMetadata?: boolean;
  includeContactInfo?: boolean;
}

export interface CreateLeadDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  companySize?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  websiteUrl?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  ownerId?: string;
  status?: LeadStatus;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {
  status?: LeadStatus;
}

export enum ImportSource {
  CSV = 'csv',
  EXCEL = 'excel',
  LINKEDIN = 'linkedin',
  CRM = 'crm',
  MANUAL = 'manual',
}

export enum DuplicateHandlingStrategy {
  SKIP = 'skip',
  UPDATE = 'update',
  CREATE_NEW = 'create_new',
}

export interface ImportLeadsDto {
  fileContent: string;
  source: ImportSource;
  duplicateHandling?: DuplicateHandlingStrategy;
  fieldMapping?: Record<string, string>;
  tags?: string[];
  validateEmails?: boolean;
  enrichLeads?: boolean;
  ownerId?: string;
}

export enum ExportFormat {
  CSV = 'csv',
  EXCEL = 'excel',
  JSON = 'json',
  PDF = 'pdf',
}

export interface ExportLeadsDto {
  format: ExportFormat;
  leadIds?: string[];
  search?: string;
  fields?: string[];
  includeTags?: boolean;
  includeMetadata?: boolean;
  filename?: string;
} 