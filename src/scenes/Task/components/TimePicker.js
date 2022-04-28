import React, { useEffect, useRef } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Moment from "react-moment";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import { Stack, TextField, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { showHide } from "../../../styles/common";
import makeStyles from "@mui/styles/makeStyles";
import { DateTimePicker } from "@mui/lab";
import moment from "moment";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

const useStyles = makeStyles({
    button: {
        height: 9,
    },
    label: {
        color: "gray",
    },
});

function TimePicker(props) {
    const [editMode, setEditMode] = useState(false);
    const [state, setState] = useState(new Date(props.time));
    const originalTime = useRef(new Date(props.time));
    const classes = useStyles();
    const { show, hide } = showHide();

    useEffect(() => {
        setState(new Date(props.time));
        originalTime.current = new Date(props.time);
    }, [props.time]);

    function onClear() {
        props.onChange(null);
    }

    function toggleEditMode() {
        setEditMode(!editMode);
    }

    function onChange(value) {
        setState(value);
    }

    // check if props.time is today
    function isToday() {
        const today = new Date();
        const date = new Date(props.time);
        return (
            today.getDate() === date.getDate() &&
            today.getMonth() === date.getMonth() &&
            today.getFullYear() === date.getFullYear()
        );
    }

    if (props.time) {
        return (
            <>
                <Stack
                    direction={"row"}
                    spacing={1}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Tooltip
                        title={
                            props.time
                                ? moment(props.time).format(
                                      "dddd, MMMM Do YYYY, H:mm"
                                  )
                                : ""
                        }
                    >
                        <Typography>
                            {isToday() ? (
                                <>
                                    Today at{" "}
                                    <Moment format={"HH:mm"}>
                                        {props.time}
                                    </Moment>
                                </>
                            ) : (
                                <Moment format={"DD/MM/YYYY, HH:mm"}>
                                    {props.time}
                                </Moment>
                            )}
                        </Typography>
                    </Tooltip>
                    <Tooltip title={"Edit"}>
                        <IconButton
                            aria-label={"Edit"}
                            disabled={props.disabled}
                            onClick={toggleEditMode}
                            size="small"
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <div className={props.disableClear ? hide : show}>
                        <Tooltip title={"Clear"}>
                            <IconButton
                                aria-label={"Clear"}
                                className={classes.button}
                                disabled={props.disabled}
                                onClick={onClear}
                                size="small"
                            >
                                <CancelIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Stack>
                <ConfirmationDialog
                    onCancel={() => setEditMode(false)}
                    onConfirmation={() => {
                        setEditMode(false);
                        props.onChange(state);
                    }}
                    open={editMode}
                >
                    <DateTimePicker
                        label={props.label}
                        value={state}
                        inputFormat={"dd/MM/yyyy HH:mm"}
                        openTo="hours"
                        onChange={(value) => setState(value)}
                        renderInput={(params) => (
                            <TextField
                                variant={"standard"}
                                fullWidth
                                {...params}
                            />
                        )}
                    />
                </ConfirmationDialog>
            </>
        );
    } else {
        return props.disableUnsetMessage ? (
            <></>
        ) : (
            <Typography className={classes.label}>Unset</Typography>
        );
    }
}

TimePicker.propTypes = {
    time: PropTypes.string,
    onChange: PropTypes.func,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    disableClear: PropTypes.bool,
    disableUnsetMessage: PropTypes.bool,
};
TimePicker.defaultProps = {
    time: "",
    onChange: () => {},
    label: "",
    disabled: false,
    disableClear: false,
    disableUnsetMessage: false,
};

export default TimePicker;
