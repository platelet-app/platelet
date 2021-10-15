import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import UserCard from "../../../components/UserCard";
import React from "react";
import { useDispatch } from "react-redux";
import {
    removeTaskAssignedCoordinatorRequest,
    removeTaskAssignedRiderRequest,
} from "../../../redux/taskAssignees/TaskAssigneesActions";
import Divider from "@mui/material/Divider";
import makeStyles from "@mui/material/styles/makeStyles";
import PropTypes from "prop-types";

const useStyles = makeStyles({
    root: {
        minWidth: 300,
        padding: 10,
    },
    spacer: {
        height: 15,
    },
});

function TaskAssignees(props) {
    const dispatch = useDispatch();
    const { taskUUID } = props;
    const classes = useStyles();

    const noAssigneeMessage = props.assignees ? (
        props.assignees.length === 0 ? (
            <Typography>No assignee.</Typography>
        ) : (
            <></>
        )
    ) : (
        <></>
    );

    function onRemoveUser(userUUID) {
        if (props.rider)
            dispatch(removeTaskAssignedRiderRequest(taskUUID, userUUID));
        else if (props.coordinator)
            dispatch(removeTaskAssignedCoordinatorRequest(taskUUID, userUUID));
        if (props.onRemove) props.onRemove();
    }

    return (
        <Grid
            container
            className={classes.root}
            direction={"column"}
            justify={"center"}
            alignItems={"flex-start"}
        >
            <Grid item>{noAssigneeMessage}</Grid>
            {Object.values(props.assignees).map((user) => {
                return (
                    <Grid item key={user.uuid}>
                        <UserCard
                            compact
                            onDelete={() => onRemoveUser(user.uuid)}
                            userUUID={user.uuid}
                            displayName={user.display_name}
                            avatarURL={user.profile_picture_thumbnail_url}
                        />
                        <Divider />
                        <div className={classes.spacer} />
                    </Grid>
                );
            })}
        </Grid>
    );
}

TaskAssignees.propTypes = {
    taskUUID: PropTypes.string.isRequired,
    assignees: PropTypes.arrayOf(PropTypes.object),
    onRemove: PropTypes.func,
    coordinator: PropTypes.bool,
    rider: PropTypes.bool,
};

TaskAssignees.defaultProps = {
    assignees: [],
    onRemove: () => {},
};

export default TaskAssignees;
