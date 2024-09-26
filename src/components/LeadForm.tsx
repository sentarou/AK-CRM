// src/components/LeadForm.tsx

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Lead } from '../models/leadModel';

interface LeadFormProps {
  initialLead?: Lead;
  onSubmit: (lead: Omit<Lead, 'id'>) => void;
  onDelete?: (id: string) => void;
  open: boolean;
  onClose: () => void;
  submitButtonText?: string;
}

const LeadForm: React.FC<LeadFormProps> = ({ 
  initialLead, 
  onSubmit, 
  onDelete,
  open, 
  onClose, 
  submitButtonText = 'Guardar' 
}) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [source, setSource] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('Contacto');
  const [service, setService] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('No aplica');
  const [notes, setNotes] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (initialLead) {
      setName(initialLead.name);
      setDate(dayjs(initialLead.date));
      setSource(initialLead.source);
      setValue(initialLead.value.toString());
      setStatus(initialLead.status);
      setService(initialLead.service);
      setCountry(initialLead.country);
      setPaymentMethod(initialLead.paymentMethod);
      setNotes(initialLead.notes);
    } else {
      resetForm();
    }
  }, [initialLead, open]);

  const resetForm = () => {
    setName("");
    setDate(dayjs());
    setSource("");
    setValue("");
    setStatus("Contacto");
    setService("");
    setCountry("");
    setPaymentMethod("No aplica");
    setNotes("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newLead: Omit<Lead, 'id'> = {
      name,
      date: date || dayjs(),
      source,
      value: parseFloat(value),
      status,
      service,
      country,
      paymentMethod,
      notes
    };
    onSubmit(newLead);
    setSnackbarMessage('Lead guardado exitosamente');
    setSnackbarOpen(true);
    setTimeout(() => {
      onClose();
      resetForm();
    }, 1000);
  };

  const handleDelete = () => {
    if (initialLead && onDelete) {
      onDelete(initialLead.id);
      setSnackbarMessage('Lead eliminado exitosamente');
      setSnackbarOpen(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1000);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{initialLead ? 'Editar Lead' : 'Nuevo Lead'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
              <TextField
                label="Nombre"
                variant="outlined"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel>Fuente</InputLabel>
                <Select
                  label="Fuente"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                >
                  <MenuItem value="Forobeta">Forobeta</MenuItem>
                  <MenuItem value="Sitio Web">Sitio Web</MenuItem>
                  <MenuItem value="Email">Email</MenuItem>
                  <MenuItem value="Whatsapp">Whatsapp</MenuItem>
                  <MenuItem value="Referencia">Referencia</MenuItem>
                  <MenuItem value="Cliente Anterior">Cliente Anterior</MenuItem>
                  <MenuItem value="Facebook Ads">Facebook Ads</MenuItem>
                  <MenuItem value="Redes Sociales">Redes Sociales</MenuItem>
                  <MenuItem value="Otros">Otros</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Valor"
                variant="outlined"
                type="number"
                fullWidth
                value={value}
                onChange={(e) => setValue(e.target.value)}
                InputProps={{
                  startAdornment: <span>$</span>,
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="Contacto">Contacto</MenuItem>
                  <MenuItem value="Propuesta Enviada">Propuesta Enviada</MenuItem>
                  <MenuItem value="Reunión Pendiente">Reunión Pendiente</MenuItem>
                  <MenuItem value="Cerrado - Ganado">Cerrado - Ganado</MenuItem>
                  <MenuItem value="Cerrado - Perdido">Cerrado - Perdido</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Servicio</InputLabel>
                <Select
                  label="Servicio"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  <MenuItem value="Servicios SEO">Servicios SEO</MenuItem>
                  <MenuItem value="Content Marketing">Content Marketing</MenuItem>
                  <MenuItem value="Automatizaciones">Automatizaciones</MenuItem>
                  <MenuItem value="Linkbuilding">Linkbuilding</MenuItem>
                  <MenuItem value="Desarrollo Web">Desarrollo Web</MenuItem>
                  <MenuItem value="Consultoría">Consultoría</MenuItem>
                  <MenuItem value="Otros">Otros</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>País</InputLabel>
                <Select
                  label="País"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <MenuItem value="Argentina">Argentina</MenuItem>
                  <MenuItem value="Bolivia">Bolivia</MenuItem>
                  <MenuItem value="Brasil">Brasil</MenuItem>
                  <MenuItem value="Chile">Chile</MenuItem>
                  <MenuItem value="Colombia">Colombia</MenuItem>
                  <MenuItem value="Costa Rica">Costa Rica</MenuItem>
                  <MenuItem value="Cuba">Cuba</MenuItem>
                  <MenuItem value="Ecuador">Ecuador</MenuItem>
                  <MenuItem value="El Salvador">El Salvador</MenuItem>
                  <MenuItem value="España">España</MenuItem>
                  <MenuItem value="Estados Unidos">Estados Unidos</MenuItem>
                  <MenuItem value="Guatemala">Guatemala</MenuItem>
                  <MenuItem value="Honduras">Honduras</MenuItem>
                  <MenuItem value="México">México</MenuItem>
                  <MenuItem value="Nicaragua">Nicaragua</MenuItem>
                  <MenuItem value="Panamá">Panamá</MenuItem>
                  <MenuItem value="Paraguay">Paraguay</MenuItem>
                  <MenuItem value="Perú">Perú</MenuItem>
                  <MenuItem value="Puerto Rico">Puerto Rico</MenuItem>
                  <MenuItem value="República Dominicana">República Dominicana</MenuItem>
                  <MenuItem value="Uruguay">Uruguay</MenuItem>
                  <MenuItem value="Venezuela">Venezuela</MenuItem>
                  <MenuItem value="Otros">Otros</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Método de pago</InputLabel>
                <Select
                  label="Método de pago"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <MenuItem value="No aplica">No aplica</MenuItem>
                  <MenuItem value="Binance">Binance</MenuItem>
                  <MenuItem value="Paypal">Paypal</MenuItem>
                  <MenuItem value="Criptomonedas">Criptomonedas</MenuItem>
                  <MenuItem value="VES">VES</MenuItem>
                  <MenuItem value="Otros">Otros</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Notas"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            {initialLead && onDelete && (
              <Button onClick={handleDelete} color="error">
                Eliminar
              </Button>
            )}
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {submitButtonText}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LeadForm;