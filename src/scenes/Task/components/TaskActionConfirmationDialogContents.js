import React from "react";
import { Stack, TextField } from "@mui/material";
import PropTypes from "prop-types";
import { DateTimePicker } from "@mui/lab";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { useDispatch } from "react-redux";

function humanReadableConfirmation(field, nullify) {
    switch (field) {
        case "timePickedUp":
            return nullify
                ? "Clear the picked up time?"
                : "Set the picked up time?";
        case "timeDroppedOff":
            return nullify
                ? "Clear the delivered time?"
                : "Set the delivered time?";
        case "timeCancelled":
            return nullify
                ? "Clear the cancelled time?"
                : "Set the cancelled time?";
        case "timeRejected":
            return nullify
                ? "Clear the rejected time?"
                : "Set the rejected time?";
        case "timeRiderHome":
            return nullify
                ? "Clear the rider home time?"
                : "Set the rider home time?";
        default:
            return "";
    }
}

function TaskActionConfirmationDialogContents(props) {
    const [time, setTime] = React.useState(new Date());
    const [nameInput, setNameInput] = React.useState("");
    const dispatch = useDispatch();

    function handleTimeChange(value) {
        setTime(value);
        props.onChangeTime(value);
    }

    const needsName =
        !props.nullify &&
        ["timePickedUp", "timeDroppedOff"].includes(props.timeKey);

    let nameField = null;
    if (needsName) {
        const label =
            props.timeKey === "timePickedUp" ? "Sender name" : "Recipient name";
        nameField = (
            <TextField
                label={label}
                inputProps={{
                    "aria-label": label,
                }}
                fullWidth
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
            />
        );
    }

    async function handleConfirmation() {
        const result = {
            [props.timeKey]: props.nullify ? null : time.toISOString(),
        };
        if (needsName) {
            try {
                if (props.timeKey === "timePickedUp") {
                    result["timePickedUpSenderName"] = nameInput;
                } else {
                    result["timeDroppedOffRecipientName"] = nameInput;
                }
            } catch (e) {
                dispatch(
                    displayErrorNotification("Sorry, something went wrong")
                );
            }
        }
        props.onConfirmation(result);
    }

    return (
        <ConfirmationDialog
            open={props.timeKey !== null}
            dialogTitle={humanReadableConfirmation(
                props.timeKey,
                props.nullify
            )}
            onConfirmation={handleConfirmation}
            onClose={() => {
                if (props.nullify) props.onClose();
            }}
            onCancel={props.onClose}
        >
            <Stack spacing={3} sx={{ minWidth: props.nullify ? 0 : 300 }}>
                {!props.nullify && (
                    <DateTimePicker
                        label={props.label}
                        value={time}
                        inputFormat={"dd/MM/yyyy HH:mm"}
                        openTo="hours"
                        onChange={handleTimeChange}
                        renderInput={(params) => (
                            <TextField
                                variant={"standard"}
                                fullWidth
                                {...params}
                            />
                        )}
                    />
                )}
                {nameField}
            </Stack>
        </ConfirmationDialog>
    );
}

TaskActionConfirmationDialogContents.propTypes = {
    timeKey: PropTypes.oneOf([
        "timePickedUp",
        "timeDroppedOff",
        "timeRejected",
        "timeCancelled",
        "timeRiderHome",
    ]).isRequired,
    nullify: PropTypes.bool,
    onChangeTime: PropTypes.func,
    onClose: PropTypes.func,
};

TaskActionConfirmationDialogContents.defaultProps = {
    nullify: false,
    onChangeTime: () => {},
    onClose: () => {},
};

export default TaskActionConfirmationDialogContents;
