// src/utils/colors.ts

export const sourceColors = {
  'Forobeta': '#f97705', // naranja
  'Sitio Web': '#242d78', // azul claro
  'Email': '#FFB6C1', // rojo claro
  'Whatsapp': '#25D366', // verde de WhatsApp
  'Referencia': '#d85fff', // morado claro
  'Cliente Anterior': '#00008B', // azul oscuro
  'Facebook Ads': '#1877F2', // azul de Facebook
  'Redes Sociales': '#FFC0CB', // rosado
  'Otros': '#808080', // gris
};

export const serviceColors = {
  'Servicios SEO': '#242d78', // azul claro
  'Content Marketing': '#FFC0CB', // rosado
  'Automatizaciones': '#800080', // morado
  'Linkbuilding': '#000000', // negro
  'Desarrollo Web': '#008000', // verde
  'Consultoría': '#FFA500', // naranja
  'Otros': '#808080', // gris
};

export const getSourceColor = (source: string) => sourceColors[source as keyof typeof sourceColors] || '#808080';
export const getServiceColor = (service: string) => serviceColors[service as keyof typeof serviceColors] || '#808080';