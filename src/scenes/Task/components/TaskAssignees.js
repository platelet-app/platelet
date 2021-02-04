import Grid from "@material-ui/core/Grid";
import UsersSelect from "../../../components/UsersSelect";
import Typography from "@material-ui/core/Typography";
import UserCard from "../../../components/UserCard";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {createLoadingSelector, createPostingSelector} from "../../../redux/selectors";
import Button from "@material-ui/core/Button";
import {
    addTaskAssignedRiderRequest,
    getTaskAssignedRidersRequest,
    removeTaskAssignedRiderRequest
} from "../../../redux/taskAssignees/TaskAssigneesActions";
import TaskAssigneesSkeleton from "./TaskAssigneesSkeleton";

export default function TaskAssignees(props) {
    const [addMode, setAddMode] = useState(false);
    const postingSelector = createPostingSelector(["ADD_TASK_ASSIGNED_RIDER", "UPDATE_TASK_PATCH"]);
    const isPosting = useSelector(state => postingSelector(state));
    const loadingSelector = createLoadingSelector(["GET_TASK_ASSIGNED_RIDERS"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const dispatch = useDispatch();
    const taskUUID = props.taskUUID;
    const assignees = useSelector(state => state.taskAssignees.assignees);

    function componentDidMount() {
        dispatch(getTaskAssignedRidersRequest(taskUUID))
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
        console.log(rider)
        if (rider) {
            dispatch(addTaskAssignedRiderRequest(taskUUID, rider.uuid, rider.patch_id))
        }
        setAddMode(false);
    }

    const noAssigneeMessage = assignees ? assignees.length === 0 ? <Typography>No assignee.</Typography> : <></> : <></>
    const userSelect = addMode ?
        <UsersSelect id="userSelect"
                     roles={['rider']}
                     vehicleAssignedUsersFirst={true}
                     onSelect={onSelectRider}
                     excludeList={Object.values(assignees).map((u) => u.uuid)}/>

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
                {Object.values(assignees).map((user) => {
                    return (
                        <Grid item key={user.uuid}>
                            <UserCard
                                onDelete={() => dispatch(removeTaskAssignedRiderRequest({
                                    taskUUID,
                                    payload: {user_uuid: user.uuid}
                                }))}
                                user={user}
                            />
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
}
