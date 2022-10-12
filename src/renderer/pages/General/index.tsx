import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import { storage } from './helpers/storage';

export const General = () => {
  const { getAutoupdate, saveAutoupdate, importConfig, exportConfig } = storage(window.electron);
  const [autoupdate, setAutoupdate] = useState(getAutoupdate());
  return (
    <Stack>
      <Divider sx={{ mb: 2 }}>Update</Divider>
      <FormControlLabel
        control={
          <Switch
            checked={autoupdate}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              saveAutoupdate(event.target.checked);
              setAutoupdate(event.target.checked);
            }}
          />
        }
        label="Auto Update"
      />
      <Divider sx={{ my: 2 }}>Backup</Divider>
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={importConfig}>
          Import
        </Button>
        <Button variant="contained" onClick={exportConfig}>
          Export
        </Button>
      </Stack>
    </Stack>
  );
};
