import React, {memo, useEffect, useRef, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {Link, useLocation} from "react-router-dom";
import TaskCard from "./TaskCardsColoured"
import {encodeUUID} from "../../../utilities";
import TaskContextMenu from "../../../components/ContextMenus/TaskContextMenu";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Tooltip from "@material-ui/core/Tooltip";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import {useDispatch} from "react-redux";
import {addTaskRelayRequest, updateTaskDropoffAddressRequest} from "../../../redux/tasks/TasksActions";
import Grow from "@material-ui/core/Grow";


const TaskItem = React.memo((props) => {
    console.log("yee tis run")
    const task =
        <TaskCard
            title={"Task"}
            {...props}
        />;

    const child =
        <div style={{}}>
            <Grid item key={props.taskUUID}>
                <div style={{cursor: 'context-menu', position: "relative"}}>
                    <Link style={{textDecoration: 'none'}}
                          key={props.taskUUID}
                          to={{
                              pathname: `/task/${encodeUUID(props.taskUUID)}`
                          }}>
                        {task}
                    </Link>
                    <div style={{cursor: 'context-menu', position: "absolute", bottom: 0, right: 0, zIndex: 1000}}>
                        <TaskContextMenu
                            deleteDisabled={props.deleteDisabled}
                            {...props}
                        />
                    </div>
                </div>

            </Grid>
        </div>

        return (
            <Grow in={true}>
                {child}
                </Grow>
        )


});

export default TaskItem;
