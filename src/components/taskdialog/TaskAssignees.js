import Grid from "@material-ui/core/Grid";
import UsersSelect from "../UsersSelect";
import Typography from "@material-ui/core/Typography";
import UserCard from "../UserCard";
import React, {useEffect, useState} from "react";
import {updateTaskAssignedRider} from "../../redux/tasks/TasksActions";
import {useDispatch, useSelector} from "react-redux";
import {AddCircleButtonSmall} from "../Buttons";

export default function TaskAssignees(props) {
    const [addMode, setAddMode] = useState(false);
    const availablePatches = useSelector(state => state.availablePatches.patches);
    const [assignees, setAssignees] = useState(props.assignedUsers)
    const dispatch = useDispatch();
    const taskUUID = props.taskUUID;

    const addButton = <AddCircleButtonSmall onClick={() => setAddMode(!addMode)}/>

    function reRender () {
        setAssignees(props.assignedUsers)
    }
    useEffect(reRender, [props.assignedUsers])

    function onSelectRider(rider) {
        if (rider) {
            const patchFilter = availablePatches.filter(patch => patch.id === rider.patch_id);
            const patchLabel = patchFilter.length === 1 ? patchFilter[0].label : "";
            const payload = {patch_id: rider.patch_id, patch: patchLabel, user_uuid: rider.uuid, rider};
            dispatch(updateTaskAssignedRider({taskUUID, payload}))
        }
        setAddMode(false);
    }

    const noAssigneeMessage = props.assignedUsers.length === 0 ? <Typography>No assignee.</Typography> : <></>
    const userSelect = addMode ?
        <UsersSelect id="userSelect"
                     vehicleAssignedUsersFirst={true}
                     onSelect={onSelectRider}/> :
        <></>

    return (
        <Grid container direction={"column"} spacing={3} justify={"center"} alignItems={"flex-start"}>
            <Grid item>
                <Typography variant={"h5"}>Assignees</Typography>
            </Grid>
            <Grid item>
                {noAssigneeMessage}
            </Grid>
            {assignees.map((user) => {
                return (
                    <Grid item key={user.uuid}>
                        <UserCard user={user}/>
                    </Grid>
                )
            })}
            <Grid item>
                {userSelect}
            </Grid>
            <Grid item>
                {addButton}
            </Grid>
        </Grid>
    )
}