import React from "react";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Grid, Stack } from "@mui/material";
import { userRoles } from "../../../apiConsts";
import UserChip from "../../../components/UserChip";

function TaskAssignees(props) {
    return [userRoles.coordinator, userRoles.rider].map((role) => {
        const assignments = Object.values(props.assignees).filter(
            (a) => a.role === role
        );
        const message = assignments.length === 0 ? "No one assigned" : "";
        const label =
            role === userRoles.coordinator ? "Coordinators:" : "Riders:";
        return (
            <Grid
                container
                key={role}
                direction="row"
                alignItems="center"
                spacing={1}
            >
                <Grid item>
                    <Typography>{label}</Typography>
                </Grid>
                <Grid item>
                    <Typography>{message}</Typography>
                </Grid>
                {assignments.map((assignment) => {
                    const user = assignment.assignee || null;
                    return (
                        <Grid item>
                            <UserChip
                                user={user}
                                key={assignment.id}
                                onDelete={() => props.onRemove(assignment.id)}
                            />
                        </Grid>
                    );
                })}
            </Grid>
        );
    });
}

TaskAssignees.propTypes = {
    assignees: PropTypes.object,
    onRemove: PropTypes.func,
};

TaskAssignees.defaultProps = {
    assignees: {},
    onRemove: () => {},
};

export default TaskAssignees;
