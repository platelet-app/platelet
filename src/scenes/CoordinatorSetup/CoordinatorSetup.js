import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import {Grid} from '@mui/material';

import { GuidedSetup } from '../GuidedSetup/GuidedSetup'
import { RiderJobActivity } from './components/RiderJobActivity'
import { EnhancedTable } from './components/EnhancedTable'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const setupStyles = makeStyles((theme) => ({
    container: {
        // todo: replace with a direct url to redirect to new page instead
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: "0",
        top: "5%",
        width: "100%",
        height: "100%",
        background: "white",
        padding: "20px 30px"
    },
    leftPanel: {
        display: "grid",     
        height: "100%",
        
    },
    divider: {
       position: "relative",

        "&:after": {
            position: "absolute",
            content: '""',
            top: 0,
            right: "50%",
            width: "2px",
            height: "100%",
            background: "black"
        }
    }
  }));

export const CoordinatorSetup = ({ show, onClose }) => {
    const classes = setupStyles();
    
    return (
        <div className={classes.container}>
            <Box p={3}>
                <Typography>{"Rider Job Activity"}</Typography>
            </Box>
            <Grid container>
                <Grid item xs={7.5} className={classes.leftPanel} >
                    <RiderJobActivity />
                    <EnhancedTable />
                </Grid>
                <Grid item xs={0.5} className={classes.divider} />
                <Grid item xs={4}>
                    <GuidedSetup />
                </Grid>
            </Grid> 
        </div>
    )
}
