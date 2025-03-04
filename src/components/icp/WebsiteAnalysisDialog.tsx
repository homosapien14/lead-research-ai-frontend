import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface WebsiteAnalysisDialogProps {
    open: boolean;
    onClose: () => void;
    currentContent: {
        companyName?: string;
        customerPainPoints?: string;
        valueProposition?: string;
        companyOverview?: string;
        callToAction?: string;
        additionalContext?: string;
        primaryCompetitors?: string;
        productDifferentiators?: string;
    };
    newContent: {
        companyName?: string;
        customerPainPoints?: string;
        valueProposition?: string;
        companyOverview?: string;
        callToAction?: string;
        additionalContext?: string;
        primaryCompetitors?: string;
        productDifferentiators?: string;
    };
    onApply: (selectedFields: string[]) => void;
}

export function WebsiteAnalysisDialog({
    open,
    onClose,
    currentContent,
    newContent,
    onApply,
}: WebsiteAnalysisDialogProps) {
    const [selectedFields, setSelectedFields] = React.useState<string[]>([]);

    // Reset selected fields when dialog opens
    React.useEffect(() => {
        if (open) {
            setSelectedFields([]);
        }
    }, [open]);

    const fields = [
        {
            key: 'companyName',
            label: 'Company or product name',
            current: currentContent.companyName,
            new: newContent.companyName,
        },
        {
            key: 'customerPainPoints',
            label: 'Customer pain points',
            current: currentContent.customerPainPoints,
            new: newContent.customerPainPoints,
        },
        {
            key: 'valueProposition',
            label: 'Value proposition',
            current: currentContent.valueProposition,
            new: newContent.valueProposition,
        },
        {
            key: 'companyOverview',
            label: 'Company overview',
            current: currentContent.companyOverview,
            new: newContent.companyOverview,
        },
        {
            key: 'callToAction',
            label: 'Call-to-action',
            current: currentContent.callToAction,
            new: newContent.callToAction,
        },
        {
            key: 'additionalContext',
            label: 'Additional context',
            current: currentContent.additionalContext,
            new: newContent.additionalContext,
        },
        {
            key: 'primaryCompetitors',
            label: 'Primary competitors',
            current: currentContent.primaryCompetitors,
            new: newContent.primaryCompetitors,
        },
        {
            key: 'productDifferentiators',
            label: 'Product differentiators',
            current: currentContent.productDifferentiators,
            new: newContent.productDifferentiators,
        },
    ].filter(field => field.new); // Only show fields that have new content

    const handleApply = () => {
        if (selectedFields.length === 0) {
            return;
        }
        onApply(selectedFields);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Review information</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-auto">
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Review the details from the provided URL and choose what content to replace.
                        </p>
                        <table className="w-full">
                            <thead className="sticky top-0 bg-background">
                                <tr>
                                    <th className="text-left font-medium text-sm py-2">Field</th>
                                    <th className="text-left font-medium text-sm py-2">New content</th>
                                    <th className="text-center font-medium text-sm w-20 py-2">Replace</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields.map((field) => (
                                    <tr key={field.key} className="border-t">
                                        <td className="py-3 align-top">
                                            <span className="text-sm font-medium">
                                                {field.label}
                                            </span>
                                        </td>
                                        <td className="py-3 align-top">
                                            <span className="text-sm whitespace-pre-wrap">
                                                {field.new}
                                            </span>
                                        </td>
                                        <td className="py-3 text-center align-top">
                                            <Checkbox
                                                checked={selectedFields.includes(field.key)}
                                                onCheckedChange={(checked) => {
                                                    setSelectedFields(
                                                        checked
                                                            ? [...selectedFields, field.key]
                                                            : selectedFields.filter((f) => f !== field.key)
                                                    );
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApply}
                        disabled={selectedFields.length === 0}
                    >
                        Replace
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 