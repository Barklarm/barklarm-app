import React, { useState } from 'react';
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
import { GithubAction } from './components/GithubAction';
import { CCTray } from './components/CCTray';
import { DatadogMonitor } from './components/DatadogMonitor';
import { MapType } from '../types/MapType';

const observersComponentBuilderMap: MapType<
  (observable: any, index: number, updateFieldWithValue: any) => JSX.Element
> = {
  githubAction: (observable: any, index: number, updateFieldWithValue: any) => (
    <GithubAction observable={observable} index={index} updateFieldWithValue={updateFieldWithValue} />
  ),
  ccTray: (observable: any, index: number, updateFieldWithValue: any) => (
    <CCTray observable={observable} index={index} updateFieldWithValue={updateFieldWithValue} />
  ),
  datadogMonitor: (observable: any, index: number, updateFieldWithValue: any) => (
    <DatadogMonitor observable={observable} index={index} updateFieldWithValue={updateFieldWithValue} />
  ),
};
const observersTitleBuilderMap: MapType<(observable: any) => string> = {
  githubAction: (observable: any) =>
    `Github: ${observable.alias || `${observable.owner}/${observable.repo}/${observable.workflowId}`}`,
  ccTray: (observable: any) => `CCTray: ${observable.alias || observable.url}`,
  datadogMonitor: (observable: any) => `Datadog: ${observable.alias || `${observable.site}/${observable.monitorId}`}`,
};
export const App = () => {
  const [observables, setObservables] = useState(window.electron.store.get('observables') || []);
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

  const deleteByIndex = (index: number) => {
    setObservables(observables.filter((_: any, currentIndex: number) => currentIndex != index));
  };
  const updateFieldWithValue = (fieldName: string, index: number, value: any) => {
    setObservables(
      observables.map((observable: any, currentIndex: number) =>
        currentIndex != index ? observable : { ...observable, [fieldName]: value }
      )
    );
  };
  return (
    <>
      <Stack spacing={2}>
        {observables.map((observable: any, index: number) => (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography>{getTitle(observable)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Select
                  value={observable.type}
                  label="Observer Type"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    updateFieldWithValue('type', index, event.target.value)
                  }
                >
                  <MenuItem value={'githubAction'}>Github Acton</MenuItem>
                  <MenuItem value={'ccTray'}>CCTray</MenuItem>
                  <MenuItem value={'datadogMonitor'}>Datadog Monitor</MenuItem>
                </Select>
                {getComponent(observable, index, updateFieldWithValue)}

                <TextField
                  id="outlined-basic"
                  label="alias"
                  variant="outlined"
                  value={observable.alias}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    updateFieldWithValue('alias', index, event.target.value)
                  }
                />
                <Stack spacing={2} direction="row" justifyContent="flex-end">
                  <Button onClick={() => deleteByIndex(index)}> Delete </Button>
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}

        <Stack spacing={2} direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={() => {
              window.electron.store.set('observables', observables);
              window.electron.app.refreshObservers();
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            onClick={() =>
              setObservables([
                ...observables,
                {
                  type: '',
                },
              ])
            }
          >
            Add
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
