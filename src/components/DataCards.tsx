// src/components/DataCards.tsx

import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Lead } from '../models/leadModel';

interface DataCardsProps {
  leads: Lead[];
}

const DataCards: React.FC<DataCardsProps> = ({ leads }) => {
  const totalLeads = leads.length;
  const wonLeads = leads.filter(lead => lead.status === 'Cerrado - Ganado');
  const totalSales = wonLeads.reduce((sum, lead) => sum + lead.value, 0);
  const conversionRate = totalLeads > 0 ? (wonLeads.length / totalLeads) * 100 : 0;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', mb: 2 }}>
      <Card sx={{ minWidth: 200, m: 1, backgroundColor: '#ffe0cc' }}>
        <CardContent>
          <Typography variant="h6">Total Leads</Typography>
          <Typography variant="h4">{totalLeads}</Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 200, m: 1, backgroundColor: '#4caf50' }}>
        <CardContent>
          <Typography variant="h6">Ventas</Typography>
          <Typography variant="h4">${totalSales.toFixed(2)}</Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 200, m: 1 }}>
        <CardContent>
          <Typography variant="h6">Leads Ganados</Typography>
          <Typography variant="h4">{wonLeads.length}</Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 200, m: 1 }}>
        <CardContent>
          <Typography variant="h6">Tasa de Conversión</Typography>
          <Typography variant="h4">{conversionRate.toFixed(2)}%</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DataCards;