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
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';
import { Loader2, Upload } from 'lucide-react';
import { ImportSource, DuplicateHandlingStrategy } from '@/types/lead';

// Form schema with zod for validation
const importFormSchema = z.object({
  source: z.nativeEnum(ImportSource),
  duplicateHandling: z.nativeEnum(DuplicateHandlingStrategy).default(DuplicateHandlingStrategy.SKIP),
  validateEmails: z.boolean().default(true),
  enrichLeads: z.boolean().default(false),
  tags: z.string().optional(),
  file: z.instanceof(File).optional(),
  csvContent: z.string().optional(),
}).refine(data => {
  // Either file or csvContent must be provided
  return !!data.file || !!data.csvContent;
}, {
  message: "Please upload a file or provide CSV content",
  path: ["file"],
});

type ImportFormValues = z.infer<typeof importFormSchema>;

interface ImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (result: { total: number; created: number; updated: number; skipped: number; errors: string[] }) => void;
}

export function ImportLeadsModal({ isOpen, onClose, onSuccess }: ImportLeadsModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Initialize form
  const form = useForm<ImportFormValues>({
    resolver: zodResolver(importFormSchema),
    defaultValues: {
      source: ImportSource.CSV,
      duplicateHandling: DuplicateHandlingStrategy.SKIP,
      validateEmails: true,
      enrichLeads: false,
      tags: '',
    },
  });

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      form.setValue('file', file);
    }
  };

  // Form submission handler
  const onSubmit = async (data: ImportFormValues) => {
    setIsSubmitting(true);

    try {
      // Process file or CSV content
      let fileContent = '';
      
      if (data.file) {
        fileContent = await readFileAsBase64(data.file);
      } else if (data.csvContent) {
        // Convert plain text to base64
        fileContent = `data:text/csv;base64,${btoa(data.csvContent)}`;
      }

      // Process tags
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

      // Prepare request data
      const importData = {
        fileContent,
        source: data.source,
        duplicateHandling: data.duplicateHandling,
        validateEmails: data.validateEmails,
        enrichLeads: data.enrichLeads,
        tags,
      };

      // Send request to API
      const response = await axios.post('/api/leads/import/csv', importData);
      
      toast.success('Import Completed', {
        description: `Successfully processed ${response.data.total} records.`,
      });

      // Reset form
      form.reset();
      setUploadedFileName(null);

      // Call success callback
      if (onSuccess) {
        onSuccess(response.data);
      }

      // Close modal
      onClose();
    } catch (error) {
      console.error('Error importing leads:', error);
      toast.error('Import Failed', {
        description: 'There was a problem importing leads. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to read file as base64
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle>Import Leads</SheetTitle>
          <SheetDescription>
            Import leads from CSV, Excel, or other sources.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Import Source</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select import source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ImportSource.CSV}>CSV File</SelectItem>
                        <SelectItem value={ImportSource.EXCEL}>Excel File</SelectItem>
                        <SelectItem value={ImportSource.LINKEDIN}>LinkedIn Export</SelectItem>
                        <SelectItem value={ImportSource.CRM}>CRM Export</SelectItem>
                        <SelectItem value={ImportSource.MANUAL}>Manual Entry</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select where you're importing leads from
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duplicateHandling"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duplicate Handling</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select how to handle duplicates" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={DuplicateHandlingStrategy.SKIP}>Skip Duplicates</SelectItem>
                        <SelectItem value={DuplicateHandlingStrategy.UPDATE}>Update Duplicates</SelectItem>
                        <SelectItem value={DuplicateHandlingStrategy.CREATE_NEW}>Create New Records</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose how to handle duplicate records
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="validateEmails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Validate Emails</FormLabel>
                        <FormDescription>
                          Check if email addresses are valid
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
                  name="enrichLeads"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Enrich Leads</FormLabel>
                        <FormDescription>
                          Add additional data from external sources
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
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="imported, batch-01, 2023-leads" {...field} />
                    </FormControl>
                    <FormDescription>
                      Comma-separated tags to add to all imported leads
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel>Upload File</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('file-upload')?.click()}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {uploadedFileName ? 'Change File' : 'Select File'}
                        </Button>
                      </div>
                    </FormControl>
                    {uploadedFileName && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {uploadedFileName}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="csvContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Or Paste CSV Content</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Paste CSV content here..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Paste your CSV content directly if you don't have a file
                    </FormDescription>
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
                  Import Leads
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
} 