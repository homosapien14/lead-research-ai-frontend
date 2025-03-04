'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TargetedICPForm } from '@/components/icp/TargetedICPForm';
import { icpService } from '@/lib/services/icp.service';

export default function NewICPPage() {
    const router = useRouter();

    const handleCancel = () => {
        router.push('/icps');
    };

    const handleSubmit = async (data: any) => {
        try {
            await icpService.createICP({
                ...data,
                type: 'targeted'
            });
            router.push('/icps');
        } catch (error) {
            console.error('Error creating ICP:', error);
            throw error;
        }
    };

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New ICP</CardTitle>
                    <CardDescription>
                        Define your ideal customer profile by specifying detailed targeting criteria.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TargetedICPForm
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </CardContent>
            </Card>
        </div>
    );
} 