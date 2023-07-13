import { View, Text } from "react-native";

type TaskProps = {
    route: any;
    navigation: any;
};

const Task: React.FC<TaskProps> = ({ route, navigation }) => {
    const { taskId } = route.params;
    return (
        <View>
            <Text>Task {taskId}</Text>
        </View>
    );
};

export default Task;
