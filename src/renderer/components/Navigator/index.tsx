import * as React from 'react';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ApiIcon from '@mui/icons-material/Api';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

const item = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

export const Navigator = (props: DrawerProps) => {
  const { ...other } = props;
  const { translate } = window.electron.translations;
  const navigate = useNavigate();

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem sx={{ ...item }} onClick={() => navigate('/')}>
          <ListItemIcon>
            <ApiIcon />
          </ListItemIcon>
          <ListItemText>{translate('Projects')}</ListItemText>
        </ListItem>
        <ListItem sx={{ ...item }} onClick={() => navigate('/general')}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText>{translate('General')}</ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
};
