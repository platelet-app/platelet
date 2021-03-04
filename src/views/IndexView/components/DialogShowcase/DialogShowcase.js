import React from "react";
import {Grid, Typography, useMediaQuery} from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import dialog_light from "../../../../assets/images/dialog-light.png"
import dialog_dark from "../../../../assets/images/dialog-dark.png"
import dashboard_light from "../../../../assets/images/dashboard-light.png";
import dashboard_dark from "../../../../assets/images/dashboard-dark.png";


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
        backgroundImage: `url(${dialog_light})`,
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
        backgroundImage: `url(${dialog_dark})`,
        height: 700,
        backgroundRepeat: "no-repeat",
        width: 550,
        backgroundSize: 'contain',
    }
}))

const DialogShowcase = ({themeMode = 'light', ...rest}) => {
    const classes = useStyles();

    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });

    const item1 =
        <Grid container item data-aos={'fade-left'} alignItems={"center"} justify={"center"} spacing={2} direction={"column"} className={classes.text}>
            <Grid item>
                <Typography variant={"h4"}>
                    Easily view, edit and share job details
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant={"h6"}>Select from a directory of hospital locations and items. Share extra details in comments, or make private notes.</Typography>
            </Grid>
        </Grid>

    const item2 =
        <Grid item>
            <div className={themeMode === "dark"? classes.backgroundDark : classes.background}/>
        </Grid>

        return (
            <Grid container direction={isMd ? "row" : "column-reverse"} justify={"space-between"} alignItems={isMd ? "center" : "flex-start"}>
                {item1}
                {item2}
            </Grid>
        )

}

export default DialogShowcase;
