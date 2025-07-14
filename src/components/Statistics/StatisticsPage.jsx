import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

import URLStatCard from './URLStatCard';
import storageService from '../../services/storageService';
import logger from '../../utils/logger';

const StatisticsPage = () => {
  const [urls, setUrls] = useState([]);
  const [filteredUrls, setFilteredUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadURLs();
    const interval = setInterval(loadURLs, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterURLs();
  }, [urls, searchTerm, filterStatus]);

  const loadURLs = () => {
    logger.info('Loading URLs for statistics');
    const storedUrls = storageService.getURLs();
    setUrls(storedUrls);
  };

  const filterURLs = () => {
    let filtered = [...urls];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(url =>
        url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.shortcode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    const now = new Date();
    if (filterStatus === 'active') {
      filtered = filtered.filter(url => new Date(url.expiresAt) > now);
    } else if (filterStatus === 'expired') {
      filtered = filtered.filter(url => new Date(url.expiresAt) <= now);
    }

    setFilteredUrls(filtered);
  };

  const stats = {
    total: urls.length,
    active: urls.filter(url => new Date(url.expiresAt) > new Date()).length,
    expired: urls.filter(url => new Date(url.expiresAt) <= new Date()).length,
    totalClicks: urls.reduce((sum, url) => sum + (url.clicks || 0), 0)
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          URL Statistics
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
              <Typography variant="h6">{stats.total}</Typography>
              <Typography variant="body2">Total URLs</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
              <Typography variant="h6">{stats.active}</Typography>
              <Typography variant="body2">Active</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
              <Typography variant="h6">{stats.expired}</Typography>
              <Typography variant="body2">Expired</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
              <Typography variant="h6">{stats.totalClicks}</Typography>
              <Typography variant="body2">Total Clicks</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search by URL or shortcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, minWidth: 300 }}
          />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label="All"
              onClick={() => setFilterStatus('all')}
              color={filterStatus === 'all' ? 'primary' : 'default'}
              variant={filterStatus === 'all' ? 'filled' : 'outlined'}
            />
            <Chip
              label="Active"
              onClick={() => setFilterStatus('active')}
              color={filterStatus === 'active' ? 'success' : 'default'}
              variant={filterStatus === 'active' ? 'filled' : 'outlined'}
            />
            <Chip
              label="Expired"
              onClick={() => setFilterStatus('expired')}
              color={filterStatus === 'expired' ? 'error' : 'default'}
              variant={filterStatus === 'expired' ? 'filled' : 'outlined'}
            />
          </Box>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="grid">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Paper>

      {filteredUrls.length === 0 ? (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No URLs found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Try adjusting your search criteria' : 'Start by shortening some URLs'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={viewMode === 'grid' ? 3 : 0}>
          {filteredUrls.map((url) => (
            <Grid item key={url.id} xs={12} md={viewMode === 'grid' ? 6 : 12}>
              <URLStatCard url={url} viewMode={viewMode} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default StatisticsPage;