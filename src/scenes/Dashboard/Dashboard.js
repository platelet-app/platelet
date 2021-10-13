import React, { useEffect, useRef, useState } from "react";
import "../../App.css";
import { useHistory } from "react-router";
import "typeface-roboto";
import * as models from "../../models/index";
import Paper from "@material-ui/core/Paper";
import { setRoleView } from "../../redux/Actions";
import TasksGrid from "./components/TasksGrid";
import { useDispatch, useSelector } from "react-redux";
import {
    DashboardDetailTabs,
    TabPanel,
} from "./components/DashboardDetailTabs";
import {
    convertListDataToObject,
    decodeUUID,
    determineTaskStatus,
    getDashboardRoleMode,
    saveDashboardRoleMode,
} from "../../utilities";
import { dataStoreReadyStatusSelector, getWhoami } from "../../redux/Selectors";
import { tasksStatus } from "../../apiConsts";
import { DataStore } from "aws-amplify";
import TasksGridSkeleton from "./components/TasksGridSkeleton";
import _ from "lodash";
import TaskDialogCompact from "../Task/TaskDialogCompact";

const initialTasksState = {
    tasksNew: {},
    tasksActive: {},
    tasksPickedUp: {},
    tasksDroppedOff: {},
    tasksRejected: {},
    tasksCancelled: {},
};
function findTask(tasks, taskId) {
    for (const taskKey of Object.keys(initialTasksState)) {
        if (tasks[taskKey][taskId])
            return { task: tasks[taskKey][taskId], key: taskKey };
    }
    return { task: undefined, key: undefined };
}

function getKeyFromEnum(value) {
    switch (value) {
        case tasksStatus.new:
            return "tasksNew";
        case tasksStatus.active:
            return "tasksActive";
        case tasksStatus.pickedUp:
            return "tasksPickedUp";
        case tasksStatus.droppedOff:
            return "tasksDroppedOff";
        case tasksStatus.cancelled:
            return "tasksCancelled";
        case tasksStatus.rejected:
            return "tasksRejected";
        default:
            return "";
    }
}

