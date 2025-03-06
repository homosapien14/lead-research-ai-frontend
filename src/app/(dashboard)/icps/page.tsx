'use client';

import { useState, useEffect } from 'react';
import { ICPForm } from '@/components/icp/ICPForm';
import { ICP, ICPFormData } from '@/types/icpAndBrandvoice';
import { icpService } from '@/lib/services/icp.service';
import { Button } from '@/components/ui/button';
import { Plus, Users, MapPin, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { countries, ICountry } from 'countries-list';

// Helper function to format company size
const formatCompanySize = (size: string) => {
    return size.replace(/_/g, '-').replace('plus', '+');
};

// Helper function to get country flag emoji
const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

// Helper function to get full country name
const getCountryName = (countryCode: string) => {
    const code = countryCode.toUpperCase();
    return (countries as Record<string, ICountry>)[code]?.name || countryCode;
};

interface GenerationProgress {
    [icpId: string]: {
        status: string;
        progress: number;
        error?: string;
    };
}

export default function ICPsPage() {
    const [icps, setIcps] = useState<ICP[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedICP, setSelectedICP] = useState<ICP | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loadingIcpId, setLoadingIcpId] = useState<string | null>(null);
    const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({});
    const itemsPerPage = 10;

    // Fetch ICPs
    const fetchICPs = async (page: number = 1) => {
        try {
            setIsLoading(true);
            const response = await icpService.listICPs(page, itemsPerPage);
            setIcps(response.items);
            setTotalItems(response.total);
            setTotalPages(response.totalPages);
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
        if (!id) {
            toast.error('Invalid ICP ID');
            return;
        }

        toast.promise(
            new Promise((resolve, reject) => {
                toast.custom((t) => (
                    <div className="bg-background border rounded-lg shadow-lg p-4 max-w-md">
                        <h3 className="font-semibold mb-2">Delete ICP?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            This action cannot be undone. This will permanently delete this ICP and all associated data.
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                    toast.dismiss(t);
                                    reject();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={async () => {
                                    try {
                                        await icpService.deleteICP(id);
                                        toast.dismiss(t);
                                        resolve(true);
                                        fetchICPs(currentPage);
                                    } catch (error) {
                                        reject(error);
                                    }
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ), {
                    duration: Infinity,
                })
            }),
            {
                loading: 'Deleting ICP...',
                success: 'ICP deleted successfully',
                error: 'Failed to delete ICP'
            }
        );
    };

    // Handle lead generation
    const handleGenerateLeads = async (icp: ICP) => {
        try {
            setLoadingIcpId(icp._id);
            
            // Start lead generation
            const { jobId } = await icpService.generateLeads(icp._id);
            
            // Initialize progress state
            setGenerationProgress((prev) => ({
                ...prev,
                [icp._id]: {
                    status: 'processing',
                    progress: 0,
                },
            }));
            
            // Start polling for status
            const pollInterval = setInterval(async () => {
                try {
                    const status = await icpService.getLeadGenerationStatus(jobId);
                    
                    // Update progress in UI
                    setGenerationProgress((prev) => ({
                        ...prev,
                        [icp._id]: {
                            status: status.status,
                            progress: status.progress,
                            error: status.error,
                        },
                    }));

                    // Stop polling if completed or failed
                    if (['completed', 'failed'].includes(status.status)) {
                        clearInterval(pollInterval);
                        setLoadingIcpId(null);
                        
                        if (status.status === 'completed') {
                            toast.success('Lead generation completed successfully!');
                        } else if (status.status === 'failed') {
                            toast.error(`Lead generation failed: ${status.error || 'Unknown error'}`);
                        }
                    }
                } catch (error) {
                    console.error('Error polling lead generation status:', error);
                    clearInterval(pollInterval);
                    setLoadingIcpId(null);
                    toast.error('Failed to get lead generation status');
                }
            }, 2000); // Poll every 2 seconds

        } catch (error) {
            console.error('Error generating leads:', error);
            setLoadingIcpId(null);
            toast.error('Failed to start lead generation');
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <p>Loading ICPs...</p>
                ) : icps.length === 0 ? (
                    <p>No ICPs found. Create your first ICP to get started.</p>
                ) : (
                    icps.map((icp) => (
                        <Card key={icp.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-3">
                                <div className="space-y-2">
                                    {/* Title and Actions */}
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold truncate">{icp.name}</h3>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setSelectedICP(icp)}
                                            >
                                                <span className="sr-only">Edit</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                                    <path d="m15 5 4 4"/>
                                                </svg>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                onClick={() => {
                                                    if (icp?.id) {
                                                        handleDeleteICP(icp.id);
                                                    } else {
                                                        toast.error('Invalid ICP ID');
                                                    }
                                                }}
                                            >
                                                <span className="sr-only">Delete</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                                    <path d="M3 6h18"/>
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                                    <line x1="10" y1="11" x2="10" y2="17"/>
                                                    <line x1="14" y1="11" x2="14" y2="17"/>
                                                </svg>
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Industries */}
                                    <div className="flex items-start gap-2">
                                        <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                        <div className="flex flex-wrap gap-1">
                                            {icp.company_attributes?.industries_to_include?.slice(0, 2).map((industry, index) => (
                                                <span key={index} className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                    {industry}
                                                </span>
                                            ))}
                                            {icp.company_attributes?.industries_to_include?.length > 2 && (
                                                <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                                                    +{icp.company_attributes.industries_to_include.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Company Sizes */}
                                    <div className="flex items-start gap-2">
                                        <Users className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                        <div className="flex flex-wrap gap-1">
                                            {icp.company_attributes?.company_sizes?.slice(0, 2).map((size, index) => (
                                                <span key={index} className="inline-flex items-center rounded-md bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                    {formatCompanySize(size)}
                                                </span>
                                            ))}
                                            {icp.company_attributes?.company_sizes?.length > 2 && (
                                                <span className="inline-flex items-center rounded-md bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-600">
                                                    +{icp.company_attributes.company_sizes.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Locations */}
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                        <div className="flex flex-wrap gap-1">
                                            {icp.company_attributes?.geography?.countries_to_include?.slice(0, 2).map((country, index) => (
                                                <span key={index} className="inline-flex items-center rounded-md bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
                                                    {country.length === 2 && getCountryFlag(country)} {getCountryName(country)}
                                                </span>
                                            ))}
                                            {icp.company_attributes?.geography?.countries_to_include?.length > 2 && (
                                                <span className="inline-flex items-center rounded-md bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700">
                                                    +{icp.company_attributes.geography.countries_to_include.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Generate Leads Button */}
                                    <div className="pt-2">
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                            disabled={loadingIcpId === icp._id}
                                            onClick={() => handleGenerateLeads(icp)}
                                        >
                                            {loadingIcpId === icp._id ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Generating ({generationProgress[icp._id]?.progress || 0}%)
                                                </>
                                            ) : (
                                                <>
                                                    <Users className="h-4 w-4 mr-2" />
                                                    Generate Leads
                                                </>
                                            )}
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
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-hidden">
                    <div className="relative w-full max-w-5xl mt-[5vh] mx-auto px-4">
                        <div className="bg-background rounded-lg shadow-lg h-[85vh] ml-[8vw]  w-full flex flex-col">
                            <ICPForm
                                initialData={selectedICP}
                                onSubmit={selectedICP ? handleUpdateICP : handleCreateICP}
                                onCancel={() => {
                                    setIsCreateModalOpen(false);
                                    setSelectedICP(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 