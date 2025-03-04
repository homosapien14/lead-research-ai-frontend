import { load } from 'cheerio';

interface ScrapedData {
    name: string;
    description: string;
    valueProposition: string;
}

export async function extractCompanyInfo(url: string): Promise<ScrapedData> {
    try {
        // Fetch the website content
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch website content');
        }
        const html = await response.text();

        // Load the HTML content
        const $ = load(html);

        // Extract company name (usually from title or meta tags)
        const name = $('title').text().split('|')[0].trim() ||
            $('meta[property="og:title"]').attr('content') ||
            $('meta[name="twitter:title"]').attr('content') ||
            '';

        // Extract company description
        const description = $('meta[name="description"]').attr('content') ||
            $('meta[property="og:description"]').attr('content') ||
            $('meta[name="twitter:description"]').attr('content') ||
            '';

        // Try to extract value proposition from main content
        let valueProposition = '';

        // Look for common value proposition indicators
        const potentialValueProps = [
            $('h1').first().text(),
            $('h2').first().text(),
            $('.hero, .header, .banner').find('h1, h2, p').first().text(),
            $('[class*="hero"], [class*="header"], [class*="banner"]').find('h1, h2, p').first().text(),
        ].filter(Boolean);

        if (potentialValueProps.length > 0) {
            valueProposition = potentialValueProps[0];
        }

        return {
            name: name.replace(/[^\w\s-]/g, '').trim(),
            description: description.trim(),
            valueProposition: valueProposition.trim(),
        };
    } catch (error) {
        console.error('Error extracting company info:', error);
        throw new Error('Failed to extract company information');
    }
} 