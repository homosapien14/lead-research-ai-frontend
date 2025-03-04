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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import { Separator } from '@/components/ui/separator';

const INDUSTRY_OPTIONS: Option[] = [
    { label: 'Marketing Services', value: 'marketing_services' },
    { label: 'Technology', value: 'technology' },
    { label: 'SaaS', value: 'saas' },
    { label: 'Digital Marketing', value: 'digital_marketing' },
    { label: 'AI & Machine Learning', value: 'ai_ml' },
    { label: 'Consulting', value: 'consulting' },
    { label: 'Advertising', value: 'advertising' },
    { label: 'Marketing Technology', value: 'martech' },
    { label: 'Software Development', value: 'software_development' },
    { label: 'Data Analytics', value: 'data_analytics' },
];

const COMPANY_SIZE_OPTIONS: Option[] = [
    { label: '1-10 employees', value: '1_10' },
    { label: '11-50 employees', value: '11_50' },
    { label: '51-200 employees', value: '51_200' },
    { label: '201-500 employees', value: '201_500' },
    { label: '501-1000 employees', value: '501_1000' },
    { label: '1001-5000 employees', value: '1001_5000' },
    { label: '5000+ employees', value: '5000_plus' },
];

const SENIORITY_OPTIONS: Option[] = [
    { label: 'C-Suite', value: 'c_suite' },
    { label: 'VP', value: 'vp' },
    { label: 'Director', value: 'director' },
    { label: 'Manager', value: 'manager' },
];

