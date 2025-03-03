'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetFooter 
} from '../ui/sheet';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Loader2, FileDown } from 'lucide-react';
import { ExportFormat, Lead } from '@/types/lead';
import { Checkbox } from '../ui/checkbox';

// Form schema with zod for validation
const exportFormSchema = z.object({
  format: z.nativeEnum(ExportFormat),
  includeTags: z.boolean().default(true),
  includeMetadata: z.boolean().default(false),
  filename: z.string().optional(),
  leadIds: z.array(z.string()).optional(),
  // Add fields as multiselect
  fields: z.array(z.string()).min(1, "Select at least one field to export"),
});

type ExportFormValues = z.infer<typeof exportFormSchema>;

interface ExportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLeads?: Lead[];
}

// Available fields for export
const AVAILABLE_FIELDS = [
  { id: 'firstName', label: 'First Name' },
  { id: 'lastName', label: 'Last Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'company', label: 'Company' },
  { id: 'jobTitle', label: 'Job Title' },
  { id: 'industry', label: 'Industry' },
  { id: 'companySize', label: 'Company Size' },
  { id: 'status', label: 'Status' },
  { id: 'engagementScore', label: 'Engagement Score' },
  { id: 'createdAt', label: 'Created Date' },
  { id: 'updatedAt', label: 'Updated Date' },
  { id: 'linkedinUrl', label: 'LinkedIn URL' },
  { id: 'websiteUrl', label: 'Website URL' },
];

export function ExportLeadsModal({ isOpen, onClose, selectedLeads = [] }: ExportLeadsModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<ExportFormValues>({
    resolver: zodResolver(exportFormSchema),
    defaultValues: {
      format: ExportFormat.CSV,
      includeTags: true,
      includeMetadata: false,
      filename: `leads-export-${new Date().toISOString().split('T')[0]}`,
      fields: ['firstName', 'lastName', 'email', 'company', 'jobTitle', 'status'],
      leadIds: selectedLeads.map(lead => lead.id),
    },
  });

  // Form submission handler
  const onSubmit = async (data: ExportFormValues) => {
    setIsSubmitting(true);

    try {
      // Prepare request payload
      const exportData = {
        format: data.format,
        includeTags: data.includeTags,
        includeMetadata: data.includeMetadata,
        filename: data.filename,
        fields: data.fields,
        leadIds: data.leadIds && data.leadIds.length > 0 ? data.leadIds : undefined,
      };

      // For file downloads, we need to handle the response differently
      const response = await axios.post('/api/leads/export', exportData, {
        responseType: 'blob', // Important for file downloads
      });

      // Extract filename from Content-Disposition header if available
      const contentDisposition = response.headers['content-disposition'];
      const filenameFromHeader = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `${data.filename || 'leads-export'}.${data.format.toLowerCase()}`;

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filenameFromHeader);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Export Completed', {
        description: `Your leads have been exported to ${filenameFromHeader}`,
      });

      // Close modal on success
      onClose();
    } catch (error) {
      console.error('Error exporting leads:', error);
      toast.error('Export Failed', {
        description: 'There was a problem exporting leads. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle>Export Leads</SheetTitle>
          <SheetDescription>
            Export leads to CSV, Excel, JSON, or PDF format.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Export Format</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select export format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ExportFormat.CSV}>CSV</SelectItem>
                        <SelectItem value={ExportFormat.EXCEL}>Excel</SelectItem>
                        <SelectItem value={ExportFormat.JSON}>JSON</SelectItem>
                        <SelectItem value={ExportFormat.PDF}>PDF</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the format for your exported file
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="filename"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filename</FormLabel>
                    <FormControl>
                      <Input placeholder="leads-export" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional custom filename (without extension)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="includeTags"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Include Tags</FormLabel>
                        <FormDescription>
                          Export lead tags with the data
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
                  name="includeMetadata"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Include Metadata</FormLabel>
                        <FormDescription>
                          Export additional metadata fields
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
              </div>

              <FormField
                control={form.control}
                name="fields"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Fields to Include</FormLabel>
                      <FormDescription>
                        Select the fields you want to include in the export
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-2">
                      {AVAILABLE_FIELDS.map((field) => (
                        <FormField
                          key={field.id}
                          control={form.control}
                          name="fields"
                          render={({ field: { value, onChange } }) => {
                            return (
                              <FormItem
                                key={field.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={value.includes(field.id)}
                                    onCheckedChange={(checked: boolean | 'indeterminate') => {
                                      return checked === true
                                        ? onChange([...value, field.id])
                                        : onChange(value.filter((val) => val !== field.id));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {field.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <FileDown className="mr-2 h-4 w-4" />
                  Export {selectedLeads.length ? selectedLeads.length : 'All'} Leads
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
} 