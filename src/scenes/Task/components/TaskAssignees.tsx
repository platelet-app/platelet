import React from "react";
import Typography from "@mui/material/Typography";
import { Divider, Grid, Stack } from "@mui/material";
import UserChip from "../../../components/UserChip";
import { sortByCreatedTime } from "../../../utilities";
import { getWhoami } from "../../../redux/Selectors";
import { useSelector } from "react-redux";
import * as models from "../../../models";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { ResolvedTaskAssignee } from "../../../resolved-models";

type TaskAssigneesProps = {
    assignees: ResolvedTaskAssignee[];
    onRemove?: (arg0: string) => void;
    disabled?: boolean;
};

const TaskAssignees: React.FC<TaskAssigneesProps> = ({
    assignees,
    onRemove = () => {},
    disabled = false,
}) => {
    const whoami = useSelector(getWhoami);
    const [confirmRemoveId, setConfirmRemoveId] = React.useState<string | null>(
        null
    );
    const handleRemove = async (assignment: ResolvedTaskAssignee) => {
        const assignee = assignment.assignee;
        if (assignee && onRemove) {
            if (assignee.id === whoami.id) {
                setConfirmRemoveId(assignment.id);
            } else {
                onRemove(assignment.id);
            }
        }
    };

    const confirmationSelfDeleteDialog = (
        <ConfirmationDialog
            dialogTitle="Are you sure you want to unassign yourself?"
            onCancel={() => setConfirmRemoveId(null)}
            open={!!confirmRemoveId}
            onConfirmation={() => {
                if (onRemove && confirmRemoveId) onRemove(confirmRemoveId);
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

    const mappedAssigneeContents = [
        models.Role.COORDINATOR,
        models.Role.RIDER,
    ].map((role) => {
        const assignmentsUnsorted = assignees.filter((a) => a.role === role);
        const assignments = sortByCreatedTime(assignmentsUnsorted, "oldest");
        const message = assignments.length === 0 ? "No one assigned" : "";
        const label =
            role === models.Role.COORDINATOR ? "Coordinators:" : "Riders:";
        return (
            <div key={role}>
                <Grid
                    container
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
                    {assignments.map((assignment: ResolvedTaskAssignee) => {
                        const user = assignment.assignee || null;
                        return (
                            <Grid key={assignment.id} item>
                                <UserChip
                                    showResponsibility={
                                        role === models.Role.RIDER
                                    }
                                    disabled={disabled}
                                    user={user}
                                    onDelete={() => handleRemove(assignment)}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
                <Divider />
            </div>
        );
    });
    return (
        <>
            {confirmationSelfDeleteDialog}
            {mappedAssigneeContents}
        </>
    );
};

export default TaskAssignees;
