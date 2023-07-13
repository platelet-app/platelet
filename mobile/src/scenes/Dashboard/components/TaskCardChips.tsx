import * as models from "../../../models";
import { StyleSheet, View } from "react-native";
//import * as APITypes from "../API";
import TaskStatusChip from "./TaskStatusChip";
import DeliverableChip from "./DeliverableChip";
//import UserChip from "./UserChip";
import PriorityChip from "./PriorityChip";
import { Chip, List } from "react-native-paper";

type ResolvedDeliverable = models.Deliverable & {
    deliverableType: models.DeliverableType;
};

type TaskCardChipsProps = {
    assignees?: (models.TaskAssignee | null)[];
    status?: models.TaskStatus | null;
    deliverables?: (ResolvedDeliverable | null)[];
    riderResponsibility?: string | null;
    // don't know why I need to write them out individually for TaskCard to not complain
    priority?: models.Priority | "HIGH" | "MEDIUM" | "LOW" | null;
    limit?: number;
    showDeliverableIcons?: boolean;
};

const TaskCardChips: React.FC<TaskCardChipsProps> = ({
    assignees,
    status,
    deliverables,
    riderResponsibility,
    priority,
    limit,
    showDeliverableIcons = false,
}) => {
    let chips = [];
    if (status) {
        chips.push(
            <TaskStatusChip
                style={styles.chip}
                size="small"
                status={status}
                key={status}
            />
        );
    }
    if (priority) {
        chips.push(
            <PriorityChip
                style={styles.chip}
                size="small"
                priority={priority}
                key={priority}
            />
        );
    }
    if (riderResponsibility) {
        chips.push(
            <Chip style={styles.chip} key={riderResponsibility}>
                {riderResponsibility}
            </Chip>
        );
    }
    let assigneeChips: React.ReactElement[] = [];
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
                        style={styles.chip}
                        showIcon={showDeliverableIcons}
                        deliverable={deliverable}
                        key={deliverable.id}
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
        chips.push(<Chip>...</Chip>);
    }

    return (
        <List.Section>
            <View style={styles.row}>{chips.map((chip) => chip)}</View>
        </List.Section>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    chip: {
        margin: 2,
    },
});

export default TaskCardChips;
