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
import { observersComponentBuilderMap } from '../../../extensions/observersComponentBuilderMap';
import { observersTitleBuilderMap } from '../../../extensions/observersTitleBuilderMap';
import { ObserversParams } from '../../../types/ObserversParams';
import { observersList } from '../../../extensions/observersList';

export const Observers = ({ observables, add, remove, update, save, translate }: ObserversParams) => {
  const getComponent = (observable: any, index: number, updateFieldWithValue: any): any => {
    try {
      return observersComponentBuilderMap[observable.type](observable, index, updateFieldWithValue, translate);
    } catch (_) {
      return <></>;
    }
  };
  const getTitle = (observable: any): string => {
    try {
      return observersTitleBuilderMap[observable.type](observable);
    } catch (_) {
      return translate('Unkown');
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
                {observersList.map(({ value, label }: any) => (
                  <MenuItem value={value}>{label}</MenuItem>
                ))}
              </Select>
              {getComponent(observable, index, update)}
              <TextField
                label={translate('Alias')}
                variant="outlined"
                value={observable.alias}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => update('alias', index, event.target.value)}
              />
              <Stack spacing={2} direction="row" justifyContent="flex-end">
                <Button variant="contained" onClick={() => remove(index)}>
                  {translate('Delete')}
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
        <Button variant="contained" onClick={() => save(observables)}>
          {translate('Save')}
        </Button>
        <Button variant="contained" onClick={() => add({ type: '' })}>
          {translate('Add')}
        </Button>
      </Stack>
    </>
  );
};
