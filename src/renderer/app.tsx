import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';


export const App = () => {
    const [observables, setObservables] = useState(window.electron.store.get("observables") || []);
    const deleteByIndex = (index: number) => {
        setObservables(observables.filter((_: any, currentIndex:number) => currentIndex != index))
    }
    const updateFieldWithValue  = (fieldName:string, index: number, value: any) => {
        setObservables(observables.map((observable: any, currentIndex:number) => currentIndex != index
            ? observable
            : {...observable, [fieldName]: value}))
    }
    return <>
        <Stack 
            spacing={2}
        >
            {observables.map((observable: any, index: number) => 
                <Accordion>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                            <Typography>#{index+1}:{observable.owner}/{observable.repo}/{observable.workflowId}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={2}>
                                <TextField 
                                    id="outlined-basic" 
                                    label="owner" 
                                    variant="outlined" 
                                    value={observable.owner} 
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateFieldWithValue("owner", index, event.target.value)} 
                                />
                                <TextField 
                                    id="outlined-basic" 
                                    label="repo" 
                                    variant="outlined" 
                                    value={observable.repo} 
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateFieldWithValue("repo", index, event.target.value)} 
                                />
                                <TextField 
                                    id="outlined-basic" 
                                    label="Workflow Name" 
                                    variant="outlined" 
                                    value={observable.workflowId} 
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateFieldWithValue("workflowId", index, event.target.value)} 
                                />
                                <TextField 
                                    id="outlined-basic" 
                                    label="authorization Token" 
                                    variant="outlined" 
                                    type="password"
                                    value={observable.authToken} 
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateFieldWithValue("authToken", index, event.target.value)} 
                                />
                                <Stack spacing={2} direction="row" justifyContent="flex-end">
                                    <Button onClick={() => deleteByIndex(index)}> Delete </Button>
                                </Stack>
                            </Stack> 
                        </AccordionDetails>
                </Accordion>)}
            
            <Stack spacing={2} direction="row" justifyContent="flex-end">
                <Button 
                    variant="contained" 
                    onClick={() => {
                        window.electron.store.set("observables", observables)
                        window.electron.app.refreshObservers()
                    }}> 
                    Save 
                </Button>
                <Button
                    variant="contained"
                    onClick={() =>setObservables([...observables, {type: "githubAction", authToken: "", owner: "", repo: "", workflowId: ""}])}
                >
                    Add
                </Button>
            </Stack>
            
        </Stack>
      
    </>
}