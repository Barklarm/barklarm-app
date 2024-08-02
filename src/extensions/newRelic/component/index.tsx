import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export const NewRelic = ({ observable, index, updateFieldWithValue, translate }: any) => (
  <>
    <Select
      value={observable.site}
      label={translate('Site')}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateFieldWithValue('site', index, event.target.value)}
    >
      <MenuItem value={'eu.newrelic.com'}>EU</MenuItem>
      <MenuItem value={'newrelic.com'}>OTHERS</MenuItem>
    </Select>
    <TextField
      label={translate('API Key')}
      variant="outlined"
      type="password"
      value={observable.apiKey}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        updateFieldWithValue('apiKey', index, event.target.value)
      }
    />
  </>
);
