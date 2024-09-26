// src/components/PeriodSelector.tsx

import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export type PeriodOption = 'Este mes' | 'Mes Pasado' | 'Ultimos 60 Días' | 'Ultimos 90 Días' | 'Este año';

interface PeriodSelectorProps {
  selectedPeriod: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ selectedPeriod, onPeriodChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Periodo</InputLabel>
      <Select
        value={selectedPeriod}
        label="Periodo"
        onChange={(e) => onPeriodChange(e.target.value as PeriodOption)}
      >
        <MenuItem value="Este mes">Este mes</MenuItem>
        <MenuItem value="Mes Pasado">Mes Pasado</MenuItem>
        <MenuItem value="Ultimos 60 Días">Últimos 60 Días</MenuItem>
        <MenuItem value="Ultimos 90 Días">Últimos 90 Días</MenuItem>
        <MenuItem value="Este año">Este año</MenuItem>
      </Select>
    </FormControl>
  );
};

export default PeriodSelector;