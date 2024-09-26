// src/components/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, useMediaQuery, Theme } from '@mui/material';
import dayjs from 'dayjs';
import LeadForm from './LeadForm';
import Charts from './Charts';
import DataCards from './DataCards';
import Kanban from './Kanban';
import PeriodSelector, { PeriodOption } from './PeriodSelector';
import { Lead, getAllLeads, insertLead, updateLead, deleteLead } from '../models/leadModel';

const Dashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('Este mes');
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const fetchedLeads = await getAllLeads();
        setLeads(fetchedLeads);
      } catch (error) {
        console.error('Error fetching leads:', error);
        // Aquí deberías mostrar un mensaje de error al usuario
      }
    };

    fetchLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, selectedPeriod]);

  const filterLeads = () => {
    const now = dayjs();
    let startDate;

    switch (selectedPeriod) {
      case 'Este mes':
        startDate = now.startOf('month');
        break;
      case 'Mes Pasado':
        startDate = now.subtract(1, 'month').startOf('month');
        break;
      case 'Ultimos 60 Días':
        startDate = now.subtract(60, 'day');
        break;
      case 'Ultimos 90 Días':
        startDate = now.subtract(90, 'day');
        break;
      case 'Este año':
        startDate = now.startOf('year');
        break;
      default:
        startDate = now.startOf('month');
    }

    const endDate = selectedPeriod === 'Mes Pasado' ? now.subtract(1, 'month').endOf('month') : now;

    const filtered = leads.filter(lead => {
      const leadDate = dayjs(lead.date);
      return leadDate.isAfter(startDate) && leadDate.isBefore(endDate);
    });
    setFilteredLeads(filtered);
  };

  const handlePeriodChange = (period: PeriodOption) => {
    setSelectedPeriod(period);
  };

  const handleNewLeadSubmit = async (newLead: Omit<Lead, 'id'>) => {
    try {
      const insertedLead = await insertLead(newLead);
      setLeads(prevLeads => [...prevLeads, insertedLead]);
      setIsNewLeadModalOpen(false);
    } catch (error) {
      console.error('Error al insertar nuevo lead:', error);
      // Aquí deberías mostrar un mensaje de error al usuario
    }
  };

  const handleLeadUpdate = async (updatedLead: Lead) => {
    try {
      const result = await updateLead(updatedLead);
      setLeads(prevLeads => prevLeads.map(lead => lead.id === result.id ? result : lead));
    } catch (error) {
      console.error('Error updating lead:', error);
      // Aquí podrías implementar alguna notificación de error al usuario
    }
  };

  const handleLeadDelete = async (leadId: string) => {
    try {
      await deleteLead(leadId);
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
    } catch (error) {
      console.error('Error deleting lead:', error);
      // Aquí podrías implementar alguna notificación de error al usuario
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginExpiration');
    navigate('/login');
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard CRM
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={() => setIsNewLeadModalOpen(true)}>
            Nuevo Lead
          </Button>
          <Button variant="outlined" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Box>
      </Box>
      <Box sx={{ mb: 4 }}>
        <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={handlePeriodChange} />
      </Box>
      <DataCards leads={filteredLeads} />
      <Box sx={{ mb: 4 }}>
        <Charts leads={filteredLeads} />
      </Box>
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" gutterBottom>
          Kanban de Leads
        </Typography>
        <Kanban 
          leads={filteredLeads} 
          onLeadUpdate={handleLeadUpdate}
          onLeadDelete={handleLeadDelete}
        />
      </Box>
      <LeadForm 
        open={isNewLeadModalOpen}
        onClose={() => setIsNewLeadModalOpen(false)}
        onSubmit={handleNewLeadSubmit}
      />
    </Container>
  );
};

export default Dashboard;