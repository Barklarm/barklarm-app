import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import { storage } from './helpers/storage';
import TextField from '@mui/material/TextField';

export const General = () => {
  const { translate } = window.electron.translations;
  const {
    getAutoupdate,
    saveAutoupdate,
    getSslDisabled,
    saveSslDisabled,
    getRefreshInterval,
    saveRefreshInterval,
    getissueGlobalEndpoint,
    saveissueGlobalEndpoint,
    getAutostart,
    saveAutostart,
    importConfig,
    exportConfig,
  } = storage(window.electron);
  const [autoupdate, setAutoupdate] = useState(getAutoupdate());
  const [sslDisabled, setsslDisabled] = useState(getSslDisabled());
  const [refreshInterval, setRefreshInterval] = useState(getRefreshInterval());
  const [issueGlobalEndpoint, setissueGlobalEndpoint] = useState(getissueGlobalEndpoint());
  const [autostart, setAutostart] = useState(getAutostart());
  return (
    <Stack>
      <Divider sx={{ my: 2 }}>{translate('General')}</Divider>
      <TextField
        label={translate('Refresh Interval (Minutes)')}
        type="number"
        variant="standard"
        value={refreshInterval / 60000}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const targetInterval: number = (event.target.value as any) * 60000;
          if (targetInterval < 60000) return;
          saveRefreshInterval(targetInterval);
          setRefreshInterval(targetInterval);
        }}
      />
      <TextField
        label={translate('issues Global Endpoint')}
        type="text"
        variant="standard"
        value={issueGlobalEndpoint}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          saveissueGlobalEndpoint(event.target.value);
          setissueGlobalEndpoint(event.target.value);
        }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={autostart}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              saveAutostart(event.target.checked);
              setAutostart(event.target.checked);
            }}
          />
        }
        label={translate('Auto Start')}
      />
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
        label={translate('Auto Update')}
      />
      <Divider sx={{ my: 2 }}>{translate('Backup')}</Divider>
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={importConfig}>
          {translate('Import')}
        </Button>
        <Button variant="contained" onClick={exportConfig}>
          {translate('Export')}
        </Button>
      </Stack>
      <Divider sx={{ my: 2 }}>{translate('Advanced')}</Divider>
      <FormControlLabel
        control={
          <Switch
            checked={sslDisabled}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              saveSslDisabled(event.target.checked);
              setsslDisabled(event.target.checked);
            }}
          />
        }
        label={translate('Disable SSL Check')}
      />
    </Stack>
  );
};
