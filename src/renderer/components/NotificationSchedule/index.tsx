import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { NotificationConfiguration } from '../../../types/NotificationEnabled';
import TimePicker from 'react-time-picker';
import './style.css';

export const NotificationSchedule = ({ schedules, translate, updateSchedules }: any) => {
  const [localSchedule, setLocalSchedule] = useState(schedules);
  const update = (fieldName: string, index: number, value: any) => {
    console.log(value);
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
            sx={{
              flexBasis: '25%',
            }}
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
            disableClock
            clearIcon={null}
            value={`${schedule.enableTime.hour}:${schedule.enableTime.minute}`}
            onChange={(value) =>
              update('enableTime', index, { hour: Number(value.substring(0, 2)), minute: Number(value.substring(3)) })
            }
          />
          <TimePicker
            disableClock
            clearIcon={null}
            value={`${schedule.disableTime.hour}:${schedule.disableTime.minute}`}
            onChange={(value) =>
              update('disableTime', index, { hour: Number(value.substring(0, 2)), minute: Number(value.substring(3)) })
            }
          />
          <Button
            variant="contained"
            sx={{
              flexBasis: '20%',
            }}
            onClick={() =>
              setLocalSchedule(localSchedule.filter((_: any, currentIndex: number) => currentIndex != index))
            }
          >
            {translate('Delete')}
          </Button>
        </Stack>
      ))}
      <Stack spacing={2} direction="row">
        <Button
          variant="contained"
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
