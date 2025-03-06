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

// Base ICP interface without MongoDB specific fields
interface ICPBase {
    name: string;
    companyOverview?: string;
    valueProposition?: string;
    company_attributes: {
        industries_to_include: string[];
        industries_to_exclude: string[];
        company_sizes: string[];
        technology_stack: string[];
        geography: {
            countries_to_include: string[];
            regions_to_include: string[];
            cities_to_exclude: string[];
            states_to_exclude: string[];
        };
        budget_revenue_range: {
            min_budget: number;
            max_budget: number;
        };
    };
    job_title_and_role: {
        seniority_levels: string[];
        job_functions: string[];
    };
    pain_points_and_needs: {
        challenges: string[];
        goals_objectives: string[];
    };
    experience_and_keywords: {
        experience_description_keywords: string[];
        headline_keywords: string[];
    };
}

// ICP interface with MongoDB fields
export interface ICP {
    _id: string;  // MongoDB's internal ID
    id: string;   // Client-side ID
    name: string;
    company_attributes: {
        industries_to_include: string[];
        industries_to_exclude: string[];
        company_sizes: string[];
        technology_stack: string[];
        description_keywords: string[];
        geography: {
            countries_to_include: string[];
            regions_to_include: string[];
            cities_to_exclude: string[];
            states_to_exclude: string[];
        };
        budget_revenue_range: {
            min_budget: number;
            max_budget: number;
        };
    };
    job_title_and_role: {
        seniority_levels: string[];
        job_functions: string[];
        exact_keyword_match: boolean;
    };
    pain_points_and_needs: {
        challenges: string[];
        goals_objectives: string[];
    };
    experience_and_keywords: {
        experience_description_keywords: string[];
        headline_keywords: string[];
        min_months_experience: number;
        bio_keywords: string[];
    };
    certifications_and_education: {
        certification_keywords: string[];
        school_names: string[];
    };
    createdAt?: string;
    updatedAt?: string;
}

// Form data without MongoDB fields
export type ICPFormData = Omit<ICP, 'id' | 'createdAt' | 'updatedAt'>;

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