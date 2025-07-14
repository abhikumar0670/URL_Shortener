import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  Button,
  Divider,
  Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MouseIcon from '@mui/icons-material/Mouse';
import { format, formatDistanceToNow } from 'date-fns';

import ClickDetails from './ClickDetails';
import storageService from '../../services/storageService';

const URLStatCard = ({ url, viewMode }) => {
  const [expanded, setExpanded] = useState(false);
  const [clickDetails, setClickDetails] = useState([]);

  const isExpired = new Date(url.expiresAt) <= new Date();

  const handleExpandClick = () => {
    if (!expanded) {
      const analytics = storageService.getURLAnalytics(url.shortcode);
      setClickDetails(analytics);
    }
    setExpanded(!expanded);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url.shortUrl);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Card elevation={viewMode === 'list' ? 0 : 2} sx={{ mb: viewMode === 'list' ? 1 : 0 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Link
                href={url.shortUrl}
                target="_blank"
                rel="noopener"
                sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                underline="hover"
              >
                {url.shortUrl}
              </Link>
              <IconButton size="small" onClick={handleCopy}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" href={url.shortUrl} target="_blank">
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {url.originalUrl}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<AccessTimeIcon />}
                label={isExpired ? 'Expired' : `Expires ${formatDistanceToNow(new Date(url.expiresAt), { addSuffix: true })}`}
                size="small"
                color={isExpired ? 'error' : 'success'}
                variant={isExpired ? 'filled' : 'outlined'}
              />
              <Chip
                icon={<MouseIcon />}
                label={`${url.clicks || 0} clicks`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`Created ${format(new Date(url.createdAt), 'MMM dd, HH:mm')}`}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>

          <IconButton
            onClick={handleExpandClick}
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: '0.3s'
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2 }} />
          <ClickDetails clicks={clickDetails} />
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default URLStatCard;