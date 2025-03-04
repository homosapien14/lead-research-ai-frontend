import { ICPFormData, ICP, WebsiteScrapeResult, AIFieldSuggestion } from '@/types/icp';
import { apiClient } from './api-client'

// Helper function to normalize URL
function normalizeUrl(url: string): string {
    try {
        // If URL doesn't have a protocol, add https://
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        const urlObject = new URL(url);

        // Ensure www is present if it's a common domain
        if (!urlObject.hostname.startsWith('www.') && !urlObject.hostname.includes('.')) {
            urlObject.hostname = 'www.' + urlObject.hostname;
        }

        return urlObject.toString();
    } catch (error) {
        throw new Error('Invalid URL format. Please enter a valid website URL.');
    }
}

export interface ICPAIEnhancements {
    suggestedKeywords: string[];
    marketInsights: string[];
    recommendedApproach: string;
}

export interface EnhancedICP extends ICPFormData {
    aiEnhancements?: ICPAIEnhancements;
}

class ICPService {
    async scrapeWebsite(url: string): Promise<WebsiteScrapeResult> {
        try {
            const normalizedUrl = normalizeUrl(url);
            const response = await apiClient.post<WebsiteScrapeResult>('/api/scraping/website', { url: normalizedUrl });
            return response.data;
        } catch (error: any) {
            console.error('Error scraping website:', error);

            // Handle different types of errors
            if (error.response?.status === 404) {
                throw new Error('Website not found. Please check the URL and try again.');
            } else if (error.response?.status === 403) {
                throw new Error('Access to this website is forbidden. The website might be blocking our requests.');
            } else if (error.response?.status === 500) {
                throw new Error('Failed to analyze website. The website might be temporarily unavailable or blocking our requests.');
            } else if (error.message === 'Invalid URL format. Please enter a valid website URL.') {
                throw error;
            } else if (error.code === 'ECONNREFUSED') {
                throw new Error('Could not connect to the website. Please check if the URL is correct and the website is accessible.');
            } else if (error.code === 'ETIMEDOUT') {
                throw new Error('Connection timed out. The website might be slow or unavailable.');
            }

            throw new Error('Failed to analyze website. Please check the URL and try again.');
        }
    }

    async getAIFieldSuggestions(field: string, currentValue: any): Promise<AIFieldSuggestion> {
        try {
            const response = await apiClient.post<AIFieldSuggestion>('/api/icp/suggest', {
                field,
                currentValue
            });
            return response.data;
        } catch (error) {
            console.error('Error getting AI suggestions:', error);
            throw error;
        }
    }

    async enhanceICPWithAI(icpData: ICPFormData): Promise<EnhancedICP> {
        try {
            const response = await apiClient.post<EnhancedICP>('/api/icp/enhance', icpData);
            return response.data;
        } catch (error) {
            console.error('Error enhancing ICP with AI:', error);
            throw error;
        }
    }

    async createICP(data: ICPFormData): Promise<ICP> {
        try {
            const response = await apiClient.post<ICP>('/api/icp', data);
            return response.data;
        } catch (error) {
            console.error('Error creating ICP:', error);
            throw error;
        }
    }

    async updateICP(id: string, data: ICPFormData): Promise<ICP> {
        try {
            const response = await apiClient.patch<ICP>(`/api/icp/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating ICP:', error);
            throw error;
        }
    }

    async getICP(id: string): Promise<ICP> {
        try {
            const response = await apiClient.get<ICP>(`/api/icp/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching ICP:', error);
            throw error;
        }
    }

    async deleteICP(id: string): Promise<void> {
        try {
            await apiClient.delete(`/api/icp/${id}`);
        } catch (error) {
            console.error('Error deleting ICP:', error);
            throw error;
        }
    }

    async listICPs(page: number = 1, limit: number = 10): Promise<{ items: ICP[]; total: number; page: number; limit: number }> {
        try {
            const response = await apiClient.get<{ items: ICP[]; total: number; page: number; limit: number }>('/api/icp', {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error listing ICPs:', error);
            throw error;
        }
    }

    async enhanceField(field: string, content: string, characterLimit: number): Promise<{ enhancedContent: string }> {
        try {
            const response = await apiClient.post<{ enhancedContent: string }>('/api/ai/icp-assistant/enhance', {
                field,
                content,
                characterLimit
            });

            return response.data;
        } catch (error) {
            console.error('Error enhancing field:', error);
            throw error;
        }
    }

    async analyzeWebsite(url: string): Promise<{
        name?: string;
        description?: string;
        valueProposition?: string;
    }> {
        const response = await apiClient.post('/api/scraping/website', { url });
        return response.data;
    }
}

export const icpService = new ICPService(); 