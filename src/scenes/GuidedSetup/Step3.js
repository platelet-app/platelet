import React, { useState } from 'react';
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@mui/material/TextField';

import { LocationDropdownSelector } from './components/LocationDropdownSelector'
import { ManualAddress } from './components/ManualAddress';

import { Styles } from './styles'

export const Step3 = ({ 
    values, 
    onSelectDropoffLocation,
    onSelectDropoffTime, 
    onSelectPickupLocation,
    onSelectPickupTime,
 }) => {
    const classes = Styles()

    const [showPickUpDropdown, setShowPickUpDropdown] = useState(true)
    const [showDropOffDropdown, setShowDropOffDropdown] = useState(true)
    
    return (
        <div className={classes.columnWrapper}>
            <div className={classes.block}>
                <Typography variant="h6" gutterBottom >{"Pick-up"}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={7}>
                        { showPickUpDropdown  
                            ? <LocationDropdownSelector 
                                onSelectLocation={onSelectPickupLocation} 
                                location={values.pickUpLocation} />
                            : <ManualAddress />
                        }
                    </Grid>
                    <Grid item xs={5}>
                        <Button onClick={() => setShowPickUpDropdown(state => !state)}>
                            {showPickUpDropdown ? "Enter address manually" : "Look up from the list"}
                        </Button>
                    </Grid>
                    <Grid item xs={7}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label={"Time and date"}
                                value={values.pickUpTime}
                                onChange={(value) => onSelectPickupTime(value)}
                                renderInput={(params) => <TextField {...params} />}
                                />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={5}>
                        <div />
                    </Grid>
                </Grid>
            </div>
            
        
            <div className={classes.block}>
                <Typography variant="h6" gutterBottom >{"Drop-off"}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={7}>
                        {showDropOffDropdown  
                            ? <LocationDropdownSelector 
                                onSelectLocation={onSelectDropoffLocation} 
                                location={values.dropOffLocation} />
                            : <ManualAddress />
                        }  
                    </Grid>
                    <Grid item xs={5}>
                        <Button onClick={() => setShowDropOffDropdown(state => !state)}>
                            {showDropOffDropdown ? "Enter address manually" : "Look up from the list"}
                        </Button>
                    </Grid>
                    <Grid item xs={7}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label={"Time and date"}
                            value={values.dropOffTime}
                            onChange={(value) => onSelectDropoffTime(value)}
                            renderInput={(params) => <TextField {...params} />}
                            />
                    </LocalizationProvider>
                    </Grid>
                    <Grid item xs={5}>
                        <div />
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
