import React from 'react';
import TextField from '@mui/material/TextField';

export const CCTray = ({ observable, index, updateFieldWithValue, translate }: any) => (
  <>
    <TextField
      label={translate('URL')}
      variant="standard"
      value={observable.url}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateFieldWithValue('url', index, event.target.value)}
    />
    <TextField
      label={translate('Project')}
      variant="standard"
      value={observable.name}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateFieldWithValue('name', index, event.target.value)}
    />
  </>
);
