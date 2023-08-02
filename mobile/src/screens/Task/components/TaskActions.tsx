import { DataStore } from "aws-amplify";
import * as React from "react";
import { Card, ToggleButton, Text } from "react-native-paper";
import { TouchableOpacity, View } from "react-native";
import useModelSubscription from "../../../hooks/useModelSubscription";
import * as models from "../../../models";
import determineTaskStatus, {
    TaskInterface,
} from "../../../utilities/determineTaskStatus";
import TaskTimePicker from "./TaskTimePicker";
import TaskActionsConfirmationDialog from "./TaskActionsConfirmationDialog";
import GenericErrorSnack from "../../../snacks/GenericErrorSnack";

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
    const [editKey, setEditKey] = React.useState<TaskUpdateKey | null>(null);
    const { state, setState, isFetching, error } =
        useModelSubscription<models.Task>(models.Task, taskId);
    const [snackVisible, setSnackVisible] = React.useState(false);
    const hasFullPermissions = true;

    function onClickToggle(key: TaskUpdateKey) {
        setConfirmationKey(key);
    }

    function onClickEdit(key: TaskUpdateKey) {
        setEditKey(key);
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
            setState(updatedTask);
        } catch (e) {
            console.log(e);
            setSnackVisible(true);
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
        if (
            error ||
            isFetching ||
            isPosting ||
            !hasFullPermissions ||
            state?.status === models.TaskStatus.PENDING
        )
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

    let nameKey:
        | "timePickedUpSenderName"
        | "timeDroppedOffRecipientName"
        | null = null;
    if ([confirmationKey, editKey].includes("timePickedUp"))
        nameKey = "timePickedUpSenderName";
    else if ([confirmationKey, editKey].includes("timeDroppedOff"))
        nameKey = "timeDroppedOffRecipientName";

    return (
        <>
            <Card>
                <Card.Content>
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

                        let showInfo = false;
                        if (
                            key === "timePickedUp" &&
                            state?.timePickedUpSenderName
                        ) {
                            showInfo = true;
                        } else if (
                            key === "timeDroppedOff" &&
                            state?.timeDroppedOffRecipientName
                        ) {
                            showInfo = true;
                        }

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
                                        aria-label={value}
                                        onPress={() => {
                                            onClickToggle(key as TaskUpdateKey);
                                        }}
                                        style={{
                                            height: 53,
                                            width: 53,
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
                                <TouchableOpacity
                                    onPress={() => {
                                        onClickEdit(key as TaskUpdateKey);
                                    }}
                                >
                                    <TaskTimePicker
                                        time={
                                            state?.[key as keyof TaskInterface]
                                        }
                                        onClickEdit={() =>
                                            onClickEdit(key as TaskUpdateKey)
                                        }
                                        infoIcon={showInfo}
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </Card.Content>
            </Card>
            <TaskActionsConfirmationDialog
                key={confirmationKey || "confirmationDialog"}
                nullify={!!state?.[confirmationKey as keyof TaskInterface]}
                taskKey={confirmationKey as TaskUpdateKey}
                nameKey={nameKey}
                open={!!confirmationKey}
                onClose={() => setConfirmationKey(null)}
                onConfirm={saveValues}
            />
            <TaskActionsConfirmationDialog
                key={editKey || "editDialog"}
                startingValue={state?.[editKey as keyof TaskInterface]}
                nullify={false}
                startingNameValue={state?.[nameKey as keyof TaskInterface]}
                taskKey={editKey as TaskUpdateKey}
                nameKey={nameKey}
                open={!!editKey}
                onClose={() => setEditKey(null)}
                onConfirm={saveValues}
            />
            <GenericErrorSnack
                visible={snackVisible}
                onDismiss={() => setSnackVisible(false)}
            />
        </>
    );
};

export default TaskActions;
