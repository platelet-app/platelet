import * as React from "react";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { TaskUpdateKey } from "./TaskActions";
import moment from "moment";
import { TouchableOpacity, View } from "react-native";
import TaskDateTimeTextInput from "./TaskDateTimeTextInput";

type Value = {
    [K in TaskUpdateKey]?: string;
};

type TaskActionsConfirmationDialogProps = {
    startingValue?: string | Date | null;
    startingNameValue?: string | null;
    open: boolean;
    taskKey: TaskUpdateKey | null;
    nameKey?: "timePickedUpSenderName" | "timeDroppedOffRecipientName" | null;
    onClose: () => void;
    onConfirm: (value: Value) => void;
    nullify: boolean;
    needsReason?: boolean;
    reasonBody?: string;
    onChangeReasonBody?: (reasonBody: string) => void;
};

const humanReadableName = (
    nameKey: "timePickedUpSenderName" | "timeDroppedOffRecipientName"
) => {
    switch (nameKey) {
        case "timePickedUpSenderName":
            return "Sender name";
        case "timeDroppedOffRecipientName":
            return "Recipient name";
        default:
            return "";
    }
};

const humanReadableConfirmation = (
    field: TaskUpdateKey | null,
    nullify: boolean
) => {
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
> = ({
    startingValue,
    startingNameValue,
    open,
    taskKey,
    nameKey = null,
    onClose,
    onConfirm,
    nullify,
    needsReason = false,
    onChangeReasonBody,
}) => {
    const [value, setValue] = React.useState<Date>(
        startingValue ? new Date(startingValue) : new Date()
    );
    const [timePickerOpen, setTimePickerOpen] = React.useState(false);
    const [datePickerOpen, setDatePickerOpen] = React.useState(false);
    const nameValue = React.useRef(startingNameValue || "");

    const setNameValue = (value: string) => {
        nameValue.current = value;
    };

    const handleConfirm = () => {
        if (!taskKey) return;
        const result = nullify ? null : value.toISOString();
        if (nameKey) {
            onConfirm({
                [taskKey]: result,
                [nameKey]: nameValue.current || null,
            });
        } else {
            onConfirm({ [taskKey]: result });
        }
        onClose();
    };

    return (
        <Portal>
            <Dialog visible={open} onDismiss={onClose}>
                <Dialog.Title>
                    {humanReadableConfirmation(taskKey, nullify)}
                </Dialog.Title>
                <Dialog.Content>
                    {!nullify && (
                        <>
                            <TouchableOpacity
                                onPress={() => setDatePickerOpen(true)}
                            >
                                <View>
                                    <TaskDateTimeTextInput
                                        value={moment(value).format(
                                            "DD/MM/YYYY"
                                        )}
                                        label="Date"
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setTimePickerOpen(true)}
                            >
                                <View>
                                    <TaskDateTimeTextInput
                                        value={moment(value).format("HH:mm")}
                                        label="Time"
                                    />
                                </View>
                            </TouchableOpacity>
                            {nameKey && (
                                <TextInput
                                    mode="outlined"
                                    defaultValue={startingNameValue || ""}
                                    onChangeText={setNameValue}
                                    aria-label={humanReadableName(nameKey)}
                                    placeholder={humanReadableName(nameKey)}
                                />
                            )}
                            {needsReason && (
                                <TextInput
                                    mode="outlined"
                                    onChangeText={onChangeReasonBody}
                                    aria-label="Reason"
                                    placeholder="Reason..."
                                    multiline
                                />
                            )}
                        </>
                    )}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onClose}>Cancel</Button>
                    <Button onPress={handleConfirm}>OK</Button>
                </Dialog.Actions>
            </Dialog>
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
            <DatePickerModal
                locale="en-GB"
                visible={datePickerOpen}
                onDismiss={() => setDatePickerOpen(false)}
                mode="single"
                onConfirm={({ date }) => {
                    if (date) {
                        const dateCopy = new Date(value);
                        dateCopy.setFullYear(date.getFullYear());
                        dateCopy.setMonth(date.getMonth());
                        dateCopy.setDate(date.getDate());
                        setValue(dateCopy);
                        setDatePickerOpen(false);
                    }
                }}
                date={value}
            />
        </Portal>
    );
};

export default TaskActionsConfirmationDialog;
