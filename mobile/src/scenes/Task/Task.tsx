import { SafeAreaView } from "react-native";
import TaskDetails from "./components/TaskDetails";

type TaskProps = {
    route: any;
};

const Task: React.FC<TaskProps> = ({ route }) => {
    const { taskId } = route.params;
    return (
        <SafeAreaView style={{ padding: 8 }}>
            <TaskDetails taskId={taskId} />
        </SafeAreaView>
    );
};

export default Task;
