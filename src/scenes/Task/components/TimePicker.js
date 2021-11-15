import React, { useEffect, useRef } from "react";
import CheckIcon from "@mui/icons-material/Check";
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
import { useDispatch } from "react-redux";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";

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
    const dispatch = useDispatch();

    useEffect(() => {
        setState(new Date(props.time));
        originalTime.current = new Date(props.time);
    }, [props.time]);

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
        setState(value);
    }

    if (props.time) {
        if (editMode) {
            return (
                <Stack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    direction={"row"}
                >
                    <DateTimePicker
                        label={props.label}
                        inputFormat={"dd/MM/yyyy HH:mm"}
                        openTo="hours"
                        value={state}
                        onChange={onChange}
                        renderInput={(params) => (
                            <TextField
                                variant={"standard"}
                                fullWidth
                                {...params}
                            />
                        )}
                    />
                    <Tooltip title={"Finish"}>
                        <IconButton
                            className={classes.button}
                            edge={"end"}
                            disabled={props.disabled}
                            onClick={() => {
                                if (state) {
                                    try {
                                        props.onChange(state.toISOString());
                                    } catch (error) {
                                        dispatch(
                                            displayErrorNotification(
                                                error.message
                                            )
                                        );
                                        return;
                                    }
                                    originalTime.current = state;
                                    toggleEditMode();
                                }
                            }}
                            size="large"
                        >
                            <CheckIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Cancel"}>
                        <IconButton
                            className={classes.button}
                            edge={"end"}
                            disabled={props.disabled}
                            onClick={() => {
                                setState(originalTime.current);
                                toggleEditMode();
                            }}
                            size="large"
                        >
                            <CancelIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            );
        } else {
            return (
                <Stack
                    direction={"row"}
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
                            <Moment calendar>{props.time}</Moment>
                        </Typography>
                    </Tooltip>
                    <Tooltip title={"Edit"}>
                        <IconButton
                            className={classes.button}
                            edge={"end"}
                            disabled={props.disabled}
                            onClick={toggleEditMode}
                            size="large"
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <div className={props.disableClear ? hide : show}>
                        <Tooltip title={"Clear"}>
                            <IconButton
                                className={classes.button}
                                edge={"end"}
                                disabled={props.disabled}
                                onClick={onClear}
                                size="large"
                            >
                                <CancelIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Stack>
            );
        }
    } else {
        return <Typography className={classes.label}>Not set</Typography>;
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
    label: "",
    disabled: false,
    disableClear: false,
};

export default TimePicker;
