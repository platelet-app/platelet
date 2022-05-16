import React from "react";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Divider, Grid } from "@mui/material";
import { userRoles } from "../../../apiConsts";
import UserChip from "../../../components/UserChip";
import { sortByCreatedTime } from "../../../utilities";

function TaskAssignees(props) {
    return [userRoles.coordinator, userRoles.rider].map((role) => {
        const assignmentsUnsorted = Object.values(props.assignees).filter(
            (a) => a.role === role
        );
        const assignments = sortByCreatedTime(assignmentsUnsorted, "oldest");
        const message = assignments.length === 0 ? "No one assigned" : "";
        const label =
            role === userRoles.coordinator ? "Coordinators:" : "Riders:";
        return (
            <>
                <Grid
                    container
                    key={role}
                    data-cy={`task-${role}-assignees`}
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
                                    showResponsibility={
                                        role === userRoles.rider
                                    }
                                    disabled={props.disabled}
                                    user={user}
                                    key={assignment.id}
                                    onDelete={() =>
                                        props.onRemove(assignment.id)
                                    }
                                />
                            </Grid>
                        );
                    })}
                </Grid>
                <Divider />
            </>
        );
    });
}

TaskAssignees.propTypes = {
    assignees: PropTypes.object,
    onRemove: PropTypes.func,
    disabled: PropTypes.bool,
};

TaskAssignees.defaultProps = {
    assignees: {},
    onRemove: () => {},
    disabled: false,
};

export default TaskAssignees;
