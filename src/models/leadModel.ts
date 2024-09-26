// src/models/leadModel.ts

import { supabase } from '../config/supabaseClient'
import dayjs from 'dayjs'

export interface Lead {
  id: string;
  name: string;
  date: dayjs.Dayjs;
  source: string;
  value: number;
  status: string;
  service: string;
  country: string;
  paymentMethod: string;
  notes?: string;
}

export const insertLead = async (lead: Omit<Lead, 'id'>): Promise<Lead> => {
  console.log('Insertando lead en Supabase:', lead);
  const { data, error } = await supabase
    .from('leads')
    .insert([
      {
        name: lead.name,
        date: lead.date.format('YYYY-MM-DD'),
        source: lead.source,
        value: lead.value,
        status: lead.status,
        service: lead.service,
        country: lead.country,
        payment_method: lead.paymentMethod,
        notes: lead.notes
      }
    ])
    .select()

  if (error) {
    console.error('Error en Supabase:', error);
    console.error('Detalles del error:', error.message, error.details, error.hint);
    throw error;
  }
  
  if (!data || data.length === 0) {
    throw new Error('No se recibieron datos después de la inserción');
  }

  console.log('Lead insertado en Supabase:', data[0]);

  return {
    ...data[0],
    id: data[0].id,
    date: dayjs(data[0].date),
    value: Number(data[0].value),
    paymentMethod: data[0].payment_method
  } as Lead;
}

export const getAllLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')

  if (error) {
    console.error('Error al obtener leads de Supabase:', error);
    throw error;
  }

  if (!data) {
    return [];
  }

  return data.map(row => ({
    ...row,
    id: row.id,
    date: dayjs(row.date),
    value: Number(row.value),
    paymentMethod: row.payment_method
  }));
}

export const updateLead = async (lead: Lead): Promise<Lead> => {
  console.log('Actualizando lead en Supabase:', lead);
  const { data, error } = await supabase
    .from('leads')
    .update({
      name: lead.name,
      date: lead.date.format('YYYY-MM-DD'),
      source: lead.source,
      value: lead.value,
      status: lead.status,
      service: lead.service,
      country: lead.country,
      payment_method: lead.paymentMethod,
      notes: lead.notes
    })
    .eq('id', lead.id)
    .select()

  if (error) {
    console.error('Error al actualizar lead en Supabase:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No se recibieron datos después de la actualización');
  }

  console.log('Lead actualizado en Supabase:', data[0]);

  return {
    ...data[0],
    id: data[0].id,
    date: dayjs(data[0].date),
    value: Number(data[0].value),
    paymentMethod: data[0].payment_method
  } as Lead;
}

export const deleteLead = async (id: string): Promise<void> => {
  console.log('Eliminando lead en Supabase, ID:', id);
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error al eliminar lead en Supabase:', error);
    throw error;
  }

  console.log('Lead eliminado con éxito, ID:', id);
}