import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { observersComponentBuilderMap } from './helpers/observersComponentBuilderMap';
import { observersTitleBuilderMap } from './helpers/observersTitleBuilderMap';
import { ObserversParams } from '../../../types/ObserversParams';

export const Observers = ({ observables, add, remove, update }: ObserversParams) => {
  const getComponent = (observable: any, index: number, updateFieldWithValue: any): any => {
    try {
      return observersComponentBuilderMap[observable.type](observable, index, updateFieldWithValue);
    } catch (_) {
      return <></>;
    }
  };
  const getTitle = (observable: any): string => {
    try {
      return observersTitleBuilderMap[observable.type](observable);
    } catch (_) {
      return 'Unkown';
    }
  };
  return (
    <>
      {observables.map((observable: any, index: number) => (
        <Accordion key={`observable-accordion-${index}`}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography>{getTitle(observable)}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Select
                value={observable.type}
                label="Observer Type"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => update('type', index, event.target.value)}
              >
                <MenuItem value={'githubAction'}>Github Action</MenuItem>
                <MenuItem value={'ccTray'}>CCTray</MenuItem>
                <MenuItem value={'datadogMonitor'}>Datadog Monitor</MenuItem>
                <MenuItem value={'sentry'}>Sentry</MenuItem>
              </Select>
              {getComponent(observable, index, update)}
              <TextField
                id="outlined-basic"
                label="alias"
                variant="outlined"
                value={observable.alias}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => update('alias', index, event.target.value)}
              />
              <Stack spacing={2} direction="row" justifyContent="flex-end">
                <Button variant="contained" onClick={() => remove(index)}>
                  Delete
                </Button>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
      <Stack
        spacing={2}
        direction="row"
        justifyContent="flex-end"
        sx={{
          position: 'fixed',
          bottom: 50,
          right: 50,
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            window.electron.store.set('observables', observables);
            window.electron.app.refreshObservers();
          }}
        >
          Save
        </Button>
        <Button variant="contained" onClick={() => add({ type: '' })}>
          Add
        </Button>
      </Stack>
    </>
  );
};
