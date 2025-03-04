'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { toast } from 'sonner';
import { ICPFormData } from '@/types/icp';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, MessageSquarePlus, Globe, Target, Users2, Wand2, ChevronDown } from 'lucide-react';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { icpService } from '@/lib/services/icp.service';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { WebsiteAnalysisDialog } from './WebsiteAnalysisDialog';
import { Label } from '@/components/ui/label';

const INDUSTRY_OPTIONS: Option[] = [
    { label: 'Software & Technology', value: 'software_technology' },
    { label: 'Healthcare', value: 'healthcare' },
    { label: 'Financial Services', value: 'financial_services' },
    { label: 'E-commerce & Retail', value: 'ecommerce_retail' },
    { label: 'Manufacturing', value: 'manufacturing' },
    { label: 'Education', value: 'education' },
    { label: 'Professional Services', value: 'professional_services' },
    { label: 'Media & Entertainment', value: 'media_entertainment' },
    { label: 'Real Estate', value: 'real_estate' },
    { label: 'Travel & Hospitality', value: 'travel_hospitality' },
];

const TARGET_MARKET_OPTIONS: Option[] = [
    { label: 'Small Business', value: 'small_business' },
    { label: 'Mid-Market', value: 'mid_market' },
    { label: 'Enterprise', value: 'enterprise' },
    { label: 'Startups', value: 'startups' },
    { label: 'Government', value: 'government' },
    { label: 'Non-Profit', value: 'non_profit' },
    { label: 'Direct to Consumer', value: 'd2c' },
];

const LOCATION_OPTIONS = [
    { label: 'North America', value: 'north_america' },
    { label: 'Europe', value: 'europe' },
    { label: 'Asia Pacific', value: 'apac' },
    { label: 'Latin America', value: 'latam' },
    { label: 'Middle East', value: 'middle_east' },
    { label: 'Africa', value: 'africa' },
];

const COMPANY_TYPE_OPTIONS = [
    { label: 'Startup', value: 'startup' },
    { label: 'SMB', value: 'smb' },
    { label: 'Enterprise', value: 'enterprise' },
    { label: 'Government', value: 'government' },
    { label: 'Non-profit', value: 'non_profit' },
];

const ROLE_OPTIONS = [
    { label: 'CEO', value: 'ceo' },
    { label: 'CTO', value: 'cto' },
    { label: 'CFO', value: 'cfo' },
    { label: 'VP of Sales', value: 'vp_sales' },
    { label: 'VP of Marketing', value: 'vp_marketing' },
    { label: 'Director of IT', value: 'director_it' },
    { label: 'Head of Operations', value: 'head_operations' },
];

const SENIORITY_OPTIONS = [
    { label: 'C-Level', value: 'c_level' },
    { label: 'VP Level', value: 'vp_level' },
    { label: 'Director Level', value: 'director_level' },
    { label: 'Manager Level', value: 'manager_level' },
];

const CHANNEL_OPTIONS = [
    { label: 'Email', value: 'email' },
    { label: 'LinkedIn', value: 'linkedin' },
    { label: 'Phone', value: 'phone' },
    { label: 'Website', value: 'website' },
    { label: 'Social Media', value: 'social_media' },
    { label: 'Events', value: 'events' },
];

// Helper function to convert string array to options
const toOptions = (values: string[]): Option[] =>
    values.map(value => ({ label: value, value }));

// Helper function to convert options to string array
const fromOptions = (options: Option[]): string[] =>
    options.map(option => option.value);

const formSchema = z.object({
    name: z.string().min(1, 'Company or product name is required').max(150, 'Name cannot exceed 150 characters'),
    website: z.string()
        .transform(val => val.trim())
        .refine(val => {
            if (!val) return true; // Allow empty values
            try {
                // If URL doesn't have a protocol, add https://
                const urlToTest = /^https?:\/\//i.test(val) ? val : `https://${val}`;
                new URL(urlToTest);
                return true;
            } catch {
                return false;
            }
        }, 'Please enter a valid website URL (e.g., example.com)')
        .optional(),
    customerPainPoints: z.string().min(1, 'Customer pain points are required').max(600, 'Pain points cannot exceed 600 characters'),
    valueProposition: z.string().min(1, 'Value proposition is required').max(600, 'Value proposition cannot exceed 600 characters'),
    callToAction: z.string().min(1, 'Call-to-action is required').max(300, 'Call-to-action cannot exceed 300 characters'),
    companyOverview: z.string().min(1, 'Company overview is required').max(600, 'Company overview cannot exceed 600 characters'),
    additionalContext: z.string().optional(),
    primaryCompetitors: z.string().optional(),
    productDifferentiators: z.string().optional(),
});

