import React, { useEffect, useRef, useState } from "react";
import TaskDetailsEstablishment from "./TaskDetailsEstablishment";
import Typography from "@mui/material/Typography";
import LabelItemPair from "../../../components/LabelItemPair";
import PrioritySelect from "./PrioritySelect";
import PropTypes from "prop-types";
import TimePicker from "./TimePicker";
import { Divider, Paper, Skeleton, Stack } from "@mui/material";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { useDispatch, useSelector } from "react-redux";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { dataStoreModelSyncedStatusSelector } from "../../../redux/Selectors";
import GetError from "../../../ErrorComponents/GetError";
import RequesterContact from "./RequesterContact";
import { userRoles } from "../../../apiConsts";
import { useAssignmentRole } from "../../../hooks/useAssignmentRole";
import RiderResponsibilityDetail from "./RiderResponsibilityDetail";

function TaskDetailsPanel(props) {
    const { classes } = dialogCardStyles();
    const [state, setState] = useState({
        reference: null,
        timeOfCall: null,
        timePickedUp: null,
        timeDroppedOff: null,
        priority: null,
        riderResponsibility: null,
        id: null,
        establishmentLocation: null,
        requesterContact: {
            name: null,
            telephoneNumber: null,
        },
    });
    const [isFetching, setIsFetching] = useState(true);
    const [errorState, setErrorState] = useState(null);
    const [editTimeOfCall, setEditTimeOfCall] = useState(false);
    const taskObserver = useRef({ unsubscribe: () => {} });
    const dispatch = useDispatch();
    const currentUserRole = useAssignmentRole(state.id);
    const hasFullPermissions = currentUserRole === userRoles.coordinator;

    const taskModelsSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Task;

    const errorMessage = "Sorry, something went wrong";

    const getTask = React.useCallback(async (taskId) => {
        try {
            const task = await DataStore.query(models.Task, taskId);
            if (!task) throw new Error("Task not found");
            setState(task);
            setIsFetching(false);
            taskObserver.current.unsubscribe();
            taskObserver.current = DataStore.observe(
                models.Task,
                taskId
            ).subscribe(async (observeResult) => {
                const taskData = observeResult.element;
                if (["INSERT", "UPDATE"].includes(observeResult.opType)) {
                    if (taskData.establishmentLocationId) {
                        const establishmentLocation = await DataStore.query(
                            models.Location,
                            taskData.establishmentLocationId
                        );
                        setState({ ...taskData, establishmentLocation });
                    } else {
                        setState(taskData);
                    }
                } else if (observeResult.opType === "DELETE") {
                    setErrorState(new Error("Task was deleted"));
                }
            });
        } catch (error) {
            console.log(error);
            setErrorState(error);
            setIsFetching(false);
        }
    }, []);
    useEffect(
        () => getTask(props.taskId),
        [props.taskId, taskModelsSynced, getTask]
    );
    useEffect(() => () => taskObserver.current.unsubscribe(), []);

    async function setTimeOfCall(value) {
        try {
            const result = await DataStore.query(models.Task, props.taskId);
            if (!result) throw new Error("Task doesn't exist");
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated.timeOfCall = value.toISOString();
                })
            );
            setEditTimeOfCall(false);
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }
    async function selectPriority(priority) {
        try {
            const result = await DataStore.query(models.Task, props.taskId);
            if (!result) throw new Error("Task doesn't exist");
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated.priority = priority;
                })
            );
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    async function setEstablishmentLocation(value) {
        try {
            const result = await DataStore.query(models.Task, props.taskId);
            if (!result) throw new Error("Task doesn't exist");
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated.establishmentLocation = value;
                })
            );
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    async function setRiderResponsibility(riderResponsibility) {
        try {
            const result = await DataStore.query(models.Task, props.taskId);
            if (!result) throw new Error("Task doesn't exist");
            await DataStore.save(
                models.Task.copyOf(result, (updated) => {
                    updated.riderResponsibility = riderResponsibility;
                })
            );
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    async function updateRequesterContact(requesterValue) {
        try {
            const result = await DataStore.query(models.Task, props.taskId);
            if (!result) throw new Error("Task doesn't exist");
            if (!result.requesterContact) {
                await DataStore.save(
                    models.Task.copyOf(result, (updated) => {
                        updated.requesterContact = requesterValue;
                    })
                );
            } else {
                await DataStore.save(
                    models.Task.copyOf(result, (updated) => {
                        for (const [key, value] of Object.entries(
                            requesterValue
                        )) {
                            updated.requesterContact[key] = value;
                        }
                    })
                );
            }
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    }

    if (errorState) {
        return <GetError />;
    } else if (isFetching) {
        return (
            <Paper className={classes.root}>
                <Skeleton variant="rectangular" width="100%" height={200} />
            </Paper>
        );
    } else {
        return (
            <Paper className={classes.root}>
                <Stack direction={"column"} spacing={1}>
                    {state.reference && (
                        <LabelItemPair label={"Reference"}>
                            <Typography>{state.reference}</Typography>
                        </LabelItemPair>
                    )}
                    <LabelItemPair label={"Time of call"}>
                        <TimePicker
                            key={editTimeOfCall}
                            onChange={setTimeOfCall}
                            editMode={editTimeOfCall}
                            label="Time of call"
                            onClickEdit={() => setEditTimeOfCall(true)}
                            onCancelEdit={() => setEditTimeOfCall(false)}
                            disableClear
                            time={state.timeOfCall}
                            hideEditIcon={!hasFullPermissions}
                        />
                    </LabelItemPair>
                    {hasFullPermissions && (
                        <TaskDetailsEstablishment
                            value={state.establishmentLocation}
                            onChange={setEstablishmentLocation}
                        />
                    )}
                    {hasFullPermissions && <Divider />}
                    {hasFullPermissions && (
                        <>
                            <RequesterContact
                                onChange={(value) =>
                                    updateRequesterContact(value)
                                }
                                telephoneNumber={
                                    state.requesterContact
                                        ? state.requesterContact.telephoneNumber
                                        : null
                                }
                                hideEditIcon={!hasFullPermissions}
                                name={
                                    state.requesterContact
                                        ? state.requesterContact.name
                                        : null
                                }
                            />
                            <Divider />
                        </>
                    )}
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography>Priority:</Typography>
                        {hasFullPermissions ? (
                            <PrioritySelect
                                onSelect={selectPriority}
                                priority={state.priority}
                            />
                        ) : (
                            <Typography>{state.priority}</Typography>
                        )}
                    </Stack>
                    {hasFullPermissions && <Divider />}
                    {(hasFullPermissions || state.riderResponsibility) && (
                        <LabelItemPair label={"Rider role"}>
                            {hasFullPermissions ? (
                                <RiderResponsibilityDetail
                                    key={state.riderResponsibility}
                                    value={state.riderResponsibility}
                                    onSelect={setRiderResponsibility}
                                />
                            ) : (
                                <Typography>
                                    {state.riderResponsibility}
                                </Typography>
                            )}
                        </LabelItemPair>
                    )}
                </Stack>
            </Paper>
        );
    }
}

TaskDetailsPanel.propTypes = {
    taskId: PropTypes.string.isRequired,
};

export default TaskDetailsPanel;
