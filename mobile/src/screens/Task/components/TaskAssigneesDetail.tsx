import ContentLoader, { Rect } from "react-content-loader/native";
import { Card, useTheme } from "react-native-paper";
import DividerWithBottomMargin from "../../../components/DividerWithBottomMargin";
import UserChip from "../../../components/UserChip";
import useTaskAssignees from "../../../hooks/useTaskAssignees";
import GenericError from "../../Errors/GenericError";

type TaskAssigneesDetailProps = {
    taskId: string;
};

const TaskAssigneesDetail: React.FC<TaskAssigneesDetailProps> = ({
    taskId,
}) => {
    const { state, isFetching, error } = useTaskAssignees(taskId);
    const { colors } = useTheme();
    if (error) {
        return <GenericError />;
    } else if (isFetching) {
        return (
            <ContentLoader
                testID="task-assignees-skeleton"
                speed={2}
                width="100%"
                height={300}
                viewBox="0 0 400 300"
                backgroundColor={colors.shimmerBackground}
                foregroundColor={colors.shimmerForeground}
            >
                <Rect x="0" y="0" rx="0" ry="0" width="400" height="100" />
            </ContentLoader>
        );
    } else {
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
    }
};

export default TaskAssigneesDetail;
