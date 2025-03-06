'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ICP, ICPFormData } from '@/types/icpAndBrandvoice';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, HelpCircle } from 'lucide-react';
import { SimpleMultiSelect, Option } from '@/components/ui/simple-multi-select';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    INDUSTRY_OPTIONS,
    COMPANY_SIZE_OPTIONS,
    SENIORITY_OPTIONS,
    JOB_FUNCTION_OPTIONS,
    LOCATION_OPTIONS,
    CERTIFICATION_OPTIONS,
    TECHNOLOGY_STACK_OPTIONS,
    COMMUNICATION_CHANNEL_OPTIONS,
} from '@/utils/formConstants';

const EXPERIENCE_RANGE_OPTIONS: Option[] = [
    { label: '0-2 years', value: '0_2' },
    { label: '3-5 years', value: '3_5' },
    { label: '6-10 years', value: '6_10' },
    { label: '10+ years', value: '10_plus' },
];

const formSchema = z.object({
    name: z.string().min(1, 'ICP name is required').max(100, 'Name cannot exceed 100 characters'),
    company_attributes: z.object({
        industries_to_include: z.array(z.string()).min(1, 'Select at least one industry'),
        industries_to_exclude: z.array(z.string()).optional(),
        company_sizes: z.array(z.string()).min(1, 'Select at least one company size'),
        technology_stack: z.array(z.string()).optional(),
        description_keywords: z.array(z.string()).optional(),
        geography: z.object({
            countries_to_include: z.array(z.string()).min(1, 'Select at least one location'),
            regions_to_include: z.array(z.string()).optional(),
            cities_to_exclude: z.array(z.string()).optional(),
            states_to_exclude: z.array(z.string()).optional()
        }),
        budget_revenue_range: z.object({
            min_budget: z.number().optional(),
            max_budget: z.number().optional()
        }).optional()
    }),
    job_title_and_role: z.object({
        seniority_levels: z.array(z.string()).min(1, 'Select at least one seniority level'),
        job_functions: z.array(z.string()).min(1, 'Select at least one job function'),
        exact_keyword_match: z.boolean().default(false)
    }),
    pain_points_and_needs: z.object({
        challenges: z.array(z.string()).min(1, 'Add at least one challenge'),
        goals_objectives: z.array(z.string()).min(1, 'Add at least one goal/objective')
    }),
    experience_and_keywords: z.object({
        experience_description_keywords: z.array(z.string()).min(1, 'Add at least one experience keyword'),
        headline_keywords: z.array(z.string()).min(1, 'Add at least one headline keyword'),
        min_months_experience: z.number().optional(),
        bio_keywords: z.array(z.string()).optional()
    }),
    certifications_and_education: z.object({
        certification_keywords: z.array(z.string()).optional(),
        school_names: z.array(z.string()).optional()
    }).optional()
});

type FormData = z.infer<typeof formSchema>;

interface ICPFormProps {
    initialData?: ICP | null;
    onSubmit: (data: ICPFormData) => void;
    onCancel?: () => void;
}

// Helper function to convert comma-separated string to array
const convertToArray = (value: string): string[] => {
    if (!value) return [];
    return value.split(',').map(item => item.trim()).filter(Boolean);
};

interface LabelWithTooltipProps {
    label: string;
    tooltip: string;
    required?: boolean;
}

