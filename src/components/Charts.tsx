// src/components/Charts.tsx

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Box, Paper, Typography, useMediaQuery, Theme } from '@mui/material';
import { Lead } from '../models/leadModel';
import { sourceColors, serviceColors } from '../utils/colors';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface ChartsProps {
  leads: Lead[];
}

const Charts: React.FC<ChartsProps> = ({ leads }) => {
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const countOccurrences = (arr: string[]) => {
    return arr.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const calculatePercentages = (data: Record<string, number>) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, (value / total) * 100])
    );
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        enabled: false
      },
    },
    layout: {
      padding: 20
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const createPieChartData = (data: Record<string, number>, colorMap: Record<string, string>) => {
    const percentages = calculatePercentages(data);
    return {
      labels: Object.keys(data),
      datasets: [
        {
          data: Object.values(percentages),
          backgroundColor: Object.keys(data).map(key => colorMap[key as keyof typeof colorMap] || '#808080'),
        },
      ],
    };
  };

  const sourcesData = countOccurrences(leads.map(lead => lead.source));
  const sourcesChartData = createPieChartData(sourcesData, sourceColors);

  const servicesData = countOccurrences(leads.map(lead => lead.service));
  const servicesChartData = createPieChartData(servicesData, serviceColors);

  const statusData = countOccurrences(leads.map(lead => lead.status));
  const statusChartData = {
    labels: Object.keys(statusData),
    datasets: [
      {
        label: 'Estado de Leads',
        data: Object.values(statusData),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const PieChartWithPercentages = ({ data }: { data: any }) => {
    return (
      <Pie
        data={data}
        options={{
          ...pieOptions,
          plugins: {
            ...pieOptions.plugins,
            datalabels: {
              formatter: (value: number) => {
                return value.toFixed(1) + '%';
              },
              color: '#fff',
              font: {
                weight: 'bold',
                size: 12,
              },
            },
          },
        }}
        plugins={[{
          id: 'datalabels',
          afterDatasetsDraw(chart) {
            const { ctx, data } = chart;
            chart.data.datasets.forEach((dataset, datasetIndex) => {
              const meta = chart.getDatasetMeta(datasetIndex);
              if (!meta.hidden) {
                meta.data.forEach((element, index) => {
                  const { x, y } = element.tooltipPosition();
                  ctx.fillStyle = 'white';
                  ctx.font = '12px Arial';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  const text = dataset.data[index].toFixed(1) + '%';
                  ctx.fillText(text, x, y);
                });
              }
            });
          }
        }]}
      />
    );
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between', 
      alignItems: 'center',
      gap: 2,
      mb: 4 
    }}>
      <Paper sx={{ width: { xs: '100%', sm: '30%' }, p: 2, height: '250px' }}>
        <Typography variant="h6" align="center">Fuentes de Leads</Typography>
        <Box sx={{ height: '220px' }}>
          <PieChartWithPercentages data={sourcesChartData} />
        </Box>
      </Paper>
      <Paper sx={{ width: { xs: '100%', sm: '30%' }, p: 2, height: '250px' }}>
        <Typography variant="h6" align="center">Servicios</Typography>
        <Box sx={{ height: '220px' }}>
          <PieChartWithPercentages data={servicesChartData} />
        </Box>
      </Paper>
      <Paper sx={{ width: { xs: '100%', sm: '30%' }, p: 2, height: '250px' }}>
        <Typography variant="h6" align="center">Estado de Leads</Typography>
        <Box sx={{ height: '220px' }}>
          <Bar data={statusChartData} options={barOptions} />
        </Box>
      </Paper>
    </Box>
  );
};

export default Charts;