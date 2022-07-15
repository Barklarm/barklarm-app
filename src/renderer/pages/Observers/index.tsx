import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinkIcon from '@mui/icons-material/Link';
import { Observers as ObserversComponent } from '../../components/Observers';
import { DropZone } from '../../components/Dropzone';
import { mutations } from './helpers/mutations';

export const Observers = () => {
  const [observables, setObservables] = useState(window.electron.store.get('observables') || []);
  const [isDrag, setIsDrag] = useState(false);
  const { addObserver, removeObserver, updateObserver, parseDataransfer } = mutations(observables, setObservables);
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
    parseDataransfer(e.dataTransfer);
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
