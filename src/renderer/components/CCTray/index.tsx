import React from 'react';
import TextField from '@mui/material/TextField';

export const CCTray = ({ observable, index, updateFieldWithValue }: any) => (
  <>
    <TextField
      label="url"
      variant="outlined"
      value={observable.url}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateFieldWithValue('url', index, event.target.value)}
    />
    <TextField
      label="Project Name"
      variant="outlined"
      value={observable.name}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateFieldWithValue('name', index, event.target.value)}
    />
  </>
);
