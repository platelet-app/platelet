import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import React from "react";
import Divider from "@material-ui/core/Divider";
import {showHide} from "../styles/common";
import PropTypes from "prop-types"

const useStyles = makeStyles({
    titleText: {
        fontSize: "14px",
        width: "20px"
    },
    cardText: {
        fontSize: "14px",
    }
});

function CardItem(props) {
    const classes = useStyles();
    const {show, hide} = showHide();
    return (
        <Grid item>
            <Grid container spacing={1} direction={"row"} alignItems={"flex-end"} justify={"space-between"}>
                <Grid className={props.label ? show : hide} item>
                    <Typography className={classes.titleText}>{props.label}:</Typography>
                </Grid>
                <Grid item>
                    <Typography style={{width: props.width ? props.width : "260px"}} align={"right"} noWrap={true} className={classes.cardText}>{props.children}</Typography>
                </Grid>
            </Grid>
            <Grid item><Divider width={"100px"} orientation="horizontal" flexItem/></Grid>
        </Grid>
    )
}

CardItem.defaultProps = {
    width: "260px"
}

CardItem.propTypes = {
    label: PropTypes.string,
}

export default CardItem