const LabelWithTooltip = ({ label, tooltip, required = false }: LabelWithTooltipProps) => (
    <div className="flex items-center gap-2">
        <span>{label} {required && <span className="text-red-500">*</span>}</span>
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button type="button" className="cursor-help">
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/70 hover:text-muted-foreground" />
                    </button>
                </TooltipTrigger>
                <TooltipContent 
                    side="right" 
                    className="max-w-[300px] text-sm bg-secondary border border-border shadow-md"
                >
                    <p className="text-secondary-foreground">{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
);

export function ICPForm({ initialData, onSubmit, onCancel }: ICPFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name ?? '',
            company_attributes: {
                industries_to_include: initialData?.company_attributes?.industries_to_include ?? [],
                industries_to_exclude: initialData?.company_attributes?.industries_to_exclude ?? [],
                company_sizes: initialData?.company_attributes?.company_sizes ?? [],
                technology_stack: initialData?.company_attributes?.technology_stack ?? [],
                description_keywords: initialData?.company_attributes?.description_keywords ?? [],
                geography: {
                    countries_to_include: initialData?.company_attributes?.geography?.countries_to_include ?? [],
                    regions_to_include: initialData?.company_attributes?.geography?.regions_to_include ?? [],
                    cities_to_exclude: initialData?.company_attributes?.geography?.cities_to_exclude ?? [],
                    states_to_exclude: initialData?.company_attributes?.geography?.states_to_exclude ?? []
                },
                budget_revenue_range: {
                    min_budget: initialData?.company_attributes?.budget_revenue_range?.min_budget ?? 0,
                    max_budget: initialData?.company_attributes?.budget_revenue_range?.max_budget ?? 0
                }
            },
            job_title_and_role: {
                seniority_levels: initialData?.job_title_and_role?.seniority_levels ?? [],
                job_functions: initialData?.job_title_and_role?.job_functions ?? [],
                exact_keyword_match: initialData?.job_title_and_role?.exact_keyword_match ?? false
            },
            pain_points_and_needs: {
                challenges: initialData?.pain_points_and_needs?.challenges ?? [],
                goals_objectives: initialData?.pain_points_and_needs?.goals_objectives ?? []
            },
            experience_and_keywords: {
                experience_description_keywords: initialData?.experience_and_keywords?.experience_description_keywords ?? [],
                headline_keywords: initialData?.experience_and_keywords?.headline_keywords ?? [],
                min_months_experience: initialData?.experience_and_keywords?.min_months_experience ?? 0,
                bio_keywords: initialData?.experience_and_keywords?.bio_keywords ?? []
            },
            certifications_and_education: {
                certification_keywords: initialData?.certifications_and_education?.certification_keywords ?? [],
                school_names: initialData?.certifications_and_education?.school_names ?? []
            }
        }
    });

    const isDirty = form.formState.isDirty;
    
    const handleSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);
            await onSubmit(data as ICPFormData);
            toast.success('Target ICP saved successfully!');
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error('Failed to save target ICP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="shadow-lg border-0 h-full flex flex-col ">
            <CardHeader className="shrink-0 sticky top-0 bg-background z-10 border-b px-6 py-4">
                    <CardTitle>{initialData ? 'Edit Target ICP' : 'Create Target ICP'}</CardTitle>
                    <CardDescription>
                        Define your ideal customer profile by specifying detailed targeting criteria.
                    </CardDescription>
                </CardHeader>
            <CardContent className="flex-1 overflow-y-auto px-6">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <LabelWithTooltip 
                                        label="ICP Name"
                                        tooltip="Create a clear, memorable name for your target audience segment"
                                        required
                                    />
                                        <FormControl>
                                            <Input placeholder="Enterprise Marketing Leaders" {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            A clear, memorable name for your target audience segment
                                        </FormDescription>
                                        <FormMessage className="text-sm font-medium text-destructive mt-1" />
                                    </FormItem>
                                )}
                            />

                            <Separator className="my-6" />
                            <h3 className="text-lg font-semibold mb-4">Company Attributes</h3>
                        <p className="text-sm text-muted-foreground mb-6">Define the characteristics of the organizations where your ideal customers work.</p>

                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                name="company_attributes.industries_to_include"
                                    render={({ field }) => (
                                        <FormItem>
                                        <LabelWithTooltip 
                                            label="Industries to Include"
                                            tooltip="Select the primary industries where your ideal customers operate. This helps focus on companies in relevant business sectors."
                                            required
                                        />
                                            <FormControl>
                                            <SimpleMultiSelect
                                                    options={INDUSTRY_OPTIONS}
                                                value={field.value || []}
                                                    onChange={field.onChange}
                                                placeholder="e.g., SaaS, Marketing Technology, AI & ML..."
                                                />
                                            </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Select multiple industries to broaden your target market
                                            </FormDescription>
                                            <FormMessage className="text-sm font-medium text-destructive mt-1" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                name="company_attributes.technology_stack"
                                    render={({ field }) => (
                                        <FormItem>
                                        <LabelWithTooltip 
                                            label="Technology Stack"
                                            tooltip="Specify technologies that your ideal customer's company uses or is interested in. This helps identify organizations with relevant technical capabilities or needs."
                                        />
                                            <FormControl>
                                            <SimpleMultiSelect
                                                options={TECHNOLOGY_STACK_OPTIONS}
                                                value={field.value || []}
                                                    onChange={field.onChange}
                                                placeholder="e.g., React, AWS, Python..."
                                                />
                                            </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Select relevant technical capabilities and tools
                                            </FormDescription>
                                            <FormMessage className="text-sm font-medium text-destructive mt-1" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                            name="company_attributes.company_sizes"
                            render={({ field }) => (
                                <FormItem>
                                    <LabelWithTooltip 
                                        label="Company Sizes"
                                        tooltip="Select the employee size ranges of your target companies. This helps focus on organizations of the right scale for your offering."
                                        required
                                    />
                                    <FormControl>
                                        <SimpleMultiSelect
                                            options={COMPANY_SIZE_OPTIONS}
                                            value={field.value || []}
                                            onChange={field.onChange}
                                            placeholder="e.g., 11-50 employees, 51-200 employees..."
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs text-muted-foreground">
                                        Select multiple ranges to cover your target segment
                                    </FormDescription>
                                    <FormMessage className="text-sm font-medium text-destructive mt-1" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="company_attributes.geography.countries_to_include"
                            render={({ field }) => (
                                <FormItem>
                                    <LabelWithTooltip 
                                        label="Countries to Include"
                                        tooltip="Select the geographic regions where your ideal customers are located. This helps target companies in specific markets or territories."
                                        required
                                    />
                                    <FormControl>
                                        <SimpleMultiSelect
                                            options={LOCATION_OPTIONS}
                                            value={field.value || []}
                                            onChange={field.onChange}
                                            placeholder="e.g., United States, Canada..."
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs text-muted-foreground">
                                        Select target geographic regions
                                    </FormDescription>
                                    <FormMessage className="text-sm font-medium text-destructive mt-1" />
                                </FormItem>
                            )}
                        />

                        <Separator className="my-6" />
                        <h3 className="text-lg font-semibold mb-4">Job Title and Role</h3>
                        <p className="text-sm text-muted-foreground mb-6">Specify the professional characteristics and position details of your ideal customer.</p>

                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="job_title_and_role.seniority_levels"
                                render={({ field }) => (
                                    <FormItem>
                                        <LabelWithTooltip 
                                            label="Seniority Levels"
                                            tooltip="Choose the organizational levels you want to target. This determines the decision-making authority and responsibilities of your prospects."
                                            required
                                        />
                                        <FormControl>
                                            <SimpleMultiSelect
                                                options={SENIORITY_OPTIONS}
                                                value={field.value || []}
                                                onChange={field.onChange}
                                                placeholder="e.g., C-Suite, VP, Director..."
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Select decision-making levels to target
                                        </FormDescription>
                                        <FormMessage className="text-sm font-medium text-destructive mt-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="job_title_and_role.job_functions"
                                render={({ field }) => (
                                    <FormItem>
                                        <LabelWithTooltip 
                                            label="Job Functions"
                                            tooltip="Select the primary job functions or departments of your ideal customers. This helps target professionals with relevant responsibilities and challenges."
                                            required
                                        />
                                        <FormControl>
                                            <SimpleMultiSelect
                                                options={JOB_FUNCTION_OPTIONS}
                                                value={field.value || []}
                                                onChange={field.onChange}
                                                placeholder="e.g., Marketing, Sales..."
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Select relevant departments and roles
                                        </FormDescription>
                                        <FormMessage className="text-sm font-medium text-destructive mt-1" />
                                    </FormItem>
                                )}
                            />
                        </div>

                            <Separator className="my-6" />
                        <h3 className="text-lg font-semibold mb-4">Pain Points and Needs</h3>
                        <p className="text-sm text-muted-foreground mb-6">Define the business challenges and objectives that your solution addresses for your ideal customers.</p>

                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                name="pain_points_and_needs.challenges"
                                    render={({ field }) => (
                                        <FormItem>
                                        <LabelWithTooltip 
                                            label="Challenges"
                                            tooltip="List specific business problems, pain points, or obstacles that your ideal customers face. These should be challenges that your solution can help solve. Consider areas like: cost inefficiencies, operational bottlenecks, market competition, resource limitations, technology gaps, or compliance issues. Be specific to your industry and solution."
                                            required
                                        />
                                            <FormControl>
                                            <SimpleMultiSelect
                                                value={field.value || []}
                                                    onChange={field.onChange}
                                                placeholder="e.g., High CAC, Limited Market Reach, Manual Processes..."
                                                creatable
                                                />
                                            </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Add key business challenges your solution addresses
                                            </FormDescription>
                                            <FormMessage className="text-sm font-medium text-destructive mt-1" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                name="pain_points_and_needs.goals_objectives"
                                    render={({ field }) => (
                                        <FormItem>
                                        <LabelWithTooltip 
                                            label="Goals and Objectives"
                                            tooltip="Specify the business outcomes and objectives your ideal customers want to achieve. These should directly align with the benefits your solution provides. Consider both immediate goals (like process automation) and long-term objectives (like market expansion). Include measurable outcomes like revenue growth, cost reduction, efficiency gains, or market share increases."
                                            required
                                        />
                                            <FormControl>
                                            <SimpleMultiSelect
                                                value={field.value || []}
                                                    onChange={field.onChange}
                                                placeholder="e.g., Increase Revenue, Improve Customer Retention..."
                                                creatable
                                                />
                                            </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Add desired business outcomes and objectives
                                            </FormDescription>
                                            <FormMessage className="text-sm font-medium text-destructive mt-1" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        <Separator className="my-6" />
                        <h3 className="text-lg font-semibold mb-4">Experience & Keywords</h3>

                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                name="experience_and_keywords.experience_description_keywords"
                                    render={({ field }) => (
                                    <FormItem>
                                        <LabelWithTooltip 
                                            label="Experience Keywords"
                                            tooltip="Enter specific skills, expertise, or experience areas that your ideal customer should have in their profile. These keywords will be matched against their experience descriptions and job history."
                                            required
                                        />
                                            <FormControl>
                                            <SimpleMultiSelect
                                                value={field.value || []}
                                                onChange={field.onChange}
                                                placeholder="e.g., Digital Transformation, Growth Marketing, Revenue Operations..."
                                                creatable
                                                />
                                            </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Add required skills and expertise areas
                                        </FormDescription>
                                        <FormMessage className="text-sm font-medium text-destructive mt-1" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                name="experience_and_keywords.headline_keywords"
                                    render={({ field }) => (
                                        <FormItem>
                                        <LabelWithTooltip 
                                            label="Headline Keywords"
                                            tooltip="Add job titles or professional descriptions that would appear in your ideal customer's profile headline. These are typically current role titles or professional identifiers."
                                            required
                                        />
                                            <FormControl>
                                            <SimpleMultiSelect
                                                value={field.value || []}
                                                onChange={field.onChange}
                                                placeholder="e.g., Head of Marketing, Marketing Director, Growth Lead..."
                                                creatable
                                                />
                                            </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Add target job titles and roles
                                            </FormDescription>
                                            <FormMessage className="text-sm font-medium text-destructive mt-1" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                name="experience_and_keywords.min_months_experience"
                                render={({ field: { onChange, ...field } }) => (
                                        <FormItem>
                                        <LabelWithTooltip 
                                            label="Minimum Months Experience"
                                            tooltip="Set the minimum required work experience in months to target professionals with the right level of expertise. This helps ensure prospects have sufficient industry knowledge and experience. For example: 60 months (5 years) indicates mid-level experience, while 120 months (10 years) suggests senior expertise. Consider your solution's complexity and the decision-making level you're targeting."
                                        />
                                            <FormControl>
                                            <Input 
                                                type="number" 
                                                min="0"
                                                placeholder="e.g., 120 for 10 years"
                                                {...field}
                                                value={field.value?.toString() || ''}
                                                onChange={e => {
                                                    const value = e.target.value;
                                                    onChange(value === '' ? undefined : parseInt(value));
                                                }}
                                                />
                                            </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Specify required experience in months
                                            </FormDescription>
                                            <FormMessage className="text-sm font-medium text-destructive mt-1" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                name="experience_and_keywords.bio_keywords"
                                    render={({ field }) => (
                                        <FormItem>
                                        <LabelWithTooltip 
                                            label="Bio Keywords"
                                            tooltip="Identify keywords that appear in professional bios or about sections. These keywords can reveal interests, expertise areas, and professional focus. Look for industry-specific terms, technology mentions, methodologies, or strategic approaches that align with your solution. This helps find prospects who are actively engaged or interested in relevant areas."
                                        />
                                            <FormControl>
                                            <SimpleMultiSelect
                                                value={field.value || []}
                                                onChange={field.onChange}
                                                placeholder="e.g., AI, Martech, SaaS, Marketing Automation..."
                                                creatable
                                                />
                                            </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Add keywords to match in professional bios
                                            </FormDescription>
                                            <FormMessage className="text-sm font-medium text-destructive mt-1" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        <Separator className="my-6" />
                        <h3 className="text-lg font-semibold mb-4">Additional Targeting</h3>
                        <p className="text-sm text-muted-foreground mb-6">Fine-tune your targeting with additional criteria to find the most relevant prospects.</p>

                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="company_attributes.description_keywords"
                                render={({ field }) => (
                                    <FormItem>
                                        <LabelWithTooltip 
                                            label="Company Description Keywords"
                                            tooltip="Enter keywords to match against company descriptions and profiles. These help identify organizations that align with your target market based on how they describe themselves. Consider industry terms, technology mentions, service offerings, or market positioning that indicates a good fit. This can help find companies at the right stage or with relevant focus areas."
                                        />
                                        <FormControl>
                                            <SimpleMultiSelect
                                                value={field.value || []}
                                                onChange={field.onChange}
                                                placeholder="e.g., AI, Enterprise Software, Cloud Solutions..."
                                                creatable
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Add keywords to match in company profiles
                                        </FormDescription>
                                        <FormMessage className="text-sm font-medium text-destructive mt-1" />
                                    </FormItem>
                                )}
                            />

                                <FormField
                                    control={form.control}
                                name="job_title_and_role.exact_keyword_match"
                                    render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <LabelWithTooltip 
                                                    label="Exact Keyword Match"
                                                    tooltip="Toggle between exact or flexible keyword matching. When enabled, keywords must match exactly as entered (e.g., 'Marketing Director' won't match 'Director of Marketing'). When disabled, similar variations and partial matches will be included."
                                                />
                                                <FormDescription className="text-xs text-muted-foreground">
                                                    Enable for precise matching, disable to include similar variations
                                            </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                            </FormControl>
                                        </div>
                                        <div className="rounded-md bg-muted/50 p-3">
                                            <p className="text-xs text-muted-foreground">
                                                Example: When enabled, "Marketing Director" will not match "Director of Marketing" or "Senior Marketing Director"
                                            </p>
                                        </div>
                                            <FormMessage className="text-sm font-medium text-destructive mt-1" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        <Separator className="my-6" />
                        <h3 className="text-lg font-semibold mb-4">Certifications & Education</h3>

                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                name="certifications_and_education.certification_keywords"
                                    render={({ field }) => (
                                        <FormItem>
                                        <LabelWithTooltip 
                                            label="Certification Keywords"
                                            tooltip="Specify professional certifications that indicate relevant expertise or qualifications. This can include technical certifications, professional credentials, or industry-specific qualifications that demonstrate knowledge in areas important to your solution. Consider both broad industry standards and specialized certifications specific to your target market."
                                        />
                                            <FormControl>
                                            <SimpleMultiSelect
                                                options={CERTIFICATION_OPTIONS}
                                                value={field.value || []}
                                                onChange={field.onChange}
                                                placeholder="e.g., AWS Certified, Google Cloud..."
                                                creatable
                                                />
                                            </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Add relevant professional certifications
                                            </FormDescription>
                                            <FormMessage className="text-sm font-medium text-destructive mt-1" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                name="certifications_and_education.school_names"
                                render={({ field }) => (
                                    <FormItem>
                                        <LabelWithTooltip 
                                            label="School Names"
                                            tooltip="Target professionals based on their educational background. This can be useful if certain institutions are known for strong programs in relevant fields, or if you want to target alumni from specific schools. Consider including both prestigious institutions and schools known for specialized programs aligned with your solution."
                                        />
                                        <FormControl>
                                            <SimpleMultiSelect
                                                value={field.value || []}
                                                onChange={field.onChange}
                                                placeholder="Enter school names..."
                                                creatable
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Add target educational institutions
                                        </FormDescription>
                                        <FormMessage className="text-sm font-medium text-destructive mt-1" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end space-x-4 sticky bottom-0 bg-background py-4 border-t -mx-6 px-6 mt-6">
                                {onCancel && (
                                    <Button type="button" variant="outline" onClick={onCancel}>
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    disabled={isLoading || !isDirty}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        isDirty ? 'Save Target ICP' : 'No Changes'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
    );
} 