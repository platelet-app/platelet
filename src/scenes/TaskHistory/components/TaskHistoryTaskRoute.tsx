import { useParams } from "react-router";
import { decodeUUID } from "../../../utilities";
import TaskHistoryTaskDialog from "./TaskHistoryTaskDialog";

const TaskHistoryTaskRoute: React.FC = () => {
    let { task_uuid_b62 } = useParams() as { task_uuid_b62: string };
    const taskId = decodeUUID(task_uuid_b62);
    console.log(taskId);
    return <TaskHistoryTaskDialog taskId={taskId} />;
};

export default TaskHistoryTaskRoute;
