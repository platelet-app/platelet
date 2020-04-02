import React from 'react';
import '../App.css';
import TaskDialog from "../components/taskdialog/TaskModal";


export default function TaskDetail(props) {
    let taskUUID = props.match.params.task_uuid_b62;
    return (<>
        <TaskDialog taskId={taskUUID} modal={false} apiControl={props.apiControl}/>
        </>)
}
