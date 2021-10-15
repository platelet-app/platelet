import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@material-ui/core/IconButton";
import { Tooltip } from "@material-ui/core";
import EditIcon from "@mui/icons-material/Edit";
import DateTimePicker from "@mui/lab/DateTimePicker";
import { showHide } from "../../../styles/common";
import makeStyles from "@mui/material/styles/makeStyles";
import TextField from "@mui/material/TextField";

const useStyles = makeStyles({
    button: {
        height: 9,
    },
});

function TimePicker(props) {
    const [editMode, setEditMode] = useState(false);
    const classes = useStyles();
    const { show, hide } = showHide();

    function onButtonClick() {
        const timeNow = new Date().toISOString();
        props.onChange(timeNow);
    }

    function onClear() {
        props.onChange(null);
    }

    function toggleEditMode() {
        setEditMode(!editMode);
    }

    function onChange(value) {
        props.onChange(value.toISOString());
        setEditMode(false);
    }

    if (props.time) {
        if (editMode) {
            return (
                <div className={classes.root}>
                    <Grid
                        container
                        direction={"row"}
                        justify={"flex-end"}
                        alignItems={"center"}
                    >
                        <Grid item>
                            <DateTimePicker
                                label="Date&Time picker"
                                helperText="Set the date and time"
                                value={props.time}
                                onChange={onChange}
                                renderInput={(params) => (
                                    <TextField {...params} />
                                )}
                            />
                            <Grid item>
                                <Tooltip title={"Cancel"}>
                                    <IconButton
                                        className={classes.button}
                                        disabled={props.disabled}
                                        onClick={toggleEditMode}
                                    >
                                        <CancelIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            );
        } else {
            return (
                <div className={classes.root}>
                    <Grid
                        container
                        direction={"row"}
                        justify={"space-between"}
                        alignItems={"center"}
                    >
                        <Grid item>
                            <Typography>
                                <Moment calendar>{props.time}</Moment>
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Tooltip title={"Edit"}>
                                <IconButton
                                    className={classes.button}
                                    edge={"end"}
                                    disabled={props.disabled}
                                    onClick={toggleEditMode}
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid className={props.disableClear ? hide : show} item>
                            <Tooltip title={"Clear"}>
                                <IconButton
                                    className={classes.button}
                                    edge={"end"}
                                    disabled={props.disabled}
                                    onClick={onClear}
                                >
                                    <CancelIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </div>
            );
        }
    } else {
        return (
            <div className={classes.root}>
                <Button disabled={props.disabled} onClick={onButtonClick}>
                    {props.label}
                </Button>
            </div>
        );
    }
}

TimePicker.propTypes = {
    time: PropTypes.string,
    onChange: PropTypes.func,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    disableClear: PropTypes.bool,
};
TimePicker.defaultProps = {
    time: "",
    onChange: () => {},
    label: "Set time",
    disabled: false,
    disableClear: false,
};

export default TimePicker;
