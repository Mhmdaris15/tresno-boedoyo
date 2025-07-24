import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { colors } from '../constants/theme';

const LoadingScreen: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: colors.background,
      }}
    >
      <CircularProgress size={60} sx={{ color: colors.primary }} />
      <Typography
        variant="h6"
        sx={{
          mt: 2,
          color: colors.text,
          fontWeight: 500,
        }}
      >
        Loading Tresno Boedoyo...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
