import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import UserCard from "../../../components/UserCard";
import React from "react";
import {useDispatch} from "react-redux";
import {
    removeTaskAssignedRiderRequest
} from "../../../redux/taskAssignees/TaskAssigneesActions";
import Divider from "@material-ui/core/Divider";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PropTypes from "prop-types";

const useStyles = makeStyles({
    root: {
        padding: 15
    }

})

function TaskAssignees(props) {
    const dispatch = useDispatch();
    const taskUUID = props.taskUUID;
    const classes = useStyles();

    const noAssigneeMessage = props.assignees ? props.assignees.length === 0 ?
        <Typography>No assignee.</Typography> : <></> : <></>

    function onRemoveUser(userUUID) {
        dispatch(removeTaskAssignedRiderRequest({
            taskUUID,
            payload: {user_uuid: userUUID}
        }));
        if (props.onRemove)
            props.onRemove();
    }


    return (
        <Grid container className={classes.root} direction={"column"} spacing={3} justify={"center"} alignItems={"flex-start"}>
            <Grid item>
                {noAssigneeMessage}
            </Grid>
            {Object.values(props.assignees).map((user) => {
                return (
                    <Grid item key={user.uuid}>
                        <UserCard
                            onDelete={() => onRemoveUser(user.uuid)}
                            user={user}
                        />
                        <Divider/>

                    </Grid>
                )
            })}
        </Grid>
    )
}

TaskAssignees.propTypes = {
    taskUUID: PropTypes.string,
    assignees: PropTypes.arrayOf(PropTypes.object),
    onRemove: PropTypes.func
}

TaskAssignees.defaultProps = {
    assignees: [],
    onRemove: () => {}
}

export default TaskAssignees;
