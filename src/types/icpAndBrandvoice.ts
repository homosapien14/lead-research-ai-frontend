export interface BrandVoiceFormData {
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

export interface ICP {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    includeIndustries: string[];
    excludeIndustries?: string[];
    companySizes?: string[];
    companyKeywords?: string;
    seniority: string[];
    jobFunctions: string[];
    exactTitleMatch: boolean;
    includeLocations: string[];
    excludedCities?: string;
    excludedRegions?: string;
    experienceRange: string[];
    experienceKeywords?: string;
    headlineKeywords?: string;
    bioKeywords?: string;
    notes?: string;
    customerPainPoints?: string;
    valueProposition?: string;
    companyOverview?: string;
    primaryCompetitors?: string;
    productDifferentiators?: string;
    callToAction?: string;
    additionalContext?: string;
}

export interface ICPFormData extends Omit<ICP, 'id' | 'userId' | 'createdAt' | 'updatedAt'> { }

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