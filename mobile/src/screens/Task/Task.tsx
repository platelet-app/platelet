import { ScrollView } from "react-native";
import NotFound from "../Errors/NotFound";
import * as React from "react";
import * as models from "../../models";
import useModelSubscription from "../../hooks/useModelSubscription";
import TaskActions from "./components/TaskActions";
import TaskDetails from "./components/TaskDetails";
import TaskLocationDetail from "./components/TaskLocationDetail";
import taskStatusHumanReadable from "../../utilities/taskStatusHumanReadable";
import TaskInventoryDetail from "./components/TaskInventoryDetail";
import TaskAssigneesDetail from "./components/TaskAssigneesDetail";
import GenericError from "../Errors/GenericError";
import CommentsSection from "../../components/CommentsSection";

type TaskProps = {
    route: any;
    navigation: any;
};

const Task: React.FC<TaskProps> = ({ route, navigation }) => {
    const { taskId } = route.params;
    const { state, isFetching, error, notFound } =
        useModelSubscription<models.Task>(models.Task, taskId);
    const [pickUpLocationId, setPickUpLocationId] = React.useState<
        string | null
    >(null);
    const [dropOffLocationId, setDropOffLocationId] = React.useState<
        string | null
    >(null);

    React.useEffect(() => {
        const label = taskStatusHumanReadable(
            state?.status as models.TaskStatus
        );
        navigation.setOptions({
            title: label || "",
        });
    }, [state?.status, navigation]);

    const resolveLocations = React.useCallback(async () => {
        if (state?.pickUpLocation) {
            const result = await state?.pickUpLocation;
            if (result) setPickUpLocationId(result.id);
        }
        if (state?.dropOffLocation) {
            const result = await state?.dropOffLocation;
            if (result) setDropOffLocationId(result.id);
        }
    }, [state]);

    React.useEffect(() => {
        resolveLocations();
    }, [resolveLocations]);

    if (error) {
        return <GenericError />;
    } else if (notFound) {
        return <NotFound />;
    } else {
        return (
            <ScrollView contentContainerStyle={{ padding: 8, gap: 8 }}>
                <TaskDetails taskId={taskId} />
                <TaskActions taskId={taskId} />
                <TaskLocationDetail
                    locationId={pickUpLocationId}
                    title="Collect from"
                />
                <TaskLocationDetail
                    locationId={dropOffLocationId}
                    title="Deliver to"
                />
                <TaskInventoryDetail taskId={taskId} />
                <TaskAssigneesDetail taskId={taskId} />
                <CommentsSection parentId={taskId} />
            </ScrollView>
        );
    }
};

export default Task;