function Dashboard(props) {
    const dispatch = useDispatch();
    const mobileView = useSelector((state) => state.mobileView);
    const whoami = useSelector(getWhoami);
    const [postPermission, setPostPermission] = useState(true);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [viewMode, setViewMode] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const roleView = useSelector((state) => state.roleView);
    const [tasks, setTasks] = useState(initialTasksState);
    const history = useHistory();
    const tasksSubscription = useRef({
        unsubscribe: () => {},
    });

    function setInitialRoleView() {
        if (whoami.id) {
            const savedRoleMode = getDashboardRoleMode();
            if (
                whoami.roles.includes(savedRoleMode) ||
                (savedRoleMode === "all" &&
                    whoami.roles.includes("COORDINATOR"))
            ) {
                dispatch(setRoleView(savedRoleMode));
            } else if (whoami.roles.includes("COORDINATOR")) {
                dispatch(setRoleView("coordinator"));
                saveDashboardRoleMode("coordinator");
            } else if (whoami.roles.includes("RIDER")) {
                dispatch(setRoleView("rider"));
                saveDashboardRoleMode("rider");
            }
        }
    }
    useEffect(setInitialRoleView, [whoami]);

    function getTasks() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
            return;
        } else {
            DataStore.query(models.Task, (task) =>
                task.status("eq", tasksStatus.new)
            ).then((result) => {
                const resultObject = convertListDataToObject(result);
                setTasks((prevState) => ({
                    ...prevState,
                    tasksNew: resultObject,
                }));
            });
            DataStore.query(models.Task, (task) =>
                task.status("eq", tasksStatus.active)
            ).then((result) => {
                const resultObject = convertListDataToObject(result);
                setTasks((prevState) => ({
                    ...prevState,
                    tasksActive: resultObject,
                }));
            });
            DataStore.query(models.Task, (task) =>
                task.status("eq", tasksStatus.pickedUp)
            ).then((result) => {
                const resultObject = convertListDataToObject(result);
                setTasks((prevState) => ({
                    ...prevState,
                    tasksPickedUp: resultObject,
                }));
            });
            DataStore.query(models.Task, (task) =>
                task.status("eq", tasksStatus.droppedOff)
            ).then((result) => {
                const resultObject = convertListDataToObject(result);
                setTasks((prevState) => ({
                    ...prevState,
                    tasksDroppedOff: resultObject,
                }));
            });
            DataStore.query(models.Task, (task) =>
                task.status("eq", tasksStatus.cancelled)
            ).then((result) => {
                const resultObject = convertListDataToObject(result);
                setTasks((prevState) => ({
                    ...prevState,
                    tasksCancelled: resultObject,
                }));
            });
            DataStore.query(models.Task, (task) =>
                task.status("eq", tasksStatus.rejected)
            ).then((result) => {
                const resultObject = convertListDataToObject(result);
                setTasks((prevState) => ({
                    ...prevState,
                    tasksRejected: resultObject,
                }));
            });
            tasksSubscription.current.unsubscribe();
            tasksSubscription.current = DataStore.observe(
                models.Task
            ).subscribe(async (newTask) => {
                console.log(newTask.element);
                const task = newTask.element;
                addTaskToState(task);
            });
            setIsFetching(false);
        }
    }

    useEffect(() => getTasks(), [roleView, dataStoreReadyStatus]);
    console.log(tasks);

    useEffect(() => {
        return () => {
            if (tasksSubscription.current)
                tasksSubscription.current.unsubscribe();
        };
    }, []);

    function addTaskToState(task) {
        setTasks((prevState) => {
            let key;
            if (task.status) {
                switch (task.status) {
                    case tasksStatus.new:
                        key = "tasksNew";
                        break;
                    case tasksStatus.active:
                        key = "tasksActive";
                        break;
                    case tasksStatus.pickedUp:
                        key = "tasksPickedUp";
                        break;
                    case tasksStatus.droppedOff:
                        key = "tasksDroppedOff";
                        break;
                    case tasksStatus.cancelled:
                        key = "tasksCancelled";
                        break;
                    case tasksStatus.rejected:
                        key = "tasksRejected";
                        break;
                    default:
                        key = undefined;
                }
            }
            let taskResult;
            if (!!!task.createdAt) {
                const d = new Date();
                taskResult = { ...task, createdAt: d.toISOString() };
            } else {
                taskResult = task;
            }
            const current = findTask(prevState, task.id);
            if (task.status) {
                const omitted = _.omit(prevState[current.key], task.id);
                const newList = {
                    ...prevState[key],
                    [task.id]: { ...current.task, ...task },
                };
                return {
                    ...prevState,
                    [current.key]: omitted,
                    [key]: newList,
                };
            } else {
                return {
                    ...prevState,
                    [current.key]: {
                        ...prevState[current.key],
                        [taskResult.id]: { ...current.task, ...taskResult },
                    },
                };
            }
        });
    }

    async function addTask() {
        const date = new Date();
        const timeOfCall = date.toISOString();
        const newRequesterContact = await DataStore.save(
            new models.AddressAndContactDetails({})
        );
        const newTask = await DataStore.save(
            new models.Task({
                status: tasksStatus.new,
                timeOfCall,
                taskRequesterContactId: newRequesterContact.id,
            })
        );
        addTaskToState(newTask);
    }
    function handleDialogClose(e) {
        e.stopPropagation();
        if (props.location.state) history.goBack();
        else history.push("/");
    }

    const dialog = props.match.params.task_uuid_b62 ? (
        <TaskDialogCompact
            onClose={handleDialogClose}
            location={props.location}
            taskId={decodeUUID(props.match.params.task_uuid_b62)}
        />
    ) : (
        <></>
    );
    if (isFetching) {
        return <TasksGridSkeleton />;
    } else {
        return (
            <>
                <Paper elevation={3}>
                    <DashboardDetailTabs
                        value={viewMode}
                        onChange={(event, newValue) => setViewMode(newValue)}
                    >
                        <TabPanel value={0} index={0}>
                            <TasksGrid
                                tasks={tasks}
                                onAddTaskClick={addTask}
                                fullScreenModal={mobileView}
                                modalView={"edit"}
                                hideRelayIcons={roleView === "rider"}
                                hideAddButton={!postPermission}
                                excludeColumnList={
                                    viewMode === 1
                                        ? [
                                              "tasksNew",
                                              "tasksActive",
                                              "tasksPickedUp",
                                          ]
                                        : [
                                              roleView === "rider"
                                                  ? "tasksNew"
                                                  : "",
                                              "tasksDroppedOff",
                                              "tasksCancelled",
                                              "tasksRejected",
                                          ]
                                }
                            />
                        </TabPanel>
                    </DashboardDetailTabs>
                </Paper>
                {dialog}
            </>
        );
    }
}

export default Dashboard;
