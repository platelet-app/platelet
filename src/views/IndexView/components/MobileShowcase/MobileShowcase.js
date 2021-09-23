import React from "react";
import {Grid, Typography, useMediaQuery} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";
import showCaseStyles from "../../styles";
import clsx from "clsx";


const MobileShowcase = ({themeMode = 'light', ...rest}) => {
    const classes = showCaseStyles();

    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });

    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

    const mobileClass = themeMode === "dark" ? classes.mobileBackDark : classes.mobileBack

    return (
        <Grid container spacing={isSm ? 0 : 3} direction={"row"} justify={"space-between"} alignItems={"center"}>
            <Grid className={classes.item} item>
                <div className={clsx(classes.background, mobileClass)}/>
            </Grid>
            <Grid container data-aos={'fade-right'} item alignItems={"center"} justify={"center"} spacing={isSm ? 0 : 2}
                  direction={"column"} className={classes.text}>
                <Grid item>
                    <Typography variant={"h4"}>
                        Use from any internet capable device
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant={"h6"}>Use on any device with an internet browser. A native mobile app is planned.</Typography>
                </Grid>
            </Grid>
        </Grid>
    )

}

export default MobileShowcase;
