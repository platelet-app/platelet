import React from "react";
import { TimePicker, TimePickerModal } from "react-native-paper-dates";
import { Button, Dialog, Text } from "react-native-paper";
import { TaskUpdateKey } from "./TaskActions";
import moment from "moment";
import { TouchableOpacity } from "react-native";

type Value = {
    [K in TaskUpdateKey]?: string;
};

type TaskActionsConfirmationDialogProps = {
    open: boolean;
    taskKey: TaskUpdateKey;
    onClose: () => void;
    onConfirm: (value: Value) => void;
    nullify: boolean;
};

const humanReadableConfirmation = (field: TaskUpdateKey, nullify: boolean) => {
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
};

const TaskActionsConfirmationDialog: React.FC<
    TaskActionsConfirmationDialogProps
> = ({ open, taskKey, onClose, onConfirm, nullify }) => {
    const [value, setValue] = React.useState<Date>(new Date());
    const [timePickerOpen, setTimePickerOpen] = React.useState(false);

    const handleConfirm = () => {
        const result = nullify ? null : value.toISOString();
        onConfirm({ [taskKey]: result });
        onClose();
    };

    return (
        <Dialog visible={open} onDismiss={onClose}>
            <Dialog.Title>
                {humanReadableConfirmation(taskKey, nullify)}
            </Dialog.Title>
            <Dialog.Content>
                {!nullify && (
                    <>
                        <TouchableOpacity
                            onPress={() => setTimePickerOpen(true)}
                        >
                            <Text>
                                {moment(value).format("DD/MM/yyyy, HH:mm")}
                            </Text>
                        </TouchableOpacity>
                        <TimePickerModal
                            visible={timePickerOpen}
                            use24HourClock
                            onDismiss={() => setTimePickerOpen(false)}
                            onConfirm={(date) => {
                                const dateCopy = new Date(value);
                                dateCopy.setHours(date.hours);
                                dateCopy.setMinutes(date.minutes);
                                setValue(dateCopy);
                                setTimePickerOpen(false);
                            }}
                            hours={value.getHours()}
                            minutes={value.getMinutes()}
                        />
                    </>
                )}
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={onClose}>Cancel</Button>
                <Button onPress={handleConfirm}>OK</Button>
            </Dialog.Actions>
        </Dialog>
    );
};

export default TaskActionsConfirmationDialog;
