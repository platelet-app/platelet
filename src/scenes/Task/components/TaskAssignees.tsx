import React from "react";
import Typography from "@mui/material/Typography";
import { Divider, Grid, Stack, Switch } from "@mui/material";
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
    onChangeRiderUsingOwnVehicle?: () => void;
    usingOwnVehicle?: boolean;
    disableUsingOwnVehicleSwitch?: boolean;
};

const TaskAssignees: React.FC<TaskAssigneesProps> = ({
    assignees,
    onRemove = () => {},
    disabled = false,
    onChangeRiderUsingOwnVehicle = () => {},
    usingOwnVehicle = false,
    disableUsingOwnVehicleSwitch = false,
}) => {
    const whoami = useSelector(getWhoami);
    const [confirmRemoveId, setConfirmRemoveId] = React.useState<string | null>(
        null
    );
    const handleRemove = (assignment: models.TaskAssignee) => {
        if (onRemove) {
            if (assignment.assignee?.id === whoami.id) {
                setConfirmRemoveId(assignment.id);
            } else {
                onRemove(assignment.id);
            }
        }
    };

    const hasRiders = assignees.some((a) => a.role === userRoles.rider);

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

    const mappedAssigneeContents = [userRoles.coordinator, userRoles.rider].map(
        (role) => {
            const assignmentsUnsorted = assignees.filter(
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
                                        disabled={disabled}
                                        user={user}
                                        onDelete={() =>
                                            handleRemove(assignment)
                                        }
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                    {hasRiders && role === userRoles.rider && (
                        <Grid
                            container
                            alignItems="center"
                            direction="row"
                            spacing={1}
                        >
                            <Grid item>
                                <Typography
                                    sx={{
                                        cursor: disableUsingOwnVehicleSwitch
                                            ? "default"
                                            : "pointer",
                                    }}
                                    onClick={onChangeRiderUsingOwnVehicle}
                                >
                                    Using own vehicle?
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Switch
                                    inputProps={{
                                        "aria-label":
                                            "rider using own vehicle?",
                                    }}
                                    disabled={disableUsingOwnVehicleSwitch}
                                    onChange={onChangeRiderUsingOwnVehicle}
                                    checked={usingOwnVehicle}
                                />
                            </Grid>
                        </Grid>
                    )}
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

export default TaskAssignees;
