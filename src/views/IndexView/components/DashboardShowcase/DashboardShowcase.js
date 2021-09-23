import React from "react";
import {Grid, Typography} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";
import showCaseStyles from "../../styles";
import clsx from "clsx";

const DashboardShowcase = ({themeMode = 'light', ...rest}) => {
    const classes = showCaseStyles();
    const theme = useTheme();
    const dashboardClass = themeMode === "dark" ? classes.dashboardBackDark : classes.dashboardBack
    const isSm = theme.breakpoints.down("sm");
    return (
        <Grid container spacing={isSm ? 0 : 3} direction={"row"} justify={"space-between"} alignItems={"center"}>
            <Grid className={classes.item} item>
                <div className={clsx(classes.background, dashboardClass)}/>
            </Grid>
            <Grid container data-aos={'fade-right'} item alignItems={"center"} justify={"center"} spacing={isSm ? 0 : 2}
                  direction={"column"} className={classes.text}>
                <Grid item>
                    <Typography variant={"h4"}>
                        Tailored dashboards for coordinators and riders
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant={"h6"}>Assign jobs to users and see all your assigned jobs at a
                        glance.</Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default DashboardShowcase;
