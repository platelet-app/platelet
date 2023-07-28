import * as React from "react";
import { useTheme } from "@mui/styles";
import { DateTimePicker } from "@mui/lab";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { useDispatch } from "react-redux";
import { TaskUpdateKeys } from "./TaskActions";
import { Dialog, Portal, TextInput } from "react-native-paper";
import { View } from "react-native/types";

function humanReadableConfirmation(
    field: TaskUpdateKeys | null,
    nullify: boolean
) {
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

type TaskActionConfirmationDialogContentsProps = {
    timeKey: TaskUpdateKeys | null;
    nullify: boolean;
    label: string;
    onChangeTime: (value: Date) => void;
    onConfirmation: (value: Date) => void;
    onClose: () => void;
};

const TaskActionConfirmationDialogContents: React.FC<
    TaskActionConfirmationDialogContentsProps
> = ({
    timeKey = null,
    nullify = false,
    label = "",
    onChangeTime = () => {},
    onConfirmation,
    onClose = () => {},
}) => {
    const [time, setTime] = React.useState(new Date());
    const [errorState, setErrorState] = React.useState(false);
    const [nameInput, setNameInput] = React.useState("");
    const dispatch = useDispatch();

    const theme = useTheme();

    function handleTimeChange(value) {
        setTime(value);
        onChangeTime(value);
        setErrorState(false);
    }

    const needsName =
        !nullify &&
        ["timePickedUp", "timeDroppedOff"].some((key) => key === timeKey);

    let nameField = null;
    if (needsName) {
        const textfieldLabel =
            timeKey === "timePickedUp" ? "Sender name" : "Recipient name";
        nameField = (
            <TextInput
                label={textfieldLabel}
                value={nameInput}
                onChangeText={(value) => setNameInput(value)}
            />
        );
    }

    async function handleConfirmation() {
        const result = {
            [timeKey]: nullify ? null : time.toISOString(),
        };
        if (needsName) {
            try {
                if (timeKey === "timePickedUp") {
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
        onConfirmation(result);
    }

    return (
        <Portal>
            <Dialog visible={timeKey !== null} onDismiss={onClose}>
                <Dialog.Title>
                    {humanReadableConfirmation(timeKey, nullify)}
                </Dialog.Title>
                <View>
                    {!nullify && (
                        <DateTimePicker
                            label={label}
                            disableFuture
                            onError={() => setErrorState(true)}
                            value={time}
                            inputFormat={"dd/MM/yyyy HH:mm"}
                            openTo="hours"
                            onChange={handleTimeChange}
                            renderInput={(params) => (
                                <TextField fullWidth {...params} />
                            )}
                        />
                    )}
                    {nameField}
                </View>
            </Dialog>
        </Portal>
    );
};

export default TaskActionConfirmationDialogContents;
