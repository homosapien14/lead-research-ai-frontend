'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ICPForm } from '@/components/icp/ICPForm';
import { icpService } from '@/lib/services/icp.service';
import { toast } from 'sonner';
import { ICP } from '@/types/icp';

export default function BrandVoicePage() {
    const router = useRouter();
    const [brandVoice, setBrandVoice] = useState<ICP | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadBrandVoice = async () => {
            try {
                const data = await icpService.getBrandVoice();
                setBrandVoice(data);
            } catch (error) {
                console.error('Error loading brand voice settings:', error);
                toast.error('Failed to load brand voice settings');
            } finally {
                setIsLoading(false);
            }
        };

        loadBrandVoice();
    }, []);

    const handleSubmit = async (data: any) => {
        try {
            if (brandVoice) {
                await icpService.updateICP(brandVoice.id, {
                    ...data,
                    type: 'brand_voice'
                });
            } else {
                await icpService.createICP({
                    ...data,
                    type: 'brand_voice'
                });
            }
            toast.success('Brand voice settings saved successfully!');
            router.push('/settings');
        } catch (error) {
            console.error('Error saving brand voice settings:', error);
            toast.error('Failed to save brand voice settings');
            throw error;
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center">
                            Loading brand voice settings...
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Brand Voice Settings</CardTitle>
                    <CardDescription>
                        Define your brand voice and messaging to ensure consistent communication across all generated content.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ICPForm
                        initialData={brandVoice || undefined}
                        onSubmit={handleSubmit}
                    />
                </CardContent>
            </Card>
        </div>
    );
} 