import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinkIcon from '@mui/icons-material/Link';
import { Observers as ObserversComponent } from '../../components/Observers';
import { observersfromLinkParser } from './helpers/observersfromLinkParser';
import { DropZone } from '../../components/Dropzone';

export const Observers = () => {
  const [observables, setObservables] = useState(window.electron.store.get('observables') || []);
  const [isDrag, setIsDrag] = useState(false);
  const addObserver = (observer: any) => {
    setObservables([...observables, observer]);
  };
  const removeObserver = (index: number) => {
    setObservables(observables.filter((_: any, currentIndex: number) => currentIndex != index));
  };
  const updateObserver = (fieldName: string, index: number, value: any) => {
    setObservables(
      observables.map((observable: any, currentIndex: number) =>
        currentIndex != index ? observable : { ...observable, [fieldName]: value }
      )
    );
  };
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
      if (!parser.canApply(text)) return;
      addObserver(parser.apply(text));
    });
  };
  return (
    <>
      {isDrag ? (
        <DropZone open={isDrag} onDragOver={onDragOver} onDrop={onDrop} onDragLeave={onDragLeave}>
          <Stack
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LinkIcon fontSize="large" />
            <Typography>Drop Link Here</Typography>
          </Stack>
        </DropZone>
      ) : (
        <Box
          onDragEnter={onDragEnter}
          sx={{
            minHeight: '100%',
          }}
        >
          <ObserversComponent
            observables={observables}
            add={addObserver}
            update={updateObserver}
            remove={removeObserver}
          />
        </Box>
      )}
    </>
  );
};
