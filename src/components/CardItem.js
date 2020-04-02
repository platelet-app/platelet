import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import React from "react";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles({
    titleText: {
        fontSize: "13px",
        width: "20px"
    },
    cardText: {
        fontSize: "14px",
    }
});

export default function CardItem(props) {
    const classes = useStyles();
    return (
        <Grid item>
            <Grid container spacing={1} direction={"row"} alignItems={"flex-end"} justify={"space-between"}>
                <Grid item>
                    <Typography className={classes.titleText}>{props.label}:</Typography>
                </Grid>
                <Grid item>
                    <Typography style={{width: props.width ? props.width : "193px"}} align={"right"} noWrap={true} className={classes.cardText}>{props.children}</Typography>
                </Grid>
            </Grid>
            <Grid item><Divider orientation="horizontal" flexItem/></Grid>
        </Grid>
    )

}
