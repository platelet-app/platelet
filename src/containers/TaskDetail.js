import React from 'react';
import '../App.css';
import 'typeface-roboto'
import TaskDialog from "../components/TaskModal";


export default function TaskDetail(props) {
    let taskUUID = props.match.params.task_uuid_b62;
    return (<>
        <TaskDialog taskId={taskUUID} modal={false} apiControl={props.apiControl}/>
        </>)
}
