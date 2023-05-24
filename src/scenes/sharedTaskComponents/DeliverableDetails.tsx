import React, { useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import DeliverableGridSelect from "../Deliverables/DeliverableGridSelect";
import { Divider, Paper, Skeleton, Stack, Typography } from "@mui/material";
import EditModeToggleButton from "../../components/EditModeToggleButton";
import { DataStore } from "aws-amplify";
import * as models from "../../models";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import { useDispatch } from "react-redux";
import _ from "lodash";
import GetError from "../../ErrorComponents/GetError";
import { useAssignmentRole } from "../../hooks/useAssignmentRole";
import useTaskDeliverables from "../../hooks/useTaskDeliverables";

type DeliverableDetailsProps = {
    taskId: string;
    taskModelType: "Task" | "ScheduledTask";
    hasFullPermissionsOverride?: boolean;
};

const DeliverableDetails: React.FC<DeliverableDetailsProps> = ({
    taskId,
    taskModelType,
    hasFullPermissionsOverride,
}) => {
    const [collapsed, setCollapsed] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    const dispatch = useDispatch();
    const updateDeliverableRef = useRef<
        null | ((value: models.DeliverableType) => Promise<void>)
    >(null);
    const errorMessage = "Sorry, an error occurred";
    const currentUserRole = useAssignmentRole(taskId);
    const hasFullPermissions =
        hasFullPermissionsOverride ??
        currentUserRole === models.Role.COORDINATOR;
    const theme = useTheme();

    const { state, isFetching, error, setState } = useTaskDeliverables(
        taskId,
        taskModelType
    );

    async function updateDeliverable(value: any) {
        // receive DeliverableType from selector component
        // check if one of this DeliverableType has already been saved
        try {
            const existing = Object.values(state).find(
                (d) => d.deliverableType && d.deliverableType.id === value.id
            );
            if (existing) {
                const existingDeliverable = await DataStore.query(
                    models.Deliverable,
                    existing.id
                );
                if (existingDeliverable) {
                    const { id, updatedAt, createdAt, label, ...rest } = value;
                    const updateDeliverable = await DataStore.save(
                        models.Deliverable.copyOf(
                            existingDeliverable,
                            (updated) => {
                                for (const [key, v] of Object.entries(rest)) {
                                    (updated as any)[key] = v;
                                }
                            }
                        )
                    );
                    setState((prevState) => ({
                        ...prevState,
                        [existing.id]: updateDeliverable,
                    }));
                }
            } else {
                setIsPosting(true);
                const { id, updatedAt, createdAt, label, ...rest } = value;
                const deliverableType = await DataStore.query(
                    models.DeliverableType,
                    id
                );
                if (!deliverableType)
                    throw new Error("Deliverable type does not exist");
                let newDeliverable: models.Deliverable;
                if (taskModelType === "Task") {
                    const existingTask = await DataStore.query(
                        models.Task,
                        taskId
                    );
                    if (!existingTask) throw new Error("Task does not exist");
                    newDeliverable = await DataStore.save(
                        new models.Deliverable({
                            task: existingTask,
                            deliverableType,
                            ...rest,
                        })
                    );
                } else {
                    const existingScheduledTask = await DataStore.query(
                        models.ScheduledTask,
                        taskId
                    );
                    if (!existingScheduledTask)
                        throw new Error("Scheduled task does not exist");
                    newDeliverable = await DataStore.save(
                        new models.Deliverable({
                            scheduledTask: existingScheduledTask,
                            deliverableType,
                            ...rest,
                        })
                    );
                }
                setState((prevState) => ({
                    ...prevState,
                    [newDeliverable.id]: newDeliverable,
                }));
            }
            setIsPosting(false);
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
            setIsPosting(false);
        }
    }
    // if this isn't a ref then state is old while using debounce
    updateDeliverableRef.current = updateDeliverable;
    async function deleteDeliverable(deliverableTypeId: string) {
        // receive DeliverableTypeId only from selector component
        // check if one of this DeliverableType has already been saved so we can delete it
        setIsPosting(true);
        const existing = Object.values(state).find(
            (d) => d?.deliverableType?.id === deliverableTypeId
        );
        try {
            if (existing) {
                const existingDeliverable = await DataStore.query(
                    models.Deliverable,
                    existing.id
                );
                if (existingDeliverable)
                    await DataStore.delete(existingDeliverable);
                // remove it from the tracking reference
                setState((prevState) => _.omit(prevState, existing.id));
            }
            setIsPosting(false);
        } catch (error) {
            setIsPosting(false);
            dispatch(displayErrorNotification(errorMessage));
        }
    }
    const contents = collapsed ? (
        state && Object.values(state).length === 0 ? (
            <Typography>No items.</Typography>
        ) : (
            Object.values(state)
                .sort((a, b) => (a?.orderInGrid || 0) - (b?.orderInGrid || 0))
                .map((deliverable) => {
                    let countString = "";
                    if (deliverable.unit === models.DeliverableUnit.NONE) {
                        countString = `x ${deliverable.count}`;
                    } else {
                        countString = `${deliverable.count} x ${deliverable.unit}`;
                    }
                    return (
                        <Stack
                            key={deliverable.id}
                            direction={"row"}
                            justifyContent={"space-between"}
                        >
                            <Typography>
                                {deliverable &&
                                deliverable.deliverableType &&
                                deliverable.deliverableType.label
                                    ? deliverable.deliverableType.label
                                    : "Unknown"}
                            </Typography>
                            <Typography>{countString}</Typography>
                        </Stack>
                    );
                })
        )
    ) : (
        <DeliverableGridSelect
            deliverables={Object.values(state)}
            disabled={isPosting}
            onChange={(value) => {
                //this has to be inline or else state is old}
                if (updateDeliverableRef.current)
                    updateDeliverableRef.current(value);
            }}
            onDelete={deleteDeliverable}
        />
    );
    if (error) {
        return <GetError />;
    } else {
        return (
            <Paper
                sx={{
                    padding: "15px",
                    width: "100%",
                    maxWidth: 400,
                    borderRadius: "1em",
                    [theme.breakpoints.down("sm")]: {
                        maxWidth: "100%",
                    },
                }}
            >
                <Stack
                    direction={"column"}
                    justifyContent={"center"}
                    spacing={1}
                >
                    <Stack
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <Typography variant={"h6"}>Inventory</Typography>
                        {hasFullPermissions && (
                            <EditModeToggleButton
                                value={!collapsed}
                                onChange={() =>
                                    setCollapsed((prevState) => !prevState)
                                }
                            />
                        )}
                    </Stack>
                    <Divider />
                    {isFetching ? (
                        <Stack spacing={1}>
                            <Skeleton
                                variant={"rectangular"}
                                height={30}
                                width={"100%"}
                            />
                            <Skeleton
                                variant={"rectangular"}
                                height={30}
                                width={"100%"}
                            />
                        </Stack>
                    ) : (
                        contents
                    )}
                </Stack>
            </Paper>
        );
    }
};

export default DeliverableDetails;
