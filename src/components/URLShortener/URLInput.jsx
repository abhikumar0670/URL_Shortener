import React from 'react';
import {
  Box,
  TextField,
  IconButton,
  Grid,
  Typography,
  Tooltip
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const URLInput = ({ input, index, onChange, onRemove, showRemove }) => {
  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
          URL #{index + 1}
        </Typography>
        {showRemove && (
          <IconButton
            size="small"
            onClick={() => onRemove(input.id)}
            sx={{ ml: 'auto' }}
            color="error"
          >
            <RemoveCircleOutlineIcon />
          </IconButton>
        )}
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Original URL"
            placeholder="https://example.com/very-long-url-that-needs-shortening"
            value={input.url}
            onChange={(e) => onChange(input.id, 'url', e.target.value)}
            error={!!input.error?.url}
            helperText={input.error?.url}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              label="Validity (minutes)"
              placeholder="30"
              type="number"
              value={input.validity}
              onChange={(e) => onChange(input.id, 'validity', e.target.value)}
              error={!!input.error?.validity}
              helperText={input.error?.validity || 'Default: 30 minutes'}
              inputProps={{ min: 1 }}
            />
            <Tooltip title="Time until the short URL expires">
              <InfoOutlinedIcon sx={{ ml: 1, color: 'action.active' }} />
            </Tooltip>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              label="Custom Shortcode (optional)"
              placeholder="mylink"
              value={input.shortcode}
              onChange={(e) => onChange(input.id, 'shortcode', e.target.value)}
              error={!!input.error?.shortcode}
              helperText={input.error?.shortcode || 'Alphanumeric, 3-20 characters'}
            />
            <Tooltip title="Custom alias for your short URL">
              <InfoOutlinedIcon sx={{ ml: 1, color: 'action.active' }} />
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default URLInput;