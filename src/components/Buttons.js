import IconButton from "@mui/material/IconButton";
import React from "react";
import {
    StyledAddCircleOutlineDisabled,
    StyledAddCircleOutline,
} from "../styles/Buttons";
import {
    StyledAddCircleOutlineSmallDisabled,
    StyledAddCircleOutlineSmall,
} from "../styles/Buttons";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { makeStyles } from "tss-react/mui";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export function AddCircleButton(props) {
    return (
        <Tooltip title={props.tooltip}>
            <IconButton
                {...props}
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={props.onClick}
                disabled={props.disabled}
                className={props.className}
                size="large"
            >
                {props.disabled ? (
                    <StyledAddCircleOutlineDisabled />
                ) : (
                    <StyledAddCircleOutline />
                )}
            </IconButton>
        </Tooltip>
    );
}

export function AddCircleButtonSmall(props) {
    return (
        <IconButton
            {...props}
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={props.onClick}
            disabled={props.disabled}
            className={props.className}
            size="large"
        >
            {props.disabled ? (
                <StyledAddCircleOutlineSmallDisabled />
            ) : (
                <StyledAddCircleOutlineSmall />
            )}
        </IconButton>
    );
}

function SmallCirclePlusButton(props) {
    const useStyles = makeStyles()((theme) => ({
        button: {
            color: props.colour,
            width: theme.spacing(4),
            height: theme.spacing(4),
        },
        iconButton: {
            width: theme.spacing(4),
            height: theme.spacing(4),
        },
    }));
    const { classes } = useStyles();

    return (
        <Tooltip title={props.tooltip}>
            <IconButton
                {...props}
                className={classes.iconButton}
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={props.onClick}
                disabled={props.disabled}
                size="large"
            >
                <AddCircleOutline className={classes.button} />
            </IconButton>
        </Tooltip>
    );
}

SmallCirclePlusButton.defaultProps = {
    tooltip: "",
    onClick: () => {},
    disabled: false,
};

SmallCirclePlusButton.propTypes = {
    colour: PropTypes.string,
    tooltip: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
};

function ArrowButton(props) {
    const useStyles = makeStyles()((theme) => ({
        button: {
            color: props.colour,
            width: theme.spacing(props.size),
            height: theme.spacing(props.size),
        },
        iconButton: {
            width: theme.spacing(props.size),
            height: theme.spacing(props.size),
        },
    }));
    const { classes } = useStyles();

    let arrowIcon = <></>;
    if (props.direction === "up")
        arrowIcon = <ArrowUpwardIcon className={classes.button} />;
    else if (props.direction === "down")
        arrowIcon = <ArrowDownwardIcon className={classes.button} />;
    else if (props.direction === "back")
        arrowIcon = <ArrowBackIcon className={classes.button} />;
    else if (props.direction === "forward")
        arrowIcon = <ArrowForwardIcon className={classes.button} />;

    const linkProps = props.linkTo ? { component: Link, to: props.linkTo } : {};

    return (
        <div className={props.className}>
            <Tooltip title={props.tooltip}>
                <IconButton
                    {...props}
                    className={classes.iconButton}
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={props.onClick}
                    disabled={props.disabled}
                    {...linkProps}
                    size="large"
                >
                    {arrowIcon}
                </IconButton>
            </Tooltip>
        </div>
    );
}

ArrowButton.defaultProps = {
    colour: "primary",
    tooltip: "",
    onClick: () => {},
    disabled: false,
    direction: "up",
    size: 4,
};

ArrowButton.propTypes = {
    colour: PropTypes.string,
    tooltip: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    direction: PropTypes.oneOf(["up", "down", "back", "forward"]),
    className: PropTypes.string,
    linkTo: PropTypes.string,
    size: PropTypes.number,
};

export { SmallCirclePlusButton, ArrowButton };
