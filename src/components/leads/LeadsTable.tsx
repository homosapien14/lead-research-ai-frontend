'use client';

import { useState, useEffect } from 'react';
import { leadsService, Lead } from '@/lib/services/leads.service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  ChevronDown,
  MoreHorizontal,
  Plus,
  FileDown,
  FileUp,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LeadStatus } from '@/types/lead';

// Props interface for the component
interface LeadsTableProps {
  onCreateClick?: () => void;
  onImportClick?: () => void;
  onExportClick?: () => void;
  onLeadClick?: (lead: Lead) => void;
  refreshTrigger?: number;
  isLoading?: boolean;
}

export function LeadsTable({
  onCreateClick,
  onImportClick,
  onExportClick,
  onLeadClick,
  refreshTrigger = 0,
  isLoading: externalLoading = false,
}: LeadsTableProps) {
  // State hooks
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | null>(null);

  // Fetch leads from API
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await leadsService.getLeads(
        {
          page,
          limit,
          sortBy,
          sortOrder,
        },
        {
          search: searchQuery || undefined,
          status: selectedStatus || undefined,
        }
      );
      setLeads(response.items);
      setTotalLeads(response.total);
      setError(null);
    } catch (err) {
      setError('Failed to fetch leads. Please try again.');
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch leads when dependencies change
  useEffect(() => {
    fetchLeads();
  }, [page, limit, sortBy, sortOrder, searchQuery, selectedStatus, refreshTrigger]);

  // Handle sort click
  const handleSortClick = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Get status badge color
  const getStatusColor = (status: LeadStatus) => {
    const statusColors: Record<LeadStatus, string> = {
      [LeadStatus.NEW]: 'bg-blue-500',
      [LeadStatus.CONTACTED]: 'bg-purple-500',
      [LeadStatus.ENGAGED]: 'bg-green-500',
      [LeadStatus.QUALIFIED]: 'bg-emerald-500',
      [LeadStatus.PROPOSAL]: 'bg-yellow-500',
      [LeadStatus.CLOSED_WON]: 'bg-green-700',
      [LeadStatus.CLOSED_LOST]: 'bg-red-500',
      [LeadStatus.ON_HOLD]: 'bg-gray-500',
    };

    return statusColors[status] || 'bg-gray-400';
  };

  // Render the component
  return (
    <Card className="w-full">
      <CardHeader className="bg-muted/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Leads Management</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onImportClick}
            >
              <FileUp className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExportClick}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onCreateClick}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Lead
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Status
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedStatus(null)}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus(LeadStatus.NEW)}>
                  New
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus(LeadStatus.CONTACTED)}>
                  Contacted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus(LeadStatus.ENGAGED)}>
                  Engaged
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus(LeadStatus.QUALIFIED)}>
                  Qualified
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus(LeadStatus.PROPOSAL)}>
                  Proposal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus(LeadStatus.CLOSED_WON)}>
                  Closed (Won)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus(LeadStatus.CLOSED_LOST)}>
                  Closed (Lost)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus(LeadStatus.ON_HOLD)}>
                  On Hold
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fetchLeads()}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer w-[200px]"
                  onClick={() => handleSortClick('firstName')}
                >
                  Name {sortBy === 'firstName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSortClick('email')}
                >
                  Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSortClick('status')}
                >
                  Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  className="cursor-pointer text-right"
                  onClick={() => handleSortClick('engagementScore')}
                >
                  Engagement {sortBy === 'engagementScore' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(loading || externalLoading) ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                      <span>Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-red-500 py-10">
                    {error}
                  </TableCell>
                </TableRow>
              ) : leads?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    No leads found. Create or import leads to get started.
                  </TableCell>
                </TableRow>
              ) : (
                leads?.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onLeadClick?.(lead)}
                  >
                    <TableCell>
                      <div className="font-medium">{lead.firstName} {lead.lastName}</div>
                    </TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.company || '-'}</TableCell>
                    <TableCell>{lead.jobTitle || '-'}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(lead.status)} text-white`}>
                        {lead.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {lead.engagementScore !== undefined ? `${lead.engagementScore}%` : '-'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onLeadClick?.(lead);
                          }}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onLeadClick?.(lead);
                          }}>Edit Lead</DropdownMenuItem>
                          <DropdownMenuItem>Add to Campaign</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete Lead
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">
            Showing {leads?.length} of {totalLeads} leads
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page * limit >= totalLeads}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 