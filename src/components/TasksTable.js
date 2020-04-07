import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {AddCircleButton} from "../components/Buttons";
import TaskItem from "./TaskItem";
import {orderTaskList} from "../utilities";
import {createPostingSelector} from "../redux/selectors";
import {useDispatch, useSelector} from "react-redux";
import {TasksSheetColumn} from "../css/TaskColumns";
import MaterialTable, {MTableCell} from 'material-table';
import moment from "moment";
import Box from "@material-ui/core/Box";
import {updateTaskAssignedRider, updateTask} from "../redux/tasks/Actions";

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


import TaskContextMenu from "./TaskContextMenu";
import {Typography} from "@material-ui/core";
import Moment from "react-moment";

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
    if (task.assigned_rider) {
        hasRider = true;
    }
    if (task.time_cancelled || task.time_rejected) {
        return {index: 4, colour: "gray"}
    } else if (!task.assigned_rider) {
        return {index: 0, colour: "rgba(252, 231, 121, 1)"}
    } else if (task.assigned_rider && !task.time_picked_up) {
        return {index: 1, colour: "cornflowerblue"}
    } else if (hasRider && task.time_picked_up && !task.time_dropped_off) {
        return {index: 2, colour: "orange"}
    } else if (task.time_dropped_off) {
        return {index: 3, colour: "lightgreen"}
    }
}

function tasksDataColumns (tasks) {
    return (tasks.map(task => {
        return {
            colourCode: getStatusColour(task),
            time_of_call: task.time_of_call ? task.time_of_call : "",
            assignee: task.rider ? task.rider.display_name : "",
            contactName: task.contact_name ? task.contact_name : "",
            contactNumber: task.contact_number ? task.contact_number : "",
            pickupAddress: task.pickup_address ? task.pickup_address.line1 : "",
            pickupWard : task.pickup_address ? task.pickup_address.ward : "",
            dropoffAddress: task.dropoff_address ? task.dropoff_address.line1 : "",
            dropoffWard : task.dropoff_address ? task.dropoff_address.ward : "",
            priority: task.priority,
            pickupTime: task.time_picked_up ? task.time_picked_up : "",
            dropoffTime: task.time_dropped_off ? task.time_dropped_off : "",
            patch: task.rider ? task.rider.patch : "",
            contextMenu: <TaskContextMenu taskUUID={task.uuid}
                                          pickupTime={task.time_picked_up}
                                          dropoffTime={task.time_dropped_off}
                                          cancelledTime={task.time_cancelled}
                                          rejectedTime={task.time_rejected}
                                          assignedRider={task.assigned_rider}/>
        }
    }))
};

export default function TasksTable(props) {
    const dispatch = useDispatch();
    moment.locale('en', {
        calendar : {
            lastDay : '[Yesterday at] LT',
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            lastWeek : '[last] dddd [at] LT',
            nextWeek : 'dddd [at] LT',
            sameElse : 'L'
        }
    });
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
        {title: "Assignee", field: "assignee"},
        {
            title: "Time of Call",
            width: "220px",
            field: "time_of_call",
            render: rowData =>
                <Moment calendar style={{fontSize: "14px"}}>{rowData.time_of_call ? rowData.time_of_call : ""}</Moment>,
            defaultSort: "desc"
        },
        {title: "Contact Name", field: "contactName"},
        {title: "Contact Number", field: "contactNumber"},
        {title: "Pickup Address", field: "pickupAddress"},
        {title: "Pickup Ward", field: "pickupWard"},
        {title: "Dropoff Address", field: "dropoffAddress"},
        {title: "Dropoff Ward", field: "dropoffWard"},
        {title: "Priority", field: "priority"},
        {title: "Pickup Time", field: "pickupTime", width: "240px", render: rowData => rowData.pickupTime ? <Moment calendar style={{fontSize: "14px"}}>{rowData.pickupTime}</Moment> : ""},
        {title: "Dropoff Time", field: "dropoffTime", width: "240px", render: rowData => rowData.dropoffTime ? <Moment calendar style={{fontSize: "14px"}}>{rowData.dropoffTime}</Moment> : ""},
        {title: "Patch", field: "patch"},
        {title: "", field: "contextMenu", width: "0px", sorting: false}
    ];
    const [data, setData] = useState(tasksDataColumns(props.tasks));

    useEffect(() => setData(tasksDataColumns(props.tasks)), [props.tasks]);


    return (
        <MaterialTable
            icons={tableIcons}
            title=""
            columns={columns}
            data={data}
            options={{actionsColumnIndex: 1, pageSize: 10}}
            editable={{
                onRowAdd: newData =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            {
                                const dataCopy = data;
                                dataCopy.push(newData);
                                setData(() => resolve());
                            }
                            resolve()
                        }, 1000)
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            {
                                dispatch(updateTask(newData));
                            }
                            resolve()
                        }, 1000)
                    }),
                onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            {
                                let dataCopy = data;
                                const index = dataCopy.indexOf(oldData);
                                dataCopy.splice(index, 1);
                                setData(() => resolve());
                            }
                            resolve()
                        }, 1000)
                    }),
            }}
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