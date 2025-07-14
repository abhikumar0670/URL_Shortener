import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import URLInput from './URLInput';
import ResultDisplay from './ResultDisplay';
import { validateURL, validateValidity, validateShortcode } from '../../utils/validators';
import { generateShortcode, createShortURL } from '../../utils/urlGenerator';
import storageService from '../../services/storageService';
import logger from '../../utils/logger';

const URLShortenerForm = () => {
  const [urlInputs, setUrlInputs] = useState([{
    id: Date.now(),
    url: '',
    validity: '',
    shortcode: '',
    error: null
  }]);
  
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const handleAddInput = () => {
    if (urlInputs.length < 5) {
      setUrlInputs([...urlInputs, {
        id: Date.now(),
        url: '',
        validity: '',
        shortcode: '',
        error: null
      }]);
      logger.info('Added new URL input', { count: urlInputs.length + 1 });
    }
  };

  const handleRemoveInput = (id) => {
    if (urlInputs.length > 1) {
      setUrlInputs(urlInputs.filter(input => input.id !== id));
      logger.info('Removed URL input', { id });
    }
  };

  const handleInputChange = (id, field, value) => {
    setUrlInputs(urlInputs.map(input =>
      input.id === id ? { ...input, [field]: value, error: null } : input
    ));
  };

  const validateInputs = () => {
    let isValid = true;
    const existingShortcodes = storageService.getAllShortcodes();
    
    const updatedInputs = urlInputs.map(input => {
      const errors = {};
      
      // Validate URL
      const urlValidation = validateURL(input.url);
      if (!urlValidation.isValid) {
        errors.url = urlValidation.error;
        isValid = false;
      }
      
      // Validate validity
      const validityValidation = validateValidity(input.validity);
      if (!validityValidation.isValid) {
        errors.validity = validityValidation.error;
        isValid = false;
      }
      
      // Validate shortcode
      if (input.shortcode) {
        const shortcodeValidation = validateShortcode(input.shortcode, existingShortcodes);
        if (!shortcodeValidation.isValid) {
          errors.shortcode = shortcodeValidation.error;
          isValid = false;
        }
      }
      
      return { ...input, error: Object.keys(errors).length > 0 ? errors : null };
    });
    
    setUrlInputs(updatedInputs);
    return isValid;
  };

  const handleSubmit = async () => {
    logger.info('Submitting URLs for shortening', { count: urlInputs.length });
    
    if (!validateInputs()) {
      setNotification({
        open: true,
        message: 'Please fix the errors before submitting',
        severity: 'error'
      });
      return;
    }
    
    setIsProcessing(true);
    const newResults = [];
    
    try {
      for (const input of urlInputs) {
        const validityValue = validateValidity(input.validity).value;
        const shortcode = input.shortcode || generateShortcode(storageService.getAllShortcodes());
        
        const urlData = {
          originalUrl: input.url,
          shortcode,
          validity: validityValue,
          shortUrl: createShortURL(shortcode)
        };
        
        const savedUrl = storageService.saveURL(urlData);
        newResults.push(savedUrl);
      }
      
      setResults(newResults);
      setNotification({
        open: true,
        message: `Successfully shortened ${newResults.length} URL(s)`,
        severity: 'success'
      });
      
      // Reset form
      setUrlInputs([{
        id: Date.now(),
        url: '',
        validity: '',
        shortcode: '',
        error: null
      }]);
      
      logger.info('URLs shortened successfully', { count: newResults.length });
    } catch (error) {
      logger.error('Failed to shorten URLs', error);
      setNotification({
        open: true,
        message: 'An error occurred while shortening URLs',
        severity: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Shorten Your URLs
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Enter up to 5 URLs to shorten. You can optionally specify validity period and custom shortcode.
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        {urlInputs.map((input, index) => (
          <URLInput
            key={input.id}
            input={input}
            index={index}
            onChange={handleInputChange}
            onRemove={handleRemoveInput}
            showRemove={urlInputs.length > 1}
          />
        ))}
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          {urlInputs.length < 5 && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddInput}
              disabled={isProcessing}
            >
              Add Another URL
            </Button>
          )}
          
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isProcessing || urlInputs.every(input => !input.url)}
            sx={{ ml: 'auto' }}
          >
            {isProcessing ? 'Processing...' : 'Shorten URLs'}
          </Button>
        </Box>
      </Paper>
      
      {results.length > 0 && (
        <ResultDisplay results={results} onClose={() => setResults([])} />
      )}
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default URLShortenerForm;