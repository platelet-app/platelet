import Grid from "@material-ui/core/Grid";
import UsersSelect from "../../../components/UsersSelect";
import Typography from "@material-ui/core/Typography";
import UserCard from "../../../components/UserCard";
import React, {useEffect, useState} from "react";
import {
    updateTaskPatch,
} from "../../../redux/tasks/TasksActions";

import {useDispatch, useSelector} from "react-redux";
import {createLoadingSelector, createPostingSelector} from "../../../redux/selectors";
import Button from "@material-ui/core/Button";
import {
    addTaskAssignedRider,
    getTaskAssignedRiders,
    removeTaskAssignedRider
} from "../../../redux/taskAssignees/TaskAssigneesActions";
import TaskAssigneesSkeleton from "./TaskAssigneesSkeleton";

export default function TaskAssignees(props) {
    const [addMode, setAddMode] = useState(false);
    const availablePatches = useSelector(state => state.availablePatches.patches);
    const postingSelector = createPostingSelector(["ADD_TASK_ASSIGNED_RIDER", "UPDATE_TASK_PATCH"]);
    const isPosting = useSelector(state => postingSelector(state));
    const loadingSelector = createLoadingSelector(["GET_TASK_ASSIGNED_RIDERS"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const dispatch = useDispatch();
    const taskUUID = props.taskUUID;
    //const assignees = useSelector(state => state.currentTask.task.assigned_users);
    const assignees = useSelector(state => state.taskAssignees.assignees);

    //const addButton = <AddCircleButtonSmall disabled={isPosting} onClick={() => setAddMode(!addMode)}/>

    function componentDidMount() {
        dispatch(getTaskAssignedRiders(taskUUID))
    }
    useEffect(componentDidMount, [])

    const addButton =
        <Button
            variant={"contained"}
            color={"primary"}
            disabled={isPosting}
            onClick={() => {
                setAddMode(!addMode)
            }}
        >
            {addMode ? "Cancel" : "Assign a user"}
        </Button>

    function onSelectRider(rider) {
        if (rider) {
            const patchFilter = availablePatches.filter(patch => patch.id === rider.patch_id);
            const patchLabel = patchFilter.length === 1 ? patchFilter[0].label : "";
            const patchPayload = {patch_id: rider.patch_id, patch: patchLabel, user_uuid: rider.uuid, rider};
            const riderPayload = {user_uuid: rider.uuid, rider};
            //dispatch(updateTaskPatch({taskUUID, payload: patchPayload}))
            dispatch(addTaskAssignedRider({taskUUID, payload: riderPayload}))
        }
        setAddMode(false);
    }

    const noAssigneeMessage = assignees ? assignees.length === 0 ? <Typography>No assignee.</Typography> : <></> : <></>
    const userSelect = addMode ?
        <UsersSelect id="userSelect"
                     roles={['rider']}
                     vehicleAssignedUsersFirst={true}
                     onSelect={onSelectRider}
                     excludeList={assignees.map((u) => u.uuid)}/>
                     :
        <></>

    if (isFetching) {
        return <TaskAssigneesSkeleton/>
    } else {
        return (
            <Grid container direction={"column"} spacing={3} justify={"center"} alignItems={"flex-start"}>
                <Grid item>
                    {noAssigneeMessage}
                </Grid>
                {assignees ? assignees.map((user) => {
                    return (
                        <Grid item key={user.uuid}>
                            <UserCard
                                onDelete={() => dispatch(removeTaskAssignedRider({
                                    taskUUID,
                                    payload: {user_uuid: user.uuid}
                                }))}
                                user={user}
                            />
                        </Grid>
                    )
                }) : <></>}
                <Grid item>
                    {userSelect}
                </Grid>
                <Grid item>
                    {addButton}
                </Grid>
            </Grid>
        )
    }
}
