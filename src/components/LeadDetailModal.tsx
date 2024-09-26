// src/components/LeadDetailModal.tsx

import React from 'react';
import { Lead } from '../models/leadModel';
import LeadForm from './LeadForm';

interface LeadDetailModalProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedLead: Lead) => void;
  onDelete: (leadId: string) => void;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ 
  lead, 
  open, 
  onClose, 
  onUpdate, 
  onDelete 
}) => {
  if (!lead) return null;

  const handleUpdate = (updatedLead: Omit<Lead, 'id'>) => {
    onUpdate({ ...updatedLead, id: lead.id });
    onClose();
  };

  const handleDelete = (leadId: string) => {
    onDelete(leadId);
    onClose();
  };

  return (
    <LeadForm
      initialLead={lead}
      onSubmit={handleUpdate}
      onDelete={handleDelete}
      open={open}
      onClose={onClose}
      submitButtonText="Actualizar"
    />
  );
};

export default LeadDetailModal;