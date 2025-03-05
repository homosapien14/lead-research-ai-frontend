import { WebsiteScrapeResult } from '@/types/icpAndBrandvoice';
import { apiClient } from './api-client';

class ScraperService {
    async analyzeWebsite(url: string): Promise<WebsiteScrapeResult> {
        try {
            const response = await apiClient.post<WebsiteScrapeResult>('/api/website-analysis', { url });
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to analyze website: ${error.message}`);
            }
            throw new Error('Failed to analyze website');
        }
    }
}

export const scraperService = new ScraperService(); 