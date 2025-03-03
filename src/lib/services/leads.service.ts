import axios from 'axios';
import { apiClient } from './api-client';
import { LeadStatus } from '@/types/lead';

// Types
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
    tags: string[];
    metadata?: Record<string, any>;
    linkedinUrl?: string;
    websiteUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface LeadFilters {
    search?: string;
    status?: LeadStatus;
    tags?: string[];
    industry?: string[];
    companySize?: string[];
    engagementScoreMin?: number;
    engagementScoreMax?: number;
    createdAfter?: Date;
    createdBefore?: Date;
    [key: string]: any;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface LeadExportOptions {
    format: 'csv' | 'xlsx';
    filters?: LeadFilters;
    fields?: string[];
    includeTags?: boolean;
    includeMetadata?: boolean;
}

export interface LeadImportOptions {
    file: File;
    skipDuplicates?: boolean;
    validateEmails?: boolean;
    enrichLeads?: boolean;
    tags?: string[];
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}

class LeadsService {
    private readonly baseUrl = '/api/leads';

    // Get leads with pagination and filters
    async getLeads(
        params: PaginationParams = {},
        filters: LeadFilters = {}
    ): Promise<PaginatedResponse<Lead>> {
        const response = await apiClient.get(this.baseUrl, {
            params: {
                ...params,
                ...filters,
            },
        });
        return response.data;
    }

    // Get a single lead by ID
    async getLead(id: string): Promise<Lead> {
        const response = await apiClient.get(`${this.baseUrl}/${id}`);
        return response.data;
    }

    // Create a new lead
    async createLead(lead: Partial<Lead>): Promise<Lead> {
        try {
            const response = await apiClient.post(this.baseUrl, lead);
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.code === 11000 && error.response?.data?.keyPattern?.email) {
                throw new Error('A lead with this email address already exists.');
            }
            throw error;
        }
    }

    // Update a lead
    async updateLead(id: string, lead: Partial<Lead>): Promise<Lead> {
        try {
            const response = await apiClient.patch(`${this.baseUrl}/${id}`, lead);
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.code === 11000 && error.response?.data?.keyPattern?.email) {
                throw new Error('A lead with this email address already exists.');
            }
            throw error;
        }
    }

    // Delete a lead
    async deleteLead(id: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/${id}`);
    }

    // Bulk delete leads
    async deleteLeads(ids: string[]): Promise<void> {
        await apiClient.post(`${this.baseUrl}/bulk-delete`, { ids });
    }

    // Update lead status
    async updateLeadStatus(id: string, status: string): Promise<Lead> {
        const response = await apiClient.patch(`${this.baseUrl}/${id}/status`, { status });
        return response.data;
    }

    // Add tags to leads
    async addTags(ids: string[], tags: string[]): Promise<void> {
        await apiClient.post(`${this.baseUrl}/tags`, { ids, tags });
    }

    // Remove tags from leads
    async removeTags(ids: string[], tags: string[]): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/tags`, { data: { ids, tags } });
    }

    // Export leads
    async exportLeads(options: LeadExportOptions): Promise<Blob> {
        const response = await apiClient.post(`${this.baseUrl}/export`, options, {
            responseType: 'blob',
            headers: {
                'Accept': options.format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        });
        return response.data;
    }

    // Import leads
    async importLeads(options: LeadImportOptions): Promise<{
        success: boolean;
        totalProcessed: number;
        successCount: number;
        failureCount: number;
        errors?: string[];
    }> {
        const formData = new FormData();
        formData.append('file', options.file);

        if (options.skipDuplicates !== undefined) {
            formData.append('skipDuplicates', String(options.skipDuplicates));
        }
        if (options.validateEmails !== undefined) {
            formData.append('validateEmails', String(options.validateEmails));
        }
        if (options.enrichLeads !== undefined) {
            formData.append('enrichLeads', String(options.enrichLeads));
        }
        if (options.tags?.length) {
            formData.append('tags', JSON.stringify(options.tags));
        }

        const response = await apiClient.post(`${this.baseUrl}/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    // Get import progress
    async getImportProgress(importId: string): Promise<{
        status: 'pending' | 'processing' | 'completed' | 'failed';
        progress: number;
        totalProcessed: number;
        successCount: number;
        failureCount: number;
        errors?: string[];
    }> {
        const response = await apiClient.get(`${this.baseUrl}/import/${importId}/progress`);
        return response.data;
    }

    // Enrich lead data
    async enrichLead(id: string): Promise<Lead> {
        const response = await apiClient.post(`${this.baseUrl}/${id}/enrich`);
        return response.data;
    }

    // Bulk enrich leads
    async enrichLeads(ids: string[]): Promise<{
        success: boolean;
        totalProcessed: number;
        enriched: number;
        failed: number;
    }> {
        const response = await apiClient.post(`${this.baseUrl}/bulk-enrich`, { ids });
        return response.data;
    }

    // Validate email
    async validateEmail(id: string): Promise<{
        isValid: boolean;
        details?: {
            syntax: boolean;
            mx: boolean;
            disposable: boolean;
            free: boolean;
        }
    }> {
        const response = await apiClient.post(`${this.baseUrl}/${id}/validate-email`);
        return response.data;
    }

    // Get lead statistics
    async getStatistics(filters?: LeadFilters): Promise<{
        total: number;
        byStatus: Record<string, number>;
        byIndustry: Record<string, number>;
        byCompanySize: Record<string, number>;
        averageEngagementScore: number;
    }> {
        const response = await apiClient.get(`${this.baseUrl}/statistics`, {
            params: filters
        });
        return response.data;
    }
}

export const leadsService = new LeadsService(); 