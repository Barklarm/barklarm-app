import * as React from 'react';
import Box from '@mui/material/Box';
import { Navigator } from './components/Navigator';
import { drawerWidth } from './themes';
import { Observers } from './pages/Observers';
import { General } from './pages/General';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

export const App = () => {
  return (
    <HashRouter>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Box component="nav" sx={{ width: drawerWidth }}>
          <Navigator PaperProps={{ style: { width: drawerWidth } }} />
        </Box>
        <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#f5eff7' }}>
          <Routes>
            <Route path="/observers" element={<Observers />} />
            <Route path="/general" element={<General />} />
            <Route path="*" element={<Navigate to="/observers" replace />} />
          </Routes>
        </Box>
      </Box>
    </HashRouter>
  );
};
