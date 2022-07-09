import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { Navigator } from './components/Navigator';
import { Observers } from './components/Observers';
import './app.css';
import theme, { drawerWidth } from './theme';

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Box component="nav" sx={{ width: drawerWidth }}>
          <Navigator PaperProps={{ style: { width: drawerWidth } }} />
        </Box>
        <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#f5eff7' }}>
          <Observers />
        </Box>
      </Box>
    </ThemeProvider>
  );
};
