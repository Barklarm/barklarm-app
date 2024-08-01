import React from 'react';
import TextField from '@mui/material/TextField';

export const Grafana = ({ observable, index, updateFieldWithValue, translate }: any) => (
  <>
    <TextField
      label={translate('URL')}
      variant="outlined"
      value={observable.url}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateFieldWithValue('url', index, event.target.value)}
    />
    <TextField
      label={translate('Authorization Token')}
      variant="outlined"
      type="password"
      value={observable.authToken}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        updateFieldWithValue('authToken', index, event.target.value)
      }
    />
  </>
);
