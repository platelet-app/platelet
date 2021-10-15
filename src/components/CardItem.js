import makeStyles from "@mui/material/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import React from "react";
import Divider from "@material-ui/core/Divider";
import {showHide} from "../styles/common";
import PropTypes from "prop-types"

const useStyles = makeStyles({
    titleText: {
        fontSize: 14,
        width: 20
    },
    cardText: {
        fontSize: 14,
        width: 220
    },
    root: {
        width: "100%"
    },
});

function CardItem(props) {
    const classes = useStyles();
    const {show, hide} = showHide();
    return (
        <div className={classes.root}>
            <Grid container spacing={1} direction={"row"} alignItems={"flex-end"} justify={"space-between"}>
                <Grid className={props.label ? show : hide} item>
                    <Typography className={classes.titleText}>{props.label}:</Typography>
                </Grid>
                <Grid item>
                    <Typography align={"right"} noWrap className={classes.cardText}>{props.children}</Typography>
                </Grid>
            </Grid>
        </div>
    )
}


CardItem.propTypes = {
    label: PropTypes.string,
}

export default CardItem;
