import * as models from "../models";
import * as APITypes from "../API";
import { Chip, Grid, Tooltip } from "@mui/material";
import TaskStatusChip from "./TaskStatusChip";
import DeliverableChip from "./DeliverableChip";
import UserChip from "./UserChip";
import PriorityChip from "./PriorityChip";

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
};

const TaskCardChips: React.FC<TaskCardChipsProps> = ({
    assignees,
    status,
    deliverables,
    riderResponsibility,
    priority,
    limit,
}) => {
    let chips = [];
    if (status) {
        chips.push(<TaskStatusChip size="small" status={status} />);
    }
    if (priority) {
        chips.push(<PriorityChip size="small" priority={priority} />);
    }
    if (riderResponsibility) {
        chips.push(<Chip size="small" label={riderResponsibility} />);
    }
    let assigneeChips: React.ReactElement[] = [];
    if (assignees) {
        assigneeChips = assignees.map((assignment) => {
            if (assignment?.assignee) {
                return <UserChip size="small" user={assignment?.assignee} />;
            } else {
                return <></>;
            }
        });
    }
    let deliverableChips: React.ReactElement[] = [];
    if (deliverables) {
        deliverableChips = deliverables.map((deliverable) => {
            if (deliverable) {
                return <DeliverableChip deliverable={deliverable} />;
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
