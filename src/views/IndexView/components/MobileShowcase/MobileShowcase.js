import React from "react";
import {Grid, Typography, useMediaQuery} from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import mobile_light from "../../../../assets/images/mobile-light.png"
import mobile_dark from "../../../../assets/images/mobile-dark.png"


const useStyles = makeStyles(theme => ({
    root: {
        height: 600
    },
    text: {
        [theme.breakpoints.down('sm')]: {
            height: 400,
            width: 250,
        },
        height: 700,
        width: 400,
        display: "flex"
    },
    item: {
        width: 500
    },
    background: {
        [theme.breakpoints.down('sm')]: {
            height: 530,
            width: 380,
        },
        backgroundImage: `url(${mobile_light})`,
        height: 700,
        backgroundRepeat: "no-repeat",
        width: 550,
        backgroundSize: 'contain',
    },
    backgroundDark: {
        [theme.breakpoints.down('sm')]: {
            height: 530,
            width: 380,
        },
        backgroundImage: `url(${mobile_dark})`,
        height: 700,
        backgroundRepeat: "no-repeat",
        width: 550,
        backgroundSize: 'contain',
    }
}))

const MobileShowcase = ({themeMode = 'light', ...rest}) => {
    const classes = useStyles();

    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });

    const item1 =
        <Grid container item data-aos={'fade-left'} alignItems={"center"} justify={"center"} spacing={2} direction={"column"} className={classes.text}>
            <Grid item>
                <Typography variant={"h4"}>
                    Use from any internet capable device
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant={"h6"}>Use on any device with an internet browser. A native mobile app is planned.</Typography>
            </Grid>
        </Grid>

    const item2 =
        <Grid item>
            <div className={themeMode === "dark"? classes.backgroundDark : classes.background}/>
        </Grid>

    return (
        <Grid container direction={isMd ? "row" : "column"} justify={"space-between"} alignItems={isMd ? "center" : "flex-start"}>
            {item2}
            {item1}
        </Grid>
    )

}

export default MobileShowcase;
