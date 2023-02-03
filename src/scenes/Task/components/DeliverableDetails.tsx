import React, { useRef, useState } from "react";
import DeliverableGridSelect from "../../Deliverables/DeliverableGridSelect";
import { Divider, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import EditModeToggleButton from "../../../components/EditModeToggleButton";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { tenantIdSelector } from "../../../redux/Selectors";
import GetError from "../../../ErrorComponents/GetError";
import { useAssignmentRole } from "../../../hooks/useAssignmentRole";
import useTaskDeliverables from "../../../hooks/useTaskDeliverables";
import { convertListDataToObject } from "../../../utilities";

type DeliverableDetailsProps = {
    taskId: string;
};

type DeliverableUpdateValues = {
    [key in keyof models.Deliverable]: models.Deliverable[key];
};

const DeliverableDetails: React.FC<DeliverableDetailsProps> = ({ taskId }) => {
    const cardClasses = dialogCardStyles();
    const [collapsed, setCollapsed] = useState(true);
    const tenantId = useSelector(tenantIdSelector);
    const [isPosting, setIsPosting] = useState(false);
    const dispatch = useDispatch();
    const updateDeliverableRef = useRef<null | ((...args: any[]) => any)>(null);
    const errorMessage = "Sorry, an error occurred";
    const currentUserRole = useAssignmentRole(taskId);
    const hasFullPermissions = currentUserRole === models.Role.COORDINATOR;
    const { state, isFetching, error, setState } = useTaskDeliverables(taskId);

    async function updateDeliverable(value: DeliverableUpdateValues) {
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
                    const updateDeliverable = await DataStore.save(
                        models.Deliverable.copyOf(
                            existingDeliverable,
                            (updated) => {
                                for (const [key, v] of Object.entries(value)) {
                                    (updated as any)[key] = v;
                                }
                            }
                        )
                    );
                    const deliverableType =
                        await updateDeliverable.deliverableType;
                    setState((prevState) => {
                        const converted = {
                            ...convertListDataToObject(prevState),
                            [updateDeliverable.id]: {
                                ...updateDeliverable,
                                deliverableType,
                            },
                        };
                        return Object.values(converted);
                    });
                }
            } else {
                setIsPosting(true);
                const { id, ...rest } = _.omit(
                    value,
                    "deliverableType",
                    "task",
                    "comments",
                    "tenantId"
                );
                const deliverableType = await DataStore.query(
                    models.DeliverableType,
                    id
                );
                if (!deliverableType)
                    throw new Error("Deliverable type does not exist");
                const existingTask = await DataStore.query(models.Task, taskId);
                if (!existingTask) throw new Error("Task does not exist");
                const newDeliverable = await DataStore.save(
                    new models.Deliverable({
                        task: existingTask,
                        deliverableType,
                        tenantId,
                        ...rest,
                    })
                );
                setState((prevState) => {
                    const converted = {
                        ...convertListDataToObject(prevState),
                        [newDeliverable.id]: {
                            ...newDeliverable,
                            deliverableType,
                        },
                    };
                    return Object.values(converted);
                });
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
            (d) => d.deliverableType?.id === deliverableTypeId
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
                setState((prevState) =>
                    prevState.filter((d) => d.id !== existing.id)
                );
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
                .sort((a, b) => (a.orderInGrid || 0) - (b.orderInGrid || 0))
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
            deliverables={state}
            disabled={isPosting}
            onChange={(value) => {
                //this has to be inline or else state is old}
                if (updateDeliverableRef.current) {
                    updateDeliverableRef.current(value);
                }
            }}
            onDelete={deleteDeliverable}
        />
    );
    if (error) {
        return <GetError />;
    } else {
        return (
            <Paper className={cardClasses.root}>
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
                        <Stack
                            data-testid="fetching-deliverable-details"
                            spacing={1}
                        >
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
