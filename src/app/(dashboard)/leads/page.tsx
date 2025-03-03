'use client';

import { useState, useCallback } from 'react';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadForm } from '@/components/leads/LeadForm';
import { ImportLeadsModal } from '@/components/leads/ImportLeadsModal';
import { ExportLeadsModal } from '@/components/leads/ExportLeadsModal';
import { Lead, leadsService } from '@/lib/services/leads.service';
import { Toaster, toast } from 'sonner';

export default function LeadsPage() {
  // State for modals and selected lead
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Handle lead creation
  const handleCreateClick = () => {
    setSelectedLead(null);
    setIsCreateModalOpen(true);
  };

  // Handle modal close
  const handleCloseModals = useCallback(() => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedLead(null);
  }, []);

  // Handle lead edit
  const handleLeadClick = async (lead: Lead) => {
    try {
      setIsLoading(true);
      // Fetch full lead details
      const fullLead = await leadsService.getLead(lead.id);
      setSelectedLead(fullLead);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error fetching lead details:', error);
      toast.error("Error", {
        description: "Failed to fetch lead details. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle lead import
  const handleImportClick = () => {
    setIsImportModalOpen(true);
  };

  // Handle lead export
  const handleExportClick = () => {
    setIsExportModalOpen(true);
  };

  // Handle form success
  const handleFormSuccess = () => {
    handleCloseModals();
    // Refresh leads table by incrementing the trigger
    setRefreshTrigger(prev => prev + 1);
    toast.success(
      selectedLead ? "Lead Updated" : "Lead Created",
      {
        description: `Lead has been ${selectedLead ? 'updated' : 'created'} successfully.`
      }
    );
  };

  // Handle import success
  const handleImportSuccess = (result: { total: number; created: number; updated: number; skipped: number; errors: string[] }) => {
    setIsImportModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
    toast.success("Import Completed", {
      description: `Successfully processed ${result.total} leads: ${result.created} created, ${result.updated} updated, ${result.skipped} skipped.`
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Leads</h1>

      {/* Leads Table */}
      <LeadsTable
        onCreateClick={handleCreateClick}
        onImportClick={handleImportClick}
        onExportClick={handleExportClick}
        onLeadClick={handleLeadClick}
        refreshTrigger={refreshTrigger}
        isLoading={isLoading}
      />

      {/* Create Lead Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <LeadForm
              onSuccess={handleFormSuccess}
              onCancel={handleCloseModals}
            />
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {isEditModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <LeadForm
              lead={selectedLead}
              onSuccess={handleFormSuccess}
              onCancel={handleCloseModals}
            />
          </div>
        </div>
      )}

      {/* Import Modal */}
      <ImportLeadsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={handleImportSuccess}
      />

      {/* Export Modal */}
      <ExportLeadsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        selectedLeads={selectedLeads}
      />

      {/* Toast notifications */}
      <Toaster position="top-right" />
    </div>
  );
} 