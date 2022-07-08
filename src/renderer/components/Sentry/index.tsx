import React from 'react';
import TextField from '@mui/material/TextField';

export const Sentry = ({ observable, index, updateFieldWithValue }: any) => (
  <>
    <TextField
      id="outlined-basic"
      label="organization"
      variant="outlined"
      value={observable.organization}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        updateFieldWithValue('organization', index, event.target.value)
      }
    />
    <TextField
      id="outlined-basic"
      label="project"
      variant="outlined"
      value={observable.project}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        updateFieldWithValue('project', index, event.target.value)
      }
    />
    <TextField
      id="outlined-basic"
      label="authorization Token"
      variant="outlined"
      type="password"
      value={observable.authToken}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        updateFieldWithValue('authToken', index, event.target.value)
      }
    />
  </>
);
