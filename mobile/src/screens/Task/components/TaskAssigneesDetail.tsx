import { Card } from "react-native-paper";
import DividerWithBottomMargin from "../../../components/DividerWithBottomMargin";
import UserChip from "../../../components/UserChip";
import useTaskAssignees from "../../../hooks/useTaskAssignees";

type TaskAssigneesDetailProps = {
    taskId: string;
};

const TaskAssigneesDetail: React.FC<TaskAssigneesDetailProps> = ({
    taskId,
}) => {
    const { state, isFetching, error } = useTaskAssignees(taskId);

    return (
        <Card>
            <Card.Title title="Assignees" />
            <DividerWithBottomMargin />
            <Card.Content style={{ flexDirection: "row", gap: 8 }}>
                {state.map((a) => (
                    <UserChip key={a.id} user={a.assignee} />
                ))}
            </Card.Content>
        </Card>
    );
};

export default TaskAssigneesDetail;
