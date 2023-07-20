import { SafeAreaView } from "react-native";
import TaskActions from "./components/TaskActions";
import TaskDetails from "./components/TaskDetails";

type TaskProps = {
    route: any;
};

const Task: React.FC<TaskProps> = ({ route }) => {
    const { taskId } = route.params;
    return (
        <SafeAreaView style={{ padding: 8, gap: 8 }}>
            <TaskDetails taskId={taskId} />
            <TaskActions taskId={taskId} />
        </SafeAreaView>
    );
};

export default Task;
