import { ICPFormData, ICP, WebsiteScrapeResult, AIFieldSuggestion, BrandVoiceFormData } from '@/types/icpAndBrandvoice';
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

export interface BrandVoiceAIEnhancements {
    suggestedKeywords: string[];
    marketInsights: string[];
    recommendedApproach: string;
}

export interface EnhancedBrandVoice extends BrandVoiceFormData {
    aiEnhancements?: BrandVoiceAIEnhancements;
}

class BrandVoiceService {
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
            const response = await apiClient.post<AIFieldSuggestion>('/api/brandvoice/suggest', {
                field,
                currentValue
            });
            return response.data;
        } catch (error) {
            console.error('Error getting AI suggestions:', error);
            throw error;
        }
    }

    async enhanceBrandVoiceWithAI(brandVoiceData: BrandVoiceFormData): Promise<EnhancedBrandVoice> {
        try {
            const response = await apiClient.post<EnhancedBrandVoice>('/api/brandvoice/enhance', brandVoiceData);
            return response.data;
        } catch (error) {
            console.error('Error enhancing brand voice with AI:', error);
            throw error;
        }
    }

    async createBrandVoice(data: BrandVoiceFormData & { type?: 'targeted' | 'brand_voice' }): Promise<BrandVoiceFormData> {
        try {
            const response = await apiClient.post<BrandVoiceFormData>('/api/brandvoice', data);
            return response.data;
        } catch (error) {
            console.error('Error creating brand voice:', error);
            throw error;
        }
    }

    async updateBrandVoice(id: string, data: BrandVoiceFormData & { type?: 'targeted' | 'brand_voice' }): Promise<BrandVoiceFormData> {
        try {
            const response = await apiClient.patch<BrandVoiceFormData>(`/api/brandvoice/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating brand voice:', error);
            throw error;
        }
    }

    async getBrandVoice(id: string): Promise<BrandVoiceFormData> {
        try {
            const response = await apiClient.get<BrandVoiceFormData>(`/api/brandvoice/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching brand voice:', error);
            throw error;
        }
    }

    async deleteBrandVoice(id: string): Promise<void> {
        try {
            await apiClient.delete(`/api/brandvoice/${id}`);
        } catch (error) {
            console.error('Error deleting brand voice:', error);
            throw error;
        }
    }

    async listBrandVoices(page: number = 1, limit: number = 10): Promise<{ items: BrandVoiceFormData[]; total: number; page: number; limit: number }> {
        try {
            const response = await apiClient.get<{ items: BrandVoiceFormData[]; total: number; page: number; limit: number }>('/api/brandvoice', {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error listing brand voices:', error);
            throw error;
        }
    }

    async enhanceField(field: string, content: string, characterLimit: number): Promise<{ enhancedContent: string }> {
        try {
            const response = await apiClient.post<{ enhancedContent: string }>('/api/ai/brandvoice-assistant/enhance', {
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

    // async getBrandVoice(): Promise<ICP | null> {
    //     try {
    //         const response = await apiClient.get<{ items: ICP[] }>('/api/icp', {
    //             params: { type: 'brand_voice', limit: 1 }
    //         });
    //         return response.data.items[0] || null;
    //     } catch (error) {
    //         console.error('Error fetching brand voice:', error);
    //         throw error;
    //     }
    // }
}

export const brandVoiceService = new BrandVoiceService(); 