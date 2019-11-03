import React from 'react';
import '../App.css';
import 'typeface-roboto'
import {StyledCard} from '../css/common';
import CardContent from '@material-ui/core/CardContent';
import {Typography} from "@material-ui/core";
import {convertDate} from '../utilities'
import Grid from "@material-ui/core/Grid";
import TaskDialog from "./TaskModal";


export default function TaskDetail(props) {
    let taskUUID = props.match.params.task_id;
    return (<>
        <TaskDialog taskId={taskUUID} modal={false} apiControl={props.apiControl}/>
        </>)
}

