import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { NotificationConfiguration } from '../../../types/NotificationEnabled';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import './style.css';
import { DateTime } from 'luxon';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const NotificationSchedule = ({ schedules, translate, updateSchedules }: any) => {
  const [localSchedule, setLocalSchedule] = useState(schedules);
  const update = (fieldName: string, index: number, value: any) => {
    setLocalSchedule(
      localSchedule.map((schedule: NotificationConfiguration, currentIndex: number) =>
        currentIndex != index ? schedule : { ...schedule, [fieldName]: value }
      )
    );
  };
  return (
    <>
      {localSchedule.map((schedule: NotificationConfiguration, index: number) => (
        <Stack
          spacing={1}
          justifyContent="space-between"
          direction="row"
          margin={'1rem 0'}
          key={`notification-schedule-${index}`}
        >
          <Select
            sx={{ width: 170 }}
            variant="standard"
            value={schedule.weekday}
            label={translate('Weekday')}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => update('weekday', index, event.target.value)}
          >
            <MenuItem value={1}>{translate('Monday')}</MenuItem>
            <MenuItem value={2}>{translate('Tuesday')}</MenuItem>
            <MenuItem value={3}>{translate('Wednesday')}</MenuItem>
            <MenuItem value={4}>{translate('Thursday')}</MenuItem>
            <MenuItem value={5}>{translate('Friday')}</MenuItem>
            <MenuItem value={6}>{translate('Saturday')}</MenuItem>
            <MenuItem value={0}>{translate('Sunday')}</MenuItem>
          </Select>
          <TimePicker
            sx={{ width: 170 }}
            slotProps={{ textField: { variant: 'standard' } }}
            value={DateTime.fromObject({ hour: schedule.enableTime.hour, minute: schedule.enableTime.minute })}
            onChange={(value) => update('enableTime', index, { hour: value.hour, minute: value.minute })}
          />
          <TimePicker
            sx={{ width: 170 }}
            slotProps={{ textField: { variant: 'standard' } }}
            value={DateTime.fromObject({ hour: schedule.disableTime.hour, minute: schedule.disableTime.minute })}
            onChange={(value) => update('disableTime', index, { hour: value.hour, minute: value.minute })}
          />
          <IconButton
            size="small"
            sx={{ padding: '0.15rem' }}
            onClick={() =>
              setLocalSchedule(localSchedule.filter((_: any, currentIndex: number) => currentIndex != index))
            }
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ))}
      <Stack spacing={2} direction="row">
        <Button
          onClick={() =>
            setLocalSchedule([
              ...localSchedule,
              { weekday: 0, enableTime: { hour: 0, minute: 0 }, disableTime: { hour: 23, minute: 59 } },
            ])
          }
          sx={{
            flexBasis: '50%',
          }}
        >
          {translate('Add')}
        </Button>
        <Button
          variant="contained"
          sx={{
            flexBasis: '50%',
          }}
          onClick={() => updateSchedules(localSchedule)}
        >
          {translate('Save')}
        </Button>
      </Stack>
    </>
  );
};
