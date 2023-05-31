import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Moment from "react-moment";
import IconButton from "@mui/material/IconButton";
import { Stack, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { makeStyles } from 'tss-react/mui';
import moment from "moment";
import TimeAndNamePickerDialog from "./TimeAndNamePickerDialog";

const useStyles = makeStyles()({
    button: {
        height: 9,
    },
    label: {
        color: "gray",
    },
});

function TimeAndNamePicker(props) {
    const { classes } = useStyles();

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

    const { onChange } = props;

    const onConfirmation = React.useCallback(
        (values) => {
            onChange(values);
        },
        [onChange]
    );

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
                                        /*navigator.clipboard.writeText(
                                            props.name
                                        );
                                        dispatch(
                                            displayInfoNotification(
                                                "Copied name to clipboard"
                                            )
                                        );*/
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
                                aria-label={`edit ${props.label}`}
                                disabled={props.disabled}
                                onClick={props.onClickEdit}
                                size="small"
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>
                <TimeAndNamePickerDialog
                    key={props.editMode}
                    disableFuture
                    disabled={props.disabled}
                    open={props.editMode}
                    onConfirmation={onConfirmation}
                    time={props.time}
                    name={props.name}
                    nameLabel={props.nameLabel}
                    label={props.label}
                    onCancel={props.onCancelEdit}
                />
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
    onClickEdit: PropTypes.func,
    onCancelEdit: PropTypes.func,
    label: PropTypes.string,
    name: PropTypes.string,
    nameLabel: PropTypes.string,
    disabled: PropTypes.bool,
    disableUnsetMessage: PropTypes.bool,
    editMode: PropTypes.bool,
};
TimeAndNamePicker.defaultProps = {
    time: "",
    onChange: () => {},
    onClickEdit: () => {},
    onCancelEdit: () => {},
    label: "",
    name: "",
    nameLabel: "Name",
    disabled: false,
    disableUnsetMessage: false,
    editMode: false,
};

export default TimeAndNamePicker;
