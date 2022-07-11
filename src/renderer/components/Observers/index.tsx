import React, { useRef, useState } from 'react';
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
import { GithubAction } from '../GithubAction';
import { CCTray } from '../CCTray';
import { DatadogMonitor } from '../DatadogMonitor';
import { Sentry } from '../Sentry';
import { MapType } from '../../../types/MapType';
import Box from '@mui/material/Box';
import LinkIcon from '@mui/icons-material/Link';
import Backdrop from '@mui/material/Backdrop';

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
  sentry: (observable: any, index: number, updateFieldWithValue: any) => (
    <Sentry observable={observable} index={index} updateFieldWithValue={updateFieldWithValue} />
  ),
};
const observersTitleBuilderMap: MapType<(observable: any) => string> = {
  githubAction: (observable: any) =>
    `Github: ${observable.alias || `${observable.owner}/${observable.repo}/${observable.workflowId}`}`,
  ccTray: (observable: any) => `CCTray: ${observable.alias || observable.name || observable.url}`,
  datadogMonitor: (observable: any) => `Datadog: ${observable.alias || `${observable.site}/${observable.monitorId}`}`,
  sentry: (observable: any) => `Sentry: ${observable.alias || `${observable.organization}/${observable.project}`}`,
};
type strategy = {
  canApply: (text: string) => boolean;
  apply: (text: string) => any;
};
const githubRegex = /https:\/\/github.com\/(.+)\/(.+)\/actions\/workflows\/(.+)/;
const ccTrayRegex = /cc.xml/;
const datadogRegex = /https:\/\/app.(.*datadog.*)\/monitors\/(.+)/;
const sentryRegex = /https:\/\/sentry.io\/organizations\/(.+)\/projects\/(.+)\//;

const observersfromLinkParser: strategy[] = [
  {
    canApply: (text: string) => githubRegex.test(text),
    apply: (text: string) => {
      const match = text.match(githubRegex);
      return {
        type: 'githubAction',
        owner: match[1],
        repo: match[2],
        workflowId: match[3],
      };
    },
  },
  {
    canApply: (text: string) => ccTrayRegex.test(text),
    apply: (text: string) => ({
      type: 'ccTray',
      url: text,
    }),
  },
  {
    canApply: (text: string) => datadogRegex.test(text),
    apply: (text: string) => {
      const match = text.match(datadogRegex);
      return {
        type: 'datadogMonitor',
        site: match[1],
        monitorId: match[2],
      };
    },
  },
  {
    canApply: (text: string) => sentryRegex.test(text),
    apply: (text: string) => {
      const match = text.match(sentryRegex);
      return {
        type: 'sentry',
        organization: match[1],
        project: match[2],
      };
    },
  },
];
export const Observers = () => {
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
  const [isDrag, setIsDrag] = useState(false);
  const onDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDrag(true);
  };
  const onDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDrag(false);
  };
  const onDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDrag(false);
    const dataTrasfer: DataTransfer = e.dataTransfer;
    if (!dataTrasfer.types.some((type: string) => type.includes('text'))) return;
    const text = dataTrasfer.getData('Text');
    observersfromLinkParser.forEach((parser) => {
      console.log(parser.canApply(text));
      if (!parser.canApply(text)) return;
      setObservables([...observables, parser.apply(text)]);
    });

    console.log(text);
  };
  return (
    <>
      {isDrag ? (
        <Backdrop
          sx={(theme) => ({
            zIndex: theme.zIndex.drawer + 1,
            bgColor: theme.palette.primary.dark,
            color: theme.palette.primary.light,
          })}
          open={isDrag}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDragLeave={onDragLeave}
        >
          <Box
            sx={{
              height: '100vh',
              width: '100vw',
              display: 'flex',
              flexFlow: 'column',
            }}
          >
            <div
              style={{
                flex: '1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderStyle: 'dashed',
                margin: 10,
                borderRadius: 10,
              }}
            >
              <Stack
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <LinkIcon fontSize="large" />
                <Typography>Drop Link Here</Typography>
              </Stack>
            </div>
          </Box>
        </Backdrop>
      ) : (
        <Box
          onDragEnter={onDragEnter}
          sx={{
            minHeight: '100%',
          }}
        >
          <Stack spacing={2}>
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
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        updateFieldWithValue('type', index, event.target.value)
                      }
                    >
                      <MenuItem value={'githubAction'}>Github Action</MenuItem>
                      <MenuItem value={'ccTray'}>CCTray</MenuItem>
                      <MenuItem value={'datadogMonitor'}>Datadog Monitor</MenuItem>
                      <MenuItem value={'sentry'}>Sentry</MenuItem>
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
                      <Button variant="contained" onClick={() => deleteByIndex(index)}>
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
        </Box>
      )}
    </>
  );
};
