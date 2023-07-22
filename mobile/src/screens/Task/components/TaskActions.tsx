import { DataStore } from "aws-amplify";
import React from "react";
import { Card, ToggleButton } from "react-native-paper";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import useModelSubscription from "../../../hooks/useModelSubscription";
import * as models from "../../../models";
import determineTaskStatus, {
    TaskInterface,
} from "../../../utilities/determineTaskStatus";
import { saveTaskTimeWithKeyReactNative } from "../utilities";
import TaskTimePicker from "./TaskTimePicker";
import TaskActionsConfirmationDialog from "./TaskActionsConfirmationDialog";

type TaskActionsProps = {
    taskId: string;
};

const fields = {
    timePickedUp: "Picked up",
    timeDroppedOff: "Delivered",
    timeCancelled: "Cancelled",
    timeRejected: "Rejected",
    timeRiderHome: "Rider home",
};

export type TaskUpdateKey = keyof Omit<TaskInterface, "id">;

const TaskActions: React.FC<TaskActionsProps> = ({ taskId }) => {
    const [buttonsState, setButtonsState] = React.useState<TaskUpdateKey[]>([]);
    const [isPosting, setIsPosting] = React.useState(false);
    const [confirmationKey, setConfirmationKey] =
        React.useState<TaskUpdateKey | null>(null);
    const [editKey, setEditKey] = React.useState<Omit<
        TaskUpdateKey,
        "id"
    > | null>(null);
    const { state, isFetching, error } = useModelSubscription<models.Task>(
        models.Task,
        taskId
    );
    const errorMessage = "Sorry, something went wrong";
    const hasFullPermissions = true;

    function onClickToggle(key: TaskUpdateKey) {
        setConfirmationKey(key);
    }

    function onClickEdit(key: TaskUpdateKey) {
        setEditKey(key);
    }
    function onCancelEdit() {
        setEditKey(null);
    }

    async function setTimeWithKey(key: TaskUpdateKey, value: string | Date) {
        setIsPosting(true);
        setEditKey(null);
        try {
            await saveTaskTimeWithKeyReactNative(key, value, taskId);
            setIsPosting(false);
        } catch (error) {
            console.log(error);
            setIsPosting(false);
            //dispatch(displayErrorNotification(errorMessage));
        }
    }

    async function saveValues(values: Partial<TaskInterface>) {
        setIsPosting(true);
        setConfirmationKey(null);
        try {
            const existingTask = await DataStore.query(models.Task, taskId);
            if (!existingTask) {
                throw new Error("Task not found");
            }
            const status = await determineTaskStatus({
                ...existingTask,
                ...values,
            });
            const updatedTask = await DataStore.save(
                models.Task.copyOf(existingTask, (upd) => {
                    upd.status = status;
                    for (const key in values) {
                        upd[key as keyof Omit<TaskInterface, "id">] =
                            values[key as keyof TaskInterface];
                    }
                })
            );
        } catch (e) {
            console.log(e);
            //dispatch(displayErrorNotification("Sorry, something went wrong"));
        } finally {
            setIsPosting(false);
            setEditKey(null);
        }
    }

    function calculateState() {
        if (!state) return;
        const result = Object.keys(fields).filter((key) => {
            return !!state[key as keyof typeof fields];
        });
        setButtonsState(result as TaskUpdateKey[]);
    }
    React.useEffect(calculateState, [state]);

    const getIcon = (key: TaskUpdateKey) => {
        if (buttonsState.includes(key)) return "checkbox-marked-outline";
        return "checkbox-blank-outline";
    };

    function checkDisabled(key: TaskUpdateKey) {
        if (!hasFullPermissions || state?.status === models.TaskStatus.PENDING)
            return true;
        const stopped =
            buttonsState.includes("timeCancelled") ||
            buttonsState.includes("timeRejected");
        if (key === "timeDroppedOff")
            return (
                buttonsState.includes("timeRiderHome") ||
                !buttonsState.includes("timePickedUp") ||
                stopped
            );
        else if (key === "timePickedUp") {
            return buttonsState.includes("timeDroppedOff") || stopped;
        } else if (key === "timeRiderHome") {
            if (state?.status === models.TaskStatus.NEW) return true;
            return !buttonsState.includes("timeDroppedOff");
        } else if (key === "timeRejected") {
            if (buttonsState.includes("timeRejected")) return false;
            return (
                (buttonsState.includes("timePickedUp") &&
                    buttonsState.includes("timeDroppedOff")) ||
                stopped
            );
        } else if (key === "timeCancelled") {
            if (buttonsState.includes("timeCancelled")) return false;
            return (
                (buttonsState.includes("timePickedUp") &&
                    buttonsState.includes("timeDroppedOff")) ||
                stopped
            );
        } else return false;
    }
    return (
        <>
            <Card
                style={{
                    padding: 8,
                }}
            >
                <View>
                    {Object.entries(fields).map(([key, value], index) => {
                        let borderTopLeftRadius = 0;
                        let borderTopRightRadius = 0;
                        let borderBottomLeftRadius = 0;
                        let borderBottomRightRadius = 0;
                        if (index === 0) {
                            borderTopLeftRadius = 8;
                            borderTopRightRadius = 8;
                        }
                        if (index === Object.entries(fields).length - 1) {
                            borderBottomLeftRadius = 8;
                            borderBottomRightRadius = 8;
                        }
                        const disabled = checkDisabled(key as TaskUpdateKey);

                        return (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 8,
                                }}
                                key={key}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 8,
                                    }}
                                >
                                    <ToggleButton
                                        size={30}
                                        disabled={checkDisabled(
                                            key as TaskUpdateKey
                                        )}
                                        onPress={() => {
                                            onClickToggle(key as TaskUpdateKey);
                                        }}
                                        style={{
                                            height: 50,
                                            borderWidth: 0.4,
                                            borderTopLeftRadius,
                                            borderTopRightRadius,
                                            borderBottomLeftRadius,
                                            borderBottomRightRadius,
                                        }}
                                        icon={getIcon(key as TaskUpdateKey)}
                                        value={key}
                                        status={
                                            buttonsState.includes(
                                                key as TaskUpdateKey
                                            )
                                                ? "checked"
                                                : "unchecked"
                                        }
                                    />
                                    <TouchableOpacity
                                        disabled={disabled}
                                        onPress={() => {
                                            onClickToggle(key as TaskUpdateKey);
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                opacity: disabled ? 0.5 : 1,
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            {value}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <TaskTimePicker
                                    onChange={() => {}}
                                    time={state?.[key as keyof TaskInterface]}
                                />
                            </View>
                        );
                    })}
                </View>
            </Card>
            <TaskActionsConfirmationDialog
                key={confirmationKey}
                nullify={!!state?.[confirmationKey as keyof TaskInterface]}
                taskKey={confirmationKey as TaskUpdateKey}
                open={!!confirmationKey}
                onClose={() => setConfirmationKey(null)}
                onConfirm={saveValues}
            />
        </>
    );
};

export default TaskActions;
