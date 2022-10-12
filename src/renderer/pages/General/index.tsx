import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { storage } from './helpers/storage';

export const General = () => {
  const { getAutoupdate, saveAutoupdate } = storage(window.electron);
  const [autoupdate, setAutoupdate] = useState(getAutoupdate());
  return (
    <Stack>
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
    </Stack>
  );
};
