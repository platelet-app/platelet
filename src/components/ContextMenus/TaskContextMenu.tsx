import React from "react";
import Menu from "@mui/material/Menu";
import { makeStyles } from "tss-react/mui";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import * as assigneeActions from "../../redux/taskAssignees/taskAssigneesActions";
import * as models from "../../models/index";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../redux/notifications/NotificationsActions";
import { DataStore } from "aws-amplify";
import {
    getRoleView,
    getWhoami,
    taskAssigneesSelector,
    tenantIdSelector,
} from "../../redux/Selectors";
import determineTaskStatus from "../../utilities/determineTaskStatus";
import duplicateTask from "../../utilities/duplicateTask";
import generateClipboardTextFromTask from "../../utilities/generateClipboardTextFromTask";
import { copyStringToClipboard } from "../../utilities/copyStringToClipboard";
import CopyFailedDialog from "../CopyFailedDialog";
import updatePendingTask from "../../utilities/updatePendingTask";

const initialState = {
    mouseX: null,
    mouseY: null,
};

type MouseState = {
    mouseX: null | number;
    mouseY: null | number;
};

type TaskContextMenuProps = {
    task?: models.Task | null;
    iconColor?: string;
};

const TaskContextMenu: React.FC<TaskContextMenuProps> = ({
    task,
    iconColor,
}) => {
    const dispatch = useDispatch();
    const [state, setState] = React.useState<MouseState>(initialState);
    const [copyText, setCopyText] = React.useState<string | null>(null);
    const [isPosting, setIsPosting] = React.useState(false);
    const roleView = useSelector(getRoleView);
    const whoami = useSelector(getWhoami);
    const taskAssignees = useSelector(taskAssigneesSelector).items;
    const tenantId = useSelector(tenantIdSelector);
    const useStyles = makeStyles()({
        taskContextButton: {
            color: iconColor || "primary",
        },
    });
    const { classes } = useStyles();
    const actualRole = ["ALL", models.Role.COORDINATOR].includes(roleView)
        ? models.Role.COORDINATOR
        : models.Role.RIDER;
    async function copyToClipboard(e: React.MouseEvent) {
        handleClose(e);
        if (!task || !task.id) {
            dispatch(displayErrorNotification("Copy failed."));
            return;
        }
        try {
            const taskResult = await DataStore.query(models.Task, task.id);
            if (!taskResult) throw new Error("Task not found.");
            const deliverables = (
                await DataStore.query(models.Deliverable)
            ).filter((d) => d.task && d.task.id === taskResult.id);
            const result = { ...taskResult, deliverables };
            const textToCopy = generateClipboardTextFromTask(result);
            try {
                copyStringToClipboard(textToCopy).then(
                    function () {
                        dispatch(
                            displayInfoNotification("Copied to clipboard")
                        );
                    },
                    function () {
                        setCopyText(textToCopy);
                    }
                );
            } catch (e) {
                setCopyText(textToCopy);
            }
        } catch (e) {
            console.log(e);
            dispatch(displayErrorNotification("Copy failed!"));
        }
    }
    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };
    async function setTimeValue(value: string | null, key: keyof models.Task) {
        try {
            setIsPosting(true);
            if (!task) return;
            const result = await DataStore.query(models.Task, task.id);
            if (result) {
                const status = await determineTaskStatus(
                    {
                        ...result,
                        [key]: value,
                    },
                    taskAssignees.filter(
                        (ta: models.TaskAssignee) =>
                            ta.role === models.Role.RIDER
                    )
                );
                await DataStore.save(
                    models.Task.copyOf(result, (updated) => {
                        // @ts-ignore
                        updated[key] = value;
                        updated.status = status;
                    })
                );
            }
            setIsPosting(false);
        } catch (e) {
            console.log(e);
            setIsPosting(false);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
    }
    function onSelectPickedUp(e: React.MouseEvent) {
        handleClose(e);
        const payload = new Date().toISOString();
        setTimeValue(payload, "timePickedUp");
        dispatch(
            displayInfoNotification("Task marked picked up", () => {
                setTimeValue(null, "timePickedUp");
            })
        );
    }
    function onSelectDroppedOff(e: React.MouseEvent) {
        handleClose(e);
        const payload = new Date().toISOString();
        setTimeValue(payload, "timeDroppedOff");
        dispatch(
            displayInfoNotification("Task marked delivered", () => {
                setTimeValue(null, "timeDroppedOff");
            })
        );
    }
    function onSelectRiderHome(e: React.MouseEvent) {
        handleClose(e);
        const payload = new Date().toISOString();
        setTimeValue(payload, "timeRiderHome");
        dispatch(
            displayInfoNotification("Task marked rider home", () => {
                setTimeValue(null, "timeRiderHome");
            })
        );
    }
    function onSelectCancelled(e: React.MouseEvent) {
        handleClose(e);
        const payload = new Date().toISOString();
        setTimeValue(payload, "timeCancelled");
        dispatch(
            displayInfoNotification("Task marked cancelled", () => {
                setTimeValue(null, "timeCancelled");
            })
        );
    }
    function onSelectRejected(e: React.MouseEvent) {
        handleClose(e);
        const payload = new Date().toISOString();
        setTimeValue(payload, "timeRejected");
        dispatch(
            displayInfoNotification("Task marked rejected", () => {
                setTimeValue(null, "timeRejected");
            })
        );
    }
    async function onDuplicate(e: React.MouseEvent) {
        handleClose(e);
        try {
            if (task) {
                const { assignment } = await duplicateTask(
                    task,
                    tenantId,
                    whoami.id,
                    whoami.id,
                    actualRole
                );
                dispatch(assigneeActions.addTaskAssignee(assignment));
                dispatch(displayInfoNotification("Task duplicated to NEW"));
            }
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
    }

    async function undoUpdatePending(
        task: models.Task,
        assignment: models.TaskAssignee
    ) {
        try {
            const existingTask = await DataStore.query(models.Task, task.id);
            if (existingTask) {
                await DataStore.save(
                    models.Task.copyOf(existingTask, (t) => {
                        t.status = models.TaskStatus.PENDING;
                        t.timeRejected = null;
                    })
                );
            }
            const existingAssignment = await DataStore.query(
                models.TaskAssignee,
                assignment.id
            );
            if (existingAssignment) {
                await DataStore.delete(existingAssignment);
            }
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
    }

    async function onUpdatePending(
        e: React.MouseEvent,
        action: "accept" | "reject"
    ) {
        handleClose(e);
        try {
            if (task) {
                const result = await updatePendingTask(
                    task,
                    whoami.id,
                    tenantId,
                    action
                );
                const message = action === "accept" ? "accepted" : "rejected";
                dispatch(
                    displayInfoNotification(`Task ${message}`, () => {
                        undoUpdatePending(result.task, result.assignment);
                    })
                );
            }
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
    }

    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        setState(initialState);
    };

    const generateKey = (pre: string) => {
        return `${pre}_${task?.id}`;
    };

    let menuItems: JSX.Element[] = [];
    if (task?.status === models.TaskStatus.PENDING) {
        menuItems = [
            <MenuItem
                key={generateKey("pending-accept")}
                onClick={(e) => onUpdatePending(e, "accept")}
            >
                Accept
            </MenuItem>,
            <MenuItem
                key={generateKey("pending-reject")}
                onClick={(e) => onUpdatePending(e, "reject")}
            >
                Reject
            </MenuItem>,
            <MenuItem
                key={generateKey("pending-copy")}
                disabled={task === null}
                onClick={copyToClipboard}
            >
                Copy to clipboard
            </MenuItem>,
        ];
    } else if (task) {
        menuItems = [
            <MenuItem
                key={generateKey("picked-up")}
                disabled={
                    task === null || task.status !== models.TaskStatus.ACTIVE
                }
                onClick={onSelectPickedUp}
            >
                Mark picked up
            </MenuItem>,
            <MenuItem
                key={generateKey("dropped-off")}
                disabled={
                    task === null || task.status !== models.TaskStatus.PICKED_UP
                }
                onClick={onSelectDroppedOff}
            >
                Mark delivered
            </MenuItem>,
            <MenuItem
                key={generateKey("rider-home")}
                disabled={
                    task === null ||
                    task.status !== models.TaskStatus.DROPPED_OFF
                }
                onClick={onSelectRiderHome}
            >
                Mark rider home
            </MenuItem>,
            <MenuItem
                key={generateKey("rejected")}
                disabled={
                    task === null ||
                    [
                        models.TaskStatus.CANCELLED,
                        models.TaskStatus.ABANDONED,
                        models.TaskStatus.REJECTED,
                        models.TaskStatus.DROPPED_OFF,
                        models.TaskStatus.COMPLETED,
                    ].some((s) => s === task.status)
                }
                onClick={onSelectRejected}
            >
                Mark rejected
            </MenuItem>,
            <MenuItem
                key={generateKey("cancelled")}
                disabled={
                    task === null ||
                    [
                        models.TaskStatus.CANCELLED,
                        models.TaskStatus.ABANDONED,
                        models.TaskStatus.REJECTED,
                        models.TaskStatus.DROPPED_OFF,
                        models.TaskStatus.COMPLETED,
                    ].some((s) => s === task.status)
                }
                onClick={onSelectCancelled}
            >
                Mark cancelled
            </MenuItem>,
        ];
        if (actualRole === models.Role.COORDINATOR) {
            menuItems.push(
                <MenuItem
                    key={generateKey("duplicate")}
                    disabled={
                        task === null ||
                        [
                            models.TaskStatus.CANCELLED,
                            models.TaskStatus.ABANDONED,
                            models.TaskStatus.REJECTED,
                            models.TaskStatus.COMPLETED,
                        ].some((s) => s === task.status)
                    }
                    onClick={onDuplicate}
                >
                    Duplicate
                </MenuItem>
            );
        }
        menuItems.push(
            <MenuItem
                key={generateKey("copy-to-clipboard")}
                disabled={task === null}
                onClick={copyToClipboard}
            >
                Copy to clipboard
            </MenuItem>
        );
    }

    if (!task) {
        return null;
    } else {
        return (
            <>
                <IconButton
                    aria-label="task options"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    disabled={isPosting}
                    size="large"
                >
                    <MoreVertIcon className={classes.taskContextButton} />
                </IconButton>
                <Menu
                    keepMounted
                    open={state.mouseY !== null}
                    onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        state.mouseY !== null && state.mouseX !== null
                            ? { top: state.mouseY, left: state.mouseX }
                            : undefined
                    }
                >
                    {menuItems}
                </Menu>
                <CopyFailedDialog
                    text={copyText || ""}
                    onClose={() => setCopyText(null)}
                />
            </>
        );
    }
};

export default TaskContextMenu;
