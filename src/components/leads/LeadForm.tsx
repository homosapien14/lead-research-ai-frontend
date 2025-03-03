'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { leadsService, Lead } from '@/lib/services/leads.service';
import { LeadStatus } from '@/types/lead';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Form schema with zod for validation
const leadFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.string().length(0)),
  twitterUrl: z.string().url('Invalid Twitter URL').optional().or(z.string().length(0)),
  instagramUrl: z.string().url('Invalid Instagram URL').optional().or(z.string().length(0)),
  websiteUrl: z.string().url('Invalid Website URL').optional().or(z.string().length(0)),
  status: z.nativeEnum(LeadStatus).optional(),
  tags: z.string().optional(), // For simplified input, we'll join/split as needed
  notes: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  lead?: Lead;
  onSuccess?: (lead: Lead) => void;
  onCancel?: () => void;
}

export function LeadForm({ lead, onSuccess, onCancel }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!lead;

  // Initialize form with default values or existing lead data
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      firstName: lead?.firstName || '',
      lastName: lead?.lastName || '',
      email: lead?.email || '',
      phone: lead?.phone || '',
      company: lead?.company || '',
      jobTitle: lead?.jobTitle || '',
      industry: lead?.industry || '',
      companySize: lead?.companySize || '',
      linkedinUrl: lead?.linkedinUrl || '',
      websiteUrl: lead?.websiteUrl || '',
      status: lead?.status || LeadStatus.NEW,
      tags: lead?.tags?.join(', ') || '',
      notes: lead?.metadata?.notes || '',
    },
  });

  // Reset form when lead changes
  useEffect(() => {
    if (lead) {
      form.reset({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone || '',
        company: lead.company || '',
        jobTitle: lead.jobTitle || '',
        industry: lead.industry || '',
        companySize: lead.companySize || '',
        linkedinUrl: lead.linkedinUrl || '',
        websiteUrl: lead.websiteUrl || '',
        status: lead.status,
        tags: lead.tags?.join(', ') || '',
        notes: lead.metadata?.notes || '',
      });
    }
  }, [lead, form]);

  // Form submission handler
  const onSubmit = async (data: LeadFormValues) => {
    setIsSubmitting(true);

    try {
      // Process tags from comma-separated string to array
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

      // Prepare metadata
      const metadata: Record<string, any> = {
        notes: data.notes,
      };

      // Add social links to metadata if provided
      if (data.linkedinUrl) metadata.linkedinUrl = data.linkedinUrl;
      if (data.twitterUrl) metadata.twitterUrl = data.twitterUrl;
      if (data.instagramUrl) metadata.instagramUrl = data.instagramUrl;
      if (data.websiteUrl) metadata.websiteUrl = data.websiteUrl;

      // Prepare lead data
      const leadData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        company: data.company,
        jobTitle: data.jobTitle,
        industry: data.industry,
        companySize: data.companySize,
        status: data.status,
        tags,
        metadata,
      };

      let response;
      if (isEditing && lead) {
        // Update existing lead
        response = await leadsService.updateLead(lead.id, leadData);
        toast.success("Lead Updated", {
          description: `${data.firstName} ${data.lastName} has been updated successfully.`,
        });
      } else {
        // Create new lead
        response = await leadsService.createLead(leadData);
        toast.success("Lead Created", {
          description: `${data.firstName} ${data.lastName} has been added successfully.`,
        });
        form.reset(); // Reset the form after successful creation
      }

      // Call success callback with the created/updated lead
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error: any) {
      console.error('Error saving lead:', error);

      // Handle specific error cases
      if (error.response?.data?.message) {
        if (typeof error.response.data.message === 'string') {
          toast.error("Error", {
            description: error.response.data.message,
          });
        } else if (Array.isArray(error.response.data.message)) {
          toast.error("Error", {
            description: error.response.data.message.join(', '),
          });
        }
      } else if (error.response?.status === 409 ||
        (error.response?.data?.code === 11000 && error.response?.data?.keyPattern?.email)) {
        toast.error("Duplicate Email", {
          description: "A lead with this email address already exists.",
        });
      } else {
        toast.error("Error", {
          description: "There was a problem saving the lead. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Lead' : 'Create New Lead'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id="lead-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Information */}
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="CEO" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <FormControl>
                      <Input placeholder="Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="501-1000">501-1000 employees</SelectItem>
                        <SelectItem value="1001+">1001+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Social Media */}
              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Lead Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lead status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={LeadStatus.NEW}>New</SelectItem>
                        <SelectItem value={LeadStatus.CONTACTED}>Contacted</SelectItem>
                        <SelectItem value={LeadStatus.ENGAGED}>Engaged</SelectItem>
                        <SelectItem value={LeadStatus.QUALIFIED}>Qualified</SelectItem>
                        <SelectItem value={LeadStatus.PROPOSAL}>Proposal</SelectItem>
                        <SelectItem value={LeadStatus.CLOSED_WON}>Closed (Won)</SelectItem>
                        <SelectItem value={LeadStatus.CLOSED_LOST}>Closed (Lost)</SelectItem>
                        <SelectItem value={LeadStatus.ON_HOLD}>On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="VIP, follow-up, priority" {...field} />
                    </FormControl>
                    <FormDescription>
                      Separate tags with commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes about this lead" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" form="lead-form" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Lead' : 'Create Lead'}
        </Button>
      </CardFooter>
    </Card>
  );
} 