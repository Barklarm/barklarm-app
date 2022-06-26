import React from 'react';
import TextField from '@mui/material/TextField';

export const CCTray = ({ observable, index, updateFieldWithValue }: any) => (
  <>
    <TextField
      id="outlined-basic"
      label="url"
      variant="outlined"
      value={observable.url}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateFieldWithValue('url', index, event.target.value)}
    />
  </>
);
