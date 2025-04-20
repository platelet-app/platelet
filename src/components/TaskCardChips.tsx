import * as models from "../models";
import * as APITypes from "../API";
import { Chip, Grid, Tooltip } from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TaskStatusChip from "./TaskStatusChip";
import DeliverableChip from "./DeliverableChip";
import UserChip from "./UserChip";
import PriorityChip from "./PriorityChip";
import humanReadableScheduleString from "../utilities/humanReadableScheduleString";
import taskScheduleDueStatus from "../utilities/taskScheduleDueStatus";
import taskScheduleOverDueStatus from "../utilities/taskScheduleOverDueStatus";

type TaskCardChipsProps = {
    assignees?:
        | (models.TaskAssignee | null)[]
        | (APITypes.TaskAssignee | null)[];
    status?: models.TaskStatus | APITypes.TaskStatus | null;
    deliverables?:
        | (models.Deliverable | null)[]
        | (APITypes.Deliverable | null)[];
    riderResponsibility?: string | null;
    // don't know why I need to write them out individually for TaskCard to not complain
    priority?:
        | models.Priority
        | APITypes.Priority
        | "HIGH"
        | "MEDIUM"
        | "LOW"
        | null;
    limit?: number;
    showDeliverableIcons?: boolean;
    pickUpSchedule?: models.Schedule | APITypes.Schedule | null;
    dropOffSchedule?: models.Schedule | APITypes.Schedule | null;
    hideStatus?: boolean;
};

const styling = {
    cursor: "pointer",
    maxWidth: 150,
};

const TaskCardChips: React.FC<TaskCardChipsProps> = ({
    assignees,
    status,
    deliverables,
    riderResponsibility,
    priority,
    limit,
    pickUpSchedule,
    dropOffSchedule,
    showDeliverableIcons = false,
    hideStatus = false,
}) => {
    let chips = [];
    if (pickUpSchedule) {
        let shortened = true;
        if (pickUpSchedule.timePrimary) {
            const date = new Date(pickUpSchedule.timePrimary);
            if (date.getDate() !== new Date().getDate()) {
                shortened = false;
            }
        }

        let iconColor = "";
        if (
            [
                models.TaskStatus.NEW,
                models.TaskStatus.FUTURE,
                models.TaskStatus.PENDING,
                models.TaskStatus.ACTIVE,
            ].includes(status as models.TaskStatus)
        ) {
            if (taskScheduleDueStatus(pickUpSchedule, 1)) {
                iconColor = "orange";
            }
            if (taskScheduleOverDueStatus(pickUpSchedule)) {
                iconColor = "red";
            }
        }
        chips.push(
            <Chip
                sx={{
                    ...styling,
                    "& .MuiChip-icon": {
                        color: iconColor,
                    },
                }}
                size="small"
                label={humanReadableScheduleString(pickUpSchedule, shortened)}
                icon={<ScheduleIcon />}
            />
        );
    }
    if (dropOffSchedule) {
        let shortened = true;
        if (dropOffSchedule.timePrimary) {
            const date = new Date(dropOffSchedule.timePrimary);
            if (date.getDate() !== new Date().getDate()) {
                shortened = false;
            }
        }
        let iconColor = "";
        if (
            [
                models.TaskStatus.NEW,
                models.TaskStatus.PENDING,
                models.TaskStatus.FUTURE,
                models.TaskStatus.ACTIVE,
                models.TaskStatus.PICKED_UP,
            ].includes(status as models.TaskStatus)
        ) {
            if (taskScheduleDueStatus(dropOffSchedule, 1)) {
                iconColor = "orange";
            }
            if (taskScheduleOverDueStatus(dropOffSchedule)) {
                iconColor = "red";
            }
        }
        chips.push(
            <Chip
                sx={{
                    ...styling,
                    "& .MuiChip-icon": {
                        color: iconColor,
                    },
                }}
                size="small"
                label={humanReadableScheduleString(dropOffSchedule, shortened)}
                icon={<ScheduleIcon />}
            />
        );
    }
    if (!hideStatus && status) {
        chips.push(
            <TaskStatusChip sx={styling} size="small" status={status} />
        );
    }
    if (priority) {
        chips.push(
            <PriorityChip sx={styling} size="small" priority={priority} />
        );
    }
    if (riderResponsibility) {
        chips.push(
            <Chip sx={styling} size="small" label={riderResponsibility} />
        );
    }
    let assigneeChips: React.ReactElement[] = [];
    if (assignees) {
        assigneeChips = assignees.map((assignment) => {
            if (assignment?.assignee) {
                return (
                    <UserChip
                        sx={styling}
                        size="small"
                        user={assignment?.assignee}
                    />
                );
            } else {
                return <></>;
            }
        });
    }
    let deliverableChips: React.ReactElement[] = [];
    if (deliverables) {
        const sorted = deliverables.sort((a, b) => {
            return `${a?.deliverableType?.label} x ${b?.count}`.localeCompare(
                `${b?.deliverableType?.label} x ${a?.count}`
            );
        });
        deliverableChips = sorted.map((deliverable) => {
            if (deliverable) {
                return (
                    <DeliverableChip
                        sx={styling}
                        showIcon={showDeliverableIcons}
                        deliverable={deliverable}
                    />
                );
            } else {
                return <></>;
            }
        });
    }

    chips = [...chips, ...assigneeChips, ...deliverableChips];

    if (limit && chips.length > limit) {
        const moreChips = chips.length - limit;
        chips = chips.slice(0, limit);
        chips.push(
            <Tooltip title={`${moreChips} more`} placement="top">
                <Chip size="small" label="..." />
            </Tooltip>
        );
    }

    return (
        <Grid direction="row" container spacing={1}>
            {chips.map((chip, index) => (
                <Grid key={index} item>
                    {chip}
                </Grid>
            ))}
        </Grid>
    );
};

export default TaskCardChips;
