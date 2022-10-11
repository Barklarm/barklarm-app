import * as React from 'react';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PublicIcon from '@mui/icons-material/Public';
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

  const navigate = useNavigate();

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem sx={{ ...item }} onClick={() => navigate('/')}>
          <ListItemIcon>
            <PublicIcon />
          </ListItemIcon>
          <ListItemText>Projects</ListItemText>
        </ListItem>
        <ListItem sx={{ ...item }} onClick={() => navigate('/general')}>
          <ListItemIcon>
            <PublicIcon />
          </ListItemIcon>
          <ListItemText>General</ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
};
