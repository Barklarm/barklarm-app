import React from 'react';
import TextField from '@mui/material/TextField';

export const Sentry = ({ observable, index, updateFieldWithValue, translate }: any) => (
  <>
    <TextField
      label={translate('Organization')}
      variant="outlined"
      value={observable.organization}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        updateFieldWithValue('organization', index, event.target.value)
      }
    />
    <TextField
      label={translate('Project')}
      variant="outlined"
      value={observable.project}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        updateFieldWithValue('project', index, event.target.value)
      }
    />
    <TextField
      label={translate('Authorization Token')}
      variant="outlined"
      type="password"
      value={observable.authToken}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        updateFieldWithValue('authToken', index, event.target.value)
      }
    />
  </>
);
