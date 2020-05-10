import Grid from "@material-ui/core/Grid";
import UsersSelect from "../UsersSelect";
import Typography from "@material-ui/core/Typography";
import UserCard from "../UserCard";
import React, {useState} from "react";
import {updateTaskAssignedRider, updateTaskPatch} from "../../redux/tasks/TasksActions";
import {useDispatch, useSelector} from "react-redux";
import {AddCircleButtonSmall} from "../Buttons";

export default function TaskAssignees(props) {
    const [addMode, setAddMode] = useState(false);
    const availablePatches = useSelector(state => state.availablePatches.patches);
    const dispatch = useDispatch();
    const taskUUID = props.taskUUID;
    const assignees = useSelector(state => state.currentTask.task.assigned_users);

    const addButton = <AddCircleButtonSmall onClick={() => setAddMode(!addMode)}/>


    function onSelectRider(rider) {
        if (rider) {
            const patchFilter = availablePatches.filter(patch => patch.id === rider.patch_id);
            const patchLabel = patchFilter.length === 1 ? patchFilter[0].label : "";
            const patchPayload = {patch_id: rider.patch_id, patch: patchLabel, user_uuid: rider.uuid, rider};
            const riderPayload = {user_uuid: rider.uuid, rider};
            dispatch(updateTaskPatch({taskUUID, payload: patchPayload}))
            dispatch(updateTaskAssignedRider({taskUUID, payload: riderPayload}))
        }
        setAddMode(false);
    }

    const noAssigneeMessage = assignees ? assignees.length === 0 ? <Typography>No assignee.</Typography> : <></> : <></>
    const userSelect = addMode ?
        <UsersSelect id="userSelect"
                     vehicleAssignedUsersFirst={true}
                     onSelect={onSelectRider}
                     excludeList={assignees.map((u) => u.uuid)}/>
                     :
        <></>

    return (
        <Grid container direction={"column"} spacing={3} justify={"center"} alignItems={"flex-start"}>
            <Grid item>
                <Typography variant={"h5"}>Assignees</Typography>
            </Grid>
            <Grid item>
                {noAssigneeMessage}
            </Grid>
            {assignees ? assignees.map((user) => {
                return (
                    <Grid item key={user.uuid}>
                        <UserCard user={user}/>
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