interface ICPFormProps {
    initialData?: ICPFormData;
    onSubmit: (data: ICPFormData) => void;
    onCancel?: () => void;
}

export function ICPForm({ initialData, onSubmit, onCancel }: ICPFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isWebsiteOpen, setIsWebsiteOpen] = useState(false);
    const [isScrapingLoading, setIsScrapingLoading] = useState(false);
    const [enhancingFields, setEnhancingFields] = useState<Record<string, boolean>>({});
    const [enhancementCounts, setEnhancementCounts] = useState<Record<string, number>>({});
    const [fieldUpdates, setFieldUpdates] = useState<Record<string, number>>({});
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
    const [analysisResults, setAnalysisResults] = useState<{
        companyName?: string;
        customerPainPoints?: string;
        valueProposition?: string;
        companyOverview?: string;
        callToAction?: string;
        additionalContext?: string;
        primaryCompetitors?: string;
        productDifferentiators?: string;
    }>();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name ?? '',
            website: initialData?.website ?? '',
            customerPainPoints: initialData?.customerPainPoints ?? '',
            valueProposition: initialData?.valueProposition ?? '',
            callToAction: initialData?.callToAction ?? '',
            companyOverview: initialData?.companyOverview ?? '',
            additionalContext: initialData?.additionalContext ?? '',
            primaryCompetitors: initialData?.primaryCompetitors ?? '',
            productDifferentiators: initialData?.productDifferentiators ?? '',
        },
    });

    // Get form state
    const { isDirty } = form.formState;

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            await onSubmit(data);
            toast.success('ICP saved successfully!');
        } catch (error) {
            toast.error('Failed to save ICP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleScrapeWebsite = async () => {
        const websiteUrl = form.getValues('website');
        if (!websiteUrl) {
            toast.error('Please enter a website URL');
            return;
        }

        try {
            setIsScrapingLoading(true);
            const data = await icpService.scrapeWebsite(websiteUrl);

            // Update form fields with scraped data
            form.setValue('name', data.name || '', { shouldValidate: true });
            form.setValue('companyOverview', data.companyOverview || '', { shouldValidate: true });
            form.setValue('valueProposition', data.valueProposition || '', { shouldValidate: true });
            form.setValue('customerPainPoints', data.customerPainPoints || '', { shouldValidate: true });
            form.setValue('primaryCompetitors', data.primaryCompetitors || '', { shouldValidate: true });
            form.setValue('productDifferentiators', data.productDifferentiators || '', { shouldValidate: true });
            form.setValue('callToAction', data.callToAction || '', { shouldValidate: true });
            form.setValue('additionalContext', data.additionalContext || '', { shouldValidate: true });

            toast.success('Website analyzed successfully!');
        } catch (error) {
            toast.error('Failed to analyze website');
            console.error('Scraping error:', error);
        } finally {
            setIsScrapingLoading(false);
        }
    };

    const handleEnhanceField = async (fieldName: string, content: string, characterLimit: number) => {
        const currentCount = enhancementCounts[fieldName] || 0;

        if (currentCount >= 10) {
            toast.error(`You have reached the maximum limit of 10 AI enhancements for this field`);
            return;
        }

        if (!content.trim()) {
            toast.error('Please enter some content first');
            return;
        }

        if (content.length >= characterLimit) {
            toast.error(`Content already exceeds the ${characterLimit} character limit`);
            return;
        }

        try {
            setEnhancingFields(prev => ({ ...prev, [fieldName]: true }));
            const { enhancedContent } = await icpService.enhanceField(fieldName, content, characterLimit);

            if (enhancedContent.length > characterLimit) {
                toast.error(`Enhanced content exceeds the ${characterLimit} character limit`);
                setEnhancingFields(prev => ({ ...prev, [fieldName]: false }));
                return;
            }

            // Get all current form values
            const currentValues = form.getValues();

            // Update the specific field
            const updatedValues = {
                ...currentValues,
                [fieldName]: enhancedContent
            };

            // Reset the form with the new values to force an immediate update
            form.reset(updatedValues, {
                keepDefaultValues: true,
                keepDirty: true,
                keepTouched: true,
                keepIsValid: true,
                keepErrors: true,
            });

            setEnhancementCounts(prev => ({
                ...prev,
                [fieldName]: (prev[fieldName] || 0) + 1
            }));
            toast.success(`Content enhanced successfully! (${10 - currentCount - 1} enhancements remaining for this field)`);
        } catch (error) {
            toast.error('Failed to enhance content');
            console.error('Enhancement error:', error);
        } finally {
            setEnhancingFields(prev => ({ ...prev, [fieldName]: false }));
        }
    };

    const EnhanceButton = ({ fieldName, content, characterLimit }: { fieldName: string, content: string | undefined, characterLimit: number }) => {
        const currentCount = enhancementCounts[fieldName] || 0;
        return (
            <Button
                type="button"
                size="sm"
                variant="ghost"
                className="absolute right-3 top-[50%] -translate-y-1/2 h-8"
                onClick={() => content && handleEnhanceField(fieldName, content, characterLimit)}
                disabled={enhancingFields[fieldName] || !content || currentCount >= 10}
                title={currentCount >= 10 ? 'AI enhancement limit reached for this field' : `Enhance with AI (${10 - currentCount} remaining)`}
            >
                {enhancingFields[fieldName] ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="h-4 w-4" />
                )}
            </Button>
        );
    };

    const handleAnalyzeWebsite = async (url: string) => {
        if (!url) {
            toast.error('Please enter a website URL');
            return;
        }

        try {
            setIsAnalyzing(true);
            const results = await icpService.analyzeWebsite(url);
            setAnalysisResults(results);
            setShowAnalysisDialog(true);
            toast.success('Website analyzed successfully!');
        } catch (error: any) {
            // Display the specific error message from the service
            const errorMessage = error.message || 'Failed to analyze website. Please try again.';
            toast.error(errorMessage, {
                description: 'Make sure the URL is correct and the website is accessible.',
                duration: 5000,
            });
            console.error('Website analysis error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleApplyAnalysis = (selectedFields: string[]) => {
        if (!analysisResults) return;

        const updates: Partial<z.infer<typeof formSchema>> = {};

        selectedFields.forEach((field) => {
            switch (field) {
                case 'companyName':
                    updates.name = analysisResults.companyName || '';
                    break;
                case 'customerPainPoints':
                    updates.customerPainPoints = analysisResults.customerPainPoints || '';
                    break;
                case 'valueProposition':
                    updates.valueProposition = analysisResults.valueProposition || '';
                    break;
                case 'companyOverview':
                    updates.companyOverview = analysisResults.companyOverview || '';
                    break;
                case 'callToAction':
                    updates.callToAction = analysisResults.callToAction || '';
                    break;
                case 'additionalContext':
                    updates.additionalContext = analysisResults.additionalContext || '';
                    break;
                case 'primaryCompetitors':
                    updates.primaryCompetitors = analysisResults.primaryCompetitors || '';
                    break;
                case 'productDifferentiators':
                    updates.productDifferentiators = analysisResults.productDifferentiators || '';
                    break;
            }
        });

        // Update all fields at once and trigger re-render
        (Object.entries(updates) as [keyof typeof updates, string][]).forEach(([field, value]) => {
            form.setValue(field, value, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });

            // Trigger field update counter to force re-render
            setFieldUpdates(prev => ({
                ...prev,
                [field]: (prev[field] || 0) + 1
            }));
        });

        toast.success('Form fields updated successfully');
    };

    return (
        <div className="space-y-8">
            <div className="grid gap-6">
                <div className="px-6 my-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{initialData ? 'Edit ICP' : 'Create New ICP'}</CardTitle>
                            <CardDescription>
                                Define your ideal customer profile to help identify and target the right leads. This will be used to highlight your company and its offerings in generated emails.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>


                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <FormField
                                            control={form.control}
                                            name="website"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel>Website URL (optional)</FormLabel>
                                                    <div className="flex gap-2">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="webbuddy.agency"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <Button
                                                            type="button"
                                                            onClick={() => field.value && handleAnalyzeWebsite(field.value)}
                                                            disabled={isAnalyzing || !field.value}
                                                        >
                                                            {isAnalyzing ? (
                                                                <>
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                    Analyzing...
                                                                </>
                                                            ) : (
                                                                'Analyze'
                                                            )}
                                                        </Button>
                                                    </div>
                                                    <FormDescription>
                                                        Gather content from your website
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold">
                                                    Company or product name<span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormDescription>
                                                    Add your company, product, or service name.
                                                </FormDescription>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input className="pr-12" {...field} placeholder='E.g. Lead Research AI' />
                                                    </FormControl>
                                                    <div className={`absolute right-3 top-[50%] -translate-y-1/2 text-xs ${field.value.length >= 150 ? 'text-destructive' : 'text-muted-foreground'} bg-background px-2 rounded-md`}>
                                                        {field.value.length}/150
                                                    </div>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="customerPainPoints"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold">
                                                    Customer pain points<span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormDescription>
                                                    Add at least 3 pain points your product or service is solving.
                                                </FormDescription>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Textarea
                                                            className="min-h-[100px] pr-24"
                                                            placeholder="Companies struggle with inefficient lead generation, poor data quality, and time-consuming manual prospecting that results in low conversion rates and wasted resources."
                                                            {...field}
                                                            key={fieldUpdates[field.name] || 'initial'}
                                                            value={field.value || ''}
                                                        />
                                                    </FormControl>
                                                    <div className={`absolute right-12 top-3 text-xs ${(field.value?.length || 0) >= 600 ? 'text-destructive' : 'text-muted-foreground'} bg-background px-2 rounded-md`}>
                                                        {field.value?.length || 0}/600
                                                    </div>
                                                    <EnhanceButton
                                                        fieldName="customerPainPoints"
                                                        content={field.value}
                                                        characterLimit={600}
                                                    />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="valueProposition"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold">
                                                    Value proposition<span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormDescription>
                                                    Add at least 3 benefits of using your product/service.
                                                </FormDescription>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Textarea
                                                            className="min-h-[100px] pr-24"
                                                            placeholder="Lead Research AI revolutionizes lead generation with AI-powered prospecting, high-quality data enrichment, and automated outreach capabilities, helping businesses scale their sales efficiently."
                                                            {...field}
                                                            key={fieldUpdates[field.name] || 'initial'}
                                                            value={field.value || ''}
                                                        />
                                                    </FormControl>
                                                    <div className={`absolute right-12 top-3 text-xs ${(field.value?.length || 0) >= 600 ? 'text-destructive' : 'text-muted-foreground'} bg-background px-2 rounded-md`}>
                                                        {field.value?.length || 0}/600
                                                    </div>
                                                    <EnhanceButton
                                                        fieldName="valueProposition"
                                                        content={field.value}
                                                        characterLimit={600}
                                                    />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="callToAction"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold">
                                                    Call-to-action<span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormDescription>
                                                    Add an action you want the recipient to take. E.g. Book a meeting
                                                </FormDescription>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Textarea
                                                            className="min-h-[60px] pr-24"
                                                            placeholder="schedule a personalized demo"
                                                            {...field}
                                                            key={fieldUpdates[field.name] || 'initial'}
                                                            value={field.value || ''}
                                                        />
                                                    </FormControl>
                                                    <div className={`absolute right-12 top-3 text-xs ${(field.value?.length || 0) >= 300 ? 'text-destructive' : 'text-muted-foreground'} bg-background px-2 rounded-md`}>
                                                        {field.value?.length || 0}/300
                                                    </div>
                                                    <EnhanceButton
                                                        fieldName="callToAction"
                                                        content={field.value}
                                                        characterLimit={300}
                                                    />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="companyOverview"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold">
                                                    Company overview<span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormDescription>
                                                    Add a brief description of what your company or product does.
                                                </FormDescription>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Textarea
                                                            className="min-h-[100px] pr-24"
                                                            placeholder="Lead Research AI is an innovative AI-powered lead generation and sales automation platform that helps businesses identify, engage, and convert high-quality prospects at scale."
                                                            {...field}
                                                            key={fieldUpdates[field.name] || 'initial'}
                                                            value={field.value || ''}
                                                        />
                                                    </FormControl>
                                                    <div className={`absolute right-12 top-3 text-xs ${(field.value?.length || 0) >= 600 ? 'text-destructive' : 'text-muted-foreground'} bg-background px-2 rounded-md`}>
                                                        {field.value?.length || 0}/600
                                                    </div>
                                                    <EnhanceButton
                                                        fieldName="companyOverview"
                                                        content={field.value}
                                                        characterLimit={600}
                                                    />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="additionalContext"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold">
                                                    Additional context
                                                </FormLabel>
                                                <FormDescription>
                                                    Add other details, such as a customer quote, to enhance the content.
                                                </FormDescription>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Textarea
                                                            className="min-h-[100px] pr-24"
                                                            placeholder="E.g. 'Lead Research AI has transformed our sales process - we have seen a 3x increase in qualified leads and 40% reduction in prospecting time.' -Sarah Johnson, Sales Director"
                                                            {...field}
                                                            key={fieldUpdates[field.name] || 'initial'}
                                                            value={field.value || ''}
                                                        />
                                                    </FormControl>
                                                    <div className={`absolute right-12 top-3 text-xs ${(field.value?.length || 0) >= 600 ? 'text-destructive' : 'text-muted-foreground'} bg-background px-2 rounded-md`}>
                                                        {field.value?.length || 0}/600
                                                    </div>
                                                    <EnhanceButton
                                                        fieldName="additionalContext"
                                                        content={field.value}
                                                        characterLimit={600}
                                                    />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardContent className="pt-6">
                            <h2 className="text-lg font-semibold mb-6">Competitors</h2>
                            <Form {...form}>
                                <form className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="primaryCompetitors"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold">
                                                    Primary competitors
                                                </FormLabel>
                                                <FormDescription>
                                                    Add direct competitors with similar offerings targeting the same audience.
                                                </FormDescription>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Textarea
                                                            className="min-h-[100px] pr-24"
                                                            placeholder="E.g. ZoomInfo, Apollo.io, Hunter.io"
                                                            {...field}
                                                            key={fieldUpdates[field.name] || 'initial'}
                                                            value={field.value || ''}
                                                        />
                                                    </FormControl>
                                                    <div className={`absolute right-12 top-3 text-xs ${(field.value?.length || 0) >= 600 ? 'text-destructive' : 'text-muted-foreground'} bg-background px-2 rounded-md`}>
                                                        {field.value?.length || 0}/600
                                                    </div>
                                                    <EnhanceButton
                                                        fieldName="primaryCompetitors"
                                                        content={field.value}
                                                        characterLimit={600}
                                                    />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="productDifferentiators"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold">
                                                    Product differentiators
                                                </FormLabel>
                                                <FormDescription>
                                                    Add unique selling points that set your company apart from competitors.
                                                </FormDescription>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Textarea
                                                            className="min-h-[100px] pr-24"
                                                            placeholder="E.g. Advanced AI-powered lead scoring, real-time data enrichment, automated personalized outreach sequences"
                                                            {...field}
                                                            key={fieldUpdates[field.name] || 'initial'}
                                                            value={field.value || ''}
                                                        />
                                                    </FormControl>
                                                    <div className={`absolute right-12 top-3 text-xs ${(field.value?.length || 0) >= 600 ? 'text-destructive' : 'text-muted-foreground'} bg-background px-2 rounded-md`}>
                                                        {field.value?.length || 0}/600
                                                    </div>
                                                    <EnhanceButton
                                                        fieldName="productDifferentiators"
                                                        content={field.value}
                                                        characterLimit={600}
                                                    />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-end space-x-4 sticky bottom-0 bg-background p-4 border-t px-6">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={isLoading || !isDirty}
                    onClick={form.handleSubmit(handleSubmit)}
                    className="relative"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        'Save ICP'
                    )}
                </Button>
            </div>

            <WebsiteAnalysisDialog
                open={showAnalysisDialog}
                onClose={() => setShowAnalysisDialog(false)}
                currentContent={{
                    companyName: form.getValues('name'),
                    customerPainPoints: form.getValues('customerPainPoints'),
                    valueProposition: form.getValues('valueProposition'),
                    companyOverview: form.getValues('companyOverview'),
                }}
                newContent={analysisResults || {}}
                onApply={handleApplyAnalysis}
            />
        </div>
    );
} 