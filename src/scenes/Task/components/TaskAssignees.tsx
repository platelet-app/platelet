import React from "react";
import Typography from "@mui/material/Typography";
import { Divider, Grid, Stack } from "@mui/material";
import { userRoles } from "../../../apiConsts";
import UserChip from "../../../components/UserChip";
import { sortByCreatedTime } from "../../../utilities";
import { getWhoami } from "../../../redux/Selectors";
import { useSelector } from "react-redux";
import * as models from "../../../models";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

type TaskAssigneesProps = {
    assignees: models.TaskAssignee[];
    onRemove?: (arg0: string) => void;
    disabled?: boolean;
};

const TaskAssignees: React.FC<TaskAssigneesProps> = (props) => {
    const whoami = useSelector(getWhoami);
    const [confirmRemoveId, setConfirmRemoveId] = React.useState<string | null>(
        null
    );
    const handleRemove = (assignment: models.TaskAssignee) => {
        if (props.onRemove) {
            if (assignment.assignee?.id === whoami.id) {
                setConfirmRemoveId(assignment.id);
            } else {
                props.onRemove(assignment.id);
            }
        }
    };

    const confirmationSelfDeleteDialog = (
        <ConfirmationDialog
            dialogTitle="Are you sure you want to unassign yourself?"
            onCancel={() => setConfirmRemoveId(null)}
            open={!!confirmRemoveId}
            onConfirmation={() => {
                if (props.onRemove && confirmRemoveId)
                    props.onRemove(confirmRemoveId);
                setConfirmRemoveId(null);
            }}
        >
            <Stack spacing={1} direction="column">
                <Typography>
                    This will remove the task from your dashboard, but can be
                    accessed again using the ALL view.
                </Typography>
            </Stack>
        </ConfirmationDialog>
    );

    const mappedAssigneeContents = [userRoles.coordinator, userRoles.rider].map(
        (role) => {
            const assignmentsUnsorted = props.assignees.filter(
                (a) => a.role === role
            );
            const assignments = sortByCreatedTime(
                assignmentsUnsorted,
                "oldest"
            );
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
                        {assignments.map((assignment: models.TaskAssignee) => {
                            const user = assignment.assignee || null;
                            return (
                                <Grid key={assignment.id} item>
                                    <UserChip
                                        showResponsibility={
                                            role === userRoles.rider
                                        }
                                        disabled={props.disabled}
                                        user={user}
                                        onDelete={() =>
                                            handleRemove(assignment)
                                        }
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                    <Divider />
                </>
            );
        }
    );
    return (
        <>
            {confirmationSelfDeleteDialog}
            {mappedAssigneeContents}
        </>
    );
};

TaskAssignees.defaultProps = {
    assignees: [],
    onRemove: () => {},
    disabled: false,
};

export default TaskAssignees;
