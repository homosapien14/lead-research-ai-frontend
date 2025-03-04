export interface ICPFormData {
    name: string;
    website?: string;
    customerPainPoints: string;
    valueProposition: string;
    callToAction: string;
    companyOverview: string;
    additionalContext?: string;
    primaryCompetitors?: string;
    productDifferentiators?: string;
}

export interface ICP extends ICPFormData {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface WebsiteScrapeResult {
    name?: string;
    companyOverview?: string;
    valueProposition?: string;
    customerPainPoints?: string;
    callToAction?: string;
    primaryCompetitors?: string;
    productDifferentiators?: string;
    additionalContext?: string;
    companyName?: string;

}

export interface ICPFilters {
    search?: string;
    isActive?: boolean;
}

export interface AIFieldSuggestion {
    suggestions: string[];
} 