import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import { format } from 'date-fns';

const ClickDetails = ({ clicks }) => {
  if (clicks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body2" color="text.secondary">
          No clicks recorded yet
        </Typography>
      </Box>
    );
  }

  // Group clicks by source
  const clicksBySource = clicks.reduce((acc, click) => {
    acc[click.source] = (acc[click.source] || 0) + 1;
    return acc;
  }, {});

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Click Analytics
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Traffic Sources
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {Object.entries(clicksBySource).map(([source, count]) => (
            <Chip
              key={source}
              label={`${source}: ${count}`}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Recent Clicks
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clicks.slice(-10).reverse().map((click, index) => (
              <TableRow key={index}>
                <TableCell>
                  {format(new Date(click.timestamp), 'MMM dd, HH:mm:ss')}
                </TableCell>
                <TableCell>{click.source}</TableCell>
                <TableCell>{click.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ClickDetails;