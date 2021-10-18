import React from "react";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import {Grid} from '@material-ui/core';

const riderJobActivityStyles = makeStyles((theme) => ({
    box: {
        border: "solid 2px",
        color: 'black',
        width: "150px",
        height: "150px",
        padding: "10px",
        marginRight: "3rem",
    },
    number: {
        paddingTop: "12%",
    }
  }));

export const RiderJobActivity = () => {
    const classes = riderJobActivityStyles();

    return (
        <div>
            <Box p={3}>
                <Typography>{"Rider Job Activity"}</Typography>
            </Box>
            <Grid container>
                <Grid item >
                    <div className={classes.box}>
                        <Typography align="center">{"Available Riders"}</Typography>
                        <Typography className={classes.number} variant="h3" align="center">{"5"}</Typography>
                    </div>
                </Grid>

                <Grid item >
                    <div className={classes.box}>
                        <Typography align="center">{"Riders On Job"}</Typography>
                        <Typography className={classes.number} variant="h3" align="center">{"8"}</Typography>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}
