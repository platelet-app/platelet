import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {AddCircleButton} from "../components/Buttons";
import TaskItem from "./TaskItem";
import {orderTaskList} from "../utilities";
import {createPostingSelector} from "../redux/selectors";
import {useDispatch, useSelector} from "react-redux";
import {TasksKanbanColumn, TasksSheetColumn} from "../css/TaskColumns";
import MaterialTable from 'material-table';
import moment from "moment";
import Moment from "react-moment";
import {DateAndTimePicker} from "./DateTimePickers";
import PrioritySelect from "./PrioritySelect";
import ToggleTimeStamp from "./ToggleTimeStamp";
import Box from "@material-ui/core/Box";
import UsersSelect from "./UsersSelect";
import {updateTaskAssignedRider} from "../redux/Actions";
import {TextFieldControlled} from "./TextFieldControlled";


const getColumnTitle = key => {
    switch (key) {
        case "tasksNew":
            return "New";
        case "tasksActive":
            return "Active";
        case "tasksPickedUp":
            return "Picked up";
        case "tasksDelivered":
            return "Delivered";
        case "tasksRejected":
            return "Rejected";
        case "tasksCancelled":
            return "Cancelled";
        case "tasksRejectedCancelled":
            return "Rejected/Cancelled";
        default:
            return ""
    }
};


export default function TasksTable(props) {
    const dispatch = useDispatch();
    const [state, setState] = React.useState({
        columns: [
            { title: 'Name', field: 'name' },
            { title: 'Surname', field: 'surname' },
            { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
            {
                title: 'Birth Place',
                field: 'birthCity',
                lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
            },
        ],
        data: [
            { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
            {
                name: 'Zerya Betül',
                surname: 'Baran',
                birthYear: 2017,
                birthCity: 34,
            },
        ],
    });

    function onSelectRider(rider, taskUUID) {
        if (rider) {
            const payload = {assigned_rider: rider.uuid, rider};
            dispatch(updateTaskAssignedRider({taskUUID, payload}))
        }
    }

    const columns = [
        {title: "Assignee", field: "assignee"},
        {title: "Time of Call", field: "timestamp"},
        {title: "Contact Name", field: "contactName"},
        {title: "Contact Number", field: "contactNumber"},
        {title: "Priority", field: "priority"},
        {title: "Pickup Time", field: "pickupTime"},
        {title: "Dropoff Time", field: "dropoffTime"},
        {title: "Patch", field: "patch"},
    ];
    const tasksDataColumns = props.tasks.map(task => {
            return {
                assignee: <UsersSelect onSelect={onSelectRider} vehicleAssignedUsersFirst={true}/>,
                timestamp: task.timestamp ?
                    <DateAndTimePicker visible={true} value={task.timestamp} label={"TOC"}/> : "",
                contactName: <TextFieldControlled value={task.contact_name ? task.contact_name : ""}/>,
                contactNumber: <TextFieldControlled value={task.contact_number ? task.contact_number : ""}/>,
                priority: <PrioritySelect priority={task.priority_id}/>,
                pickupTime: task.pickup_time ?
                    <DateAndTimePicker visible={true} value={task.pickup_time} label={"Pickup Time"}/> : <ToggleTimeStamp label={"Picked Up"} status={!!task.pickup_time} onSelect={() => {}}/>,
        dropoffTime: task.dropoff_time ?
                    <DateAndTimePicker visible={true} value={task.dropoff_time} label={"Dropoff Time"}/> : <ToggleTimeStamp label={"Dropped Off"} status={!!task.dropoff_time} onSelect={() => {}}/>,
                patch: task.rider ? task.rider.patch : "",
            }
    });

    return (
        <MaterialTable
            title={"All Tasks"}
            columns={columns}
            data={tasksDataColumns}
            editable={{
                onRowAdd: newData =>
                    new Promise(resolve => {
                        setTimeout(() => {
                            resolve();
                            setState(prevState => {
                                const data = [...prevState.data];
                                data.push(newData);
                                return { ...prevState, data };
                            });
                        }, 600);
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise(resolve => {
                        setTimeout(() => {
                            resolve();
                            if (oldData) {
                                setState(prevState => {
                                    const data = [...prevState.data];
                                    data[data.indexOf(oldData)] = newData;
                                    return { ...prevState, data };
                                });
                            }
                        }, 600);
                    }),
                onRowDelete: oldData =>
                    new Promise(resolve => {
                        setTimeout(() => {
                            resolve();
                            setState(prevState => {
                                const data = [...prevState.data];
                                data.splice(data.indexOf(oldData), 1);
                                return { ...prevState, data };
                            });
                        }, 600);
                    }),
            }}
        />)
}

export function TasksTablae(props) {
    const loadingSelector = createPostingSelector(["ADD_TASK"]);
    const isPosting = useSelector(state => loadingSelector(state));
    const kanbanMode = useSelector(state => state.kanbanMode);
    const emptyTask = {
        session_uuid: props.sessionUUID,
        timestamp: new Date().toISOString(),
    };
    return (
    <Grid container
          spacing={3}
          direction={"column"}
          justify={"flex-start"}
          alignItems={"stretch"}
    >
        {Object.entries(orderTaskList(props.tasks)).map(taskList => {
            if (props.excludeColumnList && props.excludeColumnList.includes(taskList[0]))
                return <></>
            let newTaskButton = "";
            if (props.sessionUUID && taskList[0] === "tasksNew") {
                newTaskButton = <AddCircleButton disabled={isPosting} onClick={() => {props.onAddTaskClick(emptyTask)}}/>

            }
            const title = getColumnTitle(taskList[0]);
            return (
                <Grid item xs sm md lg key={taskList[0]}>
                    <TasksSheetColumn>
                        {title}
                        <Grid container
                              spacing={0}
                              direction={"column"}
                              justify={"flex-start"}
                              alignItems={"center"}
                        >
                            {newTaskButton}
                            {taskList[1].map(task => {
                                return (
                                    <TaskItem task={task} kanban={kanbanMode} view={props.modalView} fullScreenModal={props.fullScreenModal}
                                              location={props.location} deleteDisabled={props.deleteDisabled}/>
                                )
                            })}
                        </Grid>
                    </TasksSheetColumn>
                </Grid>
        )
        })}
    </Grid>
    )
}