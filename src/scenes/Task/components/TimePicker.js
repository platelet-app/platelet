import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Moment from "react-moment";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import { Stack, TextField, Tooltip, useMediaQuery } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { makeStyles } from "tss-react/mui";
import { DateTimePicker } from "@mui/lab";
import moment from "moment";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { useTheme } from "@mui/styles";

const useStyles = makeStyles()({
    button: {
        height: 9,
    },
    label: {
        color: "gray",
    },
});

function TimePicker(props) {
    const [state, setState] = useState(new Date(props.time));
    const { classes } = useStyles();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    function onClear() {
        props.onChange(null);
    }

    function toggleEditMode() {
        props.onClickEdit();
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
                    {!props.hideEditIcon && (
                        <>
                            <Tooltip title={"Edit"}>
                                <IconButton
                                    aria-label={`edit ${props.label}`}
                                    disabled={props.disabled}
                                    onClick={toggleEditMode}
                                    size="small"
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            {!props.disableClear && (
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
                            )}
                        </>
                    )}
                </Stack>
                <ConfirmationDialog
                    fullScreen={isSm}
                    onCancel={props.onCancelEdit}
                    onConfirmation={() => {
                        props.onChange(state);
                    }}
                    open={props.editMode}
                >
                    <DateTimePicker
                        label={props.label}
                        value={state}
                        inputFormat={"dd/MM/yyyy HH:mm"}
                        openTo="hours"
                        onChange={(value) => setState(value)}
                        renderInput={(params) => (
                            <TextField fullWidth {...params} />
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
    hideEditIcon: PropTypes.bool,
};
TimePicker.defaultProps = {
    time: "",
    onChange: () => {},
    label: "",
    disabled: false,
    disableClear: false,
    disableUnsetMessage: false,
    hideEditIcon: false,
};

export default TimePicker;
