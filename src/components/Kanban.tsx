// src/components/Kanban.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { Box, Paper, Typography, useMediaQuery, Theme, Chip, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Lead } from '../models/leadModel';
import LeadDetailModal from './LeadDetailModal';
import { getSourceColor, getServiceColor } from '../utils/colors';

interface KanbanProps {
  leads: Lead[];
  onLeadUpdate: (updatedLead: Lead) => void;
  onLeadDelete: (leadId: string) => void;
}

interface CardProps {
  lead: Lead;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onClick: (lead: Lead) => void;
}

const columnColors = {
  'Contacto': '#ffe0cc',
  'Propuesta Enviada': '#6dcdd0',
  'Reunión Pendiente': '#ffac33',
  'Cerrado - Ganado': '#4caf50',
  'Cerrado - Perdido': '#8e1515',
};

const LeadCard: React.FC<CardProps> = ({ lead, index, moveCard, onClick }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { index, id: lead.id, status: lead.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'CARD',
    hover(item: { index: number, id: string, status: string }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <Paper
      ref={ref}
      onClick={() => onClick(lead)}
      sx={{
        p: 2,
        my: 1,
        backgroundColor: 'white',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        wordBreak: 'break-word',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <PersonIcon sx={{ mr: 1, fontSize: 34 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{lead.name}</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 0.5, mb: 1 }}>
        <Chip 
          label={lead.source} 
          size="small" 
          sx={{ 
            backgroundColor: getSourceColor(lead.source),
            color: 'white',
            height: 26,
            '& .MuiChip-label': {
              fontSize: '0.625rem',
              padding: '0 6px',
            }
          }}
        />
        <Chip 
          label={lead.service} 
          size="small"
          sx={{ 
            backgroundColor: getServiceColor(lead.service),
            color: 'white',
            height: 26,
            '& .MuiChip-label': {
              fontSize: '0.625rem',
              padding: '0 6px',
            }
          }}
        />
      </Box>
      <Avatar
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          bgcolor: 'success.light',
          width: 38,
          height: 38,
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'black' }}>
          ${lead.value}
        </Typography>
      </Avatar>
    </Paper>
  );
};

const Column: React.FC<{ 
  title: string; 
  status: string; 
  leads: Lead[]; 
  onMoveCard: (dragIndex: number, hoverIndex: number, status: string) => void;
  onDropCard: (item: { id: string, status: string }, status: string) => void;
  onClick: (lead: Lead) => void;
}> = ({
  title,
  status,
  leads,
  onMoveCard,
  onDropCard,
  onClick,
}) => {
  const [, drop] = useDrop({
    accept: 'CARD',
    drop(item: { id: string, status: string }) {
      onDropCard(item, status);
    },
  });

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    onMoveCard(dragIndex, hoverIndex, status);
  }, [onMoveCard, status]);

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minWidth: 250,
    }}>
      <Paper sx={{ 
        p: 1,
        backgroundColor: columnColors[status as keyof typeof columnColors],
        mb: 1,
      }}>
        <Typography variant="h6" noWrap>{title}</Typography>
      </Paper>
      <Box 
        ref={drop} 
        sx={{ 
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          p: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,0.1)'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '4px'
          }
        }}
      >
        {leads
          .filter((lead) => lead.status === status)
          .map((lead, index) => (
            <LeadCard 
              key={lead.id} 
              lead={lead} 
              index={index}
              moveCard={moveCard}
              onClick={onClick} 
            />
          ))}
      </Box>
    </Box>
  );
};

const Kanban: React.FC<KanbanProps> = ({ leads, onLeadUpdate, onLeadDelete }) => {
  const [leadsState, setLeadsState] = useState<Lead[]>(leads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  useEffect(() => {
    setLeadsState(leads);
  }, [leads]);

  const columns = [
    { id: 'Contacto', title: 'Contacto' },
    { id: 'Propuesta Enviada', title: 'Propuesta Enviada' },
    { id: 'Reunión Pendiente', title: 'Reunión Pendiente' },
    { id: 'Cerrado - Ganado', title: 'Cerrado - Ganado' },
    { id: 'Cerrado - Perdido', title: 'Cerrado - Perdido' },
  ];

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const moveCard = useCallback((dragIndex: number, hoverIndex: number, status: string) => {
    setLeadsState((prevLeads) => {
      const statusLeads = prevLeads.filter(lead => lead.status === status);
      const updatedStatusLeads = update(statusLeads, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, statusLeads[dragIndex]],
        ],
      });
      return prevLeads.map(lead => 
        lead.status === status ? updatedStatusLeads[prevLeads.findIndex(l => l.id === lead.id)] : lead
      );
    });
  }, []);

  const sendWebhook = async (lead: Lead) => {
    const webhookUrl = 'https://hook.us1.make.com/pecjvl1doev0lwynzxnwrjt06j1ppeqp';
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Webhook sent successfully');
    } catch (error) {
      console.error('Error sending webhook:', error);
    }
  };

  const handleDropCard = useCallback((item: { id: string, status: string }, newStatus: string) => {
    setLeadsState(prevLeads => {
      const updatedLeads = prevLeads.map(lead => 
        lead.id === item.id ? { ...lead, status: newStatus } : lead
      );
      const updatedLead = updatedLeads.find(lead => lead.id === item.id);
      if (updatedLead) {
        onLeadUpdate(updatedLead);
        if (newStatus === 'Reunión Pendiente' || newStatus === 'Propuesta Enviada') {
          sendWebhook(updatedLead);
        }
      }
      return updatedLeads;
    });
  }, [onLeadUpdate]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row',
        gap: 2,
        height: isSmallScreen ? 'auto' : 'calc(100vh - 80px)', // Ajusta este valor según sea necesario
        maxHeight: '800px', // Ajusta este valor según sea necesario
        overflowX: isSmallScreen ? 'hidden' : 'auto',
        overflowY: 'hidden',
      }}>
        {columns.map((column) => (
          <Column
            key={column.id}
            title={column.title}
            status={column.id}
            leads={leadsState}
            onMoveCard={moveCard}
            onDropCard={handleDropCard}
            onClick={handleLeadClick}
          />
        ))}
      </Box>
      <LeadDetailModal
        lead={selectedLead}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={onLeadUpdate}
        onDelete={onLeadDelete}
      />
    </DndProvider>
  );
};

export default Kanban;