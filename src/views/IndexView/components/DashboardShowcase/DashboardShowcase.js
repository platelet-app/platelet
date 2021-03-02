import React from "react";
import {Parallax, Section} from "../../../../components/organisms";
import dashboard_dark from '../../../../assets/images/dashboard-dark.png'
import dashboard_light from '../../../../assets/images/dashboard-light.png'
import {Grid, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        height: 600
    },
    right: {
        height: 700,
        width: 400,
        display: "flex"
    },
    item: {
        width: 500
    },
    background: {
        backgroundImage: `url(${dashboard_light})`,
        height: 700,
        backgroundRepeat: "no-repeat",
        width: 550,
        backgroundSize: 'contain',
    },
    backgroundDark: {
        backgroundImage: `url(${dashboard_dark})`,
        height: 700,
        backgroundRepeat: "no-repeat",
        width: 550,
        backgroundSize: 'contain',
    }
}))

const DashboardShowcase = ({themeMode = 'light', ...rest}) => {
    const classes = useStyles();
    return (
            <Grid container spacing={5} direction={"row"} justify={"space-between"} alignItems={"center"}>
                <Grid item>
                    <div className={themeMode === "dark"? classes.backgroundDark : classes.background}/>
                </Grid>
                <Grid container data-aos={'fade-right'} item alignItems={"center"} justify={"center"} spacing={2} direction={"column"} className={classes.right}>
                    <Grid item>
                    <Typography variant={"h4"}>
                        Tailored dashboard for coordinators and drivers.
                    </Typography>
                    </Grid>
                    <Grid item>
                    <Typography variant={"h6"}>Assign jobs to your fleet and look up details from anywhere.</Typography>
                    </Grid>
                </Grid>
            </Grid>
    )
}

export default DashboardShowcase;
