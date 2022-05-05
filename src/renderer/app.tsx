import React, { useState } from 'react';
import Button from '@mui/material/Button';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import Stack from '@mui/material/Stack';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import { IndeterminateCheckBox } from '@mui/icons-material';


export const App = () => {
    const [observables, setObservables] = useState(window.electron.store.get("observables") || []);
    const deleteByIndex = (index: number) => {
        setObservables(observables.filter((_: any, filterIndex:number) => {
            
            console.log("index to delete", index, "current index", filterIndex)
            return filterIndex != index
        }))
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
                            <Typography>Observable {observable.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={2}>
                                <TextField id="outlined-basic" label="Name" variant="outlined" value={observable.name} />
                                <TextField id="outlined-basic" label="Key" variant="outlined" value={observable.key} />
                                <TextField id="outlined-basic" label="URL" variant="outlined" value={observable.url}/>
                                <Stack spacing={2} direction="row" justifyContent="flex-end">
                                    <Button onClick={() => deleteByIndex(index)}> Delete </Button>
                                </Stack>
                            </Stack> 
                        </AccordionDetails>
                </Accordion>)}
            
            <Stack spacing={2} direction="row" justifyContent="flex-end">
                <Button 
                    variant="contained" 
                    onClick={() => window.electron.store.set("observables", observables)}
                > 
                    Save 
                </Button>
                <Button
                    variant="contained"
                    onClick={() =>setObservables([...observables, {key: "", url: "", name: ""}])}
                >
                    <SpeedDialIcon />
                </Button>
            </Stack>
            
        </Stack>
      
    </>
}