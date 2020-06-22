import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {AddCircleButton} from "../../../components/Buttons";
import TaskItem from "./TaskItem";
import {encodeUUID, orderTaskList} from "../../../utilities";
import {createPostingSelector} from "../../../redux/selectors";
import {useDispatch, useSelector} from "react-redux";
import {TasksSheetColumn} from "../styles/TaskColumns";
import MaterialTable from 'material-table';
import Box from "@material-ui/core/Box";
import { useHistory, useLocation } from "react-router-dom";

import {addTask} from "../../../redux/tasks/TasksActions";

import {forwardRef} from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';


import TaskContextMenu from "../../../components/ContextMenus/TaskContextMenu";
import Moment from "react-moment";
import {StyledAddCircleOutline} from "../../../styles/Buttons";

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}/>),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
};


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

function getStatusColour(task) {

    let hasRider = false;
    if (task.assigned_users && task.assigned_users.length > 0) {
        hasRider = true;
    }
    if (task.time_cancelled || task.time_rejected) {
        return {index: 4, colour: "gray"}
    } else if (!hasRider) {
        return {index: 0, colour: "rgba(252, 231, 121, 1)"}
    } else if (hasRider && !task.time_picked_up) {
        return {index: 1, colour: "cornflowerblue"}
    } else if (hasRider && task.time_picked_up && !task.time_dropped_off) {
        return {index: 2, colour: "orange"}
    } else if (task.time_dropped_off) {
        return {index: 3, colour: "lightgreen"}
    }
}

function tasksDataColumns (tasks) {
    // tasks are received in an object of arrays for different status, add them all together
    const concatTasks = Object.values(tasks).reduce(
        (accumulator, value) => [...accumulator, ...value])

    return (concatTasks.map(task => {
        return {
            //TODO: maybe get status colour somehow above
            colourCode: getStatusColour(task),
            time_of_call:  task.time_of_call || "",
            assignees: task.assigned_users_display_string,
            contactName: task.contact_name || "",
            contactNumber: task.contact_number ? task.contact_number : "",
            pickupAddress: task.pickup_address ? task.pickup_address.line1 : "",
            pickupWard : task.pickup_address ? task.pickup_address.ward : "",
            dropoffAddress: task.dropoff_address ? task.dropoff_address.line1 : "",
            dropoffWard : task.dropoff_address ? task.dropoff_address.ward : "",
            priority: task.priority,
            pickupTime: task.time_picked_up || "",
            dropoffTime: task.time_dropped_off || "",
            patch: task.patch || "",
            contextMenu: <TaskContextMenu taskUUID={task.uuid}
                                          pickupTime={task.time_picked_up}
                                          dropoffTime={task.time_dropped_off}
                                          cancelledTime={task.time_cancelled}
                                          rejectedTime={task.time_rejected}
                                          assignedUsers={task.assigned_users}/>,
            uuid: task.uuid
        }
    }))
};

export default function TasksTable(props) {
    const history = useHistory();
    const currentLocation = useLocation();
    const mobileView = useSelector(state => state.mobileView);
    const loadingSelector = createPostingSelector(["ADD_TASK"]);
    const isPosting = useSelector(state => loadingSelector(state));

    const columns = [
        {
            title: "",
            field: "colourCode",
            width: "0px",
            render: rowData => <Box style={{
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                backgroundColor: rowData.colourCode.colour
            }}/>,
            customSort: (a, b) => a.colourCode.index < b.colourCode.index ? -1 : 1

        },
        {title: "", field: "contextMenu", width: "0px", sorting: false},
        {title: "Assignees", field: "assignees"},
        {
            title: "Time of Call",
            width: "220px",
            field: "time_of_call",
            render: rowData =>
                <Moment local calendar style={{fontSize: "14px"}}>{rowData.time_of_call ? rowData.time_of_call : ""}</Moment>,
            defaultSort: "desc"
        },
        {title: "Contact Name", field: "contactName"},
        {title: "Contact Number", field: "contactNumber"},
        {title: "Pickup Address", field: "pickupAddress"},
        {title: "Pickup Ward", field: "pickupWard"},
        {title: "Dropoff Address", field: "dropoffAddress"},
        {title: "Dropoff Ward", field: "dropoffWard"},
        {title: "Priority", field: "priority"},
        {title: "Pickup Time", field: "pickupTime", width: "240px", render: rowData => rowData.pickupTime ? <Moment local calendar style={{fontSize: "14px"}}>{rowData.pickupTime}</Moment> : ""},
        {title: "Dropoff Time", field: "dropoffTime", width: "240px", render: rowData => rowData.dropoffTime ? <Moment local calendar style={{fontSize: "14px"}}>{rowData.dropoffTime}</Moment> : ""},
        {title: "Patch", field: "patch"},
        {title: "", field: "uuid", render: () => <></>}
    ];

    const actions = [
        {
            icon: Edit,
            tooltip: 'Edit Task',
            onClick: (event, rowData) => {
                history.push(`${currentLocation.pathname}/task/${encodeUUID(rowData.uuid)}`);
            }
        },
        {
            icon: StyledAddCircleOutline,
            tooltip: "New Task",
            position: "toolbar",
            disabled: isPosting,
            onClick: props.onAddTaskClick
        },
    ];


    return (
        <MaterialTable
            icons={tableIcons}
            title=""
            columns={columns}
            data={tasksDataColumns(props.tasks)}
            options={{actionsColumnIndex: 1, pageSize: 10, toolbarButtonAlignment: "left"}}
            actions={actions}
        />
    )

}

export function TasksTablae(props) {
    const loadingSelector = createPostingSelector(["ADD_TASK"]);
    const isPosting = useSelector(state => loadingSelector(state));
    const kanbanMode = useSelector(state => state.kanbanMode);
    const emptyTask = {
        session_uuid: props.sessionUUID,
        time_of_call: new Date().toISOString(),
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
                    newTaskButton = <AddCircleButton disabled={isPosting} onClick={() => {
                        props.onAddTaskClick(emptyTask)
                    }}/>

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
                                        <TaskItem task={task} kanban={kanbanMode} view={props.modalView}
                                                  fullScreenModal={props.fullScreenModal}
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