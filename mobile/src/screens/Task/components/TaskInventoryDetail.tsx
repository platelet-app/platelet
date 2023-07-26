import { Card, Text } from "react-native-paper";
import { View } from "react-native";
import useTaskDeliverables from "../../../hooks/useTaskDeliverables";
import DividerWithBottomMargin from "../../../components/DividerWithBottomMargin";

type TaskInventoryDetailProps = {
    taskId: string;
};

const TaskInventoryDetail: React.FC<TaskInventoryDetailProps> = ({
    taskId,
}) => {
    const { state, isFetching, error } = useTaskDeliverables(taskId);
    return (
        <Card>
            <Card.Title title="Inventory" />
            <DividerWithBottomMargin />
            <Card.Content>
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
            </Card.Content>
        </Card>
    );
};

export default TaskInventoryDetail;
