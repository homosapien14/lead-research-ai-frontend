'use client';

import { useState, useEffect } from 'react';
import { ICPForm } from '@/components/icp/ICPForm';
import { ICP, ICPFormData } from '@/types/icp';
import { icpService } from '@/lib/services/icp.service';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function ICPsPage() {
    const [icps, setIcps] = useState<ICP[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedICP, setSelectedICP] = useState<ICP | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    // Fetch ICPs
    const fetchICPs = async (page: number = 1) => {
        try {
            setIsLoading(true);
            const response = await icpService.listICPs(page, itemsPerPage);
            setIcps(response.items);
            setTotalItems(response.total);
            setTotalPages(Math.ceil(response.total / itemsPerPage));
            setCurrentPage(response.page);
        } catch (error) {
            console.error('Error fetching ICPs:', error);
            toast.error('Failed to fetch ICPs');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchICPs(currentPage);
    }, [currentPage]);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle ICP creation
    const handleCreateICP = async (data: ICPFormData) => {
        try {
            await icpService.createICP(data);
            setIsCreateModalOpen(false);
            fetchICPs(currentPage);
            toast.success('ICP created successfully');
        } catch (error) {
            console.error('Error creating ICP:', error);
            toast.error('Failed to create ICP');
        }
    };

    // Handle ICP update
    const handleUpdateICP = async (data: ICPFormData) => {
        if (!selectedICP) return;

        try {
            await icpService.updateICP(selectedICP.id, data);
            setSelectedICP(null);
            fetchICPs(currentPage);
            toast.success('ICP updated successfully');
        } catch (error) {
            console.error('Error updating ICP:', error);
            toast.error('Failed to update ICP');
        }
    };

    // Handle ICP deletion
    const handleDeleteICP = async (id: string) => {
        try {
            await icpService.deleteICP(id);
            fetchICPs(currentPage);
            toast.success('ICP deleted successfully');
        } catch (error) {
            console.error('Error deleting ICP:', error);
            toast.error('Failed to delete ICP');
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Ideal Customer Profiles</h1>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create ICP
                </Button>
            </div>

            {/* ICP List */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <p>Loading ICPs...</p>
                ) : icps.length === 0 ? (
                    <p>No ICPs found. Create your first ICP to get started.</p>
                ) : (
                    icps.map((icp) => (
                        <Card key={icp.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{icp.name}</CardTitle>
                                {icp.companyOverview && (
                                    <CardDescription className="line-clamp-2">
                                        {icp.companyOverview}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {icp.valueProposition && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {icp.valueProposition}
                                        </p>
                                    )}
                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedICP(icp)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteICP(icp.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    onClick={() => handlePageChange(page)}
                                    isActive={currentPage === page}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

            {/* Create/Edit Modal */}
            {(isCreateModalOpen || selectedICP) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-background rounded-lg shadow-lg w-[90vw] max-w-5xl max-h-[90vh] overflow-y-auto">
                        <ICPForm
                            initialData={selectedICP || undefined}
                            onSubmit={selectedICP ? handleUpdateICP : handleCreateICP}
                            onCancel={() => {
                                setIsCreateModalOpen(false);
                                setSelectedICP(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
} 