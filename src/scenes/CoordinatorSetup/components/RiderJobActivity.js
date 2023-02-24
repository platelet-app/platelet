import React from "react";
import Typography from '@mui/material/Typography';
import { makeStyles } from 'tss-react/mui';
import {Grid} from '@mui/material';

const riderJobActivityStyles = makeStyles()((theme) => ({
    wrapper: {
        marginBottom: "100px",
    },
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
    const { classes } = riderJobActivityStyles();

    return (
        <div className={classes.wrapper}>
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
