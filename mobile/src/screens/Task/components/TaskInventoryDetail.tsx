import { Card, Text, useTheme } from "react-native-paper";
import { View } from "react-native";
import useTaskDeliverables from "../../../hooks/useTaskDeliverables";
import DividerWithBottomMargin from "../../../components/DividerWithBottomMargin";
import GenericError from "../../Errors/GenericError";
import ContentLoader, { Rect } from "react-content-loader/native";

type TaskInventoryDetailProps = {
    taskId: string;
};

const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <Card>
            <Card.Title title="Inventory" />
            <DividerWithBottomMargin />
            <Card.Content>{children}</Card.Content>
        </Card>
    );
};

const TaskInventoryDetail: React.FC<TaskInventoryDetailProps> = ({
    taskId,
}) => {
    const { state, isFetching, error } = useTaskDeliverables(taskId);
    const { colors } = useTheme();
    if (error) {
        return (
            <CardWrapper>
                <GenericError />
            </CardWrapper>
        );
    } else if (isFetching) {
        return (
            <CardWrapper>
                <ContentLoader
                    testID="task-inventory-skeleton"
                    speed={2}
                    width="100%"
                    height={60}
                    viewBox="0 0 400 60"
                    backgroundColor={colors.shimmerBackground}
                    foregroundColor={colors.shimmerForeground}
                >
                    <Rect x="0" y="0" rx="0" ry="0" width="400" height="20" />
                    <Rect x="0" y="22" rx="0" ry="0" width="400" height="20" />
                </ContentLoader>
            </CardWrapper>
        );
    } else {
        return (
            <CardWrapper>
                {state.map((deliverable) => {
                    const text = `${deliverable.count} x ${deliverable.unit}`;
                    return (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                            key={deliverable.id}
                        >
                            <Text>{deliverable.deliverableType?.label}</Text>
                            <Text>{text}</Text>
                        </View>
                    );
                })}
            </CardWrapper>
        );
    }
};

export default TaskInventoryDetail;
