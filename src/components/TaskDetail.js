import React from 'react';
import '../App.css';
import 'typeface-roboto'
import TaskDialog from "./TaskModal";


export default function TaskDetail(props) {
    let taskUUID = props.match.params.task_id;
    return (<>
        <TaskDialog taskId={taskUUID} modal={false} apiControl={props.apiControl}/>
        </>)
}
