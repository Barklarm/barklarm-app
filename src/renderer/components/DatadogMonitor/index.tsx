import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export const DatadogMonitor = ({ observable, index, updateFieldWithValue }: any) => (
  <>
    <Select
      value={observable.site}
      label="Site"
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateFieldWithValue('site', index, event.target.value)}
    >
      <MenuItem value={'datadoghq.eu'}>EU</MenuItem>
      <MenuItem value={'datadoghq.com'}>US</MenuItem>
      <MenuItem value={'us3.datadoghq.com'}>US3</MenuItem>
      <MenuItem value={'us5.datadoghq.com'}>US3</MenuItem>
      <MenuItem value={'dddog-gov.com'}>US1-FED</MenuItem>
    </Select>
    <TextField
      label="Monitor ID"
      variant="outlined"
      value={observable.monitorId}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        updateFieldWithValue('monitorId', index, event.target.value)
      }
    />
    <TextField
      label="Api Key"
      variant="outlined"
      type="password"
      value={observable.apiKey}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        updateFieldWithValue('apiKey', index, event.target.value)
      }
    />
    <TextField
      label="App Key"
      variant="outlined"
      type="password"
      value={observable.appKey}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        updateFieldWithValue('appKey', index, event.target.value)
      }
    />
  </>
);
