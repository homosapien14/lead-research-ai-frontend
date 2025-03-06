import { apiClient } from './api-client';
import { ICP, ICPFormData } from '@/types/icpAndBrandvoice';

class ICPService {
    private baseUrl = '/api/icp';

    async createICP(data: ICPFormData): Promise<ICP> {
        const response = await apiClient.post<ICP>(this.baseUrl, data);
        return this.normalizeICP(response.data);
    }

    async listICPs(page: number = 1, limit: number = 10): Promise<{
        items: ICP[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const response = await apiClient.get<ICP[]>(`${this.baseUrl}?page=${page}&limit=${limit}`);
        const total = parseInt(response.headers?.['x-total-count'] || '0');
        return {
            items: response.data.map(this.normalizeICP),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async getICP(id: string): Promise<ICP> {
        const response = await apiClient.get<ICP>(`${this.baseUrl}/${id}`);
        return this.normalizeICP(response.data);
    }

    async updateICP(id: string, data: ICPFormData): Promise<ICP> {
        const response = await apiClient.put<ICP>(`${this.baseUrl}/${id}`, data);
        return this.normalizeICP(response.data);
    }

    async deleteICP(id: string): Promise<void> {
        if (!id) {
            throw new Error('ICP ID is required for deletion');
        }
        await apiClient.delete(`${this.baseUrl}/${id}`);
    }

    /**
     * Generate leads for an ICP
     */
    async generateLeads(id: string): Promise<{ jobId: string }> {
        try {
            const response = await apiClient.post(`/api/leads/generator/generate/${id}`);

            if (response.status !== 201) {
                throw new Error('Failed to start lead generation');
            }

            return response.data;
        } catch (error) {
            console.error('Error generating leads:', error);
            throw error;
        }
    }

    /**
     * Get lead generation status
     */
    async getLeadGenerationStatus(jobId: string): Promise<{
        status: string;
        progress: number;
        error?: string;
    }> {
        try {
            const response = await apiClient.get(`/api/leads/generator/status/${jobId}`);

            if (response.status !== 200) {
                throw new Error('Failed to get lead generation status');
            }

            return response.data;
        } catch (error) {
            console.error('Error getting lead generation status:', error);
            throw error;
        }
    }

    private normalizeICP(icp: any): ICP {
        if (!icp) return icp;
        return {
            ...icp,
            id: icp._id || icp.id, // Use _id if available, fallback to id
        };
    }
}

export const icpService = new ICPService(); 