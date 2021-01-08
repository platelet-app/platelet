import IconButton from "@material-ui/core/IconButton";
import React from "react";
import {StyledAddCircleOutlineDisabled, StyledAddCircleOutline} from "../styles/Buttons";
import {StyledAddCircleOutlineSmallDisabled, StyledAddCircleOutlineSmall} from "../styles/Buttons";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types"
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";

export function AddCircleButton(props) {
    return (
        <Tooltip title={props.tooltip}>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={props.onClick}
                disabled={props.disabled}
                className={props.className}
            >
                {props.disabled ? <StyledAddCircleOutlineDisabled/> : <StyledAddCircleOutline/>}
            </IconButton>
        </Tooltip>
    );
}

export function AddCircleButtonSmall(props) {
    return (
        <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={props.onClick}
            disabled={props.disabled}
            className={props.className}
        >
            {props.disabled ? <StyledAddCircleOutlineSmallDisabled/> : <StyledAddCircleOutlineSmall/>}
        </IconButton>
    );
}

function SmallCirclePlusButton(props) {
    const useStyles = makeStyles((theme) => ({
        button: {
            color: props.colour,
            width: theme.spacing(4),
            height: theme.spacing(4)
        },
        iconButton: {
            width: theme.spacing(4),
            height: theme.spacing(4)
        },
    }));
    const classes = useStyles();

    return (
        <Tooltip title={props.tooltip}>
            <IconButton className={classes.iconButton}
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={props.onClick}
                        disabled={props.disabled}
            >
                <AddCircleOutline className={classes.button}/>
            </IconButton>
        </Tooltip>
    );
}

SmallCirclePlusButton.defaultProps = {
    colour: "black",
    tooltip: "",
    onClick: () => {
    },
    disabled: false
}

SmallCirclePlusButton.propTypes = {
    colour: PropTypes.string,
    tooltip: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool
}

function ArrowButton(props) {
    const useStyles = makeStyles((theme) => ({
        button: {
            color: props.colour,
            width: theme.spacing(4),
            height: theme.spacing(4)
        },
        iconButton: {
            width: theme.spacing(4),
            height: theme.spacing(4)
        },
    }));
    const classes = useStyles();

    let arrowIcon = <></>;
    if (props.direction === "up")
        arrowIcon = <ArrowUpwardIcon className={classes.button}/>
    else if (props.direction === "down")
        arrowIcon = <ArrowDownwardIcon className={classes.button}/>
    else if (props.direction === "back")
        arrowIcon = <ArrowBackIcon className={classes.button}/>
    else if (props.direction === "forward")
        arrowIcon = <ArrowForwardIcon className={classes.button}/>

    const linkProps = props.linkTo ? {component: Link, to: props.linkTo} : {};


    return (
        <div className={props.className}>
            <Tooltip title={props.tooltip}>
                <IconButton className={classes.iconButton}
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={props.onClick}
                            disabled={props.disabled}
                            {...linkProps}
                >
                    {arrowIcon}
                </IconButton>
            </Tooltip>
        </div>
    );
}

ArrowButton.defaultProps = {
    colour: "black",
    tooltip: "",
    onClick: () => {
    },
    disabled: false,
    direction: "up"
}

ArrowButton.propTypes = {
    colour: PropTypes.string,
    tooltip: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    direction: PropTypes.oneOf(["up", "down", "back", "forward"]),
    className: PropTypes.string,
    linkTo: PropTypes.string
}

export {SmallCirclePlusButton, ArrowButton};
