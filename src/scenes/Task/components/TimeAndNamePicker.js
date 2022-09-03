import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import { useState } from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Moment from "react-moment";
import IconButton from "@mui/material/IconButton";
import { Stack, TextField, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import makeStyles from "@mui/styles/makeStyles";
import { DateTimePicker } from "@mui/lab";
import moment from "moment";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { displayInfoNotification } from "../../../redux/notifications/NotificationsActions";
import { useDispatch } from "react-redux";

const useStyles = makeStyles({
    button: {
        height: 9,
    },
    label: {
        color: "gray",
    },
});

function TimeAndNamePicker(props) {
    const [editMode, setEditMode] = useState(false);
    const [state, setState] = useState({
        time: new Date(props.time),
        name: props.name,
    });
    const classes = useStyles();
    const dispatch = useDispatch();

    function toggleEditMode() {
        setEditMode(!editMode);
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
                    {props.name && (
                        <Tooltip title={props.name}>
                            <IconButton
                                aria-label={props.name}
                                disabled={props.disabled}
                                size="small"
                                onClick={
                                    // copy to clipboard
                                    // have this do nothing for now
                                    () => {
                                        return;
                                        navigator.clipboard.writeText(
                                            props.name
                                        );
                                        dispatch(
                                            displayInfoNotification(
                                                "Copied name to clipboard"
                                            )
                                        );
                                    }
                                }
                            >
                                <InfoIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {!props.hideEditIcon && (
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
                    )}
                </Stack>
                <ConfirmationDialog
                    onCancel={() => setEditMode(false)}
                    onConfirmation={() => {
                        setEditMode(false);
                        props.onChange(state);
                    }}
                    open={editMode}
                >
                    <Stack sx={{ minWidth: 300 }} spacing={3}>
                        <DateTimePicker
                            label={props.label}
                            value={state.time}
                            inputFormat={"dd/MM/yyyy HH:mm"}
                            openTo="hours"
                            onChange={(value) =>
                                setState((prevState) => ({
                                    ...prevState,
                                    time: value,
                                }))
                            }
                            renderInput={(params) => (
                                <TextField
                                    variant={"standard"}
                                    fullWidth
                                    {...params}
                                />
                            )}
                        />
                        <TextField
                            onChange={(e) => {
                                const { value } = e.target;
                                setState((prevState) => ({
                                    ...prevState,
                                    name: value,
                                }));
                            }}
                            inputProps={{
                                "aria-label": props.nameLabel,
                            }}
                            value={state.name}
                            label={props.nameLabel}
                        />
                    </Stack>
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

TimeAndNamePicker.propTypes = {
    time: PropTypes.string,
    onChange: PropTypes.func,
    label: PropTypes.string,
    name: PropTypes.string,
    nameLabel: PropTypes.string,
    disabled: PropTypes.bool,
    disableUnsetMessage: PropTypes.bool,
};
TimeAndNamePicker.defaultProps = {
    time: "",
    onChange: () => {},
    label: "",
    name: "",
    nameLabel: "Name",
    disabled: false,
    disableUnsetMessage: false,
};

export default TimeAndNamePicker;
