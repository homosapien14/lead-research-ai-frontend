'use client';

import { useState } from 'react';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadForm } from '@/components/leads/LeadForm';
import { ImportLeadsModal } from '@/components/leads/ImportLeadsModal';
import { ExportLeadsModal } from '@/components/leads/ExportLeadsModal';
import { Lead } from '@/types/lead';
import { Toaster } from 'sonner';

export default function LeadsPage() {
  // State for modals and selected lead
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);

  // Handle lead creation
  const handleCreateClick = () => {
    setSelectedLead(null);
    setIsCreateModalOpen(true);
  };

  // Handle lead edit
  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
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
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    // Refresh leads table
  };

  // Handle import success
  const handleImportSuccess = () => {
    // Refresh leads table
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
      />

      {/* Create Lead Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <LeadForm 
              onSuccess={handleFormSuccess}
              onCancel={() => setIsCreateModalOpen(false)}
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
              onCancel={() => setIsEditModalOpen(false)}
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