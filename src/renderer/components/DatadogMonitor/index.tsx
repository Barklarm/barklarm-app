import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export const DatadogMonitor = ({ observable, index, updateFieldWithValue, translate }: any) => (
  <>
    <Select
      value={observable.site}
      label={translate('Site')}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateFieldWithValue('site', index, event.target.value)}
    >
      <MenuItem value={'datadoghq.eu'}>EU</MenuItem>
      <MenuItem value={'datadoghq.com'}>US</MenuItem>
      <MenuItem value={'us3.datadoghq.com'}>US3</MenuItem>
      <MenuItem value={'us5.datadoghq.com'}>US5</MenuItem>
      <MenuItem value={'dddog-gov.com'}>US1-FED</MenuItem>
    </Select>
    <TextField
      label={translate('Monitor ID')}
      variant="outlined"
      value={observable.monitorId}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        updateFieldWithValue('monitorId', index, event.target.value)
      }
    />
    <TextField
      label={translate('API Key')}
      variant="outlined"
      type="password"
      value={observable.apiKey}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        updateFieldWithValue('apiKey', index, event.target.value)
      }
    />
    <TextField
      label={translate('Application Key')}
      variant="outlined"
      type="password"
      value={observable.appKey}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        updateFieldWithValue('appKey', index, event.target.value)
      }
    />
  </>
);