const JOB_FUNCTION_OPTIONS: Option[] = [
    { label: 'Executive', value: 'executive' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Product', value: 'product' },
    { label: 'Technology', value: 'technology' },
    { label: 'Sales', value: 'sales' },
    { label: 'Operations', value: 'operations' },
];

const LOCATION_OPTIONS: Option[] = [
    { label: 'United States', value: 'usa' },
    { label: 'Canada', value: 'canada' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Europe', value: 'europe' },
    { label: 'Asia Pacific', value: 'apac' },
];

const EXPERIENCE_RANGE_OPTIONS: Option[] = [
    { label: '0-2 years', value: '0_2' },
    { label: '3-5 years', value: '3_5' },
    { label: '6-10 years', value: '6_10' },
    { label: '10+ years', value: '10_plus' },
];

const formSchema = z.object({
    name: z.string().min(1, 'ICP name is required').max(100, 'Name cannot exceed 100 characters'),

    // Company Attributes
    includeIndustries: z.array(z.string()).min(1, 'Select at least one industry'),
    excludeIndustries: z.array(z.string()).optional(),
    companySizes: z.array(z.string()).optional(),
    companyKeywords: z.string().optional(),

    // Job Criteria
    seniority: z.array(z.string()).min(1, 'Select at least one seniority level'),
    jobFunctions: z.array(z.string()).min(1, 'Select at least one job function'),
    exactTitleMatch: z.boolean().default(false),
    customTitles: z.string().optional(),

    // Location
    includeLocations: z.array(z.string()).min(1, 'Select at least one location'),
    excludedCities: z.string().optional(),
    excludedRegions: z.string().optional(),

    // Experience
    experienceRange: z.array(z.string()).min(1, 'Select experience range'),
    experienceKeywords: z.string().optional(),

    // Profile Keywords
    headlineKeywords: z.string().optional(),
    bioKeywords: z.string().optional(),

    // Additional Criteria
    notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TargetedICPFormProps {
    initialData?: FormData;
    onSubmit: (data: FormData) => void;
    onCancel?: () => void;
}

export function TargetedICPForm({ initialData, onSubmit, onCancel }: TargetedICPFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name ?? '',
            includeIndustries: initialData?.includeIndustries ?? [],
            excludeIndustries: initialData?.excludeIndustries ?? [],
            companySizes: initialData?.companySizes ?? [],
            companyKeywords: initialData?.companyKeywords ?? '',
            seniority: initialData?.seniority ?? [],
            jobFunctions: initialData?.jobFunctions ?? [],
            exactTitleMatch: initialData?.exactTitleMatch ?? false,
            customTitles: initialData?.customTitles ?? '',
            includeLocations: initialData?.includeLocations ?? [],
            excludedCities: initialData?.excludedCities ?? '',
            excludedRegions: initialData?.excludedRegions ?? '',
            experienceRange: initialData?.experienceRange ?? [],
            experienceKeywords: initialData?.experienceKeywords ?? '',
            headlineKeywords: initialData?.headlineKeywords ?? '',
            bioKeywords: initialData?.bioKeywords ?? '',
            notes: initialData?.notes ?? '',
        },
    });

    const { isDirty } = form.formState;

    const handleSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);
            await onSubmit(data);
            toast.success('Target ICP saved successfully!');
        } catch (error) {
            toast.error('Failed to save target ICP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>{initialData ? 'Edit Target ICP' : 'Create Target ICP'}</CardTitle>
                    <CardDescription>
                        Define your ideal customer profile by specifying detailed targeting criteria.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ICP Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enterprise Marketing Leaders" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Give this ICP a memorable name for easy reference
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Separator className="my-6" />
                            <h3 className="text-lg font-semibold mb-4">Company Attributes</h3>

                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="includeIndustries"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Industries to Include</FormLabel>
                                            <FormControl>
                                                <MultiSelect
                                                    options={INDUSTRY_OPTIONS}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Select industries..."
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Select the industries you want to target
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="excludeIndustries"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Industries to Exclude</FormLabel>
                                            <FormControl>
                                                <MultiSelect
                                                    options={INDUSTRY_OPTIONS}
                                                    value={field.value ?? []}
                                                    onChange={field.onChange}
                                                    placeholder="Select industries to exclude..."
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Select industries you want to exclude
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="companySizes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Sizes</FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={COMPANY_SIZE_OPTIONS}
                                                value={field.value || []}
                                                onChange={field.onChange}
                                                placeholder="Select company sizes..."
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Select target company sizes (optional)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="companyKeywords"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Description Keywords</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="AI, technology, martech, SaaS, digital marketing"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Enter keywords to match in company descriptions (comma-separated)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Separator className="my-6" />
                            <h3 className="text-lg font-semibold mb-4">Job Criteria</h3>

                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="seniority"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Seniority Level</FormLabel>
                                            <FormControl>
                                                <MultiSelect
                                                    options={SENIORITY_OPTIONS}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Select seniority levels..."
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Select target seniority levels
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="jobFunctions"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Job Functions</FormLabel>
                                            <FormControl>
                                                <MultiSelect
                                                    options={JOB_FUNCTION_OPTIONS}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Select job functions..."
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Select target job functions
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="exactTitleMatch"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Exact Title Match
                                                </FormLabel>
                                                <FormDescription>
                                                    Enable for strict job title matching
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="customTitles"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Custom Job Titles</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="CEO, Founder, VP of Marketing"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Enter specific job titles (comma-separated)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator className="my-6" />
                            <h3 className="text-lg font-semibold mb-4">Location</h3>

                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="includeLocations"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Locations to Include</FormLabel>
                                            <FormControl>
                                                <MultiSelect
                                                    options={LOCATION_OPTIONS}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Select locations..."
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Select target locations
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="excludedRegions"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Excluded Regions</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter regions to exclude"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Specify regions to exclude (comma-separated)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="excludedCities"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Excluded Cities</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter cities to exclude"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Specify cities to exclude (comma-separated)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Separator className="my-6" />
                            <h3 className="text-lg font-semibold mb-4">Experience & Keywords</h3>

                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="experienceRange"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Experience Range</FormLabel>
                                            <FormControl>
                                                <MultiSelect
                                                    options={EXPERIENCE_RANGE_OPTIONS}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Select experience range..."
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Select required experience range
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="experienceKeywords"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Experience Keywords</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="AI, marketing technology, SaaS, growth strategy"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Enter keywords to match in experience (comma-separated)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="headlineKeywords"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Headline Keywords</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Founder, CEO, VP, Director"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Keywords to match in profile headlines
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bioKeywords"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio Keywords</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="AI, Martech, SaaS, NLP, startup"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Keywords to match in profile bios
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Additional Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Add any additional notes or criteria"
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Any additional information or special requirements
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end space-x-4">
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
                                        'Save Target ICP'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
} 