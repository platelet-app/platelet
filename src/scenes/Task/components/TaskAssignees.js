import React from "react";
import Typography from "@mui/material/Typography";
import UserCard from "../../../components/UserCard";
import Divider from "@mui/material/Divider";
import makeStyles from "@mui/styles/makeStyles";
import PropTypes from "prop-types";
import { Stack } from "@mui/material";
import { userRoles } from "../../../apiConsts";

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
    return [userRoles.coordinator, userRoles.rider].map((role) => {
        const assignments = Object.values(props.assignees).filter(
            (a) => a.role === role
        );
        const message = assignments.length === 0 ? "No one assigned" : "";
        const label =
            role === userRoles.coordinator ? "Coordinators:" : "Riders:";
        return (
            <Stack direction="column" spacing={1}>
                <Typography>{label}</Typography>
                <Typography>{message}</Typography>
                {assignments.map((assignment) => {
                    const user = assignment.assignee || null;
                    return (
                        <UserCard
                            key={assignment.id}
                            compact
                            onDelete={() => props.onRemove(assignment.id)}
                            userUUID={user.id}
                            displayName={user.displayName}
                            avatarURL={user.profilePictureThumbnailURL}
                        />
                    );
                })}
            </Stack>
        );
    });
}

TaskAssignees.propTypes = {
    assignees: PropTypes.arrayOf(PropTypes.object),
    onRemove: PropTypes.func,
};

TaskAssignees.defaultProps = {
    assignees: [],
    onRemove: () => {},
};

export default TaskAssignees;
