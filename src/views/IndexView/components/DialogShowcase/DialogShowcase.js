import React from "react";
import {Grid, Typography, useMediaQuery} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";
import showCaseStyles from "../../styles";
import clsx from "clsx";

const DialogShowcase = ({themeMode = 'light', ...rest}) => {
    const classes = showCaseStyles();

    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });

    const isSm = theme.breakpoints.down("sm");
    const dialogClass = themeMode === "dark" ? classes.dialogBackDark : classes.dialogBack


    return (
        <Grid container spacing={isSm ? 0 : 3} direction={"row-reverse"} justify={"space-between"} alignItems={"center"}>
            <Grid className={classes.item} item>
                <div className={clsx(classes.background, dialogClass)}/>
            </Grid>
            <Grid container data-aos={'fade-right'} item alignItems={"center"} justify={"center"} spacing={isSm ? 0 : 2}
                  direction={"column"} className={classes.text}>
                <Grid item>
                    <Typography variant={"h4"}>
                        Easily view, edit and share job details
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant={"h6"}>
                        Select from a directory of hospital locations and items. Share extra details in comments, or make private notes.
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )

}

export default DialogShowcase;
