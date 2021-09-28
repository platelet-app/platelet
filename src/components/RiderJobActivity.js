import React from "react";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import {Grid} from '@material-ui/core';

const riderJobActivityStyles = makeStyles((theme) => ({
    box: {
        border: "solid 2px",
        color: 'black',
        width: "180px",
        height: "150px",
    }
  }));

export const RiderJobActivity = () => {
    const classes = riderJobActivityStyles();

    return (
        <>
            <Box p={3}>
                <Typography>{"Rider Job Activity"}</Typography>
            </Box>
            <Grid container>
                <Grid item xs={2} >
                    <div className={classes.box}>
                    <Box p={3}>
                        <Typography align="center">{"Available Riders"}</Typography>
                    </Box>
                        <Typography variant="h3" align="center">{"5"}</Typography>
                    </div>
                </Grid>

                <Grid item xs={2} >
                    <div className={classes.box}>
                    <Box p={3}>
                        <Typography align="center">{"Riders On Job"}</Typography>
                    </Box>
                        <Typography variant="h3" align="center">{"8"}</Typography>
                    </div>
                </Grid>
            </Grid>
        </>
    )
}
