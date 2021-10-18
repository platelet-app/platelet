import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import {Grid} from '@material-ui/core';

import { GuidedSetup } from '../GuidedSetup/GuidedSetup'
import { RiderJobActivity } from './components/RiderJobActivity'
import { EnhancedTable } from './components/EnhancedTable'

const setupStyles = makeStyles((theme) => ({
    container: {
        position: "fixed",
        left: "0",
        top: "15%",
        width: "100%",
        height: "80%",
    },
    leftPanel: {
        background: "white",
        height: "100%",
        paddingLeft: "50px",
        borderRight: "solid 2px"
    }
  }));

export const CoordinatorSetup = ({ show, onClose}) => {
    const classes = setupStyles();

    return (
        <Grid container className={classes.container}>
            <Grid item xs={8} className={classes.leftPanel} >
                {/* <div className={classes.leftPanel} /> */}
                <RiderJobActivity />
                <EnhancedTable />
            </Grid>

            <Grid item xs={4}>
                <GuidedSetup show={show} onClose={onClose} />
            </Grid>
        </Grid>
    )
}
