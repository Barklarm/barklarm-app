import React from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export const Opsgenie = ({ observable, index, updateFieldWithValue, translate }: any) => (
  <>
    <Select
      value={observable.host}
      label={translate('Host')}
      variant="standard"
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateFieldWithValue('host', index, event.target.value)}
    >
      <MenuItem value={'eu.opsgenie.com'}>EU</MenuItem>
      <MenuItem value={'opsgenie.com'}>Others</MenuItem>
    </Select>
    <TextField
      label={translate('Identifier')}
      variant="standard"
      value={observable.identifier}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        updateFieldWithValue('identifier', index, event.target.value)
      }
    />
    <TextField
      label={translate('API Key')}
      variant="standard"
      type="password"
      value={observable.apiKey}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        updateFieldWithValue('apiKey', index, event.target.value)
      }
    />
  </>
);
