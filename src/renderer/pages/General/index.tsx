import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import { storage } from './helpers/storage';
import { NotificationSchedule } from '../../components/NotificationSchedule';

export const General = () => {
  const { translate } = window.electron.translations;
  const {
    getAutoupdate,
    saveAutoupdate,
    getSslDisabled,
    saveSslDisabled,
    getAutostart,
    saveAutostart,
    getNotificationSchedule,
    saveNotificationSchedule,
    importConfig,
    exportConfig,
  } = storage(window.electron);
  const [autoupdate, setAutoupdate] = useState(getAutoupdate());
  const [sslDisabled, setsslDisabled] = useState(getSslDisabled());
  const [autostart, setAutostart] = useState(getAutostart());
  const [notificationSchedule, setNotificationSchedule] = useState(getNotificationSchedule());
  const updateNotificationSchedule = (notificationSchedule: any) => {
    saveNotificationSchedule(notificationSchedule);
    setNotificationSchedule(notificationSchedule);
  };
  return (
    <Stack>
      <Divider sx={{ mb: 2 }}>{translate('Update')}</Divider>
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
      <Divider sx={{ my: 2 }}>{translate('Notification Enabled Schedule')}</Divider>
      <NotificationSchedule
        schedules={notificationSchedule}
        translate={translate}
        updateSchedules={updateNotificationSchedule}
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
