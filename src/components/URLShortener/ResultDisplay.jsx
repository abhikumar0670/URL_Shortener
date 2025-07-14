import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Chip,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { format } from 'date-fns';

const ResultDisplay = ({ results, onClose }) => {
  const [copiedUrl, setCopiedUrl] = useState(null);

  const handleCopy = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedUrl(shortUrl);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <>
      <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5">Shortened URLs</Typography>
          <Typography variant="body2" color="text.secondary">
            Your URLs have been successfully shortened
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <List>
            {results.map((result, index) => (
              <Paper key={result.id} elevation={1} sx={{ mb: 2 }}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {result.shortUrl}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(result.shortUrl)}
                          color={copiedUrl === result.shortUrl ? 'success' : 'default'}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => window.open(result.shortUrl, '_blank')}
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Original: {result.originalUrl}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label={`Expires: ${format(new Date(result.expiresAt), 'MMM dd, yyyy HH:mm')}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={`Valid for: ${result.validity} minutes`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={!!copiedUrl}
        autoHideDuration={2000}
        onClose={() => setCopiedUrl(null)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          URL copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ResultDisplay;